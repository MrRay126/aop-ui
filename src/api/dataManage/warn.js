import request from "@/utils/request.js";

export default {
  /**
   *   获取table列表
   *   page size search
   */
  getWarnTableData(params) {
    return request({
      // url: "http://localhost:3000/warn/table",
      url: "/api/alertrules/",
      method: "get",
      params,
    });
  },

  /**
   * 删除 报警项
   *  id
   */
  deleteWarnTableData(data) {
    return request({
      // url: "http://localhost:3000/warn/table",
      url: `/api/alertrules/deletebyids`,
      method: "post",
      data,
    });
  },

  /**
   * 订阅简报
   */
  subscribeWarn(data) {
    return request({
      // url: "http://localhost:3000/warn/subscribe",
      url: `/api/alertrules/${data.id}/subscribe`,
      method: "post",
    });
  },

  /**
   * 取消订阅简报
   */
  cancleSubscribeWarn(data) {
    return request({
      url: `/api/alertrules/${data.id}/unsubscribe`,
      method: "post",
    });
  },

  /**
   * 保存报警设置
   * data: 报警设置的表单内容
   */
  saveWarnSettings(data) {
    return request({
      // url: "http://localhost:3000/save/warn",
      url: "/api/alertrules/",
      method: "post",
      data,
    });
  },

  /**
   * 更新报警设置
   * data: 报警设置的表单内容
   */
  updateWarnSettings(data) {
    return request({
      // url: "http://localhost:3000/save/warn",
      url: `/api/alertrules/${data.id}`,
      method: "put",
      data,
    });
  },

  /*
    根据id 获取预警配置的内容
  */
  getWarnSettingsById(params) {
    return request({
      // url: "http://localhost:3000/warn/setting",
      url: `/api/alertrules/${params.id}`,
      method: "get",
      // params,
    });
  },

  /*
   获取预警成员列表
  */
  getWarnMembers(params) {
    return request({
      // url: "http://localhost:3000/warn/members",
      url: `/api/users`,
      method: "get",
      params,
    });
  },

  /*
    获取过滤条件选项 同趋势分析 
  */
  getFilterOptions(params) {
    return request({
      url: "/api/ds/tables",
      method: "get",
      params,
    });
  },

  /*
    获取预警分析页面的 预警过滤器选项
   */
  getWarnFilters(params) {
    return request({
      url: "/api/alertrules/groups/",
      method: "get",
      params,
    });
  },
};
