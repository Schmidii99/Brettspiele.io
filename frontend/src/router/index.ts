import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', name: 'Home', component: () => import("@/views/HomeView.vue"),
    },
    {
      path: '/tictactoe/:gameid', name: 'Tic Tac Toe Game View', component: () => import('@/views/tictactoe/GameView.vue'),
    },
    {
      path: '/ttt/:gameid', redirect: to => {
        return { path: '/tictactoe/' + to.params.gameid }
      },
    },
    {
      path: '/tictactoe/', name: 'Tic Tac Toe', component: () => import('@/views/tictactoe/TicTacToeView.vue'),
    },
    {
      path: '/connect4/:gameid', name: 'Connect Four Game View', component: () => import('@/views/connect4/GameView.vue'),
    },
    {
      path: '/c4/:gameid', redirect: to => {
        return { path: '/connect4/' + to.params.gameid }
      },
    },
    {
      path: '/connect4/', name: 'Connect Four', component: () => import('@/views/connect4/Connect4View.vue'),
    },
    {
      path: '/about/', name: 'About Us', component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/memory/', name: 'Play Memory', component: () => import('@/views/memory/GameView.vue'),
    },
    {
      path: '/mm/:gameid', redirect: to => {
        return { path: '/memory/' + to.params.gameid }
      },
    },
    { path: '/:pathMatch(.*)*', name: '404 Not Found', component: () => import("@/views/PageNotFoundView.vue"), },
  ],
})

export default router
