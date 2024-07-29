import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Dice from "../views/Dice.vue";
import Limbo from "../views/Limbo.vue";
import Live from "../views/Live.vue";
import NotFound from "../views/NotFound.vue";
import CSGO500FINAL from "../components/CSGO500FINAL.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: '/dice',
      name: 'dice',
      component: Dice
    },
    {
      path: '/limbo',
      name: 'limbo',
      component: Limbo
    },
    {
      path: '/500',
      name: '500',
      component: CSGO500FINAL
    },
    {
      path: '/live',
      name: 'live',
      component: Live
    },
    {
      path: '/:pathMatch(.*)',
      name: "notFound",
      component: NotFound,
  }
  ],
});

export default router;
