<template>
  <div class="stack-bar-chart">
    <graph :options="options" :height="height"></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { lineOption } from "./chartData.js";

export default {
  props: {
    /**
     *
     *   xAxis:[1,2,3],
         series: {
             dimension1:[data1,data2,data3]
             dimension2:[data1,data2,data3]
         }
       *  */
    chartData: {
      type: Object,
      default() {
        return {
          xAxis: [
            // "1", "2", "3"
          ],
          series: {
            // a: [1, 2, 3],
            // b: [3, 2, 1],
          },
        };
      },
    },
    height: {
      type: Number,
      default: 380,
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
      const colorDict = {
        positive: "#8EE085",
        negative: "#F76964",
        neutral: "#FFBA6B",
      };

      const options = JSON.parse(JSON.stringify(lineOption));
      const series = this.chartData.series;
      const xAxis = this.chartData.xAxis;

      // legend色彩自动匹配series子项的颜色
      options.legend.data = Object.keys(series);
      options.legend.show = true;
      options.legend.left = "center";
      options.legend.top = 0;

      options.grid.bottom = 20;

      options.xAxis[0].data = xAxis;

      let seriesData = [];
      for (let prop in series) {
        const seriesItem = {
          name: prop,
          type: "bar",
          stack: "one",
          data: series[prop],
          color: colorDict[prop],
        };
        seriesData.push(seriesItem);
      }

      options.series = seriesData;

      this.options = options;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.stack-bar-chart {
}
</style>
