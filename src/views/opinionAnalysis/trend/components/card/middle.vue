<template>
  <div class="trend-middle-card">
    <line-chart :height="600" :chartData="chartData"></line-chart>
  </div>
</template>
<script>
import lineChart from "@/views/components/charts/trendLineChart.vue";

export default {
  props: {
    cardData: {
      type: Object,
      default() {
        return {
          dimensions: ["time", "武器-内容量", "角色-内容量"],
          source: [
            {
              time: "2022-12-28T12:30:20",
              "武器-内容量": 43.3,
              "角色-内容量": 85.8,
            },
            {
              time: "2022-12-29T12:30:20",
              "武器-内容量": 86.4,
              "角色-内容量": 65.2,
            },
            {
              time: "2022-12-30T12:30:20",
              "武器-内容量": 72.4,
              "角色-内容量": 53.9,
            },
          ],
        };
      },
    },

    //卡片的配置信息
    cardConfigs: {
      type: Object,
      default() {
        return {
          filter: {},
        };
      },
    },
  },
  components: {
    lineChart,
  },
  // mixins:
  data() {
    return {
      chartData: {
        dimensions: [
          // "time", "武器-内容量", "角色-内容量"
        ],
        source: [
          // {
          //   time: "2022-12-28T12:30:20",
          //   "武器-内容量": 43.3,
          //   "角色-内容量": 85.8,
          // },
          // {
          //   time: "2022-12-29T12:30:20",
          //   "武器-内容量": 86.4,
          //   "角色-内容量": 65.2,
          // },
          // {
          //   time: "2022-12-30T12:30:20",
          //   "武器-内容量": 72.4,
          //   "角色-内容量": 53.9,
          // },
        ],
      },
    };
  },
  watch: {
    cardData: {
      immediate: true,
      handler(val) {
        if (val) {
          setTimeout(() => {
            this.chartData = val.chartData;
          }, 300);
        }
      },
    },
  },
  methods: {},
  created() {},
};
</script>
<style lang="scss" scoped>
.trend-middle-card {
  padding: 0 10px;
  width: 100%;
  overflow-x: auto;
}
</style>
