<template>
  <div class="main-section-wrapper">
    <div class="main-section">
      <div class="left">
        <slot name="left"></slot>
      </div>
      <div class="right">
        <slot name="right">
          <el-empty
            style="padding-top: 200px"
            description="暂无数据"
          ></el-empty>
        </slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-section-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 20px;

  .main-section {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .left {
      height: 100%;
      overflow: auto;
      flex: 0 0 auto;
      // background: #fff;
    }
    .right {
      flex: 1;
      height: 100%;
      overflow: auto;
      margin-left: 15px;
      margin: 15px;
      // background: #fff;
    }
  }
}
</style>
