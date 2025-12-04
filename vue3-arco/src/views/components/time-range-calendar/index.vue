<template>
  <div class="time-range-wrapper">
    <time-range-selector
      :hasRecentHourAction="hasRecentHourAction"
      :hasHourTime="hasHourTime"
      :hasCompareAction="hasCompareAction"
      :calendarPanelData="timeData"
      :disabled="disabled"
      :isShowStaticTab="isShowStaticTab"
      :isShowDynamicTab="isShowDynamicTab"
      :isAutoTriggerApplyTimeEvent="isAutoTriggerApplyTimeEvent"
      :isTextTypeReference="isTextTypeReference"
      :timeZone="timeZone"
      @apply="handleApplySelectTime"
      @cancel="handleCancelSelectTime"
    >
      <template v-slot="data">
        <slot name="calendar" :data="data"></slot>
      </template>
      <template v-slot:compare_icon="data">
        <slot name="compare_icon" :data="data"></slot>
      </template>
    </time-range-selector>

    <template v-if="unitComponent === 'timeUnitSelector'">
      <span class="unit-wraper">
        <time-unit-selector
          @change="handleTimeUnitChange"
          v-model="unitValue"
          :disabled="disabled"
        >
          <template v-slot="data">
            <slot name="timeUnit" :data="data"></slot>
          </template>
        </time-unit-selector>
      </span>
    </template>
    <template v-if="unitComponent === 'unitSelector'">
      <span class="unit-wraper">
        <unit-selector
          @change="handleUnitChange"
          v-model="unitValue"
          :disabled="disabled || hasExtendTime"
          :listerData="unitOptions"
        >
          <template v-slot="data">
            <slot name="unit" :data="data"></slot>
          </template>
        </unit-selector>
      </span>
    </template>
  </div>
</template>

<script>
/**
   * timeData 参数
 time: {
  type: "absolute", // absolute|relative 绝对时间|相对时间
  start: "2021/8/1 0:0:0",   //开始时间字符串
  end: "2021/8/30 23:59:59", //结束时间字符串
  recent_day:"1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 如:2-7 | StartToNow （绝对时间自某日至今）
  unit: "day", // 时间粒度单位
  unit_value:7, // 带有数值的'时间粒度组件'会输出这个值
  week_day: 0, // 标识是周几（只有在选择时间单位为‘周’的时候存在），数值范围0-6，对应周一至周日
  checked: false, // 是否选择日期对比
  from_some_day_to_now: false,//表示是否是自某日至今 ,前端回显按钮用,后端或可用
  from_some_day_to_yestoday: false, //新增前端回显用
  compare_from_some_day_to_now: false,
  compare_from_some_day_to_yestoday: false,

  contrast: {
    type: "stage", // stage上一阶段|custom自定义
    start: "2021/8/1 0:0:0",   //开始时间字符串
    end: "2021/8/30 23:59:59", //结束时间字符串
    compare_recent_day:"1-1", //配置日期组件回显  值同recent_day,额外输出的上一阶段属性,对应rencent_day属性输出，如：上上周 W2，只有常规时间 recent_day 为W1时存在。 其他同理，同周期对比： 上上周 W2 | 上上月 M2 
   
  },
},
 * **/
import TimeUnitSelector from "./TimeUnitSelector.vue";

import TimeRangeSelector from "./TimeRangeSelector.vue";
import UnitSelector from "./UnitSelector.vue";

