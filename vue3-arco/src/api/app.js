import request from "@/utils/request.js";

export default {
  // 过滤条件值模糊查询
  querySearch(params) {
    return request({
      url: params.url || "/api/ds/q/authors",
      method: "get",
      params: params.query,
    });
  },
};
