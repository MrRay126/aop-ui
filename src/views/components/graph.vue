<template>
  <div class="graphic">
    <div
      ref="graphic-chart"
      class="graphic-chart"
      :style="{ height: height + 'px', width: '100%', 'min-width': '100px' }"
    ></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "./echarts-wordcloud.js";

export default {
  // props: ["options"],
  props: {
    options: {
      type: Object,
    },

    height: {
      type: Number,
      default: 400,
    },

    color: {
      type: Array,
      default() {
        return [
          "#00a8e1",
          "#99cc00",
          "#e30039",
          "#fcd300",
          "#800080",
          "#00994e",
          "#ff6600",
          "#808000",
          "#db00c2",
          "#008080",
          "#0000ff",
          "#c8cc00",
        ];
      },
    },

    legendChangeHandler: {
      type: Function,
      default: () => {},
    },

    chartClickHandler: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      chart: "",
      width: 300,
      // height: 400,
    };
  },
  watch: {
    "options.version": {
      immediate: true,
      handler() {
        this.resize();
      },
    },

    options: {
      immediate: true,
      handler() {
        this.resize();
      },
    },
  },

  methods: {
    handleWindowResize() {
      clearTimeout(this.timo);
      this.timo = setTimeout(() => {
        this.resize();
      }, 100);
    },

    init() {
      if (this.$refs["graphic-chart"]) {
        this.chart = echarts.init(this.$refs["graphic-chart"]);

        this.chart.on("legendselectchanged", (params) => {
          typeof this.legendChangeHandler === "function" &&
            this.legendChangeHandler(params, this.chart);
        });

        //图点击事件
        this.chart.on("click", (param) => {
          this.chartClickHandler(param);
        });
      }
    },

    destory() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },

    resize() {
      if (!this.options) {
        return;
      }
      if (!this.chart) {
        this.init();
      }
      if (!this.chart) {
        return;
      }

      this.options.color = this.color;
      if (this.options.clear) {
        this.chart.clear();
        delete this.options.clear;
      }
      this.options.loading
        ? this.chart.showLoading({ text: "正在加载中...", lineWidth: 3 })
        : this.chart.hideLoading();
      this.chart.resize({
        height: this.height,
        animation: { duration: 1000 },
      });
      this.chart.setOption(this.options);
    },

    getInstance() {
      return this.chart;
    },
  },

  mounted() {
    this.init();
    this.$nextTick(() => {
      this.resize();
    });

    window.addEventListener(
      "resize",
      this.handleWindowResize.bind(this),
      false
    );
  },

  beforeDestroy() {
    this.destory();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.graphic {
  user-select: none;
  box-sizing: border-box;
  // border: 1px solid $color-border;
  border-radius: 4px;
  padding: 1px;
  position: relative;
  overflow: hidden;

  .graphic-chart {
    width: 100%;
    // min-height: 300px;
    overflow: auto;
  }
}
</style>
