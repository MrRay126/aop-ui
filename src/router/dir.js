import { buildConstant } from "./constant";

const modulesFiles = require.context("./modules", true, /\.js$/);

const routes = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

//主页
const home = (() => {
  let children = [routes.dashbord.portal];
  const out = {
    name: "home",
    path: "/",
    component: () => import("@/views/components/layout/layout.vue"),
    redirect: "/dashbord",
    children,
    meta: { hidden: true },
  };
  buildConstant(out);
  return out;
})();

// 404
const notFound = (() => {
  const out = routes.main.notFound;
  buildConstant(out);
  return out;
})();

//重定向到404
const redirect404 = (() => {
  const out = routes.main.redirect404;
  buildConstant(out);
  return out;
})();

//登录页面
const login = (() => {
  const out = routes.main.login;
  buildConstant(out);
  return out;
})();

//用户
const user = (() => {
  let children = [routes.user.userInfo, routes.user.projectManage];
  const out = {
    name: "user",
    path: "/user",
    component: () => import("@/views/components/layout/layout.vue"),
    children,
    meta: {
      hidden: true,
    },
  };
  buildConstant(out);
  return out;
})();

// 舆情分析
const opinion = (() => {
  let children = [
    routes.opinion.trend,
    routes.opinion.theme,
    routes.opinion.words,
    routes.opinion.spread,
    routes.opinion.topic,
    // routes.opinion.reports,
    routes.opinion.competition,
    routes.opinion.kol,
  ];

  const out = {
    name: "opinion",
    path: "/opinion",
    component: () => import("@/views/components/layout/layout.vue"),
    children,
    meta: { title: "舆情分析" },
  };
  buildConstant(out);
  return out;
})();

//数据管理
const dataManage = (() => {
  let children = [
    routes.dataManage.hotWords,
    routes.dataManage.warn,
    routes.dataManage.warnConfig,
    routes.dataManage.reports,
    routes.dataManage.dataIntegration,
    routes.dataManage.metaData,
  ];

  const out = {
    name: "dataManage",
    path: "/data",
    component: () => import("@/views/components/layout/layout.vue"),
    children,
    meta: { title: "数据管理" },
  };
  buildConstant(out);
  return out;
})();

const test = (() => {
  const out = {
    name: "test",
    path: "/test",
    component: () => import("@/views/test/index.vue"),
    meta: { var: "test", title: "测试页面" },
  };
  return out;
})();

export { home, notFound, redirect404, login, user, opinion, dataManage, test };
