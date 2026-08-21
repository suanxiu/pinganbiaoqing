const mediaService = require('../../services/media');
const storage = require('../../utils/storage');
const copies = ['愿你平安健康，天天都有好心情。', '花开富贵，家和事兴，所愿皆如意。', '把祝福送给牵挂的人，愿我们都安好。'];
Page({
  data: { photoPath: '', copies: copies, selectedCopy: 0, generating: false },
  choosePhoto() { const page = this; mediaService.choosePhoto().then(function (file) { page.setData({ photoPath: file.tempFilePath }); }).catch(function (error) { if (error && String(error.errMsg).indexOf('cancel') >= 0) return; wx.showToast({ title: '暂时无法选择照片', icon: 'none' }); }); },
  chooseCopy(event) { this.setData({ selectedCopy: Number(event.currentTarget.dataset.index) }); },
  generateWork() {
    if (!this.data.photoPath) { wx.showToast({ title: '请先选择一张照片', icon: 'none' }); return; }
    const page = this; page.setData({ generating: true });
    storage.addWork({ id: 'work-' + Date.now(), type: 'image', sourcePath: page.data.photoPath, previewPath: page.data.photoPath, copy: page.data.copies[page.data.selectedCopy], createdAt: Date.now(), status: 'draft' });
    page.setData({ generating: false });
    wx.showModal({ title: '已放入我的相册', content: '框架阶段先保存照片和文案草稿，下一阶段接入真正的合成与动效。', confirmText: '去相册', cancelText: '继续制作', success: function (result) { if (result.confirm) wx.switchTab({ url: '/pages/album/album' }); } });
  }
});
