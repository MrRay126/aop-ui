<template>
  <div class="pie-chart">
    <graph :options="options" :height="height"></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { pieOptions } from "./chartData.js";

export default {
  props: {
    chartData: {
      type: Array,
      default() {
        return [
          // { value: 1048, name: "正向" },
          // { value: 735, name: "负向" },
          // { value: 580, name: "中性" },
        ];
      },
    },
    height: {
      type: Number,
      default: 120,
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
      const options = JSON.parse(JSON.stringify(pieOptions));
      options.series[0].data = this.chartData;

      this.options = options;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.pie {
}
</style>
