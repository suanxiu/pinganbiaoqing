const env = require('./config/env');

App({
  globalData: { env: env, userPreferences: null },
  onLaunch() {
    this.globalData.userPreferences = wx.getStorageSync('pingan.preferences') || {
      textSize: 'large', quietMode: true
    };
  }
});
