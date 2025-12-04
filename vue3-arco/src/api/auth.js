import request from "@/utils/request.js";
export default {
  getUserInfo(params) {
    return request({
      url: "/api/profile/",
      method: "get",
      params,
    });
  },

  //sso跳转地址
  ssoLogin() {
    return request({
      url: "/sso/login",
      method: "get",
    });
  },

  //登陆系统
  login(data) {
    return request({
      url: "/api/accounts/login",
      method: "post",
      data,
    });
  },

  //登出系统
  // logout() {
  //   return request({
  //     url: "http://localhost:3000/logout",
  //     method: "post",
  //     data: {},
  //   });
  // },
};
