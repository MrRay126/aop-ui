<template>
  <div class="word-block" ref="container">
    <!-- 关键词表 -->
    <div class="table-container-first">
      <div class="title">
        <!-- 占位元素 -->
        <span class="view-word-title">点击词 :</span>
        <span class="view-word-name">{{ currentViewWord.name }}</span>
      </div>
      <div class="cloud-chart" v-loading="isLoadingChart">
        <template v-if="wordCloudChartData.length > 0">
          <word-cloud-chart
            @click="handleWordCloudItemClick"
            shape="square"
            :gridSize="20"
            :chartData="wordCloudChartData"
            :height="wordChartHeight"
          ></word-cloud-chart>
        </template>
        <template v-else>
          <span class="no-data">暂无数据</span>
        </template>
      </div>
    </div>
    <!-- 评价词表 -->
    <div class="table-container-second">
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
              所有{{ contentTypeText }}内容<span style="font-weight: bold">
                {{ wordTable[wordDisposition].count }} </span
              >条<i class="el-icon-arrow-right" style="font-size: 12px"></i>
            </span>
          </div>
        </div>
        <div>
          <!-- dimensions:::{{ dimensions }} -->

          <dynamic-table
            :dimension="dimensions"
            :source="wordTable[wordDisposition].data"
            :loading="isLoadingTable"
            :height="wordTableHeight"
            :filter="tableFilter"
            :filterOptions="tableFilterOptions"
            sortMode="single"
            :hasPagination="false"
            :contentHandler="preDealContent"
            border="inner"
          ></dynamic-table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  DISPOSITION,
  getDimension,
} from "@/views/opinionAnalysis/words/data.js";
import dynamicTable from "@/views/components/dynamicTable";
import wordCloudChart from "@/views/components/charts/wordCloudChart.vue";
import { editTableMixin } from "@/views/mixins/anylysis.js";
export default {
  props: {
    datas: {
      type: Object,
      default() {
        return {};
      },
    },

    wordChartHeight: {
      type: Number,
      default: 600,
    },

    wordTableHeight: {
      type: Number,
      default: 600,
    },

    tableApiAction: {
      type: String,
      default: "",
    },

    chartApiAction: {
      type: String,
      default: "",
    },
  },
  components: {
    dynamicTable,
    wordCloudChart,
  },
  mixins: [editTableMixin],
  data() {
    return {
      emotionOptions: [],
      textTypeOptions: [],
      tableFilterOptions: {},
      tableFilter: {},
      tableMaxHeight: 600,
      isLoadingChart: false,
      isLoadingTable: false,
      dimensions: [],
      wordDisposition: DISPOSITION.positive,
      currentViewWord: { name: "-" },
      //词性字符串
      positive: DISPOSITION.positive,
      negative: DISPOSITION.negative,
      others: DISPOSITION.others,
      dispositionDict: {
        [DISPOSITION.positive]: "正面",
        [DISPOSITION.negative]: "负面",
        [DISPOSITION.others]: "其他",
      },

      wordCloudChartData: [
        // {
        //   name: "Sam S Club",
        //   value: 10000,
        // },
      ],

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
    };
  },

  computed: {
    contentTypeText() {
      const disposition = this.wordDisposition;
      let text = this.dispositionDict[disposition];
      return text;
    },
  },

  methods: {
    //词云点击事件
    handleWordCloudItemClick(word) {
      this.currentViewWord = word;
      this.getDispositionTableData(word);
    },

    handleViewMore() {
      const data = {
        ...this.datas,
        word: this.curWord.name,
      };
      this.$emit("event", { action: "viewDetail", data });
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

    getParams() {
      return {
        word: this.curWord.name,
        ...this.datas,
      };
    },

    // 重新备注 更新时会使用
    getCommonParams() {
      return this.getParams();
    },

    getDispositionTableData(word) {
      this.curWord = word;
      this.isLoadingTable = true;

      this.detailTable = [];
      let payload = {
        word: word.name,
        ...this.datas,
      };

      this.$store
        .dispatch("kol/getXiaZuanWordTabledata", payload)
        .then((data) => {
          //评价词
          this.wordTable = data || {};
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingTable = false;
        });
    },

    getChartData() {
      const payload = {
        ...this.datas,
      };

      this.isLoadingChart = true;
      this.wordCloudChartData = [];

      this.$store
        .dispatch("kol/getXiaZuanWordChart", payload)
        .then((res) => {
          this.wordCloudChartData = res.words;
          if (res.words.length > 0) {
            const firstWord = res.words[0];
            this.handleWordCloudItemClick(firstWord);
          }
        })
        .catch((e) => {
          console.log("error::", e);
        })
        .finally(() => {
          this.isLoadingChart = false;
        });
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
  },

  created() {
    this.dimensions = getDimension(this);
    this.getChartData();
    this.getTextTypeOptions();
    this.getEmotionOptions();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.word-block {
  // padding: 20px;
  padding-top: 20px;
  width: 100%;
  overflow-x: auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #fff;
  height: 100%;
  position: relative;

  & > div:not(:last-child) {
    margin-right: 1%;
  }

  .table-container-first {
    flex: 1 1 auto;
    padding: 0 10px;
    color: $color-text;
    width: 500px;
    flex-shrink: 0;
    height: 100%;

    .cloud-chart {
      width: 100%;
      min-height: 400px;
      height: calc(100% - 72px);
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

  .table-container-second {
    flex: 1 1 auto;
    width: 300px;
    height: 100%;
    min-width: 465px;

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

  .color-red {
    color: red;
  }

  .color-green {
    color: #52c51d;
  }
}
</style>
