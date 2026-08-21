const seed = require('../data/seed');
const recommendation = require('./recommendation');
const request = require('./request');
const CACHE_KEY = 'pingan.daily-cards';

function resolveScene(now) {
  const hour = (now || new Date()).getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 17 && hour < 24) return 'night';
  return 'general';
}

function getDayKey(now) {
  const date = now || new Date();
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function sanitizeCards(cards) {
  return (cards || []).filter(function (item) {
    return item && item.reviewState === 'approved' && item.rightsState === 'clear';
  });
}

function getFallbackRecommendations(now) {
  const scene = resolveScene(now);
  const all = sanitizeCards(seed.dailyItems);
  const matched = all.filter(function (item) { return item.scene === scene; });
  const general = all.filter(function (item) { return item.scene === 'general'; });
  const candidates = matched.concat(general).slice(0, 3);
  return recommendation.sortCandidates(candidates.length ? candidates : all, scene, getDayKey(now));
}

function cacheCards(payload) {
  wx.setStorageSync(CACHE_KEY, { savedAt: Date.now(), payload: payload });
}

function getCachedCards() {
  const cached = wx.getStorageSync(CACHE_KEY);
  return cached && cached.payload ? cached.payload : null;
}

function getDailyRecommendations() {
  const local = getFallbackRecommendations();
  return request.get('/v1/cards/daily', { scene: local.scene }).then(function (remote) {
    const cards = sanitizeCards(remote && remote.items);
    if (!cards.length) return local;
    const result = recommendation.sortCandidates(cards, local.scene, getDayKey());
    cacheCards(result);
    return result;
  }).catch(function () {
    const cached = getCachedCards();
    return cached || local;
  });
}
function getNewsDigest() { return Promise.resolve({ dateLabel: '昨日要闻', items: seed.news }); }
function getSongs() { return Promise.resolve(seed.songs); }
function getProducts() { return Promise.resolve(seed.products); }
module.exports = { resolveScene: resolveScene, getDailyRecommendations: getDailyRecommendations, getNewsDigest: getNewsDigest, getSongs: getSongs, getProducts: getProducts };
