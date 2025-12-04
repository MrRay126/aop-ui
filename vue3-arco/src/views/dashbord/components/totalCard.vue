<template>
  <div class="total-card">
    <template v-if="cardData && cardData.configs && cardData.configs.aop_type">
      <card
        :loading="isLoading"
        :cardData="{
          report: {
            name: title,
            configs: {
              ...this.cardData.configs,
            },
            comment: comment,
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
        <div class="content-container">
          <div class="count">
            {{ numeral(cardData.count).format("0,00") }}
          </div>

          <div class="content-detail">
            <template v-if="isSingleDate && cardData && cardData.rate">
              <div class="compare-container flex1">
                <div class="compare-one flex2">
                  <span>周同比</span>
                  <el-tooltip
                    :content="`对比时间: ${cardData.rate.week.startTime} ~ ${cardData.rate.week.endTime}`"
                    placement="right"
                  >
                    <span>
                      <span class="rate">{{ cardData.rate.week.data }}</span>
                      <span>
                        <template
                          v-if="
                            cardData && cardData.rate && cardData.rate.week.isUp
                          "
                        >
                          <span class="color-red">▲</span>
                        </template>
                        <template v-else>
                          <span class="color-green">▼</span>
                        </template>
                      </span>
                    </span>
                  </el-tooltip>
                </div>
                <div class="compare-two">
                  <span>日环比</span>
                  <el-tooltip
                    :content="`对比时间: ${cardData.rate.day.startTime}`"
                    placement="right"
                  >
                    <span>
                      <span class="rate">{{ cardData.rate.day.data }}</span>
                      <span>
                        <template
                          v-if="
                            cardData && cardData.rate && cardData.rate.day.isUp
                          "
                        >
                          <span class="color-red">▲</span>
                        </template>
                        <template v-else>
                          <span class="color-green">▼</span>
                        </template>
                      </span>
                    </span>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <template v-else-if="cardData && cardData.peroidTime">
              <div class="compare-container flex1">
                <div class="compare-one flex2">
                  <span>环比</span>
                  <el-tooltip
                    :content="`对比时间: ${cardData.peroidTime.circleTimeRate.startTime} ~ ${cardData.peroidTime.circleTimeRate.endTime}`"
                    placement="right"
                  >
                    <span>
                      <span class="rate">{{
                        cardData.peroidTime?.circleTimeRate?.data
                      }}</span>
                      <span>
                        <template
                          v-if="
                            cardData &&
                            cardData.peroidTime?.circleTimeRate?.isUp
                          "
                        >
                          <span class="color-red">▲</span>
                        </template>
                        <template v-else>
                          <span class="color-green">▼</span>
                        </template>
                      </span>
                    </span>
                  </el-tooltip>
                </div>
                <!-- next flex布局占位标签 -->
                <span> </span>
              </div>

              <!-- <line-chart-simple
                :height="40"
                :chartData="cardData.chartData"
              ></line-chart-simple> -->
            </template>
          </div>
        </div>
      </card>
    </template>
    <template v-else>
      <div class="no-data">暂无数据</div>
    </template>
  </div>
</template>
<script>
// import lineChartSimple from "@/views/components/charts/lineChartSimple.vue";
import card from "./card.vue";
import numeral from "numeral";

export default {
  components: {
    // lineChartSimple,
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
        return null;
        // {
        //   // 时间参数
        //   configs: {
        //     time: {
        //       type: "absolute", // absolute|relative 绝对时间|相对时间
        //       start: "2021/8/1 0:0:0", //开始时间字符串
        //       end: "2021/8/30 23:59:59", //结束时间字符串
        //       recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
        //     },
        //   },

        //   count: "8888", // 数量
        //   aop_type: "total", // total | positive |negative
        //   rate: {
        //     // 总量卡时的同环比数据
        //     week: { data: "-", isUp: true },
        //     day: { data: "-", isUp: false },

        //     //时间段数据
        //     peroidTime: {
        //       sameTimeRate: { data: "11%", isUp: false }, // (暂无)同比数据
        //       circleTimeRate: { data: "12%", isUp: false }, // 环比数据
        //     },
        //   },
        //   avgCount: "12345", // 平均数据
        //   tooltipText: "toptip text", // tooltip提示内容

        //   chartData: null,
        // };
      },
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSingleDate: false,
    };
  },
  watch: {
    cardData: {
      immediate: true,
      handler(val) {
        if (val) {
          val.configs.comment = val.configs.tooltipText;
          this.setIfSingleDate(val.configs.time);
        }
      },
    },
  },
  methods: {
    numeral,

    handleAction(payload) {
      const { action, data } = payload;
      if (action === "timeChange") {
        this.$emit("timeChange", {
          data: data,
          cardType: this.cardData.configs.aop_type,
        });

        this.setIfSingleDate(data);
      }
    },

    setIfSingleDate(time) {
      if (time.start && time.end) {
        // 静态时间
        const start = time.start.split(" ")[0];
        const end = time.end.split(" ")[0];

        this.isSingleDate = start === end;
      } else {
        // 动态时间
        const arr = time.recent_day.split("-");
        this.isSingleDate = arr[0] === arr[1];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.total-card {
  width: 100%;
  height: auto;
  min-height: 180px;

  text-align: left;
  font-size: 14px;
  color: $color-text;
  position: relative;

  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;

  .time-calendar {
    margin-left: 10px;
  }

  .el-icon-info {
    margin-left: 3px;
  }

  .download-icon-button {
    padding: 0;
  }

  .no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $color-text;
  }

  .flex1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title-container {
    padding: 10px;
    border-bottom: 1px solid $color-border;
    width: 100%;
  }

  .content-container {
    padding: 10px;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    flex-grow: 1;

    .content-detail {
      width: 100%;
    }

    .count {
      font-size: 20px;
      height: 25px;
      font-weight: bold;
      width: 100%;
      margin-bottom: 20px;
    }
  }

  .time {
    font-size: 12px;
    color: $color-primary;
    text-decoration: underline;

    // &:hover {
    //   text-decoration: underline;
    // }
  }

  .compare-container {
    font-size: 12px;
    border-bottom: 1px solid $color-border;
    padding: 10px 0;

    .compare-one {
      width: 50%;
      padding-right: 10px;

      span {
        &:not(:first-child) {
          margin-left: 10px;
        }

        &:last-child {
          margin-left: 0px;
        }
      }
    }

    .compare-two {
      width: 50%;
      padding-left: 10px;

      span {
        &:not(:first-child) {
          margin-left: 5px;
        }

        &:last-child {
          margin-left: 0px;
        }
      }
    }

    .rate {
      font-weight: bold;
    }

    .color-red {
      color: red;
    }

    .color-green {
      color: #52c51d;
    }
  }

  .avg-count {
    margin-top: 10px;
  }

  .avg-count-num {
    margin-left: 5px;
    font-weight: bold;
  }
}
</style>
