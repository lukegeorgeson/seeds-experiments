(function initSeedsDesignSystem(global) {
  const COLORWAYS = [
    { id: 'gruvbox', label: 'Gruvbox', group: 'color', swatchVar: '--colorway-swatch-gruvbox' },
    { id: 'andromeda', label: 'Andromeda', group: 'color', swatchVar: '--colorway-swatch-andromeda' },
    { id: 'rosepine', label: 'Rose Pine', group: 'color', swatchVar: '--colorway-swatch-rosepine' },
    { id: 'nord', label: 'Nord', group: 'color', swatchVar: '--colorway-swatch-nord' },
    { id: 'solarized', label: 'Solarized', group: 'color', swatchVar: '--colorway-swatch-solarized' },
    { id: 'flexoki', label: 'Flexoki', group: 'color', swatchVar: '--colorway-swatch-flexoki' },
    { id: 'ink', label: 'Ink', group: 'mono', swatchVar: '--colorway-swatch-ink' },
    { id: 'ash', label: 'Ash', group: 'mono', swatchVar: '--colorway-swatch-ash' },
    { id: 'bone', label: 'Bone', group: 'mono', swatchVar: '--colorway-swatch-bone' },
  ];

  function readVar(name, fallback) {
    const value = global.getComputedStyle(global.document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function readNumber(name, fallback) {
    const parsed = parseFloat(readVar(name, ''));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function readCanvasTokens() {
    return {
      grid: readNumber('--grid', 20),
      gutter: readNumber('--gutter', 40),
      dotGap: readNumber('--canvas-dot-gap', 20),
      dotSize: readNumber('--canvas-dot-size', 2),
      cardSize: readNumber('--card-size', 180),
      cardGap: readNumber('--card-gap', 20),
      zoneWidth: readNumber('--zone-width', 600),
      zoneHeight: readNumber('--zone-height', 500),
      zoneGap: readNumber('--zone-gap', 40),
      zoneMinWidth: readNumber('--zone-min-width', 400),
      zoneMinHeight: readNumber('--zone-min-height', 300),
      summaryHeight: readNumber('--summary-height', 80),
      summaryGap: readNumber('--summary-gap', 12),
      briefWidth: readNumber('--brief-width', 260),
      briefHeight: readNumber('--brief-height', 200),
      modifierWidth: readNumber('--modifier-width', 220),
      modifierHeight: readNumber('--modifier-height', 100),
      questionWidth: readNumber('--question-width', 360),
      questionHeight: readNumber('--question-height', 400),
      generateWidth: readNumber('--generate-width', 200),
      generateHeight: readNumber('--generate-height', 160),
      zoneCardOffsetX: readNumber('--zone-card-offset-x', 20),
      zoneCardOffsetY: readNumber('--zone-card-offset-y', 44),
      zoneCardColumns: readNumber('--zone-card-columns', 2),
      fitViewPadding: readNumber('--fit-view-padding', 0.15),
      zoomMin: readNumber('--zoom-min', 0.1),
      zoomMax: readNumber('--zoom-max', 3),
    };
  }

  function getColorwaySwatch(id) {
    const match = COLORWAYS.find((colorway) => colorway.id === id) || COLORWAYS[0];
    return readVar(match.swatchVar, '#000');
  }

  function getNodeSize(type) {
    const tokens = readCanvasTokens();
    switch (type) {
      case 'postit':
        return { width: tokens.cardSize, height: tokens.cardSize };
      case 'generate':
        return { width: tokens.generateWidth, height: tokens.generateHeight };
      case 'modifier':
        return { width: tokens.modifierWidth, height: tokens.modifierHeight };
      case 'brief':
        return { width: tokens.briefWidth, height: tokens.briefHeight };
      case 'question':
        return { width: tokens.questionWidth, height: tokens.questionHeight };
      case 'zoneSummary':
        return { width: tokens.zoneWidth, height: tokens.summaryHeight };
      case 'zone':
      default:
        return { width: tokens.zoneWidth, height: tokens.zoneHeight };
    }
  }

  global.SeedsDesignSystem = {
    colorways: COLORWAYS,
    readCanvasTokens,
    getNodeSize,
    getColorwaySwatch,
    connectionLineStyle: {
      stroke: 'var(--connection)',
      strokeWidth: 1.5,
      strokeDasharray: '6 3',
    },
    defaultEdgeOptions: {
      type: 'smoothstep',
    },
  };
})(window);
