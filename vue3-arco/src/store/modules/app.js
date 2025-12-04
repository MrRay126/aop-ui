import app from "@/api/app.js";
import { getActions } from "@/utils/storeUtils.js";

const state = {
  loading: false,
};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(app);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
