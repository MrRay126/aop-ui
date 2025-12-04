<template>
  <div class="competition" v-loading="isLoadingReportConfigs">
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
                  <div class="anylysis-type">
                    <div class="title">
                      <svg-icon icon-class="anylysis" size="15"></svg-icon>
                      <span class="title-text">分析方式</span>
                    </div>
                    <div class="radio-container">
                      <el-radio-group
                        v-model="anylysisType"
                        @change="handleAnylysisTypeChange"
                        :disabled="isCalculating"
                      >
                        <div class="radio-score">
                          <el-radio label="score">评分</el-radio>
                          <template v-if="anylysisType === score">
                            <el-select
                              size="mini"
                              class="score-channel"
                              v-model="channel"
                              @change="handleChannelChange"
                              :disabled="isCalculating"
                            >
                              <template v-for="(item, index) in channelOptions">
                                <el-option
                                  :label="item.label"
                                  :value="item.value"
                                  :key="index"
                                ></el-option>
                              </template>
                            </el-select>
                          </template>
                        </div>
                        <div class="radio-trend">
                          <el-radio label="trend">趋势</el-radio>
                        </div>
                        <div class="radio-word">
                          <el-radio label="wordCloud">词云</el-radio>
                        </div>
                      </el-radio-group>
                    </div>
                  </div>

                  <div class="global-filter">
                    <div class="title-and-operator">
                      <svg-icon icon-class="control" size="15"></svg-icon>
                      <span class="title-text"> 全局筛选 </span>
                      <span class="filter-icon">
                        <svg-icon
                          icon-class="filter"
                          :disabled="anylysisType === score"
                          size="15"
                          @click="handleAddFilterItem(filters)"
                        ></svg-icon>
                      </span>
                    </div>
                    <div class="conditions-container">
                      <div class="condition-item">
                        <filters
                          :configData="filters"
                          :optionsData="filterOptionsData"
                          :isUseAddConditionBtn="false"
                          :valueComponentConfig="filterValueComponentConfig"
                          :disabled="isCalculating || anylysisType === score"
                          @change="handleFilterChange"
                        ></filters>
                      </div>
                    </div>
                  </div>

                  <div class="project-group-statistics">
                    <div class="title-and-operator">
                      <svg-icon icon-class="block-list" size="15"></svg-icon>
                      <span class="title-text">按项目分组统计</span>
                      <el-button
                        type="text"
                        class="btn-text-plus"
                        :disabled="isCalculating"
                        @click="handleAddApp"
                      >
                        +
                      </el-button>
                    </div>
                    <div class="list-container">
                      <template v-for="(appItem, listIndex) in appValues">
                        <div class="list-item" :key="listIndex">
                          <div>
                            <div class="title-container">
                              <span class="title">
                                {{ listIndex + 1 }}.
                                <template v-if="!appItem.inEditting">
                                  <span>{{ appItem.label }}</span>
                                </template>
                                <template v-else>
                                  <el-input
                                    v-model="appItem.label"
                                    :disabled="isCalculating"
                                    size="mini"
                                    style="width: 200px"
                                  ></el-input>
                                </template>
                              </span>

                              <el-button
                                @click="handleTitleEdit(appItem)"
                                class="icon-button"
                                type="text"
                                :icon="
                                  appItem.inEditting
                                    ? 'el-icon-check'
                                    : 'el-icon-edit'
                                "
                              ></el-button>
                            </div>

                            <div class="select-filter">
                              <el-select
                                size="mini"
                                v-model="appItem.value"
                                :disabled="isCalculating"
                                @change="handleAppChange"
                              >
                                <template v-for="(app, index) in appOptions">
                                  <el-option
                                    :label="app.label"
                                    :value="app.value"
                                    :key="index"
                                  ></el-option>
                                </template>
                              </el-select>
                              <span class="filter-warpper">
                                <svg-icon
                                  :disabled="anylysisType === score"
                                  icon-class="filter"
                                  size="16"
                                  @click="handleAddFilterItem(appItem.filters)"
                                ></svg-icon>
                              </span>
                              <span style="margin-left: 5px; line-height: 1">
                                <svg-icon
                                  icon-class="close-circle"
                                  size="14"
                                  @click="handleRemoveApp(listIndex)"
                                ></svg-icon>
                              </span>
                              <!-- <span
                              class="el-icon-circle-close"
                              @click="handleRemoveApp(listIndex)"
                            ></span> -->
                            </div>
                          </div>
                          <div class="app-filter-container">
                            <filters
                              :configData="appItem.filters"
                              :optionsData="filterOptionsDataOfApp"
                              :valueComponentConfig="filterValueComponentConfig"
                              :isUseAddConditionBtn="false"
                              :disabled="
                                isCalculating || anylysisType === score
                              "
                              @change="handleAppFilterChange(appItem, $event)"
                            ></filters>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="operate-btns-container">
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
                    :isAutoTriggerApplyTimeEvent="false"
                    :disabled="isCalculating"
                    :unitComponent="unitComponent"
                    :unitOptions="unitOptions"
                    @applyTime="handleTimeChange"
                    @unitChange="handleUnitChange"
                  >
                  </time-calendar>

                  <template v-if="anylysisType === score">
                    <el-select
                      size="mini"
                      class="score-select"
                      v-model="scoreType"
                      :disabled="isCalculating"
                    >
                      <template v-for="(item, index) in scoreTypeOptions">
                        <el-option
                          :label="item.label"
                          :value="item.value"
                          :key="index"
                        ></el-option>
                      </template>
                    </el-select>
                  </template>
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
                    <template v-if="[score, trend].includes(anylysisType)">
                      <div class="chart-container">
                        <div class="chart-section">
                          <template
                            v-if="trendData.chartData.source.length === 0"
                          >
                            <span class="no-data-text">暂无数据</span>
                          </template>
                          <line-chart
                            ref="trendLineChart"
                            :hasLegend="true"
                            :height="450"
                            :chartData="trendData.chartData"
                          ></line-chart>
                        </div>
                      </div>
                      <div class="table-container">
                        <dynamic-table
                          :height="500"
                          :dimension="trendData.table.dimension"
                          :source="trendData.table.source"
                          :filter="trendData.table.filter"
                          :filterOptions="trendData.table.filterOptions"
                          :pager="trendData.table.pager"
                          :loading="isLoadingTable"
                          sortMode="single"
                          @getTableData="handleGetTableData(null, $event)"
                          @rowClick="handleRowClick"
                        ></dynamic-table>
                      </div>
                    </template>
                    <!-- 分析类型:词云 -->
                    <template v-if="anylysisType === wordCloud">
                      <div class="anylysis-content-container">
                        <div class="app-content-item">
                          <div class="word-cloud-chart-container chart-section">
                            <template
                              v-if="wordCloudAppOne.chartData.length === 0"
                            >
                              <span class="no-data-text">暂无数据</span>
                            </template>
                            <div class="app-statistics-label">
                              {{ wordCloudAppOne.label }}
                            </div>
                            <word-cloud-chart
                              @click="
                                handleWordCloudItemClick('appOne', $event.name)
                              "
                              shape="square"
                              :gridSize="20"
                              :chartData="wordCloudAppOne.chartData"
                              :height="450"
                            ></word-cloud-chart>
                          </div>
                          <div class="table-container">
                            <dynamic-table
                              :height="500"
                              :dimension="wordCloudAppOne.table.dimension"
                              :source="wordCloudAppOne.table.source"
                              :filter="wordCloudAppOne.table.filter"
                              :filterOptions="
                                wordCloudAppOne.table.filterOptions
                              "
                              :pager="wordCloudAppOne.table.pager"
                              :loading="isLoadingAppOneTable"
                              :contentHandler="tableContentHandler('appOne')"
                              sortMode="single"
                              @getTableData="
                                handleGetTableData('appOne', $event)
                              "
                            ></dynamic-table>
                          </div>
                        </div>
                        <div class="app-content-item">
                          <div class="word-cloud-chart-container chart-section">
                            <template
                              v-if="wordCloudAppTwo.chartData.length === 0"
                            >
                              <span class="no-data-text">暂无数据</span>
                            </template>
                            <div class="app-statistics-label">
                              {{ wordCloudAppTwo.label }}
                            </div>
                            <word-cloud-chart
                              @click="
                                handleWordCloudItemClick('appTwo', $event.name)
                              "
                              shape="square"
                              :gridSize="20"
                              :chartData="wordCloudAppTwo.chartData"
                              :height="450"
                            ></word-cloud-chart>
                          </div>
                          <div class="table-container">
                            <dynamic-table
                              :height="500"
                              :dimension="wordCloudAppTwo.table.dimension"
                              :source="wordCloudAppTwo.table.source"
                              :filter="wordCloudAppTwo.table.filter"
                              :filterOptions="
                                wordCloudAppTwo.table.filterOptions
                              "
                              :pager="wordCloudAppTwo.table.pager"
                              :loading="isLoadingAppTwoTable"
                              :contentHandler="tableContentHandler('appTwo')"
                              sortMode="single"
                              @getTableData="
                                handleGetTableData('appTwo', $event)
                              "
                            ></dynamic-table>
                          </div>
                        </div>
                      </div>
                    </template>
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
          <div class="detail-top">
            <span class="top-path">
              <span class="path-pre" @click="handleBackToPage">竟品分析</span>
              <span> / </span>
              <span> {{ detailAppLabel }}</span>
              <!-- <span>项目{{ anylysisTypesLabel[anylysisType] }}</span> -->
              <template v-if="anylysisType === score">
                <span>/ {{ scoreTypeLabel[scoreType] }}</span>
              </template>
              <span> ( </span>
              <span>分析时段 </span>
              <span>{{ time.start.split(" ")[0] }}</span>
              <span> ~ </span>
              <span>{{ time.end.split(" ")[0] }}</span>
              <span> )</span>
            </span>

            <span class="btns-container">
              <span style="margin-right: 10px">
                <ai-summary
                  :configs="{
                    ...getParams(),
                    type: OpinionType.competition,
                    filter: {
                      filters: this.filters,
                    },
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

          <div class="detail-table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                trend_filter: trendFilter,
                project_id: $store.getters.appId,
                anylysisType: anylysisType,
                channel: channel,
                filters: filters,
                scoreType: scoreType,
                appValues: appValues,
                time: time,
                time_unit: particle,
              }"
              apiAction="competition/getDetailData"
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
        :reportType="OpinionType.competition"
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

