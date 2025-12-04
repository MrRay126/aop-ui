<template>
  <div class="main" v-loading="$store.state.app.loading">
    <div class="top">
      <top></top>
    </div>
    <div class="bottom">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import top from "@/views/components/layout/top.vue";

export default {
  components: {
    top,
  },
  mounted() {
    // this.$message({
    //   message: "11",
    // });
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  min-width: 1200px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .top {
    width: 100%;
    flex: 0;
    height: 62px;
  }
  .bottom {
    width: 100%;
    flex: 1;
    height: calc(100% - 62px);
  }
}
</style>
