/** galgame 风格对话框：打字机、点击推进、选择支 */

const NAMES = { holo: '赫萝', me: '我', nar: '' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class Dialogue {
  constructor() {
    this.root = document.getElementById('dlg');
    this.nameEl = document.getElementById('dlgName');
    this.textEl = document.getElementById('dlgText');
    this.arrow = document.getElementById('dlgArrow');
    this.choicesEl = document.getElementById('choices');
    this.typing = false;
    this.skip = false;
    this.resolveNext = null;
    this.locked = false;

    const advance = () => {
      if (this.locked) return;
      if (this.typing) {
        this.skip = true;
        return;
      }
      if (this.resolveNext) {
        const r = this.resolveNext;
        this.resolveNext = null;
        r();
      }
    };
    this._advance = advance;

    // 点画面任意空白处都能推进（和点对话框等价）。
    // 按钮、选择支、结局遮罩自带点击行为，交给它们自己处理。
    window.addEventListener('pointerdown', (e) => {
      const t = e.target;
      if (t && t.closest && t.closest('button, .choice, a, input, textarea, #endNote')) return;
      advance();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advance();
      }
    });
  }

  show() {
    this.root.classList.add('on');
  }

  /** 设置姓名牌；传 null 表示旁白（不显示姓名牌） */
  setSpeaker(who) {
    this.nameEl.textContent = who ? (NAMES[who] ?? '') : '';
    this.nameEl.style.opacity = who ? 1 : 0;
  }

  hide() {
    this.root.classList.remove('on');
    this.choicesEl.classList.remove('on');
  }

  clear() {
    this.textEl.textContent = '';
    this.arrow.classList.remove('on');
  }

  /** 逐字显示一句，返回"点击继续"的 Promise */
  async say(who, text) {
    this.show();
    this.root.dataset.who = who;
    this.nameEl.textContent = NAMES[who] ?? '';
    this.nameEl.style.opacity = NAMES[who] ? 1 : 0;
    this.textEl.classList.toggle('narration', who === 'nar');
    this.textEl.textContent = '';
    this.arrow.classList.remove('on');
    this.typing = true;
    this.skip = false;

    // 先渲染出前两个字，避免空帧
    let i = 0;
    const speed = 24;
    while (i < text.length) {
      if (this.skip) break;
      i += 1;
      this.textEl.textContent = text.slice(0, i);
      // 标点处稍微停顿
      const ch = text[i - 1];
      const extra = '，、'.includes(ch) ? 90 : '。！？…'.includes(ch) ? 160 : 0;
      await sleep(speed + extra);
    }
    this.textEl.textContent = text;

    // 让浏览器把最后一帧画出来
    await new Promise((r) => requestAnimationFrame(r));
    this.typing = false;
    this.skip = false;
    this.arrow.classList.add('on');
    await new Promise((r) => {
      this.resolveNext = r;
    });
    this.arrow.classList.remove('on');
  }

  /** 选择支，返回选中项的下标 */
  async ask(options) {
    this.arrow.classList.remove('on');
    this.choicesEl.innerHTML = '';
    this.choicesEl.classList.add('on');
    return new Promise((resolve) => {
      options.forEach((label, i) => {
        const b = document.createElement('button');
        b.className = 'choice';
        b.textContent = label;
        b.style.animationDelay = `${i * 70}ms`;
        b.addEventListener('pointerdown', (e) => e.stopPropagation());
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          this.choicesEl.classList.remove('on');
          this.choicesEl.innerHTML = '';
          resolve(i);
        });
        this.choicesEl.appendChild(b);
      });
    });
  }

  /** 旁白式提示（不影响主流程） */
  flash(text, ms = 2600) {
    const el = document.getElementById('flash');
    el.textContent = text;
    el.classList.add('on');
    clearTimeout(this._ft);
    this._ft = setTimeout(() => el.classList.remove('on'), ms);
  }
}
