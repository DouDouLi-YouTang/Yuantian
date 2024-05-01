import {createRouter, createWebHashHistory} from 'vue-router'
import home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/home',
    name:'userHome',

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
