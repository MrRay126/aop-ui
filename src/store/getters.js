const getters = {
  token: (state) => state.auth.token,
  routes: (state) => state.auth.routes,
  perms: (state) => state.auth.perms,
  appId: (state) => {
    if (state.dashbord.app) {
      return state.dashbord.app.id;
    } else {
      return null;
    }
  },
  app: (state) => {
    if (state.dashbord.app) {
      return state.dashbord.app;
    } else {
      return null;
    }
  },
  appList: (state) => {
    return state.dashbord.appList;
  },
  isTaskPannelVisible: (state) => {
    return state.task.isTaskPannelOpened;
  },
};
export default getters;
