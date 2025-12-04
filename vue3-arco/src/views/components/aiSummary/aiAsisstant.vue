<template>
  <div class="asistant">
    <el-dialog
      title="提示"
      width="800px"
      :visible.sync="isVisible"
      :before-close="handleClose"
      @open="handleOpen"
    >
      <template slot="title">
        <div class="title-container">
          <span class="title">AI助手</span>
          <template v-if="time">
            <span class="time-wrapper">
              <!-- 日历组件 -->
              <time-range-calendar
                :isTextTypeReference="false"
                :timeData="time"
                :isAutoTriggerApplyTimeEvent="false"
                :disabled="true"
              >
              </time-range-calendar>
            </span>
          </template>

          <!-- 筛选条件展示 -->
          <span class="conditions-wrapper">
            <div class="filter-selected-list" :class="{ disabled: true }">
              <svg-icon icon-class="ding" :disabled="true" size="18"></svg-icon>
              <div class="list-section-wrapper">
                <div class="list-section">
                  <template v-for="(item, index) in filterConditionList">
                    <div class="filter-list-item" :key="index">
                      {{ item }}
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </span>
        </div>
      </template>
      <div class="content-container" v-loading="loading">
        <template v-if="result.state === 'running'">
          <div class="running-wrapper">
            <i class="el-icon-loading"></i>
            <span class="running-tip">
              计算可能需要较长时间,已为您保存任务。<br />
              可关闭窗口稍后查看。<br />
              任务ID：{{ result.taskId }}
            </span>
          </div>
        </template>
        <template v-else-if="result.state === 'failed'">
          <div class="erro-msg-wrapper">
            <i class="el-icon-circle-close"></i>
            <span class="error-message">{{ result.errorMsg }}</span>
          </div>
        </template>
        <template v-else-if="result.state === 'success'">
          <template v-if="result.data">
            <div class="copy-button-container">
              <span class="copy-title">已为您生成总结:</span>
              <el-button @click="handleCopy" size="mini">复制</el-button>
            </div>
            <div
              class="result-data"
              v-html="result.data"
              ref="resultContent"
            ></div>
          </template>
          <template v-else>
            <div class="no-data">暂无数据</div>
          </template>
        </template>
      </div>
    </el-dialog>

    <filters
      style="display: none"
      ref="filters"
      :configData="filter.filters"
      :optionsData="filterOpionsData"
      :valueComponentConfig="filterValueComponentConfig"
    ></filters>
  </div>
</template>
<script>
import filters from "@/views/components/filters";
import timeRangeCalendar from "../time-range-calendar";
import recentDay from "@/utils/timeData.js";

import { fitListData } from "@/views/components/filters/data.js";

