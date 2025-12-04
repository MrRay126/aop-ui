<template>
  <div class="trend" v-loading="isLoadingReportConfigs">
    <template v-if="!isViewXiaZuan">
      <template v-if="isViewInfos">
        <toolbar
          :isDashbord="false"
          :title="pageTitle"
          :comment="comment"
          :downloading="isDownloadingMain"
          :disabledSettings="{
            refresh: !alreadyCalculated,
            download: !alreadyCalculated,
          }"
          :isUseShareBtn="true"
          @refresh="handleRefresh"
          @download="handleDownload"
          @openReportList="handleOpenReportList"
          @share="handleShare"
        >
        </toolbar>
        <div class="main-section-outer-wrapper">
          <main-section>
            <template #left>
              <div class="left-section">
                <div class="content-section">
                  <div class="top">
                    <filter-and-collector
                      ref="filterAndCollector"
                      :filters="filter.filters"
                      :filterOpionsData="filterOpionsData"
                      :filterValueComponentConfig="filterValueComponentConfig"
                      @action="handleFilterAndCollectorAction"
                    ></filter-and-collector>
                  </div>
                  <div class="bottom">
                    <el-divider content-position="center"
                      ><span class="divide-line-text">分组项</span></el-divider
                    >
                    <div class="groupper-wraper">
                      <groupper
                        operateBtnTitle="添加分组项"
                        valueComponent="tabSelect"
                        anylysis="trend"
                        v-model="groupper"
                        :limit="5"
                        :options="groupperOptions"
                        :disabledOptions="groupper"
                        @change="handleGroupperChange"
                      ></groupper>
                    </div>
                  </div>
                </div>
                <div class="operate-btns-container">
                  <el-popover
                    v-model="isCollectPopoverVisible"
                    placement="top-start"
                    title="收藏筛选条件"
                    width="300"
                    trigger="manual"
                  >
                    <template>
                      <el-input
                        placeholder="请输入"
                        size="mini"
                        v-model="collectName"
                      ></el-input>
                      <div class="btn-container">
                        <el-button size="mini" @click="handleCancelCollect"
                          >取消</el-button
                        >
                        <el-button
                          size="mini"
                          type="primary"
                          @click="handleCommitCollect"
                          >收藏</el-button
                        >
                      </div>
                    </template>
                    <el-button
                      style="margin-right: 10px"
                      slot="reference"
                      @click="handleCollectFilterBtn"
                      :loading="isCollectting"
                      :disabled="isCalculating || !alreadyCalculated"
                      >收藏</el-button
                    >
                  </el-popover>

                  <template v-if="pageMode === 'edit'">
                    <template v-if="operationPerms.includes(commands.saveAs)">
                      <el-button
                        :disabled="isCalculating || !alreadyCalculated"
                        @click="handleSaveAction(commands.saveAs)"
                        type="plain"
                        >另存为</el-button
                      >
                    </template>
                    <template v-if="operationPerms.includes(commands.update)">
                      <el-button
                        :disabled="isCalculating || !alreadyCalculated"
                        @click="handleSaveAction(commands.update)"
                        type="plain"
                        >更新报表</el-button
                      >
                    </template>
                  </template>

                  <template v-if="pageMode === 'view'">
                    <el-button
                      :disabled="isCalculating || !alreadyCalculated"
                      @click="handleSaveAction(commands.save)"
                      type="plain"
                      >保存报表</el-button
                    >
                  </template>

                  <el-button
                    @click="handleCalculate"
                    type="primary"
                    :loading="isCalculating"
                    >计算</el-button
                  >
                </div>
              </div>
            </template>
            <template #right>
              <div class="right-section">
                <div class="top-tools">
                  <time-calendar
                    :timeData="{ ...time, ...particle }"
                    :isTextTypeReference="false"
                    :isAutoTriggerApplyTimeEvent="true"
                    :unitOptions="unitOptions"
                    unitComponent="unitSelector"
                    @applyTime="handleApplyTime"
                    @unitChange="handleUnitChange"
                  >
                  </time-calendar>
                  <!-- <div class="hot-paste-mode">
                  <el-switch v-model="isHotPasteOpend"></el-switch>
                  <span class="title"
                    >热帖模式
                    <el-tooltip
                      effect="light"
                      placement="top-start"
                      content="同步显示时间点内热门的帖子（当前仅支持微博、B站及TapTap)"
                    >
                      <i class="el-icon-info"></i> </el-tooltip
                  ></span>
                </div> -->
                </div>
                <div class="bottom-container">
                  <template v-if="isCalculating || isErrorOccured">
                    <div class="stepper-wrapper">
                      <stepper
                        :stepNumber="activeStep"
                        :isErrorOccured="isErrorOccured"
                      ></stepper>
                    </div>
                  </template>
                  <template v-else-if="hasData">
                    <div class="chart-container">
                      <div class="chart-section">
                        <template
                          v-if="trendData.chartData.source.length === 0"
                        >
                          <span class="no-data-text">暂无数据</span>
                        </template>
                        <line-chart
                          ref="trendLineChart"
                          :height="450"
                          :chartData="trendData.chartData"
                          :hotModeOpened="isHotPasteOpend"
                        ></line-chart>
                      </div>
                    </div>
                    <div class="table-container">
                      <div class="top">
                        <el-input
                          v-model="searchText"
                          @input="handleSearchChange"
                          :clearable="true"
                          class="filter-input"
                          size="mini"
                          placeholder="筛选分组项"
                        >
                          <template slot="append">
                            <i class="el-icon-search" @click="getTableData"></i>
                          </template>
                        </el-input>
                      </div>
                      <dynamic-table
                        :height="500"
                        :dimension="trendData.table.dimension"
                        :source="trendData.table.source"
                        :filter="trendData.table.filter"
                        :filterOptions="trendData.table.filterOptions"
                        :pager="trendData.table.pager"
                        :loading="isLoadingTable"
                        sortMode="single"
                        @getTableData="handleGetTableData"
                        @rowClick="handleRowClick"
                      ></dynamic-table>
                    </div>
                  </template>
                  <template v-else>
                    <el-empty
                      class="empty-element"
                      description="暂无数据"
                      :image-size="120"
                    ></el-empty>
                  </template>
                </div>
              </div>
            </template>
          </main-section>
        </div>
      </template>
      <template v-else>
        <!-- 数据详情 -->
        <div class="more-contents-table-container">
          <template>
            <div class="detail-top">
              <span class="top-path">
                <span class="path-pre" @click="handleBackToPage">趋势分析</span>
                <span> / </span>
                <span style="font-weight: bold">{{ detailOwnerName }}</span>
                <span> 的</span>
                <span>数据详情</span>
                <span> ( </span>
                <span>分析时间 </span>
                <span>{{ detailView.header.prop }}</span>
                <span> )</span>
              </span>

              <span class="btns-container">
                <span style="margin-right: 10px">
                  <ai-summary
                    :configs="{
                      ...getParams(),
                      type: OpinionType.trend,
                    }"
                  ></ai-summary>
                </span>
                <el-button
                  class="refresh-btn"
                  @click="handleRefreshDetail"
                  type="text"
                  icon="el-icon-refresh"
                ></el-button>
                <el-button
                  @click="handleDownloadDetail"
                  type="text"
                  icon="el-icon-download"
                  :loading="isDownloadingDetail"
                ></el-button>
              </span>
            </div>
          </template>

          <div class="detail-table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                trend_filter: trendFilter,
                project_id: $store.getters.appId,
                filters: filter.filters,
                value: filter.value,
                groups: groupper,
                time: time,
                time_unit: particle,
              }"
              apiAction="trend/getDetailTableData"
              @event="handleDetailTableEvent"
            ></detail-table>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="xia-zuan-info">
        <div class="top-buttons">
          <el-button @click="handleXiaZuanReturn" type="text">
            &lt;返回
          </el-button>
          <el-button
            type="text"
            class="el-icon-download"
            :loading="isDownloadingXiazuan"
            @click="handleXiaZuanDownload"
          ></el-button>
        </div>
        <div class="xiazuan-container">
          <xia-zuan-info
            ref="xiaZuanInfo"
            :datas="{
              time,
              row: xiaZuanRow,
              project_id: $store.getters.appId,
            }"
          ></xia-zuan-info>
        </div>
      </div>
    </template>

    <save-report
      :visible="isSaveDialogVisible"
      @close="handleCloseSaveDialog"
      @saved="handleReportSaved"
      :mode="dialogMode"
      :reportData="reportData"
    >
    </save-report>

    <el-drawer
      title="已存报表"
      direction="rtl"
      size="400px"
      :visible.sync="isReprotsDrawerVisible"
      v-loading="isLoadingReprorts"
      @open="handleReportsDrawerOpen"
      class="reports-drawer"
    >
      <reports-list-pannel
        mode="view"
        :reportType="OpinionType.trend"
        :isListDragable="false"
        :listData="reportsListData"
        @cancel="handleReportListCancel"
      ></reports-list-pannel>
    </el-drawer>
  </div>
