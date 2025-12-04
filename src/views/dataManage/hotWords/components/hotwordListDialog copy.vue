<template>
  <el-drawer
    :visible="visible"
    @open="handleOpen"
    @close="handleClose"
    v-loading="loading"
    class="new-word-dialog"
    size="800px"
    direction="rtl"
    title="全部热词"
  >
    <div class="title" slot="title">
      <span class="title-text">全部热词</span>
      <div class="operation-container">
        <span v-show="checkedWordList.length > 0">
          <el-button
            type="danger"
            size="mini"
            :loading="isDeleting"
            @click="handleDelete"
            >删除</el-button
          >
          <el-button size="mini" @click="handleCancel" :disabled="isDeleting"
            >取消</el-button
          >
        </span>

        <span v-show="checkedWordList.length === 0">
          <el-button size="mini" type="success" @click="handleCreateWord"
            >+ 创建热词</el-button
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
      <template v-for="(word, index) in wordList">
        <div
          class="hot-word-item"
          :class="{ 'checked-list-item': word.checked }"
          :key="index"
        >
          <div class="word-info">
            <div class="info-content">
              <template v-if="word.perms.remove">
                <el-checkbox
                  v-model="word.checked"
                  @change="handleCheckBoxChange"
                ></el-checkbox>
              </template>
              <span class="word-name">{{ word.name }}</span>
              <el-popover
                :content="word.comment"
                width="400"
                trigger="hover"
                placement="top-start"
              >
                <span class="word-comment" slot="reference">{{
                  word.comment
                }}</span>
              </el-popover>
            </div>
            <el-button
              type="text"
              :disabled="!word.perms.edit"
              size="mini"
              @click="handleModify(word)"
              >修改</el-button
            >
          </div>
          <div class="word-alias">
            <template v-for="(aliasItem, aliasIndex) in word.alias">
              <span class="alias-item" :key="aliasIndex">
                {{ aliasItem.name }}</span
              >
            </template>
          </div>
        </div>
      </template>
    </div>
    <div class="pagination-container">
      <el-pagination
        class="pagination"
        layout="sizes,total,  prev, pager, next, jumper"
        background
        @current-change="handleChangePage"
        @size-change="handleSizeChange"
        :current-page.sync="pager.curPage"
        :page-size.sync="pager.pageSize"
        :total="pager.total"
      ></el-pagination>
    </div>
  </el-drawer>
</template>
<script>
export default {
  props: {
    visible: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      loading: false,

      wordList: [],
      checkedWordList: [],

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
      search: "",
      isDeleting: false,
    };
  },
  methods: {
    handleModify(row) {
      this.$emit("edit", row);
    },

    handleChangePage() {
      this.getTableData();
    },

    handleSizeChange() {
      this.pager.curPage = 1;
      this.getTableData();
    },

    handleSearch() {
      this.pager.curPage = 1;
      this.getTableData();
    },

    handleCreateWord() {
      this.$emit("createWord");
    },

    handleCheckBoxChange() {
      this.checkedWordList = this.wordList
        .filter((item) => item.checked)
        .map((item) => item.id);
    },

    handleDelete() {
      this.$confirm("确定要删除吗?", "提示")
        .then(() => {
          this.isDeleting = true;
          const payload = {
            ids: this.checkedWordList,
            project_id: this.$store.getters.appId,
          };
          this.$store
            .dispatch("hotWord/deleteWord", payload)
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
            .finally(() => {
              this.isDeleting = false;
            });
        })
        .catch(() => {
          //noop
        });
    },

    handleCancel() {
      this.checkedWordList = [];
      this.wordList.forEach((item) => {
        item.checked = false;
      });
    },

    async handleOpen() {
      this.getTableData();
    },

    handleClose() {
      this.$emit("close");
    },

    getTableData() {
      this.wordList = [];
      this.checkedWordList = [];
      this.loading = true;
      const payload = {
        search: this.search,
        curPage: this.pager.curPage,
        pageSize: this.pager.pageSize,
        project_id: this.$store.getters.appId,
      };

      this.$store
        .dispatch("hotWord/getWordList", payload)
        .then((data) => {
          this.wordList = data.results;
          this.pager.total = data.pager.total;
          this.loading = false;
        })
        .catch(() => {
          // noop
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
