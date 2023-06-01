import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '数据分析', icon: 'dashboard' }
    }]
  },

  // 司机管理
  {
    path: '/vod',
    component: Layout,
    redirect: '/vod/teacher/list',
    name: 'vod',
    meta: { title: '用户管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'teacher/list',
        name: 'TeacherList',
        component: () => import('@/views/vod/teacher/list'),
        meta: { title: '司机列表', icon: 'table' }
      },
      {
        path: 'tungy/list',
        name: 'TungyList',
        component: () => import('@/views/vod/tungy/list'),
        meta: { title: '囤货场列表', icon: 'table' }
      },
      {
        path: 'user/list',
        name: 'UserList',
        component: () => import('@/views/vod/user/list'),
        meta: { title: '乘客列表', icon: 'table' }
      },
      {
        path: 'teacher/create',
        name: 'TeacherCreate',
        component: () => import('@/views/vod/teacher/form'),
        meta: { title: '添加司机', icon: 'tree' },
        hidden: true
      },
      {
        path: 'teacher/edit/:id',
        name: 'TeacherEdit',
        component: () => import('@/views/vod/teacher/form'),
        meta: { title: '编辑司机' },
        hidden: true
      }
    ]
  },

  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/list',
    name: '分类管理数据集',
    alwaysShow: true,
    meta: { title: '分类管理数据集', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '商品分类列表',
        component: () => import('@/views/vod/subject/list'),
        meta: { title: '商品分类列表', icon: 'table' }
      },
      {
        path: 'chengshi',
        name: '城市列表',
        component: () => import('@/views/vod/chengshi/list'),
        meta: { title: '城市列表', icon: 'table' }
      },
    ]
  },

  // // 商品管理
  // {
  //   path: '/vodcourse',
  //   component: Layout,
  //   redirect: '/vodcourse/course/list',
  //   name: 'Vodcourse',
  //   meta: {
  //     title: '课程管理',
  //     icon: 'el-icon-bank-card'
  //   },
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: 'course/list',
  //       name: 'CourseList',
  //       component: () => import('@/views/vod/course/list'),
  //       meta: { title: '商品列表', icon: 'table' }
  //     },
  //     {
  //       path: 'course/info',
  //       name: 'CourseInfo',
  //       component: () => import('@/views/vod/course/form'),
  //       meta: { title: '添加商品' },
  //       hidden: true
  //     },
  //     {
  //       path: 'course/info/:id',
  //       name: 'CourseInfoEdit',
  //       component: () => import('@/views/vod/course/form'),
  //       meta: { title: '编辑商品' },
  //       hidden: true
  //     },
  //     {
  //       path: 'course/chapter/:id',
  //       name: 'CourseChapterEdit',
  //       component: () => import('@/views/vod/course/form'),
  //       meta: { title: '编辑大纲' },
  //       hidden: true
  //     },
  //     {
  //       path: 'course/chart/:id',
  //       name: 'CourseChart',
  //       component: () => import('@/views/vod/course/chart'),
  //       meta: { title: '商品统计' },
  //       hidden: true
  //     }
  //   ]
  // },

  // 商品管理
  {
    path: '/vodgoods',
    component: Layout,
    redirect: '/vodgoods/goods/list',
    name: 'Vodgoods',
    meta: {
      title: '商品管理',
      icon: 'el-icon-bank-card'
    },
    alwaysShow: true,
    children: [
      {
        path: 'goods/list',
        name: 'GoodsList',
        component: () => import('@/views/vod/goods/list'),
        meta: { title: '商品列表', icon: 'table' }
      },
      {
        path: 'goods/info',
        name: 'GoodsInfo',
        component: () => import('@/views/vod/goods/form'),
        meta: { title: '添加商品' },
        hidden: true
      },
      {
        path: 'goods/info/:id',
        name: 'GoodsInfoEdit',
        component: () => import('@/views/vod/goods/form'),
        meta: { title: '编辑商品' },
        hidden: true
      },
      {
        path: 'goods/video/:id',
        name: 'GoodsvideoEdit',
        component: () => import('@/views/vod/goods/form'),
        meta: { title: '编辑大纲' },
        hidden: true
      },
      {
        path: 'goods/chart/:id',
        name: 'GoodsChart',
        component: () => import('@/views/vod/goods/chart'),
        meta: { title: '商品统计' },
        hidden: true
      }
    ]
  },

