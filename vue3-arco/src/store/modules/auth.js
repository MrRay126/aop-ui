import Cookies from "js-cookie";
import auth from "@/api/auth.js";

const tokenName = "access_token";

const state = {
  token: "",
  userInfo: {},
  routes: [],
  perms: [],
};

const mutations = {
  //设置用户登陆cookie
  SET_USER_LOGIN_COOKIE(state, token) {
    state.token = token;
    Cookies.set(tokenName, token);
  },
  REMOVE_USER_TOKEN() {
    state.token = "";
    Cookies.remove(tokenName);
  },
  SET_USER_INFO(state, data) {
    state.userInfo = data;
  },
  SET_ROUTERS(state, data) {
    state.routes = data;
  },
  SET_PERMS(state, data) {
    state.perms = data;
  },
};

const actions = {
  getUserInfo({ commit }, params) {
    return new Promise((resolve, reject) => {
      const payload = params;
      auth
        .getUserInfo(payload)
        .then((res) => {
          const data = res.data.data;
          commit("SET_USER_INFO", data);

          // 使用roles充当perms数据
          commit("SET_PERMS", data.roles);
          // console.log("roles:::", data);

          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  //登陆跳转到sso
  async ssoLogin() {
    return new Promise((resolve, reject) => {
      auth
        .ssoLogin()
        .then((res) => {
          const { url } = res.data.data;
          resolve(url);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 使用sso返回的token登陆信息
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      auth
        .login(data)
        .then((res) => {
          const { token } = res.data.data;
          commit("SET_USER_LOGIN_COOKIE", token);

          resolve(token);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  logout({ commit }) {
    return new Promise((resolve) => {
      // auth
      //   .logout()
      //   .then(() => {
      commit("REMOVE_USER_TOKEN");
      resolve();
      // })
      // .catch((err) => {
      //   reject(err);
      // });
    });
  },

  setRoutes({ commit }, payload) {
    commit("SET_ROUTERS", payload);
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
