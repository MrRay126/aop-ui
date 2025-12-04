import request from "@/utils/request.js";

export default {
  //获取项目信息
  getProjectInfo(params) {
    return request({
      url: `/api/projects/${params.project_id}/basic`, // "http://localhost:3000/api/project/info",
      method: "get",
    });
  },

  // 获取数据表数据
  getTableData(params) {
    return request({
      url: `/api/projects/${params.project_id}/users`, //"http://localhost:3000/api/project/table/data",
      method: "get",
      params,
    });
  },

  // 保存新建
  saveMember(data) {
    return request({
      url: `/api/projects/${data.project_id}/users`, //"http://localhost:3000/api/save/member",
      method: "post",
      data,
    });
  },

  // 更新数据
  updateMember(data) {
    return request({
      url: `/api/projects/${data.project_id}/users`, //"http://localhost:3000/api/update/member",
      method: "put",
      data,
    });
  },

  // delete
  deleteMember(params) {
    return request({
      url: `/api/projects/${params.project_id}/users`, //"http://localhost:3000/api/update/member",
      method: "delete",
      params,
    });
  },

  //获取成员选项
  getMemberOptions(params) {
    return request({
      url: "/api/users/?s=project",
      method: "get",
      params,
    });
  },

  // 获取角色列表
  getRoleList(params) {
    return request({
      url: `/api/projects/${params.project_id}/roles`,
      method: "get",
      // params,
    });
  },

  updateProjectInfo(data) {
    return request({
      url: `/api/projects/${data.project_id}`,
      method: "put",
      data: data,
    });
  },

  // 获取table数据
  fetchAccountTableData(params) {
    return request({
      // url: `http://localhost:3000/account/table`,
      url: `/api/sns/accounts/`,
      method: "get",
      params,
    });
  },

  //补全数据
  requestPatchAccount(data) {
    return request({
      url: `/api/sns/accounts/r`,
      method: "post",
      data: data,
    });
  },

  // 新增
  addNewAccount(data) {
    return request({
      // url: `http://localhost:3000/add/new/account`,
      url: `/api/sns/accounts/`,
      method: "post",
      data: data,
    });
  },
  // 编辑
  editAccount(data) {
    return request({
      url: `/api/sns/accounts/${data.id}/`,
      method: "put",
      data: data,
    });
  },
  // 删除
  deleteAccount(data) {
    return request({
      url: `/api/sns/accounts/`,
      method: "delete",
      data: data,
    });
  },

  /**
   * 账号数据统计
   * */

  // 账号统计线图数据

  getStatisticChartData(data) {
    return request({
      // url: `http://localhost:3000/account/line/chart`,
      url: `/api/sns/accounts/chart`,
      method: "post",
      data: data,
    });
  },

  // 账号统计数据表数据
  getStatisicTableData(data) {
    return request({
      // url: `http://localhost:3000/account/statistic/table`,
      url: `/api/sns/accounts/table`,
      method: "post",
      data: data,
    });
  },
};
