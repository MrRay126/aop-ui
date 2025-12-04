<template>
  <div class="chanel-chart">
    <template v-if="cardData && cardData.configs && cardData.configs.aop_type">
      <template v-if="!isViewXiaZuan">
        <template v-if="isViewInfos">
          <card
            :loading="isLoading"
            :cardData="{
              report: {
                name: '分渠道内容量',
                comment:
                  '渠道是【媒体平台-文本来源】的组合，B站的视频内容和B站的评论属于不同的渠道',
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
                <div class="title-and-filter-container">
                  <div class="title">内容量</div>
                  <div class="filter-container">
                    <pop-list
                      :title="`渠道/内容类型(${checkedChannelList.length}/${channelFilterList.length})`"
                    >
                      <el-checkbox-group
                        v-model="checkedChannelList"
                        @change="handleFilterChange"
                      >
                        <template
                          v-for="(listItem, index) in channelFilterList"
                        >
                          <div class="channel-filter-list-item" :key="index">
                            <el-checkbox :label="listItem.value">{{
                              listItem.label
                            }}</el-checkbox>
                          </div>
                        </template>
                      </el-checkbox-group>
                    </pop-list>
                  </div>
                </div>

                <template v-if="cardDataList.length > 0">
                  <div class="chart-section">
                    <theme-river-chart
                      :height="350"
                      :chartData="{
                        data: cardDataList,
                        legend: cardLegend,
                      }"
                    ></theme-river-chart>
                  </div>
                </template>
                <template v-else>
                  <div class="no-data-text">暂无数据</div>
                </template>
              </div>
              <div class="right">
                <div class="title">渠道内容量排名</div>

                <ul class="rank-list">
                  <template
                    v-if="cardData.rankList && cardData.rankList.length === 0"
                  >
                    <li class="no-data-text">暂无数据</li>
                  </template>
                  <template v-else>
                    <template v-for="(item, index) in cardData.rankList">
                      <li
                        class="rank-item"
                        :key="index"
                        @click="handleChannelRankItemClick(item)"
                      >
                        <span class="number-title">
                          <!-- 排名number -->
                          <span
                            class="rank-number"
                            :class="{ 'is-black': index < 3 }"
                            >{{ index + 1 }}</span
                          >
                          <span class="rank-title">{{ item.title }}</span>
                        </span>
                        <span>{{ item.count }}</span>
                      </li>
                    </template>
                  </template>
                </ul>
              </div>
            </div>
          </card>
        </template>
        <template v-else>
          <div>
            <div class="step-container">
              <span>
                <span class="pre-font" @click="handlePreCLick"
                  >分渠道内容量</span
                >
                /
                {{ currentViewWord.title }}
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
                  project_id: $store.getters.appId,
                  pager: pager,
                  filter: filter, // filter of table
                  ...cardData.configs,
                }"
                apiAction="dashbord/getWordDetail"
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
import { panelType } from "../data";
import card from "./card.vue";

import themeRiverChart from "../../components/charts/themeRiverChart.vue";
import popList from "@/views/components/popList";
import detailTable from "@/views/components/anylysisDetailTable";
import aiSummary from "@/views/components/aiSummary";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  components: {
    // barChart,
    card,
    themeRiverChart,
    popList,
    detailTable,
    aiSummary,
    xiaZuanInfo,
  },

  props: {
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

        //   chartData: {},

        //   rankList: [
        //     // { title: "名称名称名称名称名称名称名称", count: 121323 },
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

      checkedChannelList: [],
      channelFilterList: [],
      cardLegend: [],
      cardDataList: [],

      tableData: [],
      isViewInfos: true,
      isLoadingTableData: false,
      currentViewWord: { title: "" },
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
          // hasTooltip: true, //是否使用toolTip
        },
        {
          label: "渠道",
          prop: "channel",
          actionType: "filter", // 排序类型
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
        },
        {
          label: "ABAS分析",
          prop: "ABAS",
          hasTooltip: true,
        },
      ],

      filter: {
        search: "",
        // time: "ascending",
        // levels: "",
        // tag: "",
      },

      filterOptions: {},

      // detail time scope
      startTime: "-",
      endTime: "-",
    };
  },

  watch: {
    cardData: {
      handler(val) {
        if (val && val.data && val.legend) {
          this.channelFilterList = val.legend.map((item) => {
            return {
              label: item,
              value: item,
            };
          });
          this.checkedChannelList = val.legend.slice(0, 5);
          this.cardLegend = this.checkedChannelList;
          this.handleFilterChange();
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

    handleFilterChange() {
      this.cardDataList = this.cardData.data.filter((item) => {
        const lengendName = item[2];
        return this.checkedChannelList.includes(lengendName);
      });

      this.cardLegend = this.checkedChannelList;
    },

    preDealContent(header, content) {
      // 数据映射处理
      if (header.prop in this.tableValueMaps) {
        content = this.tableValueMaps[header.prop][content];
      }
      return content;
    },

    handleChannelRankItemClick(channel) {
      this.currentViewWord = channel;
      if (channel.filter) {
        this.filter = channel.filter;
      }
      this.isViewInfos = false;
    },

    //浏览具体的网页
    jumpToViewDataPage({ row }) {
      if (row.link) {
        window.open(row.link);
      } else {
        this.$message({
          message: "该内容无外部链接!11",
          type: "info",
          duration: 3000,
        });
      }
    },

    handlePreCLick() {
      this.isViewInfos = true;
      this.tableData = [];
      this.pager = this.$options.data().pager;
    },

    handleAction(payload) {
      const { action, data, cb } = payload;
      if (action === "timeChange") {
        this.$emit("timeChange", { data, cardType: panelType.channel });
      }

      if (action === "download") {
        if (typeof cb === "function") {
          cb();
        }
      }
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.channel-filter-list-item {
  margin-bottom: 5px;
}

.tooltip-content-inner {
  max-width: 400px;
}

.chanel-chart {
  width: 100%;
  height: 100%;
  min-height: 400px;
  color: $color-text;
  $topHeight: 50px;
  position: relative;

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

  .step-container {
    padding: 10px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #e8eaec;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pre-font {
    cursor: pointer;
    color: $color-desc;
    line-height: 20px;
  }

  .table-container {
    height: 458px;
  }

  .download-icon-button {
    padding: 0;
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
      position: relative;

      .title-and-filter-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 10px;
      }

      .filter-container {
        margin-left: 10px;
      }

      .title {
        padding-left: 10px;
        font-size: 14px;
        font-weight: bold;
        height: 20px;
      }

      .chart-section {
        height: calc(100% - 35px);
        padding: 10px;
      }

      .no-data-text {
        list-style: none;
        color: $color-text;
        font-size: 12px;
        text-align: center;
        position: absolute;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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

      .title {
        width: 100%;
        flex: 0 0 auto;
        font-size: 14px;
        font-weight: bold;
        height: 20px;
        padding-left: 10px;
        margin-top: 15px;
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
            display: inline-block;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
          }
        }
      }
    }
  }
}
</style>
