const composer = require('../../utils/composer');
const storage = require('../../utils/storage');
const mediaService = require('../../services/media');
const generation = require('../../services/generation');
const analytics = require('../../services/analytics');

Page({
  data: {
    draft: null,
    imagePath: '',
    rendering: true,
    saving: false,
    motionState: 'idle',
    motionMessage: ''
  },

  onLoad() {
    const draft = storage.getPreviewDraft();
    if (!draft) {
      this.setData({ rendering: false, motionMessage: '没有找到待预览内容，请重新制作。' });
      return;
    }
    this.setData({ draft: draft });
    this.renderStatic(draft);
  },

  renderStatic(draft) {
    const page = this;
    page.setData({ rendering: true });
    const job = generation.createJob(draft);
    composer.render(page, 'previewCanvas', draft).then(function (imagePath) {
      const result = generation.completeStatic(job, imagePath);
      page.setData({ rendering: false, imagePath: result.imagePath });
      storage.setPreviewDraft(Object.assign({}, draft, { imagePath: result.imagePath, jobId: result.id }));
    }).catch(function (error) {
      page.setData({ rendering: false, motionMessage: page.errorMessage(error) });
      analytics.track('generation_result', { state: 'failed', outputType: 'image', category: error.code || 'CANVAS_ERROR' });
    });
  },

  errorMessage(error) {
    const code = error && error.code;
    if (code === 'CANVAS_EXPORT_FAILED') return '图片生成失败，请重新试一次。';
    if (code === 'ALBUM_PERMISSION_DENIED') return '需要允许保存到手机相册，才可以保存成品。';
    return '这次没有生成成功，请重新试一次。';
  },

  saveImage() {
    if (!this.data.imagePath || this.data.saving) return;
    const page = this;
    page.setData({ saving: true });
    mediaService.saveImage(this.data.imagePath).then(function () {
      page.setData({ saving: false });
      page.finishWork('saved');
      analytics.track('local_save_result', { scene: 'preview', outputType: 'image', state: 'success' });
      wx.showToast({ title: '已保存到手机', icon: 'success' });
    }).catch(function (error) {
      page.setData({ saving: false, motionMessage: page.errorMessage(error) });
      analytics.track('local_save_result', { scene: 'preview', outputType: 'image', state: 'failed', category: error.code || 'SAVE_ERROR' });
    });
  },

  shareImage() {
    const page = this;
    if (!this.data.imagePath) return;
    mediaService.showImageShareMenu(this.data.imagePath).then(function () {
      analytics.track('share_click', { scene: 'preview', outputType: 'image', entry: 'image_menu' });
    }).catch(function () {
      analytics.track('share_click', { scene: 'preview', outputType: 'image', entry: 'mini_program_fallback' });
      wx.showToast({ title: '请先保存图片，再到微信中分享', icon: 'none' });
    });
  },

  makeMotion() {
    if (!this.data.imagePath || this.data.motionState === 'loading') return;
    const page = this;
    const draft = this.data.draft || {};
    page.setData({ motionState: 'loading', motionMessage: '正在准备动态效果...' });
    const job = generation.createJob(draft);
    generation.requestMotion(job, { imagePath: this.data.imagePath }).then(function (result) {
      if (result.state === 'degraded_static') {
        page.setData({ motionState: 'fallback', motionMessage: '动态服务暂未开启，已保留高清静态图。' });
        return;
      }
      page.setData({ motionState: result.state, motionMessage: '动态任务已提交，稍后可在相册查看。' });
    });
  },

  finishWork(status) {
    const draft = this.data.draft || {};
    const id = draft.workId || 'work-' + Date.now();
    const work = {
      id: id, type: 'image', sourcePath: draft.photoPath || '', previewPath: this.data.imagePath,
      copy: draft.copy || '', theme: draft.theme || 'peony', createdAt: draft.createdAt || Date.now(), status: status
    };
    if (draft.workId) storage.updateWork(id, work);
    else { storage.addWork(work); storage.setPreviewDraft(Object.assign({}, draft, { workId: id })); }
  },

  goAlbum() { wx.switchTab({ url: '/pages/album/album' }); },
  goCreate() { wx.switchTab({ url: '/pages/create/create' }); },
  onShareAppMessage() { return { title: (this.data.draft && this.data.draft.copy) || '愿你平安顺心', path: '/pages/index/index' }; }
});
