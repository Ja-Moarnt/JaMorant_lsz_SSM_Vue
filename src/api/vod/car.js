import request from '@/utils/request'

const api_name = '/admin/vod/car'

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
  saveCarInfo(carInfo) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: carInfo
    })
  },
  // id获取课程信息
  getCarInfoById(id) {
    return request({
      url: `${api_name}/getCar/${id}`,
      method: 'get'
    })
  },
  // 修改课程信息
  updateCarInfoById(carInfo) {
    return request({
      url: `${api_name}/updateCar`,
      method: 'post',
      data: carInfo
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
