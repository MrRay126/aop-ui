import request from "@/utils/request.js";

export default {
  // 传播分析计算
  calculateSpreads(data) {
    return request({
      url: `/api/ds/q/dissemination?click=${data.click || ""}`,
      method: "post",
      data,
    });
  },

  // 获取数据表数据
  getSpreadTable(data) {
    return request({
      url: "/api/ds/q/disseminationrank",
      // url: "http://localhost:3000/spread/table",
      method: "post",
      data,
    });
  },

  //获取数据详情
  getSpreadDetail(data) {
    return request({
      url: "/api/ds/q/disseminationcontents",
      method: "post",
      data,
    });
  },

  // 获取更多时间轴数据
  getTimeLineMore(data) {
    return request({
      url: "/api/ds/q/disseminationtl", // "http://localhost:3000/spread/timeline/more", //,
      method: "post",
      data,
    });
  },

  // 获取用户评价详情
  getUserCommentInfo(data) {
    return request({
      url: "/api/ds/q/kol/ucontents",
      method: "post",
      data,
    });
  },
};
