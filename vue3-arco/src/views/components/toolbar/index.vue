<template>
  <div class="toolbar">
    <div class="left-content">
      <slot></slot>
    </div>
    <div class="right-content">
      <div class="right-left-section">
        <div class="title-wrapper">
          <span class="title">
            <span>
              <slot name="title"> {{ title }}</slot>
            </span>
          </span>

          <template v-if="comment">
            <el-tooltip effect="light" placement="right" :content="comment">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
        </div>

        <template v-if="page === 'dashbord'">
          <template v-if="!isTimeFilterDisabled && !isConditionFilterDisabled">
            <div class="time-and-filters-wrapper">
              <!-- 日历组件 -->
              <time-range-calendar
                :isTextTypeReference="false"
                :timeData="globalTime"
                :isAutoTriggerApplyTimeEvent="false"
                :disabled="isTimeFilterDisabled"
                @applyTime="handleApplyTime"
              >
                <template #calendar="data">
                  <svg-icon icon-class="calendar"></svg-icon>
                  <template v-if="isGlobalTimeTextShow">
                    <span style="margin-left: 5px">{{
                      data.data.labelValue
                    }}</span>
                  </template>
                </template>
              </time-range-calendar>

              <div
                class="filter-selected-list"
                :class="{ disabled: isConditionFilterDisabled }"
                @click="handleOpenDrawer"
              >
                <svg-icon icon-class="ding" size="18"></svg-icon>
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
              <template v-if="filterConditionList.length > 0">
                <el-button
                  class="cancel-btn"
                  type="text"
                  @click="handleFilterCancel"
                  >取消</el-button
                >
              </template>

              <div class="content-filter">
                <el-input
                  v-model="content"
                  class="content-search"
                  suffix-icon="el-icon-search"
                  size="mini"
                  placeholder="输入关键词"
                  clearable
                  @change="handleContentFilterChange"
                ></el-input>
              </div>

              <div class="channel-filter">
                <el-cascader
                  placeholder="渠道筛选"
                  size="mini"
                  v-model="channel"
                  :options="channelCascaderOptions"
                  @change="handleChannelFilterChange"
                ></el-cascader>
              </div>
            </div>
          </template>
        </template>
      </div>

      <div class="right-tools">
        <template v-if="isUseShareBtn">
          <el-button
            icon="el-icon-share"
            @click="handleShare"
            type="text"
          ></el-button>
        </template>

        <template v-if="page === 'dashbord'">
          <el-button
            @click="handleRefresh"
            type="text"
            icon="el-icon-refresh"
          ></el-button>

          <!-- 日历组件 -->
          <!-- <time-range-calendar
            :isTextTypeReference="true"
            :timeData="globalTime"
            :isAutoTriggerApplyTimeEvent="false"
            :disabled="isTimeFilterDisabled"
            @applyTime="handleApplyTime"
          >
            <template slot="calendar">
              <svg-icon
                class="calendar-icon"
                :class="{ disabled: isTimeFilterDisabled }"
                icon-class="calendar"
                size="16"
              ></svg-icon>
            </template>
          </time-range-calendar> -->

          <el-button
            type="text"
            icon="el-icon-setting"
            class="setting-icon-button"
            :disabled="!isDashbordEditable"
            @click="handleConfigDashbord"
          ></el-button>

          <el-button
            type="text"
            icon="el-icon-document-add"
            :disabled="!isDashbordEditable"
            @click="handleEditDashbord"
          ></el-button>
        </template>
        <template v-else-if="toolsVisible">
          <el-button
            @click="handleRefresh"
            :disabled="disabledSettings.refresh"
            type="text"
            icon="el-icon-refresh"
          ></el-button>
          <el-button
            @click="handleDownload"
            :disabled="disabledSettings.download"
            :loading="isDownloading"
            type="text"
            icon="el-icon-download"
          ></el-button>
          <el-button
            icon="el-icon-document"
            type="text"
            :disabled="disabledSettings.report"
            @click="handleOpenReportList"
          ></el-button>
        </template>
      </div>
    </div>

    <el-drawer
      :visible="isFiltersVisible"
      direction="rtl"
      size="450px"
      title="全局筛选"
      :before-close="handleClose"
      @opened="handleOpen"
    >
      <div class="drawer-container">
        <filters
          ref="filters"
          :configData="filter.filters"
          :optionsData="filterOpionsData"
          :valueComponentConfig="filterValueComponentConfig"
          @change="handleFilterChange"
        ></filters>
        <div class="btn-container">
          <el-button
            @click="handleCommitFilterChange"
            size="mini"
            type="primary"
            >计算</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import timeRangeCalendar from "../time-range-calendar";
