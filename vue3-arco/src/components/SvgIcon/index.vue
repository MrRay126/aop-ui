<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
  />
  <svg
    v-else
    :class="[svgClass, { 'is-disabled': disabled }]"
    aria-hidden="true"
    :style="{ width: size + 'px', height: size + 'px' }"
    @click="handleClick"
  >
    <use :href="iconName" />
  </svg>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "20",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass);
    },
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${this.iconClass}) no-repeat 50% 50%`,
      };
    },
  },
  methods: {
    handleClick() {
      if (this.disabled) return;
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  overflow: hidden;
  outline: none;
  &.is-disabled {
    cursor: not-allowed;
    color: #c0c4cc !important;
  }
  &:hover {
    color: #409eff;
  }
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
