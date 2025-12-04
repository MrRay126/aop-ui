import { getActions } from "@/utils/storeUtils.js";
import projectManage from "@/api/user/projectManage.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(projectManage);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
