<template>
  <div class="filter-collector" v-loading="isLoading">
    <template v-if="list.length !== 0">
      <template v-for="(item, index) in list">
        <div class="list-item" :key="index">
          <div class="left-wrapper">
            <div class="index-number">{{ index + 1 }}</div>
            <el-tooltip
              :content="item.title"
              placement="top-start"
              effect="light"
            >
              <div class="title">{{ item.title }}</div>
            </el-tooltip>
          </div>
          <div class="operate-btns">
            <el-popover
              title="重命名"
              width="300"
              trigger="manual"
              v-model="item.isRenameVisible"
            >
              <template>
                <el-input
                  placeholder="请输入"
                  size="mini"
                  v-model="item.rename"
                ></el-input>
                <div class="btn-container">
                  <el-button size="mini" @click="cancelRename(item)"
                    >取消</el-button
                  >
                  <el-button
                    size="mini"
                    type="plain"
                    @click="handleRenameCommit(item)"
                    >确认</el-button
                  >
                </div>
              </template>
              <el-button
                slot="reference"
                size="mini"
                type="text"
                @click="showRenamePopover(item)"
                :disabled="item.isRemoving"
                :loading="item.isRenaming"
                >重命名</el-button
              >
            </el-popover>
            <el-popconfirm
              title="确认移除收藏吗?"
              trigger="manual"
              v-model="item.isRemoveVisible"
              @confirm="handleRemove(item)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="text"
                class="btn"
                :disabled="item.isRenaming"
                :loading="item.isRemoving"
                @click="showRemovePopover(item)"
                >移除</el-button
              >
            </el-popconfirm>
            <el-button
              size="mini"
              type="text"
              class="btn"
              @click="handleApply(item)"
              :disabled="item.isRenaming || item.isRemoving"
              >应用</el-button
            >
          </div>
        </div>
      </template>
    </template>
    <template v-else-if="!isLoading">
      <div class="no-data-text">暂无数据</div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    listData: {
      type: Array,
      default() {
        return [];
      },
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  watch: {
    listData: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.list = val.map((item) => {
            return {
              ...item,
              rename: item.title,
              isRenameVisible: false,
              isRemoveVisible: false,
              isRenaming: false,
              isRemoving: false,
              isApplying: false,
            };
          });
        }
      },
    },
  },
  methods: {
    handleRenameCommit(item) {
      if (!item.rename) {
        this.$message({
          message: "请输入名称!",
          type: "info",
        });
        return;
      }
      item.isRenameVisible = false;
      item.isRenaming = true;
      this.$emit("action", { name: "rename", data: item });
    },
    handleRemove(item) {
      this.$emit("action", { name: "remove", data: item });
      item.isRemoving = true;
    },
    handleApply(item) {
      this.$emit("action", { name: "apply", data: item });
      item.isApplying = true;
    },

    cancelRename(item) {
      item.isRenameVisible = false;
    },

    showRenamePopover(item) {
      this.list.forEach((item) => {
        item.isRenameVisible = false;
        item.isRemoveVisible = false;
      });
      item.rename = item.title;
      item.isRenameVisible = true;
    },
    showRemovePopover(item) {
      this.list.forEach((item) => {
        item.isRemoveVisible = false;
        item.isRenameVisible = false;
      });

      item.isRemoveVisible = true;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.btn-container {
  text-align: right;
  padding: 10px;
}

.filter-collector {
  //
  min-height: 100px;
  max-height: 290px;
  overflow-y: auto;
  width: 100%;

  .no-data-text {
    padding: 20px;
    text-align: center;
    font-size: 14px;
    color: $color-text;
  }

  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    font-size: 12px;
    color: $color-text;
    height: 30px;

    &:hover {
      .operate-btns {
        display: block;
      }
    }

    .operate-btns {
      // display: none;
      margin-left: 10px;
      flex-shrink: 0;

      .btn {
        margin-left: 10px;
      }
    }

    .left-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;

      .index-number {
        font-weight: bold;
        padding: 0px 5px;
        border-radius: 3px;
        background-color: #c4e6fd;
        margin-right: 5px;
      }

      .title {
        // width: 180px;
        overflow: hidden;
        white-space: pre;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
