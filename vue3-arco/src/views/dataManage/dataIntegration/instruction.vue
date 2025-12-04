<template>
  <div class="instruction-container">
    <div class="title">数据接入说明</div>
    <div class="content">
      <div
        class="content-body markdown-body"
        v-loading="loading"
        v-html="html"
      ></div>
    </div>
  </div>
</template>
<script>
import marked from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import "@/styles/gitthub-markdown-light.min.css";

export default {
  props: {
    markText: {
      type: String,
      default: "",
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    html() {
      //1 设置代码字符本身的颜色 用highlight.js
      //2 设置代码块样式用 gitthub-markdown-light.min.css 容器class设置为markdown-body
      let rendererMD = new marked.Renderer();
      marked.setOptions({
        renderer: rendererMD,
        highlight: function (code) {
          return hljs.highlightAuto(code).value;
        },
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false,
      });

      return marked(this.markText);
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.instruction-container {
  height: 100%;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    overflow: auto;
    height: calc(100% - 64px);
    width: 100%;
    padding: 40px;
  }

  .content-body {
    width: 100%;
    max-width: 1000px;
  }

  .title {
    width: 100%;
    padding: 20px;
    border-bottom: 1px solid $color-border;
    font-size: 14px;
    font-weight: bold;
    color: $color-text;
  }
}
</style>
