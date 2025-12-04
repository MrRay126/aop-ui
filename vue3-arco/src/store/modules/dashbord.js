import { getActions } from "@/utils/storeUtils.js";
import dashbord from "@/api/anylysis/dashbord.js";

const state = {
  appList: [],
  app: null,
  menuList: [],
};
const mutations = {
  //保存app列表
  SET_CUR_APP_LIST(state, data) {
    state.appList = data.map((item) => {
      item.label = item.name;
      return item;
    });
  },

  //设置用户登陆cookie
  SET_CUR_APP(state, data) {
    state.app = data;
  },

  SET_CUR_MENU_LIST(state, data) {
    state.menuList = data;
  },
};

// 同步dashbord内部的actions
let action_pre = getActions(dashbord);

const actions = {
  ...action_pre,

  getAppList({ commit }, appId) {
    return new Promise((resolve, reject) => {
      dashbord
        .getAppList(appId)
        .then((res) => {
          const data = res.data.data;
          commit("SET_CUR_APP_LIST", data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getMenuList({ commit }, appId) {
    return new Promise((resolve, reject) => {
      dashbord
        .getMenuList(appId)
        .then((res) => {
          const data = res.data.data;
          commit("SET_CUR_MENU_LIST", data);

          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

// const actions = {
//   getAppList() {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getAppList()
//         .then((res) => {
//           const data = res.data.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getMenuList(store, appId) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getMenuList(appId)
//         .then((res) => {
//           const data = res.data.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getDashbordData(store, folderId) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getDashbordData(folderId)
//         .then((res) => {
//           const data = res.data.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   //
//   getDashbordCardData(store, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getDashbordCardData(payload) //getTotalCardData
//         .then((res) => {
//           const data = res.data.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getPositiveCardData() {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getPositiveCardData()
//         .then((res) => {
//           const data = res.data.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getNegativeCardData() {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getNegativeCardData()
//         .then((res) => {
//           const data = res.data.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getPieCardData() {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getPieCardData()
//         .then((res) => {
//           const data = res.data.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getChannelCardData() {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getChannelCardData()
//         .then((res) => {
//           const data = res.data.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getChannelRankData() {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getChannelRankData()
//         .then((res) => {
//           const data = res.data.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   getWordDetail({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getWordDetail(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   getWarnBordData({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getWarnBordData(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   downloadWarnDashbord({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .downloadWarnDashbord(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   getViewDataList({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getViewDataList(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   getDashbordCardConfigs({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getDashbordCardConfigs(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   saveCardConfig({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .saveCardConfig(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   downloadCardConfig({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .downloadCardConfig(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   //获取舆情分析看板内的卡片的数据
//   getOpinionCardData({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .getOpinionCardData(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   createDashbord({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .createDashbord(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   renameDashbordOrSpace({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .renameDashbordOrSpace(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   createNameSpace({ commit }, payload) {
//     return new Promise((resolve, reject) => {
//       dashbord
//         .createNameSpace(payload)
//         .then((res) => {
//           const data = res.data;
//           resolve(data);
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
