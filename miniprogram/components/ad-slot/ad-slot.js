const adService = require('../../services/ad');
Component({ data: { visible: false, unitId: '' }, lifetimes: { attached() { const unitId = adService.getBannerUnitId(); this.setData({ visible: Boolean(unitId), unitId: unitId }); } } });
