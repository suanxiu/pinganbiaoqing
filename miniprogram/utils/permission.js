function ensureAlbumPermission() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: function (settings) {
        if (settings.authSetting['scope.writePhotosAlbum'] === true) {
          resolve();
          return;
        }
        if (settings.authSetting['scope.writePhotosAlbum'] === false) {
          wx.openSetting({
            success: function (result) {
              if (result.authSetting['scope.writePhotosAlbum']) resolve();
              else reject({ code: 'ALBUM_PERMISSION_DENIED' });
            },
            fail: function () { reject({ code: 'ALBUM_PERMISSION_DENIED' }); }
          });
          return;
        }
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: resolve,
          fail: function () { reject({ code: 'ALBUM_PERMISSION_DENIED' }); }
        });
      },
      fail: function () { reject({ code: 'SETTING_UNAVAILABLE' }); }
    });
  });
}

module.exports = { ensureAlbumPermission: ensureAlbumPermission };
