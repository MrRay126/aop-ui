import { getActions } from "@/utils/storeUtils.js";
import hotWord from "@/api/dataManage/hotWord.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(hotWord);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
