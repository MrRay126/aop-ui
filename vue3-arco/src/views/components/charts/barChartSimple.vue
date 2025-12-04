<template>
  <div class="bar-chart">
    <graph :options="options" :height="height"></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { lineOption } from "./chartData.js";

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
      default: 380,
    },

    //是否显示x轴
    hasXAxis: {
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
      handler() {
        this.updateChart();
      },
    },
  },

  methods: {
    updateChart() {
      const options = JSON.parse(JSON.stringify(lineOption));
      options.dataset = this.chartData;

      options.series = new Array(
        this.chartData.dimensions.length > 0
          ? this.chartData.dimensions.length - 1
          : 0
      ).fill({
        type: "bar",
      });

      options.xAxis[0].show = true; //隐藏x轴坐标
      options.yAxis[0].show = false; //隐藏x轴坐标
      options.legend.show = false;

      options.grid = {
        top: "8%",
        bottom: "10",
        right: "20",
        left: "20",
        containLabel: true,
      };

      options.tooltip.formatter = function (params) {
        const param = params[0];
        return `
        <div>${param.value[param.dimensionNames[0]]}</div>
        <div> 帖子数量: ${param.value[param.seriesName]}</div>
        `;
      };
      this.options = options;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.bar-chart {
}
</style>
