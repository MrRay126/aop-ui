<template>
  <div class="hot-words">
    <div class="hot-word-inner">
      <div class="top-section">
        <div>
          <span>热词管理</span>
          <el-tooltip
            content="利用热词和词组，将项目中的专有词进行统一管理。"
            effect="light"
            placement="right"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <template>
          <div
            v-show="multipleSelection.length === 0"
            class="operation-container"
          >
            <el-button size="mini" type="danger" @click="handleStopWordBtnClick"
              >+ 停用词</el-button
            >
            <!-- <el-button size="mini" type="primary" @click="handleCreateWordGroup"
              >+ 创建词组</el-button
            > -->
            <el-button size="mini" type="success" @click="handleCreateWord">
              + 创建热词
            </el-button>
            <el-input
              size="mini"
              placeholder="请输入"
              class="search-input"
              v-model="search"
              clearable
              @input="handleSearchChange"
            >
              <template slot="append">
                <el-button
                  @click="handleSearchChange"
                  icon="el-icon-search"
                ></el-button>
              </template>
            </el-input>
            <svg-icon
              icon-class="list"
              class="list-icon"
              @click="handleOpenWordList"
            ></svg-icon>
          </div>
        </template>
        <template>
          <div
            v-show="multipleSelection.length !== 0"
            class="mutiple-operation-container"
          >
            <el-button
              type="danger"
              size="mini"
              :loading="isMultipleDeleting"
              @click="handleDeleteRows"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              :disabled="isMultipleDeleting"
              @click="handleCancelSelectRows"
            >
              取消
            </el-button>
          </div>
        </template>
      </div>
      <div class="table-container">
        <dynamic-table
          :height="600"
          :dimension="tableDimensions"
          :source="tableData"
          :filter="filter"
          :filterOptions="filterOptions"
          :pager="pager"
          :loading="isLoadingTable"
          :selections="multipleSelection"
          sortMode="single"
          @getTableData="handleGetTableData"
          @selectChange="handleSelectionChange"
        ></dynamic-table>
      </div>
    </div>

    <word-dialog
      :visible="isWordDialogVisible"
      :mode="wordMode"
      :wordData="wordData"
      @submit="handleWordSubmit"
      @close="handleCloseWordDialog"
    ></word-dialog>

    <word-group-list-dialog
      :visible="isWordGroupListDialogVisible"
      @close="handleCloseWordGroupList"
      @createWordGroup="handleCreateWordGroup"
      @edit="handleEditWord"
    ></word-group-list-dialog>

    <!-- 停用词配置框 -->
    <stop-word-dialog
      :visible="isStopUseWordDialogVisible"
      @close="handleStopUseWordClose"
    ></stop-word-dialog>
  </div>
</template>
<script>
import wordGroupListDialog from "./components/wordGroupListDialog.vue";
import wordDialog from "./components/wordDialog.vue";
import stopWordDialog from "@/views/dataManage/hotWords/components/stopWordDialog.vue";
import dynamicTable from "@/views/components/dynamicTable/index.vue";

