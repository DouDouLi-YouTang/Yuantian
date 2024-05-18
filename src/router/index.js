import {createRouter, createWebHashHistory} from 'vue-router'
import home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'userHome',
    component: () => import( "../views/Index/index.vue"),
    redirect: {name: 'Navs'},
    children: [
      {
        path: '/Navs',
        name: 'Navs',
        component: () => import( "../views/Collection/index.vue"),
      }, {
        path: '/Found',
        name: 'Found',
        component: () => import( "../views/Found/index.vue")
      }, {
        path: '/ChangeLog',
        name: 'ChangeLog',
        component: () => import( "../views/ChangeLog/index.vue")
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
