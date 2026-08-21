const contentService = require('../../services/content');
Page({ data: { digest: { dateLabel: '', items: [] } }, onLoad() { const page = this; contentService.getNewsDigest().then(function (digest) { page.setData({ digest: digest }); }); }, onShareAppMessage() { return { title: '昨日新闻，一张图快速了解', path: '/pages/news/news' }; } });
