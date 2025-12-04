<template>
  <div class="line-chart">
    <graph
      :options="options"
      :height="height"
      :chartClickHandler="chartClickHandler"
    ></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { lineOption, generateMarkpointCoord } from "./chartData.js";

export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          dimensions: [
            // "product", "2015", "2016", "2017"
          ],
          source: [
            // { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
            // { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
            // { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
            // { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
          ],
        };
      },
    },
    height: {
      type: Number,
      default: 400,
    },

    needShadowLine: {
      type: Boolean,
      default: false,
    },

    needSmoothLine: {
      type: Boolean,
      default: true,
    },
  },
  components: { graph },
  data() {
    return {
      options: null,
    };
  },
  watch: {
    chartData: {
      immediate: true,
      handler(val) {
        if (val.dimensions.length > 0) {
          this.updateChart();
        }
      },
    },
  },
  methods: {
    chartClickHandler(param) {
      this.$emit("click", param);
    },

    updateChart() {
      const options = JSON.parse(JSON.stringify(lineOption));
      options.tooltip = lineOption.tooltip; // 避免复制过程丢失的tooltip fromatter函数
      options.dataset = this.chartData;
      options.legend.show = true;
      options.legend.bottom = 0;
      const dimensions = this.chartData.dimensions;
      const markPoints = this.chartData.markPoints || {};

      // chartData.markPoints={
      //     '维度1': [["2023-04-24 18", 315]]
      //}

      const series = [];
      dimensions.slice(1).forEach((dimensionItem) => {
        const seriesItem = {
          type: "line",
          smooth: true,

          symbolSize: 2,

          markPoint: {
            symbol: "circle",
            symbolSize: 10,
            itemStyle: {
              color: "red",
            },
            data: generateMarkpointCoord(markPoints[dimensionItem]),
          },
        };

        if (this.needShadowLine) {
          seriesItem.areaStyle = {};
        }

        seriesItem.smooth = this.needSmoothLine;

        series.push(seriesItem);
      });

      options.series = series;

      this.options = options;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.line-chart {
}
</style>
