const dailyItems = [
  { id: 'daily-peace-1', scene: 'morning', period: '早安', title: '今日平安', copy: '新的一天，愿你心里有暖，脚下有路，家人平安。', theme: 'peony', themeName: '花开富贵', defaultWeight: 80, reviewState: 'approved', rightsState: 'clear', version: 1 },
  { id: 'daily-peace-2', scene: 'morning', period: '早安', title: '顺心如意', copy: '晨光已经到来，愿今天顺顺利利，欢欢喜喜。', theme: 'pine', themeName: '松鹤延年', defaultWeight: 60, reviewState: 'approved', rightsState: 'clear', version: 1 },
  { id: 'daily-peace-3', scene: 'night', period: '晚安', title: '一夜好眠', copy: '放下今天的辛劳，愿你一夜好眠，明日精神满满。', theme: 'moon', themeName: '月明人安', defaultWeight: 80, reviewState: 'approved', rightsState: 'clear', version: 1 },
  { id: 'daily-peace-4', scene: 'night', period: '晚安', title: '家人安好', copy: '夜色渐深，愿你和牵挂的人都平安健康。', theme: 'lotus', themeName: '荷香清宁', defaultWeight: 60, reviewState: 'approved', rightsState: 'clear', version: 1 },
  { id: 'daily-peace-5', scene: 'general', period: '问候', title: '福气常在', copy: '愿日子有滋有味，心里轻轻松松，家中和和美美。', theme: 'bamboo', themeName: '竹报平安', defaultWeight: 70, reviewState: 'approved', rightsState: 'clear', version: 1 },
  { id: 'daily-peace-6', scene: 'general', period: '问候', title: '天天好心情', copy: '把笑容留给自己，把祝福送给亲友。', theme: 'peony', themeName: '花开富贵', defaultWeight: 50, reviewState: 'approved', rightsState: 'clear', version: 1 }
];
const news = ['便民服务：多地持续完善社区养老和助餐服务。', '健康提醒：高温天气注意补水，避免长时间户外活动。', '生活提示：收到陌生链接或转账请求，先向家人核实。'];
const songs = [{ id: 'song-1', title: '经典旋律示例一', rights: '待接入已授权音源' }, { id: 'song-2', title: '经典旋律示例二', rights: '待接入已授权音源' }];
const products = [
  { id: 'product-1', category: '健康生活', title: '防滑家居拖鞋', price: '39.90', tag: '居家实用' },
  { id: 'product-2', category: '日常用品', title: '大字便携收音机', price: '89.00', tag: '操作简单' },
  { id: 'product-3', category: '节日心意', title: '节气问候礼盒', price: '69.00', tag: '送亲友' }
];
module.exports = { dailyItems: dailyItems, news: news, songs: songs, products: products };
