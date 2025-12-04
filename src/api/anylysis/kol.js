import request from "@/utils/request.js";

export default {
  // table列表数据
  getTableData(data) {
    return request({
      url: `/api/kol/users/contents/?click=${data.click || ""}`,
      method: "post",
      data,
    });
  },

  // chart图表数据
  getChartData(data) {
    return request({
      url: "/api/kol/users/charts/",
      method: "post",
      data,
    });
  },

  // 获取渠道列表
  getChannelOptions(params) {
    return request({
      url: "/api/kol/channels/",
      method: "get",
      params,
    });
  },

  // 获取用户列表
  getUserData(params) {
    return request({
      url: "/api/kol/users/search/",
      method: "get",
      params,
    });
  },

  // 根据用户id获取用户数据
  getAuthorDataById(params) {
    return request({
      url: "/api/kol/user/",
      method: "get",
      params,
    });
  },

  /////主页面
  //kol 明细模式 table 表格数据
  getMainPageTableData(data) {
    return request({
      // url: "http://localhost:3000/kol/main/table",
      url: "/api/kol/users/contents/",
      method: "post",
      data,
    });
  },

  // kol 趋势模式 chart
  getMainPageTrendChartData(data) {
    return request({
      // url: "http://localhost:3000/kol/main/chart",
      url: "/api/kol/users/trend/",
      method: "post",
      data,
    });
  },

  // kol 趋势模式 table
  getMainPageTrendTableData(data) {
    return request({
      // url: "http://localhost:3000/kol/main/charttable",
      url: "/api/kol/users/trend_table/",
      method: "post",
      data,
    });
  },

  // 非下钻-趋势模式下 数据详情
  getTrendDetailData(data) {
    return request({
      url: "/api/kol/users/contents/",
      method: "post",
      data,
    });
  },

  // 下钻- 基础信息
  getXiaZuanBaseInfo(data) {
    return request({
      // url: "http://localhost:3000/kol/xiazuan/info",
      url: "/api/kol/post_info/",
      method: "post",
      data,
    });
  },

  //下钻- 趋势chart
  getXiaZuanTrendChartData(data) {
    return request({
      // url: "http://localhost:3000/kol/main/chart",
      url: "/api/kol/users/trend/",
      method: "post",
      data,
    });
  },

  //下钻- 趋势table
  getXiaZuanTrendTableData(data) {
    return request({
      // url: "http://localhost:3000/kol/main/charttable",
      url: "/api/kol/users/trend_table/",
      method: "post",
      data,
    });
  },

  //下钻-趋势 detail
  getXiaZuanTrendDetailData(data) {
    return request({
      // url: "http://localhost:3000/detail/table",
      url: "/api/kol/users/contents/",
      method: "post",
      data,
    });
  },

  // 下钻- 词云图
  getXiaZuanWordChart(data) {
    return request({
      // url: "http://localhost:3000/kol/xiazuan/word/chart",
      url: "/api/ds/q/wordcloud",
      method: "post",
      data,
    });
  },

  // 下钻- 词云table
  getXiaZuanWordTabledata(data) {
    return request({
      // url: "http://localhost:3000/kol/xiazuan/word/table",
      url: "/api/ds/q/wordcloudword",
      method: "post",
      data,
    });
  },

  // 下钻- 词云 详情页
  getXiaZuanWordDetaildata(data) {
    return request({
      // url: "http://localhost:3000/detail/table",
      url: "/api/ds/q/wordcloudcontent",
      method: "post",
      data,
    });
  },

  // 下钻 传播分析 chart
  getXiaZuanSpreadChart(data) {
    return request({
      // url: "http://localhost:3000/kol/xiazuan/spread/chart",
      url: "/api/ds/q/dissemination",
      method: "post",
      data,
    });
  },

  //下钻 传播分析 table
  getXiaZuanSpreadTable(data) {
    return request({
      // url: "http://localhost:3000/kol/xiazuan/spread/table",
      url: "/api/ds/q/disseminationrank",
      method: "post",
      data,
    });
  },

  //下钻 传播分析 table 展开信息
  getUserCommentInfo(data) {
    return request({
      // url: "http://localhost:3000/kol/xiazuan/spread/table/expand",
      url: "/api/ds/q/kol/ucontents",
      method: "post",
      data,
    });
  },

  // 下钻 传播分析 详情页
  getXiaZuanSpreadDetaildata(data) {
    return request({
      // url: "http://localhost:3000/detail/table",
      url: "/api/ds/q/disseminationcontents",
      method: "post",
      data,
    });
  },

  //意见领袖时间轴弹窗-分页列数据
  getTimeLineMore(data) {
    return request({
      // url: "http://localhost:3000/kol/xiazuan/spread/popleader",
      url: "/api/ds/q/disseminationtl",
      method: "post",
      data,
    });
  },

  // 主页面详情下载 , 下钻页详情下载  download.js
  // downloadDetail() {},
};
