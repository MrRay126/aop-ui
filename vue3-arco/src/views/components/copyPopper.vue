<template>
  <el-popover
    placement="right"
    title=""
    width="260"
    trigger="manual"
    v-model="itemsEditorVisible"
    popper-class="sql-search-edit-text-pop"
    @show="showPopperHandler"
  >
    <span slot="reference">
      <slot></slot>
    </span>
    <div class="text-items-editor" @click.stop="">
      <div class="title-des-container">
        <span class="title">批量添加</span>
        <span class="desc-text">使用回车换行分隔</span>
      </div>
      <div class="editor-container">
        <textarea
          v-model="textStr"
          spellcheck="false"
          :class="{ focus: isFocusTextArea }"
          @focus="isFocusTextArea = true"
          @blur="isFocusTextArea = false"
        ></textarea>
      </div>
      <div class="button-container">
        <el-button type="text" size="mini" @click="copyAll">全选复制</el-button>
        <span>
          <el-button type="text" size="mini" @click="cancel">取消</el-button>
          <el-button size="mini" @click="complete">完成</el-button>
        </span>
      </div>
    </div>
  </el-popover>
</template>
<script>
/**
 * @event complete :完成事件 params: String[]
 * @event cancel :取消事件   params: 无
 */
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    textItems: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      itemsEditorVisible: false,
      isFocusTextArea: false,
      textStr: "",
    };
  },
  watch: {
    visible(value) {
      this.itemsEditorVisible = value;
    },
    textItems: {
      handler(val) {
        this.calcTextStr(val);
      },
      immediate: true,
    },
  },
  methods: {
    showPopperHandler() {
      this.calcTextStr(this.textItems);
    },
    calcTextStr(val) {
      this.textStr = val.join("\n");
    },
    copyAll() {
      if (this.textStr) {
        //复制到剪贴板
        this.$copyText(this.textStr).then(() => {
          this.$message({
            message: "复制成功！",
            type: "success",
            duration: 3000,
          });
        });
      } else {
        this.$message({
          type: "error",
          duration: 3000,
          message: "条件为空，请输入条件后复制",
        });
      }
    },
    cancel() {
      //
      this.$emit("cancel");
    },
    complete() {
      //
      let data = this.textStr.split("\n").filter((item) => item);

      data = Array.from(new Set(data)) //去重
        .map((strItem) => {
          return {
            text: strItem,
            checked: true,
          };
        })
        .reverse();

      this.$emit("complete", data);
      this.$emit("cancel");
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.text-items-editor {
  .title-des-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-weight: normal;
      color: #374253;
    }
    .desc-text {
      font-size: 12px;
      color: #8d9eb9;
    }
  }
  .editor-container {
    margin-top: 10px;
    height: 200px;

    textarea {
      height: 100%;
      width: 100%;
      padding: 0 8px;
      color: #42546d;
      font-size: 14px;
      line-height: 24px;
      background-color: transparent;
      border: 1px solid #f0f0f0;
      border-radius: 2px;
      resize: none;
      outline: none;
      &:hover {
        border: 1px solid #409eff;
      }
      &.focus {
        border: 1px solid #409eff;
      }
    }
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
