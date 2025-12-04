// import { getActions } from "@/utils/storeUtils.js";
import downloadApi from "@/api/download.js";
import { exportByUrl } from "@/utils";
import { Message } from "element-ui";
import { cancelRequest } from "@/utils/request";
const state = {
  needDownload: false,
  timer: null,
};
const mutations = {
  // 停止下载轮训
  stopDownload(state) {
    clearTimeout(state.timer);
  },
};

//下载函数
async function download(id, successCb, failCb, store) {
  try {
    const res = await downloadApi.downloadTaskStatus(id);
    const status = res.data.data.status;
    if (["failed", "cancel"].includes(status)) {
      //下载失败
      Message({
        message: "下载任务失败或已取消!",
        type: "warning",
      });

      failCb();

      return;
    } else if (["pending", "processing"].includes(status)) {
      //文件生成中
      store.state.timer = setTimeout(() => {
        download(id, successCb, failCb, store);
      }, 2000);
    } else if (status === "success") {
      // 下载成功

      const url = res.data.data.url;
      if (url) {
        exportByUrl(url);

        successCb();

        Message({
          message: "下载成功!",
          type: "success",
        });
      } else {
        //下载失败
        failCb();
        Message({
          message: "下载url不存在!",
          type: "error",
        });
      }
    }
  } catch (err) {
    failCb();
  }
}

// 同步dashbord内部的actions
// let action_pre = getActions(downloadApi);

const actions = {
  downloadAnalysis(store, payload) {
    return new Promise((resolve, reject) => {
      downloadApi
        .downloadAnalysis(payload)
        .then((res) => {
          const id = res.data.data.id;

          if (typeof id === "number") {
            download(id, resolve, reject, store);
          } else {
            Message({
              message: "下载失败",
              type: "danger",
            });
            reject();
          }
        })
        .catch(() => {
          // noop
          reject();
        });
    });

    // function downloader() {}
  },

  // kol主页面及下钻页面, 详情数据的下载
  downloadKolAnalysis(store, payload) {
    return new Promise((resolve, reject) => {
      downloadApi
        .downloadKolAnalysis(payload)
        .then((res) => {
          const id = res.data.data.id;

          if (typeof id === "number") {
            download(id, resolve, reject, store);
          } else {
            Message({
              message: "下载失败",
              type: "danger",
            });
            reject();
          }
        })
        .catch(() => {
          // noop
          reject();
        });
    });

    // function downloader() {}
  },

  stopDownloadAnalysis(store) {
    cancelRequest("下载请求已取消");
    store.commit("stopDownload");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
