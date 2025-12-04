import request from "@/utils/request.js";

export default {
  // 舆情分析 分析详情 预警分析等下载
  /**
    {
       type:"trend", 趋势分析等下载类型
       ...configs, // 同计算分析和数据详情的参数 , 预警分析为具体的id或id:null
    }
   **/

  downloadAnalysis(data) {
    //获取项目
    const url = `/api/tasks/${data.urlParams.download_type}/download/`;
    return request({
      url,
      method: "post",
      data: data.data,
    });
  },

  //下载任务的状态判断,
  // PENDING = 0, _('pending') PROCESSING = 1, _('processing') SUCCESS = 2, _('success') FAILED = 3, _('failed') CANCEL = 4, _('cancel')
  downloadTaskStatus(id) {
    return request({
      url: `/api/tasks/${id}/state/`,
      method: "get",
    });
  },

  // kol主页面及下钻页面, 详情数据的下载
  downloadKolAnalysis(data) {
    return this.downloadAnalysis(data);
    //获取项目
    // const url = `/api/tasks/${data.urlParams.download_type}/download/`;

    // return request({
    //   url,
    //   method: "post",
    //   data: data.data,
    // });
  },
};
