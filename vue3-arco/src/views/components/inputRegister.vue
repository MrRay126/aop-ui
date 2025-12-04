<template>
  <el-popover
    placement="bottom-start"
    title=""
    width="260"
    trigger="manual"
    v-model="popOverVisible"
  >
    <div
      slot="reference"
      class="input-register"
      :style="{ width: width + 'px' }"
      v-bind="$attrs"
      @click="componentFoucsToInput"
    >
      <slot name="bar" />
      <div v-if="!$slots.bar" class="text-tag-input">
        <span v-for="(text, index) in textItems" :key="index" class="text-item">
          <span class="text-item-text">{{ text }}</span>
          <!-- <template v-if="index !== textItems.length - 1"> -->
          <!-- <span class="dot">,</span> -->
          <!-- </template> -->

          <span class="close-icon-wrapper" @click.stop="removeTextItem(index)">
            <i class="el-icon-error close-icon"></i>
          </span>
        </span>
        <div class="input-container">
          <span class="input-label">{{ currentInputObj.text }}</span>
          <input
            ref="input"
            class="text-input"
            type="text"
            v-model="currentInputObj.text"
            @focus="$emit('action', { action: 'click' })"
            @blur="inputBlurHandler"
            @input="inputEventHandler"
            @keydown="handleKeyDown"
          />
        </div>
      </div>
      <div class="edit-icon-container" v-if="!disabled">
        <copy-popper
          :visible="itemsEditorVisible"
          :textItems="textItems"
          @cancel="cancelEditTextListHandler"
          @complete="completeEditTextListHandler"
        >
          <i class="el-icon-edit" @click.stop="editBtnClickHandler"></i>
        </copy-popper>
      </div>
    </div>
    <div class="input-list-container">
      <template v-for="(listItem, index) in inputList">
        <div
          v-if="listItem.text"
          :class="['input-list-item', { selected: listItem.checked }]"
          :key="index"
          @click="clickSelectOptionHandler(listItem, index)"
        >
          <span>{{ listItem.text }}</span>
          <i
            v-if="listItem.checked"
            class="el-icon-check check-icon"
            style="width: 20px"
          ></i>
        </div>
      </template>
    </div>
  </el-popover>
