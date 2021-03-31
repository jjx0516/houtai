import request from '../../utils/request';


export default {
  // 每个接口请求函数就是这个对象当中的一个方法
  // DELETE / admin / product / baseTrademark / remove / {id}  // 删除品牌
  // 删除BaseTrademark
  delete(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },
  // POST / admin / product / baseTrademark / save  // 添加品牌
  // 新增BaseTrademark

  // PUT / admin / product / baseTrademark / update   修改品牌
  // 修改BaseTrademark
  // 添加品牌和修改品牌都需要传递一个对象,请求体参数
  // {
  // "id": 0,    // 添加一个品牌是不需要id的,修改一个品牌需要id
  // "logoUrl": "string",
  // "tmName": "string"
  // }
  addOrUpdate(trademark) {  //trademark  传递一个对象 请求体参数
    if (trademark.id) {
      return request.put('/admin/product/baseTrademark/update',trademark)
    } else {
      return request.post('/admin/product/baseTrademark/save', trademark)
    }
  },

  // GET / admin / product / baseTrademark / {page}/{limit}   获取品牌分页列表
  getPageList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },

  // 获取所有的品牌列表
  // GET /admin/product / baseTrademark / getTrademarkList
  getList() {
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }

}
// 默认暴露,最终暴露出去的是什么东西  对象
  //默认暴露出去的对象,是以default为属性,default后面的值为值的对象
    // export default 100
    // import {default as a} from './xxx.js'  完整写法
        // import a from './xxx.js'  简化写法


// 部分暴露,最终暴露出去的是什么东西  对象

// 整体暴露,最终暴露出去的是什么东西  对象

// 无论是哪种方式,想要直接拿到暴露出去的对象
// import * as $API from 'xxx.js'