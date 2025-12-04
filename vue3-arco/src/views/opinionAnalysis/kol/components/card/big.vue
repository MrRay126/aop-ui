<template>
  <div class="kol-card-big" v-loading="loading">
    <template v-if="isViewInfos">
      <div class="main-page">
        <div class="left-section">
          <div class="user-section">
            <template v-if="user.authorId">
              <div class="collect-info">
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
                        <template v-for="(item, index) in user.contentTypes">
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
        </div>

        <div class="right-section">
          <div class="top-components-container">
            <template v-if="hasData">
              <div>
                <el-radio-group size="small" v-model="mode">
                  <el-radio-button label="detail">明细模式</el-radio-button>
                  <el-radio-button label="trend">趋势模式</el-radio-button>
                </el-radio-group>
              </div>
            </template>
          </div>
          <div class="bottom" ref="bottom">
            <template v-if="hasData">
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
                    :chartHeight="400"
                    :tableHeight="450"
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
      </div>
    </template>
    <!-- 主页详情- 明细模式 -->
    <template v-else-if="isViewMainDetail">
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
              trend_filter: viewDetailRow.trend_filter,
            }"
            apiAction="kol/getTrendDetailData"
          ></detail-table>
        </div>
      </div>
    </template>
    <!-- 下钻内容 -->
    <template v-else-if="isViewXiaZuan">
      <span class="xiazuan-title">
        <span>
          <span @click="handleReturnFromXiaZuan" class="title">{{
            pageTitle
          }}</span>
          <template v-if="isViewXiaZuan">
            <span> / 下钻分析</span>
          </template>
        </span>
      </span>

      <div class="xia-zuan-section">
        <xia-zuan-info
          ref="xiaZuanInfo"
          :viewConfigs="{
            wordChartHeight: 400,
            wordTableHeight: 400,
            isTimeLineVisible: false,
          }"
          :datas="{
            ...this.getPageConfigs(),
            row: xiaZuanRow,
            project_id: $store.getters.appId,
          }"
        ></xia-zuan-info>
      </div>
    </template>
  </div>
</template>
<script>
import { bigCardMixin } from "@/views/mixins/card.js";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";
import detailTable from "@/views/components/anylysisDetailTable";
import dynamicTable from "@/views/components/dynamicTable";
import trendInfo from "@/views/components/xiaZuan/trend.vue";
import recentDay from "@/utils/timeData.js";
import numeral from "numeral";
import { commands } from "@/views/components/saveReport/data.js";
import { MarketType } from "@/views/dashbord/data/index.js";
import { getDimension } from "@/views/opinionAnalysis/kol/data.js";

