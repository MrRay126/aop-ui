<template>
  <div class="line-chart">
    <!-- chartData: {{ chartData }} -->
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
            // "product", "2015"
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
      default: 150,
    },

    showLegend: {
      type: Boolean,
      default: false,
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
        if (val) {
          this.updateChart();
        }
      },
    },
  },
  methods: {
    updateChart() {
      // console.log("lineoptions::", JSON.stringify(this.chartData));
      const options = JSON.parse(JSON.stringify(lineOption));
      options.dataset = {
        dimensions: this.chartData.dimensions,
        source: this.chartData.source,
      };
      // options.xAxis[0].show = false;
      //   options.yAxis[0].show = false;
      options.grid = { top: 5, right: 0, bottom: 20, left: -10 };
      options.legend.show = this.showLegend;
      options.tooltip.show = true;

      if (this.chartData.dimensions.length > 0) {
        options.series = new Array(
          this.chartData.dimensions.length > 0
            ? this.chartData.dimensions.length - 1
            : 0
        ).fill({
          type: "line",
          //   areaStyle: {}, // 阴影线图
        });
      }

      this.options = options;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped></style>
