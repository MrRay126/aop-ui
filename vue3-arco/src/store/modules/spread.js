import { getActions } from "@/utils/storeUtils.js";
import spreadApi from "@/api/anylysis/spread.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(spreadApi);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
