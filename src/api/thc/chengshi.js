import request from '@/utils/request'

const api_name = '/admin/thc/chengshi'

export default {
  // 城市分类列表
  getChildList(id) {
    return request({
      url: `${api_name}/getChildChengshi/${id}`,
      method: 'get'
    })
  }
}
