import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TestView from "../views/TestView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/test",
    name: "test",
    component: TestView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
