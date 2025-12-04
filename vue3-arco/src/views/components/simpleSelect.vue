<template>
  <div class="simple-select">
    <el-dropdown @command="handleSelect" trigger="click">
      <span class="filter-icon">
        <svg-icon icon-class="filter-fill" :size="iconSize"></svg-icon>
        <span class="filter-label">{{ viewLabel }}</span>
      </span>

      <el-dropdown-menu>
        <template v-for="(item, index) in options">
          <el-dropdown-item :command="item" :key="index">
            <span
              :style="{
                color: item.value === value ? focusOptionColor : '',
              }"
              >{{ item.label }}</span
            >
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  model: {
    event: "change",
    prop: "value",
  },
  props: {
    // 当前选中的option选项的颜色
    focusOptionColor: {
      type: String,
      default: "#66b1ff",
    },

    // 使用的icon图标
    icon: {
      type: String,
      default: "",
    },

    iconSize: {
      type: String,
      default: "14",
    },

    options: {
      type: Array,
      default() {
        return []; //[{label:'',value:''}]
      },
    },

    value: [String, Number],
  },
  data() {
    return {
      viewLabel: "",
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          if (!this.viewLabel) {
            this.handleInitShowLabel();
          }
        }
      },
    },

    options: {
      immediate: true,
      handler(val) {
        if (val) {
          if (!this.viewLabel) {
            this.handleInitShowLabel();
          }
        }
      },
    },
  },

  methods: {
    handleSelect(item) {
      this.viewLabel = item.label;
      this.$emit("change", item.value);
    },
    // 初始化回显
    handleInitShowLabel() {
      if (this.options.length > 0 && this.value) {
        const curOption = this.options.find((item) => {
          return item.value === this.value;
        });
        if (curOption) {
          this.viewLabel = curOption.label;
        }
      }
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.simple-select {
  .svg-icon {
    vertical-align: middle;
  }

  .filter-label {
    vertical-align: middle;
    cursor: pointer;
    margin-left: 3px;
  }
}
</style>
