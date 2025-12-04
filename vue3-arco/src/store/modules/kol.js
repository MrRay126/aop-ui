import { getActions } from "@/utils/storeUtils.js";
import kol from "@/api/anylysis/kol.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(kol);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
