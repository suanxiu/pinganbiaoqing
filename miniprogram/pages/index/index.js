const contentService = require('../../services/content');
Page({
  data: { loading: true, selectedIndex: 0, dailyItems: [], current: {}, todayLabel: '' },
  onLoad() { this.setData({ todayLabel: this.formatToday() }); this.loadDaily(); },
  onPullDownRefresh() { this.loadDaily().then(function () { wx.stopPullDownRefresh(); }); },
  formatToday() { const date = new Date(); return (date.getMonth() + 1) + '月' + date.getDate() + '日'; },
  loadDaily() { const page = this; page.setData({ loading: true }); return contentService.getDailyRecommendations().then(function (items) { page.setData({ loading: false, selectedIndex: 0, dailyItems: items, current: items[0] || {} }); }); },
  selectDaily(event) { const index = Number(event.currentTarget.dataset.index); this.setData({ selectedIndex: index, current: this.data.dailyItems[index] }); },
  goCreate() { wx.switchTab({ url: '/pages/create/create' }); },
  goNews() { wx.navigateTo({ url: '/pages/news/news' }); },
  goMusic() { wx.navigateTo({ url: '/pages/music/music' }); },
  onShareAppMessage() { return { title: this.data.current.copy || '愿你今日平安顺心', path: '/pages/index/index' }; }
});
