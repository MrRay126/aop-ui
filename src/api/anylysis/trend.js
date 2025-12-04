import request from "@/utils/request.js";

export default {
  getTrendData(data) {
    return request({
      url: `/api/ds/q/trend?click=${data.click || ""}`,
      method: "post",
      data,
    });
  },

  getFilterOptions(params) {
    return request({
      url: "/api/ds/tables",
      method: "get",
      params,
    });
  },

  //趋势分析维度表
  getDimensionTable(data) {
    return request({
      url: "/api/ds/q/trendtable",
      method: "post",
      data,
    });
  },

  //趋势分析数据详情
  getDetailTableData(data) {
    return request({
      url: "/api/ds/q/ttdetail",
      // url: "http://localhost:3000/api/ds/q/ttdetail",
      method: "post",
      data,
    });
  },

  // 趋势分析 大卡table表
  getTrendCountTableData(data) {
    return request({
      url: "/api/ds/q/trendcard",
      method: "post",
      data,
    });
  },
};
