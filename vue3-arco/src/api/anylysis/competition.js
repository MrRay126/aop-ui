import request from "@/utils/request.js";

export default {
  //获取趋势图数据
  getTrendChartData(data) {
    return request({
      // url: "http://localhost:3000/api/competition/chart/",
      url: "/api/ds/q/competition",
      method: "post",
      data,
    });
  },

  //获取数据表数据(趋势|评分|词云)
  getTableData(data) {
    return request({
      // url: "http://localhost:3000/api/competition/table/",
      url: "/api/ds/q/competitiontable",
      method: "post",
      data,
    });
  },

  //获取 趋势|评分 大卡数据表数据
  getCountTableData(data) {
    return request({
      url: "/api/ds/q/competitioncard",
      method: "post",
      data,
    });
  },

  //获取词云chart数据
  getWordCloudData(data) {
    return request({
      // url: "http://localhost:3000/api/competition/wordCloud/",
      url: "/api/ds/q/competition",
      method: "post",
      data,
    });
  },

  //获取数据详情(分析方式: 评分 | 趋势)
  getDetailData(data) {
    return request({
      // url: "http://localhost:3000/api/competition/detail",
      url: "/api/ds/q/competitioncontent",
      method: "post",
      data,
    });
  },

  //渠道列表数据
  getChannelOptions(data) {
    return request({
      url: "/api/ds/q/competitionchannel",
      method: "post",
      data,
    });
  },
};
