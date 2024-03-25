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
    redirect: '/data/dataList',
  },
  {
    path: '/data',
    redirect: '/data/dataList',
    name: 'data',
    meta: { title: '数据管理', icon: 'dashboard' },
    component: Layout,
    children: [{
      path: 'dataList',
      name: 'dataList',
      component: () => import('@/views/data/dataList'),
      meta: { title: '数据列表', icon: 'list' }
    }, {
      path: 'dataTreat',
      name: 'dataTreat',
      component: () => import('@/views/data/dataDeal'),
      meta: {
        title: '数据处理',
        icon: 'deal'
      }
    },{
      path: 'dataAnalysis',
      name: 'dataAnalysis',
      component: () => import('@/views/data/dataAnalysis'),
      meta: {
        title: '数据分析',
        icon: 'analysis'
      }
    }]
  },
  
  {
    path: '/model',
    component: Layout,
    redirect: '/model/myModel',
    name:'model',
    meta: {
      title: '模型中心',
      icon: 'nested'
    },

    children: [
      {
        path:'algorithm',
        name:'algorithm',
        component: () => import("@/views/model/algorithm.vue"),
        meta:{
          title:'算法列表',icon:'algorithm'
        }
      },
      
      {
        path: 'trainModel',
        component: () => import('@/views/model/trainModel/index'),
        name: 'trainModel',
        meta: { title: '训练模型' ,icon:'train'}
      },
      {
        path: 'myModel',
        component: () => import('@/views/model/myModel/index'),
        name: 'myModel',
        meta: { title: '模型仓库' ,icon:'repositry'},
      },
      {
        path: 'validateModel',
        component: () => import('@/views/model/validateModel/index'),
        name: 'validateModel',
        meta: { title: '外部数据验证',icon:'verify'}
      },
      {
        path: 'evaluate',
        component: () => import('@/views/modelEvaluate/index'),
        hidden: true
      }
    ]
  },
  {
    name:'docker',
    path:'/docker',
    component:Layout,
    meta:{title:'Docker',icon:'docker'},
    children:[{
      name:'imageList',
      path:'imageList',
      component: () => import("@/views/docker/imageList.vue"), 
      meta:{
        title:'镜像列表',icon:'image'
      }
    },{
      name:'containerList',
      path:'containerList',
      component: () => import("@/views/docker/containerList.vue"),
      meta:{
        title:'容器列表',icon:'container'
      } 
    }]
  },
  {
    name:'modelEvl',
    path:'/modelEvl',
    component: () => import('@/views/modelEvaluate/index'),
    meta:{
      title:'模型效果评估'
    },
    hidden:true
  },
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
