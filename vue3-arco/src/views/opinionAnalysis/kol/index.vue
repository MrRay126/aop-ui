<template>
  <div class="kol-analysis" v-loading="isLoadingReportConfigs">
    <template v-if="!isViewXiaZuan">
      <!-- 主页面内容 -->
      <template v-if="isViewInfos">
        <toolbar
          :isDashbord="false"
          :isShowReportListOpener="false"
          :downloading="isDownloadingMain"
          title="KOL分析"
          :comment="comment"
          :disabledSettings="{
            refresh: !user.id,
            download: !user.id,
            report: false,
          }"
          @refresh="handleRefresh"
          @download="handleDownload"
          @openReportList="handleOpenReportList"
        >
          <!-- <template slot="title">
          <span>
            <span @click="handleReturnFromXiaZuan" class="title">{{
              pageTitle
            }}</span>
            <template v-if="isViewXiaZuan">
              <span> / 下钻分析</span>
            </template>
          </span>
        </template> -->
        </toolbar>
        <div class="main-content-section">
          <main-section>
            <template #left>
              <div class="left-section">
                <div class="search-section">
                  <el-dropdown @command="handleChannelChange">
                    <el-button type="primary" size="mini">
                      <i class="el-icon-setting"></i> {{ channel.label }}
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="(item, index) in channelOptions">
                        <el-dropdown-item :command="item" :key="index">
                          <span
                            class="kol-channel-list-item"
                            :class="{ focus: channel.value === item.value }"
                            >{{ item.label }}</span
                          >
                        </el-dropdown-item>
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>

                  <el-select
                    style="width: 200px; margin-left: 0px"
                    v-model="user"
                    filterable
                    remote
                    reserve-keyword
                    size="mini"
                    placeholder="输入用户id/用户名"
                    no-data-text="暂无收录该用户"
                    :remote-method="remoteMethod"
                    :loading="loadingUsers"
                    value-key="authorId"
                    @change="handleUserChange"
                  >
                    <el-option
                      v-for="item in userOptions"
                      :key="item.authorId"
                      :label="item.authorName"
                      :value="item"
                    >
                      <div class="option-item-content">
                        <span class="label">{{ item.authorName }}</span>
                        <span class="user-id">{{ item.authorId }}</span>
                      </div>
                    </el-option>
                  </el-select>
                </div>
                <div class="user-section" v-loading="isLoadingUserData">
                  <template v-if="user.authorId">
                    <div class="collect-info">
                      <div class="title">收录信息</div>
                      <div class="contents">
                        <ul>
                          <li class="list-item">
                            <span class="title">作者ID:</span>
                            <span class="value"> {{ user.authorId }}</span>
                          </li>
                          <li class="list-item">
                            <span class="title">作者名称:</span>
                            <span class="value"> {{ user.authorName }}</span>
                          </li>
                          <li class="list-item">
                            <span class="title">采集内容量:</span>
                            <span class="value">
                              {{ user.collectionContentCount }}</span
                            >
                          </li>

                          <li class="list-item">
                            <ul class="content-sub-list">
                              <template
                                v-for="(item, index) in user.contentTypes"
                              >
                                <li class="sub-list-item" :key="index">
                                  <span class="title">{{ item.label }}</span>
                                  <span class="value"> {{ item.count }}</span>
                                </li>
                              </template>
                            </ul>
                          </li>
                          <li class="list-item">
                            <span class="title">主页链接:</span>
                            <a
                              class="value"
                              target="_blank"
                              :href="user.homePageLink"
                            >
                              {{ user.homePageLink }}</a
                            >
                          </li>
                          <li class="list-item">
                            <span class="title">收录时间:</span>
                            <span class="value"> {{ user.collectTime }}</span>
                          </li>
                          <li class="list-item">
                            <span class="title">更新时间:</span>
                            <span class="value"> {{ user.updateTime }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="no-data">
                      <span>暂无数据</span>
                    </div>
                  </template>
                </div>
                <div class="btn-container">
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
                    :disabled="!user.authorId"
                    :loading="isCalculating"
                    @click="handleCalculate"
                    >计算</el-button
                  >
                </div>
              </div>
            </template>
            <template #right>
              <div class="right-section">
                <div class="top-components-container">
                  <time-calendar
                    :timeData="time"
                    :isTextTypeReference="false"
                    :isAutoTriggerApplyTimeEvent="false"
                    @applyTime="handleApplyTime"
                  >
                  </time-calendar>

                  <template v-if="hasData">
                    <div style="margin-left: 20px">
                      <el-radio-group
                        size="small"
                        v-model="mode"
                        @change="handleViewModeChange"
                      >
                        <el-radio-button label="detail"
                          >明细模式</el-radio-button
                        >
                        <el-radio-button label="trend"
                          >趋势模式</el-radio-button
                        >
                      </el-radio-group>
                    </div>
                  </template>
                </div>
                <div class="bottom" ref="bottom">
                  <template v-if="isCalculating || isErrorOccured">
                    <div class="stepper-wrapper">
                      <stepper
                        :stepNumber="activeStep"
                        :isErrorOccured="isErrorOccured"
                      ></stepper>
                    </div>
                  </template>
                  <template v-else-if="hasData">
                    <template v-if="mode === 'detail'">
                      <div class="content-table">
                        <dynamic-table
                          :height="tbHeight"
                          :dimension="dimension"
                          :source="table.source"
                          :pager="table.pager"
                          :filter="table.filter"
                          :filterOptions="table.filterOptions"
                          :loading="loadingTable"
                          :contentHandler="preDealContent"
                          @rowClick="handleRowClick"
                          @getTableData="handleGetTableData"
                        ></dynamic-table>
                      </div>
                    </template>
                    <template v-else>
                      <div class="main-trend-container">
                        <trend-info
                          ref="trendInfo"
                          @event="handleTrendModeTableEvent"
                          :datas="{
                            ...getPageConfigs(),
                          }"
                          tableApiAction="kol/getMainPageTrendTableData"
                          chartApiAction="kol/getMainPageTrendChartData"
                        ></trend-info>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <div class="no-data">
                      <span>暂无数据</span>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </main-section>
        </div>
      </template>

      <!-- 主页详情- 明细模式 -->
      <template v-else>
        <!-- 趋势模式下的详情 -->
        <div class="more-contents-table-container">
          <div class="detail-top">
            <span class="top-path">
              <span class="path-pre" @click="handleBackToPage">KOL分析</span>
              <span> / </span>
              <span style="font-weight: bold">{{ detailName }}</span>
              <span> 的</span>
              <span>数据详情</span>
              <span> ( </span>
              <span>分析时间 </span>
              <span>{{ recordTime }}</span>
              <span> )</span>
            </span>

            <span class="btns-container">
              <!-- <span style="margin-right: 10px">
              <ai-summary :configs="{}"></ai-summary>
            </span> -->
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

          <div class="main-detail-table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                ...this.getPageConfigs(),
                ...viewDetailRow,
              }"
              apiAction="kol/getTrendDetailData"
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
        :reportType="MarketType.kol"
        :isListDragable="false"
        :listData="reportsListData"
        @cancel="handleReportListCancel"
      ></reports-list-pannel>
    </el-drawer>
  </div>
