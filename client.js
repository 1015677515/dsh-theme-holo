// Holo (Spice and Wolf) theme — browser half.
//
// Two palettes: 「麦秋晨光」 parchment + wheat gold for the light GUI, and
// 「星夜麦田」 warm ink + wheat gold for the dark one. Component rules below
// stay scoped to `html body:not([data-ds-dark-theme])`; the dark GUI keeps the
// factory component styling and only takes the alias tokens emitted under
// `html body[data-ds-dark-theme]`.
//
// Alias tokens are emitted as CSS custom properties in the same scope, and
// the artwork lives in ./assets served by the host half (index.js) instead
// of being inlined as base64.

window.__ModuleLoader__.load({
  id: 'dsh-theme-holo',
  factory(require) {
    /** Alias tokens of the light palette, as CSS custom properties. */
    const PALETTE = {
      '--dsw-alias-bg-base': '#FBF7EF',
      '--dsw-alias-bg-layer-1': '#FBF7EF',
      '--dsw-alias-bg-layer-2': '#FFFCF5',
      '--dsw-alias-bg-layer-3': '#FFFDF9',
      '--dsw-alias-bg-overlay': '#F6EEDF',
      '--dsw-alias-bg-module-platform': '#F4EBDC',
      '--dsw-alias-bg-multi-select': '#F4EBDC',
      '--dsw-alias-bg-skeleton': '#3A261212',
      '--dsw-alias-bg-document-preview': '#F4EBDC',
      '--dsw-alias-label-document-preview': '#6E5D46',
      '--dsw-alias-bg-document-selection': '#C99A3559',
      '--dsw-alias-bg-mask-1': '#2A1B0E4D',
      '--dsw-alias-bg-mask-2': '#2A1B0E24',
      '--dsw-alias-bg-mask-3': '#2A1B0E7A',
      '--dsw-alias-bg-mask-photo': '#1A1208E0',
      '--dsw-alias-bg-mask-drop': '#FFFAF0B3',
      '--dsw-alias-label-primary': '#33291C',
      '--dsw-alias-label-primary-bluish': '#3A2C1A',
      '--dsw-alias-label-primary-dimmed': '#33291C',
      '--dsw-alias-label-primary-foreground': '#FFFCF5',
      '--dsw-alias-label-primary-inverted': '#FFFCF5',
      '--dsw-alias-label-secondary': '#6E5D46',
      '--dsw-alias-label-tertiary': '#8C7A61',
      '--dsw-alias-label-caption': '#A5947C',
      '--dsw-alias-label-dimmed': '#D2C4AF',
      '--dsw-alias-label-deep-diving': '#A2701F',
      '--dsw-alias-menu-icon': '#4A3823',
      '--dsw-alias-markdown-placeholder': '#E9DCC6',
      '--dsw-alias-border-l1': '#3A26120F',
      '--dsw-alias-border-l2': '#3A26121A',
      '--dsw-alias-border-l2-darkmode-thin': '#3A26121A',
      '--dsw-alias-border-l3': '#3A261224',
      '--dsw-alias-border-l4': '#3A261230',
      '--dsw-alias-border-inverted': '#00000000',
      '--dsw-alias-border-inverted2': '#00000000',
      '--dsw-alias-brand-primary': '#3A2C1A',
      '--dsw-alias-brand-primary-invert': '#F6ECD9',
      '--dsw-alias-brand-primary-new-colorprimary-new-color': '#B8822B',
      '--dsw-alias-brand-text': '#3A2C1A',
      '--dsw-alias-link': '#A2701F',
      '--dsw-alias-state-business-primary': '#A2701F',
      '--dsw-alias-state-business-tertiary': '#F6E8CD',
      '--dsw-alias-interactive-bg-hover': '#3A261210',
      '--dsw-alias-interactive-bg-active': '#3A26121F',
      '--dsw-alias-interactive-bg-hover-solid': '#F3E7D3',
      '--dsw-alias-interactive-bg-hover-accent': '#A2701F26',
      '--dsw-alias-interactive-bg-hover-danger': '#B4432F12',
      '--dsw-alias-button-contrast-fill': '#3A2C1A',
      '--dsw-alias-button-elevated-fill': '#FFFCF5',
      '--dsw-alias-button-floating-fill': '#FFFCF5',
      '--dsw-alias-button-floating-hover': '#F6EBD9',
      '--dsw-alias-button-ghost-active-border': '#C9B893',
      '--dsw-alias-button-ghost-active-fill': '#F4E8D5',
      '--dsw-alias-button-ghost-active-hover': '#EFE0C9',
      '--dsw-alias-button-info-fill': '#B8822B',
      '--dsw-alias-button-info-hover': '#CE9940',
      '--dsw-alias-button-primary-dimmed': '#F2E4C9',
      '--dsw-alias-button-primary-fill': '#3A2C1A',
      '--dsw-alias-button-primary-hover': '#57421F',
      '--dsw-alias-button-tool-bar-fill-invisible': '#3A26125C',
      '--dsw-alias-button-tool-bar-fill': '#6B563B80',
      '--dsw-alias-button-tool-bar-hover': '#6B563B99',
      '--dsw-alias-markdown-citation': '#F4EBDC',
      '--dsw-alias-markdown-code-block': '#F6EDDE',
      '--dsw-alias-markdown-code-block-banner': '#F9F1E4',
      '--dsw-alias-markdown-code-segment-selected': '#FFFBF3',
      '--dsw-alias-markdown-code-segment-unselected': '#F2E6D2',
      '--dsw-alias-markdown-inline-code': '#F4EADA',
      '--dsw-alias-markdown-tag': '#F2E7D5',
      '--dsw-alias-turn-trigger-bg': '#F6EDDE',
      '--dsw-alias-turn-trigger-bg-hover': '#3A261210',
      '--dsw-alias-scrollbar-bg-l1': '#E7D8BF',
      '--dsw-alias-scrollbar-bg-l2': '#E7D8BF',
      '--dsw-alias-scrollbar-hover-l1': '#D4C0A0',
      '--dsw-alias-scrollbar-hover-l2': '#D4C0A0',
      '--dsw-alias-state-error-primary': '#B4432F',
      '--dsw-alias-state-error-secondary': '#D0705C',
      '--dsw-alias-state-idle-primary': '#C9BAA3',
      '--dsw-alias-state-success-primary': '#6E8B4E',
      '--dsw-alias-state-success-secondary': '#8FA86F',
      '--dsw-alias-state-success-tertiary': '#EBF1DE',
      '--dsw-alias-state-warn-label': '#8A5B12',
      '--dsw-alias-state-warn-primary': '#D99A2B',
      '--dsw-alias-state-warn-secondary': '#E5B75A',
      '--dsw-alias-state-warn-tertiary': '#F8EDD6',
      '--dsw-alias-code-diff-added': '#6E8B4E14',
      '--dsw-alias-code-diff-deleted': '#B4432F12',
      '--dsw-alias-file-diff-added-bg': '#EAF0DD',
      '--dsw-alias-file-diff-added-gutter': '#F0F5E7',
      '--dsw-alias-file-diff-added-marker': '#5E8B3E',
      '--dsw-alias-file-diff-deleted-bg': '#F8E6E1',
      '--dsw-alias-file-diff-deleted-gutter': '#FBEFEB',
      '--dsw-alias-file-diff-deleted-marker': '#B5482F',
      '--dsw-alias-switch-thumb': '#FFFCF5',
      '--dsw-alias-toast-bg': '#3A2C1A',
      '--dsw-alias-toast-label': '#FFF9EE',
      '--dsw-alias-tooltip-bg': '#332617',
      '--dsw-menu-surface-fill': '#FBF5E9C7',
      '--dsw-alias-menu-group-header-fill': '#FAF3E6F0',
      '--dsw-specific-menu': '#FBF5E9C7',
      '--dsw-specific-selector': '#F2E6D2',
      '--dsw-specific-sidebar-fill': '#F6EFE0',
      '--dsw-specific-sidebar-nav-item-active': '#F0E2C9',
      '--dsw-specific-sidebar-nav-item-active-accent': '#F3E2BF',
      '--dsw-specific-sidebar-nav-item-hover': '#F4E9D7',
      '--dsw-specific-tip': '#F2E6D2',
      '--dsw-specific-bubble': '#F8EDD8',
      '--dsw-specific-bubble-highlight': '#F1DFBE',
      '--dsw-specific-input-major': '#FFFCF5',
      '--dsw-specific-login-input': '#F6EBD9',
    }

    /** Alias tokens of the dark palette 「星夜麦田」: warm ink + wheat gold. */
    const PALETTE_DARK = {
      '--dsw-alias-bg-base': 'rgba(21,17,12,.945)',
      '--dsw-alias-bg-layer-1': '#211A12',
      '--dsw-alias-bg-layer-2': '#281F16',
      '--dsw-alias-bg-layer-3': '#31271B',
      '--dsw-alias-bg-overlay': '#281F16',
      '--dsw-alias-bg-module-platform': '#2A2118',
      '--dsw-alias-bg-multi-select': '#2A2118',
      '--dsw-alias-bg-skeleton': '#F3E3C714',
      '--dsw-alias-bg-document-preview': '#15110C',
      '--dsw-alias-label-document-preview': '#C3B094',
      '--dsw-alias-bg-document-selection': '#E0AE5C4D',
      '--dsw-alias-bg-mask-1': '#0A070480',
      '--dsw-alias-bg-mask-2': '#00000033',
      '--dsw-alias-bg-mask-3': '#0000007A',
      '--dsw-alias-bg-mask-photo': '#000000E0',
      '--dsw-alias-bg-mask-drop': '#241C0FB3',
      '--dsw-alias-label-primary': '#F1E5D0',
      '--dsw-alias-label-primary-bluish': '#F7EEDD',
      '--dsw-alias-label-primary-dimmed': '#E7D9C0',
      '--dsw-alias-label-primary-foreground': '#241B11',
      '--dsw-alias-label-primary-inverted': '#C9B79A',
      '--dsw-alias-label-secondary': '#C3B094',
      '--dsw-alias-label-tertiary': '#9E8B6F',
      '--dsw-alias-label-caption': '#86765E',
      '--dsw-alias-label-dimmed': '#4C4030',
      '--dsw-alias-label-deep-diving': '#E3B86A',
      '--dsw-alias-menu-icon': '#E7D9C0',
      '--dsw-alias-markdown-placeholder': '#2A2118',
      '--dsw-alias-border-l1': '#F3E3C714',
      '--dsw-alias-border-l2': '#F3E3C71F',
      '--dsw-alias-border-l2-darkmode-thin': '#F3E3C714',
      '--dsw-alias-border-l3': '#F3E3C729',
      '--dsw-alias-border-l4': '#F3E3C733',
      '--dsw-alias-border-inverted': '#FFF0E00F',
      '--dsw-alias-border-inverted2': '#FFF0E014',
      '--dsw-alias-brand-primary': '#F5E6C9',
      '--dsw-alias-brand-primary-invert': '#2B2015',
      '--dsw-alias-brand-primary-new-colorprimary-new-color': '#E0AE5C',
      '--dsw-alias-brand-text': '#F5E6C9',
      '--dsw-alias-link': '#E0AE5C',
      '--dsw-alias-state-business-primary': '#E0AE5C',
      '--dsw-alias-state-business-tertiary': '#3A2D1B',
      '--dsw-alias-interactive-bg-hover': '#F3E3C714',
      '--dsw-alias-interactive-bg-active': '#F3E3C726',
      '--dsw-alias-interactive-bg-hover-solid': '#2A2118',
      '--dsw-alias-interactive-bg-hover-accent': '#E0AE5C3A',
      '--dsw-alias-interactive-bg-hover-danger': '#E2856E26',
      '--dsw-alias-button-contrast-fill': '#F1E5D0',
      '--dsw-alias-button-elevated-fill': '#2A2118',
      '--dsw-alias-button-floating-fill': '#241C14',
      '--dsw-alias-button-floating-hover': '#2F251A',
      '--dsw-alias-button-ghost-active-border': '#6B5A43',
      '--dsw-alias-button-ghost-active-fill': '#2F251A',
      '--dsw-alias-button-ghost-active-hover': '#3A2D1F',
      '--dsw-alias-button-info-fill': '#D9A34B',
      '--dsw-alias-button-info-hover': '#E7B463',
      '--dsw-alias-button-primary-dimmed': '#33281B',
      '--dsw-alias-button-primary-fill': '#F5E6C9',
      '--dsw-alias-button-primary-hover': '#E4CFA8',
      '--dsw-alias-button-tool-bar-fill-invisible': '#1F1A1480',
      '--dsw-alias-button-tool-bar-fill': '#3A2F2380',
      '--dsw-alias-button-tool-bar-hover': '#473A2C99',
      '--dsw-alias-markdown-citation': '#2A2118',
      '--dsw-alias-markdown-code-block': '#1D1710',
      '--dsw-alias-markdown-code-block-banner': '#241C14',
      '--dsw-alias-markdown-code-segment-selected': '#31271B',
      '--dsw-alias-markdown-code-segment-unselected': '#1D1710',
      '--dsw-alias-markdown-inline-code': '#2A2117',
      '--dsw-alias-markdown-tag': '#2A2118',
      '--dsw-alias-turn-trigger-bg': '#F3E3C714',
      '--dsw-alias-turn-trigger-bg-hover': '#F3E3C726',
      '--dsw-alias-scrollbar-bg-l1': '#463A29',
      '--dsw-alias-scrollbar-bg-l2': '#463A29',
      '--dsw-alias-scrollbar-hover-l1': '#5A4A35',
      '--dsw-alias-scrollbar-hover-l2': '#5A4A35',
      '--dsw-alias-state-error-primary': '#E2856E',
      '--dsw-alias-state-error-secondary': '#E2856E',
      '--dsw-alias-state-idle-primary': '#6A5A44',
      '--dsw-alias-state-success-primary': '#9CBB74',
      '--dsw-alias-state-success-secondary': '#B4CE8F',
      '--dsw-alias-state-success-tertiary': '#2C3524',
      '--dsw-alias-state-warn-label': '#E3B36A',
      '--dsw-alias-state-warn-primary': '#E0AE5C',
      '--dsw-alias-state-warn-secondary': '#EBC682',
      '--dsw-alias-state-warn-tertiary': '#3A2D1A',
      '--dsw-alias-code-diff-added': '#9CBB7414',
      '--dsw-alias-code-diff-deleted': '#E2856E14',
      '--dsw-alias-file-diff-added-bg': '#24301C',
      '--dsw-alias-file-diff-added-gutter': '#1A2413',
      '--dsw-alias-file-diff-added-marker': '#86B25E',
      '--dsw-alias-file-diff-deleted-bg': '#3A211B',
      '--dsw-alias-file-diff-deleted-gutter': '#281610',
      '--dsw-alias-file-diff-deleted-marker': '#E2775C',
      '--dsw-alias-switch-thumb': '#C3B094',
      '--dsw-alias-toast-bg': '#3A2D1F',
      '--dsw-alias-toast-label': '#FFF6E6',
      '--dsw-alias-tooltip-bg': '#33291B',
      '--dsw-menu-surface-fill': '#32271ABA',
      '--dsw-alias-menu-group-header-fill': '#281F16F2',
      '--dsw-specific-menu': '#32271ABA',
      '--dsw-specific-selector': '#2A2118',
      '--dsw-specific-sidebar-fill': 'rgba(14,11,7,.16)',
      '--dsw-specific-sidebar-nav-item-active': '#2A2118',
      '--dsw-specific-sidebar-nav-item-active-accent': '#3A2D1D',
      '--dsw-specific-sidebar-nav-item-hover': '#241C14',
      '--dsw-specific-tip': '#2A2118',
      '--dsw-specific-bubble': '#2A2118',
      '--dsw-specific-bubble-highlight': '#392C1D',
      '--dsw-specific-input-major': '#241C14',
      '--dsw-specific-login-input': '#1D1710',
    }

    /** One `--token: value !important;` line per palette entry. */
    const tokenCss = (table) => Object.entries(table)
      .map(([name, value]) => `  ${name}: ${value} !important;`)
      .join('\n')

    const TOKEN_CSS = tokenCss(PALETTE)
    const TOKEN_CSS_DARK = tokenCss(PALETTE_DARK)

    const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E\")"

    /** Artwork served by the host half from ./assets (route: /holo-theme/assets/).
        Declared before STYLE because the stylesheet embeds one of these URLs. */
    const ASSET_BASE = '/holo-theme/assets/'

    const STYLE = `

/* ---- secondary surfaces: menus, popovers, dialogs, code ------------- */
/* One warm panel language for everything that floats above the page.        */
html body:not([data-ds-dark-theme]) [role="menu"],
html body:not([data-ds-dark-theme]) [role="listbox"],
html body:not([data-ds-dark-theme]) [role="dialog"] > div:first-child {
  background: rgba(255, 252, 245, .985) !important;
  border: .5px solid rgba(58, 38, 18, .14);
  border-radius: 14px !important;
  box-shadow:
    0 18px 44px rgba(58, 38, 18, .16),
    0 1px 0 rgba(255, 255, 255, .55) inset;
}
html body:not([data-ds-dark-theme]) [role="menu"] [role="separator"],
html body:not([data-ds-dark-theme]) [role="listbox"] [role="separator"] {
  background: linear-gradient(90deg, transparent, rgba(224, 174, 92, .28), transparent);
  height: 1px;
}
html body:not([data-ds-dark-theme]) [role="menuitem"],
html body:not([data-ds-dark-theme]) [role="menuitemradio"],
html body:not([data-ds-dark-theme]) [role="option"] {
  border-radius: 9px;
  transition: background-color .15s ease, color .15s ease;
}
html body:not([data-ds-dark-theme]) [role="menuitem"]:hover,
html body:not([data-ds-dark-theme]) [role="menuitem"][data-highlighted],
html body:not([data-ds-dark-theme]) [role="menuitemradio"][data-highlighted],
html body:not([data-ds-dark-theme]) [role="option"]:hover {
  background: rgba(224, 174, 92, .13) !important;
}
/* the "rein" motif from the intro: a gold hairline that ends in a red dot    */
html body:not([data-ds-dark-theme]) [role="tab"] {
  position: relative;
}
html body:not([data-ds-dark-theme]) [role="tab"][aria-selected="true"] {
  border-bottom-color: transparent !important;
}
html body:not([data-ds-dark-theme]) [role="tab"][aria-selected="true"]::after {
  content: "";
  position: absolute;
  left: 14%;
  right: 14%;
  bottom: -1px;
  height: 1.5px;
  border-radius: 2px;
  background: linear-gradient(90deg,
    rgba(224, 174, 92, 0) 0%,
    rgba(224, 174, 92, .55) 40%,
    #E0AE5C 88%,
    #D6402C 100%);
  pointer-events: none;
}
html body:not([data-ds-dark-theme]) [role="tab"][aria-selected="true"]::before {
  content: "";
  position: absolute;
  right: calc(14% - 2px);
  bottom: -3.5px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #D6402C;
  box-shadow: 0 0 7px 1px rgba(214, 64, 44, .7);
  pointer-events: none;
}
html body:not([data-ds-dark-theme]) [role="dialog"] {
  background: rgba(255, 252, 245, .99) !important;
  border: .5px solid rgba(58, 38, 18, .16);
  border-radius: 18px !important;
  box-shadow:
    0 40px 90px rgba(58, 38, 18, .26),
    0 0 0 .5px rgba(255, 255, 255, .5) inset;
  background-image: radial-gradient(120% 90% at 12% 0%, rgba(162, 112, 31, .06), transparent 60%);
}

/* ---- code, tables, quotes: painted like the page -------------------- */
html body:not([data-ds-dark-theme]) pre {
  background: #F4EBD9 !important;
  border: .5px solid rgba(58, 38, 18, .12);
  border-radius: 12px;
}
html body:not([data-ds-dark-theme]) :not(pre) > code {
  background: rgba(162, 112, 31, .10);
  border: .5px solid rgba(162, 112, 31, .22);
  border-radius: 6px;
  padding: .5px 5px;
  color: #7A4E12;
}
html body:not([data-ds-dark-theme]) table th {
  background: rgba(224, 174, 92, .07);
}
html body:not([data-ds-dark-theme]) th,
html body:not([data-ds-dark-theme]) td {
  border-color: rgba(224, 174, 92, .13) !important;
}
html body:not([data-ds-dark-theme]) blockquote {
  border-left: 2px solid rgba(224, 174, 92, .45) !important;
}
html body:not([data-ds-dark-theme]) hr {
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(224, 174, 92, .30), transparent);
}


/* ---- transcript labels: a quiet colour code ---------------------- */
html body:not([data-ds-dark-theme]) [data-holo-kind] {
  transition: color .18s ease;
}
html body:not([data-ds-dark-theme]) [data-holo-kind="think"] {
  color: #7C6C4F !important;
}
html body:not([data-ds-dark-theme]) [data-holo-kind="read"] {
  color: #8A6428 !important;
}
html body:not([data-ds-dark-theme]) [data-holo-kind="run"] {
  color: #A9661F !important;
}
html body:not([data-ds-dark-theme]) [data-holo-kind="tool"] {
  color: #8E4A40 !important;
}
html body:not([data-ds-dark-theme]) [data-holo-kind="write"] {
  color: #7C6248 !important;
}
/* the label gets a hairline that grows on hover, like the rein */
html body:not([data-ds-dark-theme]) [data-holo-kind]::after {
  content: "";
  display: block;
  height: 1px;
  width: 0;
  margin-top: 1px;
  border-radius: 1px;
  background: currentColor;
  opacity: .55;
  transition: width .22s ease;
}
html body:not([data-ds-dark-theme]) [data-holo-kind]:hover::after {
  width: 100%;
}

/* ---- session rows, composer, send -------------------------------- */
/* the active conversation gets the rein's left edge                         */
html body:not([data-ds-dark-theme]) [role="treeitem"] {
  position: relative;
  transition: background-color .16s ease;
}
html body:not([data-ds-dark-theme]) [role="treeitem"]:hover {
  background: rgba(224, 174, 92, .07) !important;
}
html body:not([data-ds-dark-theme]) [role="treeitem"][aria-selected="true"]::before {
  content: "";
  position: absolute;
  left: 1px;
  top: 16%;
  bottom: 16%;
  width: 2px;
  border-radius: 2px;
  background: linear-gradient(180deg,
    rgba(224, 174, 92, .15),
    #E0AE5C 45%,
    rgba(214, 64, 44, .85));
  pointer-events: none;
}
html body:not([data-ds-dark-theme]) [role="textbox"] {
  caret-color: #E0AE5C;
}
html body:not([data-ds-dark-theme]) button[aria-label*="发送"]:not([disabled]) {
  transition: transform .12s ease, box-shadow .22s ease, filter .2s ease;
}
html body:not([data-ds-dark-theme]) button[aria-label*="发送"]:not([disabled]):hover {
  box-shadow: 0 0 20px rgba(224, 174, 92, .34);
}
html body:not([data-ds-dark-theme]) button[aria-label*="新建会话"]:hover {
  background: rgba(224, 174, 92, .08) !important;
}

/* ---- dialogs get a soft top-left light, like a lantern over paper ---- */
html body:not([data-ds-dark-theme]) [role="dialog"] {
  background-image:
    radial-gradient(120% 80% at 8% 0%, rgba(224, 174, 92, .07) 0%, rgba(224, 174, 92, 0) 55%) !important;
}

/* ---- toasts, status strips --------------------------------------- */
html body:not([data-ds-dark-theme]) [role="status"],
html body:not([data-ds-dark-theme]) [role="alert"] {
  background: rgba(255, 252, 245, .985) !important;
  border: .5px solid rgba(58, 38, 18, .14);
  border-radius: 12px !important;
  box-shadow: 0 14px 34px rgba(58, 38, 18, .18);
  color: #33291C;
  backdrop-filter: blur(12px) saturate(1.04);
}

/* the profile card is inline-styled for dark; give it a parchment twin */
html body:not([data-ds-dark-theme]) #holo-profile-card {
  background: rgba(255, 252, 245, .97) !important;
  border: .5px solid rgba(58, 38, 18, .16) !important;
  box-shadow: 0 18px 44px rgba(58, 38, 18, .18) !important;
  color: #33291C !important;
}
html body:not([data-ds-dark-theme]) #holo-profile-card > div:last-of-type > div:first-child {
  color: #A2701F !important;
}
html body:not([data-ds-dark-theme]) #holo-profile-card > div:last-of-type > div:last-child {
  color: #7A6A52 !important;
}
html body:not([data-ds-dark-theme]) #holo-profile-card img {
  border: 1px solid rgba(162, 112, 31, .35);
}





/* ---- the agent browser button wears an apple ----------------------- */
html body:not([data-ds-dark-theme]) #dsh-ego-fab svg {
  display: none !important;
}
html body:not([data-ds-dark-theme]) #dsh-ego-fab {
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2036%2036%22%3E%3Cpath%20fill%3D%22%23dd2e44%22%20d%3D%22M24%207c-3%200-3%201-6%201s-3-1-6-1c-4%200-9%202-9%209c0%2011%206%2020%2010%2020c3%200%203-1%205-1s2%201%205%201c4%200%2010-9%2010-20c0-7.001-5-9-9-9%22%2F%3E%3Cpath%20fill%3D%22%2377b255%22%20d%3D%22M19%207s3-4%208-4c4%200%206%202%206%202s-4%203-7%203s-7-1-7-1%22%2F%3E%3Cpath%20fill%3D%22%23662113%22%20d%3D%22M18%2010a1%201%200%200%201-1-1c0-3.441%201.2-6.615%203.293-8.707a.999.999%200%201%201%201.414%201.414C19.986%203.427%2019%206.085%2019%209a1%201%200%200%201-1%201%22%2F%3E%3C%2Fsvg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
  background-size: 24px 24px !important;
}
html body:not([data-ds-dark-theme]) #dsh-ego-fab:hover {
  filter: drop-shadow(0 0 8px rgba(214, 64, 44, .45));
}

/* ---- scrollbars, selection, focus, tooltips -------------------------- */
html body:not([data-ds-dark-theme]) ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
html body:not([data-ds-dark-theme]) ::-webkit-scrollbar-track {
  background: transparent;
}
html body:not([data-ds-dark-theme]) ::-webkit-scrollbar-thumb {
  background: rgba(224,174,92,.16);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: content-box;
}
html body:not([data-ds-dark-theme]) ::-webkit-scrollbar-thumb:hover {
  background: rgba(224,174,92,.32);
  background-clip: content-box;
}
html body:not([data-ds-dark-theme]) ::-webkit-scrollbar-corner {
  background: transparent;
}
html body:not([data-ds-dark-theme]) ::selection {
  background: rgba(224,174,92,.30);
}
html body:not([data-ds-dark-theme]) :focus-visible {
  outline: 1.5px solid rgba(224,174,92,.52);
  outline-offset: 2px;
}

/* ---- boot scene: the intro reel, drawn live on a canvas ---------------- */
html body:not([data-ds-dark-theme]) #holo-boot {
  position: fixed;
  inset: 0;
  z-index: 2147483003;
  overflow: hidden;
  pointer-events: none;
  background: #000;
  opacity: 1;
  transition: opacity .55s ease;
}
html body:not([data-ds-dark-theme]) #holo-boot.is-leaving {
  opacity: 0;
}
html body:not([data-ds-dark-theme]) #holo-boot .boot-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
html body:not([data-ds-dark-theme]) #holo-boot .boot-sound {
  position: absolute;
  right: 22px;
  bottom: 42px;
  pointer-events: auto;
  background: rgba(22, 15, 10, .34);
  border: 0.5px solid rgba(224, 190, 140, .18);
  border-radius: 999px;
  padding: 6px 12px;
  font: 400 12px/1 "Segoe UI", "Microsoft YaHei", sans-serif;
  letter-spacing: .16em;
  color: rgba(238, 212, 172, .72);
  cursor: pointer;
  transition: color .2s ease, background .2s ease, border-color .2s ease;
  backdrop-filter: blur(3px);
}
html body:not([data-ds-dark-theme]) #holo-boot .boot-sound:hover {
  color: rgba(255, 232, 196, .98);
  background: rgba(30, 21, 14, .55);
  border-color: rgba(224, 174, 92, .45);
}
html body:not([data-ds-dark-theme]) #holo-boot .boot-sound[data-on="1"] {
  color: rgba(240, 196, 122, .98);
  border-color: rgba(224, 174, 92, .5);
}
html body:not([data-ds-dark-theme]) #holo-boot .boot-skip {
  position: absolute;
  right: 22px;
  bottom: 14px;
  pointer-events: auto;
  background: rgba(22, 15, 10, .34);
  border: 0.5px solid rgba(224, 190, 140, .18);
  border-radius: 999px;
  padding: 6px 14px;
  font: 400 12px/1 "Segoe UI", "Microsoft YaHei", sans-serif;
  letter-spacing: .12em;
  color: rgba(238, 212, 172, .72);
  cursor: pointer;
  transition: color .2s ease, background .2s ease, border-color .2s ease;
  backdrop-filter: blur(3px);
  opacity: 0;
  animation: bootHint .8s ease 1.2s forwards;
}
html body:not([data-ds-dark-theme]) #holo-boot .boot-skip:hover {
  color: rgba(255, 232, 196, .98);
  background: rgba(30, 21, 14, .55);
  border-color: rgba(224, 174, 92, .45);
}
@keyframes bootHint { to { opacity: 1 } }

/* Structure is not a light-mode nicety: the reel covers the whole viewport in
   either palette, and its two buttons have to sit above the canvas and stay
   clickable. These rules carry no colour, so they apply unscoped. */
#holo-boot {
  position: fixed;
  inset: 0;
  z-index: 2147483003;
  overflow: hidden;
  pointer-events: none;
  background: #000;
  opacity: 1;
  transition: opacity .55s ease;
}
#holo-boot.is-leaving { opacity: 0; }
#holo-boot .boot-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  z-index: 0;
}
#holo-boot .boot-sound,
#holo-boot .boot-skip {
  position: absolute;
  z-index: 2;
  pointer-events: auto;
  cursor: pointer;
}
#holo-boot .boot-sound { right: 22px; bottom: 42px; }
#holo-boot .boot-skip { right: 22px; bottom: 14px; }

/* ---- the peeking companion ------------------------------------------- */
html body:not([data-ds-dark-theme]) #holo-peek {
  position: fixed;
  z-index: 2147482997;
  display: none;
  overflow: hidden;
  cursor: grab;
  touch-action: none;
  height: var(--peek-h, 0px);
  will-change: height;
  -webkit-tap-highlight-color: transparent;
}
html body:not([data-ds-dark-theme]) #holo-peek.is-dragging { cursor: grabbing; }
html body:not([data-ds-dark-theme]) #holo-peek img {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  transform: translate(-50%, 0);
  transform-origin: 50% 15%;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
  will-change: transform;
}

/* the rein between her hand and the composer */
html body:not([data-ds-dark-theme]) #holo-thread {
  position: fixed;
  inset: 0;
  z-index: 2147482996;
  pointer-events: none;
  opacity: 0;
  transition: opacity .5s ease;
}
html body:not([data-ds-dark-theme]) #holo-thread path {
  fill: none;
  stroke: rgba(224, 174, 92, .62);
  stroke-width: 1.1;
  stroke-linecap: round;
  stroke-dasharray: 5 7;
  animation: threadFlow 2.6s linear infinite;
}
html body:not([data-ds-dark-theme]) #holo-thread.is-on {
  opacity: 1;
}
@keyframes threadFlow {
  to { stroke-dashoffset: -24; }
}

/* wheat grains and the apple */
html body:not([data-ds-dark-theme]) #holo-peek-fx {
  position: fixed;
  inset: 0;
  z-index: 2147482999;
  pointer-events: none;
  overflow: visible;
}
html body:not([data-ds-dark-theme]) .holo-grain {
  position: absolute;
  width: 3px;
  height: 7px;
  border-radius: 50% 50% 42% 42%;
  background: linear-gradient(180deg, #F3D6A0, #C89A5E);
  opacity: 0;
  animation: grainUp 1.15s ease-out forwards;
}
@keyframes grainUp {
  0%   { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(.6); }
  18%  { opacity: .95; }
  100% { opacity: 0; transform: translate(var(--gx, 0px), -46px) rotate(var(--gr, 40deg)) scale(1); }
}
html body:not([data-ds-dark-theme]) .holo-apple {
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: radial-gradient(circle at 34% 28%, #F5887A, #B82F26 62%, #7C1915);
  box-shadow: 0 2px 7px rgba(0,0,0,.45), 0 0 10px rgba(214, 64, 44, .45);
  opacity: 0;
  animation: appleRoll 3.4s cubic-bezier(.2,.8,.3,1) forwards;
}
html body:not([data-ds-dark-theme]) .holo-apple::after {
  content: "";
  position: absolute;
  left: 8px;
  top: -4px;
  width: 6px;
  height: 4px;
  border-radius: 60% 20% 60% 20%;
  background: #6E8A3E;
  transform: rotate(-24deg);
}
@keyframes appleRoll {
  0%   { opacity: 0; transform: translate(-10px, 4px) rotate(-40deg) scale(.7); }
  16%  { opacity: 1; transform: translate(2px, 0) rotate(0deg) scale(1); }
  22%  { transform: translate(4px, -1px) rotate(4deg); }
  80%  { opacity: 1; transform: translate(6px, 0) rotate(2deg) scale(1); }
  100% { opacity: 0; transform: translate(8px, 6px) rotate(0deg) scale(.9); }
}

@media (prefers-reduced-motion: reduce) {
  html body:not([data-ds-dark-theme]) #holo-peek,
html body:not([data-ds-dark-theme]) #holo-peek img { transition: none; }
  html body:not([data-ds-dark-theme]) .holo-grain,
html body:not([data-ds-dark-theme]) .holo-apple { animation: none; opacity: 0; }
  html body:not([data-ds-dark-theme]) #holo-thread path { animation: none; }
}

/* ---- syntax colors: warm sepia code blocks --------------------------- */
html body:not([data-ds-dark-theme]) {
  --shiki-foreground: var(--dsw-alias-label-primary);
  --shiki-background: var(--dsw-alias-markdown-code-block);
  --shiki-token-constant: #1F6F8B;
  --shiki-token-string: #4A7A3B;
  --shiki-token-comment: #9A8A72;
  --shiki-token-keyword: #B04A2F;
  --shiki-token-parameter: #A15A1E;
  --shiki-token-function: #7B4E86;
  --shiki-token-string-expression: #3D6B34;
  --shiki-token-punctuation: #6B5A45;
  --shiki-token-link: #8A5D12;
}



/* ---- stream fades and shadows follow the warm paper ------------------ */
html body:not([data-ds-dark-theme]) {
  --dsw-linear-gradient-think: linear-gradient(180deg, #FBF7EF 20.19%, #FBF7EF00 100%);
  --dsw-linear-think-select: linear-gradient(180deg, #F6EFE0 20.19%, #F6EFE000 100%);
  --dsw-shadow-lv1: 0 2px 4px 0 #3A26120D;
  --dsw-shadow-lv1-blur: 0 4px 12px 0 #3A261205;
  --dsw-shadow-lv2: 0 4px 12px 0 #3A261208, 0 2px 8px 0 #3A26120F;
  --dsw-shadow-lv3: 0 0 1px 0 #3A261233, 0 0 4px 0 #3A261208, 0 12px 32px 0 #3A261218;
}



/* ---- selection ------------------------------------------------------- */
html body:not([data-ds-dark-theme]) ::selection {
  background: #E7C27A;
  color: #33291C;
}


/* ---- atmosphere: light from the wheat field, paper grain ------------- */
html body:not([data-ds-dark-theme])::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 2147482999;
  pointer-events: none;
  background-image: radial-gradient(115% 60% at 50% -12%, #FFE7B83D 0%, #FFE7B800 62%);
}



html body:not([data-ds-dark-theme])::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  pointer-events: none;
  background-image:
    radial-gradient(140% 100% at 50% 35%, #00000000 55%, #6B48140F 100%),
    ${GRAIN};
  background-size: auto, 160px 160px;
  opacity: 0.09;
  mix-blend-mode: multiply;
}

/* ---- decorations retire with the skin -------------------------------- */
html body[data-ds-dark-theme] [id^="holo-"],
html body[data-ds-dark-theme] .holo-grain,
html body[data-ds-dark-theme] .holo-apple { display: none !important; }

/* The peeking companion is opt-out from the plugin's own settings row; the
   latch lives on <html> so it applies to both palettes. */
html[data-holo-peek="off"] #holo-peek,
html[data-holo-peek="off"] #holo-peek-fx { display: none !important; }

/* ---- the floating wordmark -------------------------------------------- */
/* A free-floating picture: one fixed layer on <body>, nothing appended to a
   host element, and the person decides where it goes. Positioning by viewport
   fractions keeps the artwork's place and proportion when the window is
   resized or maximised, with no resize handler, and keeps it clear of the
   host's flex boxes, container units and overflow rules, which all belong to
   the host.
   Idle the layer is inert (pointer-events: none), so it can never swallow a
   click meant for the GUI underneath — it only accepts input while the
   settings page has the edit mode on.
   The cost of floating above the GUI is that the mark can be parked on top of
   something. That is deliberate: it is a picture to place, not a watermark, so
   the way out of it is to drag the picture elsewhere (or turn it off in the
   settings row), not to sink it below a panel. */

[data-holo-logo] {
  position: fixed;
  /* 2, which is the whole trick for a floating layer.
     The mark is a child of <body>, a sibling of the shell's own frame. That
     frame sets no z-index (auto), so any positive index here paints the mark
     above the entire GUI — including the header and its buttons. That is the
     intent: it is a picture you park where you want it, so it does have to sit
     on top of what is behind it.
     The number stays small on purpose. 2 is above the frame but below every
     control the host floats on its own: the window resize handles (11), the
     leading seat (15) and the overlay layer (20). Zero or auto would not do —
     those are painted in document order, and the plugin mounts before the
     shell renders the frame, so the mark would end up under it instead.
     pointer-events: none is what keeps the idle mark from swallowing clicks —
     the index has nothing to do with that. */
  z-index: 2;
  pointer-events: none;
  user-select: none;
  line-height: 0;
}
[data-holo-logo] img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  /* No opacity here: paint() writes it on this element from logoState.alpha, so
     the slider and the first frame can never disagree. A value declared here
     would be a second source of truth for the same number. */
  -webkit-user-drag: none;
}

/* Editing is the only state that accepts input — and the only one that climbs to
   the very top of the page, so the grip can never be covered by a dialog while
   it is being dragged.
   The hairline ring is inset so it survives even if something else on the page
   clips its own overflow; it is painted on this element rather than the image,
   which keeps the mark findable while it is dragged. */
[data-holo-logo][data-holo-logo-edit="on"] {
  z-index: 2147482800;
  pointer-events: auto;
  cursor: grab;
  touch-action: none;
  box-shadow: inset 0 0 0 1px rgba(190, 124, 52, .95);
  border-radius: 3px;
}
[data-holo-logo][data-holo-logo-edit="on"]:active { cursor: grabbing; }

/* The grip and the readout exist in the DOM at all times but are painted only
   while editing, so entering the mode never rebuilds the layer. */
[data-holo-logo-grip] { display: none; }
[data-holo-logo][data-holo-logo-edit="on"] [data-holo-logo-grip] {
  display: block;
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1.5px solid #FFFCF5;
  background: #C98A3E;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  cursor: nwse-resize;
  pointer-events: auto;
}
[data-holo-logo-readout] { display: none; }
/* The badge hangs under the mark and is nudged back inside the window by
   paint(); the left/top here are only its preferred corner. */
[data-holo-logo][data-holo-logo-edit="on"] [data-holo-logo-readout] {
  display: block;
  position: absolute;
  left: 0;
  top: calc(100% + 6px);
  padding: 1px 7px;
  border-radius: 9px;
  white-space: nowrap;
  font: 500 11px/1.6 "Microsoft YaHei", system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
  color: #FFFCF5;
  background: rgba(72, 52, 32, .88);
  box-shadow: 0 1px 4px rgba(0, 0, 0, .28);
  pointer-events: none;
}

/* ---- the wheat strip along the foot of the sidebar -------------------- */
/* A free-floating layer, exactly like the wordmark: appended to <body> and
   positioned in viewport pixels, so it no longer depends on which element the
   host happens to paint its sidebar fill on.
   That dependency was the bug. While the strip was a child of the sidebar it
   had to climb out from under an opaque background painted by the host, and
   that background is applied by an element the plugin does not own — a stacking
   context bolted onto the inner root was not enough, and tampering with host
   elements was the wrong lever to begin with.
   position: fixed with a small positive z-index is what this shell needs: a
   negative index is painted under .BynINW_frame and vanishes, and zero only
   wins a tree-order race against whatever React appends later. 1 sits well
   under the shell's own overlays (boot screen, edit ring, dialogs, all in the
   2147482xxx range) and above the frame's in-flow content, which is what makes
   the field visible at all.
   The price of being above the frame: the strip paints over the lower part of
   the account row instead of behind it. That is tolerable only because of the
   artwork — the top of wheat.png is 93.8% fully transparent, so the band that
   crosses the name carries a few stalk tips, already faded to 40% by the mask.
   pointer-events: none keeps the row clickable.
   left, width and bottom are written by the layer (see createWheatLayer) from
   the sidebar column's own rect — measured in viewport coordinates, which is
   what fixed positioning consumes. The artwork is tiled along x at a height
   that does not depend on the width, so a wider column lengthens the field
   without distorting a single stalk.
   Opacity and the edge falloff are two independent knobs: 75% for the field
   and 30% at the two sides and at the top edge. The edge value is not written
   directly — each mask fades to 0.4, and 0.4 of the 75% field is 30%. Raise or
   lower the field with opacity alone; the edges follow in proportion. The masks
   are split across two elements on purpose — one gradient each, so no
   mask-composite support is needed anywhere. */
#holo-wheat {
  position: fixed;
  /* Zero until the first measure lands: a zero-width fixed box paints nothing,
     so a frame that arrives before the sidebar exists cannot flash a mislocated
     field across the window. */
  left: 0;
  width: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  opacity: .75;
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, .4) 0%, #000 16%, #000 84%, rgba(0, 0, 0, .4) 100%);
  mask-image: linear-gradient(to right, rgba(0, 0, 0, .4) 0%, #000 16%, #000 84%, rgba(0, 0, 0, .4) 100%);
}
#holo-wheat i {
  display: block;
  width: 100%;
  height: 100%;
  background-image: url("${ASSET_BASE}wheat.png");
  background-repeat: repeat-x;
  background-position: left bottom;
  background-size: auto 100%;
  -webkit-mask-image: linear-gradient(to top, #000 55%, rgba(0, 0, 0, .4) 100%);
  mask-image: linear-gradient(to top, #000 55%, rgba(0, 0, 0, .4) 100%);
}

/* ---- banner on this plugin's own detail page -------------------------- */
/* The artwork is a block at the head of the detail column, not a floating
   layer. That column lives inside the plugin manager's scroller (class suffix
   "_page", overflow:auto), so a block child travels with the content — the
   request was explicit that the picture must follow the scrollbar instead of
   staying pinned. A ::before keeps the banner out of every existing child's
   way: nothing overlaps the title, the icon or the controls, and no extra DOM
   node has to be inserted into a page the plugin does not own.

   Scoping uses the "data-plugin-detail" attribute, the name the plugin manager
   stamps on this column. No hashed class name is involved, so the rule cannot
   break when the host rebuilds, and it cannot leak onto another plugin's page.
   The column is already display:flex / flex-direction:column, which is what
   makes the aspect-ratio box work as a plain flex child.

   NB: this comment sits inside the STYLE template literal — never use a
   backtick here, it would end the string (that is exactly how the 19:15 boot
   failure happened). The 75% field and 50% edges are baked into the WebP's
   alpha channel: a CSS opacity fades the entire element, and a background
   image carries no opacity knob of its own. */
[data-plugin-detail="dsh-theme-holo"]::before {
  content: "";
  display: block;
  flex: none;
  width: 100%;
  aspect-ratio: 1920 / 620;
  background-image: url("${ASSET_BASE}cover.webp");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  border-radius: 12px;
  margin-bottom: 8px;
}

/* ---- the idle plate: her, looping behind the right column -------------- */
/* Reference: the first theme pack pinned a looping webm of her behind the
   left sidebar (id horo-scene-layer, fixed, z-index -4). Same mechanism, two
   differences: the plate stands behind the RIGHT column, and it is only up
   while that column shows its own start page, so a working page never gets a
   moving background.

   Two facts shape the layer.

   One: it has to sit UNDER the column's own text but OVER the opaque fills
   the shell paints. A child with a negative index is painted behind every
   in-flow background, so the only way through is to make those fills
   transparent while the plate is up -- html, body, the frame, the column and
   anything full-bleed inside it. That is exactly what the source package did,
   and it is why every rule below is gated on html[data-holo-scene="on"]:
   outside the start page nothing is cleared and the app keeps its own
   parchment. The frame and the column fills are cleared in JS (createScene),
   because they are the shell's elements and their inline values have to come
   back untouched.

   Two: the webm is a portrait crop (608x1080) taken from the right-hand
   figure of a 1920x1080 source. The plate is meant to be a full-height slice,
   not a shrunken thumbnail, so the video is laid out at 1:1 -- a 608x1080 box,
   never scaled -- centred in the clip, and the clip does the cropping.
   Nothing scales with the window: her size and position stay put at any
   window size, and a column narrowing only narrows the slice.

   The background gradient on the root is not decoration: while the shell is
   transparent, whatever paints the rest of the window is this gradient, so it
   carries the active palette (#14100B dark, #FBF7EF light) and no raw canvas
   can show through. The video is cropped into the clip, so the gradient only
   ever shows outside the column -- where the conversation's own opaque root
   covers it anyway. */

/* Click band over the standby plate.
   It is its OWN layer on <body>, not a child of #holo-scene: that plate is
   z-index:-1, and a negative-z layer sits below its container's background, so
   a child with pointer-events:auto in it never receives clicks. This band sits
   above ordinary content but below every other piece of plugin chrome
   (peeker 2147482997, planner 2147482998, bubble 2147482999). */
#holo-scene-hit {
  position: fixed;
  z-index: 2147482995;
  pointer-events: auto;
  cursor: pointer;
  background: transparent;
}

#holo-scene {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background: linear-gradient(180deg, #14100B 0%, #100D09 100%);
  /* A negative-z layer is invisible only as long as something opaque sits
     above it. Anything the host (or another plugin) leaves transparent would
     let this plate bleed through, so it is switched off entirely off the
     start page instead of merely being covered up. */
  display: none;
}
html[data-holo-scene="on"] #holo-scene {
  display: block;
}
#holo-scene .holo-scene-clip {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  overflow: hidden;
  /* keeps the light mode multiply blend inside the slice */
  isolation: isolate;
  /* Both vertical edges sink to 50% opacity, so the plate never ends on a hard
     seam where it meets the column's own border. The mask sits on the slice, not
     on the video: the slice IS the visible window, while the 608px plate is
     wider than the column and gets cropped by overflow: hidden -- a mask on the
     video would be cut away with the part that is hidden. The slice is capped at
     the plate's width in place() for the same reason: the band is a percentage
     of the slice, so a wider slice would push it off the artwork entirely.
     10% a side, matching the blurred band below so the two effects share one
     boundary. */
  -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,.5) 0, #000 10%, #000 90%, rgba(0,0,0,.5) 100%);
  mask-image: linear-gradient(90deg, rgba(0,0,0,.5) 0, #000 10%, #000 90%, rgba(0,0,0,.5) 100%);
}
/* The soft edge the request asked to try: the outer 10% a side is blurred, the
   middle stays sharp. A filter: blur() on the video would blur the whole
   plate -- there is no per-position strength in filter functions -- so the blur
   is painted by a cover layer whose backdrop is the video itself, and a mask
   keeps that layer to the outer tenth. The 4%->10% leg of the mask ramps the
   blur in, so the seam between blurred and sharp never shows as a step.
   It must sit directly above the video for the backdrop to be the plate and not
   the shell's own background. */
#holo-scene .holo-scene-blur {
  position: absolute;
  inset: 0;
  pointer-events: none;
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  -webkit-mask-image: linear-gradient(90deg, #000 0, #000 4%, transparent 10%, transparent 90%, #000 96%, #000 100%);
  mask-image: linear-gradient(90deg, #000 0, #000 4%, transparent 10%, transparent 90%, #000 96%, #000 100%);
}
#holo-scene .holo-scene-img {
  position: absolute;
  /* The plate is a portrait crop (608x1080) shown at 1:1 -- no scaling, so the
     vertical edge really is 1080px. It is centred in the slice: the visible
     window has to be the middle of it, not its left edge. Half of 608px. */
  left: calc(50% - 304px);
  top: 0;
  width: 608px;
  height: 1080px;
  object-fit: contain;
  opacity: .94;
  transform-origin: 50% 50%;
  /* fade the clip out before its own bottom edge, so a taller window never
     shows a hard line where the video ends */
  -webkit-mask-image: linear-gradient(180deg, #000 0 58%, rgba(0,0,0,.55) 78%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0 58%, rgba(0,0,0,.55) 78%, transparent 100%);
}
/* Only the clips that were authored before the cutter learned to bake the
   mirror in need flipping here. The newer ones are already mirrored on disk
   (the split script runs hflip on the left crop), so flipping them again would
   put them back the way they started. The list lives in SCENE_CSS_MIRRORED. */
#holo-scene .holo-scene-img.is-mirrored {
  transform: scaleX(-1);
}
#holo-scene .holo-scene-scrim {
  position: absolute;
  inset: 0;
  /* The original ran 90deg behind the left column. Moved to the right one the
     axis is mirrored, so the strong stop (100%) still lands on the edge that
     meets the conversation and the plate sinks into the content there instead
     of ending in a seam. */
  background:
    linear-gradient(270deg, rgba(12,9,6,.26) 0%, rgba(12,9,6,.08) 58%, rgba(12,9,6,.58) 100%),
    linear-gradient(180deg, rgba(16,12,8,.36) 0%, rgba(16,12,8,.10) 26%, rgba(16,12,8,.24) 74%, rgba(16,12,8,.66) 100%),
    rgba(12, 9, 6, .14);
}
#holo-scene .holo-scene-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(10,7,5,.30) 0%,
    rgba(10,7,5,.08) 20%,
    rgba(10,7,5,.16) 52%,
    rgba(10,7,5,.44) 80%,
    rgba(10,7,5,.72) 100%);
}

/* The shell turns to glass so the plate shows through. Scoped to the start
   page: the attribute is set and removed by createScene. */
html[data-holo-scene="on"],
html[data-holo-scene="on"] body {
  background: transparent !important;
}

/* ---- the same plate in the light palette 「麦秋晨光」 ------------------ */
/* Not a tinted copy: the light plate is printed on paper. The video gets a
   warm duotone and multiplies into the parchment instead of covering it. */
html body:not([data-ds-dark-theme]) #holo-scene {
  background: linear-gradient(180deg, #FBF7EF 0%, #F6EEDF 100%);
}
html body:not([data-ds-dark-theme]) #holo-scene .holo-scene-img {
  opacity: .82;
  filter: saturate(.78) sepia(.16) contrast(.96) brightness(1.02);
  mix-blend-mode: multiply;
}
html body:not([data-ds-dark-theme]) #holo-scene .holo-scene-scrim {
  background:
    linear-gradient(270deg, rgba(251,247,239,.20) 0%, rgba(251,247,239,.04) 55%, rgba(251,247,239,.42) 100%),
    linear-gradient(180deg, rgba(251,247,239,.22) 0%, rgba(251,247,239,.04) 30%, rgba(251,247,239,.26) 100%);
}
html body:not([data-ds-dark-theme]) #holo-scene .holo-scene-veil {
  background: linear-gradient(180deg,
    rgba(251,247,239,.10) 0%,
    rgba(251,247,239,.02) 26%,
    rgba(251,247,239,.16) 62%,
    rgba(251,247,239,.46) 100%);
}

/* ---- alias tokens: the light palette as custom properties ------------- */
html body:not([data-ds-dark-theme]) {
${TOKEN_CSS}
}

/* ---- alias tokens: the dark palette 「星夜麦田」 ---------------------- */
html body[data-ds-dark-theme] {
${TOKEN_CSS_DARK}
}


/* ---- planner: the parchment pad and its wheat-ringed badge ---------------
   Both carry data- attributes rather than ids: the dark-palette rule hides
   every [id^="holo-"] decoration, and this is a tool, not decoration. */
[data-holo-planner] { position: fixed; inset: 0; z-index: 2147482998; pointer-events: none; }

[data-holo-planner-badge] {
  position: fixed;
  display: none;
  place-items: center;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  filter: drop-shadow(0 5px 16px rgba(58, 38, 18, 0.22));
  transition: transform 0.16s ease, filter 0.16s ease;
}

[data-holo-planner][data-holo-planner-open="off"] [data-holo-planner-badge] { display: grid; }

[data-holo-planner-badge]:hover {
  transform: scale(1.04);
  filter: drop-shadow(0 7px 20px rgba(58, 38, 18, 0.3));
}

[data-holo-planner-badge]:active { transform: scale(0.985); }

/* The badge is a stack of two layers, and their order matters: the ring sits
   behind, the photo on top of it. The artwork already carries its own breathing
   room (its opaque body fills only ~66% x 88% of the canvas), so the photo is
   inset here to sit inside the ring's clear centre rather than under its
   spikes. No border-radius: her tail and hand reach past a circle, and clipping
   them read as damage rather than as a badge. */
/* The ring's clear centre is ~51% of the badge, so she is scaled to fill it:
   at 70% x 76% her silhouette nearly touches the wheat while still leaving the
   spikes clear of her ears and tail. The offsets centre her inside that circle,
   not inside the square. */
[data-holo-planner-photo] {
  position: absolute;
  left: 15%;
  top: 12%;
  width: 70%;
  height: 76%;
  object-fit: contain;
  pointer-events: none;
  z-index: 1;
  filter: drop-shadow(0 2px 5px rgba(58, 38, 18, 0.18));
}

/* The ring is the wheat from assets/wheat.png, wound into a circle once at
   build time (assets/planner-ring.png) instead of being redrawn per badge: the
   source is a real strand of wheat, and no amount of CSS bends a horizontal
   strip into a believable ring. */
[data-holo-planner-ring] {
  position: absolute;
  left: -6%;
  top: -6%;
  width: 112%;
  height: 112%;
  display: block;
  pointer-events: none;
  background-image: url("${ASSET_BASE}planner-ring.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.96;
  z-index: 0;
}

html body[data-ds-dark-theme] [data-holo-planner-ring] {
  filter: brightness(1.34) saturate(1.08);
  opacity: 0.9;
}

[data-holo-planner-panel] {
  position: fixed;
  display: none;
  flex-direction: column;
  width: 432px;
  max-width: calc(100vw - 20px);
  min-height: 292px;
  max-height: min(640px, calc(100vh - 20px));
  border-radius: 9px;
  pointer-events: auto;
  color: #33291B;
  background:
    radial-gradient(circle at 16% 10%, rgba(255, 255, 255, 0.62), transparent 44%),
    radial-gradient(circle at 84% 92%, rgba(233, 212, 178, 0.42), transparent 52%),
    linear-gradient(158deg, #FFFCF5 0%, #FBF3E2 48%, #F7EBD6 100%);
  border: 1px solid rgba(184, 130, 43, 0.52);
  box-shadow:
    0 0 0 3px rgba(251, 247, 239, 0.92),
    0 0 0 4px rgba(184, 130, 43, 0.26),
    0 20px 48px rgba(58, 38, 18, 0.28);
  overflow: hidden;
}

[data-holo-planner][data-holo-planner-open="on"] [data-holo-planner-panel] { display: flex; }

[data-holo-planner-head] {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 13px 10px;
  cursor: grab;
  user-select: none;
  border-bottom: 1px solid rgba(184, 130, 43, 0.24);
  background: linear-gradient(180deg, rgba(255, 252, 245, 0.7), rgba(246, 233, 208, 0.34));
}

[data-holo-planner-head]:active { cursor: grabbing; }

[data-holo-planner-title] {
  flex: 1 1 auto;
  font: 600 13.5px/1.3 Georgia, "Songti SC", "Microsoft YaHei", serif;
  letter-spacing: 0.06em;
  color: #7A5B22;
}

[data-holo-planner-count] {
  font: 500 11.5px/1 "Microsoft YaHei", system-ui, sans-serif;
  color: #8C7A61;
  font-variant-numeric: tabular-nums;
}

[data-holo-planner-btn] {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid rgba(184, 130, 43, 0.4);
  border-radius: 6px;
  background: rgba(255, 252, 245, 0.72);
  color: #7A5B22;
  font: 500 13px/1 "Microsoft YaHei", system-ui, sans-serif;
  cursor: pointer;
  transition: background 0.14s ease, border-color 0.14s ease;
}

[data-holo-planner-btn]:hover {
  background: rgba(240, 224, 190, 0.9);
  border-color: rgba(162, 112, 31, 0.62);
}

[data-holo-planner-body] {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 10px 13px 12px;
  gap: 9px;
  overflow-y: auto;
}

[data-holo-planner-input] {
  flex: 1 1 auto;
  width: 100%;
  min-height: 146px;
  resize: none;
  padding: 0 2px;
  border: 0;
  outline: none;
  background-color: transparent;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 26px,
    rgba(184, 130, 43, 0.15) 26px,
    rgba(184, 130, 43, 0.15) 27px
  );
  color: #33291B;
  font: 400 13.5px/27px Georgia, "Songti SC", "Microsoft YaHei", serif;
  caret-color: #A2701F;
  overflow-y: auto;
}

[data-holo-planner-input]::placeholder {
  color: #A9967A;
  font-style: italic;
}

[data-holo-planner-gallery] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
  gap: 7px;
}

[data-holo-planner-gallery]:empty { display: none; }

[data-holo-planner-shot] {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid rgba(184, 130, 43, 0.4);
  background: rgba(255, 253, 247, 0.8);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}

[data-holo-planner-shot] img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

[data-holo-planner-del] {
  position: absolute;
  right: 2px;
  top: 2px;
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(58, 38, 18, 0.62);
  color: #FFFCF5;
  font: 600 11px/1 "Microsoft YaHei", system-ui, sans-serif;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.14s ease;
}

[data-holo-planner-shot]:hover [data-holo-planner-del] { opacity: 1; }

[data-holo-planner-foot] {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 13px 10px;
  border-top: 1px solid rgba(184, 130, 43, 0.22);
  background: linear-gradient(0deg, rgba(246, 233, 208, 0.34), rgba(255, 252, 245, 0.6));
}

[data-holo-planner-hint] {
  flex: 1 1 auto;
  font: 400 11px/1.4 "Microsoft YaHei", system-ui, sans-serif;
  color: #8C7A61;
}

[data-holo-planner-hint][data-holo-planner-warn="on"] { color: #B4432F; }

html body[data-ds-dark-theme] [data-holo-planner-panel] {
  color: #F1E5D0;
  background:
    radial-gradient(circle at 16% 10%, rgba(104, 84, 56, 0.42), transparent 46%),
    radial-gradient(circle at 84% 92%, rgba(58, 44, 26, 0.5), transparent 54%),
    linear-gradient(158deg, #262019 0%, #1E1813 52%, #17120D 100%);
  border-color: rgba(224, 174, 92, 0.46);
  box-shadow:
    0 0 0 3px rgba(22, 18, 13, 0.9),
    0 0 0 4px rgba(224, 174, 92, 0.22),
    0 20px 48px rgba(0, 0, 0, 0.55);
}

html body[data-ds-dark-theme] [data-holo-planner-head] {
  border-bottom-color: rgba(224, 174, 92, 0.24);
  background: linear-gradient(180deg, rgba(44, 36, 26, 0.66), rgba(30, 24, 18, 0.4));
}

html body[data-ds-dark-theme] [data-holo-planner-title] { color: #E0AE5C; }
html body[data-ds-dark-theme] [data-holo-planner-count] { color: #A2917A; }

html body[data-ds-dark-theme] [data-holo-planner-input] {
  color: #F1E5D0;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 26px,
    rgba(224, 174, 92, 0.13) 26px,
    rgba(224, 174, 92, 0.13) 27px
  );
  caret-color: #E0AE5C;
}

html body[data-ds-dark-theme] [data-holo-planner-input]::placeholder { color: #8A7A64; }

html body[data-ds-dark-theme] [data-holo-planner-btn] {
  border-color: rgba(224, 174, 92, 0.36);
  background: rgba(44, 36, 26, 0.7);
  color: #E0AE5C;
}

html body[data-ds-dark-theme] [data-holo-planner-btn]:hover {
  background: rgba(72, 58, 38, 0.9);
  border-color: rgba(224, 174, 92, 0.6);
}

html body[data-ds-dark-theme] [data-holo-planner-shot] {
  border-color: rgba(224, 174, 92, 0.34);
  background: rgba(30, 24, 18, 0.8);
}

html body[data-ds-dark-theme] [data-holo-planner-foot] {
  border-top-color: rgba(224, 174, 92, 0.2);
  background: linear-gradient(0deg, rgba(30, 24, 18, 0.44), rgba(44, 36, 26, 0.6));
}

html body[data-ds-dark-theme] [data-holo-planner-hint] { color: #A2917A; }

html[data-holo-planner-off="on"] [data-holo-planner] { display: none !important; }
/* ---- the planner's header button (simplified mode) --------------------
   Matches the neighbouring header utilities button: 24px tall, 6px radius,
   hairline border. Themed with alias tokens so both palettes follow. */
.holo-planner-btn {
  height: 24px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.28));
  background: transparent;
  color: var(--dsw-alias-label-secondary, #6E5D46);
  font: 500 12.5px/1 "Microsoft YaHei", system-ui, sans-serif;
  cursor: pointer;
  transition: border-color 0.14s ease, color 0.14s ease, background 0.14s ease;
}

.holo-planner-btn:hover {
  border-color: var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.4));
  color: var(--dsw-alias-label-primary, #33291B);
}

html body:not([data-ds-dark-theme]) .holo-planner-btn:hover {
  background: rgba(184, 130, 43, 0.08);
  border-color: rgba(184, 130, 43, 0.52);
  color: #7A5B22;
}

/* ---- voice bubble: the translation above her right shoulder -------------
   Same parchment recipe as the note pad (see [data-holo-planner-panel]):
   warm paper gradient, gold hairline, serif text. It is a data- attribute
   rather than an id, so the dark-palette [id^="holo-"] rule leaves it alone. */
/* ---- the voice bubble: the same parchment plate the promo film uses -----
   Fill, shadow, 6px radius, hairline deckled edge, and a wheat sprig at each
   end. No tail and no double ring: those made it read as a chat popup, while
   the film's captions are flat torn paper. */
[data-holo-voice-bubble] {
  position: fixed;
  z-index: 2147482999;
  display: none;
  max-width: 320px;
  padding: 11px 26px 12px;
  border-radius: 6px;
  pointer-events: auto;
  cursor: pointer;
  color: #6E5D46;
  background-color: rgba(251, 247, 239, 0.95);
  /* the deckled edges, drawn as two thin torn lines instead of a clean stroke */
  background-image:
    linear-gradient(90deg, transparent 0, rgba(220, 201, 168, 0.9) 3%, rgba(220, 201, 168, 0.9) 97%, transparent 100%),
    linear-gradient(90deg, transparent 0, rgba(220, 201, 168, 0.9) 3%, rgba(220, 201, 168, 0.9) 97%, transparent 100%);
  background-size: 100% 1px, 100% 1px;
  background-position: 0 0, 0 100%;
  background-repeat: no-repeat;
  border: 0;
  box-shadow: 0 6px 24px rgba(110, 93, 70, 0.18);
  font: 500 14px/1.72 "Songti SC", Georgia, "Microsoft YaHei", serif;
  letter-spacing: 0.012em;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 260ms ease, transform 260ms ease;
}

/* a wheat sprig at each end, three short strokes each */
[data-holo-voice-bubble]::before,
[data-holo-voice-bubble]::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 9px;
  height: 26px;
  margin-top: -13px;
  background-image:
    linear-gradient(24deg, transparent 44%, rgba(162, 112, 31, 0.52) 44%, rgba(162, 112, 31, 0.52) 52%, transparent 52%),
    linear-gradient(24deg, transparent 44%, rgba(162, 112, 31, 0.52) 44%, rgba(162, 112, 31, 0.52) 52%, transparent 52%),
    linear-gradient(24deg, transparent 44%, rgba(162, 112, 31, 0.52) 44%, rgba(162, 112, 31, 0.52) 52%, transparent 52%);
  background-size: 100% 7px, 100% 7px, 100% 7px;
  background-position: 0 0, 0 10px, 0 20px;
  background-repeat: no-repeat;
}

[data-holo-voice-bubble]::before {
  left: 9px;
  transform: scaleX(-1);
}

[data-holo-voice-bubble]::after {
  right: 9px;
}

[data-holo-voice-bubble][data-holo-voice-state="shown"] {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

[data-holo-voice-bubble][data-holo-voice-state="fading"] {
  display: block;
  opacity: 0;
  transform: translateY(6px);
}

[data-holo-voice-text] { display: block; }

/* dark mode keeps the same geometry, only the paper turns to warm ink */
html body[data-ds-dark-theme] [data-holo-voice-bubble] {
  color: #F1E5D0;
  background-color: rgba(30, 24, 19, 0.96);
  background-image:
    linear-gradient(90deg, transparent 0, rgba(224, 174, 92, 0.55) 3%, rgba(224, 174, 92, 0.55) 97%, transparent 100%),
    linear-gradient(90deg, transparent 0, rgba(224, 174, 92, 0.55) 3%, rgba(224, 174, 92, 0.55) 97%, transparent 100%);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
}

html body[data-ds-dark-theme] [data-holo-voice-bubble]::before,
html body[data-ds-dark-theme] [data-holo-voice-bubble]::after {
  background-image:
    linear-gradient(24deg, transparent 44%, rgba(224, 174, 92, 0.55) 44%, rgba(224, 174, 92, 0.55) 52%, transparent 52%),
    linear-gradient(24deg, transparent 44%, rgba(224, 174, 92, 0.55) 44%, rgba(224, 174, 92, 0.55) 52%, transparent 52%),
    linear-gradient(24deg, transparent 44%, rgba(224, 174, 92, 0.55) 44%, rgba(224, 174, 92, 0.55) 52%, transparent 52%);
}


`



    /** Artwork served by the host half from ./assets (route: /holo-theme/assets/).
        ASSET_BASE itself is declared above STYLE, which embeds one of its URLs. */
    const AVATAR_SRC = ASSET_BASE + 'avatar.jpg'
    const INTRO_SRC = ASSET_BASE + 'intro.jpg'
    const INTRO_AUDIO_SRC = ASSET_BASE + 'intro.mp3'
    const PEEK_SRC = ASSET_BASE + 'peek.png'
    const PEEK_VOICE_SRC = ASSET_BASE + 'peek-voice.wav'
    const LOGO_SRC = ASSET_BASE + 'logo.png'
    /** The folded note pad's badge: her, cut out, inside a wheat ring. */
    const PLANNER_SRC = ASSET_BASE + 'planner.png'
    /** 点记录板徽章时的应答（H182「ぬしの頼みならば喜んで」/「你开口，咱乐意。」）。 */
    const PLANNER_VOICE_SRC = ASSET_BASE + 'voice-H182.wav'
    /** 点右栏待机画面（Holo 立绘）时的应答：H013。 */
    const SCENE_VOICE_SRC = ASSET_BASE + 'voice-H013.wav'
    /** Click cue for the account page's 「查询用量」 button. H015 from the
     *  voice table: 「人の世では何事にも金がかかるからな」. */
    const USAGE_VOICE_SRC = ASSET_BASE + 'voice-H015.wav'
    /** The idle plate behind the right column. Six clips are staged in
        ./素材/动画 and served from there by the host half (route:
        /holo-theme/anime/), so replacing a file on disk is enough -- nothing is
        copied into ./assets. The settings page picks which one shows. */
    const ANIME_BASE = '/holo-theme/anime/'
    /** localStorage: the chosen clip's file name, extension dropped. */
    const SCENE_NAME_KEY = 'dsh-theme-holo.scene-name'
    /** Selector order. Each entry is exactly a file name in ./素材/动画. */
    const SCENE_NAMES = ['赫萝抱臂', '赫萝开心', '缪莉开心1', '缪莉开心2', '赫萝叉腰', '缪莉挥手']
    /** Shipped default: the clip the plate's geometry was tuned against. */
    const SCENE_NAME_DEFAULT = '赫萝开心'
    /* Not a clip: the sentinel that turns the plate off entirely. It is kept out
       of SCENE_NAMES on purpose -- that list is also the file-name source (see
       sceneSrcFor) and the mirror lookup, and a seventh entry there would build a
       URL for a .webm that does not exist. The selector offers SCENE_OPTIONS
       instead, and every consumer tests `=== SCENE_OFF` before touching the
       video. */
    const SCENE_OFF = '关闭动画'
    /** What the <select> renders: the six clips, then the off switch. */
    const SCENE_OPTIONS = SCENE_NAMES.concat([SCENE_OFF])
    /** Fired on `window` when the settings page switches the clip. */
    const SCENE_CHANGE_EVENT = 'dsh-theme-holo:scene-change'
    /* Two clips predate the split script that bakes the mirror into the file:
       they are stored facing the wrong way, so the CSS has to flip them. The
       four newer ones already carry the mirror (the cutter runs hflip on the
       left crop) and must NOT be flipped again. Keep this list in step with
       what is actually on disk -- a clip moved between the two conventions
       looks mirrored backwards. */
    const SCENE_CSS_MIRRORED = ['赫萝抱臂', '赫萝开心']
    /* The plate is a 608x1080 portrait crop laid out at 1:1. The slice is capped
       at this width (see place()) so the mask's fade band always lands on the
       artwork's own edge: a slice wider than the plate left the band sitting in
       the empty margin beside it, which is what made the edge read as a hard
       step instead of a fade. */
    const SCENE_PLATE_WIDTH = 608
    const sceneSrcFor = (name) => ANIME_BASE + encodeURIComponent(name) + '.webm'
    /* Hover preview: one still per clip, taken from the middle of the clip and
       downscaled to 304x540 so the browser holds it in memory cheaply. They live
       in ./assets rather than next to the webm files because they are build
       output -- regenerating them is a script, not an edit. */
    /** Stored name, falling back to the shipped default when absent or unknown. */
    function readSceneName() {
      try {
        const saved = localStorage.getItem(SCENE_NAME_KEY)
        if (saved === SCENE_OFF) return SCENE_OFF
        if (saved !== null && SCENE_NAMES.indexOf(saved) >= 0) return saved
      } catch (error) { /* storage may be unavailable in a headless harness */ }
      return SCENE_NAME_DEFAULT
    }

    /** Boot layers: paper + wolf silhouette, and her with the wolf cut out. */
    const WHEAT_TILE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='200' viewBox='0 0 160 200'%3E%3Cdefs%3E%3Cg id='s'%3E%3Cpath d='M0 0c-2-30-3-54-5-76' stroke='%23000' stroke-width='3.2' fill='none'/%3E%3Cg transform='translate(0 -78)'%3E%3Cg transform='rotate(-17)'%3E%3Cellipse rx='5' ry='11.5' cy='-10'/%3E%3Cellipse rx='5' ry='11.5' cy='-26'/%3E%3Cellipse rx='5' ry='11.5' cy='-42'/%3E%3C/g%3E%3Cg transform='rotate(17)'%3E%3Cellipse rx='5' ry='11.5' cy='-10'/%3E%3Cellipse rx='5' ry='11.5' cy='-26'/%3E%3Cellipse rx='5' ry='11.5' cy='-42'/%3E%3C/g%3E%3Cellipse rx='4.8' ry='11' cy='-58'/%3E%3C/g%3E%3C/g%3E%3C/defs%3E%3Cg fill='%23000'%3E%3Cg transform='translate(28 200) scale(1.05)'%3E%3Cuse href='%23s'/%3E%3C/g%3E%3Cg transform='translate(76 200) scale(.82)'%3E%3Cuse href='%23s'/%3E%3C/g%3E%3Cg transform='translate(122 200) scale(.95)'%3E%3Cuse href='%23s'/%3E%3C/g%3E%3Cg transform='translate(154 200) scale(.7)'%3E%3Cuse href='%23s'/%3E%3C/g%3E%3Cg transform='translate(2 200) scale(.74)'%3E%3Cuse href='%23s'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"


    async function createIntroScene(canvas, HOLO_SRC) {

// 画面与声音共用的时间点（秒）。改这里，两边同步变化。
const FPS = 30;
// capture-only tail: the shipped launch animation stays exactly 12 s,
// the extra seconds exist purely for footage in the trailer.
const CAPTURE_TAIL = (typeof location !== 'undefined' && location.hash.indexOf('videocap=tail') !== -1) ? 5.0 : 0;
const DURATION = 12 + CAPTURE_TAIL;

const CUES = {
  ignite: 0.8,            // 黑暗中，闭着的眼睑先透出红光
  open: [1.15, 1.95],     // 缓缓睁眼（先半睁，再完全睁开）
  blinks: CAPTURE_TAIL > 0 ? [2.45, 2.92, 12.5, 13.9, 15.2, 16.4] : [2.45, 2.92],   // 两次眨眼
  blinkDur: 0.2,
  glance: [3.25, 3.6],    // 视线移向左边——那里有什么东西
  pullback: [3.4, 6.1],   // 镜头在黑暗中后拉
  wolfRim: [3.75, 5.15],  // 狼影的轮廓从背脊到吻部被红光描出
  wolfEye: 4.85,          // 狼影的眼睛亮起
  howl: [5.2, 7.0],       // 狼嚎
  glanceBack: [5.7, 6.05],
  wink: 6.35,             // 赫萝眨一只眼（与原图一致）
  reveal: [6.55, 7.95],   // 光从双眸处炸开，照亮整张画
  settle: [6.55, 8.9],    // 镜头回到全景
  title: 7.9,             // DEEPSEEK 解码出现
  harness: 8.45,
  rein: [8.55, 9.25],     // 一根“缰绳”线拉出来
  boot: [9.05, 9.45, 9.85],
  progress: [9.9, 10.45],
  ready: 10.5,            // 就绪：眼中闪光、狼影眼睛一闪
  tagline: 10.75,
  fadeOut: [11.3 + CAPTURE_TAIL, 12 + CAPTURE_TAIL],    // 只淡出声音，画面停住
};

// 眨眼曲线：0=睁开，1=闭合；闭得快、睁得慢
function blink(t, t0, dur) {
  const u = (t - t0) / dur;
  if (u <= 0 || u >= 1) return 0;
  return u < 0.38 ? Math.sin((u / 0.38) * Math.PI / 2) : Math.cos(((u - 0.38) / 0.62) * Math.PI / 2) ** 2;
}

const BOOT_LINES = [
  { text: 'wolf.awaken()', ok: 'ok' },
  { text: "harness.bind('deepseek')", ok: 'ok' },
  { text: 'context', ok: 'ready' },
];


const C = CUES;
  const W = 1920, H = 1080;
const main = canvas;
const ctx = main.getContext('2d');
const mk = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

// ───────── 工具 ─────────
const clamp = (x, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const lerp = (a, b, u) => a + (b - a) * u;
const smooth = (a, b, t) => { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); };
const ease = (u) => (u = clamp(u), u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
const bump = (t, t0, rise, fall) => t < t0 ? 0 : t < t0 + rise ? smooth(t0, t0 + rise, t) : 1 - smooth(t0 + rise, t0 + rise + fall, t);
const hash = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
// 平滑噪声（用于火光闪烁）
const vnoise = (x, s = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i, s), hash(i + 1, s), u); };

// ───────── 素材 ─────────
const img = new Image();
img.src = HOLO_SRC;
await img.decode();

// 狼影遮罩：原图中暗红色（与狼影同色）的像素
const wolfMask = mk(), wolfRim = mk(), wolfFill = mk();
{
  const raw = mk(), rc = raw.getContext('2d', { willReadFrequently: true });
  rc.drawImage(img, 0, 0);
  const d = rc.getImageData(0, 0, W, H), p = d.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4, r = p[i], g = p[i + 1], b = p[i + 2];
    const on = x < 1500 && r > 95 && r < 200 && g < 125 && b < 125 && r - g > 35 && Math.abs(g - b) < 32;
    p[i] = p[i + 1] = p[i + 2] = 255; p[i + 3] = on ? 255 : 0;
  }
  rc.putImageData(d, 0, 0);
  // 去掉 JPEG 噪点：模糊后再二值化
  const mc = wolfMask.getContext('2d', { willReadFrequently: true });
  mc.filter = 'blur(1.5px)'; mc.drawImage(raw, 0, 0); mc.filter = 'none';
  const m = mc.getImageData(0, 0, W, H), q = m.data;
  for (let i = 3; i < q.length; i += 4) q[i] = q[i] > 120 ? 255 : 0;
  mc.putImageData(m, 0, 0);

  const tint = (blur, color) => {
    const t = mk(), tc = t.getContext('2d');
    tc.filter = `blur(${blur}px)`; tc.drawImage(wolfMask, 0, 0); tc.filter = 'none';
    tc.globalCompositeOperation = 'source-in'; tc.fillStyle = color; tc.fillRect(0, 0, W, H);
    return t;
  };
  const rc2 = wolfRim.getContext('2d');
  rc2.globalCompositeOperation = 'lighter';
  rc2.drawImage(tint(18, 'rgb(150,10,18)'), 0, 0);
  rc2.drawImage(tint(5, 'rgb(255,60,36)'), 0, 0);
  rc2.drawImage(tint(1.2, 'rgb(255,150,90)'), 0, 0);
  rc2.globalCompositeOperation = 'destination-out';
  rc2.globalAlpha = .88; rc2.drawImage(wolfMask, 0, 0); rc2.globalAlpha = 1;
  // 狼影被赫萝挡住的那一侧，轮廓慢慢隐去
  const fade = rc2.createLinearGradient(1370, 0, 1490, 0);
  fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)');
  rc2.fillStyle = fade; rc2.fillRect(1370, 0, W - 1370, H);

  const fc = wolfFill.getContext('2d');
  fc.drawImage(wolfMask, 0, 0);
  fc.globalCompositeOperation = 'source-in'; fc.fillStyle = 'rgb(34,6,8)'; fc.fillRect(0, 0, W, H);
  fc.globalCompositeOperation = 'destination-out'; fc.fillStyle = fade; fc.fillRect(1370, 0, W - 1370, H);
}

// 胶片颗粒
const grains = [0, 1, 2, 3].map((k) => {
  const g = mk(960, 540), gc = g.getContext('2d'), d = gc.createImageData(960, 540);
  for (let i = 0; i < d.data.length; i += 4) { const v = hash(i, k + 7) * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  gc.putImageData(d, 0, 0); return g;
});

const eyeC = mk(), tmp = mk(), tmp2 = mk();
const ec = eyeC.getContext('2d'), tc = tmp.getContext('2d'), t2 = tmp2.getContext('2d');

// ───────── 场景几何（原图坐标）─────────
const EYE_L = { cx: 1534, cy: 555, w: 30, hu: 24, hl: 22, rot: -0.10, ix: 10, iy: 1, rx: 18.5, ry: 23 };
const EYE_R = { cx: 1655, cy: 536, w: 30, hu: 23, hl: 21, rot: -0.16, ix: 6, iy: 2, rx: 18, ry: 22 };
const EYES_MID = { x: 1595, y: 546 };
const WOLF_EYE = { cx: 862, cy: 352, w: 17, hu: 6, hl: 5, rot: -0.22, ix: 0, iy: 0, rx: 9, ry: 7, wolf: true };
const MUZZLE = { x: 628, y: 432, dir: -2.78 };
const GLINT = { x: 1546, y: 546 };

// ───────── 镜头 ─────────
function camera(t) {
  const A = { z: 2.75, x: 1596, y: 548 }, B = { z: 1.2, x: 1010, y: 500 }, F = { z: 1, x: 960, y: 540 };
  let z, x, y;
  if (t < C.pullback[0]) { z = A.z + .15 * t / C.pullback[0]; x = A.x; y = A.y; }
  else if (t < C.settle[0]) {
    const u = ease((t - C.pullback[0]) / (C.pullback[1] - C.pullback[0]));
    z = Math.exp(lerp(Math.log(A.z + .15), Math.log(B.z), u)); x = lerp(A.x, B.x, u); y = lerp(A.y, B.y, u);
  } else if (t < C.settle[1]) {
    const u = ease((t - C.settle[0]) / (C.settle[1] - C.settle[0]));
    z = lerp(B.z, F.z, u); x = lerp(B.x, F.x, u); y = lerp(B.y, F.y, u);
  } else { z = F.z + .014 * (t - C.settle[1]) / (DURATION - C.settle[1]); x = F.x; y = F.y; }
  // 狼嚎时轻微震颤
  const sh = bump(t, C.howl[0], .25, 1.4) * 1.6;
  x += (vnoise(t * 22, 1) - .5) * sh; y += (vnoise(t * 22, 2) - .5) * sh;
  return { z, x, y };
}
const applyCam = (c, cam) => c.setTransform(cam.z, 0, 0, cam.z, W / 2 - cam.x * cam.z, H / 2 - cam.y * cam.z);
const toScreen = (cam, p) => ({ x: (p.x - cam.x) * cam.z + W / 2, y: (p.y - cam.y) * cam.z + H / 2 });

// ───────── 眼睛 ─────────
function almond(c, e, o) {
  const uy = lerp(-e.hu * .35, -e.hu * 1.36, o), ly = lerp(-e.hu * .3, e.hl * 1.32, o);
  c.beginPath();
  c.moveTo(-e.w, 0);
  c.bezierCurveTo(-e.w * .5, uy, e.w * .45, uy, e.w, -e.hu * .08);
  c.bezierCurveTo(e.w * .45, ly, -e.w * .5, ly, -e.w, 0);
  c.closePath();
}
function upperLid(c, e, o) {
  const uy = lerp(-e.hu * .35, -e.hu * 1.36, o);
  c.beginPath(); c.moveTo(-e.w * 1.05, .5); c.bezierCurveTo(-e.w * .5, uy, e.w * .45, uy, e.w * 1.05, -e.hu * .1);
}
function drawEye(c, e, o, I, gx, dil = 0) {
  if (I <= 0.001) return;
  c.save(); c.translate(e.cx, e.cy); c.rotate(e.rot);
  if (o > .02) {
    c.save(); almond(c, e, o); c.clip();
    c.fillStyle = `rgba(255,50,35,${.09 * I})`; c.fillRect(-e.w * 1.2, -e.hu * 2, e.w * 2.4, e.hu * 4);
    const x = e.ix + gx, y = e.iy;
    const g = c.createRadialGradient(x, y + e.ry * .12, 0, x, y, e.ry);
    if (e.wolf) {
      g.addColorStop(0, `rgba(255,230,160,${I})`); g.addColorStop(.45, `rgba(255,120,40,${I})`);
      g.addColorStop(1, `rgba(150,10,0,${.6 * I})`);
    } else {
      g.addColorStop(0, `rgba(255,150,110,${I})`); g.addColorStop(.3, `rgba(250,64,48,${I})`);
      g.addColorStop(.62, `rgba(224,22,32,${I})`); g.addColorStop(.9, `rgba(110,0,10,${.9 * I})`);
      g.addColorStop(1, `rgba(40,0,0,0)`);
    }
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, e.rx, e.ry, 0, 0, Math.PI * 2); c.fill();
    if (!e.wolf) {
      c.strokeStyle = `rgba(255,170,110,${.35 * I})`; c.lineWidth = 1.6;
      c.beginPath(); c.ellipse(x, y + 1, e.rx * .62, e.ry * .62, 0, 0, Math.PI * 2); c.stroke();
    }
    // 竖瞳——狼的眼睛
    c.fillStyle = `rgba(22,0,0,${.88 * Math.min(1, I * 1.4)})`;
    c.beginPath(); c.ellipse(x, y + 1, (e.wolf ? 1.6 : 3.4) + dil, e.wolf ? 6 : 14, 0, 0, Math.PI * 2); c.fill();
    // 上眼睑投下的阴影
    const sg = c.createLinearGradient(0, -e.hu * 1.1, 0, -e.hu * .1);
    sg.addColorStop(0, `rgba(20,0,0,${.5 * I})`); sg.addColorStop(1, 'rgba(20,0,0,0)');
    c.fillStyle = sg; c.fillRect(-e.w * 1.2, -e.hu * 1.5, e.w * 2.4, e.hu * 1.4);
    if (!e.wolf) {
      c.fillStyle = `rgba(255,250,240,${.95 * I})`;
      c.beginPath(); c.arc(x + 2, y - 10, 3.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = `rgba(255,220,200,${.6 * I})`;
      c.beginPath(); c.arc(x - 6, y + 12, 1.7, 0, Math.PI * 2); c.fill();
    }
    c.restore();
  }
  // 眼睑线：闭眼时像一道余烬
  upperLid(c, e, o);
  c.lineCap = 'round';
  c.strokeStyle = `rgba(255,${e.wolf ? 120 : 64},44,${(.3 + .55 * (1 - o)) * I})`;
  c.lineWidth = e.wolf ? 1.6 : 2.8; c.stroke();
  c.restore();
}

function eyeState(t) {
  const ign = smooth(C.ignite, C.ignite + .6, t);
  const flick = .88 + .24 * vnoise(t * 9, 3) * (1 - smooth(C.open[1], C.open[1] + .6, t));
  const howlBoost = 1 + .22 * bump(t, C.howl[0], .3, 1.2);
  const I = ign * flick * howlBoost;
  let o = .5 * smooth(C.open[0], C.open[0] + .4, t) + .5 * smooth(C.open[1] - .3, C.open[1], t);
  for (const b of C.blinks) o *= 1 - blink(t, b, C.blinkDur);
  const wink = smooth(C.wink, C.wink + .11, t);
  const oL = o * (1 - .1 * bump(t, C.wink, .11, .5));
  const oR = o * (1 - wink);
  const gx = -9 * ease((t - C.glance[0]) / (C.glance[1] - C.glance[0])) + 9 * ease((t - C.glanceBack[0]) / (C.glanceBack[1] - C.glanceBack[0]));
  return { I, oL, oR, gx, dil: 1.4 * bump(t, C.howl[0], .4, 1.2) };
}

// ───────── 粒子 ─────────
const EMBERS = Array.from({ length: 70 }, (_, i) => ({ x: hash(i, 11) * W, y: hash(i, 12) * H, v: 30 + hash(i, 13) * 70,
  s: .8 + hash(i, 14) * 2.4, ph: hash(i, 15) * 6.28, f: .4 + hash(i, 16), a: .3 + .7 * hash(i, 17) }));
const MOTES = Array.from({ length: 110 }, (_, i) => ({ x: hash(i, 21) * W, y: hash(i, 22) * H, v: 8 + hash(i, 23) * 26,
  s: .8 + hash(i, 24) * 2.6, ph: hash(i, 25) * 6.28, f: .2 + hash(i, 26) * .6, a: .25 + .75 * hash(i, 27) }));
function particles(c, list, t, alpha, color, drift) {
  if (alpha <= .002) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  for (const p of list) {
    const y = ((p.y - p.v * t) % (H + 80) + H + 80) % (H + 80) - 40;
    const x = p.x + Math.sin(t * p.f + p.ph) * drift + t * 6;
    const tw = .55 + .45 * Math.sin(t * (2 + p.f * 3) + p.ph * 3);
    const a = alpha * p.a * tw;
    const g = c.createRadialGradient(x, y, 0, x, y, p.s * 4);
    g.addColorStop(0, color(a)); g.addColorStop(.25, color(a * .5)); g.addColorStop(1, color(0));
    c.fillStyle = g; c.fillRect(x - p.s * 4, y - p.s * 4, p.s * 8, p.s * 8);
  }
  c.restore();
}

// ───────── 标题 ─────────
const SCRAMBLE = '#%&$@01<>/\\ΛΞΣ▚▞░▒';
function title(c, t) {
  if (t < C.title) return;
  const X = 146;
  c.save();
  c.textBaseline = 'alphabetic';
  // DEEPSEEK：逐字解码
  c.font = '600 108px Bahnschrift';
  const word = 'DEEPSEEK', sp = 7;
  let x = X - 4;
  for (let i = 0; i < word.length; i++) {
    const tr = C.title + .065 * i, a = smooth(tr, tr + .12, t);
    const resolved = t > tr + .3;
    const ch = resolved ? word[i] : SCRAMBLE[Math.floor(hash(i, Math.floor(t * FPS)) * SCRAMBLE.length)];
    const wch = c.measureText(word[i]).width;
    if (a > 0) {
      c.globalAlpha = a * (resolved ? 1 : .55 + .45 * hash(i, Math.floor(t * FPS) + 99));
      c.fillStyle = resolved ? '#5a2425' : '#c4352c';
      const cw = c.measureText(ch).width;
      c.fillText(ch, x + (wch - cw) / 2, 770 + (1 - a) * 16);
    }
    x += wch + sp;
  }
  // HARNESS：字距收拢
  const u = smooth(C.harness, C.harness + .7, t);
  if (u > 0) {
    c.font = '300 40px Bahnschrift'; c.fillStyle = '#8f4c4c'; c.globalAlpha = u;
    let hx = X; const hs = lerp(52, 25.5, easeOut(u));
    for (const ch of 'HARNESS') { c.fillText(ch, hx, 826); hx += c.measureText(ch).width + hs; }
  }
  // 缰绳：一根线拉出来，线头是一颗红点
  const r = easeOut((t - C.rein[0]) / (C.rein[1] - C.rein[0]));
  const LEN = 476;
  if (t > C.rein[0]) {
    c.globalAlpha = 1;
    c.strokeStyle = 'rgba(143,76,76,.75)'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(X, 852); c.lineTo(X + LEN * r, 852); c.stroke();
    const pulse = .75 + .25 * Math.sin((t - C.rein[1]) * 4.2) * smooth(C.rein[1], C.rein[1] + .3, t);
    const glow = 1 + 1.8 * bump(t, C.ready, .06, .6);
    c.shadowColor = 'rgba(230,40,30,.9)'; c.shadowBlur = 14 * glow;
    c.fillStyle = `rgba(214,44,34,${pulse})`;
    c.beginPath(); c.arc(X + LEN * r, 852, 4.5, 0, Math.PI * 2); c.fill();
    c.shadowBlur = 0;
  }
  // 启动日志
  c.font = '19px Consolas';
  BOOT_LINES.forEach((ln, k) => {
    const t0 = C.boot[k]; if (t < t0) return;
    const y = 900 + k * 32, full = '› ' + ln.text;
    const n = Math.min(full.length, Math.floor((t - t0) * 48));
    c.globalAlpha = .9; c.fillStyle = '#8f4c4c';
    c.fillText(full.slice(0, n), X, y);
    const typed = n >= full.length, tEnd = t0 + full.length / 48;
    const active = !typed || (k === BOOT_LINES.length - 1 && t < C.ready);
    if (!typed || (active && k < BOOT_LINES.length - 1)) {
      if (Math.floor(t * 4) % 2 === 0 || !typed) { c.fillStyle = '#c4352c'; c.fillRect(X + c.measureText(full.slice(0, n)).width + 3, y - 15, 10, 18); }
    }
    if (k < BOOT_LINES.length - 1) {
      if (t > tEnd + .08) {
        const tw = c.measureText(full).width, okw = c.measureText(ln.ok).width;
        const dots = Math.max(0, Math.floor((LEN - tw - okw - 24) / c.measureText('·').width));
        const shown = Math.min(dots, Math.floor((t - tEnd - .08) * 160));
        c.fillStyle = 'rgba(143,76,76,.45)'; c.fillText(' ' + '·'.repeat(shown), X + tw, y);
        if (shown >= dots) { c.fillStyle = '#b3302a'; c.font = 'bold 19px Consolas'; c.fillText(ln.ok, X + LEN - okw, y); c.font = '19px Consolas'; }
      }
    } else if (typed) {
      const bx = X + 120, bw = 250, p = ease((t - C.progress[0]) / (C.progress[1] - C.progress[0]));
      c.strokeStyle = 'rgba(143,76,76,.6)'; c.lineWidth = 1; c.strokeRect(bx + .5, y - 13.5, bw, 13);
      const segs = 20, seg = (bw - 4) / segs;
      for (let s = 0; s < segs * p; s++) {
        c.fillStyle = s < Math.floor(segs * p) ? '#a63a33' : 'rgba(166,58,51,.5)';
        c.fillRect(bx + 3 + s * seg, y - 11, seg - 2, 9);
      }
      if (t > C.ready) {
        const okw = (c.font = 'bold 19px Consolas', c.measureText(ln.ok).width);
        c.globalAlpha = .9 * smooth(C.ready, C.ready + .1, t);
        c.fillStyle = '#c4352c'; c.fillText(ln.ok, X + LEN - okw, y);
      }
    }
  });
  // 标语已按要求移除（tagline 时间点保留，不影响其它节拍）
  c.restore();
}

function star(c, x, y, s, rot, a) {
  c.save(); c.translate(x, y); c.rotate(rot); c.globalCompositeOperation = 'lighter';
  const halo = c.createRadialGradient(0, 0, 0, 0, 0, s * 1.1);
  halo.addColorStop(0, `rgba(255,255,255,${a * .8})`); halo.addColorStop(.25, `rgba(255,200,180,${a * .25})`); halo.addColorStop(1, 'rgba(255,160,140,0)');
  c.fillStyle = halo; c.fillRect(-s * 1.2, -s * 1.2, s * 2.4, s * 2.4);
  c.fillStyle = `rgba(255,255,255,${a})`;
  for (let k = 0; k < 2; k++) {
    c.beginPath(); c.moveTo(0, -s); c.lineTo(s * .07, 0); c.lineTo(0, s); c.lineTo(-s * .07, 0); c.closePath(); c.fill();
    c.rotate(Math.PI / 2);
  }
  c.restore();
}

// ───────── 一帧 ─────────
function render(t) {
  t = Number.isFinite(t) ? Math.max(0, t) : 0
  const cam = camera(t), es = eyeState(t);
  const mid = toScreen(cam, EYES_MID);
  const rv = clamp((t - C.reveal[0]) / (C.reveal[1] - C.reveal[0]));
  const dark = t < C.reveal[1] + .1;   // 是否还需要画黑暗中的东西
  const eyeFade = 1 - smooth(C.reveal[0] + .1, C.reveal[0] + 1.2, t);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);

  if (dark) {
    // 眸光映在脸上的一点微光
    const spill = .26 * es.I * Math.max(es.oL, es.oR * .8) * eyeFade;
    if (spill > .003) {
      tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = 'source-over'; tc.clearRect(0, 0, W, H);
      applyCam(tc, cam); tc.drawImage(img, 0, 0); tc.setTransform(1, 0, 0, 1, 0, 0);
      tc.globalCompositeOperation = 'multiply'; tc.fillStyle = 'rgb(255,60,48)'; tc.fillRect(0, 0, W, H);
      tc.globalCompositeOperation = 'destination-in';
      const R = 150 * cam.z, g = tc.createRadialGradient(mid.x, mid.y + 10 * cam.z, 0, mid.x, mid.y + 10 * cam.z, R);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.5, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      tc.fillStyle = g; tc.fillRect(0, 0, W, H);
      tc.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = spill; ctx.drawImage(tmp, 0, 0); ctx.globalAlpha = 1;
    }

    // 狼影：红色轮廓从背脊一路描到吻部
    if (t > C.wolfRim[0]) {
      const front = lerp(1520, 520, easeOut((t - C.wolfRim[0]) / (C.wolfRim[1] - C.wolfRim[0])));
      const fl = .82 + .18 * vnoise(t * 7, 5) + .35 * bump(t, C.howl[0], .2, 1.3);
      t2.setTransform(1, 0, 0, 1, 0, 0); t2.globalCompositeOperation = 'source-over'; t2.clearRect(0, 0, W, H);
      t2.drawImage(wolfFill, 0, 0);
      t2.globalCompositeOperation = 'lighter'; t2.globalAlpha = clamp(fl); t2.drawImage(wolfRim, 0, 0);
      t2.globalAlpha = 1;
      // 描边的“火线”前沿更亮
      t2.globalCompositeOperation = 'source-over';
      const band = t2.createLinearGradient(front - 70, 0, front + 120, 0);
      band.addColorStop(0, 'rgba(0,0,0,0)'); band.addColorStop(.35, 'rgba(0,0,0,1)'); band.addColorStop(1, 'rgba(0,0,0,1)');
      t2.globalCompositeOperation = 'destination-in'; t2.fillStyle = band; t2.fillRect(0, 0, W, H);
      t2.globalCompositeOperation = 'source-over';
      applyCam(ctx, cam); ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(tmp2, 0, 0);
      const hot = 1 - smooth(C.wolfRim[1] - .1, C.wolfRim[1] + .3, t);
      if (hot > 0) {
        const hg = ctx.createRadialGradient(front, 300, 0, front, 300, 420);
        hg.addColorStop(0, `rgba(255,120,60,${.10 * hot})`); hg.addColorStop(1, 'rgba(255,60,30,0)');
        ctx.fillStyle = hg; ctx.fillRect(front - 420, -120, 840, 840);
      }
      // 狼嚎的声波
      ctx.lineCap = 'round';
      for (let k = 0; k < 6; k++) {
        const age = t - (C.howl[0] + k * .3); if (age <= 0 || age > 1.7) continue;
        const r = 40 + age * 300, a = Math.pow(1 - age / 1.7, 1.6) * .8 * (1 - rv);
        ctx.strokeStyle = `rgba(255,70,45,${a})`; ctx.lineWidth = 3.2 - age;
        ctx.shadowColor = 'rgba(255,40,30,.8)'; ctx.shadowBlur = 12 * cam.z;
        ctx.beginPath(); ctx.arc(MUZZLE.x, MUZZLE.y, r, MUZZLE.dir - .42, MUZZLE.dir + .42); ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over';
    }
  }

  // 揭幕：光从双眸处向外漫开
  if (t > C.reveal[0]) {
    const R = 2700 * Math.pow(ease(rv), 1.15), edge = 90 + 560 * rv;
    tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = 'source-over'; tc.clearRect(0, 0, W, H);
    applyCam(tc, cam); tc.drawImage(img, 0, 0); tc.setTransform(1, 0, 0, 1, 0, 0);
    if (rv < 1) {
      tc.globalCompositeOperation = 'destination-in';
      const g = tc.createRadialGradient(mid.x, mid.y, 0, mid.x, mid.y, R + edge);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(R / (R + edge), 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      tc.fillStyle = g; tc.fillRect(0, 0, W, H);
      tc.globalCompositeOperation = 'source-over';
    }
    ctx.drawImage(tmp, 0, 0);
    if (rv < 1) {
      // 光的前沿：一圈暖金色
      ctx.globalCompositeOperation = 'screen';
      const r0 = Math.max(0, R - 60), g = ctx.createRadialGradient(mid.x, mid.y, r0, mid.x, mid.y, R + edge * 1.1);
      g.addColorStop(0, 'rgba(255,190,120,0)'); g.addColorStop(.55, `rgba(255,176,100,${.55 * (1 - rv)})`); g.addColorStop(1, 'rgba(255,120,60,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 闪光与曝光回落
    const flash = bump(t, C.reveal[0], .06, .7);
    const expo = .28 * Math.pow(rv, 2) * (1 - smooth(C.reveal[1] - .3, C.settle[1], t));
    ctx.globalCompositeOperation = 'screen';
    if (flash > 0) {
      const g = ctx.createRadialGradient(mid.x, mid.y, 0, mid.x, mid.y, 700);
      g.addColorStop(0, `rgba(255,240,220,${.85 * flash})`); g.addColorStop(.3, `rgba(255,170,110,${.35 * flash})`); g.addColorStop(1, 'rgba(255,120,60,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    if (expo > 0) { ctx.fillStyle = `rgba(255,214,170,${expo})`; ctx.fillRect(0, 0, W, H); }
    ctx.globalCompositeOperation = 'source-over';
  }

  // 双眸（以及狼影的眼睛），带辉光
  if (eyeFade > 0) {
    ec.setTransform(1, 0, 0, 1, 0, 0); ec.clearRect(0, 0, W, H);
    applyCam(ec, cam);
    drawEye(ec, EYE_L, es.oL, es.I, es.gx, es.dil);
    drawEye(ec, EYE_R, es.oR, es.I, es.gx, es.dil);
    const wI = smooth(C.wolfEye, C.wolfEye + .25, t) * (.85 + .15 * vnoise(t * 8, 9)) * (1 + .3 * bump(t, C.howl[0], .2, 1));
    const wO = smooth(C.wolfEye, C.wolfEye + .2, t) * (1 - blink(t, 6.05, .2));
    drawEye(ec, WOLF_EYE, wO, wI, 0);
    ec.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    const s = cam.z / 2.75 * .6 + .4;
    ctx.globalAlpha = eyeFade; ctx.drawImage(eyeC, 0, 0);
    ctx.filter = `blur(${7 * s}px)`; ctx.globalAlpha = .9 * eyeFade; ctx.drawImage(eyeC, 0, 0);
    ctx.filter = `blur(${26 * s}px)`; ctx.globalAlpha = .75 * eyeFade; ctx.drawImage(eyeC, 0, 0);
    ctx.filter = `blur(${70 * s}px)`; ctx.globalAlpha = .55 * eyeFade; ctx.drawImage(eyeC, 0, 0);
    ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  // 黑暗中飘起的火星，亮起来后是麦田的金色微尘
  particles(ctx, EMBERS, t, .8 * smooth(1.2, 2.6, t) * (1 - smooth(C.reveal[0], C.reveal[0] + .8, t)),
    (a) => `rgba(255,${80 + 40 * a | 0},40,${a})`, 30);
  particles(ctx, MOTES, t, .5 * smooth(C.reveal[0] + .3, C.reveal[1] + .6, t), (a) => `rgba(255,236,190,${a})`, 40);

  // 就绪：眼中一闪，狼影的眼睛也回应一下
  const rd = bump(t, C.ready, .1, 1.0);
  if (rd > 0) {
    const gp = toScreen(cam, GLINT);
    star(ctx, gp.x, gp.y, 64 * rd * cam.z, .3 + (t - C.ready) * 1.2, rd);
    const wp = toScreen(cam, { x: WOLF_EYE.cx, y: WOLF_EYE.cy });
    ctx.globalCompositeOperation = 'screen';
    const g = ctx.createRadialGradient(wp.x, wp.y, 0, wp.x, wp.y, 60 * cam.z);
    g.addColorStop(0, `rgba(255,120,80,${.75 * rd})`); g.addColorStop(.2, `rgba(230,50,40,${.35 * rd})`); g.addColorStop(1, 'rgba(200,30,30,0)');
    ctx.fillStyle = g; ctx.fillRect(wp.x - 70, wp.y - 70, 140, 140);
    ctx.globalCompositeOperation = 'source-over';
  }

  title(ctx, t);

  // 暗角
  const lit = smooth(C.reveal[0], C.reveal[1], t);
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05);
  const vr = lerp(0, 60, lit) | 0, vgc = lerp(0, 18, lit) | 0, vb = lerp(0, 14, lit) | 0;
  vg.addColorStop(0, `rgba(${vr},${vgc},${vb},0)`); vg.addColorStop(1, `rgba(${vr},${vgc},${vb},${lerp(.85, .16, lit)})`);
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

  // 颗粒
  const gi = ((Math.floor(t * FPS) % 4) + 4) % 4;
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .07;
  ctx.drawImage(grains[gi], (gi * 37) % 50 - 50, (gi * 53) % 50 - 50, W + 100, H + 100);
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .022 * (1 - lit);
  ctx.drawImage(grains[(gi + 1) % 4], 0, 0, W, H);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';

  // 开头从全黑淡入（颗粒也是）
  const fin = smooth(0, .5, t);
  if (fin < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - fin})`; ctx.fillRect(0, 0, W, H); }
}

      await document.fonts.load('600 108px Bahnschrift');
      await document.fonts.load('19px Consolas');
      await document.fonts.load('300 22px "Microsoft YaHei"');
      render(0);
      if (typeof window !== 'undefined' && location.hash.indexOf('videocap') !== -1) {
        window.__holoCapture = { seek: (t) => render(t), duration: DURATION };
      }
      return { seek: render, duration: DURATION };

    }

    /**
     * The boot scene: the intro reel from the source package, drawn live on a
     * canvas (same code as scene.html, no pre-rendered video). Any click or key
     * cuts it short; `#boot-hold` parks a frame for design review.
     */
    function createBoot(onFinish) {
      const captureMode = typeof location !== 'undefined' && location.hash.indexOf('videocap') !== -1
      const holdMode = typeof location !== 'undefined' && location.hash.indexOf('boot-hold') !== -1

      // Turned off from the plugin's own row page: no canvas, no audio, no
      // listener. Hand the screen straight back on the next frame so whatever
      // the caller offers on top of it still has somewhere to land.
      const SKIP_KEY = 'dsh-theme-holo.skip-boot'
      let skipBoot = false
      try { skipBoot = localStorage.getItem(SKIP_KEY) === '1' } catch (error) { skipBoot = false }
      if (skipBoot && !captureMode && !holdMode) {
        let disposed = false
        const timer = window.setTimeout(() => {
          if (disposed || typeof onFinish !== 'function') return
          try { onFinish() } catch (error) { /* an offer must never break boot */ }
        }, 0)
        return {
          dispose() {
            disposed = true
            window.clearTimeout(timer)
          },
        }
      }

      const reduced = typeof matchMedia === 'function'
        && matchMedia('(prefers-reduced-motion: reduce)').matches

      const root = document.createElement('div')
      root.id = 'holo-boot'
      root.setAttribute('aria-hidden', 'true')
      root.innerHTML = `
        <canvas class="boot-canvas" width="1920" height="1080"></canvas>
        <button class="boot-sound" type="button"></button>
        <button class="boot-skip" type="button">跳过动画</button>
      `
      const canvas = root.querySelector('.boot-canvas')
      const soundBtn = root.querySelector('.boot-sound')
      const skipBtn = root.querySelector('.boot-skip')

      // Optional score: default off, remembered per machine.
      const SOUND_KEY = 'dsh-theme-holo.intro-sound'
      let soundOn = false
      try { soundOn = localStorage.getItem(SOUND_KEY) === '1' } catch (error) { soundOn = false }

      const audio = document.createElement('audio')
      audio.src = INTRO_AUDIO_SRC
      audio.preload = 'auto'
      root.appendChild(audio)

      const paintSound = () => {
        soundBtn.dataset.on = soundOn ? '1' : '0'
        soundBtn.textContent = soundOn ? '\u266a \u97f3\u6548 \u5f00' : '\u266a \u97f3\u6548 \u5173'
      }
      paintSound()

      document.body.appendChild(root)

      let scene = null
      let raf = 0
      let start = 0
      let done = false
      let timer = 0

      const finish = () => {
        if (done) return
        done = true
        cancelAnimationFrame(raf)
        audio.pause()
        root.classList.add('is-leaving')
        // Stop swallowing clicks the moment the reel is over: the fade takes
        // 620ms, and a pointer-events-free overlay cannot eat a real click.
        root.style.pointerEvents = 'none'
        window.setTimeout(() => root.remove(), 620)
        // Hand the screen back first, then let the caller offer something on top
        // of it — a dialog raised while the reel still covers the viewport is a
        // dialog nobody sees.
        if (typeof onFinish === 'function') window.setTimeout(() => {
          try { onFinish() } catch (error) { /* an offer must never break boot */ }
        }, 660)
      }

      const tick = (now) => {
        if (done || scene === null) return
        const elapsed = (now - start) / 1000
        const t = Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0
        try {
          scene.seek(Math.min(t, scene.duration - 0.001))
        } catch (error) {
          if (typeof window !== 'undefined') window.__holoIntroTickError = String(error && error.stack || error)
          finish()
          return
        }
        if (t >= scene.duration) {
          finish()
          return
        }
        raf = requestAnimationFrame(tick)
      }

      // `#boot-hold` parks the reel for design review; `#boot-hold=11.4` picks the second
      const holdMatch = typeof location !== 'undefined'
        ? /boot-hold(?:=([\d.]+))?/.exec(location.hash)
        : null
      const hold = holdMatch !== null
      const parsedHold = holdMatch !== null && holdMatch[1] !== undefined ? Number(holdMatch[1]) : 10.2
      const holdAt = Number.isFinite(parsedHold) ? Math.min(Math.max(parsedHold, 0), 11.9) : 10.2

      createIntroScene(canvas, INTRO_SRC).then((created) => {
        scene = created
        if (typeof location !== 'undefined' && location.hash.indexOf('videocap') !== -1) {
          return
        }
        if (done) return
        if (hold) {
          scene.seek(holdAt)
          return
        }
        if (reduced) {
          scene.seek(scene.duration - 0.2)
          timer = window.setTimeout(finish, 900)
          return
        }
        start = performance.now()
        raf = requestAnimationFrame(tick)
        if (soundOn) {
          audio.currentTime = 0
          audio.play().catch(() => {
            // autoplay policy: fall back to off, the switch is one click away
            soundOn = false
            paintSound()
          })
        }
      }).catch((error) => {
        // if the canvas path fails for any reason, hand the screen back at once
        if (typeof window !== 'undefined') window.__holoIntroError = String(error && error.stack || error)
        finish()
      })

      const skip = (event) => {
        const target = event.target
        // The score switch is the only control that must not end the reel.
        // The skip button used to be exempted here as well, which left it
        // depending on its own `click` listener alone: a shell that stops
        // propagation during the capture phase never delivers that click, so
        // the button looked dead while clicking anywhere else still skipped.
        // Routing the button through this same listener makes both paths end
        // the reel, and `finish` is idempotent.
        if (target instanceof Element && target.closest('.boot-sound') !== null) return
        finish()
      }
      if (!captureMode) {
        document.addEventListener('pointerdown', skip, true)
        document.addEventListener('keydown', skip, true)
      }

      skipBtn.addEventListener('pointerdown', (event) => event.stopPropagation())
      skipBtn.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        finish()
      })

      soundBtn.addEventListener('pointerdown', (event) => event.stopPropagation())
      soundBtn.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        soundOn = !soundOn
        paintSound()
        try { localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0') } catch (error) { /* ignore */ }
        if (!soundOn) {
          audio.pause()
          return
        }
        // stay in sync with the reel: start where the picture is
        const offset = done || start === 0 ? 0 : (performance.now() - start) / 1000
        if (offset < (scene === null ? 12 : scene.duration)) audio.currentTime = Math.max(0, offset)
        audio.play().catch(() => {
          soundOn = false
          paintSound()
        })
      })

      return {
        dispose() {
          done = true
          cancelAnimationFrame(raf)
          window.clearTimeout(timer)
          audio.pause()
          document.removeEventListener('pointerdown', skip, true)
          document.removeEventListener('keydown', skip, true)
          root.remove()
        },
      }
    }

    /**
     * Tags the small role labels in the transcript ("思考", "读取", "运行命令",
     * "工具调用") so the stylesheet can tint them. The labels carry shared
     * hashed classes, so the only stable handle is their own text.
     */
    function createLogTags() {
      const KINDS = [
        ['思考', 'think'],
        ['读取', 'read'],
        ['图片', 'read'],
        ['搜索', 'read'],
        ['运行命令', 'run'],
        ['工具调用', 'tool'],
        ['写入', 'write'],
        ['编辑', 'write'],
      ]

      const classify = (text) => {
        for (const [prefix, kind] of KINDS) {
          if (text.startsWith(prefix)) return kind
        }
        return null
      }

      const scan = (root) => {
        for (const el of root.querySelectorAll('span[class*="_title_"]')) {
          if (el.dataset.holoKind) continue
          const text = (el.textContent || '').trim()
          if (text.length === 0 || text.length > 8) continue
          const kind = classify(text)
          if (kind !== null) el.dataset.holoKind = kind
        }
      }

      let timer = 0
      const sweep = () => {
        timer = 0
        scan(document)
      }
      const observer = new MutationObserver(() => {
        if (timer !== 0) return
        timer = window.setTimeout(sweep, 180)
      })
      observer.observe(document.body, { childList: true, subtree: true })
      scan(document)

      return {
        dispose() {
          observer.disconnect()
          window.clearTimeout(timer)
          for (const el of document.querySelectorAll('[data-holo-kind]')) delete el.dataset.holoKind
        },
      }
    }

    /**
     * The companion on the composer's edge.
     *
     * One state machine drives everything: a reveal amount (how much of her is
     * above the card), a lean, a step-aside shift and a transient nod. Behaviours
     * only write targets; the loop below eases towards them, so the character
     * never snaps.
     */
    function createPeeker(announce) {
      const reduced = typeof matchMedia === 'function'
        && matchMedia('(prefers-reduced-motion: reduce)').matches

      const root = document.createElement('div')
      root.id = 'holo-peek'
      root.setAttribute('role', 'presentation')

      const pic = document.createElement('img')
      pic.src = PEEK_SRC
      pic.alt = ''
      pic.draggable = false
      root.appendChild(pic)

      const thread = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      thread.id = 'holo-thread'
      const threadPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      thread.appendChild(threadPath)
      document.body.appendChild(thread)

      const fx = document.createElement('div')
      fx.id = 'holo-peek-fx'
      document.body.appendChild(fx)

      // fractions of the artwork height, i.e. how much of her shows
      const SLEEP = 0.18
      const REST = 0.32            // eyes only, no bread (was 0.40; 20% lower)
      const OPEN = 0.62            // hover: chin + bread
      const FULL = 0.58            // typing: a little closer, still under the text
      const SINK = 10              // how far she sits into the card edge

      // Where along the composer she sits, as a fraction of its width. This is
      // the centre of the artwork, not its left edge, so the same fraction
      // places her identically whatever size the artwork resolves to. She is
      // draggable left and right, but the fraction is clamped so the artwork
      // can never leave the composer's horizontal span.
      const PEEK_X_KEY = 'dsh-theme-holo.peek-x'
      const PEEK_X_DEFAULT = 0.72
      let peekXFrac = PEEK_X_DEFAULT
      try {
        const saved = Number.parseFloat(localStorage.getItem(PEEK_X_KEY) || '')
        if (Number.isFinite(saved) && saved > 0 && saved < 1) peekXFrac = saved
      } catch (error) { /* a locked storage just means the default stands */ }

      const clock = () => performance.now()

      let artH = 0
      let card = null
      let cardRect = null
      let geo = { left: 0, width: 0, edge: 0, top: 0, herLeft: 0, fracMin: 0, fracMax: 1 }
      /** Her on-screen box, published to whoever needs to anchor against her
       *  (the voice bubble). Local rather than module-level so createPeeker
       *  stays self-contained — the tests slice this function out and evaluate
       *  it on its own, and a free variable would break that. */
      const peekBox = { left: 0, top: 0, width: 0, height: 0, visible: false }
      let hovering = false
      let hoverSince = 0
      let appleDone = false
      let lastMove = clock()
      let lastRead = 0
      let nodUntil = 0
      let flinchUntil = 0
      let raf = 0
      let disposed = false

      // Her voice. One detached element for the whole lifetime of the peeker:
      // every click rewinds it to zero and plays again, so a rapid second click
      // restarts the line instead of stacking a second copy. The latch is read
      // at click time, not here, so the settings switch takes effect at once
      // without remounting the companion.
      const voice = document.createElement('audio')
      voice.src = PEEK_VOICE_SRC
      voice.preload = 'auto'

      // eased state
      let reveal = REST
      let leanX = 0
      let leanY = 0
      let tilt = 0
      let shift = 0
      let alpha = 1
      let threadOn = false

      const findComposer = () => {
        // The shell paints this card with `background: linear-gradient(...)`,
        // and a background shorthand only sets background-image -- the
        // computed background-color stays rgba(0,0,0,0). Testing the colour
        // alone therefore never matched, findComposer() returned null and the
        // companion sat at display:none. Accept either kind of paint.
        const painted = (el) => {
          const style = getComputedStyle(el)
          if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') return true
          const image = style.backgroundImage
          return typeof image === 'string' && image !== '' && image !== 'none'
        }
        // Preferred anchor: the shell tags the editable surface itself.
        const tagged = document.querySelector('[data-composer-input]')
        if (tagged !== null) {
          let el = tagged.parentElement
          for (let i = 0; i < 6 && el !== null; i += 1) {
            if (painted(el) && el.getBoundingClientRect().width > 320) return el
            el = el.parentElement
          }
        }
        const textbox = document.querySelector('[role="textbox"]')
        let el = textbox
        for (let i = 0; i < 6 && el !== null; i += 1) {
          el = el.parentElement
          if (el === null) break
          if (painted(el) && el.getBoundingClientRect().width > 320) return el
        }
        return null
      }

      /** The reach of the artwork's centre, in composer-width fractions, such
       *  that the artwork itself never pokes past either end of the composer. */
      const fracBounds = (width, rectWidth) => {
        if (!(rectWidth > 0)) return { min: 0.5, max: 0.5 }
        const half = Math.min(0.5, (width / 2) / rectWidth)
        return { min: half, max: 1 - half }
      }

      /** Current rendered height of her artwork, in px, for the bubble anchor. */
      const heightForBox = () => Math.max(1, artH * reveal + SINK)

      /** Publish her live on-screen box. Called from place(), paint() and
       *  onDragMove(), because all three move her: place() on layout changes,
       *  paint() on the eased lean/nod/squash, onDragMove() while the user is
       *  dragging. The voice bubble reads this every frame. */
      const syncPeekBox = () => {
        if (cardRect === null || artH <= 0) {
          peekBox.visible = false
          return
        }
        const h = heightForBox()
        // root.style.left already carries herLeft; shift is the eased offset
        // applied through transform, so it belongs in the box too.
        peekBox.left = geo.herLeft + shift
        peekBox.width = geo.width
        peekBox.height = h
        peekBox.top = cardRect.top - h + SINK
        peekBox.visible = true
      }

      const place = () => {
        const box = findComposer()
        if (box !== card) {
          card = box
        }
        if (card === null) {
          root.style.display = 'none'
          peekBox.visible = false
          return
        }
        const rect = card.getBoundingClientRect()
        if (rect.width < 200) {
          root.style.display = 'none'
          peekBox.visible = false
          return
        }
        cardRect = rect
        const width = Math.min(196, Math.max(138, rect.width * 0.185))
        artH = width * (560 / 575)
        const bounds = fracBounds(width, rect.width)
        peekXFrac = Math.max(bounds.min, Math.min(bounds.max, peekXFrac))
        const herLeft = rect.left + rect.width * peekXFrac - width / 2
        geo = {
          left: rect.left,
          top: rect.top,
          width,
          edge: rect.top,
          herLeft,
          fracMin: bounds.min,
          fracMax: bounds.max,
        }
        root.style.display = 'block'
        root.style.width = `${width.toFixed(1)}px`
        root.style.left = `${herLeft.toFixed(1)}px`
        root.style.bottom = `${(window.innerHeight - rect.top - SINK).toFixed(1)}px`
        root.style.clipPath = `inset(0 0 ${SINK}px 0)`
        // Publish the box so the voice bubble can sit above her right shoulder.
        syncPeekBox()
      }

      const paint = () => {
        if (artH <= 0) return
        const height = Math.max(1, artH * reveal + SINK)
        root.style.height = `${height.toFixed(1)}px`
        root.style.transform = `translateX(${shift.toFixed(1)}px)`
        root.style.opacity = alpha.toFixed(2)
        // A fully faded character must not eat clicks meant for the dialog.
        root.style.pointerEvents = alpha < 0.05 ? 'none' : ''

        const nodding = clock() < nodUntil
        const flinching = clock() < flinchUntil
        const nodOffset = nodding ? 6 : 0
        const squash = flinching ? 0.9 : 1
        pic.style.transform =
          `translate(calc(-50% + ${leanX.toFixed(2)}px), ${(leanY + nodOffset).toFixed(2)}px) ` +
          `rotate(${tilt.toFixed(2)}deg) scale(1, ${squash})`

        // She just moved (height / shift / lean), so republish the box.
        syncPeekBox()
      }

      const drawThread = () => {
        if (!threadOn || cardRect === null || artH <= 0) {
          thread.classList.remove('is-on')
          return
        }
        const rect = root.getBoundingClientRect()
        if (rect.width <= 0) {
          thread.classList.remove('is-on')
          return
        }
        const sx = rect.left + rect.width * 0.34
        const sy = rect.top + rect.height * 0.62
        const ex = cardRect.left + cardRect.width * 0.7
        const ey = cardRect.top + 7
        const cx = (sx + ex) / 2 - 14
        const cy = (sy + ey) / 2 + 16
        threadPath.setAttribute('d', `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`)
        thread.classList.add('is-on')
      }

      const burst = () => {
        const x = geo.left + geo.width * 0.5
        const y = window.innerHeight - Number.parseFloat(root.style.bottom || '0')
        for (let i = 0; i < 6; i += 1) {
          const grain = document.createElement('div')
          grain.className = 'holo-grain'
          grain.style.left = `${(x + (Math.random() - 0.5) * 34).toFixed(0)}px`
          grain.style.top = `${(y - 6).toFixed(0)}px`
          grain.style.setProperty('--gx', `${((Math.random() - 0.5) * 28).toFixed(0)}px`)
          grain.style.setProperty('--gr', `${((Math.random() - 0.5) * 140).toFixed(0)}deg`)
          grain.style.animationDelay = `${(Math.random() * 0.16).toFixed(2)}s`
          fx.appendChild(grain)
          window.setTimeout(() => grain.remove(), 1700)
        }
      }

      const dropApple = () => {
        if (appleDone || artH <= 0) return
        appleDone = true
        const top = window.innerHeight - Number.parseFloat(root.style.bottom || '0') - artH * reveal
        const apple = document.createElement('div')
        apple.className = 'holo-apple'
        apple.style.left = `${(geo.left + geo.width * 0.62).toFixed(0)}px`
        apple.style.top = `${(top + 10).toFixed(0)}px`
        fx.appendChild(apple)
        window.setTimeout(() => {
          apple.remove()
          appleDone = false
          hoverSince = clock()
        }, 3600)
      }

      const read = () => {
        const t = clock()
        const textbox = document.querySelector('[role="textbox"]')
        const text = textbox === null ? '' : (textbox.innerText || textbox.textContent || '').trim()
        const focused = textbox !== null && document.activeElement !== null
          && (document.activeElement === textbox || textbox.contains(document.activeElement))
        const busy = document.querySelector('[role="dialog"], [aria-modal="true"], [role="menu"], [role="listbox"]') !== null
        const stopButton = document.querySelector('button[aria-label*="\u505c\u6b62"]')
        const streaming = stopButton !== null && stopButton.getBoundingClientRect().width > 0
        const idle = (t - lastMove) / 1000
        const hour = new Date().getHours()
        const night = hour >= 23 || hour < 5
        const dozeAfter = night ? 75 : 170

        let target = REST
        let tx = 0
        let ty = 0
        let tt = 0
        let ta = 1
        let tshift = 0

        if (text.length > 420) {
          target = 0.10
          ta = 0.55
          tt = 1.8
        } else if (idle > dozeAfter) {
          target = SLEEP
          ty = 2
        } else if (focused && text.length > 0) {
          target = FULL
          tx = -2.5
          ty = -1.5
          tt = -0.9
        } else if (focused) {
          target = REST
          tx = -0.6
        } else if (streaming) {
          target = OPEN
          tx = -4
          tt = -1.4
        } else if (hovering) {
          target = OPEN
        }

        // shy: the pointer comes close without landing on her
        if (!hovering && !focused && geo.width > 0) {
          const px = lastPointer.x
          const py = lastPointer.y
          const cx = geo.left + geo.width / 2
          const cy = geo.edge - (artH * reveal) / 2
          const near = Math.hypot(px - cx, py - cy) < 96
          if (near) {
            ty += 5
            tt += 1
          }
        }

        if (busy) {
          tshift = Math.round(geo.width * 0.55)
          ta = 0
        }

        st.target = target
        st.tx = tx
        st.ty = ty
        st.tt = tt
        st.ta = ta
        st.tshift = tshift

        st.mood = text.length > 420 ? 'bored'
          : idle > dozeAfter ? 'doze'
            : focused && text.length > 0 ? 'typing'
              : streaming ? 'watch'
                : hovering ? 'hover' : 'rest'

        threadOn = !busy && focused && text.length > 0
        if (hovering && !appleDone && t - hoverSince > 5000) dropApple()
      }

      // eased copies that the loop lerps toward
      const st = { target: REST, tx: 0, ty: 0, tt: 0, ta: 1, tshift: 0, mood: 'rest' }
      const lastPointer = { x: -999, y: -999 }

      const loop = () => {
        if (disposed) return
        const t = clock()
        if (t - lastRead > 110) {
          lastRead = t
          read()
        }
        const k = reduced ? 1 : 0.14

        // she leans towards the pointer; asleep or sulking she barely stirs
        let leanFromPointerX = 0
        let leanFromPointerY = 0
        let leanFromPointerTilt = 0
        if (geo.width > 0 && lastPointer.x > -900) {
          const centreX = geo.herLeft + geo.width / 2
          const centreY = geo.edge - (artH * reveal) / 2
          const dx = lastPointer.x - centreX
          const dy = lastPointer.y - centreY
          const scale = st.mood === 'doze' || st.mood === 'bored' ? 0.2 : 1
          leanFromPointerX = Math.max(-10, Math.min(10, dx * 0.035)) * scale
          leanFromPointerY = Math.max(-3, Math.min(3, dy * 0.014)) * scale
          leanFromPointerTilt = Math.max(-2.2, Math.min(2.2, dx * 0.006)) * scale
        }

        const clampTo = (value, limit) => Math.max(-limit, Math.min(limit, value))

        reveal += (st.target - reveal) * k
        leanX += (clampTo(st.tx + leanFromPointerX, 9) - leanX) * (reduced ? 1 : 0.2)
        leanY += (clampTo(st.ty + leanFromPointerY, 4) - leanY) * (reduced ? 1 : 0.2)
        tilt += (clampTo(st.tt + leanFromPointerTilt, 2.4) - tilt) * (reduced ? 1 : 0.2)
        shift += (st.tshift - shift) * (reduced ? 1 : 0.2)
        alpha += (st.ta - alpha) * (reduced ? 1 : 0.2)
        paint()
        drawThread()
        raf = requestAnimationFrame(loop)
      }

      const onEnter = () => {
        hovering = true
        hoverSince = clock()
      }
      const onLeave = () => {
        hovering = false
        hoverSince = 0
        appleDone = false
      }
      const onClick = () => {
        // A drag that ends on her must not also fire the voice: the pointerup
        // that finishes a drag is followed by a click event.
        if (suppressClick) {
          suppressClick = false
          return
        }
        flinchUntil = clock() + 150
        burst()
        try {
          if (localStorage.getItem(PEEK_VOICE_OFF_KEY) !== '1') {
            voice.pause()
            voice.currentTime = 0
            const started = voice.play()
            if (started !== undefined && typeof started.catch === 'function') started.catch(() => {})
            // Caption the line. Passed in rather than reached for directly, so
            // this function stays self-contained (the tests slice it out).
            if (typeof announce === 'function') announce('peeker')
          }
        } catch (error) { /* a blocked or not-yet-loaded clip must not break the click */ }
      }
      const onPointerMove = (event) => {
        lastPointer.x = event.clientX
        lastPointer.y = event.clientY
        lastMove = clock()
      }

      /* ---- dragging her along the composer --------------------------- */

      // She can be slid left and right; the fraction is clamped to the span of
      // the composer, so she can never be pushed out of view. Vertical travel is
      // ignored on purpose: the edge she hangs from belongs to the composer.
      const DRAG_SLOP = 4
      let drag = null
      let suppressClick = false

      const onDown = (event) => {
        if (event.button !== undefined && event.button !== 0) return
        drag = {
          pointerId: event.pointerId,
          startX: event.clientX,
          origin: peekXFrac,
          moved: false,
          rectWidth: geo.width > 0 ? (cardRect === null ? 0 : cardRect.width) : 0,
        }
        try { root.setPointerCapture(event.pointerId) } catch (error) { /* ignore */ }
      }

      const onDragMove = (event) => {
        if (drag === null || drag.pointerId !== event.pointerId) return
        const dx = event.clientX - drag.startX
        if (!drag.moved && Math.abs(dx) < DRAG_SLOP) return
        drag.moved = true
        root.classList.add('is-dragging')
        if (!(drag.rectWidth > 0)) return
        const next = drag.origin + dx / drag.rectWidth
        const min = Number.isFinite(geo.fracMin) ? geo.fracMin : 0
        const max = Number.isFinite(geo.fracMax) ? geo.fracMax : 1
        peekXFrac = Math.max(min, Math.min(max, next))
        if (cardRect !== null) {
          geo.herLeft = cardRect.left + cardRect.width * peekXFrac - geo.width / 2
          root.style.left = `${geo.herLeft.toFixed(1)}px`
          // Dragging moves her horizontally: keep the published box in step so
          // the voice bubble travels with her.
          syncPeekBox()
        }
      }

      const onDragUp = (event) => {
        if (drag === null || drag.pointerId !== event.pointerId) return
        const moved = drag.moved
        drag = null
        root.classList.remove('is-dragging')
        try { root.releasePointerCapture(event.pointerId) } catch (error) { /* ignore */ }
        if (!moved) return
        suppressClick = true
        try { localStorage.setItem(PEEK_X_KEY, peekXFrac.toFixed(4)) } catch (error) { /* ignore */ }
        place()
      }
      const onKey = (event) => {
        lastMove = clock()
        const target = event.target
        if (event.key !== 'Enter' || event.shiftKey) return
        if (target instanceof Element && target.closest('[role="textbox"]') !== null) nodUntil = clock() + 340
      }
      const onClickDoc = (event) => {
        const target = event.target
        if (target instanceof Element && target.closest('button[aria-label*="\u53d1\u9001"]') !== null) {
          nodUntil = clock() + 340
        }
      }

      place()
      const timer = window.setInterval(place, 900)
      window.addEventListener('resize', place)
      window.addEventListener('scroll', place, true)
      document.addEventListener('pointermove', onPointerMove, true)
      document.addEventListener('keydown', onKey, true)
      document.addEventListener('click', onClickDoc, true)
      root.addEventListener('pointerenter', onEnter)
      root.addEventListener('pointerleave', onLeave)
      root.addEventListener('click', onClick)
      root.addEventListener('pointerdown', onDown)
      root.addEventListener('pointermove', onDragMove)
      root.addEventListener('pointerup', onDragUp)
      root.addEventListener('pointercancel', onDragUp)
      raf = requestAnimationFrame(loop)

      return {
        root,
        peekBox,
        dispose() {
          peekBox.visible = false
          disposed = true
          cancelAnimationFrame(raf)
          window.clearInterval(timer)
          window.removeEventListener('resize', place)
          window.removeEventListener('scroll', place, true)
          document.removeEventListener('pointermove', onPointerMove, true)
          document.removeEventListener('keydown', onKey, true)
          document.removeEventListener('click', onClickDoc, true)
          root.removeEventListener('pointerenter', onEnter)
          root.removeEventListener('pointerleave', onLeave)
          root.removeEventListener('click', onClick)
          root.removeEventListener('pointerdown', onDown)
          root.removeEventListener('pointermove', onDragMove)
          root.removeEventListener('pointerup', onDragUp)
          root.removeEventListener('pointercancel', onDragUp)
          try { voice.pause() } catch (error) { /* ignore */ }
          thread.remove()
          fx.remove()
          root.remove()
        },
      }
    }

    /**
     * The living profile card: her banner still, an avatar ring straddling the
     * edge, and the account label read off the row that summoned it.
     *
     * It is a plain absolutely-positioned box, never a `[role=dialog]`, so it
     * cannot steal focus or trap the pointer. The account menu it previews is
     * left completely untouched.
     */
    function createProfileCard() {
      const root = document.createElement('div')
      root.id = 'holo-profile-card'
      root.setAttribute('aria-hidden', 'true')
      Object.assign(root.style, {
        position: 'fixed',
        left: '10px',
        bottom: '74px',
        width: '272px',
        zIndex: '2147482998',
        borderRadius: '16px',
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, #221A12 0%, #1B1510 100%)',
        boxShadow: '0 0 0 .5px rgba(243,227,199,.18), 0 22px 50px rgba(0,0,0,.6)',
        opacity: '0',
        transform: 'translateY(8px)',
        transition: 'opacity .18s ease, transform .18s ease',
      })

      const banner = document.createElement('div')
      Object.assign(banner.style, {
        position: 'relative',
        height: '153px',
        overflow: 'hidden',
        background: 'radial-gradient(120% 90% at 40% 20%, #3A2A19 0%, #20180F 70%)',
      })

      // A still of her, not the scene clip: the scene carries the source's
      // transparency checkerboard, which turns into obvious plaid at this scale.
      const portrait = document.createElement('img')
      portrait.src = INTRO_SRC
      portrait.alt = ''
      portrait.draggable = false
      Object.assign(portrait.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: '86% 28%',
        transform: 'scale(1.7)',
        transformOrigin: '86% 28%',
        filter: 'saturate(.92) sepia(.08) brightness(.96) contrast(1.02)',
      })
      banner.appendChild(portrait)

      const shade = document.createElement('div')
      Object.assign(shade.style, {
        position: 'absolute',
        inset: '0',
        background: 'radial-gradient(120% 100% at 50% 30%, rgba(22,16,10,0) 38%, rgba(22,16,10,.5) 100%), linear-gradient(180deg, rgba(22,16,10,.1) 0%, rgba(34,26,18,.5) 72%, #1B1510 100%)',
      })
      banner.appendChild(shade)

      const avatar = document.createElement('img')
      avatar.src = AVATAR_SRC
      avatar.alt = ''
      // Positioned against the card (not the banner): the banner clips its own
      // picture with overflow:hidden, which would cut the bottom off this ring.
      // 115 = banner height 153 - 38, so the circle still straddles that edge.
      Object.assign(avatar.style, {
        position: 'absolute',
        left: '14px',
        top: '115px',
        width: '62px',
        height: '62px',
        borderRadius: '50%',
        objectFit: 'cover',
        zIndex: '2',
        boxShadow: '0 0 0 2.5px #1B1510, 0 0 0 3.5px rgba(243,227,199,.28), 0 10px 24px rgba(0,0,0,.5)',
      })

      const body = document.createElement('div')
      body.style.cssText = 'padding:28px 14px 12px'
      const name = document.createElement('div')
      name.style.cssText = 'font:600 13.5px/1.35 var(--dsw-font-family, "Microsoft YaHei", sans-serif);color:#F1E5D0'
      const sub = document.createElement('div')
      sub.textContent = '赫萝的苹果'
      sub.style.cssText = 'margin-top:2px;font:400 11px/1.4 var(--dsw-font-family, "Microsoft YaHei", sans-serif);color:#A38F70'
      body.appendChild(name)
      body.appendChild(sub)

      root.appendChild(banner)
      root.appendChild(body)
      root.appendChild(avatar)

      let visible = false
      return {
        enter(label) {
          if (label) name.textContent = label
          if (visible) return
          visible = true
          root.style.opacity = '1'
          root.style.transform = 'translateY(0)'
        },
        leave() {
          if (!visible) return
          visible = false
          root.style.opacity = '0'
          root.style.transform = 'translateY(8px)'
        },
        dispose() {
          root.remove()
        },
        root,
      }
    }


    // ── whale-widget integration ─────────────────────────────────────────────
    // `dsh-whale-widget` keeps replaceable roles in `$DSH_HOME/whale-roles` and
    // sound groups in `$DSH_HOME/whale-audio`, both fronted by its own
    // same-origin routes. This half POSTs through the very API the widget's own
    // upload UI uses instead of writing those files behind its back, so id
    // allocation, index maintenance and validation stay the widget's business.
    //
    // Two entry points share one idempotent installer:
    //   - a one-shot offer after the boot reel on first run;
    //   - a button on the plugin's own row page (插件 → 已安装 → 赫萝主题), for
    //     anyone who dismissed the offer or installed the theme before the
    //     widget.
    const LINK_BASE = '/holo-theme/link/'
    const WHALE_ROLES_API = '/dsh-whale/roles.json'
    const WHALE_AUDIO_API = '/dsh-whale/audio.json'
    const LINK_ROLES = [
      { file: 'holo-clean.png', name: '赫萝' },
      { file: 'holo-Q-clean.png', name: '赫萝Q版' },
    ]
    const LINK_VOICE = { file: '赫萝语音.WAV', name: '赫萝震惊' }
    const LINK_PROMPT_KEY = 'dsh-theme-holo.whale-link-prompted'

    /** One JSON round-trip that treats a non-`{ok:true}` body as a failure. */
    async function linkJson(url, init) {
      const res = await fetch(url, init)
      const text = await res.text()
      let body = null
      try {
        body = JSON.parse(text)
      } catch (error) {
        body = null
      }
      if (body === null) throw new Error('返回内容不是 JSON（HTTP ' + res.status + '）')
      if (!res.ok || body.ok !== true) throw new Error(String(body.error || ('HTTP ' + res.status)))
      return body
    }

    /** Read one file from the host's `/holo-theme/link/` route as a data URL. */
    async function linkDataUrl(file, mime) {
      const res = await fetch(LINK_BASE + encodeURIComponent(file), { cache: 'no-store' })
      if (!res.ok) throw new Error('取不到 ' + file + '（HTTP ' + res.status + '）')
      const bytes = new Uint8Array(await res.arrayBuffer())
      let binary = ''
      for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
      }
      return 'data:' + mime + ';base64,' + btoa(binary)
    }

    /**
     * What the widget currently holds. `present` stays false when the widget is
     * not installed at all: its routes do not exist, so the fetch rejects.
     */
    async function linkState() {
      const state = {
        present: false,
        missingRoles: [],
        missingVoice: false,
        missingGroup: false,
        installed: false,
      }
      let roles = null
      try {
        roles = await linkJson(WHALE_ROLES_API)
      } catch (error) {
        return state
      }
      state.present = true
      const names = (roles.roles || []).map((role) => String(role.name || ''))
      state.missingRoles = LINK_ROLES.filter((role) => !names.includes(role.name)).map((role) => role.name)
      let audio = null
      try {
        audio = await linkJson(WHALE_AUDIO_API)
      } catch (error) {
        audio = null
      }
      if (audio === null) {
        state.missingVoice = true
        state.missingGroup = true
      } else {
        const fragments = (audio.fragments || []).filter((item) => item.preset !== true)
        const groups = (audio.groups || []).filter((item) => item.preset !== true)
        state.missingVoice = !fragments.some((item) => String(item.name || '') === LINK_VOICE.name)
        state.missingGroup = !groups.some((item) => String(item.name || '') === LINK_VOICE.name)
      }
      state.installed = state.missingRoles.length === 0 && !state.missingVoice && !state.missingGroup
      return state
    }

    /** Add whatever is missing; never touches anything already there. */
    async function linkInstall(report) {
      const say = (text) => {
        if (typeof report === 'function') report(text)
      }
      const state = await linkState()
      if (!state.present) throw new Error('没有检测到小鲸鱼挂件（dsh-whale-widget）')
      const added = []
      for (const role of LINK_ROLES) {
        if (!state.missingRoles.includes(role.name)) continue
        say('正在添加角色「' + role.name + '」…')
        const image = await linkDataUrl(role.file, 'image/png')
        await linkJson(WHALE_ROLES_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: role.name, image, format: 'png' }),
        })
        added.push('角色「' + role.name + '」')
      }
      if (state.missingVoice || state.missingGroup) {
        let fragmentId = null
        if (state.missingVoice) {
          say('正在添加语音「' + LINK_VOICE.name + '」…')
          const audio = await linkDataUrl(LINK_VOICE.file, 'audio/wav')
          const uploaded = await linkJson(WHALE_AUDIO_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'upload-fragment', name: LINK_VOICE.name, audio }),
          })
          fragmentId = uploaded.id
          added.push('语音片段「' + LINK_VOICE.name + '」')
        } else {
          const audio = await linkJson(WHALE_AUDIO_API)
          const hit = (audio.fragments || []).find((item) =>
            item.preset !== true && String(item.name || '') === LINK_VOICE.name)
          fragmentId = hit === undefined ? null : hit.id
        }
        if (state.missingGroup && fragmentId !== null) {
          say('正在创建音效组「' + LINK_VOICE.name + '」…')
          await linkJson(WHALE_AUDIO_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'save-group', name: LINK_VOICE.name, press: fragmentId, release: '' }),
          })
          added.push('音效组「' + LINK_VOICE.name + '」')
        }
      }
      return added
    }

    /** Parchment dialog, inline-styled so it survives a dark scheme too. */
    function createLinkDialog() {
      const FONT = '"Microsoft YaHei",system-ui,sans-serif'
      const overlay = document.createElement('div')
      overlay.className = 'holo-link-overlay'
      overlay.setAttribute('role', 'dialog')
      overlay.setAttribute('aria-modal', 'true')
      overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;'
        + 'align-items:center;justify-content:center;padding:24px;background:rgba(42,27,14,.38)'

      const panel = document.createElement('div')
      panel.style.cssText = 'width:min(430px,100%);box-sizing:border-box;padding:22px 22px 16px;'
        + 'border-radius:14px;background:#FBF7EF;color:#33291C;border:1px solid #C9B893;'
        + 'box-shadow:0 18px 48px rgba(42,27,14,.32);font:400 14px/1.65 ' + FONT

      const title = document.createElement('div')
      title.textContent = '赫萝 × 小鲸鱼挂件'
      title.style.cssText = 'font:600 16px/1.4 ' + FONT + ';letter-spacing:.02em;color:#33291C'

      const body = document.createElement('p')
      body.textContent = '检测到「小鲸鱼挂件」。可以把赫萝装进去：两个可替换角色（赫萝、赫萝Q版）'
        + '和一条语音（赫萝震惊）。'
      body.style.cssText = 'margin:10px 0 0;color:#4A3823'

      const note = document.createElement('p')
      note.textContent = '只添加缺少的部分，不会动你已有的角色和音效。'
      note.style.cssText = 'margin:8px 0 0;color:#A5947C;font-size:12px'

      const actions = document.createElement('div')
      actions.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;margin-top:18px'

      const makeButton = (label, primary) => {
        const el = document.createElement('button')
        el.type = 'button'
        el.textContent = label
        el.style.cssText = 'cursor:pointer;border-radius:9px;padding:7px 15px;'
          + 'font:500 13px/1.2 ' + FONT + ';'
          + (primary
            ? 'border:1px solid #3A2C1A;background:#3A2C1A;color:#FFFCF5;'
            : 'border:1px solid #C9B893;background:#FFFCF5;color:#4A3823;')
        return el
      }

      const close = () => {
        overlay.remove()
      }

      const setActions = (nodes) => {
        actions.replaceChildren(...nodes)
      }

      const decline = makeButton('暂不安装', false)
      decline.addEventListener('click', close)
      const accept = makeButton('立即安装', true)
      accept.addEventListener('click', () => {
        setActions([])
        body.textContent = '正在安装…'
        note.textContent = '请稍候，完成后这里会显示结果。'
        linkInstall((text) => {
          body.textContent = text
        }).then((added) => {
          body.textContent = added.length === 0
            ? '联动内容已经是最新的了。'
            : '安装完成：' + added.join('、') + '。'
          note.textContent = '随时可以在「插件 → 已安装 → 赫萝主题」里重新运行。'
          const done = makeButton('完成', true)
          done.addEventListener('click', close)
          setActions([done])
        }).catch((error) => {
          body.textContent = '安装失败：' + String((error && error.message) || error)
          note.textContent = '可以稍后从「插件 → 已安装 → 赫萝主题」重试。'
          const later = makeButton('关闭', false)
          later.addEventListener('click', close)
          setActions([later])
        })
      })
      setActions([decline, accept])

      panel.append(title, body, note, actions)
      overlay.appendChild(panel)
      return {
        root: overlay,
        dispose() {
          overlay.remove()
        },
      }
    }

    /** Show the first-install offer at most once per machine. */
    async function maybeOfferLink() {
      let asked = false
      try {
        asked = localStorage.getItem(LINK_PROMPT_KEY) === '1'
      } catch (error) {
        asked = false
      }
      if (asked) return null
      const state = await linkState()
      if (!state.present || state.installed) return null
      try {
        localStorage.setItem(LINK_PROMPT_KEY, '1')
      } catch (error) { /* private mode: ask again next launch, harmless */ }
      const dialog = createLinkDialog()
      document.body.appendChild(dialog.root)
      return dialog
    }

    /**
     * The plugin-row settings page. Needs the shell's React; when it is absent
     * (headless harness) the row simply has no page and the offer still works.
     */
    /** The theme service, captured once the host exposes it (see `apply`). */
    let themeService = null

    /** localStorage latch: `1` switches the peeking companion off. */
    const PEEK_OFF_KEY = 'dsh-theme-holo.peek-off'
    /** localStorage latch: `1` mutes her voice. Absent means sound is on. */
    const PEEK_VOICE_OFF_KEY = 'dsh-theme-holo.peek-voice-off'

    /**
     * localStorage latch: `1` once the first-run light default has run.
     *
     * The host's appearance preference ships as "system", so a machine whose OS
     * is in dark mode lands on the dark GUI — and this theme's 「星夜麦田」
     * palette with it — on the very first load, which reads as "installing the
     * plugin switched me to night mode". New installs therefore start light
     * once. The switch in the settings card is the only thing allowed to turn
     * dark back on, and this latch keeps that first run from ever fighting a
     * choice made later.
     */
    const DARK_DEFAULTED_KEY = 'dsh-theme-holo.dark-defaulted'

    /**
     * First run only: put the host back on its light appearance when it
     * resolved to dark. The preference is written through the theme service so
     * it survives a reload; a shell without that service has nothing persistent
     * to write, so the body attribute is cleared for this session instead.
     */
    const applyFirstRunLight = () => {
      if (typeof document === 'undefined' || !document.body) return
      try {
        if (localStorage.getItem(DARK_DEFAULTED_KEY) === '1') return
      } catch (error) { return }
      let isDark = false
      try { isDark = document.body.hasAttribute('data-ds-dark-theme') } catch (error) { isDark = false }
      if (!isDark) {
        // Already light: nothing to correct, just stop looking.
        try { localStorage.setItem(DARK_DEFAULTED_KEY, '1') } catch (error) { /* ignore */ }
        return
      }
      let done = false
      try {
        if (themeService && typeof themeService.setTheme === 'function') {
          themeService.setTheme('light')
          done = true
        } else {
          document.body.removeAttribute('data-ds-dark-theme')
          done = true
        }
      } catch (error) { done = false }
      if (done) {
        try { localStorage.setItem(DARK_DEFAULTED_KEY, '1') } catch (error) { /* ignore */ }
      }
    }

    /* ---- the floating wordmark ------------------------------------------ */
    // The mark is its own fixed layer over the GUI, not a child of the
    // conversation header: the header's flex box, its container units and its
    // overflow rules all belong to the host, and this plugin has no way to
    // verify how they behave on a machine it cannot drive. A layer of its own
    // sidesteps all of that.
    //
    // Placement is stored as fractions of the viewport rather than pixels, so
    // the mark keeps its corner and its proportion through any resize or
    // maximise with no resize handler at all — the fractions are re-resolved by
    // the layout engine every frame. Idle the layer is inert
    // (pointer-events: none), so it can never swallow a click meant for the GUI
    // underneath; it accepts input only while the settings page has the edit
    // mode on.
    const LOGO_PLACE_KEY = 'dsh-theme-holo.logo-place'
    /** Source artwork aspect ratio: assets/logo.png is 591 x 125. */
    const LOGO_ASPECT = 591 / 125
    /** The shipped default below was measured on this viewport: 2560 x 1440
     *  maximised at 125% display scaling leaves 2048 x 1152 CSS pixels. */
    const LOGO_REF = { w: 2048, h: 1152 }
    /** Shipped default: the placement the mark is actually parked at, read back
     *  out of the app's own storage record instead of guessed. On the reference
     *  viewport that is (867.2, 33.66) with a 75px-tall mark, i.e. 0.4234375 /
     *  0.0292195 / 0.1731445 of the viewport. Kept as raw fractions so the
     *  default needs no reference window to be exact. Change these three numbers
     *  to move the shipped default; 「恢复默认位置」 returns to them. */
    const LOGO_DEFAULT = {
      xPct: 0.4234375,
      yPct: 0.029219507595191253,
      wPct: 0.17314453125,
    }
    /** Width as a fraction of the viewport. At the 2048px-wide reference window
     *  this spans a rendered height of roughly 22px to 238px; the low end keeps
     *  the mark legible, the high end stops a stray drag from filling the
     *  window. */
    const LOGO_W_RANGE = [0.05, 0.55]
    /** Opacity of the mark, and the range the settings slider may reach. Half is
     *  the shipped value: the mark floats over the GUI, so it stays translucent
     *  enough for whatever it covers to stay readable. The floor is well above
     *  zero — an almost invisible mark is one nobody can find again. */
    const LOGO_ALPHA_DEFAULT = 0.5
    const LOGO_ALPHA_RANGE = [0.1, 1]

    const logoState = {
      xPct: LOGO_DEFAULT.xPct,
      yPct: LOGO_DEFAULT.yPct,
      wPct: LOGO_DEFAULT.wPct,
      alpha: LOGO_ALPHA_DEFAULT,
      hidden: false,
      edit: false,
      loaded: false,
    }
    /** The layer paints from this state and the settings card writes it. */
    const logoWatchers = new Set()

    const viewportSize = () => {
      const w = typeof window === 'undefined' ? 0 : Number(window.innerWidth)
      const h = typeof window === 'undefined' ? 0 : Number(window.innerHeight)
      return {
        w: Number.isFinite(w) && w > 0 ? w : 0,
        h: Number.isFinite(h) && h > 0 ? h : 0,
      }
    }

    const clampLogoWidth = (value) => {
      const pct = Number(value)
      if (!Number.isFinite(pct)) return LOGO_DEFAULT.wPct
      return Math.min(Math.max(pct, LOGO_W_RANGE[0]), LOGO_W_RANGE[1])
    }

    const clampLogoAlpha = (value) => {
      const num = Number(value)
      if (!Number.isFinite(num)) return LOGO_ALPHA_DEFAULT
      return Math.min(Math.max(num, LOGO_ALPHA_RANGE[0]), LOGO_ALPHA_RANGE[1])
    }

    /** Rendered height of the mark as a fraction of the viewport, derived from
     *  its width. Only used to keep the whole mark inside the window. */
    const logoHeightPct = (wPct) => {
      const size = viewportSize()
      if (size.w === 0 || size.h === 0) return 0
      return (wPct * size.w / LOGO_ASPECT) / size.h
    }

    const clampLogoX = (value, wPct) => {
      const pct = Number(value)
      if (!Number.isFinite(pct)) return LOGO_DEFAULT.xPct
      return Math.min(Math.max(pct, 0), Math.max(0, 1 - wPct))
    }

    const clampLogoY = (value, wPct) => {
      const pct = Number(value)
      if (!Number.isFinite(pct)) return LOGO_DEFAULT.yPct
      return Math.min(Math.max(pct, 0), Math.max(0, 1 - logoHeightPct(wPct)))
    }

    /** The stored placement resolved to CSS pixels, for the settings readout. */
    const logoMetrics = () => {
      const size = viewportSize()
      const width = logoState.wPct * size.w
      return {
        left: Math.round(logoState.xPct * size.w),
        top: Math.round(logoState.yPct * size.h),
        width: Math.round(width),
        height: Math.round(width / LOGO_ASPECT),
      }
    }

    const loadLogoPlace = () => {
      if (logoState.loaded) return
      logoState.loaded = true
      let raw = null
      try { raw = localStorage.getItem(LOGO_PLACE_KEY) } catch (error) { raw = null }
      if (raw === null) return
      let parsed = null
      try { parsed = JSON.parse(raw) } catch (error) { return }
      if (parsed === null || typeof parsed !== 'object') return
      const wPct = clampLogoWidth(parsed.wPct)
      logoState.wPct = wPct
      logoState.xPct = clampLogoX(parsed.xPct, wPct)
      logoState.yPct = clampLogoY(parsed.yPct, wPct)
      logoState.alpha = clampLogoAlpha(parsed.alpha)
      logoState.hidden = parsed.hidden === true
    }

    const saveLogoPlace = () => {
      try {
        localStorage.setItem(LOGO_PLACE_KEY, JSON.stringify({
          xPct: logoState.xPct,
          yPct: logoState.yPct,
          wPct: logoState.wPct,
          alpha: logoState.alpha,
          hidden: logoState.hidden,
        }))
      } catch (error) { /* private mode: the placement lasts the session */ }
    }

    const notifyLogo = () => {
      for (const watcher of logoWatchers) {
        try { watcher() } catch (error) { /* a dead subscriber must not stop the rest */ }
      }
    }

    const setLogoEdit = (on) => {
      loadLogoPlace()
      const next = on === true
      if (logoState.edit === next) return
      logoState.edit = next
      if (!logoState.edit) saveLogoPlace()
      notifyLogo()
    }

    const resetLogoPlace = () => {
      logoState.wPct = LOGO_DEFAULT.wPct
      logoState.xPct = LOGO_DEFAULT.xPct
      logoState.yPct = LOGO_DEFAULT.yPct
      logoState.alpha = LOGO_ALPHA_DEFAULT
      logoState.hidden = false
      saveLogoPlace()
      notifyLogo()
    }

    /** Set how opaque the mark is. Written on the img rather than the layer, so
     *  the edit ring, the grip and the readout stay fully opaque while the
     *  artwork behind them fades. */
    const setLogoAlpha = (value) => {
      loadLogoPlace()
      const next = clampLogoAlpha(value)
      if (logoState.alpha === next) return
      logoState.alpha = next
      saveLogoPlace()
      notifyLogo()
    }

    /** Show or hide the mark. Hiding leaves the placement untouched, so turning
     *  the mark back on puts it exactly where it was parked — the toggle never
     *  costs someone their careful positioning. */
    const setLogoHidden = (on) => {
      loadLogoPlace()
      const next = on === true
      if (logoState.hidden === next) return
      logoState.hidden = next
      // Hiding must also leave the edit mode: the mark is gone, so there is
      // nothing left to drag, and the settings card would otherwise keep its
      // "编辑中" readout while the layer shows nothing.
      if (logoState.edit) logoState.edit = false
      saveLogoPlace()
      notifyLogo()
    }


    /**
     * Play a line when the account page's 「查询用量」 button is clicked.
     *
     * The button is an <a> whose class comes from a CSS module
     * (AccountSection_module_css_default.linkButton), so the class is hashed and
     * not safe to match. Its text is the stable handle, the same way
     * createLogTags() keys off the label text rather than a class name.
     *
     * Listening in the capture phase means the cue fires even if the shell
     * stops propagation; nothing is preventDefault()ed, so the link still opens
     * the usage page as usual.
     */
    /** The voice-cues handle, or null. Set by the voice-cues effect so the
     *  peeker effect (which mounts earlier) can captions its line at click time
     *  without the two effects depending on each other's lifetime. */
    let holoVoiceAnnounce = null

    /** 当前挂着的记录板实例，供头部按钮调用其 toggle/open。 */
    let holoPlannerHandle = null

    /** The live peeker instance, or null. Registered by the peeking-companion
     *  effect so the voice bubble can anchor above her shoulder without the
     *  two effects depending on each other's lifetime. */
    let holoPeekerHandle = null

    /**
     * Spoken cues attached to shell buttons, plus the bubble that shows the
     * translation while the line plays.
     *
     * Adding a cue is one row in this table — the wiring below is generic, so a
     * new button needs no new code. `label` is the button's exact text (the
     * shell's classes are CSS-module hashed and not safe to match); `zh` is what
     * the bubble shows.
     *
     * Every line here comes from 赫萝语音对照表 (231 clips, see
     * 记录板与语音接入-开发规范.md). Do not re-verify the wording — the table is
     * the source of truth, `zh` is copied from its `zh` field verbatim.
     */
    const VOICE_CUES = [
      /* ---- 按钮类：label 是按钮文本，我们自己播音频 ---- */
      {
        label: '查询用量',
        src: ASSET_BASE + 'voice-H015.wav',
        zh: '人世间，什么都要钱嘛。',
        jp: '人の世では何事にも金がかかるからな',
        id: 'H015',
      },

      /* ---- 触发类：音频由别处播放，我们只补字幕 ----
         这两条的音源是插件自带素材，不在赫萝语音对照表里（已用波形比对
         确认：与 8 条源音轨的最高相关仅 0.2，属噪声水平，也不是漏选的切片）。

         【台词已确认】这两句 zh 由用户给出：
             点探头 -> 「汝怎么了」
             挂件   -> 「怎么会」
         （注：我无法听音频，此前的自动比对只能证明这两段不来自对照表与
         那 8 条源音轨，给不出原文，所以台词一律以用户口述为准。） */
      {
        trigger: 'peeker',
        id: 'PEEK',
        dur: 1.35,
        zh: '汝怎么了',
        jp: '',
      },
      {
        trigger: 'whale',
        id: 'WHALE',
        dur: 0.84,
        zh: '怎么会',
        jp: '',
      },
      {
        // 点记录板徽章。音频由记录板自己播（PLANNER_VOICE_SRC），这里只管字幕。
        trigger: 'planner',
        id: 'H182',
        dur: 2.37,
        zh: '你开口，咱乐意。',
        jp: 'ぬしの頼みならば喜んで',
      },
      {
        label: '充值',
        src: ASSET_BASE + 'voice-H053.wav',
        zh: '总之，咱俩的相遇就是这样。咱一句话就把人给迷住了。',
        jp: 'とまぁ、わっちらが出会うたのはこんな感じじゃ。わっちの一言で惚れさせたんじゃ',
        id: 'H053',
      },
      {
        // 侧栏「新会话」。展开态有可见文字「新会话」，折叠态只有图标，
        // 此时只能靠 aria-label「新建会话」命中，所以两个都登记。
        label: '新会话',
        ariaLabels: ['新建会话'],
        src: ASSET_BASE + 'voice-H203.wav',
        zh: '嗯，肯定在打主意。',
        jp: 'うん、間違いなく考えるの',
        id: 'H203',
      },
      {
        // 侧栏「插件」导航项（sidebar.panellist slot，aria-label 就是「插件」）。
        label: '插件',
        ariaLabels: ['插件'],
        src: ASSET_BASE + 'voice-H193.wav',
        zh: '你要是敢花心，咱就从脑袋开始嘎吱嘎吱把你嚼了。',
        jp: '浮気などしたら頭からバリバリ食べてやるからのー',
        id: 'H193',
      },
      {
        // 点右栏待机画面里的 Holo 立绘。音频由 createScene 自己播。
        trigger: 'scene',
        id: 'H013',
        dur: 5.51,
        zh: '大概到你非抱着咱的尾巴就睡不着、还要撒娇耍赖那么长吧。',
        jp: 'ぬしがわっちの尻尾がないと眠れぬとダダをこねるようになるあたりまでかなぁ',
      },
      {
        // 右栏的展开按钮。注意：它的 aria-label 是「打开右侧边栏」
        // （chrome.expandAria），而 tooltip 文案是「打开侧边栏」（chrome.expand），
        // 两个都登记，保证悬停提示与 aria 都能命中。
        label: '打开侧边栏',
        ariaLabels: ['打开右侧边栏', '打开侧边栏'],
        src: ASSET_BASE + 'voice-H112.wav',
        zh: '哈哈哈，厉害吧，爬得真高。',
        jp: 'くっはっはっは、すごいじゃろ、よく超えておる',
        id: 'H112',
      },
    ]

    /** How long the bubble stays after the line ends, before fading out.
     *  3s: the caption is meant to linger just long enough to read, then go. */
    const VOICE_BUBBLE_HOLD_MS = 3000
    /** Fade duration, kept in step with the CSS transition below. */
    const VOICE_BUBBLE_FADE_MS = 260

    /**
     * The bubble itself. One node for the whole plugin: only one line can be
     * playing at a time, so a second cue reuses the same element rather than
     * stacking bubbles.
     *
     * Placement follows the peeker: it sits above her right shoulder. The
     * peeker publishes its box as `peekBox` on its return value; apply()
     * hands this function a getter for it, and this reads it on every show.
     * A null box (she is hidden or not mounted) falls back to a fixed corner.
     */
    function createVoiceBubble(getPeekBox) {
      const root = document.createElement('div')
      root.setAttribute('data-holo-voice-bubble', '')
      root.setAttribute('data-holo-voice-state', 'hidden')
      root.setAttribute('role', 'status')
      root.setAttribute('aria-live', 'polite')

      const line = document.createElement('div')
      line.setAttribute('data-holo-voice-text', '')
      root.appendChild(line)

      let hideTimer = 0
      let fadeTimer = 0
      let disposed = false
      /** Follow loop: while the bubble is visible it re-anchors every frame,
       *  because she moves (dragging, leaning toward the pointer, nodding, and
       *  the composer itself can shift). A one-shot placement would leave the
       *  bubble behind her. */
      let followRaf = 0
      let lastRight = null
      let lastBottom = null

      const clearTimers = () => {
        if (hideTimer !== 0) { clearTimeout(hideTimer); hideTimer = 0 }
        if (fadeTimer !== 0) { clearTimeout(fadeTimer); fadeTimer = 0 }
      }

      /** True while the bubble is on screen (shown or fading out). */
      const isUp = () => {
        const state = root.getAttribute('data-holo-voice-state')
        return state === 'shown' || state === 'fading'
      }

      const stopFollow = () => {
        if (followRaf !== 0) {
          if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(followRaf)
          followRaf = 0
        }
      }

      const follow = () => {
        followRaf = 0
        if (disposed || !isUp()) return
        place()
        followRaf = requestAnimationFrame(follow)
      }

      const startFollow = () => {
        if (followRaf !== 0) return
        if (typeof requestAnimationFrame !== 'function') return
        followRaf = requestAnimationFrame(follow)
      }

      const place = () => {
        const box = typeof getPeekBox === 'function' ? getPeekBox() : null
        const vw = window.innerWidth
        const vh = window.innerHeight
        // Default: above the composer's right shoulder, used when she is not
        // on screen (the peeker hides itself when there is no composer).
        let anchorRight = vw - 40
        let anchorBottom = 150
        if (box !== null && box.visible) {
          anchorRight = vw - (box.left + box.width)
          anchorBottom = vh - box.top + 10
        }
        const right = Math.max(12, Math.round(anchorRight))
        const bottom = Math.max(12, Math.round(anchorBottom))
        // Write only on change: this now runs every frame while visible, and a
        // redundant style write would keep invalidating layout for nothing.
        if (right !== lastRight) {
          root.style.right = right + 'px'
          lastRight = right
        }
        if (bottom !== lastBottom) {
          root.style.bottom = bottom + 'px'
          lastBottom = bottom
        }
        // Never let it run off the left edge on a narrow window.
        root.style.maxWidth = Math.max(160, Math.min(320, vw - 80)) + 'px'
      }

      const hideNow = () => {
        clearTimers()
        stopFollow()
        root.setAttribute('data-holo-voice-state', 'hidden')
      }

      /** Show a line, then hold, then fade. Returns immediately. */
      const show = (zh, holdMs) => {
        if (disposed) return
        clearTimers()
        line.textContent = zh
        lastRight = null
        lastBottom = null
        place()
        root.setAttribute('data-holo-voice-state', 'shown')
        startFollow()
        const hold = Number.isFinite(holdMs) && holdMs >= 0 ? holdMs : VOICE_BUBBLE_HOLD_MS
        hideTimer = window.setTimeout(() => {
          hideTimer = 0
          if (disposed) return
          root.setAttribute('data-holo-voice-state', 'fading')
          fadeTimer = window.setTimeout(() => {
            fadeTimer = 0
            if (disposed) return
            stopFollow()
            root.setAttribute('data-holo-voice-state', 'hidden')
          }, VOICE_BUBBLE_FADE_MS)
        }, hold)
      }

      // Clicking the bubble dismisses it at once — no waiting out the hold.
      const onClick = (event) => {
        event.stopPropagation()
        hideNow()
      }
      root.addEventListener('click', onClick)

      const onResize = () => {
        if (root.getAttribute('data-holo-voice-state') !== 'hidden') place()
      }
      window.addEventListener('resize', onResize)

      return {
        root,
        show,
        hide: hideNow,
        dispose() {
          disposed = true
          clearTimers()
          stopFollow()
          root.removeEventListener('click', onClick)
          window.removeEventListener('resize', onResize)
          try { root.remove() } catch (error) { /* already gone */ }
        },
      }
    }

    /**
     * The cue dispatcher: one capture-phase click listener for every row in
     * VOICE_CUES. Kept as a single listener on purpose — a per-button listener
     * would have to be re-attached whenever the shell re-renders the settings
     * page, and the capture phase means it still fires if the shell stops
     * propagation.
     */
    function createVoiceCues(bubble) {
      const byLabel = new Map()
      const byTrigger = new Map()
      for (const cue of VOICE_CUES) {
        if (typeof cue.label === 'string') byLabel.set(cue.label, cue)
        if (typeof cue.trigger === 'string') byTrigger.set(cue.trigger, cue)
      }

      const players = new Map()
      let disposed = false

      /** How long the bubble should stay for a cue, in ms.
       *  Button cues read the decoded audio's own length; trigger cues carry an
       *  explicit `dur` because somebody else owns the audio element. */
      const holdFor = (cue, audio) => {
        if (Number.isFinite(cue.dur) && cue.dur > 0) {
          return Math.round(cue.dur * 1000) + VOICE_BUBBLE_HOLD_MS
        }
        try {
          if (audio !== null && audio !== undefined
            && Number.isFinite(audio.duration) && audio.duration > 0) {
            return Math.round(audio.duration * 1000) + VOICE_BUBBLE_HOLD_MS
          }
        } catch (error) { /* duration not ready yet: fall back */ }
        return VOICE_BUBBLE_HOLD_MS
      }

      /** Caption a line whose audio is played by someone else. */
      const announce = (trigger) => {
        if (disposed) return
        const cue = byTrigger.get(trigger)
        if (cue === undefined) return
        bubble.show(cue.zh, holdFor(cue, null))
      }

      const playerFor = (cue) => {
        let audio = players.get(cue.label)
        if (audio === undefined) {
          try {
            audio = new Audio(cue.src)
            audio.preload = 'auto'
            players.set(cue.label, audio)
          } catch (error) {
            return null
          }
        }
        return audio
      }

      /** aria-label → cue。侧栏「新会话」折叠时只有图标、可见文字为空，
       *  必须靠 aria-label（「新建会话」）才能命中。 */
      const byAria = new Map()
      for (const cue of VOICE_CUES) {
        if (Array.isArray(cue.ariaLabels)) {
          for (const aria of cue.ariaLabels) byAria.set(aria, cue)
        }
      }

      /** Walk up from the event target looking for a labelled control. */
      const cueFor = (node) => {
        let el = node
        for (let i = 0; i < 4 && el !== null && el !== undefined; i += 1) {
          if (el.tagName === 'A' || el.tagName === 'BUTTON') {
            const label = (el.textContent || '').trim()
            if (byLabel.has(label)) return byLabel.get(label)
            // 折叠态没有可见文字，退到 aria-label
            const aria = typeof el.getAttribute === 'function'
              ? (el.getAttribute('aria-label') || '').trim()
              : ''
            if (aria !== '' && byAria.has(aria)) return byAria.get(aria)
          }
          el = el.parentElement
        }
        return null
      }

      const play = (cue) => {
        if (disposed) return
        const audio = playerFor(cue)
        if (audio === null) return

        // Restart rather than stack: rapid clicks re-trigger the line.
        try {
          audio.pause()
          audio.currentTime = 0
        } catch (error) { /* ignore */ }

        // The bubble holds for the clip's length plus the fixed tail, so the
        // translation stays up exactly as long as the line is audible.
        bubble.show(cue.zh, holdFor(cue, audio))

        const played = audio.play()
        if (played !== undefined && played !== null && typeof played.catch === 'function') {
          played.catch(() => { /* autoplay blocked: the bubble still showed */ })
        }
      }

      const onClick = (event) => {
        const target = event.target
        if (!(target instanceof Element)) return
        // Never let a click on the bubble itself fire a cue.
        if (typeof target.closest === 'function' && target.closest('[data-holo-voice-bubble]') !== null) return
        const cue = cueFor(target)
        if (cue !== null) play(cue)
      }

      document.addEventListener('click', onClick, true)

      // The whale widget plays its own press sound on pointerdown. We only add
      // the caption, so we watch the element the press lands on. `.dshwv-body`
      // is that plugin's own literal class name (hand-written, not a CSS-module
      // hash), and it is the whale silhouette itself -- so pressing the panels
      // or the editor does not trigger the caption.
      const onWhalePress = (event) => {
        const target = event.target
        if (!(target instanceof Element)) return
        if (typeof target.closest !== 'function') return
        if (target.closest('.dshwv-body') === null) return
        announce('whale')
      }
      document.addEventListener('pointerdown', onWhalePress, true)

      return {
        announce,
        dispose() {
          disposed = true
          document.removeEventListener('click', onClick, true)
          document.removeEventListener('pointerdown', onWhalePress, true)
          for (const audio of players.values()) {
            try { audio.pause() } catch (error) { /* ignore */ }
          }
          players.clear()
        },
      }
    }


    /**
     * The parchment note pad.
     *
     * Two faces: a wheat-ringed badge that sits where the settings left it, and
     * a parchment panel that opens on click. Text lives in localStorage (it is
     * small and wants to be synchronous on every keystroke); pasted images go
     * to IndexedDB, because a couple of screenshots would blow the ~5 MB string
     * quota that one localStorage key shares with everything else on the origin.
     *
     * Both the badge and the panel carry data- attributes instead of ids on
     * purpose: the dark-palette rule `[id^="holo-"] { display: none }` collects
     * every ornament by id, and a note pad is a tool — the user needs it to
     * stay put whatever palette is on.
     */
    const PLANNER_OFF_KEY = 'dsh-theme-holo.planner-off'
    /** 「简化写字板按钮」：开启后不显示徽章，改为头部工具条里的一个按钮。 */
    const PLANNER_SIMPLE_KEY = 'dsh-theme-holo.planner-simple'
    const PLANNER_PLACE_KEY = 'dsh-theme-holo.planner-place'
    const PLANNER_TEXT_KEY = 'dsh-theme-holo.planner-text'
    /** Badge edge length in px. Same band as the peeker (138–196 at
     *  client.js:2115) so the two read as one family of floating props.
     *  151 = 168 minus 10%, after the wheat ring was tightened to hug her. */
    const PLANNER_BADGE_SIZE = 151
    const PLANNER_PANEL_W = 432
    const PLANNER_DB = 'dsh-theme-holo'
    const PLANNER_DB_VERSION = 1
    const PLANNER_STORE = 'planner-images'
    /** Keep the gallery from growing without bound: every image is a real
     *  paste, but nobody needs fifty screenshots in a scratch pad. */
    const PLANNER_MAX_IMAGES = 24

    /** Badge placement defaults to just above the composer's right shoulder,
     *  clear of the peeker (which sits on the composer edge itself). */
    const PLANNER_DEFAULT = { xPct: 0.82, yPct: 0.55 }

    const plannerState = {
      xPct: PLANNER_DEFAULT.xPct,
      yPct: PLANNER_DEFAULT.yPct,
      /** true = 按钮模式（隐藏徽章，用头部按钮打开）；false = 徽章模式。 */
      simple: false,
      /** Panel position in viewport px. Null = never dragged, so paint()
       *  derives it from the badge instead. */
      panelLeft: null,
      panelTop: null,
      open: false,
      off: false,
      loaded: false,
    }
    const plannerWatchers = new Set()

    const clamp01 = (value, fallback) => {
      const num = Number(value)
      if (!Number.isFinite(num)) return fallback
      return Math.min(Math.max(num, 0), 1)
    }

    const loadPlanner = () => {
      if (plannerState.loaded) return
      plannerState.loaded = true
      let raw = null
      try { raw = localStorage.getItem(PLANNER_PLACE_KEY) } catch (error) { raw = null }
      if (raw !== null) {
        let parsed = null
        try { parsed = JSON.parse(raw) } catch (error) { parsed = null }
        if (parsed !== null && typeof parsed === 'object') {
          plannerState.xPct = clamp01(parsed.xPct, PLANNER_DEFAULT.xPct)
          plannerState.yPct = clamp01(parsed.yPct, PLANNER_DEFAULT.yPct)
          const pl = Number(parsed.panelLeft)
          const pt = Number(parsed.panelTop)
          if (Number.isFinite(pl) && Number.isFinite(pt)) {
            plannerState.panelLeft = pl
            plannerState.panelTop = pt
          }
        }
      }
      try { plannerState.off = localStorage.getItem(PLANNER_OFF_KEY) === '1' } catch (error) { /* ignore */ }
      try { plannerState.simple = localStorage.getItem(PLANNER_SIMPLE_KEY) === '1' } catch (error) { /* ignore */ }
    }

    const savePlannerPlace = () => {
      try {
        localStorage.setItem(PLANNER_PLACE_KEY, JSON.stringify({
          xPct: plannerState.xPct,
          yPct: plannerState.yPct,
          panelLeft: plannerState.panelLeft,
          panelTop: plannerState.panelTop,
        }))
      } catch (error) { /* private mode: placement lasts the session */ }
    }

    const notifyPlanner = () => {
      for (const watcher of plannerWatchers) {
        try { watcher() } catch (error) { /* a dead subscriber must not stop the rest */ }
      }
    }

    /** 切换「简化写字板按钮」模式。徽章与按钮互斥，由 notifyPlanner 驱动重绘。 */
    const setPlannerSimple = (on) => {
      loadPlanner()
      const next = on === true
      if (plannerState.simple === next) return
      plannerState.simple = next
      try { localStorage.setItem(PLANNER_SIMPLE_KEY, next ? '1' : '0') } catch (error) { /* ignore */ }
      notifyPlanner()
    }

    /** Reflect the opt-out on <html>. Same mechanism as the peeker's latch
     *  (client.js:4645 writes data-holo-peek): the CSS rule keys off an
     *  attribute, so writing the attribute IS the switch — without this the
     *  settings button would flip state and change nothing on screen. */
    const applyPlannerOff = () => {
      if (typeof document === 'undefined') return
      try {
        document.documentElement.setAttribute('data-holo-planner-off', plannerState.off ? 'on' : 'off')
      } catch (error) { /* no documentElement: nothing to gate */ }
    }

    const setPlannerOff = (on) => {
      loadPlanner()
      const next = on === true
      if (plannerState.off === next) return
      plannerState.off = next
      try { localStorage.setItem(PLANNER_OFF_KEY, next ? '1' : '0') } catch (error) { /* ignore */ }
      applyPlannerOff()
      notifyPlanner()
    }

    /** Open/close the panel. Kept in module state so the settings card and the
     *  layer agree, and so a reload remembers where the user left it. */
    const setPlannerOpen = (on) => {
      loadPlanner()
      const next = on === true
      if (plannerState.open === next) return
      plannerState.open = next
      notifyPlanner()
    }

    // ---------------------------------------------------------------- storage

    /** IndexedDB wrapper. Every failure path returns a usable empty result: a
     *  browser that refuses the database (private mode, disabled storage) still
     *  gets a working note pad, it just cannot keep pictures past a reload. */
    const openPlannerDb = () => new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') { resolve(null); return }
      let request = null
      try { request = indexedDB.open(PLANNER_DB, PLANNER_DB_VERSION) } catch (error) { resolve(null); return }
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(PLANNER_STORE)) {
          db.createObjectStore(PLANNER_STORE, { keyPath: 'id', autoIncrement: true })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
      request.onblocked = () => resolve(null)
    })

    const plannerListImages = async () => {
      const db = await openPlannerDb()
      if (db === null) return []
      const rows = await new Promise((resolve) => {
        let tx = null
        try { tx = db.transaction(PLANNER_STORE, 'readonly') } catch (error) { resolve([]); return }
        const request = tx.objectStore(PLANNER_STORE).getAll()
        request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : [])
        request.onerror = () => resolve([])
      })
      try { db.close() } catch (error) { /* ignore */ }
      rows.sort((a, b) => (a.id || 0) - (b.id || 0))
      return rows
    }

    const plannerAddImage = async (blob) => {
      const db = await openPlannerDb()
      if (db === null) return null
      const row = { blob, addedAt: Date.now() }
      const id = await new Promise((resolve) => {
        let tx = null
        try { tx = db.transaction(PLANNER_STORE, 'readwrite') } catch (error) { resolve(null); return }
        const request = tx.objectStore(PLANNER_STORE).add(row)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => resolve(null)
        tx.onabort = () => resolve(null)
      })
      try { db.close() } catch (error) { /* ignore */ }
      return id === null ? null : id
    }

    const plannerDeleteImage = async (id) => {
      const db = await openPlannerDb()
      if (db === null) return false
      const ok = await new Promise((resolve) => {
        let tx = null
        try { tx = db.transaction(PLANNER_STORE, 'readwrite') } catch (error) { resolve(false); return }
        tx.objectStore(PLANNER_STORE).delete(id)
        tx.oncomplete = () => resolve(true)
        tx.onerror = () => resolve(false)
        tx.onabort = () => resolve(false)
      })
      try { db.close() } catch (error) { /* ignore */ }
      return ok
    }

    /**
     * Build the pad. Everything is plain DOM outside the React tree for the
     * same reason the wordmark is: the settings card re-renders constantly and
     * a textarea that lives in it would lose its caret.
     */
    function createPlanner(announce) {
      loadPlanner()

      const root = document.createElement('div')
      root.setAttribute('data-holo-planner', '')
      root.setAttribute('data-holo-planner-open', 'off')

      // ---- badge (the folded form) ----
      const badge = document.createElement('div')
      badge.setAttribute('data-holo-planner-badge', '')
      badge.setAttribute('role', 'button')
      badge.setAttribute('tabindex', '0')
      badge.setAttribute('title', '羊皮纸便笺')
      badge.setAttribute('aria-label', '打开羊皮纸便笺')

      const ring = document.createElement('span')
      ring.setAttribute('data-holo-planner-ring', '')
      badge.appendChild(ring)

      const photo = document.createElement('img')
      photo.setAttribute('data-holo-planner-photo', '')
      photo.src = PLANNER_SRC
      photo.alt = ''
      photo.draggable = false
      badge.appendChild(photo)

      // ---- panel (the unfolded form) ----
      const panel = document.createElement('div')
      panel.setAttribute('data-holo-planner-panel', '')
      // NOT role="dialog": the peeking companion treats any [role=dialog] in
      // the document as "a modal is open" and fades itself out
      // (client.js:2534). This panel is display:none most of the time, but the
      // attribute would still sit in the DOM and keep her at opacity 0 for
      // good. `region` is the honest role for a section of the page.
      panel.setAttribute('role', 'region')
      panel.setAttribute('aria-label', '羊皮纸便笺')

      const head = document.createElement('div')
      head.setAttribute('data-holo-planner-head', '')

      const title = document.createElement('span')
      title.setAttribute('data-holo-planner-title', '')
      title.textContent = '羊皮纸便笺'

      const count = document.createElement('span')
      count.setAttribute('data-holo-planner-count', '')
      count.textContent = '0 字'

      const foldBtn = document.createElement('button')
      foldBtn.setAttribute('data-holo-planner-btn', '')
      foldBtn.type = 'button'
      foldBtn.title = '收起到图标'
      foldBtn.setAttribute('aria-label', '收起到图标')
      foldBtn.textContent = '—'

      const closeBtn = document.createElement('button')
      closeBtn.setAttribute('data-holo-planner-btn', '')
      closeBtn.type = 'button'
      closeBtn.title = '关闭便笺'
      closeBtn.setAttribute('aria-label', '关闭便笺')
      closeBtn.textContent = '×'

      head.appendChild(title)
      head.appendChild(count)
      head.appendChild(foldBtn)
      head.appendChild(closeBtn)

      const body = document.createElement('div')
      body.setAttribute('data-holo-planner-body', '')

      const input = document.createElement('textarea')
      input.setAttribute('data-holo-planner-input', '')
      input.placeholder = '随手记点什么，也可以直接粘贴图片…'
      input.spellcheck = false

      const gallery = document.createElement('div')
      gallery.setAttribute('data-holo-planner-gallery', '')

      body.appendChild(input)
      body.appendChild(gallery)

      const foot = document.createElement('div')
      foot.setAttribute('data-holo-planner-foot', '')

      const hint = document.createElement('span')
      hint.setAttribute('data-holo-planner-hint', '')
      hint.textContent = '文字自动保存'

      foot.appendChild(hint)

      panel.appendChild(head)
      panel.appendChild(body)
      panel.appendChild(foot)

      root.appendChild(badge)
      root.appendChild(panel)

      // ---- text ----
      let saveTimer = 0
      const saveText = () => {
        try { localStorage.setItem(PLANNER_TEXT_KEY, input.value) } catch (error) { /* ignore */ }
      }
      const scheduleSave = () => {
        if (saveTimer !== 0) clearTimeout(saveTimer)
        saveTimer = setTimeout(() => { saveTimer = 0; saveText() }, 320)
      }
      const updateCount = () => {
        const n = input.value.length
        count.textContent = n + ' 字'
      }

      try {
        const saved = localStorage.getItem(PLANNER_TEXT_KEY)
        if (typeof saved === 'string') input.value = saved
      } catch (error) { /* ignore */ }
      updateCount()

      input.addEventListener('input', () => {
        updateCount()
        scheduleSave()
      })

      // ---- images ----
      let imageIds = []

      const renderGallery = (rows) => {
        gallery.textContent = ''
        imageIds = []
        for (const row of rows) {
          if (row === null || row.blob === undefined) continue
          const cell = document.createElement('div')
          cell.setAttribute('data-holo-planner-shot', '')

          const img = document.createElement('img')
          const url = URL.createObjectURL(row.blob)
          img.src = url
          img.alt = ''
          img.loading = 'lazy'
          img.addEventListener('load', () => URL.revokeObjectURL(url), { once: true })

          const del = document.createElement('button')
          del.setAttribute('data-holo-planner-del', '')
          del.type = 'button'
          del.title = '删除这张图'
          del.setAttribute('aria-label', '删除这张图')
          del.textContent = '×'
          del.addEventListener('click', async (event) => {
            event.stopPropagation()
            await plannerDeleteImage(row.id)
            const next = await plannerListImages()
            renderGallery(next)
          })

          cell.appendChild(img)
          cell.appendChild(del)
          gallery.appendChild(cell)
          imageIds.push(row.id)
        }
      }

      const refreshImages = async () => {
        renderGallery(await plannerListImages())
      }
      refreshImages()

      const pasteImages = async (event) => {
        const data = event.clipboardData
        if (data === null || data === undefined) return
        const files = []
        const items = data.items
        if (items !== undefined && items !== null) {
          for (const item of items) {
            if (item.kind === 'file' && item.type.startsWith('image/')) {
              const file = item.getAsFile()
              if (file !== null) files.push(file)
            }
          }
        }
        if (files.length === 0) {
          const plain = data.files
          if (plain !== undefined && plain !== null) {
            for (const file of plain) {
              if (file.type.startsWith('image/')) files.push(file)
            }
          }
        }
        if (files.length === 0) return
        event.preventDefault()

        let overflow = false
        for (const file of files) {
          if (imageIds.length >= PLANNER_MAX_IMAGES) { overflow = true; break }
          const id = await plannerAddImage(file)
          if (id === null) {
            hint.setAttribute('data-holo-planner-warn', 'on')
            hint.textContent = '这张图没能存下来（浏览器拒绝写入本地存储）'
            setTimeout(() => {
              hint.removeAttribute('data-holo-planner-warn')
              hint.textContent = '文字自动保存'
            }, 3600)
            continue
          }
          imageIds.push(id)
        }
        if (overflow) {
          hint.setAttribute('data-holo-planner-warn', 'on')
          hint.textContent = '最多放 ' + PLANNER_MAX_IMAGES + ' 张图，先删几张吧'
          setTimeout(() => {
            hint.removeAttribute('data-holo-planner-warn')
            hint.textContent = '文字自动保存'
          }, 3600)
        }
        await refreshImages()
      }

      input.addEventListener('paste', (event) => { pasteImages(event) })
      panel.addEventListener('paste', (event) => { pasteImages(event) })

      // ---- placement ----
      const clampBadge = () => {
        const half = (PLANNER_BADGE_SIZE / 2) / Math.max(1, window.innerWidth)
        const halfY = (PLANNER_BADGE_SIZE / 2) / Math.max(1, window.innerHeight)
        plannerState.xPct = Math.min(Math.max(plannerState.xPct, half), 1 - half)
        plannerState.yPct = Math.min(Math.max(plannerState.yPct, halfY), 1 - halfY)
      }

      const paint = () => {
        clampBadge()
        const vw = window.innerWidth
        const vh = window.innerHeight

        const left = Math.round(plannerState.xPct * vw - PLANNER_BADGE_SIZE / 2)
        const top = Math.round(plannerState.yPct * vh - PLANNER_BADGE_SIZE / 2)
        badge.style.width = PLANNER_BADGE_SIZE + 'px'
        badge.style.height = PLANNER_BADGE_SIZE + 'px'
        badge.style.left = left + 'px'
        badge.style.top = top + 'px'

        // The panel opens beside the badge, flipped when there is no room —
        // unless it has been dragged, in which case that spot wins and is only
        // clamped to stay on screen.
        const gap = 14
        const panelW = Math.min(PLANNER_PANEL_W, vw - 20)
        const panelH = Math.min(panel.offsetHeight || 360, vh - 20)
        let panelLeft
        let panelTop
        if (plannerState.panelLeft !== null && plannerState.panelTop !== null) {
          panelLeft = plannerState.panelLeft
          panelTop = plannerState.panelTop
        } else {
          panelLeft = left + PLANNER_BADGE_SIZE + gap
          if (panelLeft + panelW > vw - 10) panelLeft = left - panelW - gap
          if (panelLeft < 10) panelLeft = Math.max(10, Math.min(vw - panelW - 10, left))
          panelTop = top + PLANNER_BADGE_SIZE / 2 - panelH / 2
        }
        panelLeft = Math.max(8, Math.min(vw - panelW - 8, panelLeft))
        panelTop = Math.max(8, Math.min(vh - panelH - 8, panelTop))
        plannerState.panelLeft = panelLeft
        plannerState.panelTop = panelTop
        panel.style.width = panelW + 'px'
        panel.style.left = Math.round(panelLeft) + 'px'
        panel.style.top = Math.round(panelTop) + 'px'

        // 按钮模式（simple）下徽章不出现：入口换成头部工具条里的按钮。
        badge.style.display = plannerState.simple ? 'none' : ''
        root.setAttribute('data-holo-planner-open', plannerState.open ? 'on' : 'off')
      }

      const seen = () => { paint() }
      plannerWatchers.add(seen)

      // ---- drag the badge ----
      /** 徽章应答语音：全程复用同一个 Audio，连点重播不叠音。 */
      let plannerVoice = null

      let drag = null
      const onDown = (event) => {
        if (event.button !== undefined && event.button !== 0) return
        drag = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          originX: plannerState.xPct,
          originY: plannerState.yPct,
          moved: false,
        }
        try { badge.setPointerCapture(event.pointerId) } catch (error) { /* ignore */ }
        event.preventDefault()
      }
      const onMove = (event) => {
        if (drag === null || event.pointerId !== drag.pointerId) return
        const dx = event.clientX - drag.startX
        const dy = event.clientY - drag.startY
        if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 5) return
        drag.moved = true
        plannerState.xPct = drag.originX + dx / Math.max(1, window.innerWidth)
        plannerState.yPct = drag.originY + dy / Math.max(1, window.innerHeight)
        paint()
      }
      const onUp = (event) => {
        if (drag === null) return
        if (event !== undefined && event.pointerId !== undefined && event.pointerId !== drag.pointerId) return
        const moved = drag.moved
        drag = null
        try { badge.releasePointerCapture(event.pointerId) } catch (error) { /* ignore */ }
        if (moved) {
          savePlannerPlace()
          return
        }
        // 点一下徽章：播一句应答，并把译文显示在气泡里（与探头同一套机制）。
        try {
          if (plannerVoice === null) {
            plannerVoice = new Audio(PLANNER_VOICE_SRC)
            plannerVoice.preload = 'auto'
          }
          plannerVoice.pause()
          plannerVoice.currentTime = 0
          const started = plannerVoice.play()
          if (started !== undefined && typeof started.catch === 'function') started.catch(() => {})
        } catch (error) { /* 音频不可用也不能影响打开面板 */ }
        if (typeof announce === 'function') announce('planner')
        setPlannerOpen(true)
      }

      badge.addEventListener('pointerdown', onDown)
      badge.addEventListener('pointermove', onMove)
      badge.addEventListener('pointerup', onUp)
      badge.addEventListener('pointercancel', onUp)

      // ---- open / close ----
      const closePanel = () => { setPlannerOpen(false); paint() }
      const foldPanel = () => { setPlannerOpen(false); paint() }
      foldBtn.addEventListener('click', foldPanel)
      closeBtn.addEventListener('click', closePanel)

      // ---- drag the panel by its title bar ----
      // Offset from the badge, in viewport px, kept in module state so the
      // panel stays where it was put across open/close and reloads. Null means
      // "not moved yet", and then paint() derives the spot beside the badge.
      let panelDrag = null
      const onHeadDown = (event) => {
        if (event.target === foldBtn || event.target === closeBtn) return
        if (event.button !== undefined && event.button !== 0) return
        const rect = panel.getBoundingClientRect()
        panelDrag = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          originLeft: rect.left,
          originTop: rect.top,
        }
        try { head.setPointerCapture(event.pointerId) } catch (error) { /* ignore */ }
        event.preventDefault()
      }
      const onHeadMove = (event) => {
        if (panelDrag === null || event.pointerId !== panelDrag.pointerId) return
        const dx = event.clientX - panelDrag.startX
        const dy = event.clientY - panelDrag.startY
        plannerState.panelLeft = panelDrag.originLeft + dx
        plannerState.panelTop = panelDrag.originTop + dy
        paint()
      }
      const onHeadUp = (event) => {
        if (panelDrag === null) return
        panelDrag = null
        try { head.releasePointerCapture(event.pointerId) } catch (error) { /* ignore */ }
        savePlannerPlace()
      }
      head.addEventListener('pointerdown', onHeadDown)
      head.addEventListener('pointermove', onHeadMove)
      head.addEventListener('pointerup', onHeadUp)
      head.addEventListener('pointercancel', onHeadUp)

      const onKey = (event) => {
        if (event.key !== 'Escape') return
        if (!plannerState.open) return
        closePanel()
      }
      document.addEventListener('keydown', onKey, true)

      const onResize = () => { paint() }
      window.addEventListener('resize', onResize)

      paint()

      return {
        root,
        /** 供头部按钮打开面板（按钮模式下唯一的入口）。 */
        open: () => { setPlannerOpen(true); paint() },
        toggle: () => { setPlannerOpen(!plannerState.open); paint() },
        dispose: () => {
          if (saveTimer !== 0) { clearTimeout(saveTimer); saveTimer = 0; saveText() }
          plannerWatchers.delete(seen)
          badge.removeEventListener('pointerdown', onDown)
          badge.removeEventListener('pointermove', onMove)
          badge.removeEventListener('pointerup', onUp)
          badge.removeEventListener('pointercancel', onUp)
          head.removeEventListener('pointerdown', onHeadDown)
          head.removeEventListener('pointermove', onHeadMove)
          head.removeEventListener('pointerup', onHeadUp)
          head.removeEventListener('pointercancel', onHeadUp)
          document.removeEventListener('keydown', onKey, true)
          window.removeEventListener('resize', onResize)
          if (plannerVoice !== null) {
            try { plannerVoice.pause() } catch (error) { /* ignore */ }
            plannerVoice = null
          }
          try { root.remove() } catch (error) { /* already gone */ }
        },
      }
    }

    /**
     * 头部工具条里的「写字板」按钮（简化模式专用）。
     *
     * 挂在 conversation.session.header.utilities 这个 slot 上——和
     * dsh-prompt-ErrorNotes-desk 的「提示词 / 错误库」是同一个 slot。
     * 它的 order 是 30，我们用 20，于是排在「提示词」左边。
     *
     * 只有在「简化写字板按钮」开启时才渲染；关闭时返回 null，不占位。
     * 样式刻意跟随该工具条的按钮（24px 高、6px 圆角、细边框），
     * 颜色用主题 token，深浅两套自动跟随。
     */
    function createHeaderButton(React) {
      const h = React.createElement
      return function HoloPlannerButton() {
        const [simple, setSimple] = React.useState(() => {
          loadPlanner()
          return plannerState.simple
        })
        const [off, setOff] = React.useState(() => {
          loadPlanner()
          return plannerState.off
        })

        React.useEffect(() => {
          const seen = () => {
            setSimple(plannerState.simple)
            setOff(plannerState.off)
          }
          plannerWatchers.add(seen)
          return () => { plannerWatchers.delete(seen) }
        }, [])

        if (!simple || off) return null

        const onOpen = () => {
          if (holoPlannerHandle !== null && typeof holoPlannerHandle.toggle === 'function') {
            holoPlannerHandle.toggle()
          }
        }

        return h('button', {
          type: 'button',
          onClick: onOpen,
          title: '打开羊皮纸便笺',
          'aria-label': '打开羊皮纸便笺',
          className: 'holo-planner-btn',
        }, '写字板')
      }
    }

    /**
     * The wordmark as a fixed layer. Everything is written straight to the DOM
     * rather than through React: this element lives outside the React tree, so
     * a re-render of the settings card cannot remount it, and a drag costs one
     * style write per pointer move instead of a component pass.
     */
    function createLogoLayer() {
      loadLogoPlace()

      const root = document.createElement('div')
      root.setAttribute('data-holo-logo', '')
      root.setAttribute('data-holo-logo-edit', 'off')
      root.setAttribute('aria-hidden', 'true')

      const img = document.createElement('img')
      img.src = LOGO_SRC
      img.alt = ''
      img.draggable = false
      root.appendChild(img)

      const grip = document.createElement('span')
      grip.setAttribute('data-holo-logo-grip', '')
      grip.title = '拖动改变大小'
      root.appendChild(grip)

      const readout = document.createElement('span')
      readout.setAttribute('data-holo-logo-readout', '')
      root.appendChild(readout)

      let drag = null

      const paint = () => {
        // Hidden takes precedence over everything else: display:none drops the
        // layer out of layout entirely, so it cannot swallow a click or keep
        // the edit mode alive with nothing visible to grab.
        if (logoState.hidden) {
          root.style.display = 'none'
          root.setAttribute('data-holo-logo-edit', 'off')
          root.setAttribute('aria-hidden', 'true')
          return
        }
        root.style.display = ''
        const size = viewportSize()
        // Viewport units, so the mark follows any resize on its own.
        root.style.left = (logoState.xPct * 100) + 'vw'
        root.style.top = (logoState.yPct * 100) + 'vh'
        root.style.width = (logoState.wPct * 100) + 'vw'
        // On the image, not on the layer: the ring, the grip and the readout are
        // siblings of the image, so this leaves them fully opaque.
        img.style.opacity = String(logoState.alpha)
        if (logoState.edit) {
          root.setAttribute('data-holo-logo-edit', 'on')
          root.removeAttribute('aria-hidden')
          const heightPx = size.w === 0 ? 0 : Math.round(logoState.wPct * size.w / LOGO_ASPECT)
          readout.textContent = Math.round(logoState.xPct * size.w) + ', ' +
            Math.round(logoState.yPct * size.h) + ' · 高 ' + heightPx + 'px'
          // The badge hangs below the mark, centred. Two corrections keep it on
          // screen: it flips above when the bottom strip has no room, and it
          // slides sideways so a mark parked against an edge does not push its
          // own label out of the window. offsetWidth is 0 before the first
          // layout, in which case the CSS preferred corner stands.
          const markW = logoState.wPct * size.w
          const markLeft = logoState.xPct * size.w
          const badgeW = readout.offsetWidth || 0
          const want = markLeft + markW / 2 - badgeW / 2
          const span = Math.max(0, size.w - badgeW - 4)
          readout.style.left = (badgeW === 0 ? 0 : Math.min(Math.max(want, 4), span) - markLeft) + 'px'
          const belowRoom = size.h - (logoState.yPct * size.h) - heightPx
          const flip = belowRoom < 26
          readout.style.top = flip ? 'auto' : 'calc(100% + 6px)'
          readout.style.bottom = flip ? 'calc(100% + 6px)' : 'auto'
        } else {
          root.setAttribute('data-holo-logo-edit', 'off')
          root.setAttribute('aria-hidden', 'true')
        }
      }

      const onDown = (event) => {
        // The idle layer never registers here because it is pointer-events:
        // none; the guard is for the frame between a mode switch and a paint.
        if (!logoState.edit) return
        if (event.button !== 0) return
        event.preventDefault()
        event.stopPropagation()
        drag = {
          mode: event.target === grip ? 'size' : 'move',
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          originX: logoState.xPct,
          originY: logoState.yPct,
          originW: logoState.wPct,
        }
        try { root.setPointerCapture(event.pointerId) } catch (error) { /* ignore */ }
      }

      const onMove = (event) => {
        if (drag === null || drag.pointerId !== event.pointerId) return
        event.preventDefault()
        const size = viewportSize()
        if (size.w === 0 || size.h === 0) return
        if (drag.mode === 'move') {
          logoState.xPct = clampLogoX(drag.originX + (event.clientX - drag.startX) / size.w, logoState.wPct)
          logoState.yPct = clampLogoY(drag.originY + (event.clientY - drag.startY) / size.h, logoState.wPct)
        } else {
          // Resizing from the bottom-right grip follows the pointer diagonally.
          // A wider mark may no longer fit where it sat, so the placement is
          // re-clamped after the width changes.
          const grow = ((event.clientX - drag.startX) + (event.clientY - drag.startY)) / 2
          logoState.wPct = clampLogoWidth(drag.originW + (grow * 2) / size.w)
          logoState.xPct = clampLogoX(logoState.xPct, logoState.wPct)
          logoState.yPct = clampLogoY(logoState.yPct, logoState.wPct)
        }
        paint()
        notifyLogo()
      }

      const onUp = (event) => {
        if (drag === null || drag.pointerId !== event.pointerId) return
        drag = null
        try { root.releasePointerCapture(event.pointerId) } catch (error) { /* ignore */ }
        saveLogoPlace()
        paint()
        notifyLogo()
      }

      // Escape leaves the edit mode without hunting for the settings page.
      const onKey = (event) => {
        if (event.key === 'Escape' && logoState.edit) setLogoEdit(false)
      }

      const seen = () => { paint() }
      logoWatchers.add(seen)
      document.addEventListener('keydown', onKey, true)
      root.addEventListener('pointerdown', onDown)
      root.addEventListener('pointermove', onMove)
      root.addEventListener('pointerup', onUp)
      root.addEventListener('pointercancel', onUp)

      paint()

      return {
        root,
        dispose: () => {
          logoWatchers.delete(seen)
          document.removeEventListener('keydown', onKey, true)
          root.removeEventListener('pointerdown', onDown)
          root.removeEventListener('pointermove', onMove)
          root.removeEventListener('pointerup', onUp)
          root.removeEventListener('pointercancel', onUp)
          setLogoEdit(false)
          const host = root.parentNode
          if (host !== null) host.removeChild(root)
        },
      }
    }

    /** The wheat field that rises from the foot of the sidebar.
     *
     *  A fixed layer on <body>, the same shape the wordmark uses — it only
     *  *measures* the host's sidebar column and copies that rectangle into
     *  viewport pixels. Nothing is appended to a host element any more.
     *
     *  That change is the whole fix. As a child of the column the field had to
     *  win a paint order against an opaque fill the host writes on a descendant
     *  the plugin does not own; a stacking context bolted onto that descendant
     *  did not hold, and writing layout properties onto host elements was the
     *  wrong lever anyway. A fixed box is painted in the root stacking context,
     *  so the only thing it has to beat is the frame — which a z-index of 1
     *  settles. The field is still clipped to the column's width and still
     *  rides along on resize, because both are re-measured rather than inherited.
     *
     *  Height alone is measured, never derived from the width — that is what
     *  keeps the stalks from stretching when the column grows. The top of the
     *  field is pinned to the vertical middle of the account row, so it reads as
     *  growing up to the person's own name rather than to an arbitrary line. */
    function createWheatLayer() {
      if (typeof document === 'undefined') return null
      // The column identifies itself by class suffix, which survives a rebuild
      // of the host's hashed stylesheet; the attribute would too, but the
      // column has no stable one.
      const findColumn = () => document.querySelector('[class*="sidebarCol"]')
      if (findColumn() === null) return null

      const root = document.createElement('div')
      root.id = 'holo-wheat'
      root.setAttribute('aria-hidden', 'true')
      const field = document.createElement('i')
      root.appendChild(field)
      document.body.appendChild(root)

      /** The account row is the one anchor in the column with a stable label;
       *  the fallback keeps the strip visible should the label ever change. */
      const accountRow = () => {
        const column = findColumn()
        if (column !== null) {
          const inside = column.querySelector('[aria-label="账号菜单"]')
          if (inside !== null) return inside
        }
        return document.querySelector('[aria-label="账号菜单"]')
      }

      const place = () => {
        // Re-queried every measure: a rail collapse replaces the column node,
        // and a cached reference would then report a stale rectangle forever.
        const column = findColumn()
        if (column === null) {
          root.style.width = '0px'
          return
        }
        const box = column.getBoundingClientRect()
        if (box.height <= 0 || box.width <= 0) {
          root.style.width = '0px'
          return
        }
        const row = accountRow()
        let height
        if (row !== null) {
          const at = row.getBoundingClientRect()
          // Middle of the row, measured against the column foot. Rounding keeps
          // the value off the sub-pixel grid so a repeated layout cannot walk.
          height = Math.round(box.bottom - (at.top + at.height / 2))
        } else {
          height = Math.round(box.height * 0.18)
        }
        // Guard rails: a hidden or scrolled-away row can produce nonsense, and
        // a field taller than its column would be drawn under the whole GUI.
        const max = Math.round(box.height)
        if (!Number.isFinite(height)) height = max * 0.18
        height = Math.min(Math.max(height, 24), max)
        // Viewport pixels, because the box is fixed. `bottom` is the distance
        // from the window's foot to the column's foot, so the field stays glued
        // to the sidebar's bottom edge instead of the window's.
        const viewportH = typeof window !== 'undefined' && window.innerHeight > 0
          ? window.innerHeight
          : box.bottom
        root.style.left = Math.round(box.left) + 'px'
        root.style.width = Math.round(box.width) + 'px'
        root.style.bottom = Math.round(Math.max(0, viewportH - box.bottom)) + 'px'
        root.style.height = height + 'px'
      }

      let queued = 0
      const schedule = () => {
        if (queued !== 0) return
        const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null
        if (raf === null) {
          place()
          return
        }
        queued = raf(() => {
          queued = 0
          place()
        })
      }

      // The column changes size when the window resizes, when the rail is
      // collapsed, and when the account row is pushed around by a long session
      // list — a ResizeObserver covers all three without polling. It is attached
      // to whichever node is the column right now and re-attached if that node
      // is swapped out, since fixed positioning needs a fresh rectangle.
      let observer = null
      const Observer = typeof ResizeObserver === 'function' ? ResizeObserver : null
      let watched = null
      const watch = () => {
        if (Observer === null) return
        const column = findColumn()
        if (column === null || column === watched) return
        if (observer !== null) {
          try { observer.disconnect() } catch (error) { /* ignore */ }
        }
        watched = column
        observer = new Observer(schedule)
        try { observer.observe(column) } catch (error) { observer = null; watched = null }
      }
      watch()
      window.addEventListener('resize', schedule)
      // Capture phase: the shell scrolls its own panes, and the column's viewport
      // rectangle moves with them.
      window.addEventListener('scroll', schedule, true)

      place()
      // First paint lands before the shell has settled its layout, so one more
      // measure on the next frame and one after a beat picks up the final row.
      schedule()
      let settle = 0
      try { settle = window.setTimeout(schedule, 400) } catch (error) { settle = 0 }
      // The observer above only fires on size changes; a rail that is swapped
      // for a different node changes identity without changing size, so the
      // placement re-checks the node on the same slow beat.
      let rebind = 0
      try {
        rebind = window.setInterval(() => { watch(); schedule() }, 2000)
      } catch (error) { rebind = 0 }

      return {
        root,
        dispose: () => {
          window.removeEventListener('resize', schedule)
          window.removeEventListener('scroll', schedule, true)
          if (settle !== 0) window.clearTimeout(settle)
          if (rebind !== 0) window.clearInterval(rebind)
          if (queued !== 0 && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(queued)
          if (observer !== null) observer.disconnect()
          if (root.parentNode !== null) root.parentNode.removeChild(root)
        },
      }
    }

    /** Her, looping behind the right column -- on that column's start page and
     *  nowhere else.
     *
     *  The request was explicit: the plate must not follow anyone into a working
     *  page. So this layer is not permanent -- entering the start page builds
     *  the <video>, leaving it takes the element out of the document and drops
     *  its source. A decoder is the expensive part of a layer like this, and an
     *  idle decoder behind a page nobody is reading buys nothing.
     *
     *  Which page is the start page is the shell's answer, not a guess: the
     *  right column marks its panel with `data-sidebar-right-panel`, its
     *  expanded state with `data-sidebar-right-open`, and its own start page is
     *  the guide element carrying `data-sidebar-right-guide`. Watching those
     *  three means no session-id heuristics and no polling for the tab.
     *
     *  `clearFills` exists because a negative-index layer is painted behind
     *  in-flow backgrounds. The fills that matter (the frame, the column, the
     *  column's panel, and any full-bleed child of it) belong to the shell, so
     *  their inline values are remembered and put back exactly as they were --
     *  the plugin never leaves a host element permanently transparent. This is
     *  the source package's own rule, only retargeted: it cleared the left
     *  column and its ancestors, this clears the right one.
     *
     *  See the STYLE comment on #holo-scene for why the video is oversized and
     *  cropped rather than scaled to the column. */
    function createScene(announce) {
      if (typeof document === 'undefined' || document.body === null) return null
      const root = document.createElement('div')
      root.id = 'holo-scene'
      root.setAttribute('aria-hidden', 'true')
      const clip = document.createElement('div')
      clip.className = 'holo-scene-clip'
      // Painted directly above the video (enter() inserts the <video> before
      // scrim, which puts it above this layer) so its backdrop-filter samples
      // the plate itself. Only the outer tenth a side is left visible by the
      // CSS mask.
      const blur = document.createElement('div')
      blur.className = 'holo-scene-blur'
      const scrim = document.createElement('div')
      scrim.className = 'holo-scene-scrim'
      const veil = document.createElement('div')
      veil.className = 'holo-scene-veil'
      clip.appendChild(blur)
      clip.appendChild(scrim)
      clip.appendChild(veil)
      root.appendChild(clip)
      // Start collapsed: the plate only takes up the column's width once the
      // column's own start page is actually on screen, so an idle plugin owns
      // no space.
      clip.style.width = '0px'
      document.body.appendChild(root)

      // ---- click target for her line -------------------------------------
      // A SEPARATE layer, not a child of #holo-scene. #holo-scene is
      // z-index:-1, and a negative-z layer sits below its container's
      // background: a child with pointer-events:auto inside it still never
      // receives a click. So the hit band lives on its own, above the content,
      // and only where the plate's artwork is.
      //
      // Shape: a fixed proportion of the plate (top 62%), NOT traced around
      // her — the six standby clips are swappable and she stands differently in
      // each, so a silhouette would miss on most of them.
      const hit = document.createElement('div')
      hit.id = 'holo-scene-hit'
      hit.setAttribute('aria-hidden', 'true')
      hit.style.display = 'none'
      document.body.appendChild(hit)

      /** Her line for this plate. One element, rewound per tap. */
      let sceneVoice = null

      const speak = () => {
        try {
          if (sceneVoice === null) {
            sceneVoice = new Audio(SCENE_VOICE_SRC)
            sceneVoice.preload = 'auto'
          }
          sceneVoice.pause()
          sceneVoice.currentTime = 0
          const started = sceneVoice.play()
          if (started !== undefined && started.catch === 'function') started.catch(() => {})
        } catch (error) { /* audio unavailable: the caption still shows */ }
        if (typeof announce === 'function') announce('scene')
      }

      /**
       * Is a document-level modal open?
       *
       * The image lightbox is portalled to <body> as
       *   <div role="dialog" aria-modal="true" class="backdrop">
       * with its own close button in the top-right corner. Because it does NOT
       * replace the right column's start page, gateOpen() stays true while it is
       * up -- which is why the hit band kept covering it and swallowing the ✕.
       *
       * Only role="dialog" / aria-modal are consulted. Deliberately NOT
       * role="menu" or role="listbox": those are dropdowns that open while the
       * plate is legitimately in use, and yielding to them would make her
       * unclickable for no reason.
       */
      const modalOpen = () => {
        try {
          return document.querySelector('[role="dialog"], [aria-modal="true"]') !== null
        } catch (error) {
          return false
        }
      }

      const onHit = () => {
        // Belt and braces: sync() already hides the band while a modal is up, but
        // a click landing in the same frame would otherwise still get through.
        if (modalOpen()) return
        let stillOpen = false
        try {
          stillOpen = gateOpen()
        } catch (error) {
          stillOpen = false
        }
        if (stillOpen) speak()
      }
      hit.addEventListener('click', onHit)

      let video = null
      let on = false
      let watched = null
      let raf = 0
      const cleared = []

      // The right column's panel. It is the one stable handle this shell offers:
      // the class names are build hashes, the attributes are not.
      //
      // One panel exists per session and parked sessions stay in the document
      // with a `hidden` attribute, so the first match is not necessarily the one
      // on screen. The visible one is the column that is actually standing
      // there.
      const visible = (el) => {
        if (el === null || el === undefined) return false
        if (el.hasAttribute('hidden')) return false
        if (el.getAttribute('aria-hidden') === 'true') return false
        if (typeof el.getClientRects === 'function' && el.getClientRects().length === 0) return false
        return true
      }
      const findColumn = () => {
        const all = document.querySelectorAll('[data-sidebar-right-panel]')
        if (all !== null && all !== undefined && typeof all.length === 'number') {
          for (let i = 0; i < all.length; i += 1) {
            if (visible(all[i])) return all[i]
          }
        }
        const one = document.querySelector('[data-sidebar-right-panel]')
        return one === null || one === undefined ? null : one
      }

      // The right column's start page -- the guide tab the shell ships. Its
      // presence is the whole on/off rule: it is rendered only while that column
      // shows its own start page, so opening a file, a terminal or the browser
      // there removes it, and the plate goes with it.
      //
      // Scoped to the visible column on purpose: a parked session keeps its own
      // panel in the document, and the guide of a hidden one is not the surface
      // on screen.
      const findGate = () => {
        const col = findColumn()
        const scope = col === null ? document : col
        const all = scope.querySelectorAll('[data-sidebar-right-guide]')
        if (all !== null && all !== undefined && typeof all.length === 'number') {
          for (let i = 0; i < all.length; i += 1) {
            if (visible(all[i])) return all[i]
          }
          return null
        }
        return null
      }

      const clearOne = (el) => {
        if (el === null || el === undefined) return
        if (el.dataset !== undefined && el.dataset.holoSceneFill === 'cleared') return
        let bg = ''
        try { bg = getComputedStyle(el).backgroundColor } catch (error) { bg = '' }
        if (bg === '' || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') return
        el.setAttribute('data-holo-scene-fill', 'cleared')
        el.style.setProperty('background-color', 'transparent', 'important')
        cleared.push(el)
      }

      // This is the source package's own rule, moved to the right column: any
      // box that covers most of the column hides the plate, so its fill is
      // cleared while the plate is up. The size threshold is what keeps the
      // guide's entry capsules (small, opaque by design) intact -- only the
      // full-bleed panels behind them lose their paint.
      //
      // The column itself paints nothing, but its ancestors do: the frame
      // carries `--dsw-alias-bg-base`, and the shell has moved that fill between
      // the frame and the column across versions. So the ancestor chain is
      // cleared too, up to (never past) the body, and every change is recorded
      // for an exact restore.
      const clearFills = () => {
        const col = findColumn()
        if (col === null) return
        const rect = col.getBoundingClientRect()
        if (rect.width >= 40 && rect.height >= 40) {
          const all = col.querySelectorAll('*')
          for (let i = 0; i < all.length; i += 1) {
            const box = all[i].getBoundingClientRect()
            if (box.width < rect.width * 0.85 || box.height < rect.height * 0.5) continue
            clearOne(all[i])
          }
        }
        let node = col
        for (let i = 0; i < 7 && node !== null && node !== undefined; i += 1) {
          clearOne(node)
          if (node === document.body) break
          node = node.parentElement
        }
      }

      const restoreFills = () => {
        while (cleared.length > 0) {
          const el = cleared.pop()
          try {
            el.style.removeProperty('background-color')
            el.removeAttribute('data-holo-scene-fill')
          } catch (error) { /* a detached node needs no restore */ }
        }
      }

      // Which clips need the CSS flip. The video is centred in the slice
      // (`left: calc(50% - 304px)`), so the slice's centre and the video's own
      // centre coincide and a plain centre origin flips the plate in place.
      const applyMirror = (name) => {
        if (video === null) return
        video.style.setProperty('transform-origin', '50% 50%')
        if (SCENE_CSS_MIRRORED.indexOf(name) >= 0) video.classList.add('is-mirrored')
        else video.classList.remove('is-mirrored')
      }

      // Where the first quick-action card starts, in viewport coordinates.
      //
      // The start page's entries (工作区文件 / 新建终端 / 浏览器 ...) are
      // <button data-sidebar-right-guide-entry> elements laid out at the top of
      // the column. The hit band used to be measured from the column's own top
      // and stopped at a flat 62% of the plate, which put its lower edge in the
      // middle of those buttons -- clicking 工作区文件 or 新建终端 landed on the
      // band and her line played instead of the action running.
      //
      // The entries are centred vertically (`justify-content: center` with
      // `min-height: 100%`), so their top edge moves whenever the window
      // height changes. That is why this is a live measurement taken inside
      // place() rather than a constant worked out once.
      //
      // Returns null when no entry is on screen (a different tab in that
      // column), in which case the caller keeps the plain proportion.
      const guideEntryTop = () => {
        const col = findColumn()
        const scope = col === null ? document : col
        let best = null
        try {
          const all = scope.querySelectorAll('[data-sidebar-right-guide-entry]')
          if (all !== null && all !== undefined && typeof all.length === 'number') {
            for (let i = 0; i < all.length; i += 1) {
              const el = all[i]
              if (!visible(el)) continue
              const box = el.getBoundingClientRect()
              if (box.height <= 0) continue
              if (best === null || box.top < best) best = box.top
            }
          }
        } catch (error) {
          return null
        }
        return best
      }

      const place = () => {
        const col = findColumn()
        if (col === null) {
          clip.style.width = '0px'
          hit.style.display = 'none'
          return false
        }
        const box = col.getBoundingClientRect()
        if (box.width <= 0) {
          clip.style.width = '0px'
          hit.style.display = 'none'
          return false
        }
        // Cap the slice at the plate's own width and re-centre it inside the
        // column. The mask's fade band is a percentage OF THE SLICE, so a slice
        // wider than the 608px plate put the whole band in the empty margin
        // beside the artwork and left the artwork's edge hard. Capping makes the
        // slice edge and the visible edge the same line again, whatever the
        // column's width is.
        const plate = Math.min(Math.round(box.width), SCENE_PLATE_WIDTH)
        clip.style.left = Math.round(box.left + (box.width - plate) / 2) + 'px'
        clip.style.width = plate + 'px'
        // Mirror the same rectangle onto the hit band. The band keeps the
        // plate's own 608x1080 proportion, so it covers the same part of the
        // artwork whatever the column width is.
        hit.style.left = Math.round(box.left + (box.width - plate) / 2) + 'px'
        hit.style.width = plate + 'px'
        const top = Math.round(box.top)
        hit.style.top = top + 'px'
        let height = Math.round(plate * (1080 / 608) * 0.62)
        // Never reach into the quick-action cards. Their top edge is measured
        // live (see guideEntryTop) because the shell centres them vertically and
        // they shuffle as the window resizes. A 6px gap keeps the band off the
        // button's own rounded corner, where a stray click would otherwise land
        // on whichever of the two sits on top.
        const entryTop = guideEntryTop()
        if (entryTop !== null) {
          const room = Math.round(entryTop - box.top) - 6
          if (room < height) height = room
        }
        // A column too short to leave any room collapses the band to zero
        // instead of going negative. The height is always written, even when it
        // is 0: place() must not leave a stale taller value behind, because the
        // caller (sync) is what decides whether the band is shown at all.
        if (height < 0) height = 0
        hit.style.height = height + 'px'
        // Tell the caller whether there is any clickable band left, so sync can
        // keep it out of the tree entirely rather than displaying a 0-height
        // box. A zero-height element eats no clicks either way; hiding it just
        // keeps the DOM honest.
        return height > 0
      }

      const play = () => {
        if (video === null) return
        try {
          const started = video.play()
          if (started !== null && started !== undefined && typeof started.catch === 'function') {
            started.catch(() => { /* a background clip that cannot autoplay is not an error */ })
          }
        } catch (error) { /* ignore */ }
      }

      // Switching the clip from the settings page: the page writes the choice and
      // fires the event, this layer only has to re-point the source. The video
      // element is reused rather than rebuilt so the layer never flickers out.
      //
      // `sync()` runs unconditionally afterwards because the choice can also
      // move the layer in or out of existence: picking the off switch has to
      // tear the plate down (no DOM mutation happens, so the observer will not
      // do it for us), and picking a clip again while the layer is down has to
      // bring it back up.
      //
      // This listener is registered for the layer's whole life, NOT inside
      // enter(). Registering it on entry left the off switch one-way: once the
      // plate was gone nobody was left listening, so choosing a clip again did
      // nothing until a restart.
      const onSceneChange = () => {
        try {
          const name = readSceneName()
          if (video !== null && name !== SCENE_OFF) {
            video.src = sceneSrcFor(name)
            applyMirror(name)
            video.load()
            play()
          }
        } catch (error) { /* ignore */ }
        sync()
      }
      window.addEventListener(SCENE_CHANGE_EVENT, onSceneChange)

      const enter = () => {
        if (on) return
        on = true
        document.documentElement.setAttribute('data-holo-scene', 'on')
        video = document.createElement('video')
        video.className = 'holo-scene-img'
        video.muted = true
        video.loop = true
        video.playsInline = true
        video.autoplay = true
        video.preload = 'auto'
        video.setAttribute('aria-hidden', 'true')
        video.setAttribute('muted', '')
        const name = readSceneName()
        video.src = sceneSrcFor(name)
        applyMirror(name)
        clip.insertBefore(video, scrim)
        place()
        clearFills()
        // place() runs again once the band is displayable: the cards' own
        // positions are only final after the plate is in the tree, and the band
        // is measured against them (see guideEntryTop).
        hit.style.display = 'block'
        const hasBand = place()
        if (hasBand === false) hit.style.display = 'none'
        play()
      }

      const leave = () => {
        if (!on) return
        on = false
        hit.style.display = 'none'
        document.documentElement.removeAttribute('data-holo-scene')
        restoreFills()
        if (video !== null) {
          try { video.pause() } catch (error) { /* ignore */ }
          // Dropping the source is what actually frees the decoder; a paused
          // <video> left in the tree keeps its buffers.
          try { video.removeAttribute('src'); video.load() } catch (error) { /* ignore */ }
          if (video.parentNode !== null) video.parentNode.removeChild(video)
          video = null
        }
        clip.style.width = '0px'
      }

      // The on/off rule: the column is expanded and its own start page -- the
      // guide -- is rendered. That is the only surface this plate belongs to.
      // Opening a file, a terminal or the browser in that column replaces the
      // guide, so the plate leaves with it, and a collapsed column shows nothing
      // because there is no column to stand behind.
      const gateOpen = () => {
        // The off switch in the settings page wins over the column's state: with
        // it selected there is no plate at all, so the layer never even enters.
        if (readSceneName() === SCENE_OFF) return false
        const panel = findColumn()
        if (panel === null) return false
        if (!panel.hasAttribute('data-sidebar-right-open')) return false
        return findGate() !== null
      }

      const sync = () => {
        let show = false
        try {
          show = gateOpen()
        } catch (error) {
          show = false
        }
        // The hit band follows the gate AND yields to document-level modals.
        //
        // The modal case is the one that bit: the image lightbox is portalled to
        // <body> with role="dialog" aria-modal="true" and does NOT replace the
        // right column's start page, so `show` stays true and the band kept
        // covering the lightbox -- its top-right ✕ swallowed the click and her
        // line played instead of closing the image.
        if (hit !== null) {
          if (show && !modalOpen()) {
            const hasBand = place()
            hit.style.display = hasBand === false ? 'none' : 'block'
          } else {
            hit.style.display = 'none'
          }
        }
        if (show && !on) enter()
        else if (!show && on) leave()
        else if (on) { place(); clearFills() }
      }

      const schedule = () => {
        if (raf !== 0) return
        const frame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null
        if (frame === null) { sync(); return }
        raf = frame(() => { raf = 0; sync() })
      }

      // The gate is a set of attribute writes on the right column plus the
      // guide's own insertion, so one observer covers both: the column opening
      // or closing, and the guide appearing or being replaced.
      let observer = null
      const Observer = typeof MutationObserver === 'function' ? MutationObserver : null
      if (Observer !== null) {
        observer = new Observer(schedule)
        try {
          observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
              'data-sidebar-right-open',
              'data-sidebar-right-panel',
              'data-sidebar-right-tab',
            ],
          })
        } catch (error) { observer = null }
      }

      const onResize = () => schedule()
      const onVisible = () => {
        if (!on || video === null) return
        if (document.hidden) { try { video.pause() } catch (error) { /* ignore */ } }
        else play()
      }
      window.addEventListener('resize', onResize)
      window.addEventListener('scroll', onResize, true)
      document.addEventListener('visibilitychange', onVisible)

      // A rail collapse swaps the column for a different node; the fills then
      // have to be cleared again on the new one. Cheap re-check on a slow beat,
      // and only while the plate is up.
      let rebind = 0
      try {
        rebind = window.setInterval(() => {
          if (!on) return
          const col = findColumn()
          if (col !== watched) { watched = col }
          place()
          clearFills()
        }, 1200)
      } catch (error) { rebind = 0 }

      sync()

      return {
        root,
        dispose: () => {
          window.removeEventListener('resize', onResize)
          window.removeEventListener('scroll', onResize, true)
          document.removeEventListener('visibilitychange', onVisible)
          window.removeEventListener(SCENE_CHANGE_EVENT, onSceneChange)
          if (rebind !== 0) window.clearInterval(rebind)
          if (raf !== 0 && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(raf)
          if (observer !== null) observer.disconnect()
          leave()
          hit.removeEventListener('click', onHit)
          if (sceneVoice !== null) {
            try { sceneVoice.pause() } catch (error) { /* ignore */ }
            sceneVoice = null
          }
          if (hit.parentNode !== null) hit.parentNode.removeChild(hit)
          if (root.parentNode !== null) root.parentNode.removeChild(root)
        },
      }
    }

    function createLinkCard(React) {
      const h = React.createElement
      const useCallback = React.useCallback
      const useEffect = React.useEffect
      const useState = React.useState

      const rowStyle = { display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 0' }
      const dimStyle = { color: 'var(--dsw-alias-label-secondary)', fontSize: '13px', lineHeight: '1.6' }
      const strongStyle = { color: 'var(--dsw-alias-label-primary)', fontWeight: 600, fontSize: '14px' }
      const BOOT_SKIP_KEY = 'dsh-theme-holo.skip-boot'
      const buttonStyle = (enabled) => ({
        cursor: enabled ? 'pointer' : 'not-allowed',
        opacity: enabled ? 1 : 0.55,
        borderRadius: '9px',
        padding: '7px 15px',
        font: '500 13px/1.2 "Microsoft YaHei",system-ui,sans-serif',
        border: '1px solid var(--dsw-alias-border-l3)',
        background: 'var(--dsw-alias-button-contrast-fill)',
        color: 'var(--dsw-alias-label-primary-foreground)',
      })
      const ghostButtonStyle = {
        cursor: 'pointer',
        borderRadius: '9px',
        padding: '7px 15px',
        font: '500 13px/1.2 "Microsoft YaHei",system-ui,sans-serif',
        border: '1px solid var(--dsw-alias-border-l3)',
        background: 'transparent',
        color: 'var(--dsw-alias-label-primary)',
      }

      return function WhaleLinkCard() {
        const [state, setState] = useState(null)
        const [busy, setBusy] = useState(false)
        const [note, setNote] = useState('')
        const [error, setError] = useState('')
        const [skipBoot, setSkipBoot] = useState(() => {
          try { return localStorage.getItem(BOOT_SKIP_KEY) === '1' } catch (err) { return false }
        })

        const toggleBoot = useCallback(() => {
          setSkipBoot((previous) => {
            const next = !previous
            try { localStorage.setItem(BOOT_SKIP_KEY, next ? '1' : '0') } catch (err) { /* ignore */ }
            return next
          })
        }, [])

        // The dark switch writes the app's own appearance preference: the theme
        // service owns that field, so this button and 设置 → 外观 stay one state.
        const [dark, setDark] = useState(() => {
          try { return document.body.hasAttribute('data-ds-dark-theme') } catch (err) { return false }
        })

        const toggleDark = useCallback(() => {
          setDark((previous) => {
            const next = !previous
            try {
              if (themeService && typeof themeService.setTheme === 'function') {
                themeService.setTheme(next ? 'dark' : 'light')
              } else if (typeof document !== 'undefined' && document.body !== null) {
                document.body.toggleAttribute('data-ds-dark-theme', next)
              }
            } catch (err) { /* ignore */ }
            return next
          })
        }, [])

        const [peekOff, setPeekOff] = useState(() => {
          try { return localStorage.getItem(PEEK_OFF_KEY) === '1' } catch (err) { return false }
        })

        const togglePeek = useCallback(() => {
          setPeekOff((previous) => {
            const next = !previous
            try { localStorage.setItem(PEEK_OFF_KEY, next ? '1' : '0') } catch (err) { /* ignore */ }
            try {
              document.documentElement.setAttribute('data-holo-peek', next ? 'off' : 'on')
            } catch (err) { /* ignore */ }
            return next
          })
        }, [])

        const [voiceOff, setVoiceOff] = useState(() => {
          try { return localStorage.getItem(PEEK_VOICE_OFF_KEY) === '1' } catch (err) { return false }
        })

        const toggleVoice = useCallback(() => {
          setVoiceOff((previous) => {
            const next = !previous
            try { localStorage.setItem(PEEK_VOICE_OFF_KEY, next ? '1' : '0') } catch (err) { /* ignore */ }
            return next
          })
        }, [])

        // Which of the six staged clips stands behind the right column. The
        // choice is written to storage and announced on `window`, because the
        // plate is a separate layer with no React tree of its own.
        const [sceneName, setSceneName] = useState(() => readSceneName())

        const changeScene = useCallback((event) => {
          const raw = event && event.target ? event.target.value : event
          const next = SCENE_OPTIONS.indexOf(raw) >= 0 ? raw : SCENE_NAME_DEFAULT
          try { localStorage.setItem(SCENE_NAME_KEY, next) } catch (err) { /* ignore */ }
          setSceneName(next)
          try {
            window.dispatchEvent(new CustomEvent(SCENE_CHANGE_EVENT, { detail: next }))
          } catch (err) { /* ignore */ }
        }, [])

        // The wordmark's placement lives in module state rather than here: the
        // card writes it, the floating layer reads it, and the two never share a
        // React tree. `logoRev` is a bare revision counter — bumping it is how
        // the card re-renders its readout after a drag, since the numbers it
        // displays come from the module, not from React state.
        const [logoEditOn, setLogoEditOn] = useState(() => {
          loadLogoPlace()
          return logoState.edit
        })
        const [logoHidden, setLogoHiddenState] = useState(() => {
          loadLogoPlace()
          return logoState.hidden
        })
        const [logoAlpha, setLogoAlphaState] = useState(() => {
          loadLogoPlace()
          return logoState.alpha
        })
        const [, setLogoRev] = useState(0)

        useEffect(() => {
          const seen = () => {
            setLogoEditOn(logoState.edit)
            setLogoHiddenState(logoState.hidden)
            setLogoAlphaState(logoState.alpha)
            setLogoRev((rev) => rev + 1)
          }
          logoWatchers.add(seen)
          return () => { logoWatchers.delete(seen) }
        }, [])

        const toggleLogoEdit = useCallback(() => {
          setLogoEdit(!logoState.edit)
        }, [])

        const resetLogo = useCallback(() => {
          resetLogoPlace()
        }, [])

        const toggleLogoHidden = useCallback(() => {
          setLogoHidden(!logoState.hidden)
        }, [])

        // The note pad is a tool, not an ornament, so it gets its own switch
        // like the peeker does. State mirrors module state through the same
        // watcher set the layer paints from.
        const [plannerOff, setPlannerOffState] = useState(() => {
          loadPlanner()
          return plannerState.off
        })

        useEffect(() => {
          const seen = () => { setPlannerOffState(plannerState.off) }
          plannerWatchers.add(seen)
          return () => { plannerWatchers.delete(seen) }
        }, [])

        const [plannerSimple, setPlannerSimpleState] = useState(() => {
          loadPlanner()
          return plannerState.simple
        })

        useEffect(() => {
          const seen = () => { setPlannerSimpleState(plannerState.simple) }
          plannerWatchers.add(seen)
          return () => { plannerWatchers.delete(seen) }
        }, [])

        const togglePlanner = useCallback(() => {
          setPlannerOff(!plannerState.off)
        }, [])

        const togglePlannerSimple = useCallback(() => {
          setPlannerSimple(!plannerState.simple)
        }, [])

        // The slider hands over a percentage; state stores a fraction. The setter
        // clamps, and the readout is fed the clamped value back so the thumb
        // never sits somewhere the layer is not.
        const changeLogoAlpha = useCallback((event) => {
          const raw = event && event.target ? event.target.value : event
          setLogoAlpha(Number(raw) / 100)
          setLogoAlphaState(logoState.alpha)
        }, [])

        const refresh = useCallback(() => {
          linkState().then((next) => {
            setState(next)
          }).catch((err) => {
            setError(String((err && err.message) || err))
          })
        }, [])

        const reload = useCallback(() => {
          try { window.location.reload() } catch (err) { /* ignore */ }
        }, [])

        useEffect(() => {
          refresh()
        }, [refresh])

        const run = useCallback(() => {
          setBusy(true)
          setError('')
          setNote('')
          linkInstall((text) => {
            setNote(text)
          }).then((added) => {
            setNote(added.length === 0 ? '联动内容已是最新，无需重复导入。' : '已写入：' + added.join('、'))
            refresh()
          }).catch((err) => {
            setError(String((err && err.message) || err))
          }).finally(() => {
            setBusy(false)
          })
        }, [refresh])

        let status
        if (state === null) {
          status = '正在检查小鲸鱼挂件…'
        } else if (!state.present) {
          status = '没有检测到小鲸鱼挂件。装上 dsh-whale-widget 之后再点按钮即可。'
        } else if (state.installed) {
          status = '已写入小鲸鱼挂件的数据目录：角色「赫萝」「赫萝Q版」，语音组「赫萝震惊」。'
        } else {
          const missing = []
          if (state.missingRoles.length > 0) missing.push('角色 ' + state.missingRoles.join('、'))
          if (state.missingVoice) missing.push('语音片段')
          if (state.missingGroup) missing.push('音效组')
          status = '还缺：' + missing.join('；') + '。'
        }

        const children = [
          h('div', { key: 'title', style: strongStyle }, '赫萝 × 小鲸鱼挂件'),
          h('div', { key: 'status', style: { ...dimStyle, marginTop: '6px' } }, status),
        ]
        if (note !== '') children.push(h('div', { key: 'note', style: { ...dimStyle, marginTop: '6px' } }, note))
        if (error !== '') {
          children.push(h('div', {
            key: 'error',
            style: { ...dimStyle, marginTop: '6px', color: 'var(--dsw-alias-label-danger, #B4432F)' },
          }, error))
        }
        const enabled = !busy && state !== null && state.present
        const button = h('button', {
          key: 'run',
          type: 'button',
          disabled: !enabled,
          onClick: run,
          style: buttonStyle(enabled),
        }, busy ? '正在导入…' : '一键导入联动内容')
        // The widget reads /dsh-whale/roles.json exactly once per page load
        // (`loadRoles()` has a single call site), so freshly written roles stay
        // invisible until the page reloads. Offering the reload here is the only
        // way to make that step obvious instead of looking like the import failed.
        const rowChildren = [button]
        if (state !== null && state.present && state.installed) {
          rowChildren.push(h('button', {
            key: 'reload',
            type: 'button',
            onClick: reload,
            style: ghostButtonStyle,
          }, '刷新页面'))
        }
        children.push(h('div', { key: 'row', style: rowStyle }, rowChildren))
        if (state !== null && state.present && state.installed) {
          children.push(h('div', {
            key: 'reloadHint',
            style: { ...dimStyle, marginTop: '6px' },
          }, '小鲸鱼挂件只在页面加载时读一次角色列表，导入后要点「刷新页面」（或按 Ctrl+R）才会在它的「角色」里出现。'))
        }
        children.push(h('div', {
          key: 'what',
          style: { ...dimStyle, marginTop: '6px' },
        }, '一键导入：角色图「赫萝」「赫萝Q版」+ 语音组「赫萝震惊」。已存在的条目会跳过，不会重复添加。'))

        // The reel is 12 seconds over everything; a user who is done watching it
        // should not have to click through it on every launch. The choice is
        // remembered per machine, exactly like the score switch.
        children.push(h('div', {
          key: 'bootTitle',
          style: { ...strongStyle, marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid var(--dsw-alias-border-l3)' },
        }, '开场动画'))
        children.push(h('div', { key: 'bootStatus', style: { ...dimStyle, marginTop: '6px' } },
          skipBoot ? '已关闭：启动时直接进入界面。' : '已开启：每次启动播放约 12 秒。'))
        children.push(h('div', { key: 'bootRow', style: rowStyle }, h('button', {
          key: 'bootToggle',
          type: 'button',
          onClick: toggleBoot,
          style: buttonStyle(true),
        }, skipBoot ? '开启开场动画' : '关闭开场动画')))

        children.push(h('div', {
          key: 'peekTitle',
          style: { ...strongStyle, marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid var(--dsw-alias-border-l3)' },
        }, '探头的赫萝'))
        children.push(h('div', { key: 'peekStatus', style: { ...dimStyle, marginTop: '6px' } },
          peekOff ? '已关闭：输入框边上不再出现探头。' : '已开启：鼠标移到输入框边上时她会探出头来。'))
        children.push(h('div', { key: 'peekRow', style: rowStyle }, h('button', {
          key: 'peekToggle',
          type: 'button',
          onClick: togglePeek,
          style: buttonStyle(true),
        }, peekOff ? '启用探头的赫萝' : '不启用探头的赫萝')))

        children.push(h('div', {
          key: 'voiceTitle',
          style: { ...strongStyle, marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid var(--dsw-alias-border-l3)' },
        }, '探头的她说话'))
        children.push(h('div', { key: 'voiceStatus', style: { ...dimStyle, marginTop: '6px' } },
          voiceOff ? '已关闭：点她只有动作，没有声音。' : '已开启：点她会「疑惑」一声。'))
        children.push(h('div', { key: 'voiceRow', style: rowStyle }, h('button', {
          key: 'voiceToggle',
          type: 'button',
          onClick: toggleVoice,
          style: buttonStyle(true),
        }, voiceOff ? '开启探头语音' : '关闭探头语音')))

        children.push(h('div', {
          key: 'darkTitle',
          style: { ...strongStyle, marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid var(--dsw-alias-border-l3)' },
        }, '黑夜模式'))
        children.push(h('div', { key: 'darkStatus', style: { ...dimStyle, marginTop: '6px' } },
          dark ? '已开启：界面使用「星夜麦田」深色配色。' : '已关闭：界面使用「麦秋晨光」浅色配色。'))
        children.push(h('div', {
          key: 'darkWarn',
          style: { ...dimStyle, marginTop: '4px', color: 'var(--dsw-alias-state-warn-label)' },
        }, '黑夜模式未完全做好适配，请谨慎打开'))
        children.push(h('div', { key: 'darkRow', style: rowStyle }, h('button', {
          key: 'darkToggle',
          type: 'button',
          onClick: toggleDark,
          style: buttonStyle(true),
        }, dark ? '关闭黑夜模式' : '开启黑夜模式')))

        // The standby plate behind the right column. Six clips are staged in
        // ./素材/动画 and served from there, so the options are literally the
        // file names -- replacing a file on disk is all it takes to re-skin one.
        children.push(h('div', {
          key: 'sceneTitle',
          style: { ...strongStyle, marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid var(--dsw-alias-border-l3)' },
        }, '右侧待机动画'))
        children.push(h('div', { key: 'sceneStatus', style: { ...dimStyle, marginTop: '6px' } },
          sceneName === SCENE_OFF
            ? '已关闭：右侧栏的开始页不再显示待机动画，进入开始页时也不会加载任何视频。'
            : '当前：' + sceneName +
              (sceneName === SCENE_NAME_DEFAULT ? '（默认）' : '') +
              '。只在右侧栏的开始页显示；左右边缘渐变到 50% 不透明度。'))
        children.push(h('div', { key: 'sceneRow', style: rowStyle }, h('select', {
          key: 'sceneSelect',
          value: sceneName,
          onChange: changeScene,
          'aria-label': '右侧待机动画',
          style: {
            cursor: 'pointer',
            borderRadius: '9px',
            padding: '7px 11px',
            font: '500 13px/1.2 "Microsoft YaHei",system-ui,sans-serif',
            border: '1px solid var(--dsw-alias-border-l3)',
            background: 'transparent',
            color: 'var(--dsw-alias-label-primary)',
            minWidth: '180px',
          },
        }, SCENE_OPTIONS.map((one) => h('option', { key: one, value: one }, one)))))

        children.push(h('div', {
          key: 'plannerTitle',
          style: { ...strongStyle, marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid var(--dsw-alias-border-l3)' },
        }, '羊皮纸便笺'))

        // 开关一：整个写字板的总开关。
        children.push(h('div', { key: 'plannerStatus', style: { ...dimStyle, marginTop: '6px' } },
          plannerOff
            ? '已关闭：写字板完全关闭，徽章、面板、头部按钮都不出现。'
            : (plannerSimple
              ? '已开启：入口是顶部工具条里的「写字板」按钮，点开是一张羊皮纸便笺；右下角不再显示徽章。'
              : '已开启：右下角一枚麦穗环徽章，点开是一张羊皮纸便笺，可以打字、可以粘贴图片；拖住徽章可以换位置。')))
        children.push(h('div', { key: 'plannerRow', style: rowStyle }, h('button', {
          key: 'plannerToggle',
          type: 'button',
          onClick: togglePlanner,
          style: buttonStyle(true),
        }, plannerOff ? '启用羊皮纸便笺' : '关闭写字板')))

        // 开关二：简化入口 —— 把「点图标」换成「点头部按钮」。
        children.push(h('div', {
          key: 'plannerSimpleRow',
          style: { ...rowStyle, marginTop: '8px' },
        }, h('button', {
          key: 'plannerSimpleToggle',
          type: 'button',
          onClick: togglePlannerSimple,
          disabled: plannerOff,
          style: buttonStyle(!plannerOff),
        }, plannerSimple ? '关闭简化写字板按钮' : '简化写字板按钮')))
        children.push(h('div', { key: 'plannerSimpleHint', style: { ...dimStyle, marginTop: '6px' } },
          plannerOff
            ? '写字板已关闭，先启用后再选入口。'
            : (plannerSimple
              ? '当前用顶部工具条的「写字板」按钮打开（在「提示词」左边），徽章已隐藏。'
              : '打开后：隐藏右下角徽章，改在顶部工具条「提示词」左边放一个「写字板」按钮。')))

        // The wordmark's placement. Editing is a mode rather than an inline
        // form: the mark is a floating layer, so the only honest control is to
        // make the mark itself draggable.
        const metrics = logoMetrics()
        children.push(h('div', {
          key: 'logoTitle',
          style: { ...strongStyle, marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid var(--dsw-alias-border-l3)' },
        }, '更改 logo 位置'))
        children.push(h('div', { key: 'logoStatus', style: { ...dimStyle, marginTop: '6px' } },
          logoHidden
            ? '已关闭：logo 隐藏中，不显示也不影响任何点击。'
            : logoEditOn
              ? '编辑中：拖动图片移动，拖右下角小方块改变大小。当前位置 ' +
                metrics.left + ', ' + metrics.top + '，高 ' + metrics.height + 'px。'
              : '已关闭：logo 停在原处，不会挡住任何点击。'))
        children.push(h('div', { key: 'logoRow', style: rowStyle },
          h('button', {
            key: 'logoToggle',
            type: 'button',
            onClick: toggleLogoEdit,
            // Turning editing on while the mark is hidden would arm a drag with
            // nothing to grab, so the button stays disabled in that state.
            disabled: logoHidden,
            style: buttonStyle(!logoHidden),
          }, logoEditOn ? '完成调整（固定下来）' : '更改 logo 位置'),
          h('button', {
            key: 'logoHide',
            type: 'button',
            onClick: toggleLogoHidden,
            style: buttonStyle(true),
          }, logoHidden ? '显示 logo' : '关闭 logo'),
          h('button', {
            key: 'logoReset',
            type: 'button',
            onClick: resetLogo,
            style: ghostButtonStyle,
          }, '恢复默认位置')))
        if (logoEditOn) {
          children.push(h('div', {
            key: 'logoHint',
            style: { ...dimStyle, marginTop: '6px' },
          }, '调好之后点「完成调整」，位置和大小会记住；按 Esc 也可以退出编辑。'))
        }
        children.push(h('div', { key: 'alphaStatus', style: { ...dimStyle, marginTop: '10px' } },
          '不透明度：' + Math.round(logoAlpha * 100) + '%' +
          (Math.abs(logoAlpha - LOGO_ALPHA_DEFAULT) < 1e-9 ? '（默认）' : '')))
        children.push(h('div', { key: 'alphaRow', style: rowStyle }, h('input', {
          key: 'alphaRange',
          type: 'range',
          min: '10',
          max: '100',
          step: '1',
          value: String(Math.round(logoAlpha * 100)),
          onChange: changeLogoAlpha,
          onInput: changeLogoAlpha,
          'aria-label': 'logo 不透明度',
          style: {
            flex: '1 1 auto',
            minWidth: '0',
            maxWidth: '260px',
            cursor: 'pointer',
            accentColor: 'var(--dsw-alias-label-primary, #3A2C1A)',
          },
        })))

        return h('div', { style: { padding: '4px 0 2px' } }, children)
      }
    }

    // The client loader hot-swaps a plugin by invalidating its module and
    // re-running the factory, then re-applying the plugin — without reloading
    // the page (`dsh-client-modules` `reload(id, rev)`). A reel that starts on
    // every `apply` therefore replays for twelve seconds on every edit of this
    // file. The reel belongs to the page session rather than to the fiber, so a
    // window-level latch keeps it to one showing per page load: it survives a
    // module re-execution and resets when the page actually reloads.
    const BOOT_SHOWN_KEY = '__dshThemeHoloBootShown'

    return {
      name: 'themeHolo',
      inject: [],
      apply(ctx) {
        // Dialogs the offer raises outlive the boot fiber, so the plugin owns
        // them: tearing the theme down must take its modal with it.
        const linkDialogs = new Set()
        ctx.effect(() => () => {
          for (const dialog of linkDialogs) dialog.dispose()
          linkDialogs.clear()
        }, 'theme-holo: whale link dialogs')

        // Plugin-owned stylesheet: removed with the plugin's fiber.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          const tag = document.createElement('style')
          tag.dataset.plugin = 'dsh-theme-holo'
          tag.dataset.pluginCss = 'dsh-theme-holo/theme.css'
          tag.textContent = STYLE
          document.head.appendChild(tag)
          return () => {
            tag.remove()
          }
        }, 'theme-holo: theme stylesheet')

        // The boot scene: a wheat field, a lantern moon, two amber eyes, then the
        // wordmark. Twelve seconds of canvas-drawn reel above everything, and any
        // click or key cuts it short.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          // One showing per page load — see BOOT_SHOWN_KEY. A hot-swapped
          // re-apply must not restart the reel.
          let shown = false
          try { shown = window[BOOT_SHOWN_KEY] === true } catch (error) { shown = false }
          if (shown) return () => {}
          const boot = createBoot(() => {
            maybeOfferLink().then((dialog) => {
              if (dialog !== null) linkDialogs.add(dialog)
            }).catch((error) => { /* the offer is optional; never surface */ })
          })
          // Set only after the reel actually started: a throwing createBoot
          // leaves the latch clear so the next apply can try again.
          try { window[BOOT_SHOWN_KEY] = true } catch (error) { /* no window: harmless */ }
          return () => boot.dispose()
        }, 'theme-holo: boot scene')

        // Role labels in the transcript get a quiet colour code.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          const tags = createLogTags()
          return () => tags.dispose()
        }, 'theme-holo: transcript labels')

        // The companion peeking over the composer's edge.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          try {
            const peeker = createPeeker((trigger) => {
              if (typeof holoVoiceAnnounce === 'function') holoVoiceAnnounce(trigger)
            })
            document.body.appendChild(peeker.root)
            holoPeekerHandle = peeker
            return () => {
              if (holoPeekerHandle === peeker) holoPeekerHandle = null
              peeker.dispose()
            }
          } catch (error) {
            return () => {}
          }
        }, 'theme-holo: peeking companion')

        // The living profile card: peek it at the account row, hide the moment
        // the pointer leaves. The account menu itself stays untouched.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          const card = createProfileCard()
          document.body.appendChild(card.root)
          let hideTimer = 0
          const hideSoon = () => {
            clearTimeout(hideTimer)
            hideTimer = setTimeout(() => card.leave(), 180)
          }
          const onOver = (event) => {
            const target = event.target
            if (!(target instanceof Element)) return
            const account = target.closest('[aria-label="账号菜单"]')
            if (account !== null) {
              clearTimeout(hideTimer)
              card.enter((account.textContent || '').trim())
              return
            }
            if (card.root.contains(target)) clearTimeout(hideTimer)
            else hideSoon()
          }
          const onDown = (event) => {
            const target = event.target
            if (target instanceof Element && target.closest('[aria-label="账号菜单"]') !== null) {
              clearTimeout(hideTimer)
              card.leave()
            }
          }
          document.addEventListener('pointerover', onOver, true)
          document.addEventListener('pointerdown', onDown, true)
          // Only a scroll inside the sidebar moves the account row. The message
          // list scrolls constantly while a turn streams; hiding on that made the
          // card flash for a moment and vanish.
          const onScroll = (event) => {
            const target = event.target
            if (target instanceof Element && target.closest('[class*="sidebarCol"]') !== null) hideSoon()
          }
          document.addEventListener('scroll', onScroll, true)
          return () => {
            clearTimeout(hideTimer)
            document.removeEventListener('pointerover', onOver, true)
            document.removeEventListener('pointerdown', onDown, true)
            document.removeEventListener('scroll', onScroll, true)
            card.dispose()
          }
        }, 'theme-holo: living profile card')

        // The wordmark: a free-floating layer the person positions themselves.
        // It is created outside the React tree on purpose — the settings card
        // re-renders constantly, and a mark inside it would remount mid-drag.
        // Placement is stored as viewport percentages, so a window resize or a
        // maximise carries the mark along without a single listener.
        //
        // It goes straight onto <body>. An earlier revision attached it inside
        // the conversation header so it could paint underneath the header's
        // text; that works, but the mark then cannot leave the header, and it
        // was also lost every time a main panel (the plugin settings page, for
        // one) replaced the conversation — the header is torn down with it and
        // the mark rode the detached subtree into the bin. On <body> there is
        // nothing to be torn down with: the layer outlives every panel swap and
        // needs no observer to come back.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          let pad = null
          const announce = (trigger) => {
            if (typeof holoVoiceAnnounce === 'function') holoVoiceAnnounce(trigger)
          }
          try { pad = createPlanner(announce) } catch (error) { pad = null }
          if (pad === null) return () => {}
          try {
            document.body.appendChild(pad.root)
          } catch (error) {
            return () => {}
          }
          holoPlannerHandle = pad
          return () => {
            if (holoPlannerHandle === pad) holoPlannerHandle = null
            pad.dispose()
          }
        }, 'theme-holo: parchment note pad')

        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          let layer = null
          try {
            layer = createLogoLayer()
          } catch (error) {
            layer = null
          }
          if (layer === null) return () => {}
          try {
            document.body.appendChild(layer.root)
          } catch (error) {
            return () => {}
          }
          return () => layer.dispose()
        }, 'theme-holo: floating wordmark')

        // The wheat at the foot of the sidebar. The field itself now lives on
        // <body>, but it is still measured against the host's column, so the
        // layer still waits for that column to exist: the frame is rendered by
        // the shell after the plugins load. A MutationObserver rather than a
        // retry timer — a poll here would also keep a headless test process
        // alive forever, and this way the layer starts on the very frame the
        // column appears.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          let layer = null
          let observer = null
          const attach = () => {
            if (layer !== null) return true
            try { layer = createWheatLayer() } catch (error) { layer = null }
            return layer !== null
          }
          if (!attach()) {
            observer = new MutationObserver(() => {
              if (attach() && observer !== null) {
                observer.disconnect()
                observer = null
              }
            })
            observer.observe(document.documentElement, { childList: true, subtree: true })
          }
          return () => {
            if (observer !== null) observer.disconnect()
            if (layer !== null) layer.dispose()
          }
        }, 'theme-holo: wheat at the sidebar foot')

        // The idle plate behind the right column: up while that column shows
        // its own start page, gone the moment something real is opened there.
        // Unlike the wheat, this layer owns a decoder, so it is created and
        // destroyed with the page rather than hidden -- see createScene().
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          let scene = null
          // Pass a lazy closure, not holoVoiceAnnounce itself: this effect
          // registers BEFORE the voice-cue effect below, so at registration
          // time holoVoiceAnnounce is still null. The closure reads it at
          // click time, by which point it is wired.
          const announce = (trigger) => {
            if (typeof holoVoiceAnnounce === 'function') holoVoiceAnnounce(trigger)
          }
          try { scene = createScene(announce) } catch (error) { scene = null }
          if (scene === null) return () => {}
          return () => scene.dispose()
        }, 'theme-holo: idle plate behind the right column')


        // The install button on the plugin's own row page. `ctx.inject` rather
        // than a hard `inject: ['slots']` dependency: a shell without the slots
        // service must still get the theme, just without the button.
        // The dark switch needs the theme service's own preference write; a
        // shell without that service falls back to the body attribute.
        if (typeof ctx.inject === 'function') {
          ctx.inject(['theme'], (tctx) => {
            themeService = (tctx && tctx.theme) || null
            // Runs after the service is captured: the one-time light default
            // needs `setTheme` to make the correction stick across reloads.
            applyFirstRunLight()
          })
        }

        // Peek opt-out: re-applied on every load so the choice survives a
        // reload without writing anything to the host settings document.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          let off = false
          try { off = localStorage.getItem(PEEK_OFF_KEY) === '1' } catch (err) { off = false }
          document.documentElement.setAttribute('data-holo-peek', off ? 'off' : 'on')
          return () => {}
        }, 'theme-holo: peek latch')

        // Spoken cues for shell buttons (see VOICE_CUES), each with a bubble
        // showing the translation above her right shoulder.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          let bubble = null
          let cues = null
          const getPeekBox = () => (holoPeekerHandle !== null ? holoPeekerHandle.peekBox : null)
          try { bubble = createVoiceBubble(getPeekBox) } catch (error) { bubble = null }
          if (bubble === null) return () => {}
          try { document.body.appendChild(bubble.root) } catch (error) { return () => {} }
          try { cues = createVoiceCues(bubble) } catch (error) { cues = null }
          holoVoiceAnnounce = (cues !== null && typeof cues.announce === 'function')
            ? (trigger) => { try { cues.announce(trigger) } catch (error) { /* ignore */ } }
            : null
          return () => {
            holoVoiceAnnounce = null
            if (cues !== null) cues.dispose()
            bubble.dispose()
          }
        }, 'theme-holo: voice cues')

        // Note pad opt-out: same pattern as the peeker's latch above — the
        // choice is re-applied on every load so it survives a reload without
        // writing to the host's own settings document.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          loadPlanner()
          applyPlannerOff()
          return () => {
            try { document.documentElement.removeAttribute('data-holo-planner-off') } catch (error) { /* ignore */ }
          }
        }, 'theme-holo: planner latch')

        let React = null
        try {
          React = require('react')
        } catch (error) {
          React = null
        }
        if (React !== null && typeof ctx.inject === 'function') {
          // Built once: a component type re-created per render would remount on
          // every parent update and throw its state (busy, message) away.
          const LinkCard = createLinkCard(React)
          ctx.inject(['slots'], (sctx) => {
            // The bundle page is the one a person lands on from the Plugins list,
            // so the card belongs there: `plugins.bundle.config` renders between
            // the package description and its rows. The row entry is kept so the
            // same card is still reachable from the component row.
            sctx.slots.inject('plugins.bundle.config', () => sctx.slots.register({
              name: 'plugins.bundle.config',
              key: 'dsh-theme-holo',
            }, (props) => React.createElement(LinkCard, props)))
            // 「写字板」按钮：与 ErrorNotes 的「提示词 / 错误库」同一个 slot，
            // order 20 < 它的 30 → 排在「提示词」左边。
            const PlannerButton = createHeaderButton(React)
            sctx.slots.inject('conversation.session.header.utilities', () => sctx.slots.register({
              name: 'conversation.session.header.utilities',
              id: 'theme-holo-planner',
              order: 20,
            }, PlannerButton))
            sctx.slots.inject('plugins.row.config', () => sctx.slots.register({
              name: 'plugins.row.config',
              key: 'dsh-theme-holo#theme-holo',
            }, (props) => {
              if (props && props.view === 'summary') return '联动与开场动画'
              return React.createElement(LinkCard, props)
            }))
          })
        }
      },
    }
  },
})
