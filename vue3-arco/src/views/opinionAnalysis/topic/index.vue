<template>
  <div class="topic" v-loading="isLoadingReportConfigs">
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
            report: true,
          }"
          :isUseShareBtn="true"
          @refresh="handleRefresh"
          @openReportList="handleOpenReportList"
          @download="handleDownload"
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

                  <div class="params-section">
                    <el-divider content-position="center" class="divider"
                      ><span class="divide-line-text"
                        >配置参数</span
                      ></el-divider
                    >
                    <div class="params-container">
                      <div class="params-wrapper">
                        <span class="title">主题数量 :</span>
                        <el-select
                          class="channel-select"
                          size="mini"
                          v-model="topicCount"
                        >
                          <template v-for="(cItem, index) in topicCountOptions">
                            <el-option
                              :key="index"
                              :label="cItem"
                              :value="cItem"
                            ></el-option>
                          </template>
                        </el-select>
                      </div>

                      <div class="params-wrapper">
                        <span class="title">提示词 :</span>
                        <input-register
                          v-model="promptWords"
                          class="channel-select"
                        ></input-register>
                      </div>

                      <div class="params-wrapper">
                        <span class="title">段落拆分 : </span>&nbsp;
                        <el-switch
                          v-model="split"
                          inactive-text="off"
                          active-text="on"
                        ></el-switch>
                      </div>
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
                      >收藏</el-button
                    >
                  </el-popover>
                  <template v-if="pageMode === 'edit'">
                    <template v-if="operationPerms.includes(commands.saveAs)">
                      <el-button
                        style="display: none"
                        :disabled="isCalculating || !alreadyCalculated"
                        @click="handleSaveAction(commands.saveAs)"
                        type="plain"
                        >另存为</el-button
                      >
                    </template>
                    <template v-if="operationPerms.includes(commands.update)">
                      <el-button
                        style="display: none"
                        :disabled="isCalculating || !alreadyCalculated"
                        @click="handleSaveAction(commands.update)"
                        type="plain"
                        >更新报表</el-button
                      >
                    </template>
                  </template>

                  <template v-if="pageMode === 'view'">
                    <el-button
                      style="display: none"
                      :disabled="isCalculating || !alreadyCalculated"
                      @click="handleSaveAction(commands.save)"
                      type="plain"
                      >保存报表</el-button
                    >
                  </template>

                  <el-button
                    type="primary"
                    @click="handleSaveAction(commands.save)"
                    >计算</el-button
                  >
                </div>
              </div>
            </template>
            <template #right>
              <div class="right-section">
                <div class="top-tools">
                  <time-calendar
                    :isTextTypeReference="false"
                    :isAutoTriggerApplyTimeEvent="false"
                    :timeData="time"
                    @applyTime="handleApplyTime"
                  >
                  </time-calendar>
                </div>
                <div class="bottom-container" ref="container">
                  <template v-if="isCalculating || isErrorOccured">
                    <div class="stepper-wrapper">
                      <stepper
                        :stepNumber="activeStep"
                        :isErrorOccured="isErrorOccured"
                      ></stepper>
                    </div>
                  </template>
                  <template v-else-if="hasData">
                    <!-- 关键词表 -->
                    <div class="table-container-first">
                      <div class="title">
                        <span>
                          <span class="view-topic-title">标签 :</span>
                          <span class="view-topic-name">{{
                            currentViewTopic.tagText
                          }}</span>
                        </span>
                        <span>
                          <span class="view-topic-title">内容量 :</span>
                          <span class="view-topic-name">{{
                            currentViewTopic.value
                          }}</span>
                        </span>
                      </div>
                      <div class="cloud-chart">
                        <template v-if="chartData.length > 0">
                          <division-chart
                            :chartData="chartData"
                            :height="tableMaxHeight"
                            @click="handleDivisionClick"
                          ></division-chart>
                        </template>
                        <template v-else>
                          <span class="no-data">暂无数据</span>
                        </template>
                      </div>
                    </div>
                    <!-- 评价词表 -->
                    <div class="table-container-second">
                      <template v-if="topicTable">
                        <div class="topic-types">
                          <el-radio-group size="mini" v-model="sentiment">
                            <el-radio-button :label="positive">
                              <span>{{ dispositionDict.positive }}&nbsp;</span>
                              <span>{{ topicTable[positive].percent }} </span>
                            </el-radio-button>
                            <el-radio-button :label="negative">
                              <span>{{ dispositionDict.negative }}&nbsp;</span>
                              <span>{{ topicTable[negative].percent }} </span>
                            </el-radio-button>
                            <el-radio-button :label="others">
                              <span>{{ dispositionDict.others }}&nbsp;</span>
                              <span>{{ topicTable[others].percent }} </span>
                            </el-radio-button>
                          </el-radio-group>

                          <div class="title">
                            <span @click="handleViewMore" class="view-more">
                              所有{{ contentTypeText }}内容<span
                                style="font-weight: bold"
                              >
                                {{ topicTable[sentiment].count }} </span
                              >条<i
                                class="el-icon-arrow-right"
                                style="font-size: 12px"
                              ></i>
                            </span>
                          </div>
                        </div>
                        <div>
                          <content-table
                            :height="tableMaxHeight"
                            :dimension="dimension"
                            :source="topicTable[sentiment].data"
                            :filter="tableFilter"
                            :filterOptions="contentTableFilterOptions"
                            :pager="pager"
                            :loading="loadingContents"
                            :contentHandler="preDealContent"
                            :hasPagination="false"
                            @getTableData="handleGetTableData"
                            @rowClick="handleDispositionRowClick"
                          ></content-table>
                        </div>
                      </template>
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
          <div class="top-path">
            <span>
              <span class="path-pre" @click="handleBackToInfoTables"
                >主题分析</span
              >
              /
              <span>
                <span style="font-weight: bold">{{
                  currentViewTopic.name
                }}</span>
                的{{ dispositionDict[sentiment] }}数据详情
              </span>
              <span>(</span>
              <span>分析时段 </span>
              <span>
                {{ time.start.split(" ")[0] }} ~ {{ time.end.split(" ")[0] }}
              </span>
              <span>)</span>
            </span>

            <span>
              <span style="margin-right: 10px">
                <ai-summary
                  :configs="{
                    ...getCommonParams(),
                    type: OpinionType.topic,
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
                :loading="isDownloadingDetail"
                icon="el-icon-download"
              ></el-button>
            </span>
          </div>

          <div class="detail-table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                ...getReportParams(),
                topic_id: currentViewTopic.topic_id,
                sentiment_rough: sentiment,
              }"
              :markContentWords="[currentViewTopic.name]"
              apiAction="topic/getDetailTableData"
              @event="handleDetailTableEvent"
            >
            </detail-table>
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
      type="topic"
      :mode="dialogMode"
      :reportData="reportData"
    ></save-report>

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
        :reportType="OpinionType.topic"
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
import stepper from "@/views/components/stepper";
import inputRegister from "@/views/components/inputRegister";

