
import request from '../../utils/request';

export default {
  // 获取所有的SPU销售属性列表
  // GET /admin/product/baseSaleAttrList
  // getBaseSaleAttrList
  getSaleAttrList() {
    return request.get('/admin/product/baseSaleAttrList')
  },
  // 删除指定的SPU
  // DELETE/ admin/product/deleteSpu/{spuId}
  // deleteSpu
  remove(spuId) {
    return request.delete(`admin/product/deleteSpu/${spuId}`)
  },

  // 根据id获取SPu信息
  // GET /admin/product/getSpuById/{spuId}
  // spuList :包含多个商铺简单信息的数组,数组里面放了很多spu对象,但是每个spu对象里信息不全
  // spuInfo: 包含一个详细的spu对象,
  get(spuId) {
    return request.get(`/admin/product/getSpuById/${spuId}`)
  },


  // POST / admin / product / saveSpuInfo
  // saveSpuInfo
  // POST / admin / product / updateSpuInfo
  // 更改spu信息
  addUpdate(spuInfo) {
    return request({
      url: `/admin/product/${spuInfo.id ? 'update' : "save"}spuInfo`,
      method: "POST",
      data:spuInfo
    })
  },
  // 获取spu分页列表
  // GET /admin/product/{page}/{limit}
  getList(page,limit,category3Id) {
    return request({
      url: `/admin/product/${page}/${limit}`,
      method:"GET",
      params:{category3Id}
    })
  },

  // findSpuInfoByKeyword(keyword) {
  //   return request({
  //     url: `admin/product/findSpuInfoByKeyword/${keyword}`,
  //     method:"get"
  //   })
  // }
}