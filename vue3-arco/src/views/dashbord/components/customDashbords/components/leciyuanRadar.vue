<template>
  <div class="radar-chart">
    <graph :options="options" :height="height"></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { radarOptions } from "@/views/components/charts/chartData.js";
import numeral from "numeral";

export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          dimensions: ["评论", "点赞", "转发"],
          source: [
            {
              time: "2022-01",
              评论: 100,
              点赞: 200,
              转发: 100,

              details: {
                xxx徽章: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },

                xxx徽章2: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },
              },
            },
          ],
        };
      },
    },

    height: {
      type: Number,
      default: 400,
    },

    hasLegend: {
      type: Boolean,
      default: false,
    },
  },
  components: { graph },
  data() {
    return {
      options: null,
      tooltipHeight: 200,
    };
  },
  watch: {
    chartData: {
      immediate: true,
      handler(val) {
        if (val && val.dimensions) {
          this.updateChart();
        }
      },
    },
  },
  methods: {
    numeral,
    updateChart() {
      const options = JSON.parse(JSON.stringify(radarOptions));
      let indicator = [];
      for (let name of this.chartData.dimensions) {
        indicator.push({ name });
      }
      options.radar[0].indicator = indicator;
      options.series[0].data =  this.chartData.source;
      this.options = options;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
</style>
