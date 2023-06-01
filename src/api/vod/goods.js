import request from '@/utils/request'

const api_name = '/admin/vod/goods'

export default {
  // 课程列表
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  // 添加课程基本信息
  saveGoodsInfo(goodsInfo) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: goodsInfo
    })
  },
  // id获取课程信息
  getGoodsInfoById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },
  // 修改课程信息
  updateGoodsInfoById(goodsInfo) {
    return request({
      url: `${api_name}/update`,
      method: 'post',
      data: goodsInfo
    })
  },
  // 发布课程
  publishGoodsById(id) {
    return request({
      url: `${api_name}/publishGoods/${id}`,
      method: 'put'
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  // 查询所有课程
  findAll() {
    return request({
      url: `${api_name}/findAll`,
      method: 'get'
    })
  },
  // 批量删除
  batchRemove(idList) {
    return request({
      url: `${api_name}/removeBatch`,
      method: `delete`,
      data: idList
    })
  },
  //根据父类标签和子类标签获取全部商品名列表
  GetgoodsBysubid(subjectId){
    return request({
      url: `${api_name}/GetgoodsBysubid/${subjectId}`,
      method: `get`,
    })
  }
}
