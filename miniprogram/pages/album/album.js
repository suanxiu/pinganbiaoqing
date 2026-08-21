const storage = require('../../utils/storage');
Page({
  data: { works: [] },
  onShow() { this.loadWorks(); },
  loadWorks() { const works = storage.getWorks().map(function (item) { const date = new Date(item.createdAt); item.dateLabel = (date.getMonth() + 1) + '月' + date.getDate() + '日'; return item; }); this.setData({ works: works }); },
  removeWork(event) { const page = this; const id = event.currentTarget.dataset.id; wx.showModal({ title: '删除这张草稿？', content: '删除后无法恢复。', confirmColor: '#B9342B', success: function (result) { if (!result.confirm) return; storage.removeWork(id); page.loadWorks(); } }); },
  goCreate() { wx.switchTab({ url: '/pages/create/create' }); },
  onShareAppMessage(event) { const item = event.target && event.target.dataset ? event.target.dataset.item : null; return { title: item ? item.copy : '愿你平安顺心', path: '/pages/index/index' }; }
});
