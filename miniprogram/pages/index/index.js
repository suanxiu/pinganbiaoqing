const contentService = require('../../services/content');
const storage = require('../../utils/storage');
const analytics = require('../../services/analytics');
const recommendation = require('../../services/recommendation');
Page({
  data: { loading: true, selectedIndex: 0, dailyItems: [], current: {}, todayLabel: '' },
  onLoad() { this.setData({ todayLabel: this.formatToday() }); this.loadDaily(); },
  onPullDownRefresh() { this.loadDaily().then(function () { wx.stopPullDownRefresh(); }); },
  formatToday() { const date = new Date(); return (date.getMonth() + 1) + '月' + date.getDate() + '日'; },
  loadDaily() {
    const page = this;
    page.setData({ loading: true });
    return contentService.getDailyRecommendations().then(function (result) {
      const items = result.items || result;
      page.setData({ loading: false, selectedIndex: 0, dailyItems: items, current: items[0] || {} });
      analytics.track('daily_exposure', { scene: result.scene || contentService.resolveScene() });
    }).catch(function () {
      page.setData({ loading: false });
      wx.showToast({ title: '今日内容暂时无法加载', icon: 'none' });
    });
  },
  selectDaily(event) {
    const index = Number(event.currentTarget.dataset.index);
    const current = this.data.dailyItems[index];
    this.setData({ selectedIndex: index, current: current });
    if (current && current.theme) recommendation.recordChoice(current.theme);
    analytics.track('style_select', { scene: 'daily', styleId: current && current.theme, entry: 'daily_choice' });
  },
  previewDefault() {
    const current = this.data.current || {};
    storage.setPreviewDraft({ type: 'daily', photoPath: '', theme: current.theme, period: current.period, title: current.title, copy: current.copy, cardId: current.id });
    analytics.track('preview_open', { scene: 'daily', styleId: current.theme, entry: 'daily_card' });
    wx.navigateTo({ url: '/pages/preview/preview' });
  },
  goCreate() { wx.switchTab({ url: '/pages/create/create' }); },
  goNews() { wx.navigateTo({ url: '/pages/news/news' }); },
  goMusic() { wx.navigateTo({ url: '/pages/music/music' }); },
  onShareAppMessage() { return { title: this.data.current.copy || '愿你今日平安顺心', path: '/pages/index/index' }; }
});