import filters from "@/views/components/filters";
import recentDay from "@/utils/timeData.js";
import {
  validEmptyFilterItem,
  fitListData,
} from "@/views/components/filters/data.js";

import { cloneObject } from "@/utils";

export default {
  components: {
    timeRangeCalendar,
    filters,
  },

  props: {
    timeData: {
      type: Object,
      default: null,
    },

    filterData: {
      type: Object,
      default: null,
    },

    title: {
      type: String,
      default: "",
    },

    //tooltip注释文案(趋势分析title旁)
    comment: {
      type: String,
      default: "",
    },

    page: {
      type: String,
      default: "",
    },

    isDashbordEditable: {
      type: Boolean,
      default: false,
    },

    downloading: {
      type: Boolean,
      default: false,
    },

    disabledSettings: {
      type: Object,
      default() {
        return {
          refresh: true,
          download: true,
          report: false,
        };
      },
    },

    toolsVisible: {
      type: Boolean,
      default: true,
    },

    isTimeFilterDisabled: {
      type: Boolean,
      default: false,
    },

    isConditionFilterDisabled: {
      type: Boolean,
      default: false,
    },

    isUseShareBtn: {
      type: Boolean,
      default: false,
    },

    isGlobalTimeTextShow: {
      type: Boolean,
      default: false,
    },

    customFilter: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      isFiltersVisible: false,
      isDownloading: false,

      globalTime: {
        type: "relative", // absolute|relative 绝对时间|相对时间
        start: recentDay["1-7"].start, //开始时间字符串
        end: recentDay["1-7"].end, //结束时间字符串
        recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      },

      filter: {
        value: "",
        filters: {
          relTag: "and", // or | and
          children: [],
        },
      },

      oldFilter: {
        value: "",
        filters: {
          relTag: "and", // or | and
          children: [],
        },
      },

      filterOpionsData: [],
      filterValueComponentConfig: {},
      filterConditionList: [],

      content: "",
      channel: [],
      //渠道的cascader选项
      channelCascaderOptions: [],
    };
  },

  watch: {
    downloading(val) {
      this.isDownloading = val;
    },

    timeData: {
      immediate: false,
      handler(val) {
        if (val) {
          this.globalTime = val;
        } else {
          // 重置为初始值
          this.globalTime = this.$options.data().globalTime;
        }
      },
    },

    filterData: {
      immediate: false,
      handler(val) {
        if (val) {
          this.filter = val;
        } else {
          // 重置为初始值
          this.filter = this.$options.data().filter;
        }
        this.oldFilter = cloneObject(this.filter);
        this.$nextTick(() => {
          this.getFilterConditionList();
        });
      },
    },

    customFilter: {
      immediate: false,
      handler(val) {
        if (val) {
          this.content = this.customFilter.content;
          this.channel = this.customFilter.channel;
        }
      },
    },
  },

  methods: {
    handleContentFilterChange() {
      this.$emit("customFilterChange", {
        content: this.content,
        channel: this.channel,
      });
    },

    handleChannelFilterChange() {
      this.$emit("customFilterChange", {
        content: this.content,
        channel: this.channel,
      });
    },

    handleClose() {
      this.isFiltersVisible = false;
    },

    handleOpen() {
      // console.log("oldFilter::", this.oldFilter);
      this.filter = cloneObject(this.oldFilter);
    },

    handleFilterCancel() {
      this.filter = this.$options.data().filter;
      this.$emit("filterChange", this.filter);
      this.filterConditionList = [];
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
    },

    handleOpenDrawer() {
      if (this.isConditionFilterDisabled) {
        return;
      }
      this.isFiltersVisible = true;
    },

    setChannelCascaderOptions() {
      const channel = this.filterOpionsData.find((item) => {
        return item.label === "渠道";
      });

      if (channel) {
        this.channelCascaderOptions = channel.choices;
      }
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
            this.setChannelCascaderOptions();
          }
        });
    },

    handleCommitFilterChange() {
      const isFilterValidPass = validEmptyFilterItem(this.filter.filters);
      if (!isFilterValidPass) {
        this.$message({
          message: "分析条件存在未设置的值,请设置后计算!",
          type: "info",
        });
        return;
      }

      this.isFiltersVisible = false;
      this.$emit("filterChange", this.filter);

      this.getFilterConditionList();

      this.oldFilter = this.filter;
    },

    handleFilterChange(data) {
      this.filter.filters = data;
    },

    handleApplyTime(data) {
      this.time = {
        type: data.type,
        start: data.start,
        end: data.end,
        recent_day: data.recent_day,
      };

      this.$emit("applyTime", this.time);
    },

    handleShare() {
      this.$emit("share");

      if (this.page === "dashbord") {
        //
      } else {
        //
      }
    },

    handleRefresh() {
      this.$emit("refresh");
    },
    handleDownload() {
      this.$emit("download");
    },
    handleConfigDashbord() {
      this.$emit("configDashbord");
    },
    handleEditDashbord() {
      this.$emit("editDashBord");
    },
    handleOpenReportList() {
      this.$emit("openReportList");
    },
  },
  created() {
    this.getFilterOptions();
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.drawer-container {
  height: 100%;
  position: relative;
  padding: 15px;

  .btn-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
  }
}

