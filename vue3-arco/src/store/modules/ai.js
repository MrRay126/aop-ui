import { getActions } from "@/utils/storeUtils.js";
import ai from "@/api/ai.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(ai);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
