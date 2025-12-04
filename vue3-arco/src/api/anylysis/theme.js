import request from "@/utils/request.js";

export default {
  getKeyWordTableData(data) {
    return request({
      url: `/api/ds/q/topic?click=${data.click || ""}`,
      method: "post",
      data,
    });
  },

  getDispositionTableData(data) {
    return request({
      url: "/api/ds/q/topic-word",
      method: "post",
      data,
    });
  },

  getDetailTableData(data) {
    return request({
      url: "/api/ds/q/topic-content",
      method: "post",
      data,
    });
  },

  //获取热词选项
  getWordOptions(params) {
    return request({
      url: "/api/search/labels/",
      method: "get",
      params,
    });
  },

  // 获取热词组选项
  getWordGroupOptions(params) {
    return request({
      url: "/api/search/labels/",
      method: "get",
      params,
    });
  },
};
