import { getActions } from "@/utils/storeUtils.js";
import topicApi from "@/api/anylysis/topic.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(topicApi);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
