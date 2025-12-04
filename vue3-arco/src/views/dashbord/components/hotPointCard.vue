<template>
  <div class="hot-point-chart" v-loading="isLoading">
    <!-- {{ cardData }} -->
    <template v-if="cardData && cardData.configs && cardData.configs.aop_type">
      <template v-if="!isViewXiaZuan">
        <template v-if="isViewInfos">
          <card
            :loading="isLoading"
            :show-top="showTop"
            :cardData="{
              report: {
                name: '热点跟踪',
                comment: '统计全部内容的高频词及各个渠道热门的内容。',
                configs: {
                  ...cardData.configs,
                },
              },
            }"
            :configs="{
              hasDownload: false,
              hasMoreOperationBtn: false,
              titleClickToReport: false,
              isAutoTriggerApplyTimeEvent: false,
              useToolTip: true,
            }"
            :bottomHeight="440"
            @action="handleAction"
          >
            <div class="bottom">
              <div class="left">
                <div class="chart-section">
                  <div class="top-type">
                    <el-radio-group
                      v-model="cardData.wordType"
                      size="mini"
                      @input="handleWordTypeChange"
                    >
                      <template v-for="(value, prop) in cardData.chartData">
                        <el-radio-button
                          :label="prop"
                          :key="prop"
                        ></el-radio-button>
                      </template>

                      <!-- <el-radio-button label="突发词"></el-radio-button> -->
                      <!-- <el-radio-button label="新词"></el-radio-button> -->
                    </el-radio-group>
                  </div>
                  <template v-if="chartData.length > 0">
                    <div class="graph">
                      <word-cloud-chart
                        @click="handleWordItemClick"
                        :chartData="chartData"
                        shape="square"
                      ></word-cloud-chart>
                    </div>
                  </template>
                  <template v-else>
                    <div class="no-data-text">暂无数据</div>
                  </template>
                </div>
              </div>
              <div class="right">
                <div class="title">
                  <span>
                    <span class="title-text">热议内容</span>
                    <el-tooltip effect="light" placement="top-start">
                      <div slot="content" class="hot-point-list-tooltip-inner">
                        <div>排序规则：</div>
                        <div>微博：按照转发、评论、点赞进行综合排序。</div>
                        <div>B站：按照视频播放量。</div>
                        <div>TapTap：按照点赞数。</div>
                      </div>
                      <span class="el-icon-info"></span>
                    </el-tooltip>
                  </span>

                  <el-select
                    v-model="channel"
                    @change="handleChannelChange"
                    style="width: 100px"
                    size="mini"
                  >
                    <template v-for="(value, prop) in cardData.rankList">
                      <el-option
                        :label="prop"
                        :value="prop"
                        :key="prop"
                      ></el-option>
                    </template>
                  </el-select>
                </div>

                <template v-if="hotList.length === 0">
                  <span class="no-data-text">暂无数据</span>
                </template>
                <template v-else>
                  <ul class="rank-list">
                    <template v-for="(item, index) in hotList">
                      <li
                        class="rank-item"
                        :key="index"
                        @click="handleHotListItemClick(item)"
                      >
                        <span class="number-title">
                          <!-- 排名number -->
                          <span
                            class="rank-number"
                            :class="{ 'is-black': index < 3 }"
                            >{{ index + 1 }}</span
                          >

                          <el-popover
                            placement="top-start"
                            width="400"
                            trigger="hover"
                            :content="item.name"
                          >
                            <span slot="reference" class="rank-title">{{
                              item.name
                            }}</span>
                          </el-popover>
                        </span>
                        <span>{{ item.value }}</span>
                      </li>
                    </template>
                  </ul>
                </template>
              </div>
            </div>
          </card>
        </template>

        <template v-else>
          <div class="step-container">
            <span>
              <span class="pre-font" @click="handlePreCLick">热点追踪</span> /
              {{ currentViewWord.name }}
              <span>({{ startTime }}~{{ endTime }})</span>
            </span>
            <span style="margin-right: 10px">
              <ai-summary
                :configs="{
                  ...cardData.configs,
                  filters: cardData.configs.globalFilter,
                }"
              ></ai-summary>
            </span>
          </div>

          <div class="table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                project_id: this.$store.getters.appId,
                word: this.currentViewWord.name,
                pager: this.pager,
                filter: this.filter,
                ...this.cardData.configs,
              }"
              apiAction="dashbord/getWordDetail"
              @event="handleDetailTableEvent"
            ></detail-table>
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

          <xia-zuan-info
            ref="xiaZuanInfo"
            :viewConfigs="{
              wordChartHeight: 300,
              wordTableHeight: 300,
              spreadChartHeight: 325,
              spreadTableHeight: 325,
              isTimeLineVisible: false,
            }"
            :datas="{
              row: xiaZuanRow,
              project_id: $store.getters.appId,
            }"
          ></xia-zuan-info>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="no-data">暂无数据</div>
    </template>
  </div>
