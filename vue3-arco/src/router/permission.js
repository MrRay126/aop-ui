import router, { resetRouter, asyncRoutes, addAsyncRoutes } from '@/router';
import store from '@/store';
import Cookies from 'js-cookie';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { read, save } from '@/utils';
import utils from '@/utils';

let loginOpend = false;
let isInittingProject = false;

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  if (isInittingProject) return; // 切换app addRoute 时会触发多次, 所以使用单例模式

  NProgress.start();
  const token = Cookies.get('access_token');
  const hasToken = typeof token !== 'undefined';
  if (hasToken) {
    const projectId = to.query.projectId || read('projectId'); // session中的项目id用于刷新时保持app不变

    const isNewProjectId =
      projectId &&
      isUsefulProjectId(store.state.dashbord.appList, projectId) &&
      store.getters.appId &&
      Number(projectId) !== store.getters.appId;
    if (!store.getters.perms || store.getters.perms.length === 0 || isNewProjectId) {
      isInittingProject = true;
      const appList = await store.dispatch('dashbord/getAppList');
      const curApp = getAppByProjectIdAndSetToCurrentApp(projectId, appList);
      const pId = curApp.id;
      store
        .dispatch('auth/getUserInfo', { project_id: pId })
        .then((data) => {
          const roles = data.roles;
          generateRoutes(asyncRoutes, { roles }).then(async (permRoutes) => {
            resetRouter();
            addAsyncRoutes(permRoutes);

            isInittingProject = false;

            store
              .dispatch('auth/setRoutes', permRoutes)
              .then(() => {})
              .catch(() => {});
            next({ ...to, replace: true });

            NProgress.done();
          });
        })
        .catch(() => {
          store
            .dispatch('auth/logout')
            .then(() => {
              next({ path: '/' });
            })
            .catch(() => {});
        });
    }
    NProgress.done();
  } else {
    const accessToken = utils.getUrlKey('access_token');
    if (accessToken) {
      Cookies.set('access_token', accessToken);
      const url = window.location.href.split('?')[0];
      window.location.href = url;
      NProgress.done();
      return;
    }

    if (to.path === window.aop.login && !loginOpend) {
      loginOpend = true;
      next({ path: window.aop.login });
      NProgress.done();
      return;
    }

    if (to.path !== window.aop.login) {
      store.dispatch('auth/ssoLogin').then((ssoUrl) => {
        if (ssoUrl) {
          window.location = ssoUrl;
        }
      });

      return;
    }
  }
  NProgress.done();
  next();
});

function isUsefulProjectId(appList, projectId) {
  return appList.some((appItem) => {
    return appItem.id === Number(projectId);
  });
}

export function initRoutes(projectId, to, from, next) {
  store
    .dispatch('auth/getUserInfo', { project_id: projectId })
    .then((data) => {
      const roles = data.roles;

      generateRoutes(asyncRoutes, { roles }).then(async (permRoutes) => {
        resetRouter();
        addAsyncRoutes(permRoutes);

        store
          .dispatch('auth/setRoutes', permRoutes)
          .then(() => {})
          .catch(() => {});

        next && next({ ...to, replace: true });

        NProgress.done();
      });
    })
    .catch(() => {
      store
        .dispatch('auth/logout')
        .then(() => {
          next && next({ path: '/' });
        })
        .catch(() => {});
    });
}

function generateRoutes(asyncRoutes, { roles }) {
  function filterAsyncRouter(asyncRouterMap, roleList) {
    const accessedRouters = asyncRouterMap.filter((route) => {
      if (hasPermission(roleList, route)) {
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, roleList);
        }
        return true;
      }
      return false;
    });
    return accessedRouters;
  }

  function hasPermission(roleList, route) {
    if (!route.meta || !route.meta.roles) {
      return true;
    }
    return roleList.some((r) => route.meta.roles.includes(r));
  }

  return new Promise((resolve) => {
    const accessedRouters = filterAsyncRouter(asyncRoutes, roles);
    resolve(accessedRouters);
  });
}

function getAppByProjectIdAndSetToCurrentApp(projectId, appList) {
  let app = appList[0];

  if (projectId) {
    const findApp = appList.find((item) => {
      return item.id == projectId;
    });

    if (findApp) {
      app = findApp;
    }
  }

  save('projectId', app.id);
  store.commit('dashbord/SET_CUR_APP', app);
  return app;
}
