import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import {
  home,
  notFound,
  redirect404,
  login,
  user,
  opinion,
  dataManage,
  test,
} from "./dir";

export const asyncRoutes = [
  home,
  opinion,
  dataManage,
  user,
  notFound,
  redirect404,
  // login,
];

if (process.env.NODE_ENV === "development") {
  asyncRoutes.push(test);
}

const staticRoutes = [login];
// const constantRoutes = [main.notFound, main.redirect404];

const createRouter = () => {
  // 重写push replace 解决重复路由时 Avoided redundant navigation 报错问题

  const originalPush = VueRouter.prototype.push;
  const originalReplace = VueRouter.prototype.replace;
  VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
  };

  VueRouter.prototype.replace = function push(location) {
    return originalReplace.call(this, location).catch((err) => err);
  };

  return new VueRouter({
    // mode: "history",
    scrollBehavior: () => ({ y: 0 }),
    routes: [...staticRoutes],
  });
};

const router = createRouter();

export function resetRouter() {
  router.matcher = createRouter().matcher;
}

export default router;
