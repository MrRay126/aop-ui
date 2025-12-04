import router from "@/router";
import { resetRouter, asyncRoutes } from "@/router";

import store from "@/store";
import Cookies from "js-cookie";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { read, save } from "@/utils";
import utils from "@/utils";

let loginOpend = false;
let isInittingProject = false;

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  if (isInittingProject) return; // 切换app addRoute 时会触发多次, 所以使用单例模式

  NProgress.start();
  const token = Cookies.get("access_token");
  const hasToken = typeof token !== "undefined";
  if (hasToken) {
    const projectId = to.query.projectId || read("projectId"); // session中的项目id用于刷新时保持app不变

    //3如果登陆成功 获取路由权限, 或 更换app后获取路由权限和用户权限
    const isNewProjectId =
      projectId &&
      isUsefulProjectId(store.state.dashbord.appList, projectId) &&
      store.getters.appId &&
      Number(projectId) !== store.getters.appId;
    if (
      !store.getters.perms ||
      store.getters.perms.length === 0 ||
      isNewProjectId
    ) {
      isInittingProject = true;
      // 项目下的成员的权限生成可用的路由
      const appList = await store.dispatch("dashbord/getAppList");
      const curApp = getAppByProjectIdAndSetToCurrentApp(projectId, appList);
      const pId = curApp.id;
      // initRoutes(projectId, to, from, next);
      store
        .dispatch("auth/getUserInfo", { project_id: pId })
        .then((data) => {
          const roles = data.roles;

          //根据路由权限生成可访问的路由表
          generateRoutes(asyncRoutes, { roles }).then(async (permRoutes) => {
            resetRouter();
            // router.addRoutes(permRoutes);
            permRoutes.forEach((routeItem) => {
              router.addRoute(routeItem);
            });

            isInittingProject = false;

            //保存具有权限的路由, 生成头部导航
            store
              .dispatch("auth/setRoutes", permRoutes)
              .then(() => {})
              .catch(() => {});
            next({ ...to, replace: true });

            NProgress.done();
          });
        })
        .catch(() => {
          //获取用户信息如果token过期则清除前端cookie 同时刷新 通过登陆触发退出(由于没有cookie)
          store
            .dispatch("auth/logout")
            .then(() => {
              next({ path: "/" });
            })
            .catch(() => {});
        });
    }
    NProgress.done();
  } else {
    //获取sso返回url中带的token
    const accessToken = utils.getUrlKey("access_token");
    if (accessToken) {
      Cookies.set("access_token", accessToken);
      const url = window.location.href.split("?")[0]; //去除token参数
      window.location.href = url;
      NProgress.done();
      return;
    }

    //1 首次登录可以通过/login路由登录,也可以非/login路由跳转sso第三方登录,  login登录设置token,或sso扫码登陆后url带着token回跳本系统

    if (to.path === window.aop.login && !loginOpend) {
      loginOpend = true;
      next({ path: window.aop.login });
      NProgress.done();
      return;
    }

    if (to.path !== window.aop.login) {
      // sso login
      store.dispatch("auth/ssoLogin").then((ssoUrl) => {
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

// 初始化生成routes;
// 项目下的成员的权限生成可用的路由
export function initRoutes(projectId, to, from, next) {
  store
    .dispatch("auth/getUserInfo", { project_id: projectId })
    .then((data) => {
      const roles = data.roles;

      //根据路由权限生成可访问的路由表
      generateRoutes(asyncRoutes, { roles }).then(async (permRoutes) => {
        resetRouter();
        // router.addRoutes(permRoutes);

        permRoutes.forEach((routeItem) => {
          router.addRoute(routeItem);
        });

        //保存具有权限的路由, 生成头部导航
        store
          .dispatch("auth/setRoutes", permRoutes)
          .then(() => {})
          .catch(() => {});

        next && next({ ...to, replace: true });

        NProgress.done();
      });
    })
    .catch(() => {
      //获取用户信息如果token过期则清除前端cookie 同时刷新 通过登陆触发退出(由于没有cookie)
      store
        .dispatch("auth/logout")
        .then(() => {
          next && next({ path: "/" });
        })
        .catch(() => {});
    });
}

//根据权限生成路由
function generateRoutes(asyncRoutes, { roles }) {
  /**
   * 递归过滤异步路由表，返回符合用户角色权限的路由表
   * @param asyncRouterMap
   * @param roles
   */
  function filterAsyncRouter(asyncRouterMap, roles) {
    const accessedRouters = asyncRouterMap.filter((route) => {
      if (hasPermission(roles, route)) {
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, roles);
        }
        return true;
      }
      return false;
    });
    return accessedRouters;
  }

  function hasPermission(roles, route) {
    // 如果没有声明meta或者meta.perm，都视为可以公共访问的路由
    if (!route.meta || !route.meta.roles) {
      return true;
    }
    return roles.some((r) => route.meta.roles.includes(r));
    // return true;
  }

  return new Promise((resolve) => {
    let accessedRouters;

    // if (perms.some((p) => p.val === "*")) {
    //   accessedRouters = asyncRoutes;
    // } else {
    accessedRouters = filterAsyncRouter(asyncRoutes, roles);
    // }

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

  save("projectId", app.id);
  store.commit("dashbord/SET_CUR_APP", app);
  return app;
}
