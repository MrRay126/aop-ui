import request from "@/utils/request.js";
export default {
  // 获取markdown说明
  getInstructionMarkdownText(params) {
    return request({
      url: "/api/metadata/desc",
      method: "get",
      params,
    });
  },

  // 数据集成table
  getIntegrationTableData(params) {
    return request({
      url: "/api/metadata/",
      method: "get",
      params,
    });
  },

  // config rules table
  getRulesTableData(params) {
    return request({
      url: "/api/metadata/rules/",
      method: "get",
      params,
    });
  },

  //获取配置规则 (新增或编辑)
  getRuleConfig(params) {
    return request({
      url: `/api/metadata/rules/${params.id}/`,
      method: "get",
      params,
    });
  },

  //保存配置规则
  saveRuleConfig(data) {
    return request({
      url: "/api/metadata/rules/",
      method: "post",
      data,
    });
  },

  //保存配置规则
  updateRuleConfig(data) {
    return request({
      url: `/api/metadata/rules/${data.id}/`,
      method: "put",
      data,
    });
  },

  //删除配置规则
  deleteRuleConfig(params) {
    return request({
      url: `/api/metadata/rules/${params.id}/`,
      method: "delete",
      params,
    });
  },
  // 修改某个采集规则的状态信息(相当于审核)
  modifyRuleStatus(data) {
    return request({
      url: `/api/metadata/rules/statechange`,
      method: "post",
      data,
    });
  },

  // 获取采集规则的表单的'算法' 选项options
  getAlgorithmOptions(params) {
    return request({
      // url: `http://localhost:3000/api/get/algorithm/options`,
      url: "/api/metadata/algorithm/",
      method: "get",
      params,
    });
  },
};
