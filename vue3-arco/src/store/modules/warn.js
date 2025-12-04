import warnApi from "@/api/dataManage/warn.js";
import { getActions } from "@/utils/storeUtils.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(warnApi);
const actions = {
  ...action_pre,
};

// const actions = {
//   getWarnTableData(store, payload) {
//     return new Promise((resolve, reject) => {
//       warnApi
//         .getWarnTableData(payload)
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   deleteWarnTableData(store, payload) {
//     return new Promise((resolve, reject) => {
//       warnApi
//         .deleteWarnTableData(payload)
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   subscribeWarn(store, payload) {
//     return new Promise((resolve, reject) => {
//       warnApi
//         .subscribeWarn(payload)
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   saveWarnSettings(store, payload) {
//     return new Promise((resolve, reject) => {
//       warnApi
//         .saveWarnSettings(payload)
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   updateWarnSettings(store, payload) {
//     return new Promise((resolve, reject) => {
//       warnApi
//         .updateWarnSettings(payload)
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   getWarnSettingsById(store, payload) {
//     return new Promise((resolve, reject) => {
//       warnApi
//         .getWarnSettingsById(payload)
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   getWarnMembers(store, payload) {
//     return new Promise((resolve, reject) => {
//       warnApi
//         .getWarnMembers(payload)
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getFilterOptions(store, payload) {
//     return new Promise((resolve, reject) => {
//       warnApi
//         .getFilterOptions(payload)
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
// };

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
