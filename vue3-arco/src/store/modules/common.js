import { getActions } from "@/utils/storeUtils.js";
import common from "@/api/anylysis/common.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(common);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
