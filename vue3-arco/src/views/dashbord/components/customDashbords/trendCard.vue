<template>
  <div class="trend-card">
    <shadow-line-chart
      :height="570"
      :chartData="cardData"
      :needShadowLine="true"
      :needSmoothLine="false"
    ></shadow-line-chart>
  </div>
</template>
<script>
import shadowLineChart from "@/views/components/charts/shadowLineChart.vue";
import { bigCardMixin } from "@/views/mixins/card.js";

export default {
  mixins: [bigCardMixin],
  props: {
    cardConfigs: {
      type: Object,
      default() {
        return {};
      },
    },

    cardData: {
      type: Object,
      default() {
        return {
          dimensions: [],
          source: [],
        };
        // {
        //   dimensions: ["product", "2015", "2016", "2017"],
        //   source: [
        //     { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
        //     { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
        //     { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
        //     { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
        //   ],
        // };
      },
    },
  },
  components: {
    shadowLineChart,
  },

  data() {
    return {
      isViewInfos: true,
    };
  },
  methods: {},
  created() {},
};
</script>

<style lang="scss" scoped>
.trend-card {
  //
}
</style>
