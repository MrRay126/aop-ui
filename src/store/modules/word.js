import { getActions } from "@/utils/storeUtils.js";
import wordApi from "@/api/anylysis/word.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(wordApi);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
