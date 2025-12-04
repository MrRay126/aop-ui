<template>
  <div class="table-mode">
    <div class="first-level">
      <div class="title">一级词频</div>
      <div class="table-container">
        <!-- source::{{ source }} -->
        <el-table
          ref="firstTable"
          :height="height"
          :highlight-current-row="true"
          :header-row-style="{}"
          v-loading="isloadingFirstTable"
          :data="source"
          @row-click="handleFirstTableRowClick"
        >
          <el-table-column
            width="200px"
            label="关键词"
            prop="keyword"
          ></el-table-column>
          <el-table-column
            width="200px"
            label="声量"
            prop="volumn"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="second-level">
      <div class="title">二级词频</div>
      <div class="table-container">
        <el-table
          ref="secondTable"
          :height="height"
          :highlight-current-row="true"
          :header-row-style="{}"
          v-loading="isloadingSecondTable"
          :data="source2"
          @row-click="handleSecondRowClick"
        >
          <el-table-column
            width="200px"
            label="二级关键词"
            prop="keyword"
          ></el-table-column>
          <el-table-column
            width="200px"
            label="声量"
            prop="volumn"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Object,
      default() {
        return {};
      },
    },
    height: {
      type: Number,
      default: 550,
    },

    // sourcedata
    firstTableSource: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      source: [],
      source2: [],
      tableHeight: 500,
      isloadingFirstTable: false,
      isloadingSecondTable: false,
    };
  },

  watch: {
    firstTableSource: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val) && val.length > 0) {
          this.source = val;
          this.$nextTick(() => {
            const firstWord = this.source[0];
            this.handleFirstTableRowClick(firstWord);
          });
        }
      },
    },
  },

  methods: {
    handleFirstTableRowClick(row) {
      // get source2
      const keyword = row.keyword;
      this.getSecondTableData(keyword);

      this.$refs["firstTable"].setCurrentRow(row);
    },
    handleSecondRowClick(row) {
      this.$emit("rowClick", row);
      this.$refs["secondTable"].setCurrentRow(row);
    },

    getFirstTableData() {
      const payload = {
        ...this.datas,
      };
      this.isloadingFirstTable = true;
      this.$store
        .dispatch("word/getFirstLevelTableData", payload)
        .then((res) => {
          this.source = res;
          if (this.source.length > 0) {
            const firstWord = this.source[0];
            this.handleFirstTableRowClick(firstWord);
          }
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isloadingFirstTable = false;
        });
    },

    getSecondTableData(word) {
      this.isloadingSecondTable = true;
      const payload = {
        ...this.datas,
        word,
      };
      this.$store
        .dispatch("word/getSecondLevelTableData", payload)
        .then((res) => {
          this.source2 = res;
          if (this.source2.length > 0) {
            this.handleSecondRowClick(this.source2[0]);
          }
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isloadingSecondTable = false;
        });
    },

    /**外部刷新使用 */
    _refresh() {
      this.getFirstTableData();
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.table-mode {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-items: flex-start;

  .first-level {
    .title {
      padding: 5px 0;
      color: $color-text;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .second-level {
    margin-left: 10px;

    .title {
      padding: 5px 0;
      color: $color-text;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
