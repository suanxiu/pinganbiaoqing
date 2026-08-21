const WORKS_KEY = 'pingan.works';
const PREVIEW_DRAFT_KEY = 'pingan.preview-draft';
function getWorks() { return wx.getStorageSync(WORKS_KEY) || []; }
function addWork(work) { const next = [work].concat(getWorks()).slice(0, 50); wx.setStorageSync(WORKS_KEY, next); return next; }
function removeWork(id) { const next = getWorks().filter(function (item) { return item.id !== id; }); wx.setStorageSync(WORKS_KEY, next); return next; }
function getWork(id) { return getWorks().filter(function (item) { return item.id === id; })[0] || null; }
function updateWork(id, changes) {
  const next = getWorks().map(function (item) {
    return item.id === id ? Object.assign({}, item, changes) : item;
  });
  wx.setStorageSync(WORKS_KEY, next);
  return getWork(id);
}
function setPreviewDraft(draft) { wx.setStorageSync(PREVIEW_DRAFT_KEY, draft); }
function getPreviewDraft() { return wx.getStorageSync(PREVIEW_DRAFT_KEY) || null; }
function clearPreviewDraft() { wx.removeStorageSync(PREVIEW_DRAFT_KEY); }
module.exports = { getWorks: getWorks, getWork: getWork, addWork: addWork, updateWork: updateWork, removeWork: removeWork, setPreviewDraft: setPreviewDraft, getPreviewDraft: getPreviewDraft, clearPreviewDraft: clearPreviewDraft };
