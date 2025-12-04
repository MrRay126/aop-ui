<template>
  <el-popover v-model="visible" popper-class="settor-indicator">
    <template #reference>
      <el-button v-if="!plain" size="mini" plain :disabled="disabled">
        <span class="title-text">
          {{ title }}
        </span>
        <i
          :class="[
            visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
            'el-icon--right',
          ]"
        ></i>
      </el-button>
      <div v-else>
        <span class="plain-text">
          {{ title }}
        </span>
      </div>
    </template>
    <div class="list-container">
      <slot></slot>
    </div>
  </el-popover>
</template>

<script>
export default {
  // props: ["data"],
  props: {
    plain: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      visible: false,
    };
  },

  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.title-text {
  font-size: 14px;
  font-weight: normal;
  color: #67729d;
}

.plain-text {
  font-size: 12px;
  font-weight: normal;
  color: #67729d;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