// 汽车管理
  {
    path: '/vodcar',
    component: Layout,
    redirect: '/vodcar/car/list',
    name: 'Vodcar',
    meta: {
      title: '车辆管理',
      icon: 'el-icon-bank-card'
    },
    alwaysShow: true,
    children: [
      {
        path: 'car/list',
        name: 'CarList',
        component: () => import('@/views/car/list'),
        meta: { title: '车辆列表', icon: 'table' }
      },
      {
        path: 'car/info',
        name: 'CarInfo',
        component: () => import('@/views/car/form'),
        meta: { title: '添加车辆' },
        hidden: true
      },
      {
        path: 'car/info/:id',
        name: 'CarInfoEdit',
        component: () => import('@/views/car/form'),
        meta: { title: '编辑商品' },
        hidden: true
      },
      {
        path: 'car/chapter/:id',
        name: 'CarChapterEdit',
        component: () => import('@/views/car/form'),
        meta: { title: '编辑大纲' },
        hidden: true
      },
      {
        path: 'car/chart/:id',
        name: 'CarChart',
        component: () => import('@/views/car/chart'),
        meta: { title: '商品统计' },
        hidden: true
      }
    ]
  },


  // 汽车货物管理
  // 商品管理
  {
    path: '/vodcarshoping',
    component: Layout,
    redirect: '/vodcarshoping/carshoping/list',
    name: 'Vodcourse',
    meta: {
      title: '车辆货物管理',
      icon: 'el-icon-bank-card'
    },
    alwaysShow: true,
    children: [
      {
        path: 'carshoping/list',
        name: 'CarshopingList',
        component: () => import('@/views/carshoping/list'),
        meta: { title: '商品列表', icon: 'table' }
      },
      {
        path: 'carshoping/info',
        name: 'CarshopingInfo',
        component: () => import('@/views/carshoping/form'),
        meta: { title: '添加商品' },
        hidden: true
      },
      {
        path: 'carshoping/info/:id',
        name: 'CarshopingInfoEdit',
        component: () => import('@/views/carshoping/form'),
        meta: { title: '编辑商品' },
        hidden: true
      },
      {
        path: 'carshoping/chapter/:id',
        name: 'CarshopingChapterEdit',
        component: () => import('@/views/carshoping/form'),
        meta: { title: '编辑大纲' },
        hidden: true
      },
      {
        path: 'carshoping/chart/:id',
        name: 'CarshopingChart',
        component: () => import('@/views/carshoping/chart'),
        meta: { title: '商品统计' },
        hidden: true
      }
    ]
  },

  // 订单管理
  {
    path: '/order',
    component: Layout,
    redirect: '/order/orderInfo/list',
    name: 'Order',
    meta: { title: '订单管理', icon: 'el-icon-truck' },
    alwaysShow: true,
    children: [
      {
        path: 'orderInfo/list',
        name: 'OrderInfo',
        component: () => import('@/views/order/list'),
        meta: { title: '订单列表' }
      },
      {
        path: 'orderInfo/form/:id',
        name: 'OrderInfoForm',
        component: () => import('@/views/order/form'),
        meta: { title: '订单详情列表' },
        hidden: true
      }
    ]
  },

  // 营销管理优惠券
  {
    path: '/activity',
    component: Layout,
    redirect: '/couponInfo/list',
    name: 'Activity',
    meta: { title: '营销管理', icon: 'el-icon-football' },
    alwaysShow: true,
    children: [
      {
        path: 'couponInfo/list',
        name: 'CouponInfo',
        component: () => import('@/views/activity/couponInfo/list'),
        meta: { title: '优惠券列表' }
      },
      {
        path: 'couponInfo/add',
        name: 'CouponInfoAdd',
        component: () => import('@/views/activity/couponInfo/form'),
        meta: { title: '添加' },
        hidden: true
      },
      {
        path: 'couponInfo/edit/:id',
        name: 'CouponInfoEdit',
        component: () => import('@/views/activity/couponInfo/form'),
        meta: { title: '编辑', noCache: true },
        hidden: true
      },
      {
        path: 'couponInfo/show/:id',
        name: 'CouponInfoShow',
        component: () => import('@/views/activity/couponInfo/show'),
        meta: { title: '详情', noCache: true },
        hidden: true
      }
    ]
  },

  // // 公众号管理
  // {
  //   path: '/wechat',
  //   component: Layout,
  //   redirect: '/wechat/menu/list',
  //   name: 'Wechat',
  //   meta: {
  //     title: '公众号菜单管理',
  //     icon: 'el-icon-refrigerator'
  //   },
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: 'menu/list',
  //       name: 'Menu',
  //       component: () => import('@/views/wechat/menu/list'),
  //       meta: { title: '菜单列表' }
  //     }
  //   ]
  // },

//   // 直播管理
//   {
//     path: '/live',
//     component: Layout,
//     redirect: '/live/liveCourse/list',
//     name: 'Live',
//     meta: {
//       title: '收益管理',
//       icon: 'el-icon-bangzhu'
//     },
//     alwaysShow: true,
//     children: [
//       {
//         path: 'liveCourse/list',
//         name: 'liveCourseList',
//         component: () => import('@/views/live/liveCourse/list'),
//         meta: { title: '直播列表' }
//       },
//       {
//         path: 'liveCourse/config/:id',
//         name: 'liveCourseConfig',
//         component: () => import('@/views/live/liveCourse/config'),
//         meta: { title: '直播配置' },
//         hidden: true
//       },
//       {
//         path: 'liveVisitor/list/:id',
//         name: 'liveVisitor',
//         component: () => import('@/views/live/liveVisitor/list'),
//         meta: { title: '观看记录' },
//         hidden: true
//       }
//     ]
//   },
//   // 直播管理
//   {
//   path: '/thc',
//   component: Layout,
//   redirect: '/thc/im',
//   name: 'thc',
//   meta: {
//   title: '囤货场',
//     icon: 'el-icon-bangzhu'
// },
// alwaysShow: true,
//   children: [
//   {
//     path: '/thc/im',
//     name: 'Im',
//     component: () => import("@/views/thc/Im"),
//     meta: { title: '聊天室1' },
//   },
//     {
//       path: '/thc/JaMoarant',
//       name: 'JaMoarant',
//       component: () => import("@/views/thc/JaMorant"),
//       meta: { title: '聊天室2' },
//     },
//     {
//       path: '/thc/xff',
//       name: 'xff',
//       component: () => import("@/views/thc/xff"),
//       meta: { title: '聊天室3' },
//     }
//   ]
//   },


  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
