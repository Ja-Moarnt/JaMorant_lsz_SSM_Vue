import request from '@/utils/request'

const api_name = '/admin/vod/carshoping'

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
  saveCarShopingInfo(carshopingInfo) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: carshopingInfo
    })
  },
  // id获取课程信息
  getCarShopingInfoById(id) {
    return request({
      url: `${api_name}/getCarShoping/${id}`,
      method: 'get'
    })
  },
  // 修改课程信息
  updateCarShopingInfoById(carshopingInfo) {
    return request({
      url: `${api_name}/updateCarShoping`,
      method: 'post',
      data: carshopingInfo
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
  }
}
