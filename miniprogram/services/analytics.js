const EVENTS_KEY = 'pingan.analytics.events';
const ALLOWED_KEYS = ['scene', 'styleId', 'entry', 'outputType', 'state', 'category', 'source', 'message', 'degraded'];

function sanitize(properties) {
  const safe = {};
  const source = properties || {};
  ALLOWED_KEYS.forEach(function (key) {
    if (source[key] === undefined || source[key] === null) return;
    safe[key] = String(source[key]).slice(0, 80);
  });
  return safe;
}

function track(event, properties) {
  const previous = wx.getStorageSync(EVENTS_KEY) || [];
  const entry = { event: event, createdAt: Date.now(), properties: sanitize(properties) };
  wx.setStorageSync(EVENTS_KEY, previous.concat([entry]).slice(-100));
}

module.exports = { track: track };
