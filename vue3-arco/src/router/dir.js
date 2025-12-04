import { buildConstant } from './constant';

const moduleFiles = import.meta.glob('./modules/**/*.js', { eager: true });
const routes = Object.keys(moduleFiles).reduce((result, path) => {
  const moduleName = path.replace(/^\.\/modules\/(.*)\.js$/, '$1');
  result[moduleName] = moduleFiles[path].default;
  return result;
}, {});

const home = (() => {
  const children = [routes.dashbord.portal];
  const out = {
    name: 'home',
    path: '/',
    component: () => import('@/views/components/layout/layout.vue'),
    redirect: '/dashbord',
    children,
    meta: { hidden: true },
  };
  buildConstant(out);
  return out;
})();

const notFound = (() => {
  const out = routes.main.notFound;
  buildConstant(out);
  return out;
})();

const redirect404 = (() => {
  const out = routes.main.redirect404;
  buildConstant(out);
  return out;
})();

const login = (() => {
  const out = routes.main.login;
  buildConstant(out);
  return out;
})();

const user = (() => {
  const children = [routes.user.userInfo, routes.user.projectManage];
  const out = {
    name: 'user',
    path: '/user',
    component: () => import('@/views/components/layout/layout.vue'),
    children,
    meta: {
      hidden: true,
    },
  };
  buildConstant(out);
  return out;
})();

const opinion = (() => {
  const children = [
    routes.opinion.trend,
    routes.opinion.theme,
    routes.opinion.words,
    routes.opinion.spread,
    routes.opinion.topic,
    routes.opinion.competition,
    routes.opinion.kol,
  ];

  const out = {
    name: 'opinion',
    path: '/opinion',
    component: () => import('@/views/components/layout/layout.vue'),
    children,
    meta: { title: '舆情分析' },
  };
  buildConstant(out);
  return out;
})();

const dataManage = (() => {
  const children = [
    routes.dataManage.hotWords,
    routes.dataManage.warn,
    routes.dataManage.warnConfig,
    routes.dataManage.reports,
    routes.dataManage.dataIntegration,
    routes.dataManage.metaData,
  ];

  const out = {
    name: 'dataManage',
    path: '/data',
    component: () => import('@/views/components/layout/layout.vue'),
    children,
    meta: { title: '数据管理' },
  };
  buildConstant(out);
  return out;
})();

const test = (() => {
  return {
    name: 'test',
    path: '/test',
    component: () => import('@/views/test/index.vue'),
    meta: { var: 'test', title: '测试页面' },
  };
})();

export { home, notFound, redirect404, login, user, opinion, dataManage, test };
