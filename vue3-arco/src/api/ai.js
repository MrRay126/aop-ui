import request from "@/utils/request.js";
export default {
  //Ai总结计算并返回计算结果
  calcAiSummary(data) {
    return request({
      // url: "http://localhost:3000/api/ai/summary",
      url: "/api/llm/ai/task/",
      method: "post",
      data,
    });
  },

  getAiSummaryById(id) {
    return request({
      url: `/api/llm/ai/task/`,
      method: "get",
      params: { id },
    });
  },
};
