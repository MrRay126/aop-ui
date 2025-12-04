<template>
  <!-- 话题类聚 -->
  <div class="theme-big-card">
    <template v-if="!isViewXiaZuan">
      <template v-if="isViewInfos">
        <div class="tables-container">
          <div class="key-word-table-container">
            <!-- source:::{{ source }} -->
            <el-table
              ref="keyWordTable"
              class="data-table"
              row-class-name="table-row"
              :data="source"
              :max-height="tableMaxHeight"
              :highlight-current-row="true"
              v-loading="isLoadingWordTypesTable"
              @row-click="handleKeyWordRowClick"
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
                  <template v-if="typeof scope.row.data.count === 'number'">
                    <template v-if="scope.row.data.count === 0">
                      <span>0</span>
                    </template>
                    <template v-else>
                      <template v-if="scope.row.data.isUp">
                        <span class="color-green"
                          >▲ <span>{{ scope.row.data.count }}%</span></span
                        >
                      </template>
                      <template v-else>
                        <span class="color-red"
                          >▼ <span>{{ scope.row.data.count }}%</span></span
                        >
                      </template>
                    </template>
                  </template>
                  <template v-else> - </template>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="type-word-table-container">
            <template v-if="wordTable">
              <div class="word-types-and-more">
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

                <div class="title">
                  <el-button
                    type="text"
                    @click="handleViewMore"
                    class="view-more"
                    :disabled="wordTable[wordDisposition].count === 0"
                  >
                    所有{{ contentTypeText }}内容<span
                      style="font-weight: bold"
                    >
                      {{ wordTable[wordDisposition].count }} </span
                    >条<i
                      class="el-icon-arrow-right"
                      style="font-size: 12px"
                    ></i>
                  </el-button>
                </div>
              </div>

              <div class="two-tables-container">
                <!-- 口碑词表 -->
                <div class="disposition-data-table">
                  <el-table
                    :data="wordTable[wordDisposition].data"
                    row-class-name="table-row"
                    :height="tableMaxHeight"
                    v-loading="isLoadingDispositionTable"
                    ref="dispositionTable"
                    @row-click="handleDispositionRowClick"
                    :highlight-current-row="true"
                  >
                    <el-table-column prop="word" width="150" label="口碑词">
                    </el-table-column>
                    <el-table-column prop="volume" width="150" label="声量">
                    </el-table-column>
                  </el-table>
                </div>

                <!-- 评价内容表 -->
                <div class="content-container">
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
              </div>
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 数据详情 -->
        <div class="more-contents-table-container">
          <div class="top-path">
            <span class="path-pre" @click="handleBackToInfoTables">{{
              keywordRow.word
            }}</span>
            /
            <span>
              <span style="font-weight: bold">{{ keywordRow.word }}</span
              >的{{ dispositionDict[wordDisposition] }}数据详情
            </span>
          </div>

          <div class="detail-table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                word: keywordRow.word,
                sentiment_rough: wordDisposition,
                project_id: $store.getters.appId,
                ...cardConfigs,
              }"
              :markContentWords="[keywordRow.word]"
              :apiAction="
                datas?.detailTableAction
                  ? datas.detailTableAction
                  : 'theme/getDetailTableData'
              "
              @event="handleDetailTableEvent"
            ></detail-table>
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
} from "@/views/opinionAnalysis/theme/data.js";

