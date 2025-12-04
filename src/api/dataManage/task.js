import request from "@/utils/request.js";

export default {
  // 获取下载管理器列表数据
  getTableData(params) {
    return request({
      url: "/api/tasks/",
      method: "get",
      params,
    });
  },

  // 下载各个分析的内容,详情数据
  download(params) {
    return request({
      url: `/api/tasks/${params.id}/objurl/`,
      method: "get",
      params,
    });
  },
};
