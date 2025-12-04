<template>
  <div>
    <el-drawer
      :visible="visible"
      @open="handleOpen"
      @close="handleClose"
      class="new-word-dialog"
      size="1000px"
      direction="rtl"
    >
      <div class="title" slot="title">
        <span class="title-text">词组管理</span>
        <div class="operation-container">
          <span v-show="multipleSelection.length > 0">
            <el-button
              type="danger"
              size="mini"
              :loading="isDeleting"
              @click="handleDeleteRows"
              >删除</el-button
            >
            <el-button size="mini" @click="handleCancel" :disabled="isDeleting"
              >取消</el-button
            >
          </span>

          <span v-show="multipleSelection.length === 0">
            <el-button size="mini" type="success" @click="handleCreateWordGroup"
              >+ 创建词组</el-button
            >
            <el-input
              class="input-item"
              placeholder="请输入"
              size="mini"
              clearable
              v-model="search"
              @input="handleSearch"
            >
              <template slot="append">
                <el-button
                  icon="el-icon-search"
                  @click="handleSearch"
                ></el-button>
              </template>
            </el-input>
          </span>
        </div>
      </div>
      <div class="hotword-list">
        <dynamic-table
          :height="600"
          :dimension="tableDimensions"
          :source="tableData"
          :filter="filter"
          :filterOptions="filterOptions"
          :pager="pager"
          :loading="isLoadingTable"
          :selections="multipleSelection"
          @getTableData="handleGetTableData"
          @selectChange="handleSelectionChange"
        ></dynamic-table>
      </div>
    </el-drawer>

    <word-group-dialog
      :visible="isWordGroupDialogVisible"
      :mode="wordgroupMode"
      :wordGroupData="wordGroupData"
      @close="handleCloseWordGroup"
      @submit="handleWordGroupSubmit"
    ></word-group-dialog>
  </div>
</template>
<script>
import dynamicTable from "@/views/components/dynamicTable/index.vue";
import wordGroupDialog from "./wordGroupDialog.vue";

