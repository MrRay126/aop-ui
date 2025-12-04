<template>
  <div :class="statisticsContainerClass">
   <el-card
      :body-style="{ padding: '0px' }"
      class="statistics-card"
    >
      <div  class="statistics-content">
        <div class="statistics-label"><span>{{ name }}</span></div>
        <div class="statistics-value"><span>{{ value }}</span></div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: ""
    },
    value: {
      type: [Number, String],
      default: 0
    },
    statisticsClass: {
      type: String,
      default: ""
    }
  },
  computed: {
    // 计算属性可以用来处理一些复杂的逻辑
    statisticsContainerClass() {
      if (this.statisticsClass) {
        return `${this.statisticsClass}`;
      }
      return "statistics";
    }
  },
};
</script>
<style type="scss">
.statistics {
  width: 80px;
  height: 80px;
}
.statistics-card {
  height: 100%;
}
.statistics-content {
  padding: 16px 0;
}
.statistics-label {
  font-size: 16px;
  color: #606266;
  margin-bottom: 4px;
  text-align: center;
}
.statistics-value {
  font-size: 14px;
  font-weight: bold;
  color: #409eff;
  text-align: center;
}
</style>