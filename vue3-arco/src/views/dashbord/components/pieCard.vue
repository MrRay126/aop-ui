<template>
  <div class="pie-card">
    <template v-if="cardData && cardData.configs.aop_type">
      <card
        :loading="isLoading"
        :cardData="{
          report: {
            name: title,
            comment: comment,
            configs: {
              ...this.cardData.configs,
            },
          },
        }"
        :configs="{
          hasDownload: false,
          hasMoreOperationBtn: false,
          titleClickToReport: false,
          isAutoTriggerApplyTimeEvent: false,
          useToolTip: true,
        }"
        :topHeight="40"
        :bottomHeight="140"
        @action="handleAction"
      >
        <div class="graph-container">
          <pie-chart :chartData="cardData.pie"></pie-chart>
        </div>
      </card>
    </template>
    <template v-else>
      <div class="no-data">暂无数据</div>
    </template>
  </div>
</template>
<script>
import pieChart from "@/views/components/charts/pieChart.vue";
import { panelType } from "../data";
import card from "./card.vue";
export default {
  components: {
    pieChart,
    card,
  },
  props: {
    // 标题
    title: {
      type: String,
      default: "",
    },

    // tooltip注释
    comment: {
      type: String,
      default: "",
    },

    cardData: {
      type: Object,
      default() {
        return {
          title: "总内容量", // 标题
          tooltipText: "toptip text", // tooltip提示内容
          // 时间参数
          configs: {
            time: {
              type: "absolute", // absolute|relative 绝对时间|相对时间
              start: "2021/8/1 0:0:0", //开始时间字符串
              end: "2021/8/30 23:59:59", //结束时间字符串
              recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
            },
          },
          pie: [
            { value: 1048, name: "正向" },
            { value: 735, name: "负向" },
            { value: 580, name: "中性" },
          ],
        };
      },
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleTimeChange(time) {
      this.$emit("timeChange", { data: time, cardType: panelType.pie });
    },

    handleAction(payload) {
      const { action, data } = payload;
      if (action === "timeChange") {
        this.$emit("timeChange", {
          data: data,
          cardType: panelType.pie,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.pie-card {
  width: 100%;
  height: auto;
  min-height: 180px;

  text-align: left;
  font-size: 14px;
  color: $color-text;
  position: relative;

  .title-container {
    .el-icon-info {
      margin-left: 5px;
    }
    .time {
      margin-left: 10px;
    }
  }

  .no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $color-text;
  }

  .time-range-wrapper {
    line-height: 12px;
  }

  .flex1 {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .time {
    font-size: 12px;
    color: $color-primary;
    text-decoration: underline;
    // &:hover {
    // text-decoration: underline;
    // color: $title-text-color;
    // }
  }

  .graph-container {
    ::v-deep(.pie-chart) {
      margin-top: 0;
    }
  }
}
</style>