</template>
<script>
import detailTable from "@/views/components/anylysisDetailTable";
import toolbar from "@/views/components/toolbar";
import mainSection from "@/views/components/mainSection";
//时间单位组件
import timeCalendar from "@/views/components/time-range-calendar";
import lineChart from "@/views/components/charts/trendLineChart.vue";
import groupper from "@/views/components/groupper";
import stepper from "@/views/components/stepper";
import saveReport from "@/views/components/saveReport";
import { commands } from "@/views/components/saveReport/data.js";

import numeral from "numeral";
import { validEmptyFilterItem } from "@/views/components/filters/data.js";

import recentDay from "@/utils/timeData.js";

import { OpinionType } from "@/views/dashbord/data";
import reportsListPannel from "@/views/dashbord/components/reportsListPannel.vue";
import dynamicTable from "@/views/components/dynamicTable";
import { getTimeUnitOptions } from "./utils";

import { anylysisMixin } from "@/views/mixins/anylysis.js";
import { filterCollectMixins } from "@/views/mixins/filterAndCollect.js";
import filterAndCollector from "@/views/components/filterAndCollector";
import aiSummary from "@/views/components/aiSummary";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  mixins: [anylysisMixin, filterCollectMixins],

  components: {
    toolbar,
    mainSection,
    timeCalendar,
    lineChart,
    groupper,
    stepper,
    saveReport,
    reportsListPannel,
    dynamicTable,
    detailTable,
    filterAndCollector,
    aiSummary,
    xiaZuanInfo,
  },
  data() {
    return {
      isViewXiaZuan: false,
      isDownloadingXiazuan: false,

      operationPerms: [], // save: 保存 , saveAs:另存为
      isDownloadingMain: false,
      isDownloadingDetail: false,
      isHotPasteOpend: false,
      unitOptions: [],
      trendFilter: {},

      detailView: {
        // row
        // prop
      },

      searchText: "",
      isViewInfos: true,
      // 标识当前报表是否已经计算过(计算过的没问题 可以更新 另存等操作)
      alreadyCalculated: false,
      OpinionType,
      isLoadingReprorts: false,
      reportsListData: [],
      isReprotsDrawerVisible: false,
      //保存报表参数
      commands,
      isSaveDialogVisible: false,
      dialogMode: commands.save,
      reportData: null, //回显数据 {title:'',comment:'',...}

      pageMode: "view", // view:正常查看状态 , edit:编辑状态(携带id回来)
      // reportId: null,

      pageTitle: "趋势分析",
      comment: "分析某段时间内，某类或多类话题的整体趋势情况。",

      isLoadingReportConfigs: false,

      time: {
        type: "relative", // absolute|relative 绝对时间|相对时间
        start: recentDay["1-7"].start, //开始时间字符串
        end: recentDay["1-7"].end, //结束时间字符串
        recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      },

      particle: {
        unit: "day",
        value: 1,
        weekStart: 0,
      },

      isCalculating: false,
      hasData: false,
      activeStep: 0,
      isErrorOccured: false,

      tableOptionsData: [], //过滤器列表数据

      groupper: [
        // { value: "author", category: "common" },
        // { value: "w1", category: "word" },
      ],

      // 初始数据
      groupperOptions: [],
      groupperDisabledOptions: [],

      trendData: {
        chartData: {
          dimension: [
            // "time", "武器-内容量", "角色-内容量"
          ],
          source: [
            // {
            //   time: "2022-12-28T12:30:20",
            //   "武器-内容量": 43.3,
            //   "角色-内容量": 85.8,
            // },
          ],
        },

        table: {
          dimension: [],
          source: [],
          pager: {
            curPage: 1,
            pageSize: 10,
            total: 0,
          },
          search: "",
          filter: {},
          filterOptions: {},
        },
      },
      isLoadingTable: false,
    };
  },
  computed: {
    // 获取点击行的所有分组的名称,使用 - 连接
    detailOwnerName() {
      let names = [];
      const row = this.detailView.row || {};
      const demension = this.trendData.table.dimension;

      let groupProps = demension
        .filter((item) => {
          return item.contentType === "group";
        })
        .map((item) => {
          return item.prop;
        });
      names = groupProps.map((propItem) => {
        return `${row[propItem] || ""}`;
      });
      return names.join("-");
    },
  },
  watch: {
    //监听app改变后初始化页面
    "$store.getters.appId": {
      handler(val, oldVal) {
        const isUserChangeProject = typeof oldVal === "number";
        if (isUserChangeProject) {
          this.resetQueryData();
          this.getFilterOptions();

          this.pageMode = "view";
          this.pageTitle = this.$options.data().pageTitle;

          //去除路由id
          const routerId = Number(this.$route.query.id);
          if (routerId) {
            this.$router.replace({
              path: window.aop[OpinionType.theme],
            });
          }
        }
      },
    },
  },

  methods: {
    handleXiaZuanReturn() {
      this.isViewXiaZuan = false;
    },

    handleDetailTableEvent({ action, data }) {
      if (action === "xiaZuan") {
        this.isViewXiaZuan = true;
        this.xiaZuanRow = data;
      }
    },

    handleXiaZuanDownload() {
      this.isDownloadingXiazuan = true;
      const payload = {
        urlParams: { download_type: "kol" },
        project_id: this.$store.getters.appId,
        data: null,
      };

      const params = this.$refs["xiaZuanInfo"]._getDownloadConfigs();

      payload.data = { ...params.configs, isViewDetail: params.isViewDetail };
      payload.data.xiaZuan = true;

      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloadingXiazuan = false;
      });
    },

    handleRefreshDetail() {
      this.$refs["detailTable"].getTableData();
    },

    handleDownloadDetail() {
      this.isDownloadingDetail = true;
      const payload = {
        urlParams: { download_type: "trend_detail" },
        data: { ...this.$refs["detailTable"].getParams() },
      };
      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloadingDetail = false;
      });
    },

    cancelDownload() {
      if (this.isDownloadingDetail || this.isDownloadingMain) {
        this.$store.dispatch("download/stopDownloadAnalysis").catch(() => {
          //noop
        });
      }
    },

    handleDownload() {
      this.isDownloadingMain = true;

      const payload = {
        urlParams: { download_type: "trend" },
        data: {
          ...this.getParams(),
          search: this.searchText,
          pager: this.trendData.table.pager,
          tableFilter: this.trendData.table.filter,
        },
      };

      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloadingMain = false;
      });
    },

    handleSearchChange() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getTableData();
      }, 300);
    },

    handleBackToPage() {
      this.isViewInfos = true;
    },

    handleGetTableData(data) {
      this.trendData.table.pager = data.pager;
      this.trendData.table.filter = data.filter;
      this.getTableData();
    },

    getTableData() {
      const payload = {
        ...this.getParams(),
        search: this.searchText,
        pager: this.trendData.table.pager,
        tableFilter: this.trendData.table.filter,
      };

      this.isLoadingTable = true;

      this.trendData.table = this.$options.data().trendData.table;
      this.$store
        .dispatch("trend/getDimensionTable", payload)
        .then((res) => {
          for (let prop in this.trendData.table) {
            this.trendData.table[prop] = res[prop];
          }
          this.trendData.table.filter = res.filter;

          const dimension = this.trendData.table.dimension;
          this.trendData.table.demension = dimension.map((dItem) => {
            if (dimension.length < 20) {
              dItem.width = "";
              dItem.minWidth = "130px";
            }
            return dItem;
          });
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingTable = false;
        });
    },

    handleRowClick(data) {
      if (!this.alreadyCalculated) {
        this.$message({
          message: "请点击计算后查看数据详情!",
          type: "info",
        });
        return;
      }
      const { row, header } = data;
      const prop = header.prop;

      if (header.contentType === "data") {
        if (!row[prop]) {
          return;
        }
        this.isViewInfos = false;
        this.detailView = data;

        // 编辑数据中的trend_filter,并回传

        this.trendFilter = row.trend_filter;
        this.trendFilter.time = prop;

        this.isDetailXiaZuan = true;
      }
    },

    handleReportListCancel() {
      this.isReprotsDrawerVisible = false;
    },

    handleOpenReportList() {
      this.isReprotsDrawerVisible = true;
      this.handleReportsDrawerOpen();
    },

    handleReportsDrawerOpen() {
      this.isLoadingReprorts = true;
      this.$store
        .dispatch("dashbord/getViewDataList", {
          project_id: this.$store.getters.appId,
        })
        .then((data) => {
          if (data) {
            this.reportsListData = data;
          }
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingReprorts = false;
        });
    },

    handleReportSaved(payload) {
      // console.log("payload:", payload);
      // 替换显示标题
      if (payload.action === commands.update) {
        this.pageTitle = payload.name;
        this.comment = payload.comment;
      }
    },

    handleSaveAction(action) {
      this.isSaveDialogVisible = true;
      this.dialogMode = action;

      if (action === "update" || action === "saveAs") {
        this.reportData = {
          project_id: this.$store.getters.appId,
          id: this.reportId,
          name: this.pageTitle,
          comment: this.comment,
          type: OpinionType.trend,
          action, // 保存 另寻为 更新

          configs: {
            ...this.getParams(),
            table: this.getTableParams(),
          },
        };
      }

      if (action === "save") {
        this.reportData = {
          project_id: this.$store.getters.appId,
          id: null,
          name: "",
          comment: "",
          type: OpinionType.trend,
          action,

          configs: {
            ...this.getParams(),
            table: this.getTableParams(),
          },
        };
      }
    },

    //报表的初始化显示
    initReportShow(id) {
      if (id) {
        this.getReportConfigById(this.reportId, () => {
          this.unitOptions = getTimeUnitOptions(this.time);
          this.handleCalculate();
        });
      }
    },

    //api 获取报表配置并设置在页面
    getReportConfigById(id, cb) {
      this.isLoadingReportConfigs = true;
      this.$store
        .dispatch("reports/getReportConfigById", {
          id,
          project_id: this.$store.getters.appId,
        })
        .then((data) => {
          this.time = data.configs.time;
          this.particle = data.configs.time_unit;
          this.filter.filters = data.configs.filters;
          this.filter.value = data.configs.value;
          this.groupper = data.configs.groups;
          this.pageTitle = data.name;
          this.comment = data.comment;

          this.searchText = data.configs.table?.search || "";
          this.trendData.table.pager =
            data.configs.table?.pager || this.$options.data().pager;

          this.trendData.table.filter =
            data.configs.table?.filter || this.$options.data().filter;

          this.operationPerms = data.perms || [];

          if (typeof cb === "function") {
            cb();
          }
        })
        .catch((err) => {
          // noop
          console.error(err);
        })
        .finally(() => {
          this.isLoadingReportConfigs = false;
        });
    },

    handleCloseSaveDialog() {
      this.isSaveDialogVisible = false;
    },

    resetQueryData() {
      this.hasData = false;
      const data = this.$options.data();

      this.time = data.time;
      this.particle = data.particle;

      this.filter = data.filter;
      this.groupper = data.groupper;
      this.trendData = data.trendData;
    },

    handleRefresh() {
      this.getPageData();
    },

    handleApplyTime(data) {
      this.time = {
        type: data.type,
        start: data.start,
        end: data.end,
        recent_day: data.recent_day,
      };

      this.unitOptions = getTimeUnitOptions(this.time);
      this.particle = {
        ...this.particle,
        // unit: this.unitOptions[0].unit,
      };
    },

    handleUnitChange(val) {
      this.particle = val;
    },

    handleGroupperChange() {
      this.alreadyCalculated = false;
    },

    numeral(...args) {
      return numeral(...args);
    },

    handleTimeChange(val) {
      this.time = val;
    },

    getParams() {
      return {
        project_id: this.$store.getters.appId,
        filters: this.filter.filters,
        value: this.filter.value,
        time: this.time,
        time_unit: this.particle,

        groups: this.groupper.map((item) => {
          return { value: item.value, category: item.category };
        }),
      };
    },

    validParams() {
      let validPass = true;
      let msg = "";
      //验证groupper不许存在重复项
      if (this.groupper.length > 1) {
        const groupValues = this.groupper.map((item) => {
          return item.value;
        });

        const len = this.groupper.length;
        const set = new Set(groupValues);

        if (set.size !== len) {
          validPass = false;
          msg = "分组项的值不能重复!";
        }
      }

      if (!validPass) {
        this.$message({
          type: "warning",
          message: msg,
        });
      }
      return validPass;
    },

    // 维度表的相关参数
    getTableParams() {
      return {
        search: this.trendData.table.search,
        pager: this.trendData.table.pager,
        filter: this.trendData.table.filter,
      };
    },

    //获取面板数据
    async getPageData() {
      const predealStatus = 0; // 预处理
      const workingStatus = 1; //计算中
      const finishedStatus = 3; //计算完成 设置为3 使步骤条变成对号状态 否则设置为2为黑色焦点状态

      let payload = this.getParams();
      payload.click = 1; // 周报表打点参数

      let resData = {};
      try {
        this.isCalculating = true;
        this.alreadyCalculated = false;
        resData = await this.$store.dispatch("trend/getTrendData", payload);
      } catch (err) {
        this.isErrorOccured = true;
        this.isCalculating = false;
        return;
      }

      if (resData.status === 1) {
        this.activeStep = predealStatus;
        //获取数据
        setTimeout(() => {
          this.getPageData();
        }, 2000);
      }

      if (resData.status === 2) {
        this.activeStep = workingStatus;
        //获取数据
        setTimeout(() => {
          this.getPageData();
        }, 2000);
      }

      if (!resData.status || resData.status === 3) {
        this.activeStep = finishedStatus; //设置

        setTimeout(() => {
          this.isCalculating = false;
          this.alreadyCalculated = true;
          const data = resData;
          this.hasData = !!data; //设置是否有数据; 不一定有数据显示
          this.trendData.chartData = data.chartData;

          this.getTableData();
        }, 200);
      }
    },

    initSteper() {
      this.isErrorOccured = false;
      this.activeStep = 0;
      this.isCalculating = true;
      this.hasData = false;
    },

    //计算报表
    handleCalculate() {
      const isFilterValidPass = validEmptyFilterItem(this.filter.filters);
      if (!isFilterValidPass) {
        this.$message({
          message: "分析条件存在未设置的值,请设置后计算!",
          type: "info",
        });
        return;
      }

      const validPass = this.validParams();
      if (!validPass) return;

      this.initSteper();
      this.getPageData();
    },

    /**
     * 页面初始化逻辑

    1 路由参数改变时初始化
    2 create时初始化
    3 同时app改变时需要将页面初始化到最初状态 避免与上诉冲突

   */

    async initEditReport(router) {
      this.isLoadingReportConfigs = true;
      await this.getFilterOptions();
      this.reportId = router.query["id"] || null;
      if (this.reportId) {
        this.initReportShow(this.reportId);
        this.pageMode = "edit";
      } else {
        this.isLoadingReportConfigs = false;
      }
    },
  },

  created() {
    this.initEditReport(this.$route);
  },

  beforeRouteUpdate(to, from, next) {
    this.initEditReport(to);
    next();
  },

  beforeDestroy() {
    this.cancelDownload();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";

.xia-zuan-info {
  width: 100%;
  height: calc(100% - 10px);
  overflow: hidden;

  .top-buttons {
    width: 100%;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 5px solid #f5f5f5;
  }

  .xiazuan-container {
    height: calc(100% - 45px);
  }
}

.btn-container {
  padding: 10px;
  text-align: right;
}

.trend {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;

  .hot-paste-mode {
    font-size: 14px;
    margin-left: 10px;

    .title {
      margin: 0px 5px 0px 10px;
      color: $color-text;
    }
  }

  .reports-drawer {
    ::v-deep(.data-view-panel .title) {
      display: none;
    }

    ::v-deep(.data-view-panel) {
      width: 100%;
    }
  }

  .more-contents-table-container {
    height: 100%;
    width: 100%;
    padding: 15px;

    ::v-deep(.more-contents-table-row) {
      cursor: pointer;
    }

    .detail-table-container {
      height: calc(100% - 30px);
    }

    .pagination-container {
      margin-top: 15px;
      text-align: center;

      .pagination {
        display: inline-block;
      }
    }

    .detail-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .top-path {
        text-align: left;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-top: 20px;
        font-size: 14px;
        color: $title-text-color;

        .path-pre {
          color: $color-desc;
          cursor: pointer;
        }
      }

      .btns-container {
        margin-right: 10px;
      }
    }
  }
  .main-section-outer-wrapper {
    width: 100%;
    height: calc(100% - 50px);
    flex: 1;
    background: $background-color;

    .left-section {
      position: relative;
      width: 400px;
      height: 100%;
      background: #fff;
      overflow: auto;
      padding: 10px;

      // .left-section-inner {
      // height: 100%;

      $btnsContainerHeight: 60px;

      .operate-btns-container {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: $btnsContainerHeight;
        text-align: right;
        padding-right: 20px;
      }

      .content-section {
        height: calc(100% - $btnsContainerHeight - 10px);
        overflow-y: auto;

        .top {
          min-height: 50%;
          $shallow-color-text: #8395ad;
          $color-primary: #2d8cf0;
          padding-top: 10px;

          .selector-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            & > span {
              margin-left: 5px;
            }

            .deng-icon {
              margin-right: 5px;
              color: $shallow-color-text;
            }

            .add-filter-icon {
              margin-left: 5px;
              color: $shallow-color-text;
              cursor: pointer;

              &:hover {
                color: $color-primary;
              }
            }
          }
        }

        .bottom {
          display: flex;
          font-size: 14px;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          min-height: 50%;

          .groupper-wraper {
            padding-left: 10px;
          }

          .divide-line-text {
            color: #ccc;
          }

          .title {
            padding-left: 10px;
            display: flex;
            font-size: 14px;
            justify-content: flex-start;
            align-items: center;
            color: $color-primary;
          }

          .title-text {
            margin-left: 5px;
          }
          cursor: pointer;
        }
      }

      // }
    }
    .right-section {
      width: 100%;
      height: 100%;
      background: #fff;
      // overflow: auto;

      .top-tools {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 20px;
      }

      .bottom-container {
        padding: 20px;
        padding-top: 0;
        text-align: left;
        height: calc(100% - 70px);
        overflow: auto;
        position: relative;

        .table-container {
          .top {
            margin-bottom: 10px;

            .el-icon-search {
              cursor: pointer;
            }

            .filter-input {
              width: 200px;
            }
          }
        }

        .empty-element {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -70%);
        }

        .stepper-wrapper {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50%;
          min-width: 300px;
        }

        .color-red {
          color: red;
        }

        .color-green {
          color: #52c51d;
        }

        .chart-container {
          text-align: left;

          .title {
            font-size: 16px;
          }

          .chart-section {
            position: relative;
            margin-top: 20px;

            .no-data-text {
              position: absolute;
              left: 50%;
              top: 50%;
              margin-top: -50px;
              font-size: 14px;
              color: #909399;
              transform: translate(-50%, -50%);
            }
          }
        }

        .brief-datas {
          padding-left: 20px;
          padding-top: 25px;
          padding-bottom: 10px;

          text-align: left;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          width: 100%;
          overflow-x: auto;

          .brief-data-item:not(:first-child) {
            margin-left: 35px;
          }

          .brief-data-item {
            flex: 0 0 auto;
            & > div {
              margin-bottom: 2px;
            }
          }

          & > div {
            margin-bottom: 10px;
          }

          .brief-datas-title {
            font-size: 14px;
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
          }

          .rate-container {
            & > span:not(:first-child) {
              margin-left: 5px;
            }

            .arrow {
              font-size: 12px;
            }

            .rate-title {
              font-size: 14px;
            }
            .rate-number {
              font-size: 14px;
            }
          }

          .count-wrapper {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }

          .count-number {
            font-size: 18px;
            font-weight: bold;
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>
