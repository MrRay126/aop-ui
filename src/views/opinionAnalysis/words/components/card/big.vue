<template>
  <!-- 词云分析大卡 -->
  <div class="words-big-card" v-loading="isLoadingWordCard">
    <template v-if="!isViewXiaZuan">
      <template v-if="isViewInfos">
        <div class="top-tools">
          <el-radio-group
            v-model="mode"
            size="small"
            @change="handleModeChange"
          >
            <el-radio-button label="word">词云模式</el-radio-button>
            <el-radio-button label="table">列表模式</el-radio-button>
          </el-radio-group>
        </div>
        <div class="info-container">
          <template v-if="mode === 'word'">
            <div class="content-container-first">
              <div class="title">
                <span class="view-word-title">点击词 :</span>
                <span class="view-word-name">{{ currentViewWord.name }}</span>
              </div>
              <div class="cloud-chart">
                <template v-if="wordCloudChartData.length > 0">
                  <word-cloud-chart
                    @click="handleWordCloudItemClick"
                    :chartData="wordCloudChartData"
                    :height="400"
                  ></word-cloud-chart>
                </template>
                <template v-else>
                  <span class="no-data">暂无数据</span>
                </template>
              </div>
            </div>
          </template>
          <template v-else-if="mode === 'table'">
            <div class="table-mode-container">
              <table-mode
                ref="tableMode"
                :height="tableMaxHeight"
                :datas="{
                  ...cardConfigs,
                }"
                :firstTableSource="firstTableSource"
                @rowClick="handleTableRowClick"
              ></table-mode>
            </div>
          </template>
          <!-- 评价词表 -->
          <div class="table-container-second" v-if="dispositionTableVisible">
            <!-- wordTable:::{{ wordTable }} -->
            <template v-if="wordTable">
              <div class="word-types">
                <el-radio-group size="mini" v-model="wordDisposition">
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

                <div class="title">
                  <span @click="handleViewMore" class="view-more">
                    所有{{ contentTypeText }}内容<span
                      style="font-weight: bold"
                    >
                      {{ wordTable[wordDisposition].count }} </span
                    >条<i
                      class="el-icon-arrow-right"
                      style="font-size: 12px"
                    ></i>
                  </span>
                </div>
              </div>
              <div>
                <div class="content-container">
                  <dynamic-table
                    :dimension="dimensions"
                    :source="wordTable[wordDisposition].data"
                    :loading="isLoadingDispositionTable"
                    :height="tableMaxHeight"
                    :filter="filter"
                    :filterOptions="filterOptions"
                    sortMode="single"
                    :hasPagination="false"
                    :contentHandler="preDealContent"
                    @cell-click="jumpToViewDataPage"
                    border="inner"
                  ></dynamic-table>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 数据详情 -->
        <div class="more-contents-table-container">
          <div class="top-path">
            <span class="path-pre" @click="handleBackToInfoTables"
              >词云分析</span
            >
            /
            <span>
              <span style="font-weight: bold">{{ currentViewWord.name }}</span>
              的{{ dispositionDict[wordDisposition] }}数据详情
            </span>
            <span>(</span>
            <span>分析时段 </span>
            <span>
              {{ cardConfigs.time.start.split(" ")[0] }} ~
              {{ cardConfigs.time.end.split(" ")[0] }}
            </span>
            <span>)</span>
          </div>
          <div class="detail-table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                word: currentViewWord.name,
                sentiment_rough: wordDisposition,
                ...cardConfigs,
              }"
              :markContentWords="[currentViewWord.name]"
              apiAction="word/getDetailTableData"
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
import detailTable from "@/views/components/anylysisDetailTable";

import {
  DISPOSITION,
  getDimension,
} from "@/views/opinionAnalysis/words/data.js";

