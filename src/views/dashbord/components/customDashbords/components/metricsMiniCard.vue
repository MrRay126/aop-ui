<template>
  <div class="mini-card">
    <div class="mini-card__header">{{ name }}</div>
    <div class="mini-card__body">{{ displayValue }}</div>
    <div class="mini-card__footer">
      <div class="footer-item" :class="wowClass">
        <span class="label">周同比</span>
        <span class="value">
          <i class="triangle" :class="wowArrow"></i>
          {{ displayPercent(wow) }}
        </span>
      </div>
      <div class="footer-item" :class="dodClass">
        <span class="label">日环比</span>
        <span class="value">
          <i class="triangle" :class="dodArrow"></i>
          {{ displayPercent(dod) }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import numeral from "numeral";
export default {
  props: {
    name: { type: String, default: "" },
    value: { type: [Number, String], default: 0 },
    wow: { type: Number, default: 0 },
    dod: { type: Number, default: 0 },
  },
  computed: {
    displayValue() {
      const v = Number(this.value);
      if (isNaN(v)) return this.value;
      return numeral(v).format("0,0");
    },
    wowClass() {
      return this.wow > 0 ? "up" : this.wow < 0 ? "down" : "flat";
    },
    dodClass() {
      return this.dod > 0 ? "up" : this.dod < 0 ? "down" : "flat";
    },
    wowArrow() {
      return this.wow > 0 ? "up" : this.wow < 0 ? "down" : "flat";
    },
    dodArrow() {
      return this.dod > 0 ? "up" : this.dod < 0 ? "down" : "flat";
    },
  },
  methods: {
    displayPercent(n) {
      const val = Number(n) || 0;
      return `${Math.abs(val).toFixed(1)}%`;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.mini-card {
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
}
.mini-card__header {
  font-size: 11px;
  color: $color-light-text;
}
.mini-card__body {
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
  color: $color-text;
}
.mini-card__footer {
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
}
.footer-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.footer-item .label {
  font-size: 12px;
  color: $color-light-text;
}
.footer-item .value {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
.triangle {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}
.triangle.up {
  border-bottom: 7px solid #67c23a;
}
.triangle.down {
  border-top: 7px solid #f56c6c;
}
.triangle.flat {
  border-top: 7px solid #909399;
  border-bottom: 0;
}
.footer-item.up .value { color: #67c23a; }
.footer-item.down .value { color: #f56c6c; }
.footer-item.flat .value { color: #909399; }
</style>
