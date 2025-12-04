<template>
  <div class="app-word-cloud-container">
    <div class="chart-container">
      <word-cloud-chart
        shape="square"
        :gridSize="20"
        :chartData="chartData[0].words"
        :height="500"
      ></word-cloud-chart>
    </div>
    <div class="chart-container">
      <word-cloud-chart
        shape="square"
        :gridSize="20"
        :chartData="chartData[1].words"
        :height="500"
      ></word-cloud-chart>
    </div>
  </div>
</template>

<script>
import wordCloudChart from "@/views/components/charts/wordCloudChart.vue";
import { bigCardMixin } from "@/views/mixins/card.js";

export default {
  mixins: [bigCardMixin],
  props: {
    cardData: {
      default() {
        return {
          chartData: [{ words: [] }, { words: [] }],
        };
      },
    },
  },
  data() {
    return {
      chartData: [{ words: [] }, { words: [] }],
    };
  },

  watch: {
    cardData: {
      immediate: true,
      handler(val) {
        if (val && val.chartData) {
          this.chartData = val.chartData;
        }
      },
    },
  },

  components: {
    wordCloudChart,
  },
};
</script>

<style lang="scss" scoped>
.app-word-cloud-container {
  display: flex;
  align-content: center;
  justify-content: space-between;
  height: 100%;

  .chart-container {
    width: 50%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
