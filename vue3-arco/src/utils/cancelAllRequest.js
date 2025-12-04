import { Message } from "@arco-design/web-vue";
export default {
  requestTokens: [],

  install(app) {
    app.config.globalProperties.$cancelRequest = () => {
      this.cancel();
    };
  },

  addToken(token) {
    this.requestTokens.push(token);
  },

  cancel() {
    this.requestTokens.forEach((tokenItem) => {
      tokenItem.cancel();
    });
    this.requestTokens = [];
    Message.info({
      message: "请求已取消!",
    });
  },
};
