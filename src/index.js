import Vue from 'vue'
import VueRouter from 'vue-router'
import './cache'
import App from './App.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('./views/home.vue'),
    },
    {
      path: '/a',
      component: () => import('./views/A.vue'),
    },
    {
      path: '/b',
      component: () => import('./views/B.vue'),
    },
  ],
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')