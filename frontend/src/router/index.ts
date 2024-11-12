import { createRouter, createWebHistory } from 'vue-router'
import PageNotFoundView from '@/views/PageNotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: '/tictactoe/:gameid',
      name: 'Tic Tac Toe Game View',
      component: () => import('@/views/tictactoe/GameView.vue'),
    },
    {
      path: '/tictactoe/',
      name: 'Tic Tac Toe',
      component: () => import('@/views/tictactoe/TicTacToeView.vue'),
    },
    {
      path: '/about/',
      name: 'About Us',
      component: () => import('@/views/AboutView.vue'),
    },
    { path: '/:pathMatch(.*)*', name: '404 Not Found', component: () => import("@/views/PageNotFoundView.vue"), },
  ],
})

export default router
