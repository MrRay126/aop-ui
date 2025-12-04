<template>
  <div class="teleport">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    to: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.disabled) return;
    if (this.to) {
      const toEl = document.querySelector(this.to);
      if (toEl && [1, 9].includes(toEl.nodeType) && this.$el.childNodes[0]) {
        toEl.appendChild(this.$el.childNodes[0]);
      }
    }
  },
};
</script>
