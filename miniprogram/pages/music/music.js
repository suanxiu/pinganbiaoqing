const contentService = require('../../services/content');
Page({ data: { songs: [] }, onLoad() { const page = this; contentService.getSongs().then(function (songs) { page.setData({ songs: songs }); }); }, showRights() { wx.showToast({ title: '正式音源通过版权审核后接入', icon: 'none' }); } });
