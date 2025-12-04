// 主题(词云)分析
import request from "@/utils/request.js";

export default {
  calculateWords(data) {
    return request({
      url: `/api/ds/q/wordcloud?click=${data.click || ""}`,
      method: "post",
      data,
    });
  },

  getDispositionWordTable(data) {
    return request({
      url: "/api/ds/q/wordcloudword",
      method: "post",
      data,
    });
  },

  getDetailTableData(data) {
    return request({
      url: "/api/ds/q/wordcloudcontent",
      method: "post",
      data,
    });
  },

  getFirstLevelTableData(data) {
    return request({
      url: "/api/ds/q/wordcloud2",
      method: "post",
      data,
    });
  },

  getSecondLevelTableData(data) {
    return request({
      url: "/api/ds/q/wordcloud2",
      method: "post",
      data,
    });
  },
};
