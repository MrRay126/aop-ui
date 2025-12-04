import { getActions } from "@/utils/storeUtils.js";
import taskApi from "@/api/dataManage/task.js";

const state = {
  isTaskPannelOpened: false, // 任务列表面板
};

const mutations = {
  openTaskPannel(state) {
    state.isTaskPannelOpened = true;
  },
  closeTaskPannel(state) {
    state.isTaskPannelOpened = false;
  },
};

// 同步dashbord内部的actions
let action_pre = getActions(taskApi);

const actions = {
  ...action_pre,
  openTaskPannel({ commit }) {
    commit("openTaskPannel");
  },
  closeTaskPannel({ commit }) {
    commit("closeTaskPannel");
  },
};

export default {
  namespaced: true,
  state,

  mutations,
  actions,
};
