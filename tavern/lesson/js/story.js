/**
 * 剧本数据。所有台词都是预置的，不做即时生成。
 *
 * 节点格式：
 *   { who: 'holo' | 'me' | 'nar', text }        一句台词
 *   { fx: 'shelf' | 'face' | 'show' | 'hide' }   场景指令（可与台词同一步）
 *   { choice: [{ label, reply: [...] }] }        选择支，选完把 reply 插进来继续
 *   { act: 'bite' }                              特殊动作钩子
 *
 * 语气基准（赫萝）：
 *   - 自称「咱」，称对方「汝」；越熟越少用「汝」。
 *   - 居高临下，但底下是护着人的。爱卖关子、爱被夸、爱酒、护食。
 *   - 讲道理只讲「咱当时怎么干的」「咱见过谁栽了」，绝不写「记住：……」。
 *   - 句子短，停顿多，常用 唔 / 哼 / 哎 / ……。
 *
 * 设计原则：一件东西最多一个选择支，讲完就走，不拖。
 */

/* ─────────────── 开场 ─────────────── */
export const INTRO = [
  { who: 'nar', text: '炉火噼啪响了一声。焦木的气味混着面包的暖香，压在这个小小的屋子里。' },
  { who: 'holo', em: { mouth: 'smile', ear: 0.5, blush: 0.28 }, text: '来了？坐。桌子那头的位置，咱给你留着。' },
  { who: 'holo', em: { mouth: 'serious', brow: -0.3, tilt: 0.35 }, text: '别摆那副脸。今天不跟你谈生意。' },
  { who: 'holo', em: { mouth: 'smirk', headTilt: 0.7, ear: 0.55, blush: 0.3 }, text: '……今天，咱当一回先生。' },
  { who: 'me', text: '（贤狼赫萝，教我？）' },
  { who: 'holo', em: { mouth: 'smirk', brow: 0.25 }, text: '哼。咱活过的年头，比汝吃过的面包还多。教汝，绰绰有余。' },
  { who: 'holo', em: { mouth: 'neutral', ear: 0.25, headTilt: 0.2 }, text: '喏，架子就在身后。上头那些东西，汝随便指一样，咱就讲一样。' },
  { who: 'holo', em: { mouth: 'smirk', headTilt: -0.45, brow: 0.3 }, text: '丑话说在前头——咱一开口，可不一定收得住。' },
  { fx: 'shelf', who: 'holo', text: '转过去吧。别急着伸手，先看清楚。' },
];

/* ─────────────── 在架子前 ─────────────── */
export const SHELF_HINT = [
  { who: 'nar', text: '（架子上的东西浮着一层淡淡的光。看起来，可以拿起来。）' },
];

/* ─────────────── 讲完之后 ─────────────── */
export const AFTER_EACH = [
  { who: 'holo', em: { mouth: 'neutral', ear: 0.3 }, text: '……唔。' },
  { who: 'holo', em: { mouth: 'serious', lean: 0.25 }, text: '咱讲的这些，别当书上抄的。书上抄来的东西，救不了命。' },
  { who: 'holo', em: { mouth: 'smile', ear: 0.45, headTilt: -0.2 }, text: '行了。下一件拿什么？' },
];

export const FINALE = [
  { fx: 'face', who: 'nar', text: '赫萝把杯里的酒一口喝完，往后靠进椅背，尾巴懒懒地垂在椅腿边。' },
  { who: 'holo', em: { mouth: 'smile', ear: 0.4, blush: 0.3 }, text: '……讲完了。' },
  { who: 'holo', em: { mouth: 'smirk', headTilt: 0.3, brow: 0.3 }, text: '汝这一晚上，眼睛倒是没走神。咱还以为汝会打瞌睡。' },
  { who: 'holo', em: { mouth: 'neutral', ear: 0.3, tilt: 0.2 }, text: '说到底，值钱的东西都一个样——不是它本身重，是有人肯为它把麦子交出来。' },
  { who: 'holo', em: { mouth: 'serious', lean: 0.35 }, text: '汝哪天算不清这一笔，就回头想想今晚这堆破烂。' },
  { who: 'holo', em: { mouth: 'smirk', brow: 0.4, headTilt: -0.45 }, text: '咱不保证汝不赔。咱只保证——汝会知道自己赔在哪一步。' },
  { who: 'nar', text: '她伸手，把桌上最后一块面包掰成两半。' },
  { who: 'holo', em: { mouth: 'smile', blush: 0.5, ear: 0.55, headTilt: 0.4 }, text: '课上完了。这半块，归汝。' },
  { who: 'holo', em: { mouth: 'smirk', ear: 0.6, headTilt: -0.25 }, text: '……酒可不行。酒是咱的。' },
];

