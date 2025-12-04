<template>
  <div class="theme" ref="theme" v-loading="isLoadingReportConfigs">
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
                      ><span class="divide-line-text"
                        >分析话题</span
                      ></el-divider
                    >
                    <div class="grouper-wraper">
                      <div class="title-container">
                        <span class="star-icon">*</span>
                        <span class="watch-word">监控词</span>
                        <el-tooltip
                          placement="top-start"
                          effect="light"
                          content="支持自定义、热词、热词组三种输入监控词的方式，最多可配置10个监控词。"
                        >
                          <span class="el-icon-info"></span>
                        </el-tooltip>
                      </div>
                      <div class="watch-type-container">
                        <el-radio
                          v-model="watchType"
                          :label="WATCH_TYPE.noLimit"
                          @change="handleRadioChange"
                          >不限制</el-radio
                        >
                      </div>
                      <div class="watch-type-container">
                        <el-radio
                          v-model="watchType"
                          :label="WATCH_TYPE.custom"
                          @change="handleRadioChange"
                          >自定义监控词</el-radio
                        >
                        <el-select
                          v-model="customValue"
                          @change="handleCustomSelectChange"
                          @focus="handleCustomSelectFocus"
                          :disabled="watchType !== WATCH_TYPE.custom"
                          :multiple-limit="10"
                          class="watch-type-select"
                          placeholder="请输入"
                          size="mini"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                        >
                          <template
                            v-for="(item, index) in cutsomSelectOptions"
                          >
                            <el-option
                              :key="index"
                              :label="item"
                              :value="item"
                            ></el-option>
                          </template>
                        </el-select>
                      </div>
                      <div class="watch-type-container">
                        <el-radio
                          v-model="watchType"
                          :label="WATCH_TYPE.word"
                          @change="handleRadioChange"
                          >热词</el-radio
                        >
                        <el-select
                          v-model="wordValue"
                          @change="handleWordSelectChange"
                          :disabled="watchType !== WATCH_TYPE.word"
                          :multiple-limit="10"
                          class="watch-type-select"
                          size="mini"
                          multiple
                          filterable
                        >
                          <template v-for="(item, index) in wordOptions">
                            <el-option
                              :label="item.label"
                              :value="item.value"
                              :key="index"
                            ></el-option>
                          </template>
                        </el-select>
                      </div>
                      <div class="watch-type-container">
                        <el-radio
                          v-model="watchType"
                          :label="WATCH_TYPE.wordGroup"
                          @change="handleRadioChange"
                          >热词组</el-radio
                        >
                        <el-select
                          v-model="groupValue"
                          @change="handleWordGroupSelectChange"
                          :disabled="watchType !== WATCH_TYPE.wordGroup"
                          class="watch-type-select"
                          size="mini"
                        >
                          <template v-for="(item, index) in wordGroupOptions">
                            <el-option
                              :label="item.label"
                              :value="item.value"
                              :key="index"
                            ></el-option>
                          </template>
                        </el-select>
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
                    type="primary"
                    :loading="isCalculating"
                    @click="handleCalculate"
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
                        <!-- 占位元素 -->
                      </div>
                      <el-table
                        class="data-table"
                        row-class-name="table-row"
                        :data="wordTypesTableData"
                        :max-height="tableMaxHeight"
                        :height="tableMaxHeight"
                        v-loading="isLoadingWordTypesTable"
                        ref="keyWordTable"
                        @row-click="handleKeyWordRowClick"
                        :highlight-current-row="true"
                      >
                        <el-table-column prop="rank" label="排名" width="100">
                        </el-table-column>
                        <el-table-column prop="word" label="监控词" width="100">
                        </el-table-column>
                        <el-table-column prop="volume" label="声量" width="100">
                        </el-table-column>
                        <el-table-column label="波动" width="100">
                          <template slot="header">
                            <el-tooltip
                              content="统计期最后一日环比变动值"
                              placement="top"
                            >
                              <div>
                                <span class="header-text">波动</span
                                ><i class="el-icon-info header-info-title"></i>
                              </div>
                            </el-tooltip>
                          </template>
                          <template slot-scope="scope">
                            <template
                              v-if="typeof scope.row.data.count === 'number'"
                            >
                              <template v-if="scope.row.data.count === 0">
                                <span>0</span>
                              </template>
                              <template v-else>
                                <template v-if="scope.row.data.isUp">
                                  <span class="color-green"
                                    >▲
                                    <span
                                      >{{ scope.row.data.count }}%</span
                                    ></span
                                  >
                                </template>
                                <template v-else>
                                  <span class="color-red"
                                    >▼
                                    <span
                                      >{{ scope.row.data.count }}%</span
                                    ></span
                                  >
                                </template>
                              </template>
                            </template>
                            <template v-else> - </template>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <!-- 评价词表 -->
                    <div class="table-container-second">
                      <template v-if="wordTable">
                        <div class="word-types">
                          <el-radio-group
                            size="mini"
                            :disabled="dispositionDisabled"
                            v-model="wordDisposition"
                            @change="handleDispositiobRadioChange"
                          >
                            <el-radio-button :label="positive">
                              <span>{{ dispositionDict.positive }}&nbsp;</span>
                              <span>{{ wordTable[positive].percent }} </span>
                            </el-radio-button>
                            <el-radio-button :label="negative">
                              <span>{{ dispositionDict.negative }}&nbsp;</span>
                              <span>{{ wordTable[negative].percent }} </span>
                            </el-radio-button>
                            <el-radio-button :label="others">
                              <span>{{ dispositionDict.others }}&nbsp;</span>
                              <span>{{ wordTable[others].percent }} </span>
                            </el-radio-button>
                          </el-radio-group>
                        </div>
                        <div>
                          <el-table
                            :data="wordTable[wordDisposition].data"
                            class="data-table"
                            row-class-name="table-row"
                            :max-height="tableMaxHeight"
                            :height="tableMaxHeight"
                            v-loading="isLoadingDispositionTable"
                            ref="dispositionTable"
                            @row-click="handleDispositionRowClick"
                            :highlight-current-row="true"
                          >
                            <el-table-column prop="word">
                              <template slot="header">
                                <el-tooltip
                                  content="监控词的相关评价"
                                  placement="top"
                                >
                                  <div>
                                    <span class="header-text">口碑词</span
                                    ><i
                                      class="el-icon-info header-info-title"
                                    ></i>
                                  </div>
                                </el-tooltip>
                              </template>
                            </el-table-column>
                            <el-table-column prop="volume" label="声量">
                            </el-table-column>
                          </el-table>
                        </div>
                      </template>
                    </div>
                    <!-- 评价内容 和时间表 -->
                    <div class="table-container-third">
                      <div class="title">
                        <span @click="handleViewMore" class="view-more">
                          <span>所有</span>
                          <span style="font-weight: bold">{{
                            contentTypeText
                          }}</span>
                          <span>内容</span>
                          <span style="font-weight: bold">
                            {{ wordTable[wordDisposition].count }} </span
                          >条<i
                            class="el-icon-arrow-right"
                            style="font-size: 12px"
                          ></i>
                        </span>
                      </div>
                      <dynamic-table
                        :dimension="dimensions"
                        :source="detailTable"
                        :loading="isLoadingDetailTable"
                        :height="tableMaxHeight"
                        :filter="filter"
                        :filterOptions="filterOptions"
                        sortMode="single"
                        :hasPagination="false"
                        :contentHandler="preDealContent"
                        border="inner"
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
          <div class="top-path">
            <span>
              <span class="path-pre" @click="handleBackToInfoTables">{{
                keywordRow.word
              }}</span>
              <span> / </span>
              <span style="font-weight: bold">{{ keywordRow.word }}</span>
              <span>的</span>
              <span>{{ dispositionDict[wordDisposition] }}</span>
              <span>数据详情</span>
              <span> (</span>
              <span>分析时段 </span>
              <span
                >{{ time.start.split(" ")[0] }} ~
                {{ time.end.split(" ")[0] }}</span
              >
              <span> )</span>
            </span>

            <span>
              <span style="margin-right: 10px">
                <ai-summary
                  :configs="{
                    ...getCommonParams(),
                    type: OpinionType.theme,
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
                :loading="isDownLoadingDetail"
                type="text"
                icon="el-icon-download"
              ></el-button>
            </span>
          </div>

          <div class="detail-table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                word: keywordRow.word,
                sentiment_rough: wordDisposition,

                project_id: $store.getters.appId,
                filters: filter.filters,
                time: time,
                value: filter.value,
                groups: getGroupValue(),
              }"
              :markContentWords="[keywordRow.word]"
              apiAction="theme/getDetailTableData"
              @event="handleDetailTableEvent"
            ></detail-table>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="xia-zuan-info">
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
      </div>
    </template>

    <save-report
      :visible="isSaveDialogVisible"
      @close="handleCloseSaveDialog"
      @saved="handleReportSaved"
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
        :reportType="OpinionType.theme"
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
import { DISPOSITION, WATCH_TYPE, getDimension } from "./data.js";
import { validEmptyFilterItem } from "@/views/components/filters/data.js";
import recentDay from "@/utils/timeData.js";
import { OpinionType } from "@/views/dashbord/data";
import { commands } from "@/views/components/saveReport/data.js";
import saveReport from "@/views/components/saveReport";
import reportsListPannel from "@/views/dashbord/components/reportsListPannel.vue";
import { anylysisMixin, editTableMixin } from "@/views/mixins/anylysis.js";
import { filterCollectMixins } from "@/views/mixins/filterAndCollect.js";
import filterAndCollector from "@/views/components/filterAndCollector";
import aiSummary from "@/views/components/aiSummary";
import dynamicTable from "@/views/components/dynamicTable";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

