const contentService = require('../../services/content');
Page({
  data: { categories: ['全部', '健康生活', '日常用品', '节日心意'], selectedCategory: '全部', products: [], visibleProducts: [] },
  onLoad() { const page = this; contentService.getProducts().then(function (products) { page.setData({ products: products, visibleProducts: products }); }); },
  selectCategory(event) { const category = event.currentTarget.dataset.category; const visibleProducts = category === '全部' ? this.data.products : this.data.products.filter(function (item) { return item.category === category; }); this.setData({ selectedCategory: category, visibleProducts: visibleProducts }); },
  showProduct() { wx.showToast({ title: '商品详情将在商城阶段接入', icon: 'none' }); }
});
