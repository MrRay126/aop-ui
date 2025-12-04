<template>
  <div class="spread" ref="spread" v-loading="isLoadingReportConfigs">
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
                  <div class="channel-section">
                    <el-divider content-position="center"
                      ><span class="divide-line-text"
                        >监控渠道</span
                      ></el-divider
                    >
                    <div class="channel-wrapper">
                      <span class="title">
                        <span>监控渠道</span>
                        <el-tooltip
                          effect="light"
                          placement="top-start"
                          content="传播监控渠道，当前仅支持微博。"
                        >
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        <span> :</span>
                      </span>
                      &nbsp;
                      <el-select
                        class="channel-select"
                        size="mini"
                        v-model="channel"
                        @change="handleChannelChange"
                      >
                        <template v-for="(cItem, index) in channelOptions">
                          <el-option
                            :key="index"
                            :label="cItem.label"
                            :value="cItem.value"
                          ></el-option>
                        </template>
                      </el-select>
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
                    :hasHourTime="true"
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
                    <div class="bottom-content-top">
                      <div class="chart-container">
                        <div class="top">
                          <div class="title-wrapper">
                            <span class="title-text">传播路径</span>
                            <el-tooltip
                              content="以转发为互动行为进行连接，构建各个用户之间的传播网络。"
                              effect="light"
                              placement="top-start"
                            >
                              <i class="el-icon-info"></i>
                            </el-tooltip>
                          </div>
                          <div class="count-num-wrapper">
                            <span class="count-wrapper">
                              <span>曝光量 : </span
                              ><span>{{
                                typeof viewCount === "number"
                                  ? numeral(viewCount).format("0,00")
                                  : "-"
                              }}</span>
                            </span>
                            <span class="count-wrapper">
                              <span>内容量 : </span
                              ><span>{{
                                typeof contentCount === "number"
                                  ? numeral(contentCount).format("0,00")
                                  : "-"
                              }}</span>
                            </span>
                          </div>
                        </div>
                        <div
                          class="spread-chart-container"
                          :style="{ height: tableMaxHeight + 'px' }"
                        >
                          <template v-if="chartData.nodes.length > 0">
                            <spread-chart
                              :height="tableMaxHeight"
                              :chartData="chartData"
                              @click="handleClickSpread"
                            ></spread-chart>
                          </template>
                          <template v-else>
                            <span class="no-data">暂无数据</span>
                          </template>
                        </div>
                      </div>
                      <!-- 评价词表 -->
                      <div class="table-container">
                        <div class="top">
                          <div class="title-wrapper">
                            <el-tooltip
                              content="以扩散度为排序依据，top的用户为传播的意见领袖，可选择其数量。"
                              effect="light"
                              placement="top-start"
                            >
                              <i class="el-icon-info"></i>
                            </el-tooltip>
                            <span class="title"> 意见领袖数量:</span>
                            <el-select
                              v-model="leaderCount"
                              @change="handleLeaderCountChange"
                              size="mini"
                              class="counter"
                              style="width: 60px"
                            >
                              <template
                                v-for="(item, index) in leaderCountOptions"
                              >
                                <el-option
                                  :key="index"
                                  :label="item"
                                  :value="item"
                                ></el-option>
                              </template>
                            </el-select>
                          </div>

                          <div class="jump-title">
                            <span @click="handleViewMore" class="view-more">
                              <span>所有原创内容</span>
                              <span style="font-weight: bold">
                                {{ count }}
                              </span>
                              <span>条</span>
                              <i
                                class="el-icon-arrow-right"
                                style="font-size: 12px"
                              ></i>
                            </span>
                          </div>
                        </div>
                        <div class="table-wrapper">
                          <dynamic-table
                            border
                            :height="tableMaxHeight"
                            :dimension="dimension"
                            :source="tableData"
                            :loading="isLoadingTableData"
                            @toggle-row-expand="handleRowExpand"
                          >
                            <template v-slot:expand="{ row }">
                              <template v-if="row.isLoadingInfo">
                                <div class="info-container">
                                  <i class="el-icon-loading"></i>
                                </div>
                              </template>
                              <template v-else-if="row.info">
                                <div class="content-container">
                                  {{ JSON.stringify(row.info, null, 5) }}
                                </div>
                              </template>
                              <template v-else>
                                <div class="info-container">
                                  <span>暂无数据</span>
                                </div>
                              </template>
                            </template>
                          </dynamic-table>
                        </div>
                      </div>
                    </div>
                    <div class="bottom-content-bottom">
                      <div class="time-line-title-container">
                        <span>
                          <span class="time-line-title">意见领袖传播轴 </span>
                          <el-tooltip
                            content="意见领袖们发布内容的时间线。"
                            effect="light"
                            placement="top-start"
                          >
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </span>

                        <span
                          class="time-line-detail"
                          @click="handleViewTimeLineDetail"
                        >
                          详细时间轴 &gt;
                        </span>
                      </div>
                      <div class="time-line-container">
                        <!-- <time-line :timeLine="timeLineData"></time-line> -->
                        <bar-chart-simple
                          :chartData="timeLineData"
                          :hasXAxis="false"
                          :height="150"
                        ></bar-chart-simple>
                      </div>
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
                >传播分析</span
              >
              <span> / </span>
              <span>相关原创内容 </span>
              <span>( </span>
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
                    type: OpinionType.spread,
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
                :loading="isDownloadingDetail"
                @click="handleDownloadDetail"
                type="text"
                icon="el-icon-download"
              ></el-button>
            </span>
          </div>

          <div class="detail-table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                project_id: $store.getters.appId,
                filters: filter.filters,
                value: filter.value,
                time: time,
                channel: channel,
              }"
              apiAction="spread/getSpreadDetail"
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
        :reportType="OpinionType.spread"
        :isListDragable="false"
        :listData="reportsListData"
        @cancel="handleReportListCancel"
      ></reports-list-pannel>
    </el-drawer>

    <el-dialog
      class="time-line-dialog"
      title="意见领袖传播轴"
      :visible.sync="timelineDialogVisible"
      @open="handleOpen"
      @close="handleClose"
      width="950px"
    >
      <div v-loading="isLoadingList">
        <template v-if="list.length === 0">
          <div class="no-timeline-list-data">暂无数据</div>
        </template>
        <template v-else>
          <virtual-list
            :listData="list"
            :viewportWidth="900"
            :viewportHeight="500"
            :listItemHeight="60"
            :onReachBottom="handleReachBottom"
          >
            <template v-slot:default="scope">
              <div class="container">
                <template v-if="scope.data.item.position === 'right'">
                  <div class="list-item-container">
                    <div class="inner">
                      <div class="list-icon"></div>
                      <div class="list-content">
                        <div class="content-section">
                          <el-popover
                            placement="top-start"
                            title=""
                            width="300"
                            trigger="hover"
                            :content="`${scope.data.item.username}
                      ${scope.data.item.type}
                      : ${scope.data.item.content}
                      `"
                          >
                            <span slot="reference">
                              <span style="font-weight: bold">{{
                                scope.data.item.username
                              }}</span>
                              {{ scope.data.item.type }} :
                              {{ scope.data.item.content }}
                            </span>
                          </el-popover>
                        </div>
                        <div class="datetime-comment">
                          ( {{ scope.data.item.dateTime }}&nbsp;&nbsp; 转:<span
                            class="number"
                            >{{ scope.data.item.repost }}</span
                          >
                          评:<span class="number"
                            >{{ scope.data.item.comment }}
                          </span>
                          赞:<span class="number">{{
                            scope.data.item.favor
                          }}</span>
                          )
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="list-item-container-left">
                    <div class="inner">
                      <div class="list-icon"></div>
                      <div class="list-content">
                        <div class="content-section">
                          <el-popover
                            placement="top-start"
                            title=""
                            width="300"
                            trigger="hover"
                            :content="`${scope.data.item.username}
                      ${scope.data.item.type}
                      : ${scope.data.item.content}
                      `"
                          >
                            <span slot="reference">
                              <span style="font-weight: bold">
                                {{ scope.data.item.username }}</span
                              >
                              {{ scope.data.item.type }} :
                              {{ scope.data.item.content }}</span
                            >
                          </el-popover>
                        </div>
                        <div class="datetime-comment">
                          ( {{ scope.data.item.dateTime }}&nbsp;&nbsp; 转:
                          <span class="number">{{
                            scope.data.item.repost
                          }}</span>
                          评:<span class="number">{{
                            scope.data.item.comment
                          }}</span>
                          赞:<span class="number"
                            >{{ scope.data.item.favor }}
                          </span>
                          )
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </virtual-list>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import timeLine from "./components/timeLine";
import detailTable from "@/views/components/anylysisDetailTable";
import toolbar from "@/views/components/toolbar";
import mainSection from "@/views/components/mainSection";

//时间单位组件
import timeCalendar from "@/views/components/time-range-calendar";

import stepper from "@/views/components/stepper";

import { validEmptyFilterItem } from "@/views/components/filters/data.js";
import recentDay from "@/utils/timeData.js";
import { OpinionType } from "@/views/dashbord/data";
import { channelOptions, leaderCountOptions } from "./data.js";
import { commands } from "@/views/components/saveReport/data.js";
import saveReport from "@/views/components/saveReport";
import reportsListPannel from "@/views/dashbord/components/reportsListPannel.vue";
import spreadChart from "@/views/components/charts/spreadChart.vue";
import dynamicTable from "@/views/components/dynamicTable";
import barChartSimple from "@/views/components/charts/barChartSimple.vue";
import virtualList from "@/views/components/virtualList";
import numeral from "numeral";

import { anylysisMixin } from "@/views/mixins/anylysis.js";
import { filterCollectMixins } from "@/views/mixins/filterAndCollect.js";
import filterAndCollector from "@/views/components/filterAndCollector";
import aiSummary from "@/views/components/aiSummary";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  mixins: [anylysisMixin, filterCollectMixins],

  components: {
    // timeLine,
    toolbar,
    mainSection,
    timeCalendar,
    stepper,
    saveReport,
    reportsListPannel,
    spreadChart,
    detailTable,
    dynamicTable,
    barChartSimple,
    virtualList,
    filterAndCollector,
    aiSummary,
    xiaZuanInfo,
  },

  data() {
    return {
      isViewXiaZuan: false,
      isDownloadingXiazuan: false,

      xiaZuanRow: {},
      dimension: [
        {
          width: "50px",
          actionType: "expand", //
          // expandContentHtmlHandler: (header, row) => {

          //   return `<div style="padding:30px;line-height:25px;">${JSON.stringify(
          //     row.info,
          //     null,
          //     5
          //   )}</div>`;
          // },
        },

        {
          label: "用户",
          prop: "user",
          minWidth: "100px",
          // hasTooltip: true, //是否使用toolTip
        },
        {
          label: "关注度",
          prop: "focus_num",
          minWidth: "80px",
          // hasTooltip: true,
        },
        {
          label: "活跃度",
          prop: "active_num",
          minWidth: "80px",
          actionType: "info",
          tip: "相关帖子发布数",
          // hasTooltip: true,
        },
        {
          label: "扩散度",
          prop: "spread_num",
          actionType: "info",
          tip: "获得的总转发数",
          minWidth: "80px",
          // hasTooltip: true,
        },
        {
          label: "内容量",
          prop: "content_count",
          minWidth: "80px",
          // hasTooltip: true,
        },
        {
          label: "影响度",
          prop: "effect_num",
          actionType: "info",
          tip: "获得的总点赞数",
          minWidth: "80px",
          // hasTooltip: true,
        },
        {
          label: "讨论度",
          prop: "comments_count",
          // actionType: "info",
          // tip: "用户在传播中的中心程度",
          minWidth: "80px",
          // hasTooltip: true,
        },
      ],
      operationPerms: [],
      isDownloadingMain: false,
      isDownloadingDetail: false,
      viewCount: 0,
      contentCount: 0,
      count: 0, // 所有原创内容数量
      leaderCount: 10,
      tableData: [],

      chartData: {
        nodes: [],
        links: [],
        categories: [],
      },
      // 时间轴数据
      timeLineData: {
        source: [],
        dimensions: [],
      },
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

      pageTitle: "传播分析",
      comment: "分析某段时间内，内容的传播链路及关键节点（当前仅支持微博)",
      isLoadingReportConfigs: false,

      channel: channelOptions[0].value,
      channelOptions,

      time: {
        type: "relative",
        start: recentDay["1-7"].start,
        end: recentDay["1-7"].end,
        recent_day: "1-7",
      },

      leaderCountOptions,
      tableOptionsData: [], //过滤器列表数据

      tableMaxHeight: 300,
      isViewInfos: true,

      isLoadingTableData: false,
      isLoadingDetailTable: false,

      isCalculating: false,
      activeStep: 0,
      isErrorOccured: false,
      hasData: false,

      timelineDialogVisible: false,
      isLoadingList: false,
      list: [],
      listPager: { curPage: 0, pageSize: 10 },
    };
  },

  watch: {
    //监听app改变后初始化页面
    "$store.getters.appId": {
      handler(val, oldVal) {
        const isUserChangeProject = typeof oldVal === "number";
        if (isUserChangeProject) {
          this.resetPageStatus();
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

    handleRowExpand({ expanded, row }) {
      if (expanded && !row.info) {
        this.$set(row, "isLoadingInfo", true);

        this.$store
          .dispatch("spread/getUserCommentInfo", {
            project_id: this.$store.getters.appId,
            id: row.user_id,
            time: this.time,
          })
          .then((res) => {
            this.$set(row, "info", res);
          })
          .catch(() => {
            //
          })
          .finally(() => {
            this.$set(row, "isLoadingInfo", false);
          });
      }
    },
    handleClickSpread(item) {
      const link = item.data?.link;
      if (link) {
        window.open(link);
      }
    },
    numeral,
    handleOpen() {
      this.isLoadingList = true;
      this.listPager.curPage = 0;
      this.handleReachBottom((data) => {
        this.list = data || [];
        this.isLoadingList = false;
      });
    },

    handleClose() {
      this.list = [];
    },

    handleViewTimeLineDetail() {
      this.timelineDialogVisible = true;
    },

    // 时间轴弹窗滚动触底事件
    handleReachBottom(cb) {
      this.listPager.curPage++;
      const payload = {
        ...this.getCommonParams(),
        leader_count: this.leaderCount,
        ...this.listPager,
      };

      this.$store
        .dispatch("spread/getTimeLineMore", payload)
        .then((resData) => {
          if (resData.length > 0) {
            resData = resData.map((item) => {
              item.position = item.type === "转发" ? "left" : "right";
              return item;
            });

            cb(resData);
          } else {
            cb(false);
          }
        })
        .catch(() => {
          // noop
        });
    },

    handleDownloadDetail() {
      this.isDownloadingDetail = true;
      const payload = {
        urlParams: { download_type: "spread_detail" },
        data: { ...this.$refs["detailTable"].getParams() },
      };
      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloadingDetail = false;
      });
    },

    handleDownload() {
      this.isDownloadingMain = true;

      let payload = {
        urlParams: { download_type: "spread" },
        data: { ...this.getCommonParams() },
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
      this.isSaveDialogVisible = true;
      this.dialogMode = action;

      if (action === "update" || action === "saveAs") {
        this.reportData = {
          project_id: this.$store.getters.appId,
          id: this.reportId,
          name: this.pageTitle,
          comment: this.comment,
          type: OpinionType.spread,
          action,

          configs: {
            ...this.getCommonParams(),
            leader_count: this.leaderCount, // 意见领袖数量
          },
        };
      }

      if (action === "save") {
        this.reportData = {
          project_id: this.$store.getters.appId,
          id: null,
          name: "",
          comment: "",
          type: OpinionType.spread,
          action,
          configs: {
            ...this.getCommonParams(),
            leader_count: this.leaderCount, // 意见领袖数量
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
          this.pageTitle = data.name;
          this.comment = data.comment;
          this.filter.filters = data.configs.filters;
          this.filter.value = data.configs.value;
          this.time = data.configs.time;
          this.leaderCount = data.configs.leader_count;
          this.channel = data.configs.channel;
          this.operationPerms = data.perms || [];

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

    handleValueChange() {
      this.filter.filters = this.$options.data().filter.filters;
      this.setFilterOpionsData();
      this.alreadyCalculated = false;
    },

    handleChannelChange() {
      this.alreadyCalculated = false;
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

    getCommonParams() {
      let payload = {
        project_id: this.$store.getters.appId,
        filters: this.filter.filters,
        value: this.filter.value,
        time: this.time,
        channel: this.channel,
      };
      return payload;
    },

    handleLeaderCountChange() {
      this.getTableData();
    },

    getTableData() {
      this.timeLineData = this.$options.data().timeLineData;
      this.isLoadingTableData = true;

      let payload = {
        ...this.getCommonParams(),
        leader_count: this.leaderCount,
      };

      this.$store
        .dispatch("spread/getSpreadTable", payload)
        .then((data) => {
          this.tableData = data.results;
          this.count = data.all_content_count;

          // 时间轴数据
          this.timeLineData = data.timeLineData.chart;
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingTableData = false;
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
      if (this.count > 0) {
        this.isViewInfos = false;
      }
    },

    handleBackToInfoTables() {
      this.isViewInfos = true;
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
      this.handleBackToInfoTables();
      this.calculateSpread();
    },

    resetPageStatus() {
      const data = this.$options.data();
      this.isCalculating = data.isCalculating;
      this.activeStep = data.activeStep;
      this.isErrorOccured = data.isErrorOccured;
      this.hasData = data.hasData;
      this.isViewInfos = data.isViewInfos;
      this.isLoadingTableData = data.isLoadingTableData;
      this.isLoadingDetailTable = data.isLoadingDetailTable;

      //设置数据
      this.tableData = data.tableData;
    },

    //刷新按钮
    handleRefresh() {
      this.calculateSpread();
    },

    //获取面板数据
    async calculateSpread() {
      this.resetPageStatus();
      const predealStatus = 0; // 预处理
      const workingStatus = 1; //计算中
      const finishedStatus = 3; //计算完成 设置为3 使步骤条变成对号状态 否则设置为2为黑色焦点状态

      let payload = this.getCommonParams();
      payload.click = 1;

      let resData = {};
      try {
        this.isCalculating = true;
        this.isErrorOccured = false;
        this.alreadyCalculated = false;
        resData = await this.$store.dispatch(
          "spread/calculateSpreads",
          payload
        );
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
          this.calculateSpread();
        }, 2000);
      }

      if (resData.status === 2) {
        this.activeStep = workingStatus;
        //获取数据
        setTimeout(() => {
          this.calculateSpread();
        }, 2000);
      }

      if (resData.status === 3) {
        this.activeStep = finishedStatus; //设置

        setTimeout(() => {
          //半秒中的step进度条显示过程
          this.isCalculating = false;
          this.hasData = true;

          this.alreadyCalculated = true;

          this.chartData = resData.chartData;

          this.viewCount = resData.viewCount;
          this.contentCount = resData.contentCount;

          this.$nextTick(initTableData);
        }, 500);
      }

      function initTableData() {
        this.getTableData();
      }
    },
    setTableHeight() {
      window.addEventListener(
        "resize",
        () => {
          if (this.$refs["container"]) {
            this.tableMaxHeight =
              this.$refs["container"].getBoundingClientRect().height - 50 - 196;
          }
        },
        false
      );

      this.$nextTick(() => {
        if (this.$refs["container"]) {
          this.tableMaxHeight =
            this.$refs["container"].getBoundingClientRect().height - 50 - 196;
        }
      });
    },

    async initReportByConditions(router) {
      // this.resetQueryData();
      await this.getFilterOptions();

      this.reportId = router.query["id"] || null;
      if (this.reportId) {
        this.initReportShow(this.reportId);
        this.pageMode = "edit";
        return;
      } else {
        this.isLoadingReportConfigs = false;
      }

      // 详情页携带contentId跳转到传播分析时查看
      const contentId = router.query["contentId"];
      const channelName = router.query["channelName"];

      if (channelName) {
        const channelFind = this.channelOptions.find((item) => {
          return item.label === channelName;
        });

        if (channelFind) {
          this.channel = channelFind.value;
        }
      }

      if (contentId) {
        this.filter.filters = {
          relTag: "and",
          children: [
            {
              key: "org_id",
              relation: "eq",
              value: [contentId],
            },
          ],
        };
      }

      if (channelName && contentId) {
        this.handleCalculate();
      }
    },
  },

  beforeRouteUpdate(to, from, next) {
    // console.log();
    this.initReportByConditions(to);
    next();
  },

  created() {
    this.initReportByConditions(this.$route);
  },

  mounted() {
    this.setTableHeight();
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

.content-container {
  padding: 20px;
  line-height: 25px;
}

.info-container {
  width: 100%;
  padding: 20px;
  text-align: center;
}

.btn-container {
  padding: 10px;
  text-align: right;
}

.spread {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;

  .time-line-dialog {
    .container {
      // width: 820px;
      border: 0px solid #ccc;

      .username-and-type {
        vertical-align: middle;
      }

      .content-section {
        display: inline-block;
        width: 260px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        vertical-align: middle;
      }

      .list-item-container {
        text-align: right;

        .inner {
          width: calc(50% + 1px);
          box-sizing: border-box;
          display: inline-block;
          position: relative;
          border-left: 1px solid #ccc;
          padding-left: 10px;
          height: 60px;
          text-align: left;

          .list-icon {
            position: absolute;
            left: 0;
            top: 0;
            transform: translate(-50%, 0);
            width: 10px;
            height: 10px;
            border: 2px solid rgb(0, 162, 255);
            background-color: #fff;
            border-radius: 5px;
          }

          .list-content {
            font-size: 12px;
            margin-top: -3px;

            .datetime-comment {
              margin-top: 5px;

              .number {
                font-weight: bold;
              }
            }
          }
        }
      }

      .list-item-container-left {
        text-align: left;
        .inner {
          box-sizing: border-box;
          width: 50%;
          display: inline-block;
          position: relative;
          border-right: 1px solid #ccc;
          padding-right: 10px;
          height: 60px;
          text-align: right;

          .list-icon {
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(50%, 0);
            width: 10px;
            height: 10px;
            border: 2px solid rgb(0, 162, 255);
            background-color: #fff;
            border-radius: 5px;
          }

          .list-content {
            font-size: 12px;
            margin-top: -3px;

            .datetime-comment {
              margin-top: 5px;

              .number {
                font-weight: bold;
              }
            }
          }
        }
      }
    }

    .no-timeline-list-data {
      padding-top: 180px;
      text-align: center;
      height: 400px;
    }
  }

  .el-icon-info {
    font-size: 14px;
  }

  .reports-drawer {
    ::v-deep(.data-view-panel .title) {
      display: none;
    }

    ::v-deep(.data-view-panel) {
      width: 100%;
    }
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

      .refresh-btn {
        margin-right: 5px;
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
          min-height: 60%;
          overflow: auto;

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
        .channel-section {
          padding-top: 20px;
          height: 200px;

          .channel-wrapper {
            padding: 10px;

            .title {
              font-size: 14px;
              color: $color-text;
            }

            .channel-select {
              width: 100px;
            }
          }

          .divide-line-text {
            color: #ccc;
          }
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
        padding-bottom: 5px;
      }

      .bottom-container {
        // padding: 20px;
        background: #fff;
        height: calc(100% - 70px);
        position: relative;
        overflow-y: hidden;

        .bottom-content-top {
          width: 100%;
          height: calc(100% - 186px);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          overflow-x: auto;
          overflow-y: hidden;

          .chart-container {
            flex: 1 1 auto;
            padding: 0 10px;
            color: $color-text;
            width: 400px;
            margin-right: 10px;
            overflow: hidden;

            .top {
              display: flex;
              align-items: center;
              justify-content: space-between;
              color: $color-text;
              padding: 10px;
              height: 48px;

              .title-wrapper {
                font-size: 16px;

                .title-text {
                  margin-right: 5px;
                }
              }

              .count-num-wrapper {
                font-size: 12px;

                .count-wrapper {
                  margin-left: 10px;
                }
              }
            }

            .spread-chart-container {
              width: 100%;
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

            .title {
              height: 40px;
              font-size: 14px;

              .view-word-name {
                padding: 0 3px;
              }
            }
          }

          .table-container {
            flex: 1 1 auto;
            width: 300px;
            height: 100%;
            padding: 0 10px;

            .view-more {
              &:hover {
                color: $color-primary;
              }
              cursor: pointer;
            }

            .top {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              height: 48px;
              min-width: 390px;
              color: $color-text;
              padding: 11px;

              .title {
                margin-right: 5px;
                font-size: 16px;
                // vertical-align: middle;
              }

              .jump-title {
                font-size: 14px;
              }

              .counter {
                width: 100px;
                margin-left: 20px;
              }
            }
          }
        }

        .bottom-content-bottom {
          width: 100%;
          padding-top: 10px;

          .time-line-container {
            width: 100%;
            height: 150px;
            overflow: auto;
          }
          .time-line-title-container {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .time-line-title {
              padding-left: 20px;
              color: $color-text;
            }

            .time-line-detail {
              font-size: 14px;
              color: $color-text;
              margin-right: 15px;
              cursor: pointer;

              &:hover {
                text-decoration: underline;
              }
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
          flex: 0 0 auto;
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
