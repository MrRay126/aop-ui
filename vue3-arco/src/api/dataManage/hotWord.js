import request from "@/utils/request.js";

export default {
  //创建词
  createWord(data) {
    return request({
      url: "/api/hotwords/",
      method: "post",
      data,
    });
  },

  //删除词
  deleteWord(data) {
    return request({
      url: "/api/hotwords/deletebyids",
      method: "post",
      data,
    });
  },

  //修改词
  modifyWord(data) {
    return request({
      url: "/api/hotwords/",
      method: "put",
      data,
    });
  },

  //获取词的table列表数据
  getWordList(params) {
    return request({
      url: "/api/hotwords/",
      method: "get",
      params,
    });
  },

  //创建词组
  createWordGroup(data) {
    return request({
      url: "/api/hotwordgroups/",
      method: "post",
      data,
    });
  },

  //删除词组
  deleteWordGroup(data) {
    return request({
      url: "/api/hotwordgroups/deletebyids",
      method: "post",
      data,
    });
  },

  //修改词组
  modifyWordGroup(data) {
    return request({
      url: "/api/hotwordgroups/",
      method: "put",
      data,
    });
  },

  //获取词组的table列表数据
  getWordGroupList(params) {
    return request({
      url: "/api/hotwordgroups/",
      method: "get",
      params,
    });
  },

  getWordMemberOptions(params) {
    return request({
      url: "/api/hotwords/",
      method: "get",
      params,
    });
  },

  getUsers(params) {
    return request({
      url: "/api/users",
      method: "get",
      params,
    });
  },

  getWordTypeList() {
    return request({
      url: "/api/wordtypes/",
      method: "get",
    });
  },

  //获取停用词列表
  getStopWordList(params) {
    return request({
      url: "/api/disabledwords/",
      method: "get",
      params,
    });
  },

  saveStopWordList(data) {
    return request({
      url: "/api/disabledwords/",
      method: "post",
      data,
    });
  },
};