export default {
  props: {
    //卡片的配置信息
    cardData: {
      type: Object,
      default() {
        return {
          user: null,
        };
      },
    },

    //卡片的配置信息
    cardConfigs: {
      type: Object,
      default() {
        return null;
      },
    },
  },

  mixins: [bigCardMixin],

  components: {
    xiaZuanInfo,
    detailTable,
    dynamicTable,
    trendInfo,
  },

  data() {
    return {
      infoData: {
        chanelCnName: "-",
        title: "-",
        id: "-",
        publishTime: "-",
        updateTime: "-",
        link: "-",

        forwardCount: 0, // 转发数
        commentCount: 0, // 评论数
        favorCount: 0,
      },
      loadingUser: false,
      user: {},
      toolbarVisible: true,
      mode: "detail",
      isViewInfos: true,
      isViewMainDetail: false,
      isViewXiaZuan: false,
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
      hasData: true,
      isDownloadingMain: false,
      commands,

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

  computed: {
    loading() {
      return this.loadingChart || this.loadingTable || this.loadingUser;
    },
  },

  watch: {
    cardData: {
      immediate: true,
      handler(val) {
        if (val && val.user) {
          this.user = val.user;
        }
      },
    },
    cardConfigs: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.table.pager = val.pager;
          this.table.filter = val.filter;
          this.mode = "detail";

          this.getAuthorDataById();
          this.getTableData();
        }
      },
    },
  },
  methods: {
    getInfoData() {
      const payload = {
        ...this.getPageConfigs(),
        row: this.xiaZuanRow,
      };
      this.$store
        .dispatch("kol/getXiaZuanBaseInfo", payload)
        .then((data) => {
          this.infoData = data;
        })
        .catch(() => {
          // noop
        });
    },

    getAuthorDataById() {
      if (this.cardConfigs) {
        const payload = {
          project_id: this.$store.getters.appId,
          authorId: this.cardConfigs.authorId,
        };

        this.loadingUser = true;
        return this.$store
          .dispatch("kol/getAuthorDataById", payload)
          .then((data) => {
            this.user = data;
          })
          .catch(() => {
            // noop
          })
          .finally(() => {
            this.loadingUser = false;
          });
      }
    },

    handleTrendModeTableEvent({ action, data }) {
      if (action === "viewDetail") {
        this.detailName = data.name;
        this.recordTime = data.time;
        this.opendAction("mainDetail");
        this.viewDetailRow = data;
      }
    },

    /**
     * @type  显示的功能模块 mainDetail  mainInfo xiaZuan
     */
    opendAction(type) {
      this.isViewMainDetail = type === "mainDetail";
      this.isViewInfos = type === "mainInfo";
      this.isViewXiaZuan = type === "xiaZuan";

      this.toolbarVisible = type !== "mainDetail";
    },

    handleReturnFromXiaZuan() {
      this.comment = this.$options.data().comment;
      // this.isViewXiaZuan = false;
      // this.isViewInfos = true;
      this.opendAction("mainInfo");
    },

    // api
    handleDownloadDetail() {
      this.isDownloadingDetail = true;
      const payload = {
        download_type: "",
        project_id: this.$store.getters.appId,
      };
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
      this.opendAction("mainInfo");
      // this.hasData = true;
    },

    handleXiaZuan(row) {
      this.xiaZuanRow = row;
      this.comment = "";
      this.opendAction("xiaZuan");
      this.getInfoData();
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

    preDealContent(header, content) {
      if (header.prop === "emotion") {
        return content?.label;
      } else if (header.prop === "textType") {
        return content?.label;
      }
      return content;
    },

    getMainDetailConfigs() {
      return this.$refs["detailTable"].getParams();
    },

    /// 需要调整!!
    getPageConfigs() {
      return {
        project_id: this.$store.getters.appId,
        authorId: this.cardConfigs.authorId,
        channel: this.cardConfigs.channel,
        time: this.cardConfigs.time,
      };
    },

    /// 需要调整!!
    getParams() {
      return {
        project_id: this.$store.getters.appId,
        authorId: this.cardConfigs.authorId,
        channel: this.cardConfigs.channel,
        time: this.cardConfigs.time,
        pager: this.cardConfigs.pager,
        filter: this.cardConfigs.filter,
        search: this.search,
      };
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

    numeral,

    setHeight() {
      this.tbHeight = this.$refs["bottom"]?.offsetHeight - 80;
    },

    registResizeEvent() {
      window.onresize = () => {
        this.setHeight();
      };
    },
  },
  created() {
    this.dimension = getDimension(this);
  },
  mounted() {
    this.setHeight();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.kol-card-big {
  padding: 10px 20px;
  width: 100%;
  overflow: hidden;
  height: 600px;

  ::v-deep {
    .info {
      background-color: #fff;
      height: calc(100% - 10px);
      padding-top: 0;

      .page {
        background-color: #fff;
      }

      .left {
        padding-top: 0;
        margin-top: 0;
      }

      .right {
        margin-top: 0;
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

    .bottom-content-top {
      height: calc(100% - 10px);
    }
  }

  .xiazuan-title {
    font-size: 14px;

    .title {
      cursor: pointer;
    }
  }

  .xia-zuan-section {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    overflow: auto;
    // background-color: $light-background-color;

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

  .main-page {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background: #f0f2f5;
  }

  .left-section {
    position: relative;
    flex: 0 0 auto;
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
    width: 200px;
    height: 100%;
    background: #fff;
    flex: 1;

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
      height: calc(100% - 70px);
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

  .title {
    cursor: pointer;
  }

  .more-contents-table-container {
    height: 100%;
    width: 100%;
    // padding: 15px;

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
}
</style>
