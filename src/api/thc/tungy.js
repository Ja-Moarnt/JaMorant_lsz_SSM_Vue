import request from '@/utils/request'

const api_name = '/admin/thc/tungy'

export default {
  // 囤货场分类列表
  getChildList(page,limit) {
    return request({
      url: `${api_name}/GetTungy/${page}/${limit}`,
      method: 'get'
    })
  },
  aiGoods(){
    return request({
      url: `/admin/order/AI/UpdataTrain`,
      method: 'get'
    })
  }
}
