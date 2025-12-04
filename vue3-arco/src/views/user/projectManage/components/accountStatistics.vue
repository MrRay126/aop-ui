<template>
  <div class="account-statistic" :style="{ height: height + 'px' }">
    <div class="top-section">
      <el-button-group>
        <template v-for="(item, index) in channelList">
          <el-button
            size="small"
            :autofocus="index === 0"
            :key="index"
            :type="item.type"
            :disabled="isOperationsDisabled || item.disabled"
            @click="handleChannelChange(item)"
            >{{ item.title }}</el-button
          >
        </template>
      </el-button-group>

      <span class="tool-right">
        <time-calendar
          :isAutoTriggerApplyTimeEvent="false"
          :isTextTypeReference="false"
          :timeData="time"
          :disabled="isOperationsDisabled"
          @applyTime="handleTimeChange"
        >
          <template v-slot:calendar="{ data }">
            <div class="time">{{ data.labelValue }}</div>
          </template>
        </time-calendar>
        <span
          class="download"
          :class="{ disabled: isOperationsDisabled }"
          @click="handleDownloadClick"
        >
          <template v-if="downloading">
            <i class="el-icon-loading"></i>
          </template>
          <template v-else>
            <svg-icon
              icon-class="cloud-download"
              :disabled="isOperationsDisabled"
            ></svg-icon>
          </template>
        </span>
      </span>
    </div>
    <div class="chart-section">
      <template v-if="activeTab === 'acountData'">
        <line-chart
          v-loading="isLoadingChart"
          :height="400"
          :chartData="lineChartData"
          :showLegend="true"
        ></line-chart>
      </template>
    </div>
    <div class="table-section">
      <dynamic-table
        sortMode="single"
        :loading="isloadingTable"
        :height="500"
        :dimension="tableData.dimensions"
        :source="tableData.source"
        :filter="filter"
        :filterOptions="filterOptions"
        :pager="pager"
        :contentHandler="preDealTableContent"
        @getTableData="handleGetTableData"
      ></dynamic-table>
    </div>
  </div>
</template>
<script>
import { getChannelList } from "../data.js";
import timeCalendar from "@/views/components/time-range-calendar";
import lineChart from "@/views/components/charts/lineChart.vue";
import dynamicTable from "@/views/components/dynamicTable";

export default {
  props: {
    activeTab: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      default: 700,
    },
  },
  components: {
    timeCalendar,
    lineChart,
    dynamicTable,
  },
  data() {
    return {
      downloading: false,
      isloadingTable: false,
      isLoadingChart: false,
      tableData: {
        dimensions: [],
        source: [],
      },
      filter: {},

      filterOptions: {},
      search: {},
      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },

      lineChartData: {
        dimensions: [
          // "product", "2015"
        ],
        source: [
          // { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
          // { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
          // { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
          // { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
        ],
      },
      channelList: [],
      currentChannel: {},
      time: {
        type: "relative",
        recent_day: "1-7",
      },
    };
  },

  computed: {
    isOperationsDisabled() {
      return this.isLoadingChart || this.isloadingTable;
    },
  },

  methods: {
    async handleDownloadClick() {
      if (this.downloading || this.isOperationsDisabled) {
        return;
      }
      this.downloading = true;
      await this.download();
      this.downloading = false;
    },

    download() {
      // 下载分析详情数据
      const payload = {
        urlParams: { download_type: "accountStatisticTable" },
        data: {
          project_id: this.$store.getters.appId,
          channel: this.currentChannel.value,
          pager: this.pager,
          filter: this.filter,
          time: this.time,
        },
      };
      return this.$store
        .dispatch("download/downloadAnalysis", payload)
        .catch(() => {
          // noop
        })
        .finally(() => {});
    },

    // line chart数据
    getChartData() {
      this.isLoadingChart = true;
      this.lineChartData = this.$options.data().lineChartData;

      const payload = {
        project_id: this.$store.getters.appId,
        channel: this.currentChannel.value,
        time: this.time,
      };

      this.$store
        .dispatch("projectManage/getStatisticChartData", payload)
        .then((resData) => {
          if (resData) {
            this.lineChartData = resData; // dimensions & source
          }
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingChart = false;
        });
    },

    handleGetTableData(data) {
      this.filter = data.filter;
      this.pager = data.pager;
      this.search = data.search;
      this.getTableData();
    },

    //数据统计table
    getTableData() {
      this.tableData = this.$options.data().tableData;
      this.isloadingTable = true;
      const payload = {
        project_id: this.$store.getters.appId,
        channel: this.currentChannel.value,
        pager: this.pager,
        filter: this.filter,
        time: this.time,
      };

      this.$store
        .dispatch("projectManage/getStatisicTableData", payload)
        .then((resData) => {
          if (resData) {
            this.tableData = resData.results; // dimensions & source
            this.filterOptions = resData.filterOptions;
            this.pager.total = resData.pager.total;
          }
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isloadingTable = false;
        });
    },

    preDealTableContent(header, content) {
      return content;
    },

    // 改变渠道类型
    handleChannelChange(channel) {
      this.channelList.forEach((item) => {
        item.type = "plain";
      });
      channel.type = "primary";
      this.currentChannel = channel;

      this.getPageData();
    },

    getPageData() {
      this.getChartData();
      this.getTableData();
    },

    handleTimeChange(time) {
      this.time = time;
      this.getPageData();
    },
  },

  created() {
    this.channelList = getChannelList();
    this.currentChannel = this.channelList[0];
    this.getPageData();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.account-statistic {
  overflow: auto;

  .top-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
  }

  .tool-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .download {
    margin-left: 15px;
    width: 20px;
    height: 20px;

    &:not(.disabled):hover {
      color: $color-primary;
      cursor: pointer;
    }

    &:not(.disabled) {
      color: $color-text !important;
    }

    &.disabled {
      color: $color-disabled !important;
    }

    .svg {
      cursor: pointer;
      color: $color-text !important;
    }
  }

  .table-section {
    margin-top: 20px;
  }
}
</style>
