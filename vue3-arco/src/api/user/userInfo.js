import request from "@/utils/request.js";

export default {
  //权限详情
  getPermInfo(params) {
    return request({
      url: "/api/permissions/",
      method: "get",
      params,
    });
  },

  // 修改用户信息
  modifyUserInfo(data) {
    return request({
      url: "/api/profile/",
      method: "post",
      data,
    });
  },

  //修改密码
  modifyPassword(data) {
    return request({
      url: "/api/accounts/pass-change",
      method: "post",
      data,
    });
  },
};
