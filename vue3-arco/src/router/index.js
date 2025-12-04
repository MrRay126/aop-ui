import { createRouter, createWebHashHistory } from 'vue-router';
import {
  home,
  notFound,
  redirect404,
  login,
  user,
  opinion,
  dataManage,
  test,
} from './dir';

export const asyncRoutes = [home, opinion, dataManage, user, notFound, redirect404];
if (import.meta.env.DEV) {
  asyncRoutes.push(test);
}

const staticRoutes = [login];

const addedRouteNames = new Set();

export const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [...staticRoutes],
});

export function addAsyncRoutes(routes) {
  routes.forEach((routeItem) => {
    router.addRoute(routeItem);
    if (routeItem.name) {
      addedRouteNames.add(routeItem.name);
    }
  });
}

export function resetRouter() {
  addedRouteNames.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
  addedRouteNames.clear();
}

export default router;