.btn-container {
  text-align: right;
}

.calendar-icon {
  margin-top: 4px;
  margin-left: 10px;
  color: #409eff;

  &.disabled {
    color: #c0c4cc;
  }
}

.filter-icon {
  margin-left: 10px;
}

.setting-icon-button {
  margin-left: 10px;
}

.toolbar {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #fff;
  color: $color-text;

  .left-content {
    flex: 0;
  }
  //右侧的内容去
  .right-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .right-left-section {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .title-wrapper {
        overflow: auto;

        .title {
          margin-left: 20px;
          font-size: 16px;
          font-weight: bold;
        }

        .el-icon-info {
          font-size: 14px;
          margin-left: 3px;
        }
      }

      .time-and-filters-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 20px;

        ::v-deep {
          .time-range-wrapper {
            .el-button--mini {
              padding: 0 7px;
            }
          }
        }

        .content-search {
          margin-left: 10px;
          width: 200px;

          ::v-deep {
            .el-input__inner {
              height: 30px;
              line-height: 30px;
            }
          }
        }

        .channel-filter {
          margin-left: 10px;
          ::v-deep {
            .el-input__inner {
              height: 30px;
              line-height: 30px;
            }
          }
        }

        .filter-selected-list {
          margin-left: 10px;
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
            height: 25px;
            overflow: hidden;

            .list-section {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              max-width: 400px;
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

        .cancel-btn {
          color: #42546d;
          font-size: 12px;
          padding: 10px;
          cursor: pointer;

          &:hover {
            color: $color-primary;
          }
        }
      }
    }

    .right-tools {
      flex: 0;
      margin-right: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      i {
        margin-left: 10px;
      }
    }
  }
}
</style>
