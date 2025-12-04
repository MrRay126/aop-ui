<template>
  <div class="btn" :style="{ color: color }">按钮-{{ index }}</div>
</template>
<script>
export default {
  data() {
    return { color: "red", index: 0 };
  },
};
</script>
<style lang="scss" scoped>
.btn {
  width: 100px;
  background: #ccc;
  padding: 5px 0;
}
</style>