import { DISPOSITION, topicCountOptions } from "./data.js";
import { validEmptyFilterItem } from "@/views/components/filters/data.js";
import recentDay from "@/utils/timeData.js";

import { OpinionType } from "@/views/dashbord/data";
import { commands } from "@/views/components/saveReport/data.js";
import saveReport from "@/views/components/saveReport";
import reportsListPannel from "@/views/dashbord/components/reportsListPannel.vue";
import divisionChart from "@/views/components/charts/divisionChart.vue";
import dynamicTable from "@/views/components/dynamicTable";

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
    stepper,
    inputRegister,
    saveReport,
    reportsListPannel,
    divisionChart,
    detailTable,
    contentTable: dynamicTable,
    filterAndCollector,
    aiSummary,
    xiaZuanInfo,
  },

  data() {
    return {
      isViewXiaZuan: false,
      isDownloadingXiazuan: false,

      xiaZuanRow: {},
      contentTableFilterOptions: {},
      tableFilter: {},

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 10,
      },

      loadingContents: false,

      //分块图数据
      chartData: [],
      promptWords: [],
      split: false,
      topicCountOptions,
      topicCount: "auto",

      promptWordOptions: [],
      operationPerms: [],
      isDownloadingDetail: false,
      isDownloadingMain: false,
      currentViewTopic: { name: "-", value: "-", tagText: "-" },

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
      reportData: null, //回显数据 {title:'',comment:''}

      pageMode: "view", // view:正常查看状态 , edit:编辑状态(携带id回来)

      pageTitle: "主题分析",
      comment: "分析某段时间内，内容的话题种类数及各个话题的关键字。",
      isLoadingReportConfigs: false,

      // filter: {
      //   value: "",
      //   filters: {
      //     relTag: "and", // or | and
      //     children: [],
      //   },
      // },

      tableValueMaps: {},

      tableOptionsData: [], //过滤器列表数据
      // filterOpionsData: [],
      // filterItem: { id: 0, key: 1, relation: "eq", value: "" },

      // groupper: [], //[{ value: "偶像" }]

      time: {
        type: "relative", // absolute|relative 绝对时间|相对时间
        start: recentDay["1-7"].start, //"2021/8/1 0:0:0", //开始时间字符串
        end: recentDay["1-7"].end, //"2021/8/30 23:59:59", //结束时间字符串
        recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      },

      tableMaxHeight: 300,
      isViewInfos: true,
      isLoadingWordTypesTable: false,

      isLoadingDetailTable: false,

      sentiment: DISPOSITION.positive,

      dimension: [
        {
          label: "内容",
          prop: "content",
          actionType: null,
          hasTooltip: true,
          minWidth: "150px",
        },
        {
          label: "时间",
          prop: "time",
          actionType: "sort",
          hasTooltip: true,
          minWidth: "150px",
        },
        {
          label: "渠道",
          prop: "channel",
          actionType: "filter",
          hasTooltip: false,
          minWidth: "150px",
        },
      ],
      // 情感倾向 table
      topicTable: {
        positive: {
          percent: "",
          count: 0, // 所有评价内容量
          data: [
            // { content: "内容", time: "2023/04/02", channel:'渠道' },
          ],
        },
        negative: {
          percent: "",
          count: 0, // 所有评价内容量
          data: [
            // { content: "内容", time: "2023/04/02", channel:'渠道' },
          ],
        },
        others: {
          percent: "",
          count: 0, // 所有评价内容量
          data: [
            // { content: "内容", time: "2023/04/02", channel:'渠道' },
          ],
        },
      },
      //third table
      detailTable: [
        // { content: "钻石级别的游戏啊", time: "2020/12/21", channel: "微博" },
        // { content: "不错啊哈哈哈", time: "2020/12/01", channel: "微博" },
      ],

      dispositionDict: {
        [DISPOSITION.positive]: "正面",
        [DISPOSITION.negative]: "负面",
        [DISPOSITION.others]: "其他",
      },
      //词性字符串
      positive: DISPOSITION.positive,
      negative: DISPOSITION.negative,
      others: DISPOSITION.others,

      isCalculating: false,
      activeStep: 0,
      isErrorOccured: false,
      hasData: false, //
      //保存当前点击的项
      keywordRow: {},
      dispositionRow: {},
    };
  },

  computed: {
    contentTypeText() {
      const disposition = this.sentiment;

      let text = this.dispositionDict[disposition];
      return text;
    },
  },

  watch: {
    //监听app改变后初始化页面
    "$store.getters.appId": {
      handler(val, oldVal) {
        const isUserChangeProject = typeof oldVal === "number";
        if (isUserChangeProject) {
          this.resetPageStatus();
          this.resetPageData();
          this.getFilterOptions();
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

    preDealContent(header, content) {
      // 数据标记处理颜色
      if (Array.isArray(this.markContentWords) && header.prop === "content") {
        this.markContentWords.forEach((word) => {
          content = this.markContent(content, word);
        });
      }
      // 数据映射处理
      if (header.prop in this.tableValueMaps) {
        content = this.tableValueMaps[header.prop][content] || content;
      }
      return content;
    },

    handleGetTableData(data) {
      this.tableFilter = data.filter;
      this.pager = data.pager;
      this.getTableData();
    },

    handlePromptwordFocus() {
      this.promptWordOptions = this.promptWords;
    },

    markContent(content, word) {
      let reg = new RegExp(`(${word})`, "g");
      content = content.replace(reg, "<span style='color:red'>$1</span>");
      return content;
    },

    handleDownloadDetail() {
      this.isDownloadingDetail = true;
      const payload = {
        urlParams: { download_type: "topic_detail" },
        data: { ...this.$refs["detailTable"].getParams() },
      };

      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloadingDetail = false;
      });
    },

    handleDownload() {
      this.isDownloadingMain = true;

      const payload = {
        urlParams: { download_type: "topic" },
        data: {
          ...this.getCommonParams(),
          id: this.reportId,
        },
      };

      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloadingMain = false;
      });
    },

    cancelDownload() {
      if (this.isDownloadingDetail || this.isDownloadingMain) {
        this.$store.dispatch("download/stopDownloadAnalysis").catch(() => {
          //noop
        });
      }
    },

    handleRefreshDetail() {
      this.$refs["detailTable"].getTableData();
    },

    //主题分割图 点击事件
    handleDivisionClick(topic) {
      this.currentViewTopic = topic;
      this.markContentWords = [topic.name];
      this.getTableData();
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
      // 替换显示标题
      if (payload.action === commands.update) {
        this.pageTitle = payload.name;
        this.comment = payload.comment;
      }
    },

    handleSaveAction(action) {
      const isFilterValidPass = validEmptyFilterItem(this.filter.filters);
      if (!isFilterValidPass) {
        this.$message({
          message: "分析条件存在未设置的值,请设置后计算!",
          type: "info",
        });
        return;
      }

      this.isSaveDialogVisible = true;
      this.dialogMode = action;

      if (action === "update" || action === "saveAs") {
        this.reportData = {
          project_id: this.$store.getters.appId,
          id: this.reportId,
          name: this.pageTitle,
          comment: this.comment,
          type: OpinionType.topic,
          action,
          configs: this.getCommonParams(),
        };
      }

      if (action === "save") {
        this.reportData = {
          project_id: this.$store.getters.appId,
          id: null,
          name: "",
          comment: "",
          type: OpinionType.topic,
          action,
          configs: this.getCommonParams(),
        };
      }
    },

    //报表的初始化显示
    initReportShow(id) {
      if (id) {
        this.getReportConfigById(this.reportId);
        this.handleCalculate(); // 获取chart数据 + 获取数据表数据
      }
    },

    //api 获取报表配置并设置在页面
    getReportConfigById(id, cb) {
      this.isLoadingReportConfigs = true;
      this.$store
        .dispatch("topic/getReportConfigById", {
          id,
          project_id: this.$store.getters.appId,
        })
        .then((data) => {
          this.time = data.configs.time;
          this.particle = data.configs.particle;
          this.filter.filters = data.configs.filters;
          this.filter.value = data.configs.value;

          this.promptWords = data.configs.promptWords;
          this.split = data.configs.split;
          this.topicCount = data.configs.topicCount;

          this.pageTitle = data.name;
          this.comment = data.comment;
          // this.operationPerms = data.perms || [];

          if (typeof cb === "function") {
            cb();
          }
        })
        .catch(() => {
          // noop
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

      this.filter = data.filter;
      this.trendData = data.trendData;
    },

    handleApplyTime(data) {
      this.alreadyCalculated = false;
      this.time = {
        type: data.type,
        start: data.start,
        end: data.end,
        recent_day: data.recent_day,
      };
    },

    handleDispositionRowClick(data) {
      const { row } = data;
      if (row.link) {
        window.open(row.link);
      }
    },

    getCommonParams() {
      let payload = {
        project_id: this.$store.getters.appId,
        filters: this.filter.filters,
        value: this.filter.value,
        time: this.time,
        topicCount: this.topicCount,
        promptWords: this.promptWords,
        split: this.split,
      };
      return payload;
    },

    // api table2数据
    getTableData() {
      this.loadingContents = true;
      // this.topicTable={}
      this.detailTable = [];
      let payload = {
        ...this.getReportParams(), // appid  reportid
        topic_id: this.currentViewTopic.topic_id,
        ...this.tableFilter,
      };

      this.$store
        .dispatch("topic/getTableData", payload)
        .then((data) => {
          //评价词
          this.topicTable = data;
          this.contentTableFilterOptions = data.filterOptions;
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.loadingContents = false;
        });
    },

    handleViewMore() {
      if (!this.alreadyCalculated) {
        this.$message({
          message: "请点击计算后查看数据详情!",
          type: "info",
        });
        return;
      }
      if (this.topicTable[this.sentiment].count > 0) {
        this.isViewInfos = false;
      }
    },

    handleBackToInfoTables() {
      this.isViewInfos = true;
    },

    handleCalculate() {
      this.handleBackToInfoTables();
      this.calculateTopic();
    },

    resetPageData() {
      this.pageTitle = this.$options.data().pageTitle;
    },

    resetPageStatus() {
      const data = this.$options.data();
      this.isCalculating = data.isCalculating;
      this.activeStep = data.activeStep;
      this.isErrorOccured = data.isErrorOccured;
      this.hasData = data.hasData;
      this.isViewInfos = data.isViewInfos;
      this.isLoadingWordTypesTable = data.isLoadingWordTypesTable;
      this.loadingContents = data.loadingContents;
      this.isLoadingDetailTable = data.isLoadingDetailTable;

      //设置数据
      this.topicTable = data.topicTable;
      this.detailTable = data.detailTable;

      this.dispositionRow = {};
    },

    //刷新按钮
    handleRefresh() {
      this.calculateTopic();
    },

    getReportParams() {
      return {
        id: this.$route.query.id || null,
        project_id: this.$store.getters.appId,
      };
    },

    //获取面板数据
    async calculateTopic() {
      this.resetPageStatus();
      const predealStatus = 0; // 预处理
      const workingStatus = 1; //计算中
      const finishedStatus = 3; //计算完成 设置为3 使步骤条变成对号状态 否则设置为2为黑色焦点状态

      let payload = this.getReportParams();
      // console.log("payload:", payload);
      let resData = {};
      try {
        this.isLoadingWordTypesTable = true;
        this.isCalculating = true;
        this.isErrorOccured = false;
        this.alreadyCalculated = false;
        resData = await this.$store.dispatch(
          "topic/getCalculateTopic",
          payload
        );
      } catch (err) {
        this.isErrorOccured = true;
        this.isCalculating = false;
        return;
      }

      if (resData.status === 1) {
        this.activeStep = predealStatus;
        //获取数据
        setTimeout(() => {
          this.calculateTopic();
        }, 2000);
      }

      if (resData.status === 2) {
        this.activeStep = workingStatus;
        //获取数据
        setTimeout(() => {
          this.calculateTopic();
        }, 2000);
      }

      if (resData.status === 3) {
        this.activeStep = finishedStatus; //设置

        setTimeout(() => {
          //半秒中的step进度条显示过程
          this.isCalculating = false;
          this.hasData = true;
          this.isLoadingWordTypesTable = false;
          this.alreadyCalculated = true;

          this.chartData = resData.chartData.sort(
            (pre, next) => next.value - pre.value
          );

          this.$nextTick(initTableData);
        }, 500);
      }

      function initTableData() {
        this.currentViewTopic = this.$options.data().currentViewTopic;
        //获取口碑词和详情内容表数据
        if (this.chartData.length > 0) {
          const firstWord = this.chartData[0];
          this.handleDivisionClick(firstWord);
        }
      }
    },
    setTableHeight() {
      window.addEventListener(
        "resize",
        () => {
          if (this.$refs["container"]) {
            this.tableMaxHeight =
              this.$refs["container"].getBoundingClientRect().height - 140;
          }
        },
        false
      );

      this.$nextTick(() => {
        if (this.$refs["container"]) {
          this.tableMaxHeight =
            this.$refs["container"].getBoundingClientRect().height - 140;
        }
      });
    },

    async initEditReport(router) {
      await this.getFilterOptions();
      this.reportId = router.query["id"] || null;
      if (this.reportId) {
        this.initReportShow(this.reportId);
        this.pageMode = "edit";
      } else {
        this.isLoadingReportConfigs = false;
      }
      this.isLoaded = true;
    },
  },

  created() {
    this.initEditReport(this.$route);
  },

  mounted() {
    this.setTableHeight();
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

.topic {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;
  .reports-drawer {
    ::v-deep(.data-view-panel .title) {
      display: none;
    }

    ::v-deep(.data-view-panel) {
      width: 100%;
    }
  }

  ::v-deep(.table-row) {
    cursor: pointer;
    height: 40px;
  }

  .header-text {
    margin-right: 3px;
  }

  .header-info-title {
    font-size: 12px;
  }

  .more-contents-table-container {
    height: 100%;
    width: 100%;
    padding: 15px;

    .top-path {
      padding: 0 20px 10px 10px;
      text-align: left;
      font-size: 14px;
      color: $title-text-color;

      display: flex;
      align-items: center;
      justify-content: space-between;

      .path-pre {
        color: $color-desc;
        cursor: pointer;
      }
    }

    .detail-table-container {
      height: calc(100% - 50px);
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
      overflow: scroll;
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
        height: calc(100% - $btnsContainerHeight);

        overflow-y: scroll;
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

        .params-section {
          .params-container {
            padding: 10px;
            .params-wrapper {
              margin-bottom: 15px;

              .channel-select {
                width: 200px;
              }

              .title {
                display: inline-block;
                width: 80px;
                color: $color-text;
                font-size: 14px;
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
      overflow: scroll;

      .top-tools {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 20px;
      }

      .bottom-container {
        // padding: 20px;
        padding-top: 20px;
        width: 100%;
        overflow-x: scroll;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        background: #fff;
        height: calc(100% - 70px);
        position: relative;

        & > div:not(:last-child) {
          margin-right: 1%;
        }

        .empty-element {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -70%);
        }

        .data-table {
          width: 100%;
          max-height: calc(100% - 40px);

          .content-text {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        .table-container-first {
          flex: 1 1 auto;
          padding: 0 10px;
          color: $color-text;
          width: 500px;

          .cloud-chart {
            width: 100%;
            min-height: 600px;
            border: 1px solid #ebeef5;
            position: relative;

            .no-data {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 14px;
              color: $color-text;
            }
          }

          // width: 32%;
          .title {
            height: 40px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .view-topic-name {
              padding: 0 3px;
            }
          }
        }

        .stepper-wrapper {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50%;
          min-width: 300px;
          flex: 0 0 auto;
        }

        .table-container-second {
          flex: 1 1 auto;
          width: 390px;
          min-width: 475px;
          height: 100%;
          padding-right: 10px;

          .view-more {
            &:hover {
              color: $color-primary;
            }
            cursor: pointer;
          }

          .topic-types {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            height: 40px;

            .title {
              padding-right: 10px;
              font-size: 14px;
              color: $color-text;
            }
          }
        }

        .color-red {
          color: red;
        }

        .color-green {
          color: #52c51d;
        }
      }
    }
  }
}
</style>
