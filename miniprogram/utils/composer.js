const CANVAS_WIDTH = 750;
const CANVAS_HEIGHT = 1000;

function fillBackground(ctx, theme) {
  const colors = {
    peony: ['#F0D6C6', '#FFF9EE', '#D9AF78'],
    pine: ['#C9D8C4', '#F6F0D8', '#91AA8C'],
    moon: ['#D8D3C9', '#FFF9E9', '#B5A888'],
    lotus: ['#DBD2C7', '#FFF9F1', '#C8A68C'],
    bamboo: ['#D4DEC4', '#FFFBED', '#A6B88C']
  };
  const palette = colors[theme] || colors.peony;
  const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(0.55, palette[1]);
  gradient.addColorStop(1, palette[2]);
  ctx.setFillStyle(gradient);
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawPeony(ctx) {
  const petals = [[635, 180, 88], [690, 255, 58], [575, 275, 64], [115, 770, 72], [180, 830, 46]];
  ctx.setGlobalAlpha(0.32);
  petals.forEach(function (item, index) {
    ctx.setFillStyle(index % 2 ? '#C76E71' : '#D9958B');
    ctx.beginPath();
    ctx.arc(item[0], item[1], item[2], 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.setGlobalAlpha(1);
}

function drawPine(ctx) {
  ctx.setGlobalAlpha(0.48);
  ctx.setStrokeStyle('#2F6650');
  ctx.setLineWidth(20);
  ctx.beginPath();
  ctx.moveTo(650, 50); ctx.lineTo(560, 510); ctx.stroke();
  [[620, 160, 470, 250], [610, 245, 430, 370], [590, 330, 390, 470]].forEach(function (branch) {
    ctx.setLineWidth(15); ctx.beginPath(); ctx.moveTo(branch[0], branch[1]); ctx.lineTo(branch[2], branch[3]); ctx.stroke();
  });
  ctx.setGlobalAlpha(1);
}

function drawMoon(ctx) {
  ctx.setGlobalAlpha(0.55);
  ctx.setFillStyle('#F7E7A5');
  ctx.beginPath(); ctx.arc(600, 190, 120, 0, Math.PI * 2); ctx.fill();
  ctx.setFillStyle('#D8D3C9');
  ctx.beginPath(); ctx.arc(650, 150, 115, 0, Math.PI * 2); ctx.fill();
  ctx.setGlobalAlpha(1);
}

function drawLotus(ctx) {
  ctx.setGlobalAlpha(0.35);
  ctx.setFillStyle('#B77B82');
  for (let index = 0; index < 8; index += 1) {
    const centerX = 590 + (index % 3) * 45;
    const centerY = 210 + Math.floor(index / 3) * 40;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.setGlobalAlpha(1);
}

function drawBamboo(ctx) {
  ctx.setGlobalAlpha(0.45);
  ctx.setStrokeStyle('#2F6650');
  ctx.setLineWidth(16);
  [610, 665, 720].forEach(function (x) { ctx.beginPath(); ctx.moveTo(x, 45); ctx.lineTo(x - 140, 600); ctx.stroke(); });
  ctx.setGlobalAlpha(1);
}

function drawDecoration(ctx, theme) {
  if (theme === 'pine') drawPine(ctx);
  else if (theme === 'moon') drawMoon(ctx);
  else if (theme === 'lotus') drawLotus(ctx);
  else if (theme === 'bamboo') drawBamboo(ctx);
  else drawPeony(ctx);
}

function drawCover(ctx, info) {
  const sourceRatio = info.width / info.height;
  const targetRatio = CANVAS_WIDTH / 670;
  let sx = 0; let sy = 0; let sw = info.width; let sh = info.height;
  if (sourceRatio > targetRatio) { sw = info.height * targetRatio; sx = (info.width - sw) / 2; }
  else { sh = info.width / targetRatio; sy = (info.height - sh) / 2; }
  ctx.drawImage(info.path, sx, sy, sw, sh, 0, 0, CANVAS_WIDTH, 670);
  const overlay = ctx.createLinearGradient(0, 420, 0, 670);
  overlay.addColorStop(0, 'rgba(40,35,31,0)');
  overlay.addColorStop(1, 'rgba(40,35,31,0.35)');
  ctx.setFillStyle(overlay); ctx.fillRect(0, 0, CANVAS_WIDTH, 670);
}

function splitText(ctx, text, maxWidth, maxLines) {
  const chars = String(text || '').split('');
  const lines = []; let current = '';
  chars.forEach(function (char) {
    const next = current + char;
    if (ctx.measureText(next).width > maxWidth && current) { lines.push(current); current = char; }
    else current = next;
  });
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const shortened = lines.slice(0, maxLines);
  let last = shortened[maxLines - 1];
  while (ctx.measureText(last + '...').width > maxWidth && last.length) last = last.slice(0, -1);
  shortened[maxLines - 1] = last + '...';
  return shortened;
}

function drawTextBlock(ctx, spec) {
  const panelTop = spec.photoPath ? 640 : 610;
  ctx.setFillStyle('rgba(255,253,248,0.94)');
  ctx.fillRect(32, panelTop, CANVAS_WIDTH - 64, CANVAS_HEIGHT - panelTop - 36);
  ctx.setFillStyle('#B9342B');
  ctx.setFontSize(26); ctx.fillText(spec.period || '问候', 70, panelTop + 58);
  ctx.setFillStyle('#28231F');
  ctx.setFontSize(52);
  const titleLines = splitText(ctx, spec.title || '愿你平安', CANVAS_WIDTH - 140, 2);
  titleLines.forEach(function (line, index) { ctx.fillText(line, 70, panelTop + 122 + index * 66); });
  ctx.setFillStyle('#4C443C');
  ctx.setFontSize(34);
  const copyLines = splitText(ctx, spec.copy || '愿你天天都有好心情。', CANVAS_WIDTH - 140, 3);
  const copyStart = panelTop + 180 + titleLines.length * 66;
  copyLines.forEach(function (line, index) { ctx.fillText(line, 70, copyStart + index * 52); });
  ctx.setFillStyle('#2F6650');
  ctx.setFontSize(24); ctx.fillText('平安表情 · 送给牵挂的人', 70, CANVAS_HEIGHT - 72);
}

function render(page, canvasId, spec) {
  return new Promise(function (resolve, reject) {
    const ctx = wx.createCanvasContext(canvasId, page);
    const paint = function (photoInfo) {
      fillBackground(ctx, spec.theme);
      drawDecoration(ctx, spec.theme);
      if (photoInfo) drawCover(ctx, photoInfo);
      drawTextBlock(ctx, spec);
      ctx.draw(false, function () {
        wx.canvasToTempFilePath({
          canvasId: canvasId,
          x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
          destWidth: 1500, destHeight: 2000,
          fileType: 'png', quality: 1,
          success: function (result) { resolve(result.tempFilePath); },
          fail: function () { reject({ code: 'CANVAS_EXPORT_FAILED' }); }
        }, page);
      });
    };
    if (!spec.photoPath) { paint(null); return; }
    wx.getImageInfo({
      src: spec.photoPath,
      success: function (info) { info.path = spec.photoPath; paint(info); },
      fail: function () { paint(null); }
    });
  });
}

module.exports = { render: render };
