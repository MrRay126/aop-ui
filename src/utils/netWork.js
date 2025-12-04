import store from "@/store";
import excludePath from "../api/exclude.js";

export default {
  reqCount: 0,
  setLoading(loading) {
    // store.state.app.loading = loading;
  },
  requestLoadingSet(config) {
    if (!excludePath.some((x) => new RegExp(x).test(config.url))) {
      this.reqCount++;
    }
    if (this.reqCount > 0) {
      this.setLoading(true);
    }
  },

  responseLoadingSet(config) {
    if (!excludePath.some((x) => new RegExp(x).test(config.url))) {
      this.reqCount--;
    }
    if (this.reqCount === 0) {
      this.setLoading(false);
    }
  },
  errorLoadingSet() {
    this.reqCount = 0;
    this.setLoading(false);
  },
};
