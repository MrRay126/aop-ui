import request from "@/utils/request.js";

// 主题分析为异步计算获取数据的逻辑和其他分析不同
export default {
  // 获取报表配置数据
  getReportConfigById(params) {
    return request({
      url: "/api/tasks/params/", // url: "http://localhost:3000/topic/configs",
      method: "get",
      params,
    });
  },

  //主题计算
  getCalculateTopic(params) {
    return request({
      url: "/api/ds/q/topic2", // url: "/api/ds/q/topic2", //url: "http://localhost:3000/topic/chart",
      method: "get",
      params,
    });
  },

  // 数据表数据
  getTableData(params) {
    return request({
      url: "/api/ds/q/topic2contents", //url: "http://localhost:3000/topic/table",
      method: "get",
      params,
    });
  },

  //详情数据
  getDetailTableData(data) {
    return request({
      url: "/api/ds/q/topic2details", //url: "/api/ds/q/topic2details",
      method: "post",
      data,
    });
  },
};
