import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/tictactoe/:gameid',
      name: 'Tic Tac Toe Game View',
      component: () => import('../views/tictactoe/GameView.vue'),
    },
    {
      path: '/tictactoe/',
      name: 'Tic Tac Toe',
      component: () => import('../views/tictactoe/TicTacToeView.vue'),
    },
  ],
})

export default router