import { cloneObject } from "@/utils";
export default {
  components: { timeRangeCalendar, filters },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    viewId: {
      type: Number,
      default: null,
    },

    configs: {
      type: Object,
      default() {
        return {
          filters: {
            relTag: "and",
            children: [
              {
                id: "3f5084d4-1a07-426a-def8-a46e70db0f6f",
                key: "id",
                relation: "eq",
                value: ["4947275568644481"],
              },
            ],
          },
          time: {
            type: "absolute", // absolute|relative 绝对时间|相对时间
            start: recentDay["1-7"].start, //开始时间字符串
            end: recentDay["1-7"].end, //结束时间字符串
            recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
          },
        };
      },
    },
  },
  data() {
    return {
      isVisible: false,
      loading: false,

      result: {
        state: "", // success failed running
        errorMsg: "错误信息错误信息错误信息错误信息错误信息错误信息错误信息",
        taskId: 0,
        data: "<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>",
      },

      time: null,

      filterOpionsData: [],
      filter: {
        value: "",
        filters: {
          relTag: "and",
          children: [],
        },
      },
      filterValueComponentConfig: {},
      filterConditionList: [],

      closed: false,
    };
  },
  watch: {
    visible(val) {
      this.isVisible = val;
    },
  },
  methods: {
    async handleOpen() {
      this.result = this.$options.data().result;
      this.closed = false;
      await this.getFilterOptions();

      // 查看结果
      if (this.viewId) {
        this.fetchSummaryResultById();
      } else {
        this.filter.filters = this.configs.filters;
        this.time = this.configs.time;
        console.log("this.time::", this.time);
        console.log("this.filters::", this.filter.filters);
        // 过滤条件列表
        this.$nextTick(() => {
          this.getFilterConditionList();
        });

        this.loading = true;

        const res = await this.calcAiSumaryData();

        if (res.state !== "running") {
          this.result = res;
        } else {
          this.loopFetchData(res.taskId);
        }
      }
    },

    handleClose() {
      this.closeTimer();
      this.$emit("close");
    },

    closeTimer() {
      this.closed = true; // 停止处理请求结果
      clearTimeout(this.timer); // 停止待发起的轮询
    },

    handleCopy() {
      const text = this.$refs["resultContent"].innerText;
      console.log(text);
      this.$copyText(text).then(() => {
        this.$message({
          message: "复制成功！",
          type: "success",
          duration: 3000,
        });
      });
    },

    fetchSummaryResultById() {
      this.loading = true;

      this.$store
        .dispatch("ai/getAiSummaryById", this.viewId)
        .then((res) => {
          this.result = res.summary;
          this.filter.filters = res.filter.filters;
          this.time = res.time;
          this.$nextTick(() => {
            this.getFilterConditionList();
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async loopFetchData(taskId) {
      const res = await this.fetchAiSummaryResultById(taskId);
      this.loading = false;
      if (this.closed) return;

      this.result = res.summary;
      if (res.summary.state === "running") {
        this.timer = setTimeout(() => {
          this.loopFetchData(taskId);
        }, 1000);
      }
    },

    calcAiSumaryData() {
      return new Promise((resolve) => {
        const payload = cloneObject(this.configs);
        console.log("post!!!", this.$store);
        // if
        this.$store
          .dispatch("ai/calcAiSummary", payload)
          .then((res) => {
            resolve(res);
          })
          .catch(() => {
            // noop
          });
      });
    },

    fetchAiSummaryResultById(id) {
      return new Promise((resolve) => {
        this.$store
          .dispatch("ai/getAiSummaryById", id)
          .then((res) => {
            resolve(res);
          })
          .catch(() => {});
      });
    },

    getFilterConditionList() {
      const tags = this.$refs["filters"].__getFilterDisplayTagList();
      this.filterConditionList = [];
      tags.forEach((tagItem) => {
        if (Array.isArray(tagItem.value)) {
          tagItem.value.forEach((valueItem) => {
            this.filterConditionList.push(
              `${tagItem.key}/${tagItem.relation}/${valueItem}`
            );
          });
        } else {
          this.filterConditionList.push(
            `${tagItem.key}/${tagItem.relation}/${tagItem.value}`
          );
        }
      });

      console.log(
        "tags:::",
        tags,
        "this.filterConditionList::",
        this.filterConditionList
      );
    },

    getFilterOptions() {
      const payload = {
        project_id: this.$store.getters.appId,
      };
      return this.$store
        .dispatch("trend/getFilterOptions", payload)
        .then((data) => {
          this.tableOptionsData = fitListData(data);

          if (data.length > 0) {
            this.filter.value = data[0].code;
            this.setFilterOpionsData();
          }
        });
    },

    setFilterOpionsData() {
      this.filterOpionsData = [];

      if (this.filter.value) {
        const curTable = this.tableOptionsData.find((tableItem) => {
          return tableItem.value === this.filter.value;
        });

        if (curTable) {
          this.filterOpionsData = curTable.keyList || [];
          this.filterValueComponentConfig = curTable.valueComponentConfig;
        }
      }
    },
  },
  beforeDestroy() {
    this.closeTimer();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";

.title-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .title {
    margin-right: 20px;
    font-weight: bold;
  }

  .filter-selected-list {
    margin-left: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    padding: 0 5px;
    height: 30px;
    cursor: pointer;
    color: #42546d;

    &.disabled {
      background-color: #fff;
      border-color: #ebeef5;
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &:hover:not(.disabled) {
      border-color: #409eff;
    }

    .list-section-wrapper {
      height: 24px;
      overflow: hidden;

      .list-section {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        max-width: 300px;
        overflow: auto;

        .filter-list-item {
          border: 1px solid $color-border;

          font-size: 12px;
          padding: 2px 3px;
          margin-left: 5px;
          border-radius: 3px;
          flex-shrink: 0;

          background-color: $light-background-color;
        }
      }
    }
  }
}

.content-container {
  min-height: 300px;

  .running-wrapper {
    padding-top: 80px;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    .running-tip {
      margin-left: 10px;
    }

    .el-icon-loading {
      font-size: 30px;
    }
  }

  .erro-msg-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 80px;
    // text-align: center;
    color: #f65a5c;
    font-size: 14px;

    .el-icon-circle-close {
      font-size: 30px;
      //   vertical-align: middle;
    }

    .error-message {
      margin-left: 5px;
      //   vertical-align: middle;
    }
  }

  .copy-button-container {
    .copy-title {
      color: #959595;
    }
    .copy-title {
      margin-right: 10px;
    }
  }

  .result-data {
    color: $color-text;
    // padding-top: 20px;
    max-height: 400px;
    overflow: auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .no-data {
    text-align: center;
    padding-top: 100px;
    color: $color-text;
  }
}
</style>
