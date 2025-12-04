import { getActions } from "@/utils/storeUtils.js";
import userApi from "@/api/user/userInfo.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(userApi);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
