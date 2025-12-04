<template>
  <div ref="overflowTip">
    <el-tooltip :disabled="disabled" placement="top-start" v-bind="$attrs">
      <div class="overflow-tip" :class="{ ellipse: !disabled }">
        <slot>
          {{ content }}
        </slot>
      </div>
      <span slot="content">
        <slot name="content">
          {{ content }}
        </slot>
      </span>
    </el-tooltip>
  </div>
</template>

<script>
// tooltip 位置定位的很远不在column内部的问题解决:使用overflow显示...后的小范围的元素定位tooltip,实现步骤如下:
// 1 放开 "overflow显示..." 判断是不是内容超出
// 2 内容超出后 设置overflow显示... ,根据是否超出设置disabled
export default {
  props: {
    content: {
      type: String,
      default: "",
    },
    placement: {
      type: String,
      default: "top-start",
    },
  },
  watch: {
    content: {
      immediate: false,
      handler() {
        this.visible = false;
        this.$nextTick(() => {
          this.init();
          this.visible = true;
        });
      },
    },
  },
  data() {
    return {
      disabled: true,
      visible: true,
    };
  },
  methods: {
    init() {
      const el = this.$refs["overflowTip"];
      if (el) {
        const offsetW = el.offsetWidth;
        const scrollWidth = el.scrollWidth;
        this.disabled = offsetW >= scrollWidth;
      }
    },

    resizeEvent() {
      clearTimeout(this.timeO);
      this.timeO = setTimeout(() => {
        // 放开内容,再次计算
        this.disabled = true;
        this.$nextTick(() => {
          this.init();
        });
      }, 300);
    },
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.resizeEvent.bind(this));
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeEvent);
  },
};
</script>

<style lang="scss" scoped>
.overflow-tip {
  display: inline-block;

  white-space: nowrap;

  width: 100%;
}

.ellipse {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