import { bigCardMixin } from "@/views/mixins/card.js";
import { editTableMixin } from "@/views/mixins/anylysis.js";
import dynamicTable from "@/views/components/dynamicTable";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  components: {
    detailTable,
    dynamicTable,
    xiaZuanInfo,
  },

  mixins: [bigCardMixin, editTableMixin],

  props: {
    //卡片显示使用的数据
    cardData: {
      type: Object,
      default() {
        return {
          ranks: [],
        };
      },
    },

    //卡片的配置信息
    cardConfigs: {
      type: Object,
      default() {
        return {
          filter: {},
        };
      },
    },

    datas: {
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

      dimensions: [],
      filter: {},
      filterOptions: {},

      ///

      tableMaxHeight: 520,
      detailTableHeight: 300,

      isLoadingWordTypesTable: false,
      isLoadingDispositionTable: false,

      isLoadingDetailTable: false,
      dispositionDisabled: false,
      isViewInfos: true,

      wordDisposition: DISPOSITION.positive,

      keywordRow: {},
      dispositionRow: {},

      source: [
        //  {
        //   rank: 1,
        //   word: "角色",
        //   volume: 12000,
        //   data: { isUp: true, count: 200 },
        // },
      ],

      wordTable: {
        positive: {
          percent: "",
          count: 0, // 所有评价内容量
          data: [
            // { word: "钻石", volume: 100 },
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

      detailTable: [
        // { content: "钻石级别的游戏啊", time: "2020/12/21", channel: "微博" },
      ],

      positive: DISPOSITION.positive,
      negative: DISPOSITION.negative,
      others: DISPOSITION.others,

      dispositionDict: {
        [DISPOSITION.positive]: "正面",
        [DISPOSITION.negative]: "负面",
        [DISPOSITION.others]: "其他",
      },

      moreDetailTable: [
        // { content: "钻石级别的游戏啊", time: "2020/12/21", channel: "微博" },
      ],

      //二级翻页的pager不是报表保存的数据
      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
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
      // immediate: true,
      handler(val) {
        if (val && val.ranks) {
          this.isViewInfos = true;

          this.source = val.ranks;
          if (this.source.length > 0) {
            //设置点击
            this.$nextTick(() => {
              this.handleKeyWordRowClick(this.source[0]);
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
        content = this.markContent(content, this.dispositionRow.word);
      }
      return content;
    },

    //
    handleBackToInfoTables() {
      // this.isViewInfos = true;
      this.setIfViewInfos(true);

      this.$nextTick(() => {
        this.setKeywordTableFocusRow(this.keywordRow);
        this.setDispositionTableFocusRow(this.dispositionRow);
      });
    },

    markContent(content, word) {
      let reg = new RegExp(`(${word})`, "g");
      content = content.replace(reg, "<span style='color:red'>$1</span>");
      return content;
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

    handleDispositiobRadioChange() {
      this.setDispositionTableFocusRow(this.dispositionRow);
    },

    setDispositionTableFocusRow(row) {
      if (row && this.$refs["dispositionTable"]) {
        this.$refs["dispositionTable"].setCurrentRow(row);
      }
    },

    setKeywordTableFocusRow(row) {
      if (row && this.$refs["keyWordTable"]) {
        this.$refs["keyWordTable"].setCurrentRow(row);
      }
    },

    // 获取参数
    getCommonParams() {
      const configs = this.cardConfigs;
      let payload = {
        project_id: this.$store.getters.appId,
        ...configs,
        // filters: configs.filter.filters,
        // time: configs.time,
        // value: configs.filter.value,
        // // time_unit: this.particle,
        // groups: configs.groupper,
      };

      return payload;
    },

    handleViewMore() {
      if (this.pager.total > 0) {
        // this.isViewInfos = false;
        this.setIfViewInfos(false);
      }
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

      const action = this.datas?.detailTableAction
        ? this.datas.detailTableAction
        : "theme/getDetailTableData";

      this.$store
        .dispatch(action, payload)
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

    handleDispositionRowClick(row) {
      this.dispositionRow = row;
      this.setDispositionTableFocusRow(row);
      this.getDetailTableData(row);

      //初始化显示数据
      this.pager = this.$options.data().pager;
      this.detailTable = [];
      this.moreDetailTable = [];
    },

    handleKeyWordRowClick(row) {
      this.keywordRow = row;
      this.setKeywordTableFocusRow(row);

      this.getDispositionTableData(row, () => {
        // console.log(111, this.wordTable, this.wordDisposition);
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
      this.moreDetailTable = [];
    },

    getDispositionTableData(row, cb = null) {
      this.isLoadingDispositionTable = true;
      // this.wordTable={}
      this.detailTable = [];
      let payload = {
        ...this.getCommonParams(),
        word: row.word,
      };

      const action = this.datas?.dispositionTableAction
        ? this.datas.dispositionTableAction
        : "theme/getDispositionTableData";

      this.$store
        .dispatch(action, payload)
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
  },
  created() {
    // 获取整体情感options选项
    this.getEmotionOptions();
    // 获取文本类型options选项
    this.getTextTypeOptions();

    this.dimensions = getDimension(this);
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

::v-deep(.vxe-table--header-wrapper) {
  color: #909399 !important;
  background-color: #fff !important;
}

.theme-big-card {
  padding: 10px 20px;
  width: 100%;
  // overflow-x: auto;
  height: 590px;

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

  .more-contents-table-container {
    height: 100%;
  }

  .detail-table-container {
    height: calc(100% - 30px);
  }

  .pagination-container {
    margin-top: 15px;
    text-align: center;

    .pagination {
      display: inline-block;
    }
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

  .color-red {
    color: red;
  }

  .color-green {
    color: #52c51d;
  }

  .tables-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    .word-types-and-more {
      display: flex;
      justify-content: space-between;
    }

    .key-word-table-container {
      padding-top: 40px;
      flex: 0 0 auto;
    }

    .type-word-table-container {
      margin-left: 20px;
      padding-right: 20px;
      flex: 1;

      .two-tables-container {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .disposition-data-table {
          flex: 0 1 auto;
        }

        .detail-data-table {
          margin-left: 20px;
        }

        .content-container {
          padding-left: 20px;
          flex: 1 1 auto;
        }
      }
    }
  }
}
</style>
