import request from '@/utils/request'

const api_name = '/admin/user/userInfo'

export default {
  // 乘客分类列表
  getUserList(page,limit) {
    return request({
      url: `${api_name}/GetUser/${page}/${limit}`,
      method: 'get'
    })
  },

}
