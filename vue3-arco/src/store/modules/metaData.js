import { getActions } from "@/utils/storeUtils.js";
import metaData from "@/api/dataManage/metaData.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(metaData);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