export default {
  props: {
    visible: {
      default: true,
      type: Boolean,
    },
  },
  components: {
    dynamicTable,
    wordGroupDialog,
  },
  data() {
    return {
      wordgroupMode: "edit",
      wordGroupData: null,
      isWordGroupDialogVisible: false,
      isLoadingTable: false,

      tableData: [],
      multipleSelection: [],

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
      search: "",
      isDeleting: false,

      filter: {},
      filterOptions: {},

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
          label: "热词组",
          prop: "name",
          minWidth: "100px",
        },
        {
          label: "创建人",
          prop: "creator",
          minWidth: "120px",
          actionType: ["filter"], // 点击分类类型
        },

        {
          label: "创建时间",
          prop: "createTime",
          width: "180px",
          actionType: ["sort"], // 点击分类类型
        },

        {
          label: "成员词",
          prop: "membersNames",
          width: "180px",
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
                return this.$parent.handleEdit(row);
              },
            },
            {
              name: "deleteWordGroup",

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
                return this.$parent.handleDelete(row);
              },
            },
          ],
        },
      ],
    };
  },

  methods: {
    handleEdit(row) {
      this.wordgroupMode = "edit";
      this.wordGroupData = row;
      this.handleOpenWordGroupDialog();
    },

    handleWordGroupSubmit() {
      this.getTableData();
    },

    handleCreateWordGroup() {
      this.wordgroupMode = "create";
      this.handleOpenWordGroupDialog();
    },

    handleOpenWordGroupDialog() {
      this.isWordGroupDialogVisible = true;
    },

    handleCloseWordGroup() {
      this.isWordGroupDialogVisible = false;
    },

    handleModify(row) {
      this.$emit("edit", row);
    },

    handleSearch() {
      this.pager.curPage = 1;
      this.getTableData();
    },

    handleCheckBoxChange() {
      this.multipleSelection = this.tableData
        .filter((item) => item.checked)
        .map((item) => item.id);
    },

    //批量删除
    handleDeleteRows() {
      //  console.log(this.multipleSelection);

      this.$confirm("确定要删除选中的词组吗?", "提示")
        .then(async () => {
          this.isDeleting = true;

          const deleteIds = this.multipleSelection.map((item) => {
            return item.id;
          });
          const payload = {
            project_id: this.$store.getters.appId,
            ids: deleteIds,
          };
          await this.deleteWrodGroup(payload);

          this.isDeleting = false;
          this.getTableData();
        })
        .catch(() => {
          //noop
        });
    },

    handleDelete(row) {
      this.$confirm("确定要删除吗?", "提示")
        .then(async () => {
          this.$set(row, "deleteWordGroup", true);

          const payload = {
            ids: [row.id],
            project_id: this.$store.getters.appId,
          };

          await this.deleteWrodGroup(payload);

          this.$set(row, "deleteWordGroup", false);
        })
        .catch(() => {
          //noop
        });
    },

    deleteWrodGroup(payload) {
      return this.$store
        .dispatch("hotWord/deleteWordGroup", payload)
        .then(() => {
          this.$message({
            message: "删除成功!",
            type: "success",
            duration: 3000,
          });

          this.handleCancel();
          this.getTableData();
        })
        .catch(() => {
          // noop
        })
        .finally(() => {});
    },

    handleCancel() {
      this.multipleSelection = [];
      this.tableData.forEach((item) => {
        item.checked = false;
      });
    },

    async handleOpen() {
      this.getTableData();
    },

    handleClose() {
      this.$emit("close");
    },

    handleSelectionChange(rows) {
      this.multipleSelection = rows;
    },

    handleGetTableData(data) {
      this.filter = data.filter;
      this.pager = data.pager;
      this.getTableData();
    },

    getTableData() {
      this.multipleSelection = [];
      this.isLoadingTable = true;

      const payload = {
        project_id: this.$store.getters.appId,
        curPage: this.pager.curPage,
        pageSize: this.pager.pageSize,
        ...this.filter,
        search: this.search,
      };

      this.$store
        .dispatch("hotWord/getWordGroupList", payload)
        .then((data) => {
          this.tableData = data.results.map((item) => {
            // 成员词显示name
            const membersNames =
              item.members
                .map((item) => {
                  return item.name;
                })
                .join(" , ") || "-";

            // 注释
            const commentShow = item.comment || "-";

            return {
              ...item,
              checked: false,
              // aliasNames,
              membersNames,
              commentShow,
            };
          });

          this.pager.total = data.pager.total;
          this.filterOptions = data.filterOptions;

          this.isIndeterminate = false;
          this.checkedAll = false;
        })
        // .catch(() => {
        //   // noop
        //   console.log()
        // })
        .finally(() => {
          this.isLoadingTable = false;
        });
    },
  },
  created() {
    // this.handleOpen();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.new-word-dialog {
  .pagination-container {
    text-align: center;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .operation-container {
      margin-right: 50px;
    }
  }

  .input-item {
    width: 200px;
    margin-left: 20px;
  }

  .hotword-list {
    border-top: 1px solid $color-border;
    width: 100%;
    height: calc(100% - 80px);
    overflow: auto;

    .checked-list-item {
      background: $background-color;
    }
    .hot-word-item {
      border-bottom: 1px solid $color-border;
      margin-bottom: 2px;

      .word-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px 15px 15px;

        border-bottom: 1px solid #f6f6f6;

        .info-content {
          display: flex;
          align-items: center;
          justify-content: flex-start;

          .word-name {
            flex-shrink: 0;
            color: $color-text;
            font-size: 16px;
            margin-left: 10px;
          }

          .word-comment {
            display: inline-block;
            vertical-align: middle;
            max-width: 500px;
            overflow: hidden;
            white-space: pre;
            text-overflow: ellipsis;
            margin-left: 10px;
            font-size: 12px;
            color: $color-desc;
          }
        }
      }

      .word-alias {
        padding: 15px 20px;

        .alias-item {
          display: inline-block;
          padding: 3px 10px;
          background: $background-color;
          border-radius: 5px;
          border: 1px solid $color-border;
          font-size: 12px;
          margin-right: 10px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
