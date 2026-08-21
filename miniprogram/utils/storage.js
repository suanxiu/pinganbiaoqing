const WORKS_KEY = 'pingan.works';
function getWorks() { return wx.getStorageSync(WORKS_KEY) || []; }
function addWork(work) { const next = [work].concat(getWorks()).slice(0, 50); wx.setStorageSync(WORKS_KEY, next); return next; }
function removeWork(id) { const next = getWorks().filter(function (item) { return item.id !== id; }); wx.setStorageSync(WORKS_KEY, next); return next; }
module.exports = { getWorks: getWorks, addWork: addWork, removeWork: removeWork };
