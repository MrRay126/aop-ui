<template>
  <div class="topic-big">
    <template v-if="!isViewXiaZuan">
      <template v-if="isViewInfos">
        <!-- 关键词表 -->
        <div class="main-part">
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
              <template v-if="cardData.length > 0">
                <division-chart
                  :chartData="cardData"
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
                ...cardConfigs,
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
        <div style="padding-left: 10px">
          <el-button @click="handleXiaZuanReturn" type="text">
            &lt;返回
          </el-button>
        </div>
        <xia-zuan-info
          ref="xiaZuanInfo"
          :viewConfigs="{
            wordChartHeight: 400,
            wordTableHeight: 400,
            spreadChartHeight: 400,
            spreadTableHeight: 400,
            isTimeLineVisible: false,
          }"
          :datas="{
            ...cardConfigs,
            row: xiaZuanRow,
            project_id: $store.getters.appId,
          }"
        ></xia-zuan-info>
      </div>
    </template>
  </div>
</template>
<script>
import { DISPOSITION } from "../data.js";
import { OpinionType } from "@/views/dashbord/data";
import dynamicTable from "@/views/components/dynamicTable";
import divisionChart from "@/views/components/charts/divisionChart.vue";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  props: {
    cardConfigs: {
      type: Object,
      default() {
        return {};
      },
    },
    cardData: {
      type: Array,
      default() {
        return [
          {
            name: "抽奖1",
            value: 10,
            positive: 9,
            negative: 1,
            neutral: 0,
            tagText: "表掐",
          },
        ];
      },
    },
  },

  components: {
    contentTable: dynamicTable,
    divisionChart,
    xiaZuanInfo,
  },

  data() {
    return {
      isViewXiaZuan: false,
      xiaZuanRow: {},

      contentTableFilterOptions: {},
      tableFilter: {},

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 10,
      },

      loadingContents: false,
      OpinionType,
      //分块图数据
      chartData: [{ name: "word" }],
      promptWords: [],
      split: false,

      topicCount: "auto",
      promptWordOptions: [],
      operationPerms: [],
      isDownloadingDetail: false,
      isDownloadingMain: false,
      isViewInfos: true,
      currentViewTopic: { name: "-", value: "-", tagText: "-" },
      //分块图数据

      tableMaxHeight: 500,
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

      keywordRow: {},
      dispositionRow: {},

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
    cardData: {
      immediate: false,
      handler(val) {
        // console.log(val);
        if (val.length > 0) {
          const firstWord = val[0];
          this.handleDivisionClick(firstWord);
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

    handleDispositionRowClick(data) {
      const { row } = data;
      if (row.link) {
        window.open(row.link);
      }
    },

    handleGetTableData(data) {
      this.tableFilter = data.filter;
      this.pager = data.pager;
      this.getTableData();
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

    markContent(content, word) {
      let reg = new RegExp(`(${word})`, "g");
      content = content.replace(reg, "<span style='color:red'>$1</span>");
      return content;
    },

    //主题分割图 点击事件
    handleDivisionClick(topic) {
      this.currentViewTopic = topic;
      this.markContentWords = [topic.name];
      this.getTableData();
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

    // api table2数据
    getTableData() {
      this.loadingContents = true;
      // this.topicTable={}
      this.detailTable = [];
      let payload = {
        ...this.cardConfigs,
        ...this.tableFilter,
        topic_id: this.currentViewTopic.topic_id,
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

    handleBackToInfoTables() {
      this.isViewInfos = true;
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
  },
  created() {},
  mounted() {
    this.setTableHeight();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.topic-big {
  width: 100%;
  height: 100%;

  .xia-zuan-info {
    width: 100%;
    height: 100%;

    ::v-deep {
      .info {
        background-color: #fff;
        height: calc(100% - 10px);
        padding-top: 0;

        .page {
          background-color: #fff;

          .right {
            margin-top: 0;
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
      }

      .bottom-content-top {
        height: calc(100% - 10px);
      }
    }
  }

  .main-part {
    // padding: 20px;
    padding-top: 20px;
    width: 100%;
    overflow-x: scroll;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background: #fff;
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
        // min-height: 600px;
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
}
</style>
