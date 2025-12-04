<template>
  <!-- 卡片容器 -->
  <div class="card" v-loading="loading">
    <div
      class="top-section"
      v-if="showTop"
      :style="{
        height: topHeight + 'px',
      }"
    >
      <div class="left">
        <span class="title-wraper">
          <span
            class="title"
            :class="{ primary: configs.titleClickToReport }"
            @click="handleTitleClick"
          >
            {{ cardData.report.name }}
          </span>

          <template v-if="configs.useToolTip && cardData.report.comment">
            <el-tooltip
              :content="cardData.report.comment"
              effect="light"
              placement="top-start"
            >
              <span class="el-icon-info"></span>
            </el-tooltip>
          </template>
        </span>
        <span class="time-wrapper" :style="configs.disableOldCalendar ? { 'display': 'none' } : {}">
          <time-calendar
            :isAutoTriggerApplyTimeEvent="configs.isAutoTriggerApplyTimeEvent"
            :isTextTypeReference="true"
            :timeData="cardData.report.configs.time"
            @applyTime="handleTimeChange"
          >
            <template v-slot:calendar="{ data }">
              <div class="time">{{ data.labelValue }}</div>
            </template>
          </time-calendar>
        </span>
      </div>
      <div class="right">
        <template v-if="configs.hasAiSummary">
          <span style="margin-right: 10px">
            <ai-summary
              :configs="{
                ...cardData.report.configs,
              }"
            ></ai-summary>
          </span>
        </template>
        <template v-if="configs.hasDownload">
          <el-button
            icon="el-icon-download"
            type="text"
            :loading="isDownloading"
            :disabled="disabledStatus.download"
            @click="handleDownload"
          ></el-button>
        </template>
        <template v-if="configs.hasMoreOperationBtn">
          <el-button
            icon="el-icon-more"
            type="text"
            :disabled="disabledStatus.config"
            @click="hanldeMoreConfig"
          ></el-button>
        </template>
      </div>
    </div>
    <div
      class="bottom-section"
      :style="{
        height: bottomHeight + 'px',
      }"
    >
      <!-- <template v-if="!loading"> -->
      <slot></slot>
      <!-- </template> -->
    </div>
  </div>
</template>
<script>
import TimeCalendar from "@/views/components/time-range-calendar";
import aiSummary from "@/views/components/aiSummary";

export default {
  // @openConfig
  // @timeChange
  props: {
    showTop: {
      type: Boolean,
      default: true,
    },
    cardData: {
      type: Object,
      default() {
        return {
          // title: "xxxx词云分析",
          // time: {
          //   type: "relative", // absolute|relative 绝对时间|相对时间
          //   start: "2021/8/1 0:0:0", //开始时间字符串
          //   end: "2021/8/30 23:59:59", //结束时间字符串
          //   recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
          // },
        };
      },
    },

    configs: {
      type: Object,
      default() {
        return {
          hasDownload: true,
          hasMoreOperationBtn: true,
          titleClickToReport: true,
          useToolTip: true,
          isAutoTriggerApplyTimeEvent: false,
          disableOldCalendar: false,
        };
      },
    },

    loading: {
      type: Boolean,
      default: false,
    },

    topHeight: {
      type: Number,
      default: 60,
    },

    bottomHeight: {
      type: Number,
      default: 600,
    },

    disabledStatus: {
      type: Object,
      default() {
        return {
          download: true,
          config: false,
        };
      },
    },
  },
  components: {
    TimeCalendar,
    aiSummary,
  },
  data() {
    return {
      isDownloading: false,
      dialogVisible: true,
    };
  },
  methods: {
    handleTitleClick() {
      if (!this.configs.titleClickToReport) {
        return;
      }

      const cardType = this.cardData.report.type;
      const cardId = this.cardData.report.id;
      this.$router.push({
        path: window.aop[cardType],
        query: {
          id: cardId,
        },
      });
    },
    handleTimeChange(time) {
      this.$emit("action", {
        action: "timeChange",
        data: time,
      });
    },

    handleDownload() {
      this.isDownloading = true;

      this.$emit("action", {
        action: "download",
        data: this.cardData,
        cb: () => {
          this.isDownloading = false;
        },
      });
    },

    hanldeMoreConfig() {
      this.$emit("action", {
        action: "openConfig",
        data: this.cardData,
      });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.card {
  width: 100%;
  overflow-x: auto;
  background: #fff;

  &:hover {
    box-shadow: 0px 0px 20px 0 rgb(225, 225, 225);
  }

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    font-size: 14px;
    border-bottom: 1px solid $color-border;

    .left {
      .title-wraper {
        // margin-right: 20px;

        .el-icon-info {
          vertical-align: -2px;
          color: $color-text;
          margin-left: 0px;
        }

        .title {
          margin-right: 0px;
          color: $color-text;
          vertical-align: middle;
          cursor: pointer;

          &.primary {
            color: $color-primary;
          }
        }
      }

      .time-wrapper {
        vertical-align: -2px;
        margin-left: 10px;
        .time {
          // color: $color-primary;

          &:hover {
            color: $color-primary;
          }
        }

        cursor: pointer;
      }
    }

    .right {
      .el-icon-download {
        margin-right: 10px;
        cursor: pointer;

        &:hover {
          color: $color-primary;
        }
      }

      .el-icon-more {
        cursor: pointer;
        &:hover {
          color: $color-primary;
        }
      }
    }
  }

  .bottom-section {
    //
    height: 600px;
    overflow: hidden;
    background: #fff;
    padding-bottom: 12px;
    overflow-x: auto;
  }
}
</style>
