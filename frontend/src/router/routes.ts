import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../use-case/real-time-vehicle-feed/RealTimeVehicleFeedPage.vue')
  },

  {
    path: '/login',
    component: () => import('../use-case/authenticate-user/LoginPage.vue')
  },

  {
    path: '/notifications',
    component: () => import('../use-case/view-notifications/ViewNotificationsPage.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
