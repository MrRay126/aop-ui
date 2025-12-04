import request from "@/utils/request.js";

export default {
  // 重命名收藏指标
  renameCollectFilter(data) {
    return request({
      // url: `http://localhost:3000/rename/collect/filter`,
      url: `/api/indicator/`,
      method: "put",
      data,
    });
  },

  // 删除收藏指标
  deleteCollectFilter(data) {
    return request({
      // url: `http://localhost:3000/delete/collect/filter`,
      url: `/api/indicator/`,
      method: "delete",
      data,
    });
  },

  // 获取过滤条件指标数据
  getCollectFilterData(params) {
    return request({
      // url: `http://localhost:3000/get/collect/filter/data`,
      url: `/api/indicator/`,
      method: "get",
      params,
    });
  },

  // 保存过滤条件指标
  saveCollectFilterData(data) {
    return request({
      // url: `http://localhost:3000/save/collect/filter/data`,
      url: `/api/indicator/`,
      method: "post",
      data,
    });
  },

  //更新详情数据表的某一行 (整体情感、文本类型)
  updateDetail(data) {
    return request({
      // url: "http://localhost:3000/api/detail/update",
      url: "/api/metadata/updateods/",
      method: "put",
      data,
    });
  },

  //情感options选项
  getEmotionOptions(params) {
    return request({
      url: "/api/metadata/emotions/",
      method: "get",
      params,
    });
  },

  //文本类型options选项
  getTextTypeOptions(params) {
    return request({
      // url: "http://localhost:3000/api/texttype/options",
      url: "/api/metadata/texttypes/",
      method: "get",
      params,
    });
  },
};
