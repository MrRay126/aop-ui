<template>
  <div class="word-cloud-chart">
    <graph
      :options="options"
      :height="height"
      :chartClickHandler="handleWordClick"
    ></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { getWordCloudOptions, getTextColor } from "./chartData.js";

export default {
  props: {
    chartData: {
      type: Array,
      default() {
        return [];
        /**
         [
          {
            name: "Sam S Club",
            value: 1500,
            positive: 1000,
            negative: 500,
            neutral: 0,
          },
          {
            name: "Macys",
            value: 6181,
            positive: 6000,
            negative: 180,
            neutral: 1,
          },
        ];
         */
      },
    },

    height: {
      type: Number,
      default: 300,
    },

    gridSize: {
      type: Number,
      default: 5,
    },

    shape: {
      type: String,
      default: "circle", //
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
      const options = getWordCloudOptions({
        gridSize: this.gridSize,
        shape: this.shape,
      });

      options.series[0].data = this.chartData.map((item) => {
        return this.setTextStyle(item);
      });
      this.options = options;
    },

    setTextStyle(item) {
      //显示颜色
      item.textStyle = {
        color: this.getColor(item),
      };
      //hover色
      item.emphasis = {
        textStyle: {
          color: "red",
        },
      };
      return item;
    },

    //获取颜色
    getColor(item) {
      if (
        typeof item.negative === "number" &&
        typeof item.positive === "number"
      ) {
        const negativePercent =
          item.negative / (item.negative + item.positive + item.neutral);
        if (negativePercent >= 0 && negativePercent <= 0.1) {
          return "#7EDAFB";
        } else if (negativePercent > 0.1 && negativePercent <= 0.2) {
          return "#64E8D6";
        } else if (negativePercent > 0.2 && negativePercent <= 0.3) {
          return "#8EE085";
        } else if (negativePercent > 0.3 && negativePercent <= 0.4) {
          return "#C3DD40";
        } else if (negativePercent > 0.4 && negativePercent <= 0.5) {
          return "#FAD355";
        } else if (negativePercent > 0.5 && negativePercent <= 0.6) {
          return "#FFBA6B";
        } else if (negativePercent > 0.6 && negativePercent <= 0.7) {
          return "#DE7802";
        } else if (negativePercent > 0.7 && negativePercent <= 0.8) {
          return "#F76964";
        } else if (negativePercent > 0.8 && negativePercent <= 0.9) {
          return "#D83931";
        } else if (negativePercent > 0.9 && negativePercent <= 1) {
          return "#812520";
        }
        return "red";
      } else {
        return "#000";
      }
    },
    //
    handleWordClick(item) {
      this.$emit("click", item);
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.word-cloud-chart {
}
</style>
