import { Message } from "element-ui";
export default {
  requestTokens: [],

  install(vue) {
    vue.prototype.$cancelRequest = () => {
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
