<template>
  <div class="division-chart">
    <graph
      :options="options"
      :height="height"
      :chartClickHandler="handleWordClick"
    ></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { treeMap } from "./chartData.js";

export default {
  props: {
    chartData: {
      type: Array,
      default() {
        return [
          {
            name: "抽奖",
            value: 10,
            positive: 9,
            negative: 1,
            neutral: 0,
            tagText: "表掐",
          },
          {
            name: "抽奖",
            value: 30,
            positive: 14,
            negative: 1,
            neutral: 15,
          },
          {
            name: "把酒问青天",
            value: 20,
            positive: 14,
            negative: 1,
            neutral: 15,
          },
          {
            name: "不知天上宫阙",
            value: 5,
            positive: 14,
            negative: 1,
            neutral: 15,
          },
          {
            name: "今夕是何年",
            value: 5,
            positive: 14,
            negative: 1,
            neutral: 15,
          },
        ];
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
      // const tooltip = treeMap.tooltip;
      const options = treeMap;

      // options.tooltip = tooltip;
      options.series[0].data = this.chartData;
      this.options = options;
    },
    handleWordClick(item) {
      this.$emit("click", item.data);
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped></style>
