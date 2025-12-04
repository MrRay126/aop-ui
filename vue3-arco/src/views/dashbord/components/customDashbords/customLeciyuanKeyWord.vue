<template>
  <div class="custom-leciyuan-keyword" v-loading="loading">
    <!-- 过滤器区域 -->
    <div class="filter-container">
      <time-calendar
        :timeData="time"
        :isTextTypeReference="false"
        :isAutoTriggerApplyTimeEvent="false"
        @applyTime="handleTimeChange"
      ></time-calendar>
      <el-cascader
        placeholder="渠道筛选"
        :props="{
           multiple: true,
        }"
        size="mini"
        style="width: 300px"
        v-model="channel"
        clearable
        :collapse-tags="true"
        :options="channelCascaderOptions"
        @change="handleFilterChange"
      ></el-cascader>
      <el-select
        size="mini"
        v-model="keywords"
        multiple
        filterable
        allow-create
        clearable
        style="width: 60%"
        default-first-option
        placeholder="请输入关键词"
        @change="handleFilterChange"
      >
        <el-option
          v-for="item in keywordOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button icon="el-icon-search" size="mini" type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 统计卡片区域 -->
    <div class="statistics-container">
      <statistics-card
          v-loading="cardLoading"
        v-for="(item, index) in statisticsData"
        :key="index"
        :name="item.name"
        :value="item.value"
        statistics-class="statistics-item"
      ></statistics-card>
    </div>

    <!-- 热度折线图 -->
    <div class="chart-card">
      <div class="card-header">
        <span class="card-title">热度折线图</span>
      </div>
      <div class="card-body">
        <line-chart
            v-loading="trendLoading"
          :height="400"
          :chartData="trendChartData"
          :needShadowLine="true"
          :needSmoothLine="false"
          :hasLegend="true"
        ></line-chart>
      </div>
    </div>

    <!-- 帖子明细表格 -->
    <div class="table-card">
      <div class="card-header">
        <span class="card-title">帖子明细</span>
      </div>
      <div class="card-body">
        <dynamic-table v-if="!isViewXiaZuan"
          border
          :height="400"
          :dimension="tableDimension"
          :source="tableData"
          :pager="pager"
          :loading="isLoadingTable"
          @getTableData="handleGetTableData"
        ></dynamic-table>
        <div v-else class="xia-zuan-container">
          <div class="top-title">
            <span class="return-button" type="text" @click="handleReturnClick">
              返回</span
            >
            <span class="down-dimension-title"> / 下钻分析</span>
          </div>
          <div class="down-dimension">
            <xia-zuan-info
                ref="xiaZuanInfo"
                :viewConfigs="{
                wordChartHeight: 400,
                wordTableHeight: 400,
                spreadChartHeight: 415,
                spreadTableHeight: 415,
                isTimeLineVisible: false,
              }"
                :datas="{
                ...config,
                row: xiaZuanRow,
                project_id: $store.getters.appId,
              }"
            ></xia-zuan-info>
          </div>
        </div>
      </div>
    </div>

    <!-- 词云图 -->
    <div class="chart-card">
      <div class="card-header">
        <span class="card-title">词云图</span>
      </div>
      <div class="card-body">
        <hotPointCard
            :show-top="false"
          :cardData="hotPointData"
        ></hotPointCard>
      </div>
    </div>
  </div>
</template>
<script>
import TimeCalendar from "views/components/time-range-calendar/index.vue";
import recentDay from "@/utils/timeData";
import { fitListData } from "views/components/filters/data";
import lineChart from "@/views/dashbord/components/customDashbords/components/leciyuanTrendLine.vue";
import wordCloudChart from "@/views/components/charts/wordCloudChart.vue";
import dynamicTable from "@/views/components/dynamicTable";
import statisticsCard from "@/views/dashbord/components/statistics.vue";
import request from "@/utils/request.js";
import xiaZuanInfo from "views/components/xiaZuan/info.vue";
import hotPointCard  from "views/dashbord/components/hotPointCard.vue";
import {uuid} from "@/utils";