import stepper from "@/views/components/stepper";
import saveReport from "@/views/components/saveReport";
import { commands } from "@/views/components/saveReport/data.js";
import { uuid } from "@/utils";
import numeral from "numeral";

import recentDay from "@/utils/timeData.js";

import { OpinionType } from "@/views/dashbord/data";
import reportsListPannel from "@/views/dashbord/components/reportsListPannel.vue";
import dynamicTable from "@/views/components/dynamicTable";
import filters from "@/views/components/filters";
import wordCloudChart from "@/views/components/charts/wordCloudChart.vue";

import {
  fitListData,
  validEmptyFilterItem,
} from "@/views/components/filters/data.js";

import { anylysisMixin, editTableMixin } from "@/views/mixins/anylysis.js";

import {
  anylysisTypesLabel,
  scoreTypeLabel,
  scoreTypeOptions,
  score,
  commentCount,
  trend,
  wordCloud,
  unitOptions,
  getDimension,
} from "./data";

import aiSummary from "@/views/components/aiSummary";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  mixins: [anylysisMixin, editTableMixin],
  components: {
    toolbar,
    mainSection,
    timeCalendar,
    lineChart,
    stepper,
    saveReport,
    reportsListPannel,
    dynamicTable,
    filters,
    wordCloudChart,
    detailTable,
    aiSummary,
    xiaZuanInfo,
  },

  data() {
    return {
      isViewXiaZuan: false,
      isDownloadingXiazuan: false,

      xiaZuanRow: {},

      dimensions: [],
      filterValueComponentConfig: {},
      unitOptions,

      isViewInfos: true,
      anylysisTypesLabel,
      scoreTypeLabel,
      scoreTypeOptions,

      channel: "",
      channelOptions: [
        {
          label: "微博",
          value: "weibo",
        },
      ],

      score,
      commentCount,
      trend,
      wordCloud,

      unitComponent: "unitSelector", // 分析方式: '词云'时不需要时间单位组件, 设置为 ""
      detailAppLabel: "",

      anylysisType: score,
      scoreType: score,

      filters: {
        relTag: "and", // or | and
        children: [],
      },

      filterItem: { id: 0, key: 1, relation: "eq", value: "" },
      filterOptionsData: [],
      filterOptionsDataOfApp: [],
      valueComponentConfig: null,

      appValues: [],

      appOptions: [],

      operationPerms: [], // save: 保存 , saveAs:另存为
      isDownloadingMain: false,
      isDownloadingDetail: false,
      //   unitOptions: [],

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

      pageTitle: "竞品分析",
      comment: "分析不同项目在同一时间段的舆情趋势和状况。",

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
      // 初始数据

      //评分和趋势分析- chart和table
      trendData: {
        chartData: {
          dimensions: [
            // "time", "武器-内容量", "角色-内容量"
          ],
          source: [
            // {
            //   time: "2022-12-28T12:30:20",
            //   "武器-内容量": 43.3,
            //   "角色-内容量": 85.8,
            // },
            // {
            //   time: "2022-12-29T12:30:20",
            //   "武器-内容量": 86.4,
            //   "角色-内容量": 65.2,
            // },
            // {
            //   time: "2022-12-30T12:30:20",
            //   "武器-内容量": 72.4,
            //   "角色-内容量": 53.9,
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
          filter: {},
          filterOptions: {},
        },
      },

      curAppForGetTableData: null,

      // 词云分析- app1的数据
      wordCloudAppOne: {
        label: "",
        appId: 0,
        chartData: [],

        table: {
          appId: 0,
          word: null,
          dimension: [],
          source: [],
          filter: {},
          filterOptions: {},
          pager: {
            curPage: 1,
            pageSize: 10,
            total: 6680,
          },
        },
      },

      // 词云分析- app2的数据
      wordCloudAppTwo: {
        label: "",
        appId: 0,
        chartData: [],
        table: {
          appId: 0,
          word: null,
          dimension: [],
          source: [],
          filter: {},
          filterOptions: {},
          pager: {
            curPage: 1,
            pageSize: 10,
            total: 6680,
          },
        },
      },

      isLoadingTable: false,
      isLoadingAppOneTable: false,
      isLoadingAppTwoTable: false,
    };
  },

  watch: {
    //监听app改变后初始化页面
    "$store.getters.appId": {
      handler(val, oldVal) {
        const isUserChangeProject = typeof oldVal === "number";
        if (isUserChangeProject) {
          this.resetQueryData();
          this.getFilterOptions();
          this.getChannelOptions();

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
    "$store.getters.appList": {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.appOptions = val.map((item) => {
            return { label: item.label, value: item.id };
          });
          // 默认添加两个app
          this.handleAddApp();
          this.handleAddApp();
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

    handleTitleEdit(titleItem) {
      this.$set(titleItem, "inEditting", !titleItem.inEditting);
    },

    handleChannelChange() {
      this.alreadyCalculated = false;
    },

    getChannelOptions() {
      this.channelOptions = [];
      const payload = {
        // project_id: this.$store.getters.appId,
      };
      this.$store
        .dispatch("competition/getChannelOptions", payload)
        .then((resData) => {
          this.channelOptions = resData;
          if (!this.channel) {
            this.channel = this.channelOptions[0].value;
          }
        });
    },

    tableContentHandler(appIndex) {
      return (header, content) => {
        const word =
          appIndex === "appOne"
            ? this.wordCloudAppOne.table.word
            : this.wordCloudAppTwo.table.word;

        const contentText =
          typeof content === "object" ? content.label : content;
        return this.markContent(contentText, word);
      };
    },

    markContent(content, word) {
      // console.log("content, word:::", content, word);
      if (content && word) {
        let reg = new RegExp(`(${word})`, "g");
        content = content.replace(reg, "<span style='color:red'>$1</span>");
        return content;
      }
      return "";
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

    handleRemoveApp(index) {
      this.appValues.splice(index, 1);
    },

    handleGetTableData(appIndex, data) {
      if (appIndex === "appOne") {
        // 分析方式: 趋势或词云 , 第一个table

        this.wordCloudAppOne.table.pager = data.pager;
        this.wordCloudAppOne.table.filter = data.filter;
      } else if (appIndex === "appTwo") {
        // 分析方式: 趋势或词云 , 第二个table
        this.wordCloudAppTwo.table.pager = data.pager;
        this.wordCloudAppTwo.table.filter = data.filter;
      } else {
        //分析方式为: 评分
        this.trendData.table.pager = data.pager;
        this.trendData.table.filter = data.filter;
      }
      this.getTableData(appIndex);
    },

    // 词云点击
    handleWordCloudItemClick(appIndex, word) {
      if (appIndex === "appOne") {
        // 分析方式: 趋势或词云 , 第一个table

        this.wordCloudAppOne.table.word = word;
      } else if (appIndex === "appTwo") {
        // 分析方式: 趋势或词云 , 第二个table
        this.wordCloudAppTwo.table.word = word;
      }

      this.getTableData(appIndex);
    },

    handleAppChange() {
      this.setAppValueLabel();
    },

    setAppValueLabel() {
      const anylysisTypeLabel = this.anylysisTypesLabel[this.anylysisType];

      this.appValues.forEach((appItem) => {
        const findApp = this.appOptions.find((item) => {
          return item.value === appItem.value;
        });

        let appLabel = findApp ? findApp.label : "";

        appItem.label = `${appLabel} . ${anylysisTypeLabel}`;
      });
    },

    handleAnylysisTypeChange() {
      // this.hasData = false;
      if (this.anylysisType === wordCloud) {
        // 最多两个app
        this.appValues = this.appValues.splice(0, 2);
        // 设置数据状态
        this.hasData = this.wordCloudAppOne.chartData.length > 0;
      } else {
        this.hasData = this.trendData.chartData.dimensions.length > 0;
      }

      this.setAppValueLabel();

      this.unitComponent =
        this.anylysisType === wordCloud
          ? ""
          : this.$options.data().unitComponent;

      this.alreadyCalculated = false;

      // 分析类型为评分时, 清空全局筛选和app筛选
      if (this.anylysisType === score) {
        //清空每个app的筛选
        this.appValues.forEach((appItem) => {
          appItem.filters = this.$options.data().filters;
        });

        // 清空全局的筛选
        this.filters = this.$options.data().filters;
      }
    },

    getFilterOptions() {
      const payload = {
        project_id: this.$store.getters.appId,
      };
      return this.$store
        .dispatch("trend/getFilterOptions", payload)
        .then((data) => {
          const filterOptions = fitListData(data)[0].keyList;

          this.filterOptionsData = filterOptions.filter((item) => {
            return item.value !== "hotword" && item.value !== "hotwordgroup";
          });
          this.filterOptionsDataOfApp = filterOptions;
          this.filterValueComponentConfig = data[0].valueComponentConfig;
        });
    },

    handleAddApp() {
      if (this.isCalculating) {
        return;
      }

      if (this.anylysisType !== wordCloud && this.appValues.length === 10) {
        this.$message({
          message: "分析方式为 '评分' 和 '趋势' 时, 最多添加10个分组项",
          type: "info",
        });
        return;
      }

      if (this.anylysisType === wordCloud && this.appValues.length === 2) {
        this.$message({
          message: "分析方式为 '词云' 时, 最多添加2个分组项",
          type: "info",
        });
        return;
      }

      const value = this.appOptions[0].value;
      const label = this.appOptions[0].label;
      const anylysisType = this.anylysisTypesLabel[this.anylysisType];

      const item = {
        label: `${label} . ${anylysisType}`,
        value: value,
        filters: {
          relTag: "and", // or | and
          children: [],
        },
      };
      this.appValues.push(item);
    },

    handleAddFilterItem(filters) {
      const filterItem = JSON.parse(JSON.stringify(this.filterItem));
      filterItem.id = uuid();
      filterItem.key = null;
      filterItem.relation = null;
      filterItem.value = null;

      filters.children.push(filterItem);
    },
    handleFilterChange(data) {
      this.filters = data;
    },

    handleAppFilterChange(app, data) {
      app.filters = data;
    },

    cancelDownload() {
      if (this.isDownloadingMain) {
        this.$store.dispatch("download/stopDownloadAnalysis").catch(() => {
          //noop
        });
      }
    },

    handleDownload() {
      this.isDownloadingMain = true;

      const payload = {
        urlParams: { download_type: OpinionType.competition },
        data: {
          ...this.getParams(),
        },
      };

      if (this.anylysisType === wordCloud) {
        payload.data.table = [
          {
            appId: this.wordCloudAppOne.table.appId,
            word: this.wordCloudAppOne.table.word,
            pager: this.wordCloudAppOne.table.pager,
            tableFilter: this.wordCloudAppOne.table.filter,
          },
          {
            appId: this.wordCloudAppTwo.table.appId,
            word: this.wordCloudAppTwo.table.word,
            pager: this.wordCloudAppTwo.table.pager,
            tableFilter: this.wordCloudAppTwo.table.filter,
          },
        ];
      } else if (this.anylysisType === score || this.anylysisType === trend) {
        payload.data.table = [
          {
            pager: this.trendData.table.pager,
            tableFilter: this.trendData.table.filter,
          },
        ];
      }

      // if(ap){}

      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloadingMain = false;
      });
    },

    getTableData(appIndex) {
      let table = null;
      if (appIndex === "appOne") {
        table = this.wordCloudAppOne.table;
      } else if (appIndex === "appTwo") {
        table = this.wordCloudAppTwo.table;
      } else {
        table = this.trendData.table;
      }

      const payload = {
        ...this.getParams(),
        appId: table.appId || null,
        word: table.word || null,
        pager: table.pager,
        tableFilter: table.filter,
      };

      // 分析方式: 词云
      if (appIndex === "appOne") {
        // app1数据表
        this.isLoadingAppOneTable = true;
        // this.wordCloudAppOne.table = this.$options.data().wordCloudAppOne.table;
      } else if (appIndex === "appTwo") {
        // app2数据表
        this.isLoadingAppTwoTable = true;
        // this.wordCloudAppTwo.table = this.$options.data().wordCloudAppTwo.table;
      } else {
        // 分析方式: 评分 | 趋势
        this.isLoadingTable = true;
        this.trendData.table = this.$options.data().trendData.table;
      }

      this.$store
        .dispatch("competition/getTableData", payload)
        .then((res) => {
          let tableType = null;
          // 分析方式: 评分 | 趋势
          if (this.anylysisType === score || this.anylysisType === trend) {
            tableType = this.trendData;
            for (let prop in res) {
              tableType.table[prop] = res[prop];
            }

            const dimension = tableType.table.dimension;
            tableType.table.dimension = dimension.map((dItem, index) => {
              if (dimension.length < 20) {
                dItem.width = "";
                dItem.minWidth = "130px";
              }
              if (index === 0) {
                dItem.width = "";
                dItem.minWidth = "180px";
              }
              return dItem;
            });

            return;
          } else {
            // 分析方式: 词云
            if (appIndex === "appOne") {
              // app1数据表
              tableType = this.wordCloudAppOne;
            } else if (appIndex === "appTwo") {
              // app2数据表
              tableType = this.wordCloudAppTwo;
            }
          }

          for (let prop in res) {
            tableType.table[prop] = res[prop];
          }

          tableType.table.dimension = this.dimensions;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          // 分析方式: 词云
          if (appIndex === "appOne") {
            // app1数据表
            this.isLoadingAppOneTable = false;
          } else if (appIndex === "appTwo") {
            // app2数据表
            this.isLoadingAppTwoTable = false;
          } else {
            // 分析方式: 评分 | 趋势
            this.isLoadingTable = false;
          }
        });
    },

    handleBackToPage() {
      this.isViewInfos = true;
    },

    handleRowClick(data) {
      if (this.anylysisType === wordCloud) {
        return;
      }

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

        if (this.anylysisType === score || this.anylysisType === trend) {
          this.isViewInfos = false;
        }

        const appProp = this.trendData.table.dimension[0].prop;
        this.detailAppLabel = row[appProp];

        // 编辑数据中的trend_filter,并回传
        this.trendFilter = row.trend_filter;
        this.trendFilter.time = prop;
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
          type: OpinionType.competition,
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
          type: OpinionType.competition,
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
          this.anylysisType = data.configs.anylysisType;
          this.scoreType = data.configs.scoreType;
          this.filters = data.configs.filters;
          this.appValues = data.configs.appValues;

          this.time = data.configs.time;
          this.particle = data.configs.timeUnit;

          // this.filter.value = data.configs.value;

          this.pageTitle = data.name;
          this.comment = data.comment;

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
      this.trendData = data.trendData;
    },

    handleRefresh() {
      this.getPageData();
    },

    handleUnitChange(val) {
      this.particle = val;
      this.alreadyCalculated = false;
    },

    numeral(...args) {
      return numeral(...args);
    },

    handleTimeChange(val) {
      this.time = val;
      this.alreadyCalculated = false;
    },

    getParams() {
      return {
        project_id: this.$store.getters.appId,
        anylysisType: this.anylysisType,
        scoreType: this.scoreType,
        filters: this.filters,
        appValues: this.appValues,
        time: this.time,
        timeUnit: this.particle,
        channel: this.channel,
      };
    },

    validParams() {
      let validPass = true;
      let msg = "";

      //全局筛选条件
      validPass = validEmptyFilterItem(this.filters);
      if (!validPass) {
        msg = "'全局筛选条件' 存在未设置的值, 请设置后计算!";
      }

      //项目分组统计筛选条件
      if (validPass) {
        for (let i = 0, len = this.appValues.length; i < len; i++) {
          const appValueItem = this.appValues[i];

          validPass = validEmptyFilterItem(appValueItem.filters);

          if (!validPass) {
            msg = "分组项的筛选条件存在未设置的值, 请设置后计算!";
            break;
          }
        }
      }

      // '词云'分析方式时,分组项数量为2
      if (validPass && this.anylysisType === wordCloud) {
        validPass = this.appValues.length === 2;
        if (!validPass) {
          msg = "'按项目分组统计' 需要配置2个项目!";
        }
      }

      // // '词云'分析方式时, 分组项不能重复
      // if (validPass && this.anylysisType === wordCloud) {
      //   const appValues = this.appValues.map((appItem) => {
      //     return appItem.value;
      //   });
      //   validPass = appValues.length === Array.from(new Set(appValues)).length;

      //   if (!validPass) {
      //     msg = "分析方式为 '词云' 时, 两个分组项不能重复!";
      //   }
      // }

      if (!validPass) {
        this.$message({
          type: "info",
          message: msg,
        });
      }
      return validPass;
    },

    // 维度表的相关参数
    getTableParams() {
      return {
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
        if (this.anylysisType === wordCloud) {
          resData = await this.$store.dispatch(
            "competition/getWordCloudData",
            payload
          );
        } else {
          resData = await this.$store.dispatch(
            "competition/getTrendChartData",
            payload
          );
        }
      } catch (err) {
        this.isErrorOccured = true;
        this.isCalculating = false;
        return;
      }

      // console.log("data111:", data);

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

          if (this.anylysisType === wordCloud) {
            this.resetPageViewDataOfAnylysistype();
            // app1
            const chartOne = data.chartData[0];
            if (chartOne) {
              const appOne = this.appValues.find(
                (item) => item.value === chartOne.appId
              );
              this.wordCloudAppOne.label = appOne?.label || "";
              this.wordCloudAppOne.appId = chartOne.appId;
              this.wordCloudAppOne.chartData = chartOne.words;
              this.wordCloudAppOne.table.appId = chartOne.appId;

              // 第一个app的词云数据表
              const firstWordName = data.chartData[0]?.words[0]?.name;
              // console.log("app1 word:", firstWordName);
              if (firstWordName) {
                this.handleWordCloudItemClick("appOne", firstWordName);
              }
            }

            // app2
            const chartTwo = data.chartData[1];
            if (chartTwo) {
              const appTwo = this.appValues.find(
                (item) => item.value === chartTwo.appId
              );

              this.wordCloudAppTwo.label = appTwo?.label || "";
              this.wordCloudAppTwo.appId = chartTwo.appId;
              this.wordCloudAppTwo.chartData = chartTwo.words;
              this.wordCloudAppTwo.table.appId = chartTwo.appId;

              // 第二个app的词云数据表
              const firstWordName = data.chartData[1]?.words[0]?.name;
              if (firstWordName) {
                this.handleWordCloudItemClick("appTwo", firstWordName);
              } else {
                this.table;
              }
            }
          } else {
            this.resetPageViewDataOfAnylysistype(trend);
            this.trendData.chartData = data.chartData;
            this.getTableData();
          }
        }, 200);
      }
      // console.log("this.activeStep:", this.activeStep);
    },

    resetPageViewDataOfAnylysistype(type = "") {
      const initialData = this.$options.data();
      if ([trend, score].includes(type)) {
        this.trendData = initialData.trendData;
      } else {
        this.wordCloudAppOne = initialData.wordCloudAppOne;
        this.wordCloudAppTwo = initialData.wordCloudAppTwo;
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
      this.getFilterOptions();
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
    this.getChannelOptions();

    // 获取整体情感options选项
    this.getEmotionOptions();
    // 获取文本类型options选项
    this.getTextTypeOptions();

    this.dimensions = getDimension(this);
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

.competition {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;

  .anylysis-content-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .app-content-item {
      width: 50%;
      overflow-x: auto;

      &:first-child {
        padding-right: 10px;
      }

      &:nth-child(2) {
        padding-left: 10px;
      }

      .app-statistics-label {
        color: $color-text;
        font-size: 14px;
        margin-bottom: 10px;
      }
    }

    .table-container {
      padding-top: 10px;
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

  .main-section-outer-wrapper {
    width: 100%;
    height: calc(100% - 50px);
    flex: 1;
    background: $background-color;

    .left-section {
      position: relative;
      width: 450px;
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
        color: $color-text;
        padding: 10px;

        .title-text {
          font-size: 16px;
          margin-left: 3px;
          font-weight: bold;
        }

        .anylysis-type {
          padding: 10px;
          .title {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 10px;
          }

          .radio-container {
            .radio-score {
              height: 35px;
              display: flex;
              align-items: center;

              .score-channel {
                width: 100px;
              }
            }

            .radio-trend {
              height: 35px;
              display: flex;
              align-items: center;
            }

            .radio-word {
              height: 35px;
              display: flex;
              align-items: center;
            }
          }
        }

        .global-filter {
          padding: 10px;
          padding-top: 30px;

          .title-and-operator {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 5px;

            .filter-icon {
              margin-left: 3px;
              padding-top: 3px;
              cursor: pointer;
            }
          }
        }

        .project-group-statistics {
          padding: 10px;

          .title-and-operator {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 10px;

            .plus-btn {
              margin-left: 3px;
            }

            .btn-text-plus {
              margin-left: 3px;
              font-size: 20px;
              // color: $color-primary;
              cursor: pointer;

              // &:hover {
              //   color: $color-primary-deep;
              // }
            }
          }

          .list-container {
            .list-item {
              margin-bottom: 10px;

              .title {
                font-size: 14px;
                padding: 5px 0;
              }

              .icon-button {
                margin-left: 10px;
                font-size: 14px;
              }
            }

            .select-filter {
              display: flex;
              align-items: center;
              justify-content: flex-start;

              .el-icon-circle-close {
                font-size: 14px;
                cursor: pointer;
                margin-left: 5px;

                &:hover {
                  color: $color-primary-deep;
                }
              }

              .filter-warpper {
                margin-left: 3px;
                padding-top: 3px;
                cursor: pointer;
              }
            }
          }
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

        .score-select {
          width: 100px;
          padding: 7px 0;
          margin-left: 10px;

          ::v-deep(.el-input--mini .el-input__inner) {
            height: 30px;
            line-height: 30px;
            font-size: 14px;
          }

          ::v-deep(.el-input--mini .el-input__inner:not([disabled])) {
            color: #42546d;
          }

          ::v-deep(.el-input.is-disabled .el-input__inner) {
            background-color: initial;
          }

          ::v-deep(.el-input__inner:hover) {
            border-color: #409eff !important;
          }
        }
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
          color: $color-text;
          transform: translate(-50%, -50%);
        }
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
        }
      }
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
      height: calc(100% - 50px);
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
}
</style>
