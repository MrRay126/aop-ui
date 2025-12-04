import request from "@/utils/request.js";
export default {
  //获取 charts 图表数据 (落库数据监控 请求监控)
  getChartsData(data) {
    return request({
      url: "/api/metadata/monitor/",
      method: "post",
      data,
    });
  },

  //字段管理数据表
  getFieldTableData(params) {
    return request({
      url: "/api/metadata/fields/",
      method: "get",
      params,
    });
  },

  // 渠道列表
  getChannelList(params) {
    return request({
      url: "/api/metadata/channels",
      method: "get",
      params,
    });
  },
};
