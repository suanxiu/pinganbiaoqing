const env = require('../config/env');

function get(path, data) {
  if (!env.apiBaseUrl) return Promise.reject({ code: 'API_UNCONFIGURED' });
  return new Promise(function (resolve, reject) {
    wx.request({
      url: env.apiBaseUrl + path,
      method: 'GET',
      data: data || {},
      timeout: env.requestTimeout,
      success: function (response) {
        if (response.statusCode >= 200 && response.statusCode < 300) resolve(response.data);
        else reject({ code: 'HTTP_' + response.statusCode });
      },
      fail: function () { reject({ code: 'NETWORK_ERROR' }); }
    });
  });
}

module.exports = { get: get };
