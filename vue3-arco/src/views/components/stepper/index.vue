<template>
  <div class="stepper">
    <el-steps
      :active="activeStep"
      finish-status="success"
      :process-status="isErrorOccured ? 'error' : ''"
      align-center
    >
      <el-step :title="stepOneTitle" description="配置解析"></el-step>
      <el-step :title="stepTwoTitle" description="执行计算中"></el-step>
      <el-step :title="stepThirdTitle" description="返回结果"></el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  props: {
    stepNumber: {
      type: Number,
      default: 0,
    },
    isErrorOccured: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeStep: 0,
    };
  },
  computed: {
    //步骤1
    stepOneTitle() {
      if (this.activeStep === 0) {
        return "In process";
      }

      if (this.activeStep > 0) {
        return "Finished";
      }
      return "";
    },
    stepTwoTitle() {
      if (this.activeStep < 1) {
        return "Watting";
      } else if (this.activeStep === 1) {
        return "In progress";
      } else {
        return "Finished";
      }
    },
    stepThirdTitle() {
      if (this.activeStep === 2) {
        return "In Progress";
      } else if (this.activeStep < 2) {
        return "Watting";
      } else {
        return "Finished";
      }
    },
  },
  watch: {
    stepNumber: {
      immediate: true,
      handler(val) {
        this.activeStep = val;
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.stepper {
}
</style>