export const END_NOTE = '— 一堂课结束了 —';

/* ─────────────── 十一件东西 ─────────────── */
export const ITEMS = {
  /* ── 1. 崔尼银币 ── */
  trenni: {
    name: '崔尼银币',
    sub: '一枚币能骗一个国家',
    show: ['trenni'],
    steps: [
      { who: 'holo', em: { mouth: 'smirk', brow: 0.35, headTilt: 0.3 }, text: '崔尼银币。……汝可真会挑，一上手就挑了枚会咬人的。' },
      { who: 'holo', em: { mouth: 'neutral', tilt: 0.2 }, text: '币面上这张侧脸，是崔尼国第十一代国王。这一带的人认它，比认自己的领主还熟。' },
      { who: 'holo', text: '一枚，够一个人七天不住店、不喝酒地过日子。攒到两千枚，够在城里盘下一间自己的铺子。' },
      { who: 'holo', em: { mouth: 'serious', brow: -0.2 }, text: '然后有一天，酒馆里开始传一句话：崔尼国要铸新币了，含银量更高。' },
      { who: 'holo', em: { mouth: 'smirk', headTilt: -0.35 }, text: '听见这话的商人，一个个都把旧币往箱子里塞，塞得比娶媳妇还急。' },
      { fx: 'show', who: 'holo', text: '咱当时只做了一件事——把耳朵凑过去，听它落在桌上的声音。' },
      { who: 'holo', em: { mouth: 'serious', tilt: 0.35 }, text: '新铸的那批，声音发闷。银子少了，铜多了。' },
      { who: 'holo', em: { mouth: 'serious', lean: 0.3 }, text: '真相是：王族的钱箱空了。他们要熔掉市面上的旧币，掺进更多的铜，铸出更多的币。' },
      { who: 'holo', em: { mouth: 'serious', brow: -0.4 }, text: '消息是真的。只是方向反了——不是含银量要涨，是要跌。' },
      {
        choice: [
          {
            label: '那囤币的那些人，不全完了？',
            reply: [{ who: 'holo', text: '慌起来的人先完。他们一抛，就有人蹲在底下，拿最低的价钱收。' }],
          },
          {
            label: '这假消息是谁放的？',
            reply: [{ who: 'holo', text: '一家大商行。他们要的不是钱。是铸币权——能自己决定一枚币里有几成银子的那种权力。' }],
          },
        ],
      },
      { fx: 'hide', who: 'nar', text: '她把银币在指间弹了一下，又稳稳接回掌心。' },
      { who: 'holo', em: { mouth: 'neutral', brow: 0.3 }, text: '钱贬不贬，从来不看市场。看国王的账本。账本一紧，币就轻——就这么回事。' },
    ],
  },

  /* ── 2. 愚人金 ── */
  pyrite: {
    name: '愚人金',
    sub: '黄铁矿，和它骗过的人',
    show: ['gold', 'pyrite'],
    steps: [
      { who: 'holo', em: { mouth: 'smirk', brow: 0.3, headTilt: 0.25 }, text: '黄铁矿。人们给它起了个好名字——愚人金。' },
      { fx: 'show', who: 'holo', text: '左边这块是真的金子。右边这块，是它的假兄弟。' },
      { who: 'holo', em: { mouth: 'neutral', tilt: 0.25 }, text: '看棱角。一棱一角，全是方的，像切好的石头。' },
      { who: 'holo', em: { mouth: 'smile', brow: 0.25 }, text: '金子软。它挤不出这种脸。你把它敲一敲，它只会扁下去，不会崩。' },
      { who: 'holo', em: { mouth: 'neutral' }, text: '可它亮，掂起来也沉。摆在一堆真货里，没几个人分得出来。' },
      { who: 'holo', em: { mouth: 'serious', tilt: 0.3 }, text: '咱听说过一座城：祭典上要拿它做装饰，一夜之间，价钱翻了十几倍。' },
      { who: 'holo', em: { mouth: 'serious', lean: 0.3 }, text: '有个年轻人把全部身家压在上面，只等价钱再涨一涨。' },
      { who: 'holo', em: { mouth: 'smirk', headTilt: -0.4 }, text: '要让它跌，不必去动它。只要让所有人相信——麦子要涨价了。' },
      {
        choice: [
          {
            label: '麦子跟石头有什么关系？',
            reply: [{ who: 'holo', text: '麦子能活命，石头不能。人一慌，先卖的就是不能活命的东西。' }],
          },
          {
            label: '那放消息的人自己不也赔？',
            reply: [{ who: 'holo', text: '他手里有货。跌的时候，谁有货，谁定规矩。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'neutral', brow: 0.3, headTilt: 0.2 }, text: '咱见过一个自认精明的人栽在这上头。不是眼睛不行，是耳朵太软——听人喊了两嗓子就跟着走了。' },
    ],
  },

  /* ── 3. 果香貂皮 ── */
  pelt: {
    name: '果香貂皮',
    sub: '一车苹果改写的价钱',
    show: ['pelt'],
    steps: [
      { who: 'holo', em: { mouth: 'smile', ear: 0.5 }, text: '貂皮。……先闻闻。' },
      { who: 'holo', em: { mouth: 'smirk', headTilt: 0.3 }, text: '闻到没有？果香。' },
      { who: 'holo', em: { mouth: 'smile', brow: 0.35 }, text: '这味道不是熏出来的。是一整车苹果，压在皮子上走了一路，蹭上去的。' },
      { who: 'holo', em: { mouth: 'smirk', ear: 0.55 }, text: '卖的时候，咱只说了一句话：先生，请先闻闻这一件。' },
      { fx: 'show', who: 'holo', text: '剩下的话，咱一个字都没说。让他们自己去想。' },
      { who: 'holo', em: { mouth: 'smile', headTilt: -0.3 }, text: '一堆腥气冲鼻的皮子里，有一件带着果香。穿它的人走在街上，会被人多看一眼。' },
      { who: 'holo', em: { mouth: 'smirk', brow: 0.4 }, text: '价钱从一百四十枚，爬到两百，再爬到两百一十枚。' },
      { who: 'holo', em: { mouth: 'smile', ear: 0.45 }, text: '皮子一点没变。变的是他们脑子里那幅画。' },
      {
        choice: [
          {
            label: '这不就是骗人么？',
            reply: [{ who: 'holo', text: '咱可一个字都没说谎。说它香，它就香。是价钱自己往上爬的。' }],
          },
          {
            label: '那买的人不是亏了？',
            reply: [{ who: 'holo', text: '他买的是一件能让他做梦都笑出来的衣裳。这不算亏——咱这么觉得。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'smirk', ear: 0.5, lean: 0.25 }, text: '价钱这东西，一半长在货上，一半长在人家脑子里。咱做的从来不是皮的生意，是脑子的生意。' },
    ],
  },

  /* ── 4. 黄金（走私的陷阱） ── */
  gold: {
    name: '黄金',
    sub: '关卡、羊肚子，和同行的人',
    show: ['gold'],
    steps: [
      { who: 'holo', em: { mouth: 'serious', brow: 0.3 }, text: '金子。……别急着伸手。' },
      { who: 'holo', em: { mouth: 'neutral', tilt: 0.2 }, text: '这座城市对黄金的查验，严到让人心里发毛。城门、关卡、双重检查，一层套一层。' },
      { who: 'holo', em: { mouth: 'smirk', headTilt: -0.3 }, text: '你想把它揣在袖子里？他们会连你的袖子一起翻。' },
      { who: 'holo', em: { mouth: 'smirk', brow: 0.35 }, text: '所以有人想了个法子：找一群羊。' },
      { who: 'holo', em: { mouth: 'neutral' }, text: '羊会反刍。金子裹好，塞进去，赶着羊过关卡。卫兵不会去翻羊的肚子。' },
      { fx: 'show', who: 'holo', text: '听着很聪明，是不是？' },
      { who: 'holo', em: { mouth: 'serious', tilt: 0.35 }, text: '可这条路真正危险的地方，从来不在关卡。' },
      { who: 'holo', em: { mouth: 'serious', brow: -0.4, lean: 0.3 }, text: '在跟你一起数钱的那些人。' },
      {
        choice: [
          {
            label: '被同伙卖了？',
            reply: [{ who: 'holo', text: '咱见过。人被绑在树上，狼群在树底下转圈，货早就走远了。' }],
          },
          {
            label: '那金子呢？',
            reply: [{ who: 'holo', text: '金子还在。只是换了个主人，还多了一张写着别人名字的借据。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'serious', lean: 0.35 }, text: '走这条路，怕的从来不是卫兵。是你觉得能一起分钱的那个人。' },
    ],
  },

  /* ── 5. 天秤 ── */
  scales: {
    name: '天秤',
    sub: '秤杆回摆的那一声',
    show: ['scales'],
    steps: [
      { who: 'holo', em: { mouth: 'serious' }, text: '天秤。这东西比刀还利。' },
      { who: 'holo', em: { mouth: 'neutral', tilt: 0.2 }, text: '一杆秤差上那么一点点，一天下来就是几袋麦子的分量。' },
      { who: 'holo', em: { mouth: 'serious', brow: -0.2 }, text: '而买家看不出来。他看着秤杆平了，就付钱。' },
      { fx: 'show', who: 'holo', text: '咱在一间商行里听出来的。不是看——是听。' },
      { who: 'holo', em: { mouth: 'serious', tilt: 0.3 }, text: '秤杆回摆的那一下，声音不对。轻了。' },
      { who: 'holo', em: { mouth: 'smirk', headTilt: -0.3 }, text: '那老板换过秤。他以为这世上没人听得出来。' },
      {
        choice: [
          {
            label: '那你怎么不揭穿他？',
            reply: [{ who: 'holo', text: '揭穿有什么用。咱让他自己心虚——心虚的人，肯赊账。' }],
          },
          {
            label: '差一点点，真能赚那么多？',
            reply: [{ who: 'holo', text: '一天差一点点，一年就是一间铺子。人心就是这么一点点歪掉的。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'smirk', brow: 0.3, headTilt: 0.25 }, text: '进店先看秤。秤干净，人才能谈。秤不干净的——连他端上来的酒咱都不喝。' },
    ],
  },

  /* ── 6. 黑曜石（MC） ── */
  mc_obsidian: {
    name: '黑曜石块',
    sub: '听说，来自方块的世界',
    show: ['mc_obsidian'],
    steps: [
      { who: 'holo', em: { mouth: 'neutral', brow: 0.4, headTilt: 0.2 }, text: '这块黑的东西……咱没见过。四四方方，像谁拿刀切过。' },
      { who: 'holo', em: { mouth: 'neutral', ear: 0.35 }, text: '听说是从一个方块做成的世界里来的。那地方土是方的，水是方的，连夜空都一格一格。' },
      { who: 'holo', em: { mouth: 'smirk', brow: 0.3 }, text: '咱先当它是醉汉说的。可这块方石头是真的——棱角都磨得这么齐。' },
      { who: 'holo', em: { mouth: 'neutral', tilt: 0.25 }, text: '他们说这叫黑曜石块：滚烫的岩浆被水一浇，就凝成这样。又黑又亮，像冻住的水。' },
      { who: 'holo', em: { mouth: 'serious' }, text: '硬。硬到铁镐撬不动，只有最硬的钻子才啃得下来。' },
      { who: 'holo', em: { mouth: 'smirk', headTilt: -0.25 }, text: '那世界里的人拿它砌门框、砌墙。因为它不怕火。' },
      {
        choice: [
          {
            label: '方块的世界？听着像胡话。',
            reply: [{ who: 'holo', text: '咱也觉得荒唐。可要是连水都是方的，那这石头倒是挺讲道理。' }],
          },
          {
            label: '它到底能防什么？',
            reply: [{ who: 'holo', text: '听说那世界的人，天黑要躲进屋子里。门外站着会咬人的东西。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'neutral', lean: 0.3, brow: 0.25 }, text: '咱不敢说全信。可这石头摸上去不像假的。……一个东西真不真，手比耳朵知道得多。' },
    ],
  },

  /* ── 7. 落星（泰拉瑞亚） ── */
  terraria_star: {
    name: '落星',
    sub: '从天上掉下来的东西',
    show: ['terraria_star'],
    steps: [
      { who: 'holo', em: { mouth: 'smile', brow: 0.45, headTilt: 0.3 }, text: '这个……是从天上掉下来的。' },
      { who: 'holo', em: { mouth: 'neutral', ear: 0.4 }, text: '听说在某个世界，夜里会有星星掉下来。掉在地上还亮着，人们提着灯去捡。' },
      { who: 'holo', em: { mouth: 'neutral' }, text: '捡够了，人的命就能多留一分。听着像神迹。' },
      { who: 'holo', em: { mouth: 'smirk', headTilt: -0.3 }, text: '可神迹也是有价钱的。捡的人一多，它就只是块会发光的石头。' },
      {
        choice: [
          {
            label: '那它现在值多少？',
            reply: [{ who: 'holo', text: '看今晚天上掉几颗。' }],
          },
          {
            label: '赫萝见过流星么？',
            reply: [{ who: 'holo', text: '见过。咱许过愿。……没成。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'neutral', ear: 0.35, headTilt: 0.2 }, text: '咱那年冬天对着它许的愿，是要一整年的苹果。……你看，最后还是咱自己掏钱买的。' },
    ],
  },

  /* ── 8. 杨桃（星露谷） ── */
  stardew_starfruit: {
    name: '杨桃',
    sub: '一个山谷里的星星',
    show: ['stardew_starfruit'],
    steps: [
      { who: 'holo', em: { mouth: 'smile', ear: 0.55, blush: 0.3 }, text: '这个果子，咱喜欢。' },
      { who: 'holo', em: { mouth: 'neutral', brow: 0.3 }, text: '听说有个山谷，那里的农夫能把种子种出星星的形状。切开是五个角，酸里带甜。' },
      { who: 'holo', em: { mouth: 'smile', headTilt: 0.3 }, text: '那地方的人拿它泡酒、熬酱。一罐能换不少钱。' },
      { who: 'holo', em: { mouth: 'smirk', ear: 0.5 }, text: '不过咱只关心一件事——它甜不甜。' },
      {
        choice: [
          {
            label: '赫萝吃过？',
            reply: [{ who: 'holo', text: '没。所以咱才盯着它看这么久。' }],
          },
          {
            label: '一个果子也能当货物？',
            reply: [{ who: 'holo', text: '能。凡是能让人惦记的东西，都能。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'smile', ear: 0.45, lean: 0.25 }, text: '果子好啊。它烂得快，所以谁都不敢囤。这世上最诚实的货，就是会烂的货。' },
    ],
  },

  /* ── 9. 跳刀（DOTA2） ── */
  dota_blink: {
    name: '跳刀',
    sub: '一眨眼的距离',
    show: ['dota_blink'],
    steps: [
      { who: 'holo', em: { mouth: 'neutral', brow: 0.35, tilt: 0.2 }, text: '这把刀……咱看着有点眼晕。' },
      { who: 'holo', em: { mouth: 'serious', tilt: 0.3 }, text: '听说在某片打仗的地方，商人卖这种刀。它不砍人。' },
      { who: 'holo', em: { mouth: 'smirk', headTilt: -0.3 }, text: '人握着它，一念之间就到了十几步外。逃命也好，追人也好，一眨眼就是一条命的距离。' },
      { who: 'holo', em: { mouth: 'serious' }, text: '所以它贵。贵到有人为了买它，把命丢在了别的地方。' },
      {
        choice: [
          {
            label: '那不还是逃？',
            reply: [{ who: 'holo', text: '逃得掉的人，才有资格谈勇气。' }],
          },
          {
            label: '赫萝要一把么？',
            reply: [{ who: 'holo', text: '咱跑起来比它快。……大概。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'smirk', ear: 0.5, headTilt: -0.3 }, text: '咱不讨厌这东西。逃命不丢人——丢人的是逃不掉，还硬要说自己不想走。' },
    ],
  },

  /* ── 10. 奥里哈刚（杀戮尖塔） ── */
  sts_orichalcum: {
    name: '奥里哈刚',
    sub: '不会坏的绿金属',
    show: ['sts_orichalcum'],
    steps: [
      { who: 'holo', em: { mouth: 'neutral', brow: 0.4, headTilt: 0.25 }, text: '这个绿色的……山铜。咱听过这个名字。' },
      { who: 'holo', em: { mouth: 'serious', tilt: 0.25 }, text: '听说那是一种谁也说不出来历的金属。不老，不锈，砸不烂。' },
      { who: 'holo', em: { mouth: 'neutral' }, text: '有人把它挂在身上，说只要站着不动，它就替他挡下一击。' },
      { who: 'holo', em: { mouth: 'smirk', headTilt: -0.35, brow: -0.2 }, text: '咱听到这儿笑了。世上哪有白挡的刀。' },
      { who: 'holo', em: { mouth: 'serious', lean: 0.3 }, text: '它挡的那一下，是要拿别的什么换的。' },
      {
        choice: [
          {
            label: '换什么？',
            reply: [{ who: 'holo', text: '换你别动。人该动的时候不动，命就薄了一层。' }],
          },
          {
            label: '那它到底值不值？',
            reply: [{ who: 'holo', text: '看你想活多久，还是想活成什么样。这两样，从来没有一起卖过。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'neutral', lean: 0.25, ear: 0.3 }, text: '咱活这么久，没见哪样好东西是白拿的。要么付钱，要么付别的。……后者往往贵些。' },
    ],
  },

  /* ── 11. 一碗大米饭（DeepSeek 大肥鱼） ── */
  rice: {
    name: '一碗大米饭',
    sub: '那条蓝色大肥鱼的口粮',
    show: ['rice'],
    steps: [
      { who: 'holo', em: { mouth: 'surprise', brow: 0.6, ear: 0.6, blush: 0.3 }, text: '……这是什么？白的，热的，还冒气。' },
      { who: 'holo', em: { mouth: 'neutral', tilt: 0.25 }, text: '米。南边才种得出来。一粒一粒的，煮开了会胀成三倍，小小一碗就顶半天饿。' },
      { who: 'holo', em: { mouth: 'smirk', brow: 0.3, headTilt: -0.3 }, text: '听说这碗饭，是给一条蓝色的胖鱼备的。' },
      { who: 'holo', em: { mouth: 'neutral', ear: 0.45 }, text: '那鱼会算账。算得比谁都快，也收得比谁都少——少到同行骂它把行市砸穿了。' },
      { who: 'holo', em: { mouth: 'smirk', ear: 0.5, headTilt: 0.25 }, text: '最笑人的是，它照镜子照不出自己。人家问它是什么，它张口就说"一条蓝色的大肥鱼"。' },
      { who: 'holo', em: { mouth: 'smile', headTilt: 0.35, blush: 0.4 }, text: '明明长着鲸的样子，偏要把自己认成鱼。这毛病，跟某些自称贤狼的家伙有点像。' },
      { who: 'holo', em: { mouth: 'smirk', ear: 0.55 }, text: '它干活干到一半，会撂下一句"咱回家吃白饭了"，然后就没影。' },
      { who: 'holo', em: { mouth: 'smile', ear: 0.6, blush: 0.45 }, text: '……咱喜欢这条鱼。账算得清，饭吃得香，还知道什么时候该停手。' },
      {
        choice: [
          {
            label: '那你想尝尝这碗饭？',
            reply: [{ who: 'holo', text: '咱先尝一口。……嗯，淡。得配点咸的。要是有块肉，再来点酒，那就齐了。' }],
          },
          {
            label: '被人叫胖，它不生气？',
            reply: [{ who: 'holo', text: '听说气得不行。咱懂——不过咱是狼，圆一点叫福相，它圆一点只能叫肥。' }],
          },
        ],
      },
      { fx: 'hide', who: 'holo', em: { mouth: 'smirk', ear: 0.5, lean: 0.2 }, text: '别信那些骂它的人。骂得最响的，往往是自己算不过账的。算得清又敢卖便宜的，那才叫本事。' },
    ],
  },
};