export default {
  props: {
    isAutoTriggerApplyTimeEvent: {
      type: Boolean,
      default: true, // true(载入即触发一次)  false(首次载入不触发,手动触发)
    },

    isShowStaticTab: {
      type: Boolean,
      default: true,
    },

    isShowDynamicTab: {
      type: Boolean,
      default: true,
    },

    //配置组件使用的回显数据
    timeData: {
      type: Object,
      default() {
        return {};
      },
    },

    //指定日历面板是否启用时间对比选项
    hasCompareAction: {
      type: Boolean,
      default: false,
    },

    /**
     *
     * 指定使用的时间单位组件 默认不使用任何组件 可选组件如下：
     * "UnitSelector" 时间单位组件（天 时 分 秒 周 ...）
     * "TimeUnitSelector" 数值时间单位组件 （当天、7天 ，当周 4周、8周，...）
     */
    unitComponent: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },

    hasExtendTime: {
      type: Boolean,
      default: false,
    },

    unitOptions: {
      type: Array,
      default() {
        return;
      },
    },
    //是否展示文本类型,去除按钮方框
    isTextTypeReference: {
      type: Boolean,
      default: false,
    },

    hasRecentHourAction: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TimeRangeSelector,
    UnitSelector,
    TimeUnitSelector,
  },

  data() {
    return {
      hasHourTime: false,
      timeZone: "Etc/GMT-8", //东八区Etc/GMT-8 //西12区  "Etc/GMT+12"
      unitValue: { unit: "week", weekStart: 0, value: 2 },
      // 输出、输入的数据格式
      time: {
        // type: 'absolute', // absolute|relative 绝对时间|相对时间
        // start: 0,
        // end: 30
        // unit: 'week', // 时间粒度单位
        // unit_value: 0, // 可输入值粒度组件输出该值
        // week_day: 0 // 标识是周几（只有在选择时间单位为‘周’的时候存在）
        // contrast: {
        // type: 'stage', // stage上一阶段|custom自定义
        // start: '0',
        // end: '30'
        // }
      },
      oneDayMilliseconds: 24 * 60 * 60 * 1000,
      calendarPanelData: {},
    };
  },

  watch: {
    timeData: {
      handler(data) {
        // console.log("time data-->>", data);

        // data.unit = "day";
        // data.unit_value = 20;
        // data.week_day = 0;

        // data.type = "relative"; // "absolute"|| "relative"
        // data.recent_day = "W0";
        // data.start = "2022/1/30 16:0:0";
        // data.end = "2022/2/12 17:59:59";

        // data.checked = true;

        // data.contrast.start = "2022/2/1 18:0:0";
        // data.contrast.end = "2022/2/17 23:59:59";
        // data.contrast.recent_day = "W0";

        //配置时间单位组件的值
        const isTimeUnitSelector = this.unitComponent === "timeUnitSelector";
        const isUnitSelector = this.unitComponent === "unitSelector";
        if (isTimeUnitSelector) {
          this.unitValue = this.getTimeUnitData(data);
        }
        if (isUnitSelector) {
          this.unitValue = this.getUnitData(data);
        }

        //设置time-range-selector的props
        this.hasHourTime = data.unit === "minutes" || data.unit === "hour";
        this.timeZone = data.timezone;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleApplySelectTime(timeData) {
      // console.log("timeData:", timeData);
      // console.log("time:", JSON.stringify(timeData, null, " "));
      //时间范围组件的数据
      this.time = timeData;
      // 获取时间单位
      const hasUnitSelector =
        this.unitComponent === "timeUnitSelector" ||
        this.unitComponent === "unitSelector";

      if (hasUnitSelector) {
        // this.time.unit = this.unitValue.unit;
        // if (this.time.unit === "week") {
        //   this.time.week_day = this.unitValue.weekStart;
        // }
        // // if (this.unitComponent === "timeUnitSelector") {
        // this.time.unit_value = this.unitValue.value;
        // // }
      }
      // console.log("this.time::", JSON.stringify(this.time, null, " "));
      this.$emit("applyTime", this.time);
    },
    handleUnitChange() {
      this.time.unit = this.unitValue.unit;
      this.time.unit_value = this.unitValue.value;
      if (this.time.unit === "week") {
        this.time.week_day = this.unitValue.weekStart;
      } else {
        delete this.time.week_day;
      }

      this.$emit("unitChange", this.unitValue);

      this.hasHourTime =
        this.unitValue.unit === "minutes" || this.unitValue.unit === "hour";
    },
    handleTimeUnitChange() {
      this.time.unit = this.unitValue.unit;
      this.time.unit_value = this.unitValue.value;
      if (this.time.unit === "week") {
        this.time.week_day = this.unitValue.weekStart;
      } else {
        delete this.time.week_day;
      }
      // console.log("时间单位改变:", this.time, "时间单位：", this.unitValue);
      this.$emit("unitChange", this.time, this.unitValue);
    },
    handleCancelSelectTime() {
      // console.log("取消时间，原时间为:", this.time);
      this.$emit("cancelSelectTime", this.time);
    },

    getUnitData(time) {
      const unitData = {};
      unitData.unit = time.unit;
      unitData.value = time.unit_value;
      if (unitData.unit === "week") {
        unitData.weekStart = time.week_day;
      }
      return unitData;
    },
    //带有数值时间粒度组件
    getTimeUnitData(time) {
      const unitData = this.getUnitData(time);
      unitData.value = time.unit_value || 0;
      return unitData;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.time-range-wrapper {
  cursor: pointer;
  display: inline-block;
  vertical-align: top;
}
.unit-wraper {
  margin-left: 10px;
}
</style>