</template>
<script>
import copyPopper from "./copyPopper.vue";
export default {
  model: {
    prop: "values",
    event: "change",
  },
  props: {
    values: {
      type: Array,
      default() {
        return [];
      },
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    width: {
      type: Number,
      default: 200,
    },
  },
  components: {
    copyPopper,
  },
  watch: {
    values: {
      handler(data) {
        if (data.length === 0) {
          this.textItems = [];
          this.inputList = [];
        } else {
          this.textItems = data;
          this.inputList = this.textItems
            .map((txt) => {
              return {
                checked: true,
                text: txt,
              };
            })
            .reverse();
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      textItems: [],
      inputText: "",
      popOverVisible: false,
      itemsEditorVisible: false,
      isFocusTextArea: false,
      inputList: [
        //   {
        //     text: "输入的变量",
        //     checked: true,
        //   },
        //   {
        //     text: "输入的变量2",
        //     checked: true,
        //   },
      ],
      currentInputObj: {
        text: "",
        checked: false,
        type: "input", //标记输入的变量
      },
    };
  },
  methods: {
    editBtnClickHandler() {
      this.itemsEditorVisible = !this.itemsEditorVisible;
    },
    completeEditTextListHandler(data) {
      this.inputList = data;
      this.getTextItems();
      this.$emit("complete", this.textItems);
    },
    cancelEditTextListHandler() {
      this.itemsEditorVisible = false;
    },

    removeTextItem(index) {
      this.inputList.splice(length - index - 1, 1);
      this.getTextItems();
      this.$emit("complete", this.textItems);
    },

    componentFoucsToInput() {
      if (this.disabled) return;

      this.itemsEditorVisible = false;
      clearTimeout(this.inputBlurWaitting);
      this.setPopoverVisible();

      if (
        !this.inputList[0] ||
        (this.inputList[0] && this.inputList[0].type !== "input")
      ) {
        this.inputList.unshift(this.currentInputObj);
      }

      this.$refs["input"].focus();
    },

    inputBlurHandler() {
      this.inputBlurWaitting = setTimeout(() => {
        this.inputCompleteHandler();
        setTimeout(() => {
          this.popOverVisible = false;
        }, 100);
      }, 200);
    },
    setPopoverVisible() {
      if (this.inputList.length === 1) {
        this.popOverVisible = this.inputList[0].text !== "";
      } else if (this.inputList.length > 1) {
        this.popOverVisible = true;
      } else {
        this.popOverVisible = false;
      }
    },

    inputEventHandler() {
      const originInputList = JSON.parse(JSON.stringify(this.inputList)).splice(
        1
      );
      const hasInputStr = originInputList.some((listItem) => {
        return listItem.text === this.currentInputObj.text;
      });

      if (hasInputStr) {
        if (this.inputList[0] && this.inputList[0].type === "input") {
          this.inputList.shift();
        }
      } else {
        if (
          !this.inputList[0] ||
          (this.inputList[0] && this.inputList[0].type !== "input")
        ) {
          this.inputList.unshift(this.currentInputObj);
        }
      }
      this.setPopoverVisible();
    },
    handleKeyDown(event) {
      const isEnterKey = event.keyCode === 13;
      const isBackSpace = event.keyCode === 8;
      if (isEnterKey) {
        this.inputCompleteHandler();
      }
      if (isBackSpace) {
        if (!this.currentInputObj.text) {
          if (this.inputList[0] && this.inputList[0].type === "input") {
            this.inputList.splice(0, 2);
          } else {
            this.inputList.splice(0, 1);
          }
          this.inputCompleteHandler();
        }
      }
      this.setPopoverVisible();
    },
    inputCompleteHandler() {
      let currentIndex = 0;
      let originInputList = JSON.parse(JSON.stringify(this.inputList));

      //去除输入显示list项
      if (originInputList.length > 0 && originInputList[0].type === "input") {
        originInputList = originInputList.splice(1);
      }

      const hasInputStr = originInputList.some((listItem) => {
        return listItem.text === this.currentInputObj.text;
      });
      if (hasInputStr) {
        this.resetcurrentInputObj();
      }

      if (this.currentInputObj.text) {
        const newSelectOption = JSON.parse(
          JSON.stringify(this.currentInputObj)
        );
        newSelectOption.checked = true;
        delete newSelectOption.type;
        this.inputList.unshift(newSelectOption);
        currentIndex = 1;
      }
      if (
        this.inputList[currentIndex] &&
        this.inputList[currentIndex].type === "input"
      ) {
        this.inputList.splice(currentIndex, 1);
        this.resetcurrentInputObj();
      }
      this.getTextItems();
      this.$emit("complete", this.textItems);
    },
    resetcurrentInputObj() {
      this.currentInputObj.text = "";
      this.currentInputObj.checked = false;
    },
    clickSelectOptionHandler(listItem, index) {
      if (listItem.checked) {
        this.inputList.splice(index, 1);
        this.getTextItems();
      } else {
        this.inputCompleteHandler();
      }
      this.componentFoucsToInput();
    },
    getTextItems() {
      this.textItems = this.inputList
        .filter((item) => {
          return item.type !== "input";
        })
        .map((item) => {
          return item.text;
        })
        .reverse();
      this.$emit("change", this.textItems);
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.input-list-container {
  .input-list-item {
    margin-top: 3px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    &.selected {
      background: #e4f0ff;

      .check-icon {
        flex-shrink: 0;
        color: #3d90ff;
      }
    }
  }

  .input-list-item:first-child {
    margin-top: 0;
  }
}

.input-container {
  position: relative;
  font-size: 12px;
  height: 26px;
  max-width: 100%;
  overflow: hidden;
}

.input-label {
  letter-spacing: 2px;
  opacity: 0;
  min-width: 10px;
  padding: 1px 2px;
}

.text-input {
  width: 100%;
  min-width: 10px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  outline: none;
  border: none;
  background: transparent;
}

.input-register {
  font-size: 12px;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #dcdfe6;
  min-width: 150px;
  border-radius: 5px;

  &:hover {
    background: #fff;
    border: 1px solid #3d90ff;

    .el-icon-edit {
      display: inline-block;
    }
  }
}

.el-icon-edit {
  // display: none;
  display: inline-block;

  &:hover {
    color: #3d90ff;
  }
}

.edit-icon-container {
  padding: 0 5px;
  cursor: pointer;
}

.text-tag-input {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: calc(100% - 30px);
}

.text-item {
  position: relative;
  display: inline-block;
  padding: 2px 3px;
  line-height: 16px;
  background: #f0f2f5;
  border-radius: 5px;
  margin-right: 3px;
  margin: 4px;
  cursor: pointer;
  max-width: calc(100% - 10px);
  padding-right: 20px;
  .text-item-text {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    .close-icon {
      // display: block !important;
    }

    .dot {
      visibility: hidden;
    }
  }

  .close-icon-wrapper {
    font-size: 14px;
    position: absolute;
    right: 2px;
    top: 4px;
    z-index: 9;

    .close-icon {
      // display: none;
      color: rgb(157, 157, 157);

      &:hover {
        color: rgb(111, 111, 111);
      }
    }
  }
}
</style>