</template>
<script>
import toolbar from "@/views/components/toolbar";
import timeCalendar from "@/views/components/time-range-calendar";
import mainSection from "@/views/components/mainSection";
import recentDay from "@/utils/timeData.js";
import dynamicTable from "@/views/components/dynamicTable";
import numeral from "numeral";
import { commands } from "@/views/components/saveReport/data.js";
import { MarketType } from "../../dashbord/data";
import saveReport from "@/views/components/saveReport";
import stepper from "@/views/components/stepper";
import reportsListPannel from "@/views/dashbord/components/reportsListPannel.vue";
import { getDimension } from "./data.js";
import detailTable from "@/views/components/anylysisDetailTable";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";
import trendInfo from "@/views/components/xiaZuan/trend.vue";

export default {
  props: {},
  components: {
    mainSection,
    toolbar,
    timeCalendar,
    dynamicTable,
    saveReport,
    stepper,
    reportsListPannel,
    xiaZuanInfo,
    detailTable,
    trendInfo,
  },
  data() {
    return {
      isViewXiaZuan: false,
      isDownloadingXiazuan: false,

      mode: "detail",
      isViewInfos: true, // !!

      // isViewXiaZuanInfo: false,
      isLoadingReportConfigs: false,
      MarketType,
      activeStep: 0,
      isErrorOccured: false,
      reportData: null,
      isSaveDialogVisible: false,
      dialogMode: commands.save,
      alreadyCalculated: false,
      isCalculating: false,
      operationPerms: [],
      pageMode: "view", // edit:'编辑‘ view: 查看
      loadingUsers: false,
      hasData: false, //!!
      isDownloadingMain: false,
      commands,
      user: {
        // authorId: "1312312",
        // authorName: "张三",
        // collectionContentCount: 10000, // 采集内容量
        // pasteCount: 100, //帖子数量
        // repeatCount: 100, // 转发数量
        // homePageLink: "http://www.weobo.cn",
        // collectTime: "2022-01-02 12:00",
        // updateTime: "2022-01-02 12:00",
      },
      userOptions: [],

      tbHeight: 500,
      loadingTable: false,
      dimension: [],
      table: {
        source: [],
        pager: {
          curPage: 1,
          pageSize: 10,
          total: 0,
        },
        filter: {},
        filterOptions: {},
      },

      loadingChart: false,
      chart: {
        bar: {
          xAxis: [
            // "1", "2", "3"
          ],
          series: {
            // a: [1, 2, 3],
            // b: [3, 2, 1],
          },
        },
        words: [],
      },
      isLoadingUserData: false,
      // search: "",

      // 微博等渠道
      channel: {},
      channelOptions: [],

      pageTitle: "KOL分析",
      comment: "分析指定用户的社区概况及其历史社区动态",

      chartType: "trend",
      time: {
        type: "relative", // absolute|relative 绝对时间|相对时间
        start: recentDay["1-7"].start, //开始时间字符串
        end: recentDay["1-7"].end, //结束时间字符串
        recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      },

      isLoadingReprorts: false,
      reportsListData: [],
      isReprotsDrawerVisible: false,

      emotionOptions: [],
      textTypeOptions: [],

      xiaZuanRow: {},

      // 主页的详情
      viewDetailRow: {},
      detailName: "",
      recordTime: "2020-12-12 10:10:10",
      isDownloadingDetail: false,
    };
  },

  watch: {
    "$store.getters.appId": {
      immediate: true,
      handler() {
        this.getChannelOptions();
      },
    },
  },

  methods: {
    handleXiaZuanReturn() {
      this.isViewXiaZuan = false;
    },

    // 详情数据表中的下钻
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

    // 主页中详情模式的下钻
    handleXiaZuan(row) {
      this.isViewXiaZuan = true;
      this.xiaZuanRow = row;
    },

    handleTrendModeTableEvent({ action, data }) {
      if (action === "viewDetail") {
        this.detailName = data.detailRow.type;
        this.recordTime = data.detailHeader.label;
        this.isViewInfos = false;
        this.viewDetailRow = data;
      }
    },

    handleReturnFromXiaZuan() {
      this.comment = this.$options.data().comment;
      this.isViewXiaZuan = false;
      this.isViewInfos = true;
    },

    // api
    handleDownloadDetail() {
      this.isDownloadingDetail = true;
      const payload = {
        urlParams: { download_type: "kol" },
        data: {},
      };

      payload.data = this.$refs["detailTable"].getParams();
      payload.data.isMainDetail = true;

      this.$store
        .dispatch("download/downloadKolAnalysis", payload)
        .finally(() => {
          this.isDownloadingDetail = false;
        });
    },

    handleRefreshDetail() {
      this.$refs["detailTable"].getTableData();
    },

    handleBackToPage() {
      this.hasData = true;
      this.isViewInfos = true;
    },

    // 获取整体情感options选项
    getEmotionOptions() {
      const params = {
        project_id: this.$store.getters.appId,
      };
      this.$store.dispatch("common/getEmotionOptions", params).then((data) => {
        this.emotionOptions = data;
      });
    },

    // 获取文本类型options选项
    getTextTypeOptions() {
      const params = {
        project_id: this.$store.getters.appId,
      };
      this.$store.dispatch("common/getTextTypeOptions", params).then((data) => {
        this.textTypeOptions = data;
      });
    },

    handleUpdate(row) {
      const payload = {
        project_id: this.$store.getters.appId,
        configs: this.getPageConfigs(),
        row: row,
      };

      row.committing = true;
      return this.$store
        .dispatch("common/updateDetail", payload)
        .then(() => {
          row.inEditing = false;
          this.$message({
            message: "更新成功!",
            type: "success",
          });
        })
        .catch(() => {
          row.emotion = row.emotionData;
          row.textType = row.textTypeData;
        })
        .finally(() => {
          row.inEditing = false;
          row.committing = false;
        });
    },

    handleCancel(row) {
      row.inEditing = false;
      // this.getTableData();
      row.emotion = row.emotionData;
      row.textType = row.textTypeData;
    },

    //重新标注
    handleReDimension(row) {
      this.$set(row, "inEditing", true);
      const textTypeHeader = this.dimension.find((item) => {
        return item.label === "文本类型";
      });
      const emotionHeader = this.dimension.find((item) => {
        return item.label === "整体情感";
      });

      textTypeHeader.contentComponent.options = this.textTypeOptions;
      emotionHeader.contentComponent.options = this.emotionOptions;
    },

    handleJumpLink(row) {
      if (row.link) {
        window.open(row.link);
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
    handleCalculate() {
      this.calculate();
    },

    resetPageStatus() {
      const data = this.$options.data();
      this.isViewInfos = data.isViewInfos;
      this.isViewMainDetail = data.isViewMainDetail;
      this.isCalculating = data.isCalculating;
      this.activeStep = data.activeStep;
      this.isErrorOccured = data.isErrorOccured;
      this.hasData = data.hasData;
      // this.isViewInfos = data.isViewInfos;
      this.loadingChart = data.loadingChart;
      this.loadingTable = data.loadingTable;

      //设置数据
      this.table = data.table;
      this.chart = data.chart;
    },

    //获取面板数据
    async calculate() {
      this.resetPageStatus();
      const predealStatus = 0; // 预处理
      const workingStatus = 1; //计算中
      const finishedStatus = 3; //计算完成 设置为3 使步骤条变成对号状态 否则设置为2为黑色焦点状态

      let payload = this.getParams();
      payload.click = 1;
      // console.log("payload:", payload);
      let resData = {};
      try {
        this.isLoadingWordTypesTable = true;
        this.isCalculating = true;
        this.isErrorOccured = false;
        this.alreadyCalculated = false;

        // api
        resData = await this.$store.dispatch(
          "kol/getMainPageTableData",
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
          this.calculate();
        }, 2000);
      }

      if (resData.status === 2) {
        this.activeStep = workingStatus;
        //获取数据
        setTimeout(() => {
          this.calculate();
        }, 2000);
      }

      if (resData.status === 3) {
        this.activeStep = finishedStatus; //设置

        setTimeout(() => {
          //半秒中的step进度条显示过程
          this.isCalculating = false;
          this.hasData = true;
          this.alreadyCalculated = true;
          this.table.source = resData.list;
          this.table.filterOptions = resData.filterOptions;
          this.table.pager.total = resData.pager.total;
        }, 500);
      }
    },

    handleCloseSaveDialog() {
      this.isSaveDialogVisible = false;
    },

    handleReportSaved(payload) {
      // 替换显示标题
      if (payload.action === commands.update) {
        this.pageTitle = payload.name;
        this.comment = payload.comment;
      }
    },

    // 按钮功能
    handleSaveAction(action) {
      this.isSaveDialogVisible = true;
      this.dialogMode = action;

      if (action === "update" || action === "saveAs") {
        this.reportData = {
          project_id: this.$store.getters.appId,
          id: this.reportId,
          name: this.pageTitle,
          comment: this.comment,
          type: MarketType.kol,
          action,
          configs: {
            chartType: this.chartType,
            ...this.getParams(),
          },
        };
      }

      if (action === "save") {
        this.reportData = {
          project_id: this.$store.getters.appId,
          id: null,
          name: "",
          comment: "",
          type: MarketType.kol,
          action,
          configs: {
            chartType: this.chartType,
            ...this.getParams(),
          },
        };
      }
    },

    //下载功能
    handleDownload() {
      this.isDownloadingMain = true;

      let payload = {
        project_id: this.$store.getters.appId,
        urlParams: { download_type: "kol" },
        data: { ...this.getParams(), mode: this.mode },
      };

      if (this.mode === "trend") {
        const data = this.$refs["trendInfo"]._getDownloadConfigs();
        payload.data = { ...data.configs, mode: this.mode };
      }

      // console.log(" payload.data ::", payload.data);

      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloadingMain = false;
      });
    },

    // 跳转到用户首页
    handleClickUserName(user) {
      if (user.link) {
        window.open(user.link);
      }
    },

    preDealContent(header, content) {
      if (header.prop === "emotion" && content) {
        return content.label;
      } else if (header.prop === "textType" && content) {
        return content.label;
      }
      return content;
    },

    remoteMethod(query) {
      this.userOptions = [];
      if (query) {
        const payload = {
          project_id: this.$store.getters.appId,
          search: query,
          channel: this.channel.value,
        };

        this.loadingUsers = true;
        return this.$store
          .dispatch("kol/getUserData", payload)
          .then((resData) => {
            if (Array.isArray(resData)) {
              this.userOptions = resData;
            }
          })
          .catch(() => {
            // noop
          })
          .finally(() => {
            this.loadingUsers = false;
          });
      }
    },

    handleUserChange() {
      if (this.user.id) {
        this.hasData = false;
        // this.getChartData();
        // this.getTableData();
      }
    },

    getPageConfigs() {
      return {
        project_id: this.$store.getters.appId,
        authorId: this.user.authorId,
        channel: this.channel.value,
        time: this.time,
      };
    },

    getParams() {
      return {
        project_id: this.$store.getters.appId,
        authorId: this.user.authorId,
        channel: this.channel.value,
        time: this.time,
        pager: this.table.pager,
        filter: this.table.filter,
        search: this.search,
      };
    },

    getAuthorDataById(authorId) {
      const payload = {
        project_id: this.$store.getters.appId,
        authorId,
      };

      this.loadingUser = true;
      this.isLoadingUserData = true;
      return this.$store
        .dispatch("kol/getAuthorDataById", payload)
        .then((data) => {
          this.user = data;
          this.userOptions = [this.user];
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingUserData = false;
        });
    },

    // 获取chart图表数据
    getChartData() {
      // api 获取数据
      let payload = this.getParams();
      this.loadingChart = true;

      return this.$store
        .dispatch("kol/getChartData", payload)
        .then((data) => {
          this.chart = data;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.loadingChart = false;
        });
    },

    handleGetTableData(data) {
      this.table.filter = data.filter;
      this.table.pager = data.pager;
      this.search = data.search.content;
      this.getTableData();
    },

    handleRowClick(data) {
      const { row } = data;
      if (row.link) {
        window.open(row.link);
      }
    },

    //获取 table数据
    getTableData() {
      // api
      let payload = this.getParams();

      this.loadingTable = true;
      return this.$store
        .dispatch("kol/getMainPageTableData", payload)
        .then((data) => {
          this.table.source = data.list;
          this.table.filterOptions = data.filterOptions;
          this.table.pager.total = data.pager.total;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.loadingTable = false;
        });
    },

    // 获取渠道选项
    getChannelOptions() {
      const payload = {
        project_id: this.$store.getters.appId,
      };
      return this.$store
        .dispatch("kol/getChannelOptions", payload)
        .then((data) => {
          if (Array.isArray(data)) {
            this.channelOptions = data;
            this.channel = data[0] || {};
          }
        })
        .catch(() => {
          // noop
        });
    },

    handleRefresh() {
      this.handleCalculate();
    },

    handleChannelChange(data) {
      this.channel = data;
      this.userOptions = [];
      this.user = this.$options.data().user;
      this.hasData = false;
    },

    numeral,
    handleApplyTime(data) {
      this.time = {
        type: data.type,
        start: data.start,
        end: data.end,
        recent_day: data.recent_day,
      };

      //如果存在已选择用户,则刷新
      // if (this.user.id) {
      // this.handleUserChange();
      // }
    },

    handleViewModeChange() {},

    setHeight() {
      this.tbHeight = this.$refs["bottom"]?.offsetHeight - 100;

      console.log('this.$refs["bottom"]:', this.$refs["bottom"]);
    },

    registResizeEvent() {
      window.onresize = () => {
        this.setHeight();
      };
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

          this.channel.value = data.configs.channel;
          // this.user = data.configs.user;

          this.authorId = data.configs.authorId;
          this.chartType = data.configs.chartType;

          this.time = data.configs.time;

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

    //报表的初始化显示
    initReportShow(id) {
      if (id) {
        this.getChannelOptions();
        this.getReportConfigById(this.reportId, async () => {
          await this.getAuthorDataById(this.authorId);
          this.handleCalculate();
        });
      }
    },

    async initReportByConditions(router) {
      this.reportId = router.query["id"] || null;
      if (this.reportId) {
        this.initReportShow(this.reportId);
        this.pageMode = "edit";
      } else {
        this.isLoadingReportConfigs = false;
      }

      // 根据详情页跳转的参数回显
      await this.getChannelOptions();
      const authorId = router.query["authorId"];
      const channelName = router.query["channelName"];
      if (authorId && channelName) {
        const chanelOptionFind = this.channelOptions.find((item) => {
          return item.label === channelName;
        });

        if (chanelOptionFind) {
          this.channel = chanelOptionFind;
        }
        await this.getAuthorDataById(authorId);
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
    // this.$set(this.table, "dimension", getDimension(this));
    this.dimension = getDimension(this);
    // 检查已加载appid后再请求数据
    const tryInit = () => {
      if (this.$store.getters.appId) {
        this.initReportByConditions(this.$route);
      } else {
        this.isLoadingReportConfigs = true;
        setTimeout(() => {
          tryInit();
        }, 500);
      }
    };
    tryInit();

    this.getTextTypeOptions();
    this.getEmotionOptions();
  },

  mounted() {
    this.setHeight();
    this.registResizeEvent();
  },
};
</script>
<style scoped lang="scss">
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

.kol-channel-list-item {
  &.focus {
    color: $color-primary;
  }
}

.option-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .user-id {
    padding-left: 10px;
    color: $color-disabled;
  }
}

.kol-analysis {
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;

  .title {
    cursor: pointer;
  }

  .more-contents-table-container {
    height: 100%;
    width: 100%;
    padding: 15px;

    .main-detail-table-container {
      height: calc(100% - 50px);
    }

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

  .no-data {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: $color-text;
    font-size: 14px;
  }

  .main-content-section {
    width: 100%;
    height: calc(100% - 50px);
    flex: 1;
    background: $background-color;
  }

  .left-section {
    position: relative;
    width: 400px;
    height: 100%;
    background: #fff;
    overflow: auto;
    padding: 10px;

    .search-section {
      padding: 10px;

      .search-btn {
        margin-left: 10px;
      }
    }

    .user-searcher {
      width: 260px;

      .el-icon-search {
        cursor: pointer;
        &:hover {
          color: $color-primary;
        }
      }
    }

    .user-section {
      margin-top: 10px;
      height: calc(100% - 108px);

      .collect-info {
        width: 100%;
        & > .title {
          width: 100%;
          padding: 10px;
          border-bottom: 1px solid $color-border;
        }
      }

      .contents {
        ul,
        li {
          // list-style: none;
          margin: 0;
          padding: 0;
        }

        padding: 10px;
        .list-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 5px;
          margin-top: 10px;
          color: $color-text;

          .title {
            font-size: 14px;
            font-weight: bold;
          }

          a {
            &.value {
              color: $color-primary;
            }
          }

          .value {
            font-size: 14px;
            margin-left: 5px;
          }

          .content-sub-list {
            list-style-type: disc;
            padding-left: 40px;

            .list-item {
              display: list-item;
            }
          }
        }
      }
    }

    .btn-container {
      text-align: right;
      padding-right: 10px;
    }
  }

  .right-section {
    width: 100%;
    height: 100%;
    background: #fff;

    // overflow: auto;

    .top-components-container {
      padding: 10px;
      padding-top: 20px;
      padding-left: 20px;

      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      height: calc(100% - 60px);
      position: relative;

      .main-trend-container {
        width: 100%;
        height: 100%;
        overflow: auto;
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

      .content-table {
        width: 100%;
        overflow: auto;
        margin-right: 10px;
        padding: 10px;
      }

      .chart-container {
        width: 50%;
        // flex-grow: 1;
        .top {
          padding: 10px;
        }

        .bottom-container {
          .no-data {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }

  .xia-zuan-section {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: $light-background-color;

    .left {
      margin-top: 10px;
      width: 300px;
      padding-left: 10px;
      height: calc(100% - 10px);
      flex-shrink: 0;
      background: #fff;
      margin-left: 10px;

      .title {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 20px;

        .title-inner {
          font-size: 16px;
          font-weight: 500;

          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .channel-tag {
          flex-shrink: 0;
          display: inline-block;
          border-radius: 3px;
          padding: 3px 5px;
          border: 1px dashed $color-disabled;
          font-size: 14px;
        }
      }

      .content {
        .content-item {
          padding: 5px;
          color: #42546d;
          display: flex;
          align-items: center;
          justify-content: flex-start;

          .content-item-title {
            font-weight: 500;
            font-size: 14px;
            flex-shrink: 0;
            padding-right: 5px;
          }

          .content-text {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
