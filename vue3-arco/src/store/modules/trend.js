import { getActions } from "@/utils/storeUtils.js";
import trendApi from "@/api/anylysis/trend.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(trendApi);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
