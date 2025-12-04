import request from "@/utils/request.js";
import { OpinionType } from "@/views/dashbord/data/index.js";
import {
  score,
  trend,
  wordCloud,
} from "@/views/opinionAnalysis/competition/data.js";

export default {
  getAppList(params) {
    //获取项目
    return request({
      url: "/api/projects/",
      method: "get",
      params,
    });
  },

  //获取菜单
  getMenuList(id) {
    return request({
      url: `/api/projects/${id}/folders`,
      method: "get",
    });
  },

  //获取菜单项的dashbord
  getDashbordData(params) {
    return request({
      url: `/api/dashboards/${params.id}`,
      method: "get",
      params: { project_id: params.project_id },
    });
  },

  //获取<舆情概览>面板某个卡片的数据
  getDashbordCardData(data) {
    return request({
      url: "/api/ds/query",
      method: "post",
      data,
    });
  },

  getWordDetail(data) {
    return request({
      url: "/api/ds/q/search",
      method: "post",
      data,
    });
  },

  // 预警看板数据
  getWarnBordData(data) {
    return request({
      url: "/api/alert/trend", //"/api/alert/trend"
      method: "post",
      data,
    });
  },

  // 获取预警记录的详情
  getWarnDetailData(data) {
    return request({
      url: "/api/alert/details", //"/api/alert/trend"
      method: "post",
      data,
    });
  },

  ////
  ////
  ///
  //创建看板空间
  createNameSpace(data) {
    return request({
      url: "/api/folders/",
      method: "post",
      data,
    });
  },

  //重命名看板 type:dashbord(看板项) || nameSpace('看板空间')
  renameDashbordOrSpace(data) {
    return request({
      url: "/api/folders/rename",
      method: "post",
      data,
    });
  },

  // 删除看板空间 @data { namespaceId:1}
  deleteNameSpace(data) {
    return request({
      url: `/api/folders/${data.namespaceId}`,
      method: "delete",
      data,
    });
  },

  //报表列表数据(drawer)
  getViewDataList(params) {
    // return Promise.reject();
    return request({
      url: "/api/reports/",
      method: "get",
      params,
    });
  },

  //获取看板的配置数据(内部卡的配置)
  getDashbordCardConfigs(params) {
    return request({
      url: "/api/dashboards/layout",
      method: "get",
      params,
    });
  },

  // 获取<自定义舆情分析>看板单个card显示的数据
  getCardData(data) {
    const urlsLib = {
      [OpinionType.trend]: "/api/ds/q/trend",
      [OpinionType.theme]: "/api/ds/q/topic",
      [OpinionType.words]: "/api/ds/q/wordcloud",
      [OpinionType.spread]: "/api/ds/q/dissemination",
    };

    const competitionUrl = {
      [trend]: "/api/ds/q/competition",
      [score]: "/api/ds/q/competition",
      [wordCloud]: "/api/ds/q/competition",
    };

    let url = "";
    if (data.type === OpinionType.competition) {
      url = competitionUrl[data.anylysisType];
    } else {
      url = urlsLib[data.type];
    }

    return request({
      url: url,
      method: "post",
      data,
    });
  },

  //保存card配置的数据
  saveCardConfig(data) {
    return request({
      url: "/api/dashboards/usersetting",
      method: "post",
      data,
    });
  },

  // 下载card数据列表
  downloadCardConfig(params) {
    // return request({
    //   url: "http://localhost:3000/card/download",
    //   method: "get",
    //   params,
    // });
  },

  //预警看板下载功能
  downloadWarnDashbord(params) {
    return Promise.reject();
    // return request({
    //   url: "http://localhost:3000/download/warn",
    //   method: "get",
    //   params,
    // });
  },

  //创建看板
  createDashbord(data) {
    return request({
      url: "/api/dashboards/",
      method: "post",
      data,
    });
  },

  //移动看板  type:dashbord(看板项) || nameSpace(看板空间)
  moveDashbordOrSpace(data) {
    return request({
      url: "/api/dashboards/mv",
      method: "post",
      data,
    });
  },

  // ----1
  //删除看板
  deleteDashbord(data) {
    return request({
      url: "/api/dashboards/delete_by_list", //url: "http://localhost:3000/delete/dashbord",
      method: "post",
      data,
    });
  },

  // 获取看板配置的分组项列表
  getDashbordConfigGroupOptions(params) {
    return request({
      url: "/api/aopgroups/",
      method: "get",
      params,
    });
  },

  //保存看板配置
  saveDashbordConfig(data) {
    return request({
      url: "/api/dashboards/conf",
      method: "post",
      data,
    });
  },

  //根据id获取dashbord看板本身的配置
  getDasbordConfig(params) {
    return request({
      url: "/api/dashboards/conf", // url: "http://localhost:3000/get/dashbord/config",
      method: "get",
      params,
    });
  },

  //保存看板布局的配置
  saveDashbordReprots(data) {
    return request({
      url: "/api/dashboards/layout",
      method: "post",
      data,
    });
  },

  // 微博&b站看板配置
  getCustomDashboardCardConfigs(params) {
    return request({
      // url: "http://localhost:3000/custom/card/configs",
      url: `/api/dashboards/${params.id}`,
      method: "get",
      params,
    });
  },

  //微博&b站自定义卡的数据
  getCustomDashboardCardData(data) {
    // console.log("data.type::", data.type);

    if (data.type === "topic") {
      //主题分布
      return request({
        url: "/api/ds/q/topic2",
        method: "get",
        params: data,
      });
    }

    const apiPath = {
      /** bzhan 微博 */
      // 内容趋势
      trend: "/api/ds/q/trend",
      // 话题聚类
      theme: "/api/ds/q/topic",
      // // 主题分布
      // topic: "/api/ds/q/topic2",
      // 玩家讨论
      playerDiscuss: "/api/ds/q/search",
    };

    const url = apiPath[data.type];
    return request({
      url: url,
      method: "post",
      data,
    });
  },

  // 玩家讨论内容筛选项
  getDiscussCardClassifications(data) {
    return request({
      // url: "http://localhost:3000/disscuss/card/filter/options",
      url: "/api/metadata/texttypes/",
      method: "get",
      data,
    });
  },

  // 话题类聚情感倾向table数据
  getThemeDispositionTable(data) {
    return request({
      // url: "http://localhost:3000/topic/card/table",
      url: "/api/ds/q/topic-word",
      method: "post",
      data,
    });
  },

  // 话题类聚详情
  getThemeDetailTableData(data) {
    return request({
      // url: "http://localhost:3000/theme/detail/table",
      url: "/api/ds/q/topic-content",
      method: "post",
      data,
    });
  },

  // 主题分布
  getTopicDispositionTableData(params) {
    return request({
      // url: "http://localhost:3000/theme/card/table",
      url: "/api/ds/q/topic2contents",
      method: "get",
      params,
    });
  },

  // 主题分布详情
  getTopicDetailTableData(data) {
    return request({
      // url: "http://localhost:3000/theme/detail/table",
      url: "/api/ds/q/topic2details",
      method: "post",
      data,
    });
  },

  /**乐次元商品宣发微博监控看板*/
  //乐次元趋势图
  getLeciyuanTrend(data) {
    return request({
      url: "/api/he-goods/trend",
      method: "post",
      data,
    });
  },

  getLeciyuanRadar(data) {
    return request({
      url: "/api/he-goods/radar",
      method: "post",
      data,
    });
  },

  get_leciyuan_statistics(data) {
    return request({
      url: "/api/he-goods/statistics",
      method: "post",
      data,
    });
  },

  // 乐次元数据表
  getLeciyuanTableData(data) {
    return request({
      url: "/api/he-goods/contents",
      method: "post",
      data,
    });
  },

  /**乐次元关键词看板*/
  // 获取统计数据
  get_leciyuan_keyword_statistics(data) {
    return request({
      url: "/api/he-keyword/statistics",
      method: "post",
      data,
    });
  },

  // 获取趋势数据
  get_leciyuan_keyword_trend(data) {
    return request({
      url: "/api/he-keyword/trend",
      method: "post",
      data,
    });
  },

  // 获取表格数据
  get_leciyuan_keyword_table(data) {
    return request({
      url: "/api/he-keyword/contents",
      method: "post",
      data,
    });
  },

  // 获取词云数据
  get_leciyuan_keyword_wordcloud(data) {
    return request({
      url: "/api/he-keyword/wordcloud",
      method: "post",
      data,
    });
  },
};
