import { createRouter, createWebHistory } from 'vue-router'
import RootLayout from '@/views/RootLayout.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: RootLayout,
      children: [{ path: '', name: 'home', component: HomeView }],
    },
  ],
})

export default router