// console.log("editTableMixin:::", editTableMixin);
export default {
  mixins: [anylysisMixin, filterCollectMixins, editTableMixin],

  components: {
    toolbar,
    mainSection,
    timeCalendar,
    stepper,
    saveReport,
    reportsListPannel,
    detailTable,
    filterAndCollector,
    aiSummary,
    dynamicTable,
    xiaZuanInfo,
  },

  data() {
    return {
      isViewXiaZuan: false,
      xiaZuanRow: {},
      isDownloadingXiazuan: false,

      dimensions: [],
      filter: {},
      filterOptions: {},

      cutsomSelectOptions: [],
      operationPerms: [],
      isDownloadingMain: false,
      isDownLoadingDetail: false,
      watchType: WATCH_TYPE.noLimit, // custom  word  wordGroup
      customValue: [],
      wordValue: [],
      groupValue: null,
      wordOptions: [
        // { label: "热词1", value: "word1" },
      ],
      wordGroupOptions: [
        // { label: "热词组1", value: "word_group1" }
      ],

      WATCH_TYPE,
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

      pageTitle: "话题分析",
      comment: "利用ABAS能力，分析某段时间内，某个/某些词的对应观点及情绪。",
      isLoadingReportConfigs: false,

      tableOptionsData: [], //过滤器列表数据
      dispositionDisabled: false,

      time: {
        type: "relative", // absolute|relative 绝对时间|相对时间
        start: recentDay["1-7"].start, //"2021/8/1 0:0:0", //开始时间字符串
        end: recentDay["1-7"].end, //"2021/8/30 23:59:59", //结束时间字符串
        recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      },

      tableMaxHeight: 300,
      isViewInfos: true,
      isLoadingWordTypesTable: false,
      isLoadingDispositionTable: false,
      isLoadingDetailTable: false,
      isLoadingMoreDetailTable: false,

      wordDisposition: DISPOSITION.positive,
      // first table
      wordTypesTableData: [],
      // [
      //   {
      //     rank: 1,
      //     word: "角色",
      //     volume: 12000,
      //     data: { isUp: true, count: 200 },
      //   },
      //   {
      //     rank: 2,
      //     word: "武器",
      //     volume: 12000,
      //     data: { isUp: false, count: 200 },
      //   },
      // ],
      // second table
      wordTable: {
        positive: {
          percent: "",
          count: 0, // 所有评价内容量
          data: [
            // { word: "钻石", volume: 100 },
            // { word: "好用", volume: 200 },
          ],
        },
        negative: {
          percent: "",
          count: 0, // 所有评价内容量
          data: [
            // { word: "垃圾", volume: 100 },
            // { word: "难用", volume: 200 },
          ],
        },
        others: {
          percent: "",
          count: 0, // 所有评价内容量
          data: [
            // { word: "一般", volume: 100 },
            // { word: "无所谓", volume: 200 },
          ],
        },
      },
      //third table
      detailTable: [
        // { content: "钻石级别的游戏啊", time: "2020/12/21", channel: "微博" },
        // { content: "不错啊哈哈哈", time: "2020/12/01", channel: "微博" },
      ],

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },

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
      const disposition = this.wordDisposition;

      let text = this.dispositionDict[disposition];
      return text;
    },
  },

  watch: {
    //监听app改变后初始化页面
    "$store.getters.appId": {
      handler(val, oldVal) {
        // console.log("val, oldVal:", val, oldVal);
        const isUserChangeProject = typeof oldVal === "number";
        if (isUserChangeProject) {
          this.resetPageStatus();
          this.getFilterOptions();

          this.resetPageData();
          // 获取热词和热词组options
          this.getWordOptions();
          this.getWordGroupOptions();
          this.pageMode = "view";

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

    preDealContent(header, content) {
      // 数据映射处理
      if (["textType", "emotion"].includes(header.prop)) {
        content = content ? content.label : "";
      }

      return content;
    },

    handleWordGroupSelectChange() {
      this.alreadyCalculated = false;
    },

    handleCustomSelectChange() {
      this.alreadyCalculated = false;
      this.cutsomSelectOptions = this.customValue;
    },

    handleCustomSelectFocus() {
      this.cutsomSelectOptions = this.customValue;
    },

    handleWordSelectChange() {
      this.alreadyCalculated = false;
    },
    //1 清除热词热词组的筛选项值 , 2 filters会在获取options清除 , 3 清除页面报表的title
    resetPageData() {
      this.customValue = [];
      this.wordValue = [];
      this.groupValue = null;
      this.pageTitle = this.$options.data().pageTitle;
    },
    handleRadioChange() {
      this.customValue = [];
      this.wordValue = [];
      this.groupValue = null;
      this.alreadyCalculated = false;
    },

    getGroupValue() {
      const dict = {
        [WATCH_TYPE.noLimit]: null,
        [WATCH_TYPE.custom]: this.customValue,
        [WATCH_TYPE.word]: this.wordValue,
        [WATCH_TYPE.wordGroup]: [this.groupValue],
      };

      return {
        watchType: this.watchType,
        value: dict[this.watchType],
      };
    },

    setGroupValue(type, value) {
      if (!type || !Array.isArray(value)) return;

      if (type === WATCH_TYPE.custom) {
        this.customValue = value;
      }

      if (type === WATCH_TYPE.word) {
        this.wordValue = value;
      }

      if (type === WATCH_TYPE.wordGroup) {
        this.groupValue = value[0];
      }
    },

    handleDownload() {
      this.isDownloadingMain = true;
      const payload = {
        urlParams: { download_type: "theme" },
        data: { ...this.getCommonParams() },
      };

      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloadingMain = false;
      });
    },

    handleDownloadDetail() {
      this.isDownloadingDetail = true;
      const payload = {
        urlParams: { download_type: "theme_detail" },
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

    handleRefreshDetail() {
      this.$refs["detailTable"].getTableData();
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

    // //是否有主题设置
    // hasThemeSettingData() {
    //   return (
    //     this.customValue.length > 0 ||
    //     this.wordValue.length > 0 ||
    //     this.groupValue
    //   );
    // },

    handleSaveAction(action) {
      // console.log("action::", action);

      // if (!this.hasThemeSettingData()) {
      //   this.$message({
      //     type: "warning",
      //     message: "请添加监控词!",
      //     duration: 3000,
      //   });
      //   return;
      // }

      this.isSaveDialogVisible = true;
      this.dialogMode = action;

      if (action === "update" || action === "saveAs") {
        this.reportData = {
          project_id: this.$store.getters.appId,
          id: this.reportId,
          name: this.pageTitle,
          comment: this.comment,
          type: OpinionType.theme,
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
          type: OpinionType.theme,
          action,
          configs: this.getCommonParams(),
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
          this.time = data.configs.time;
          this.particle = data.configs.particle;

          this.filter.filters = data.configs.filters;
          this.filter.value = data.configs.value;
          this.pageTitle = data.name;
          this.comment = data.comment;
          this.watchType = data.configs.groups.watchType;
          this.operationPerms = data.perms || [];

          this.setGroupValue(this.watchType, data.configs.groups.value);

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

    //
    markContent(content, word) {
      let reg = new RegExp(`(${word})`, "g");
      content = content.replace(reg, "<span style='color:red'>$1</span>");
      return content;
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

    // 获取热词 分组项options
    getWordOptions() {
      const payload = {
        project_id: this.$store.getters.appId,
        type: "hotword",
      };
      this.$store
        .dispatch("theme/getWordOptions", payload)
        .then((data) => {
          this.wordOptions = data;
        })
        .catch(() => {
          // noop
        });
    },

    // 获取热词组 分组项options
    getWordGroupOptions() {
      this.wordGroupOptions = [];
      const payload = {
        project_id: this.$store.getters.appId,
        type: "hotwordgroup",
      };
      this.$store
        .dispatch("theme/getWordGroupOptions", payload)
        .then((data) => {
          this.wordGroupOptions = data;
        })
        .catch(() => {
          // noop
        });
    },

    handleGroupperChange() {
      this.alreadyCalculated = false;
    },

    handleKeyWordRowClick(row) {
      this.keywordRow = row;
      this.setKeywordTableFocusRow(row);

      this.getDispositionTableData(row, () => {
        if (this.wordTable[this.wordDisposition].data.length > 0) {
          //重置倾向标签
          const firstRow = this.wordTable[this.wordDisposition].data[0];
          //获取详情数据
          this.handleDispositionRowClick(firstRow);
        }
      });

      //初始化显示数据
      const data = this.$options.data();
      this.wordTable = data.wordTable;
      this.detailTable = [];
    },

    setKeywordTableFocusRow(row) {
      if (row && this.$refs["keyWordTable"]) {
        this.$refs["keyWordTable"].setCurrentRow(row);
      }
    },

    setDispositionTableFocusRow(row) {
      if (row && this.$refs["dispositionTable"]) {
        this.$refs["dispositionTable"].setCurrentRow(row);
      }
    },

    handleDispositiobRadioChange() {
      this.setDispositionTableFocusRow(this.dispositionRow);
    },

    handleDispositionRowClick(row) {
      this.dispositionRow = row;
      this.setDispositionTableFocusRow(row);
      this.getDetailTableData(row);

      //初始化显示数据
      this.pager = this.$options.data().pager;
      this.detailTable = [];
    },

    getCommonParams() {
      let payload = {
        project_id: this.$store.getters.appId,
        filters: this.filter.filters,
        time: this.time,
        value: this.filter.value,
        // time_unit: this.particle,
        groups: this.getGroupValue(),
      };

      return payload;
    },

    // api table2数据
    getDispositionTableData(row, cb = null) {
      this.isLoadingDispositionTable = true;
      // this.wordTable={}
      this.detailTable = [];
      let payload = {
        ...this.getCommonParams(),
        word: row.word,
      };

      this.$store
        .dispatch("theme/getDispositionTableData", payload)
        .then((data) => {
          //评价词
          this.wordTable = data.word;
          if (typeof cb === "function") {
            cb(data.word);
          }
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingDispositionTable = false;
        });
    },

    //api //获取详table数据
    getDetailTableData(row) {
      this.isLoadingDetailTable = true;

      let payload = {
        ...this.getCommonParams(),
        word: this.keywordRow.word,
        opinion: row.word,
        pager: {
          curPage: 1,
          pageSize: 20,
        },
        sentiment_rough: this.wordDisposition,
      };
      this.$store
        .dispatch("theme/getDetailTableData", payload)
        .then((data) => {
          this.detailTable = data.list;
          this.pager = data.pager;
          this.filterOptions = data.filterOptions;
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingDetailTable = false;
        });
    },

    //浏览具体的网页
    // jumpToViewDataPage({ row }) {
    //   console.log("row:", row);
    //   if (row.link) {
    //     window.open(row.link);
    //   } else {
    //     this.$message({
    //       message: "该内容无外部链接!",
    //       duration: 3000,
    //       type: "info",
    //     });
    //   }
    // },

    handleViewMore() {
      if (!this.alreadyCalculated) {
        this.$message({
          message: "请点击计算后查看数据详情!",
          type: "info",
        });
        return;
      }
      if (this.wordTable[this.wordDisposition].count > 0) {
        this.isViewInfos = false;
      }
    },

    handleBackToInfoTables() {
      this.isViewInfos = true;
      this.$nextTick(() => {
        this.setKeywordTableFocusRow(this.keywordRow);
        this.setDispositionTableFocusRow(this.dispositionRow);
      });
    },

    handleCalculate() {
      const isFilterValidPass = validEmptyFilterItem(this.filter.filters);
      if (!isFilterValidPass) {
        this.$message({
          message: "分析条件存在未设置的值,请设置后计算!",
          type: "info",
        });
        return;
      }

      const isValidWatchWordPass = this.validWatchWord();
      if (!isValidWatchWordPass) {
        this.$message({
          message: "请输入分析话题的内容",
          type: "info",
        });
        return;
      }

      this.handleBackToInfoTables();
      this.getPageData();
    },

    validWatchWord() {
      const notPass =
        (this.watchType === WATCH_TYPE.custom &&
          this.customValue.length === 0) ||
        (this.watchType === WATCH_TYPE.word && this.wordValue.length === 0) ||
        (this.watchType === WATCH_TYPE.wordGroup && !this.groupValue);
      return !notPass;
    },

    resetPageStatus() {
      const data = this.$options.data();
      this.isCalculating = data.isCalculating;
      this.activeStep = data.activeStep;
      this.isErrorOccured = data.isErrorOccured;
      this.hasData = data.hasData;
      this.isViewInfos = data.isViewInfos;
      this.isLoadingWordTypesTable = data.isLoadingWordTypesTable;
      this.isLoadingDispositionTable = data.isLoadingDispositionTable;
      this.isLoadingDetailTable = data.isLoadingDetailTable;

      //设置数据
      this.wordTypesTableData = data.wordTypesTableData;
      this.wordTable = data.wordTable;
      this.detailTable = data.detailTable;

      this.keywordRow = {};
      this.dispositionRow = {};
      this.pager = data.pager;
    },

    //刷新按钮
    handleRefresh() {
      this.getPageData();
    },

    //获取面板数据
    async getPageData() {
      this.resetPageStatus();
      const predealStatus = 0; // 预处理
      const workingStatus = 1; //计算中
      const finishedStatus = 3; //计算完成 设置为3 使步骤条变成对号状态 否则设置为2为黑色焦点状态

      let payload = this.getCommonParams();
      payload.click = 1;

      let resData = {};
      try {
        this.isLoadingWordTypesTable = true;
        this.isCalculating = true;
        this.isErrorOccured = false;
        this.alreadyCalculated = false;
        resData = await this.$store.dispatch(
          "theme/getKeyWordTableData",
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

      if (resData.status === 3) {
        this.activeStep = finishedStatus; //设置

        setTimeout(() => {
          //半秒中的step进度条显示过程
          this.isCalculating = false;
          this.hasData = true;
          this.isLoadingWordTypesTable = false;
          this.alreadyCalculated = true;

          this.wordTypesTableData = resData.ranks;

          this.$nextTick(initTableData);
        }, 500);
      }

      function initTableData() {
        //获取口碑词和详情内容表数据
        if (resData.ranks.length > 0) {
          const firtRowOfWord = resData.ranks[0];
          this.handleKeyWordRowClick(firtRowOfWord);
        }
      }
    },

    setTableHeight() {
      window.addEventListener(
        "resize",
        () => {
          if (this.$refs["container"]) {
            this.tableMaxHeight =
              this.$refs["container"].getBoundingClientRect().height - 70;
          }
        },
        false
      );

      this.$nextTick(() => {
        if (this.$refs["container"]) {
          this.tableMaxHeight =
            this.$refs["container"].getBoundingClientRect().height - 70;
        }
      });
    },

    async initEditReport(router) {
      await this.getFilterOptions();
      this.getWordOptions();
      this.getWordGroupOptions();

      // 重置分组项等数据
      this.resetPageData();

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

    // 获取整体情感options选项
    this.getEmotionOptions();
    // 获取文本类型options选项
    this.getTextTypeOptions();

    this.dimensions = getDimension(this);
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

::v-deep(.vxe-table--header-wrapper) {
  color: #909399 !important;
  background-color: #fff !important;
}

.btn-container {
  padding: 10px;
  text-align: right;
}

.theme {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;

  .detail-table-container {
    height: calc(100% - 50px);
  }

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

    ::v-deep(.more-contents-table-row) {
      cursor: pointer;
    }

    .pagination-container {
      margin-top: 15px;
      text-align: center;

      .pagination {
        display: inline-block;
      }
    }

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
        height: calc(100% - $btnsContainerHeight);
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
          width: 100%;
          display: flex;
          font-size: 14px;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          min-height: 50%;

          .grouper-wraper {
            padding: 0 10px;
            width: 100%;

            .watch-type-select {
              width: 150px;
            }

            .watch-type-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 10px;
            }

            .title-container {
              margin-bottom: 15px;

              & span {
                margin-right: 5px;
              }

              .star-icon {
                color: red;
              }

              .watch-word {
                font-size: 14px;
              }
            }
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
      overflow: auto;

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
        overflow-x: auto;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        background: #fff;
        height: calc(100% - 70px);
        position: relative;
        padding: 0 5px;

        & > div:not(:last-child) {
          margin-right: 2%;
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
        }

        .table-container-first {
          flex: 0 0 auto;

          // width: 32%;
          .title {
            height: 40px;
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
          flex: 0 0 auto;
          width: 300px;
          height: 100%;
          .word-types {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            height: 40px;
          }
        }
        .table-container-third {
          flex: 1 0 auto;
          width: 32%;

          .view-more {
            &:hover {
              color: $color-primary;
            }
          }

          .content-section {
            white-space: pre;
            text-overflow: ellipsis;
            overflow: hidden;
            height: 20px;
          }

          .title {
            height: 40px;
            font-size: 14px;
            color: $color-text;
            text-align: right;
            line-height: 40px;
            padding-right: 10px;
            cursor: pointer;
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
