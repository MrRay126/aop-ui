<template>
  <div class="words-middle-card">
    <!-- 词云分析中图 -->
    <word-cloud-chart
      :chartData="wordCloudChartData"
      :height="400"
    ></word-cloud-chart>
  </div>
</template>
<script>
import wordCloudChart from "@/views/components/charts/wordCloudChart.vue";

export default {
  components: {
    wordCloudChart,
  },
  props: {
    cardData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      wordCloudChartData: [],
    };
  },

  watch: {
    cardData: {
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          this.wordCloudChartData = val;
        }
      },
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.words-middle-card {
  padding: 0 10px;
  width: 100%;
  overflow-x: auto;
}
</style>
