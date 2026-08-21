const permission = require('../utils/permission');

function choosePhoto() {
  return new Promise(function (resolve, reject) {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function (result) { resolve(result.tempFiles[0]); },
      fail: reject
    });
  });
}

function saveImage(tempFilePath) {
  return permission.ensureAlbumPermission().then(function () {
    return new Promise(function (resolve, reject) {
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: resolve,
        fail: function () { reject({ code: 'SAVE_IMAGE_FAILED' }); }
      });
    });
  });
}

function showImageShareMenu(tempFilePath) {
  if (!wx.showShareImageMenu) return Promise.reject({ code: 'IMAGE_SHARE_UNSUPPORTED' });
  return new Promise(function (resolve, reject) {
    wx.showShareImageMenu({
      path: tempFilePath,
      success: resolve,
      fail: function () { reject({ code: 'IMAGE_SHARE_UNSUPPORTED' }); }
    });
  });
}

module.exports = { choosePhoto: choosePhoto, saveImage: saveImage, showImageShareMenu: showImageShareMenu };
