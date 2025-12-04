import axios from "axios";
import { Message, Modal } from "@arco-design/web-vue";
import store from "@/store";
import router from "@/router";

import Cookies from "js-cookie";

import cancelAllRequest from "@/utils/cancelAllRequest.js";

// create an axios instance
import netWork from "./netWork.js";

const baseURL = import.meta.env.VITE_APP_BASE_API || process.env.VUE_APP_BASE_API;

const service = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: false,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = Cookies.get("access_token");
    if (token) {
      //"Authorization: Bearer ${token}"
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    //取消请求功能
    config.cancelToken = new axios.CancelToken((cancel) => {
      cancelAllRequest.addToken({ cancel });
    });

    netWork.requestLoadingSet(config);

    return config;
  },
  (error) => {
    // Do something with request error
    Promise.reject(error);
    netWork.errorLoadingSet();
  }
);

// respone interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  async (res) => {
    netWork.responseLoadingSet(res.config);
    if (res.data.code === 0) {
      // 如果后台返回的json显示成功，pass
      return res;
    } else {
      const UNAUTHEN = 401;
      const SESSION_TIMOUT = 401;
      if (res.data.code === UNAUTHEN || res.data.code === SESSION_TIMOUT) {
        // token失效
        await new Promise((res) => {
          Modal.confirm({
            title: "确定登出",
            content: "你已被登出，可以取消继续留在该页面，或者重新登录",
            okText: "重新登录",
            cancelText: "取消",
            onOk: () => {
              store.dispatch("auth/logout").then(() => {
                router.push({
                  path: window.aop.login,
                });
              });
            },
            onCancel: () => res(),
          });
        });
      } else {
        // 其它错误弹出错误信息
        Message({
          message: res.data.message,
          type: "error",
          duration: 3000,
        });

        return Promise.reject(`Error:${res.data.message}` || "error");
      }
      // return Promise.reject("error");
    }
  },

  /**
   * 请求发生错误，一般都是服务器抛异常了
   */
  (err) => {
    netWork.errorLoadingSet();

    if (err.Message === "Network Error") {
      // 处理登录相关的错误
      Modal.confirm({
        title: "确定登出",
        content: "你已被登出，可以取消继续留在该页面，或者重新登录",
        okText: "重新登录",
        cancelText: "取消",
        onOk: () => {
          store.dispatch("auth/logout").then(() => {
            store.dispatch("auth/ssoLogin").then((ssoUrl) => {
              if (ssoUrl) {
                window.location = ssoUrl;
              }
            });
          });
        },
      });
    } else {
      if (err.message !== "canceled") {
        Message({ message: err.message, type: "error", duration: 3000 });
      }
    }
    return Promise.reject(err);
  }
);

export default service;

export function cancelRequest(msg) {
  let source = axios.CancelToken.source();
  source.cancel();
  Message({
    message: msg,
    type: "info",
  });
}
