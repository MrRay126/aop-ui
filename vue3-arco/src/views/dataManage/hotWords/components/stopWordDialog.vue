<template>
  <el-dialog
    :visible="isShow"
    width="600px"
    class="stop-word-dialog"
    @open="handleOpen"
    @close="handleClose"
  >
    <template slot="title">
      <div class="title-container">
        <span>
          <span>停用词字典</span>
          <el-tooltip
            content="不参与词云/词频统计的词语"
            effect="light"
            placement="top-start"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </span>
        <el-input
          class="search-input"
          size="mini"
          placeholder="搜索停用词"
          :clearable="true"
          :disabled="loading"
          v-model="search"
          @input="handleSearch"
        >
          <template slot="append">
            <i class="el-icon-search" @click="handleSearch"></i>
          </template>
        </el-input>
      </div>
    </template>
    <div v-loading="loading">
      <div class="content">
        <el-form>
          <el-form-item label="停用词列表:" label-width="">
            <template v-if="search">
              <div class="list-display-container">
                <template v-for="(item, index) in filterListData">
                  <div class="display-item" :key="index">
                    <span class="display-content">{{ item.value }}</span>
                    <span
                      class="close-btn"
                      @click="handleRemove(item.value, index)"
                      >x</span
                    >
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <div class="edit-list-container">
                <editable-list
                  btnTitle="停用词"
                  :visible="visible"
                  :useMultiple="true"
                  :listData="listData"
                  :maxSize="false"
                  @change="handleAddListData"
                ></editable-list>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </div>

      <div class="btn-container">
        <el-button
          size="mini"
          type="primary"
          :loading="saving"
          @click="handleCommit"
          >确定</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
import editableList from "./editableList.vue";
export default {
  components: {
    editableList,
  },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
      search: "",
      listData: [],
      filterListData: [],
      isShow: false,
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isShow = val;
      },
    },
  },
  methods: {
    handleCommit() {
      this.saveStopUseWord();
    },
    handleSearch() {
      // clearTimeout(this.timer);
      // this.timer = setTimeout(() => {
      this.filterListData = this.listData.filter((item) => {
        return item.value.includes(this.search);
      });
      // }, 300);
    },

    handleAddListData(data) {
      this.listData = data;
      this.handleSearch();
    },

    handleRemove(data, index) {
      const itemIndex = this.listData.findIndex((item) => {
        return item.value === data;
      });

      if (itemIndex !== -1) {
        // 编辑器列表
        this.listData.splice(itemIndex, 1);
        // 显示列表
        this.filterListData.splice(index, 1);
      }
    },

    saveStopUseWord() {
      const payload = {
        project_id: this.$store.getters.appId,
        data: this.listData,
      };
      this.saving = true;
      this.$store
        .dispatch("hotWord/saveStopWordList", payload)
        .then(() => {
          // noop
          this.handleClose();
          this.$message({
            message: "保存成功!",
            type: "success",
          });
        })
        .catch(() => {
          /// noop
        })
        .finally(() => {
          this.saving = false;
        });
    },

    getStopUseWordList() {
      // api get
      this.loading = true;
      const payload = {
        project_id: this.$store.getters.appId,
      };
      this.$store
        .dispatch("hotWord/getStopWordList", payload)
        .then((data) => {
          this.listData = data;
        })
        .catch(() => {
          /// noop
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleOpen() {
      this.search = "";
      this.getStopUseWordList();
    },
    handleClose() {
      this.$emit("close");
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.stop-word-dialog {
  .title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-input {
      width: 200px;
      margin-right: 100px;
    }

    .el-icon-question {
      font-size: 14px;
      margin-left: 3px;
      cursor: pointer;
    }
  }

  .btn-container {
    display: inline-block;
    width: 100%;
    margin-top: 20px;
    text-align: center;
  }

  .content {
    .list-display-container {
      display: inline-block;
      max-height: 450px;
      min-height: 200px;
      overflow-y: auto;

      .display-item {
        padding: 0 8px;
        background-color: $background-color;
        display: inline-block;
        border-radius: 5px;

        line-height: 1;
        font-size: 12px;
        border: 1px solid $color-border;
        margin: 3px;

        .display-content {
          vertical-align: middle;
          line-height: 20px;
        }

        .close-btn {
          display: inline-block;
          // vertical-align: -1px;
          margin-left: 5px;
          vertical-align: middle;
          cursor: pointer;
          color: $color-disabled;

          &:hover {
            color: $color-primary;
            color: $color-text;
          }
        }
      }
    }

    .edit-list-container {
      display: inline-block;
      max-width: 450px;
      max-height: 450px;
      min-height: 200px;
      overflow-y: auto;
    }
  }
}
</style>