export default {
  components: {
    wordGroupListDialog,
    wordDialog,
    stopWordDialog,
    dynamicTable,
  },
  props: {},
  data() {
    return {
      isStopUseWordDialogVisible: false,

      isWordDialogVisible: false,
      isWordGroupListDialogVisible: false,
      isWordGroupDialogVisible: false,
      isLoadingTable: false,
      isMultipleDeleting: false,

      tableData: [],

      tableDimensions: [
        {
          label: "",
          prop: "",
          width: "50px",
          actionType: "selection",

          ifDisabled(row) {
            return false;
          },

          ifVisible(row) {
            return row.perms.remove;
          },
        },
        {
          label: "热词",
          prop: "name",
          minWidth: "100px",
          // hasTooltip: true, //是否使用toolTip
        },
        {
          label: "热词描述",
          prop: "comment",
          minWidth: "200px",
          hasTooltip: true, //是否使用toolTip
        },
        {
          label: "创建人",
          prop: "creator",
          width: "150px",
          actionType: ["filter"], // 点击分类类型
        },

        {
          label: "创建时间",
          prop: "createTime",
          width: "200px",
          // hasTooltip: true, //是否使用toolTip
          actionType: ["sort"], // 点击分类类型
        },

        {
          label: "更新时间",
          prop: "updateTime",
          width: "200px",
          actionType: ["sort"], // 点击分类类型
        },

        {
          label: "别名",
          prop: "aliasName",
          minWidth: "200px",
        },

        {
          label: "操作",
          prop: "",
          width: "150px",

          isActionColumn: true, // 是否是操作列 查看、删除等
          actions: [
            {
              //函数或字符串
              label(row) {
                return "修改";
              },

              loadingRowTag: "",

              ifShow(row) {
                return true;
              },

              ifDisabled(row) {
                return !row.perms.edit;
              },

              action(row) {
                return this.handleEditWord(row);
              },
            },
            {
              name: "deleteWord",

              label(row) {
                return "删除";
              },

              ifShow(row) {
                return true;
              },

              ifDisabled(row) {
                return !row.perms.remove;
              },

              action(row) {
                return this.handleDelete(row);
              },
            },
          ],
        },
      ],

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 10,
      },
      filter: {},
      search: "",

      filterOptions: {},

      multipleSelection: [],
      wordGroupData: null,
      wordData: null,
      wordgroupMode: "create",
      wordMode: "create",
    };
  },

  // computed: {
  //   hasCheckBoxColumn() {
  //     if (Array.isArray(this.tableData)) {
  //       return this.tableData.some((item) => {
  //         return item.perms.remove;
  //       });
  //     }
  //     return false;
  //   },
  // },

  watch: {
    "$store.getters.appId": {
      immediate: true,
      handler(val) {
        if (val) {
          this.getTableData();
        }
      },
    },
  },

  methods: {
    handleStopWordBtnClick() {
      this.isStopUseWordDialogVisible = true;
    },

    handleStopUseWordClose() {
      this.isStopUseWordDialogVisible = false;
    },

    handleCheckedAll() {
      this.multipleSelection = [];
      this.tableData.forEach((row) => {
        if (row.perms.remove) {
          this.$set(row, "checked", this.checkedAll);

          if (this.checkedAll) {
            this.multipleSelection.push(row);
          }
        }
      });
    },

    handleWordSubmit() {
      this.getTableData();
    },

    handleCreateWord() {
      this.wordMode = "create";
      this.handleOpenWordDialog();
    },

    handleEditWord(data) {
      this.wordData = data;
      this.wordMode = "edit";
      this.handleOpenWordDialog();
    },

    handleStopWord() {
      this.isStopWordDialogVisible = true;
    },

    handleCreateWordGroup() {
      this.wordgroupMode = "create";
      this.handleOpenWordGroupDialog();
    },

    handleCloseWordGroup() {
      this.isWordGroupDialogVisible = false;
    },

    handleCloseWordGroupList() {
      this.isWordGroupListDialogVisible = false;
    },

    handleOpenWordList() {
      this.isWordGroupListDialogVisible = true;
    },

    handleCloseWordDialog() {
      this.isWordDialogVisible = false;
    },

    handleOpenWordDialog() {
      this.isWordDialogVisible = true;
    },

    handleOpenWordGroupDialog() {
      this.isWordGroupDialogVisible = true;
    },

    handleOpenHotwordDialog() {
      this.isWordGroupListDialogVisible = true;
    },

    handleWordGroupSubmit() {
      this.getTableData();
    },

    handleSelectionChange(rows) {
      this.multipleSelection = rows;
    },

    //批量删除
    handleDeleteRows() {
      //  console.log(this.multipleSelection);

      this.$confirm("确定要删除选中的热词吗?", "提示")
        .then(async () => {
          this.isMultipleDeleting = true;

          const deleteIds = this.multipleSelection.map((item) => {
            return item.id;
          });
          const payload = {
            project_id: this.$store.getters.appId,
            ids: deleteIds,
          };
          await this.deleteWord(payload);

          this.isMultipleDeleting = false;
          this.getTableData();
        })
        .catch(() => {
          //noop
        });
    },

    deleteWord(payload = {}) {
      return this.$store
        .dispatch("hotWord/deleteWord", payload)
        .then(() => {
          this.$message({
            message: "删除成功!",
            type: "success",
            duration: 3000,
          });
        })
        .catch(() => {
          // noop
        });
    },

    handleCancelSelectRows() {
      this.tableData.forEach((item) => (item.checked = false));
      this.multipleSelection = [];
    },

    handleEdit(row) {
      this.wordgroupMode = "edit";
      this.wordGroupData = row;
      this.handleOpenWordGroupDialog();
    },

    handleDelete(row) {
      this.$confirm("确定要删除吗?", "提示")
        .then(async () => {
          this.$set(row, "deleteWord", true);

          const payload = {
            project_id: this.$store.getters.appId,
            ids: [row.id],
          };

          await this.deleteWord(payload);
          this.$set(row, "deleteWord", false);

          this.getTableData();
        })
        .catch(() => {
          // noop
        });
    },

    handleGetTableData(data) {
      this.filter = data.filter;
      this.pager = data.pager;
      this.getTableData();
    },

    getTableData() {
      this.multipleSelection = [];
      this.isLoadingTable = true;

      this.wordList = [];
      this.checkedWordList = [];
      this.loading = true;

      const payload = {
        search: this.search,
        curPage: this.pager.curPage,
        pageSize: this.pager.pageSize,
        project_id: this.$store.getters.appId,
        ...this.filter,
      };

      this.$store
        .dispatch("hotWord/getWordList", payload)
        .then((data) => {
          this.tableData = data.results.map((item) => {
            return {
              ...item,
              aliasName: item.alias
                .map((item) => {
                  return item.name;
                })
                .join(","),
            };
          });
          this.pager.total = data.pager.total;
          this.filterOptions = data.filterOptions;
        })
        .catch((err) => {
          // noop
        })
        .finally(() => {
          this.isLoadingTable = false;
        });
    },

    // getTableData() {
    //   this.multipleSelection = [];
    //   this.isLoadingTable = true;

    //   const payload = {
    //     project_id: this.$store.getters.appId,
    //     curPage: this.pager.curPage,
    //     pageSize: this.pager.pageSize,
    //     ...this.filter,
    //     search: this.search,
    //   };
    //   this.$store
    //     .dispatch("hotWord/getWordGroupList", payload)
    //     .then((data) => {
    //       this.tableData = data.results.map((item) => {
    //         // 别名
    //         const aliasNames =
    //           item.alias
    //             .map((item) => {
    //               return item.name;
    //             })
    //             .join(",") || "-";

    //         // 成员词显示name
    //         const membersNames = item.members.map((item) => {
    //           return item.name;
    //         });

    //         // 注释
    //         const commentShow = item.comment || "-";

    //         return {
    //           ...item,
    //           checked: false,
    //           aliasNames,
    //           membersNames,
    //           commentShow,
    //         };
    //       });

    //       this.pager.total = data.pager.total;
    //       this.filterOptions = data.filterOptions;

    //       this.isIndeterminate = false;
    //       this.checkedAll = false;
    //     })
    //     .catch(() => {
    //       // noop
    //     })
    //     .finally(() => {
    //       this.isLoadingTable = false;
    //     });
    // },

    handleSearchChange() {
      this.pager.curPage = 1;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getTableData();
      }, 300);
    },
  },
  created() {
    // this.getTableData();
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";

.tooltip-content-inner {
  max-width: 400px;
}

.hot-words {
  padding: 20px;
  background: $background-color;
  height: 100%;
  overflow: hidden;

  .hot-word-inner {
    background: #fff;
  }

  .top-section {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 20px;
    border-bottom: 1px solid $color-border;

    .el-icon-question {
      font-size: 14px;
      color: $color-text;
      margin-left: 3px;
    }

    .search-input {
      margin-left: 10px;
      width: 200px;
    }

    .operation-container {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .list-icon {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }

  .table-container {
    .el-icon-question {
      font-size: 14px;
      color: $color-text;
      margin-left: 5px;
    }

    .pagination-container {
      padding: 15px;
      text-align: center;
    }

    .value-container {
      width: 100%;

      white-space: pre;
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
}
</style>
