// import themeApi from "@/api/anylysis/theme.js";

// const state = {};
// const mutations = {};
// const actions = {
//   getKeyWordTableData(store, payload) {
//     return new Promise((resolve, reject) => {
//       themeApi
//         .getKeyWordTableData(payload)
//         .then((res) => {
//           const list = res.data.data;
//           resolve(list);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getDispositionTableData(store, payload) {
//     return new Promise((resolve, reject) => {
//       themeApi
//         .getDispositionTableData(payload)
//         .then((res) => {
//           const list = res.data.data;
//           resolve(list);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   getDetailTableData(store, payload) {
//     return new Promise((resolve, reject) => {
//       themeApi
//         .getDetailTableData(payload)
//         .then((res) => {
//           const list = res.data.data;
//           resolve(list);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
// };
// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
// };

import { getActions } from "@/utils/storeUtils.js";
import themeApi from "@/api/anylysis/theme.js";

const state = {};
const mutations = {};

// 同步dashbord内部的actions
let action_pre = getActions(themeApi);

const actions = {
  ...action_pre,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
