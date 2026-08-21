const env = require('../config/env');
function canShowAds() { return Boolean(env.features.ads); }
function getBannerUnitId() { return canShowAds() ? env.adUnits.banner : ''; }
function showRewardedVideo() {
  const unitId = env.adUnits.rewardedVideo;
  if (!canShowAds() || !unitId || !wx.createRewardedVideoAd) return Promise.resolve({ completed: true, skipped: true });
  const ad = wx.createRewardedVideoAd({ adUnitId: unitId });
  return ad.show().then(function () { return new Promise(function (resolve) { ad.onClose(function (result) { resolve({ completed: !result || result.isEnded, skipped: false }); }); }); });
}
module.exports = { canShowAds: canShowAds, getBannerUnitId: getBannerUnitId, showRewardedVideo: showRewardedVideo };
