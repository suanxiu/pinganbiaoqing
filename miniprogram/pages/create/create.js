const mediaService = require('../../services/media');
const storage = require('../../utils/storage');
const recommendation = require('../../services/recommendation');
const analytics = require('../../services/analytics');
const copies = ['愿你平安健康，天天都有好心情。', '花开富贵，家和事兴，所愿皆如意。', '把祝福送给牵挂的人，愿我们都安好。'];
Page({
  data: { photoPath: '', copies: copies, selectedCopy: 0, generating: false },
  choosePhoto() { const page = this; mediaService.choosePhoto().then(function (file) { page.setData({ photoPath: file.tempFilePath }); }).catch(function (error) { if (error && String(error.errMsg).indexOf('cancel') >= 0) return; wx.showToast({ title: '暂时无法选择照片', icon: 'none' }); }); },
  chooseCopy(event) { const index = Number(event.currentTarget.dataset.index); this.setData({ selectedCopy: index }); recommendation.recordChoice('peony'); analytics.track('copy_select', { scene: 'create', styleId: 'copy-' + index }); },
  generateWork() {
    if (!this.data.photoPath) { wx.showToast({ title: '请先选择一张照片', icon: 'none' }); return; }
    const page = this;
    page.setData({ generating: true });
    const draft = {
      type: 'photo', photoPath: page.data.photoPath, theme: 'peony', period: '问候', title: '愿你平安',
      copy: page.data.copies[page.data.selectedCopy], createdAt: Date.now()
    };
    storage.setPreviewDraft(draft);
    analytics.track('preview_open', { scene: 'create', entry: 'photo_selected' });
    page.setData({ generating: false });
    wx.navigateTo({ url: '/pages/preview/preview' });
  }
});
