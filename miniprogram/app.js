const env = require('./config/env');
const analytics = require('./services/analytics');

App({
  globalData: { env: env, userPreferences: null },
  onLaunch() {
    this.globalData.userPreferences = wx.getStorageSync('pingan.preferences') || {
      textSize: 'large', quietMode: true
    };
    analytics.track('app_launch', { source: 'local' });
  },
  onError(error) {
    analytics.track('app_error', { category: 'runtime', message: String(error).slice(0, 80) });
  },
  onUnhandledRejection(event) {
    analytics.track('app_error', { category: 'promise', message: String(event && event.reason).slice(0, 80) });
  }
});
