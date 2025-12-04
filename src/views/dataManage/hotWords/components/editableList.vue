<template>
  <div class="editable-list">
    <template v-for="(item, index) in list">
      <div
        class="list-item"
        :key="index"
        @click="handleClick(item, `input_${index}`)"
      >
        <template v-if="item.focused">
          <input
            :ref="`input_${index}`"
            class="input-item"
            type="text"
            spellcheck="false"
            :maxlength="maxNameLength"
            @blur="handleInputBlur(item)"
            v-model="item.value"
          />
        </template>

        <template v-else>
          <span class="content-value">{{ item.value }}</span>
          <span class="close-icon" @click.stop="removeItem(index)">x</span>
        </template>
        <span class="expand-span">{{ item.value }}</span>
      </div>
    </template>
    <div class="btns-container">
      <template v-if="useMultiple">
        <copy-popper
          :visible="multipleVisible"
          :textItems="multipleData"
          @complete="handleMutipleCommit"
          @cancel="handleMutipleAddCancel"
        >
          <div class="add-btn" @click="handleMultipleAddBtnClick">
            + <span class="btn-text">{{ multipleBtnTitle }}</span>
          </div>
        </copy-popper>
      </template>
      <div class="add-btn" @click="handleAddItem">
        + <span class="btn-text">{{ btnTitle }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import copyPopper from "@/views/components/copyPopper.vue";
export default {
  components: {
    copyPopper,
  },
  props: {
    // list data values
    listData: {
      type: Array,
      default() {
        return [
          // { value: "value" }
        ];
      },
    },

    // them maxSize of listData Array , 为false时为不限制长度
    maxSize: {
      type: [Number, Boolean],
      default: 20,
    },

    // the max length of the value of listitem
    maxNameLength: {
      type: Number,
      default: 20,
    },

    useMultiple: {
      type: Boolean,
      default: false,
    },

    multipleBtnTitle: {
      type: String,
      default: "批量添加",
    },

    btnTitle: {
      type: String,
      default: "新别名",
    },
  },
  data() {
    return {
      list: [],

      multipleData: [],
      multipleVisible: false,
    };
  },
  watch: {
    listData: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.list = val;
        }
      },
    },
  },
  methods: {
    handleMultipleAddBtnClick() {
      this.multipleVisible = true;
    },

    handleMutipleCommit(data) {
      const values = data.map((item) => {
        return {
          value: item.text,
          focused: false,
        };
      });

      this.addMutipleDataToList(values);
    },

    handleMutipleAddCancel() {
      this.multipleVisible = false;
    },

    handleAddItem() {
      if (this.maxSize && this.list.length === this.maxSize) {
        this.$message({
          message: "添加数量已抵达上限" + this.maxSize + "个",
          type: "warning",
        });
        return;
      }
      this.list.push({ value: "", focused: true });
      this.$emit("change", this.list);

      this.$nextTick(() => {
        this.$refs[`input_${this.list.length - 1}`][0]?.focus();
      });
    },

    //将copypoper输出的值添加到列表中
    addMutipleDataToList(multiData) {
      const listLen = this.list.length;

      for (let i = 0, len = multiData.length; i < len; i++) {
        if (this.maxSize && this.list.length === this.maxSize) {
          this.$message({
            message: "添加数量已抵达上限" + this.maxSize + "个",
            type: "warning",
          });
          return;
        } else {
          const item = multiData[i];

          const isExisted = this.listData.some((listItem) => {
            return listItem.value === item.value;
          });

          if (isExisted) {
            this.$message({
              message: "已经存在的词:" + item.value,
              type: "info",
            });
          } else {
            this.list.push(item);
          }
        }
      }
      // 如果有新增值则触发change事件
      if (listLen !== this.list.length) {
        const payload = this.getOutputData();
        this.$emit("change", payload);
      }
    },

    removeItem(index) {
      this.list.splice(index, 1);
      this.$emit("change", this.list);
    },

    handleClick(item, refName) {
      this.$set(item, "focused", true);
      this.$nextTick(() => {
        this.$refs[refName][0]?.focus();
      });
    },

    handleInputBlur(item) {
      item.focused = false;
      const payload = this.getOutputData();
      this.$emit("change", payload);
    },

    getOutputData() {
      const payload = this.list.map((item) => {
        return { value: item.value };
      });
      return payload;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.editable-list {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  vertical-align: middle;

  .btns-container {
    display: inline-block;
    line-height: 1;
  }

  .content-value {
    line-height: 20px;
    padding-left: 5px;
    position: absolute;
    left: 0;
  }

  .add-btn {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    border: 1px solid $color-border;
    line-height: 1;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    color: $color-desc;
    font-size: 12px;
    margin-bottom: 5px;

    &:hover {
      border-color: $color-disabled;
    }
  }

  .list-item {
    position: relative;
    display: inline-block;
    background: $background-color;
    border-radius: 3px;
    line-height: 1;
    color: $color-text;
    font-size: 12px;
    border: 1px solid $color-border;
    margin-left: 5px;
    margin-bottom: 5px;

    .expand-span {
      display: inline-block;
      min-width: 50px;
      height: 12px;
      letter-spacing: 5px;
      height: 20px;
      opacity: 0;
    }

    .input-item {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      z-index: 1;
      border: none;
      outline: none;
    }

    .close-icon {
      position: absolute;
      right: 5px;
      top: 49%;

      margin-left: 3px;
      line-height: 0;
      cursor: pointer;
      color: #c2c1c1;
      z-index: 1;

      &:hover {
        color: $color-primary;
      }
    }
  }
}
</style>
