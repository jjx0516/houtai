import request from '../../utils/request';

export default {
  // sku下架 
  // GET /admin/product/cancelSale/{skuId}
  cancelSale(skuId) {
    return request.get(`/admin/product/cancelSale/${skuId}`)
  },

  // sku上架
  // GET /admin/product/onSale/{skuId}
  onSale(skuId) {
    return request.get(`/admin/product/onSale/${skuId}`)
  },

  // 删除指定id的sku
  // DELETE /admin/product/deleteSku/{skuId}
  remove(skuId) {
    return request.delete(`/admin/product/deleteSku/${skuId}`)
  },

  // 根据指定的spuid查询所有对应的sku的列表
  // GET /admin/product/findBySpuId/{spuId}
  getListBySpuId(spuId) {
    return request.get(`/admin/product/findBySpuId/${spuId}`)
  },

  // 根据sku的id查询sku的详细信息
  // GET /admin/product/getSkuById/{skuId}
  get(skuId) {
    return request.get(`/admin/product/getSkuById/${skuId}`)
  },

  // 获取SKu分页列表
  // GET /admin/product/list/{page}/{limit}
  getList(page,limit) {
    return request.get(`/admin/product/list/${page}/${limit}`)
  },

  // 保存sku  增加和修改
  // POST /admin/product/saveSkuInfo
  // POST /admin/product/updateSkuInfo
  addUpdate(skuInfo) {
    return request.post(`/admin/product/${skuInfo.id ? 'update' : 'save'}SkuInfo`,skuInfo)
  },

  // 获取指定spu的id对应的图片列表
  // GET /admin/product/spuImageList/{spuId}
  getSpuImageList(spuId) {
    return request.get(`/admin/product/spuImageList/${spuId}`)
  },

  /*
    所有的spu销售属性列表: 所有的销售属性 [颜色 版本 套装]
    某个spu的销售属性列表: [颜色 套装]
  */ 

  // 获取指定Spu的id对应的销售属性列表
  // GET /admin/product/spuSaleAttrList/{spuId}
  getSpuSaleAttrList(spuId) {
    return request.get(`/admin/product/spuSaleAttrList/${spuId}`)
  }
}