</template>
<script>
import wordCloudChart from "@/views/components/charts/wordCloudChart.vue";
// import dynamicTable from "@/views/components/dynamicTable/index.vue";
import { panelType } from "../data";
import card from "./card.vue";
import detailTable from "@/views/components/anylysisDetailTable";
import aiSummary from "@/views/components/aiSummary";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  components: {
    wordCloudChart,
    detailTable,
    card,
    aiSummary,
    xiaZuanInfo,
  },

  props: {
    showTop: {
      type: Boolean,
      default: true,
    },
    cardData: {
      type: Object,
      default() {
        return null;
        // return {
        // 时间参数
        // configs: {
        //   time: {
        //     type: "absolute", // absolute|relative 绝对时间|相对时间
        //     start: "2021/8/1 0:0:0", //开始时间字符串
        //     end: "2021/8/30 23:59:59", //结束时间字符串
        //     recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
        //   },
        // },
        //   wordType: "高频词",
        //   chartData: {},

        //   rankList: [
        //     { name: "名称名称名称名称名称名称名称", value: 121323 },
        //   ],
        // };
      },
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isViewXiaZuan: false,
      isDownloadingXiazuan: false,

      hotPointWord: "",
      isViewInfos: true,
      isLoadingTableData: false,
      currentViewWord: { name: "当前观看的词" },
      tableData: [],

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 10,
      },
      channel: "",
      hotList: [],

      tableValueMaps: {
        emotion: { positive: "正向", negative: "负向", neutral: "中性" },
      },

      tableDimensions: [
        {
          label: "ID",
          prop: "id",
          width: "",
          // hasTooltip: true,
        },
        {
          label: "渠道",
          prop: "channel",
          actionType: "filter", // 排序类型
          // hasTooltip: true,
        },
        {
          label: "内容类型",
          prop: "contentType",
          // hasTooltip: true,
        },
        {
          label: "内容",
          prop: "content",
          minWidth: "200px",
          // hasTooltip: true,
        },
        {
          label: "作者ID",
          prop: "authorId",
          // hasTooltip: true,
        },
        {
          label: "作者名称",
          prop: "authorName",
          // hasTooltip: true,
        },
        {
          label: "发布时间",
          prop: "publishTime",
          actionType: "sort",
          // hasTooltip: true,
        },
        {
          label: "采集时间",
          prop: "collectTime",
          actionType: "sort",
          // hasTooltip: true,
        },
        {
          label: "整体情感",
          prop: "emotion",
          actionType: "filter",
          // hasTooltip: true,
        },
        {
          label: "ABAS分析",
          prop: "ABAS",
          // minWidth: "200px",
          hasTooltip: true, //是否使用toolTip
        },
      ],

      filter: {
        search: "",
        // time: "ascending",
        // levels: "",
        // tag: "",
      },

      filterOptions: {},

      startTime: "-",
      endTime: "-",
    };
  },
  computed: {
    chartData() {
      if (this.cardData?.chartData && this.cardData?.wordType) {
        return this.cardData.chartData[this.cardData.wordType];
      }
      return [];
    },
  },

  watch: {
    cardData: {
      handler(val) {
        if (val && val.rankList) {
          const rankList = val.rankList;
          const channels = Object.keys(rankList);
          if (channels.includes("weibo")) {
            this.channel = "weibo";
          } else {
            this.channel = channels[0];
          }
          this.handleChannelChange();
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

    handleDynamicTableGetData(data) {
      this.filter = data.filter;
      this.pager = data.pager;

      this.getTableData();
    },

    handleChannelChange() {
      // noop
      this.hotList = [];
      const rankList = this.cardData?.rankList;
      if (rankList && Array.isArray(rankList[this.channel])) {
        this.hotList = rankList[this.channel];
      }
    },

    preDealContent(header, content) {
      // 数据标记处理颜色
      if (header.prop === "content") {
        content = this.markContent(content);
      }
      // 数据映射处理
      if (header.prop in this.tableValueMaps) {
        content = this.tableValueMaps[header.prop][content];
      }
      return content;
    },

    markContent(content) {
      const word = this.currentViewWord.name.replace(/[""''“”‘’]/g, "");
      let reg = new RegExp(`(${word})`, "g");
      content = content.replace(reg, "<span style='color:red'>$1</span>");
      return content;
    },

    //浏览具体的网页
    jumpToViewDataPage({ row }) {
      if (row.link) {
        window.open(row.link);
      } else {
        this.$message({
          message: "该内容无外部链接!",
          type: "info",
          duration: 3000,
        });
      }
    },

    handlePreCLick() {
      const data = this.$options.data();
      this.isViewInfos = true;
      this.tableData = [];
      this.pager = data.pager;
      this.filter = data.filter;
    },

    //词类型变化处理
    handleWordTypeChange() {
      this.$emit("wordTypeChange");
    },

    handleHotListItemClick(row) {
      this.jumpToViewDataPage({ row });
    },

    handleWordItemClick(word) {
      this.currentViewWord = word;
      this.isViewInfos = false;
      // this.getTableData();
    },

    getTableData() {
      this.isLoadingTableData = true;

      const payload = {
        project_id: this.$store.getters.appId,
        word: this.currentViewWord.name,
        pager: this.pager,
        filter: this.filter,
        ...this.cardData.configs,
      };

      this.$store
        .dispatch("dashbord/getWordDetail", payload)
        .then((data) => {
          this.tableData = data.list;
          this.pager = data.pager;
          this.filterOptions = data.filterOptions;
          this.startTime = data.time.startTime;
          this.endTime = data.time.endTime;
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingTableData = false;
        });
    },

    handleAction(payload) {
      const { action, data, cb } = payload;
      if (action === "timeChange") {
        this.$emit("timeChange", { data, cardType: panelType.hotPoint });
      }

      if (action === "download") {
        if (typeof cb === "function") {
          cb();
        }
      }
    },
    // handleTimeChange(time) {
    //   this.$emit("timeChange", { data: time, cardType: panelType.hotPoint });
    // },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

$topHeight: 50px;

.hot-point-list-tooltip-inner {
  line-height: 20px;
}

.tooltip-content-inner {
  max-width: 400px;
}

.hot-point-chart {
  width: 100%;
  height: 100%;
  color: $color-text;
  position: relative;
  // padding: 5px;

  .xia-zuan-info {
    width: 100%;
    height: 100%;

    .top-buttons {
      padding: 0 20px;
      border-bottom: 1px solid #e8eaec;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    ::v-deep {
      .info {
        background-color: #fff;
        height: calc(100% - 55px);
        padding-top: 0;

        .page {
          background-color: #fff;

          .right {
            margin-top: 0;

            .anylysis-section {
              height: calc(100% - 48px);
            }
          }

          .left {
            padding-top: 0;

            .title {
              margin-top: 0;
            }
          }
        }

        .top-tools {
          padding: 0 0 8px 20px;
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
        height: calc(100% - 50px);
      }

      .bottom-content-top {
        height: calc(100% - 10px);
      }
    }
  }

  ::v-deep(.hot-point-detail-table-row) {
    cursor: pointer;
  }

  .pre-font {
    cursor: pointer;
    color: $color-desc;
    line-height: 20px;
  }

  .step-container {
    padding: 10px;
    text-align: left;
    font-size: 14px;
    // font-weight: bold;
    border-bottom: 1px solid #e8eaec;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .table-container {
    height: 458px;

    .el-icon-question {
      margin-left: 3px;
      color: $color-text;
    }

    .value-container {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .focus-drop-down-item {
      color: $color-primary;
    }

    .focus-sort {
      color: $color-primary;
    }

    .sortable-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .sort-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        & > span {
          &:hover {
            color: $color-primary;
          }
        }

        .el-icon-caret-top {
          line-height: 5px;
          margin-bottom: 2px;
        }

        .el-icon-caret-bottom {
          line-height: 5px;
        }

        .filter-container {
          vertical-align: middle;
        }
      }

      .filter-icon {
        vertical-align: -2px;
        margin-left: 2px;
        cursor: pointer;
        color: #909399;
      }
    }
  }
  .pagination-container {
    margin-top: 10px;
  }

  .no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $color-text;
  }

  .top {
    width: 100%;
    height: $topHeight;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    border-bottom: 1px solid $color-border;

    .title-time-wrapper {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .title {
      font-size: 14px;
    }

    .time {
      margin-left: 15px;
      font-size: 12px;
      color: $color-primary;
      text-decoration: underline;
      // &:hover {
      //   text-decoration: underline;
      //   color: $title-text-color;
      // }
    }
  }

  .bottom {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      flex: 1;
      height: 100%;
      text-align: left;

      // .title {
      //   padding-left: 10px;
      //   font-size: 14px;
      //   font-weight: bold;
      //   height: 20px;
      //   margin-top: 15px;
      // }

      .chart-section {
        height: calc(100% - 35px);
        padding: 10px;
        position: relative;

        .graph {
          margin-top: 10px;
        }

        .no-data-text {
          color: $color-text;
          font-size: 12px;
          text-align: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }

    .right {
      flex: 0 0 auto;
      width: 260px;
      height: 100%;
      margin-right: 30px;
      text-align: left;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
      position: relative;

      .no-data-text {
        list-style: none;
        color: $color-text;
        font-size: 12px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -20px;
        transform: translate(-50%, -50%);
      }

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        width: 100%;
        flex: 0 0 auto;
        font-size: 14px;
        font-weight: bold;
        // height: 20px;
        padding-left: 10px;
        margin-top: 15px;

        .title-text {
          margin-right: 3px;
        }
      }

      .rank-list {
        margin: 0;
        padding: 0;
        width: 100%;
        // height: calc(100% - 20px);
        flex: 1;
        overflow: auto;
        margin: 10px 0;
        padding-right: 10px;
        position: relative;

        .rank-item {
          font-size: 14px;
          width: 100%;
          padding: 5px;

          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;

          .number-title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }

          .rank-number {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            border: 1px solid $background-color;
            line-height: 20px;
            text-align: center;
            background: $light-background-color;
            font-size: 12px;
            color: $color-text;

            &.is-black {
              background: #32465a;
              color: #fff;
            }
          }

          .rank-title {
            height: 20px;
            margin-left: 20px;
            margin-top: 5px;
            display: inline-block;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
</style>