export default {
  props: {
    dashboard: {
      type: Object,
      default() {
        return { id: 0, dashbordPerms: {} };
      },
    },
    configs: {
      type: Object,
      default: () => {
        return {};
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    xiaZuanInfo,
    TimeCalendar,
    lineChart,
    dynamicTable,
    statisticsCard,
    hotPointCard,
  },
  data() {
    return {
      channel: [],
      keywords: [],
      cardLoading : false,
      trendLoading : false,
      keywordOptions: [
      ],
      channelCascaderOptions: [],
      time: {
        type: "relative",
        start: recentDay["1-31"].start,
        end: recentDay["1-31"].end,
        recent_day: "1-31",
      },
      xiaZuanRow: {},
      isViewXiaZuan: false,
      filter: {
        value: "",
        filters: {
          relTag: "and",
          children: [],
        },
      },
      // 统计数据
      statisticsData: [
        { name: "发帖量", value: 0 },
        { name: "转发量", value: 0 },
        { name: "评论量", value: 0 },
        { name: "点赞量", value: 0 },
      ],
      // 趋势图表数据
      trendChartData: {
        dimensions: ["time", "转发", "评论", "点赞", "互动热度"],
        source: [],
      },
      // 表格数据
      tableData: [],
      isLoadingTable: false,
      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
      tableDimension: [
        {
          label: "内容",
          prop: "content",
          minWidth: "300px",
        },
        {
          label: "发布时间",
          prop: "publishTime",
          width: "180px",
        },
        {
          label: "转发数",
          prop: "repostsCount",
          width: "100px",
        },
        {
          label: "评论数",
          prop: "commentsCount",
          width: "100px",
        },
        {
          label: "点赞数",
          prop: "attitudesCount",
          width: "100px",
        },
        {
          label: "操作",
          width: "200px",
          isActionColumn: true,
          actionType: "button",
          actions: [
            {
              name: "jumpOriginalArticleLink", // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
              loadingRowTag: "", // 操作过程自动loading设置任意值
              //函数或字符串
              label: "跳转原文",

              ifShow(row) {
                // this指向dynamic-table的父组件
                return true;
              },

              ifDisabled(row) {
                // this指向dynamic-table的父组件
                return false;
              },

              action(row) {
                // this指向dynamic-table的父组件
                return this.handleJumpLink(row);
              },
            },

            {
              name: "downdimension", // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
              loadingRowTag: "", // 操作过程自动loading设置任意值
              //函数或字符串
              label: "下钻分析",

              ifShow(row) {
                // this指向dynamic-table的父组件
                return true;
              },

              ifDisabled(row) {
                // this指向dynamic-table的父组件
                return false;
              },

              action(row) {
                // this指向dynamic-table的父组件
                return this.handleDowndimension(row);
              },
            },
          ],
        },
      ],
      // 词云数据
      hotPointData: {},
      tableOptionsData: [],
      filterOpionsData: [],
      filterValueComponentConfig: {},
    };
  },

  methods: {
    handleReturnClick() {
      this.isViewXiaZuan = false;
    },
    handleTimeChange(data) {
      this.time = {
        type: data.type,
        start: data.start,
        end: data.end,
        recent_day: data.recent_day,
      };
    },

    handleFilterChange() {
      // 过滤条件改变，可以在这里处理
    },

    handleSearch() {
      // 获取所有数据（使用Mock数据）
      this.getStatistics();
      this.getTrendData();
      this.getTableData();
      this.getWordCloudData();
    },
    getData(url){
      const body = {
        time: this.time,
          keywords: this.keywords,
        project_id: 7,
        pager: this.pager,
      }
      if (this.channel.length > 0){
        body.filters = this.buildFilter(this.channel);
      }
      return request({
        url: url,
        method: "post",
        data: body,
      })
    },
    // 获取统计数据（Mock）
    getStatistics() {
      this.cardLoading = true;
      this.getData(
        "/api/lcy-keyword/statistics"
      ).then((res) => {
        this.statisticsData = res.data.data;
        this.cardLoading = false;
      }).catch((err) => {
        this.cardLoading = false;
      });
    },

    // 获取趋势数据（Mock）
    getTrendData() {
      this.getData( "/api/lcy-keyword/trend"
      ).then((res) => {

        this.trendChartData = res.data.data;
        this.trendLoading = false;
      }).catch((err) => {
        this.trendLoading = false;
      });
    },
    handleJumpLink(row) {
      if (row.link) {
        window.open(row.link);
      }
    },
    handleDowndimension(row) {
      this.isViewXiaZuan = true;
      this.xiaZuanRow = row;
    },

    // 获取表格数据（Mock）
    getTableData() {
      this.isLoadingTable = true;
      this.isLoadingTable = true;
      this.getData(
          "/api/lcy-keyword/contents"
      ).then((res) => {
        this.tableData = res.data.data.list;
        this.pager.total = res.data.data.pager.total;
        this.isLoadingTable = false;
      }).catch((err) => {
        this.isLoadingTable = false;
      });
    },
    buildFilter(pairs) {

      return {
        relTag: "or",
        children: pairs.map(([channel, content_type]) => ({
          relTag: "and",
          children: [
            {
              id: uuid(),
              key: "channel",
              relation: "eq",
              value: channel
            },
            {
              id: uuid(),
              key: "content_type",
              relation: "eq",
              value: content_type
            }
          ]
        }))
      }
    },
    getWordCloudData() {
      const body = {
        time: this.time,
        project_id: 7,
        aop_type: "hotPoint",
        filters:
            {
              "relTag": "and",
              "children": [
              ]
            }
      }
      if (this.keywords.length > 0){

        body.filters.children.push(
            {
              "relTag": "or",
              "children": [

              ]
            }
        )
        this.keywords.forEach(item => {
          body.filters.children[0].children.push(
              {
                "id": uuid(),
                "key": "content",
                "relation": "like",
                "value": item
              }
          )
        })
      }
      if (this.channel.length > 0){

        body.filters.children.push(
            this.buildFilter(this.channel)
        )
      }
      request(
          {
            url: "/api/ds/query",
            method: "post",
            data: body,
          }
      ).then((res) => {
        this.hotPointData = {...res.data?.data, configs: body}
      }).catch(
          {

          }
      )

    },

    // 生成随机日期时间

    handleGetTableData(event) {
      if (event && event.pager) {
        this.pager = event.pager;
      }
      this.getTableData();
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

    setChannelCascaderOptions() {
      const channel = this.filterOpionsData.find((item) => {
        return item.label === "渠道";
      });

      if (channel) {
        this.channelCascaderOptions = channel.choices;
      }
    },
  },
  computed: {
    config() {
      return {
        time: this.time,
        dashbordFilters: {
          keywords: this.keywords,
          channel: this.channel
        },

      }
    },
  },

  created() {
    this.getFilterOptions();
    // 初始化时加载Mock数据
    this.$nextTick(() => {
      this.handleSearch();
    });
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.custom-leciyuan-keyword {
  background: white;
  height: 100%;
  overflow: auto;
  padding: 20px;

  .filter-container {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .statistics-container {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    .statistics-item {
      flex: 1;
      height: 100px;

      ::v-deep .statistics-card {
        height: 100%;
      }

      ::v-deep .statistics-content {
        padding: 20px 0;
      }

      ::v-deep .statistics-label {
        font-size: 14px;
        margin-bottom: 8px;
      }

      ::v-deep .statistics-value {
        font-size: 24px;
      }
    }
  }

  .chart-card,
  .table-card {
    background: white;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 20px;

    .card-header {
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        font-size: 16px;
        font-weight: 500;
        color: $color-text;
      }
    }

    .card-body {
      padding: 20px;
    }
  }
}
.xia-zuan-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  flex-direction: column;

  .top-title {
    .return-button {
      font-size: 14px;
      cursor: pointer;
      color: $color-text;
      &:hover {
        color: $color-primary;
      }
    }
    .down-dimension-title {
      font-size: 14px;
      color: $color-text;
    }
  }

  .down-dimension {
    overflow: auto;
  }

  ::v-deep {
    .info {
      background-color: #fff;
      height: calc(100%);
      padding-top: 0;
      overflow: initial;

      .page {
        background-color: #fff;
      }

      .left {
        padding-top: 0;
      }

      .anylysis-section {
        height: calc(100% - 60px);
      }
    }

    .more-contents-table-container {
      padding: 0;
    }

    .top-path {
      padding-top: 8px;
    }

    .btns-container {
      display: none;
    }

    .cloud-chart {
      min-height: initial;
    }
  }
}
</style>