import wordCloudChart from "@/views/components/charts/wordCloudChart.vue";
import { bigCardMixin } from "@/views/mixins/card.js";
import { editTableMixin } from "@/views/mixins/anylysis.js";
import dynamicTable from "@/views/components/dynamicTable";
import tableMode from "@/views/opinionAnalysis/words/components/tableMode.vue";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  components: {
    wordCloudChart,
    detailTable,
    dynamicTable,
    tableMode,
    xiaZuanInfo,
  },

  mixins: [bigCardMixin, editTableMixin],

  props: {
    cardData: {
      type: Array,
      default() {
        return [];
      },
    },

    //卡片的配置信息
    cardConfigs: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isViewXiaZuan: false,
      xiaZuanRow: {},

      dispositionTableVisible: true,
      firstTableSource: [],
      mode: "word",
      dimensions: [],
      filter: {},
      filterOptions: {},

      currentViewWord: { name: "-" },
      // 词云数据
      wordCloudChartData: [
        // {
        //   name: "Sam S Club",
        //   value: 10000,
        // },
      ],

      tableMaxHeight: 500,

      isViewInfos: true,
      isLoadingWordCard: false,
      isLoadingDispositionTable: false,

      wordDisposition: DISPOSITION.positive,

      // 情感倾向 table
      wordTable: {
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

      dispositionDict: {
        [DISPOSITION.positive]: "正面",
        [DISPOSITION.negative]: "负面",
        [DISPOSITION.others]: "其他",
      },

      //词性字符串
      positive: DISPOSITION.positive,
      negative: DISPOSITION.negative,
      others: DISPOSITION.others,
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
    cardData: {
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          this.wordCloudChartData = val;
          this.handleWordCloudItemClick(val[0]);
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

    // 获取table模式的第一个数据表数据
    getFirstTableData() {
      const payload = {
        ...this.cardConfigs,
      };

      this.$store
        .dispatch("word/getFirstLevelTableData", payload)
        .then((res) => {
          // console.log("res::", res);
          this.firstTableSource = res;
        })
        .finally(() => {
          //
        });
    },

    handleTableRowClick(row) {
      const word = row.keyword;
      this.getDispositionTableData({ name: word });
    },

    handleModeChange() {
      if (this.mode === "table") {
        this.getFirstTableData();
      }

      //刷新table布局显示
      this.dispositionTableVisible = false;
      this.$nextTick(() => {
        this.dispositionTableVisible = true;
      });
    },

    setIfViewInfos(data) {
      this.isViewInfos = data;
      this.$emit("action", { action: "changeViewPart", data, cb: () => {} });
    },

    preDealContent(header, content) {
      // 数据映射处理
      if (["textType", "emotion"].includes(header.prop)) {
        content = content ? content.label : "";
      }

      if (header.prop === "content") {
        content = this.markContent(content, this.currentViewWord.word);
      }
      return content;
    },

    markContent(content, word) {
      let reg = new RegExp(`(${word})`, "g");
      content = content.replace(reg, "<span style='color:red'>$1</span>");
      return content;
    },
    //词云点击事件
    handleWordCloudItemClick(word) {
      this.currentViewWord = word;
      this.getDispositionTableData(word);
    },

    // api table2数据
    getDispositionTableData(word) {
      this.isLoadingDispositionTable = true;
      let payload = {
        ...this.cardConfigs,
        word: word.name,
      };

      this.$store
        .dispatch("word/getDispositionWordTable", payload)
        .then((data) => {
          //评价词
          this.wordTable = data;
          // this.filterOptions = data.filterOptions;
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingDispositionTable = false;
        });
    },

    //api获取更多详情数据
    getMoreDetailData() {
      this.isLoadingMoreDetailTable = true;
      this.moreDetailTable = [];
      let payload = {
        ...this.cardConfigs,
        word: this.currentViewWord.name,
        sentiment_rough: this.wordDisposition,

        pager: this.pager,
      };
      // use this.pager
      this.$store
        .dispatch("word/getDetailTableData", payload)
        .then((data) => {
          // console.log("data:", data);
          this.moreDetailTable = data.list;
          this.pager = data.pager;
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingMoreDetailTable = false;
        });
    },

    //浏览具体的网页
    jumpToViewDataPage({ row }) {
      // console.log("row:", row);
      if (row.link) {
        window.open(row.link);
      } else {
        this.$message({
          message: "该内容无外部链接!",
          duration: 3000,
          type: "info",
        });
      }
    },

    handleViewMore() {
      if (this.wordTable[this.wordDisposition].count > 0) {
        // this.isViewInfos = false;
        this.setIfViewInfos(false);
      }
    },

    handleBackToInfoTables() {
      // this.isViewInfos = true;
      this.setIfViewInfos(true);
    },

    handleChangePage() {
      this.getMoreDetailData();
    },

    handleSizeChange() {
      this.pager.curPage = 1;
      this.getMoreDetailData();
    },

    resetPageStatus() {
      const data = this.$options.data();

      // this.isViewInfos = data.isViewInfos;
      this.setIfViewInfos(data.isViewInfos);
      this.isLoadingWordCard = data.isLoadingWordCard;
      this.isLoadingDispositionTable = data.isLoadingDispositionTable;
      this.isLoadingMoreDetailTable = data.isLoadingMoreDetailTable;

      //设置数据
      this.wordTable = data.wordTable;
    },
  },
  created() {
    this.getEmotionOptions();
    // 获取文本类型options选项
    this.getTextTypeOptions();

    this.dimensions = getDimension(this);
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
// ::v-deep(.vxe-table--header-wrapper) {
//   color: #909399 !important;
//   background-color: #fff !important;
// }

.xia-zuan-info {
  width: 100%;
  height: 100%;
}

.words-big-card {
  height: 590px;
  overflow: hidden;
  padding: 10px 20px;

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

  ::v-deep {
    .more-contents-table-container {
      padding: 0;
    }
  }

  .top-tools {
    padding: 10px;
  }

  .info-container {
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: auto;
  }

  .content-text {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .more-contents-table-container {
    height: 100%;
    width: 100%;
    padding: 10px;

    .detail-table-container {
      height: calc(100% - 20px);
    }

    .top-path {
      text-align: left;
      padding-bottom: 10px;
      padding-left: 10px;
      // padding-top: 20px;
      font-size: 14px;
      color: $title-text-color;

      .path-pre {
        color: $color-desc;
        cursor: pointer;
      }
    }
  }

  .content-container-first {
    flex-shrink: 0;
    padding: 0 10px;
    color: $color-text;
    width: 500px;

    .cloud-chart {
      width: 100%;
      min-height: 500px;
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

      .view-word-name {
        padding: 0 3px;
      }
    }
  }

  .table-mode-container {
    flex-shrink: 0;
    padding: 10px;
  }

  .table-container-second {
    flex-shrink: 0;
    flex-grow: 1;
    min-width: 400px;
    height: 100%;
    margin-left: 10px;

    .view-more {
      &:hover {
        color: $color-primary;
      }
      cursor: pointer;
    }

    .word-types {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      height: 40px;
      min-width: 390px;

      .title {
        padding-right: 10px;
        font-size: 14px;
        color: $color-text;
      }
    }
  }
}
</style>
