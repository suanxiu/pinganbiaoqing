const seed = require('../data/seed');
function resolvePeriod() { const hour = new Date().getHours(); return hour >= 18 || hour < 5 ? '晚安' : '早安'; }
function getDailyRecommendations() { const list = seed.dailyItems.filter(function (item) { return item.period === resolvePeriod(); }); return Promise.resolve(list.length ? list : seed.dailyItems); }
function getNewsDigest() { return Promise.resolve({ dateLabel: '昨日要闻', items: seed.news }); }
function getSongs() { return Promise.resolve(seed.songs); }
function getProducts() { return Promise.resolve(seed.products); }
module.exports = { getDailyRecommendations: getDailyRecommendations, getNewsDigest: getNewsDigest, getSongs: getSongs, getProducts: getProducts };
