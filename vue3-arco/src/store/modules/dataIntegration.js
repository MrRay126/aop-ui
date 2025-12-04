import { getActions } from "@/utils/storeUtils.js";
import dataIntegration from "@/api/dataManage/dataIntegration.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(dataIntegration);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
