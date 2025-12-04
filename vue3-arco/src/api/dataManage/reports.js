import request from "@/utils/request.js";
export default {
  getReportsTableData(params) {
    //获取项目
    return request({
      url: "/api/reports/search", // url: "http://localhost:3000/reports/table",
      method: "get",
      params,
    });
  },

  // getAllReports(params) {
  //   //获取项目
  //   return request({
  //     url: "http://localhost:3000/all/reports",
  //     method: "get",
  //     params,
  //   });
  // },

  //保存报表
  saveReportConfig(data) {
    return request({
      url: "/api/reports/",
      method: "post",
      data,
    });
  },

  //获取报表的配置数据
  getReportConfigById(params) {
    return request({
      // url: `http://localhost:3000/api/reports/${params.id}`, // url: `/api/reports/${params.id}`,
      url: `/api/reports/${params.id}`, // url: `/api/reports/${params.id}`,
      method: "get",
      params,
    });
  },

  //删除报表
  deleteReportById(data) {
    return request({
      url: `/api/reports/`, // url: `/api/reports/${params.id}`,
      method: "delete",
      data,
    });
  },

  // 创建异步任务
  creareTask(data) {
    return request({
      url: `/api/tasks/?click=${data.click || ""}`, // url: `/api/reports/${params.id}`,
      method: "post",
      data,
    });
  },
};
