function choosePhoto() { return new Promise(function (resolve, reject) { wx.chooseMedia({ count: 1, mediaType: ['image'], sourceType: ['album', 'camera'], success: function (result) { resolve(result.tempFiles[0]); }, fail: reject }); }); }
function saveImage(tempFilePath) { return new Promise(function (resolve, reject) { wx.saveImageToPhotosAlbum({ filePath: tempFilePath, success: resolve, fail: reject }); }); }
module.exports = { choosePhoto: choosePhoto, saveImage: saveImage };
