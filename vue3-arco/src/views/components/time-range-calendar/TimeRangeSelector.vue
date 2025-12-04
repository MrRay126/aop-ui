<template>
  <el-popover
    popper-class="timerange-popper"
    placement="bottom-start"
    :disabled="disabled"
    v-model="isShowCalendar"
  >
    <template v-slot:reference>
      <el-button
        :class="[
          'title',
          { 'is-text': isTextTypeReference, 'is-disabled': disabled },
        ]"
        plain
        :type="isTextTypeReference ? 'text' : ''"
        size="mini"
        :disabled="disabled"
      >
        <div
          :class="[
            'timerange__picker',
            { 'picker-color': !disabled },
            { 'is-text-type': isTextTypeReference },
          ]"
        >
          <slot
            :labelValue="selectValueLabel"
            :checkCompare="isShowCompareIcon"
          >
            <span class="timerange__picker-dateicon">
              <svg-icon icon-class="calendar"></svg-icon>
            </span>
            <span class="timerange__picker-label">
              {{ selectValueLabel }}
            </span>
          </slot>

          <div class="timerange__picker-dateunit" v-if="isShowCompareIcon">
            <slot name="compare_icon">
              <svg-icon
                icon-class="calendar-a-b"
                :style="{
                  width: isTextTypeReference ? '13px' : '20px',
                  height: isTextTypeReference ? '13px' : '20px',
                }"
              ></svg-icon>
            </slot>
          </div>
        </div>
      </el-button>
    </template>

    <calendar-panel
      :hasRecentHourAction="hasRecentHourAction"
      :hasHourTime="hasHourTime"
      :calendarPanelData="panelData"
      :isPanelShow="isShowCalendar"
      :hasCompareAction="hasCompareAction"
      :isAutoTriggerApplyTimeEvent="isAutoTriggerApplyTimeEvent"
      :timeZone="timeZone"
      @cancel="cancel"
      @apply="apply"
      @hide="hideCalendar"
      @dataChange="resetTimeLabel"
      :isShowDynamicTab="isShowDynamicTab"
      :isShowStaticTab="isShowStaticTab"
    ></calendar-panel>

    <!--  @compareStateChange="compareStateHandler" -->
  </el-popover>
</template>

<script>
import CalendarPanel from "./CalendarPanel";
import { timeLocalDataToApi, timeApiDataToLocal } from "./adapter";

export default {
  name: "TimeRangeSelector",
  components: {
    CalendarPanel,
  },
  props: {
    hasRecentHourAction: {
      type: Boolean,
      default: false,
    },
    isAutoTriggerApplyTimeEvent: {
      type: Boolean,
      default: true,
    },

    isShowStaticTab: {
      type: Boolean,
      default: true,
    },
    isShowDynamicTab: {
      type: Boolean,
      default: true,
    },
    calendarPanelData: {
      type: Object,
      default() {
        return {};
      },
    },
    //是否拥有对比功能模块
    hasCompareAction: {
      type: Boolean,
      default: false,
    },
    hasHourTime: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    //文本类型的触发弹窗
    isTextTypeReference: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShowCalendar: false,
      tim: 0,
      selectValueLabel: "",
      isShowCompareIcon: false,
      panelData: null,
      //时区
      timeZone: "Etc/GMT-8",
    };
  },

  watch: {
    calendarPanelData: {
      handler(panelData) {
        //如果没有时间对比功能则不使用contrast数据 避免日历显示对比时间
        if (!this.hasCompareAction) {
          panelData.checked = false;
        }
        //获取timezone属性
        this.timeZone = panelData.timezone;

        const localData = timeApiDataToLocal(panelData, {
          hasCompareAction: this.hasCompareAction,
        });
        // console.log(localData, panelData);
        this.panelData = localData;
        this.isShowCompareIcon = localData.isCompareDateOpened;
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    hideCalendar(data) {
      this.isShowCalendar = false;
      this.setCompareIconView(data);
    },
    cancel(data) {
      this.setCompareIconView(data);
      this.hideCalendar(data);
      this.$emit("cancel");
    },
    apply(data) {
      this.setCompareIconView(data);
      this.resetTimeLabel(data);
      this.$emit("apply", timeLocalDataToApi(data));
    },
    resetTimeLabel(data) {
      // console.log(" data.timeLabel::", data.timeLabel);
      this.selectValueLabel = data.timeLabel;
    },
    setCompareIconView(data) {
      if (typeof data !== "undefined") {
        this.isShowCompareIcon =
          Array.isArray(data.compareTimeRange) &&
          data.compareTimeRange.length > 0;
      }
    },
  },
  mounted() {
    this._close = (e) => {
      // 如果点击发生在当前组件内部，则不处理
      if (this.$el.contains(e.target)) {
        return;
      }
      this.hideCalendar();
    };

    window.addEventListener("click", this._close);
  },
  beforeUnmount() {
    window.removeEventListener("click", this._close);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/styles/index.scss";
// .content-wrapper {
// display: inline-block;
// overflow: auto;
// vertical-align: top;

// }

.title {
  padding-top: 0;
  padding-bottom: 0;
  font-size: 16px;
  font-weight: normal;

  &.is-text {
    color: #42546d;
    font-size: 12px;
    border: none;

    &:focus {
      border-color: transparent;
      color: #42546d;
    }

    &:hover {
      border-color: transparent;
      color: #42546d;
    }
  }

  // &.is-disabled {
  //   // :hover {
  //   //   color: #c0c4cc;
  //   //   cursor: not-allowed;
  //   // }
  // }

  .is-text-type {
    font-size: 12px;
    height: auto;
  }
}

.content-wrapper {
  display: inline-block;
  overflow: auto;
  vertical-align: top;
}

.timerange {
  .date-icon {
    font-size: 16px;
  }

  &__picker {
    display: flex;
    align-items: center;
    height: 28px;
    font-size: 14px;
    white-space: nowrap;
    background-color: #fff;

    &.picker-color {
      color: $color-text;
    }

    &-dateicon {
      display: inline-block;
      vertical-align: middle;
      padding-right: 4px;
      margin-left: -2px;
    }

    &-dateunit {
      display: inline-block;
      vertical-align: middle;
      // color: #67729d;
    }

    &-label {
      line-height: 28px;
      vertical-align: middle;
    }
  }
}
</style>
