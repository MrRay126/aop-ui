import { getActions } from "@/utils/storeUtils.js";
import reports from "@/api/dataManage/reports.js";

const state = {
  appList: [],
  app: null,
  menuList: [],
};
const mutations = {
  //设置用户登陆cookie
  SET_CUR_APP(state, data) {
    state.app = data;
  },

  SET_CUR_MENU_LIST(state, data) {
    state.menuList = data;
  },
};

// 同步dashbord内部的actions
let action_pre = getActions(reports);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
