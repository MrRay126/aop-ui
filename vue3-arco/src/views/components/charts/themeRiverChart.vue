<template>
  <div class="theme-river">
    <graph :options="options" :height="height"></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { themeRiver } from "./chartData.js";

export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          legend: [
            // "DQ", "TY"
          ],
          data: [
            // ["2015/11/08", 10, "DQ"],
          ],
        };
      },
    },
    height: {
      type: Number,
      default: 400,
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
      const options = JSON.parse(JSON.stringify(themeRiver));
      // options.series[0].data = this.chartData;

      options.legend.data = this.chartData.legend;
      options.series[0].data = this.chartData.data;
      this.options = options;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.theme-river {
}
</style>
