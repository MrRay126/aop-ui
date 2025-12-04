<template>
  <div class="recent-hour-section">
    <div class="recent-hour-set-section">
      <div>
        <div class="date-hour-section">
          <span class="time-label">起始时间:&nbsp;</span>
          <span class="time-date-hour-str">
            {{ startDateHourStr }}
          </span>
        </div>
        <div>
          <el-input-number
            class="rencent-hour-input"
            size="mini"
            controls-position="right"
            :min="0"
            v-model="startHour"
          ></el-input-number>

          <span style="font-size: 12px">&nbsp;小时前</span>
        </div>
      </div>
      <span class="separator">~</span>
      <div>
        <div class="date-hour-section">
          <span class="time-label">终止时间:&nbsp;</span>
          <span class="time-date-hour-str">
            {{ endDateHourStr }}
          </span>
        </div>
        <div>
          <el-input-number
            class="rencent-hour-input"
            size="mini"
            :max="startHour"
            :min="0"
            controls-position="right"
            v-model="endHour"
          ></el-input-number>
          <span style="font-size: 12px">&nbsp;小时前</span>
        </div>
      </div>
    </div>
    <div class="comment-hour-set">
      注:&nbsp;终止时间选择0小时前,表示包含当前小时。
    </div>
  </div>
</template>

<script>
import { getPreTimeStrOfHours } from "../utils.js";

export default {
  props: {
    time: {
      type: Object,
      default() {
        return {
          start: 1,
          end: 0,
        };
      },
    },
  },
  data() {
    return {
      startHour: 0,
      endHour: 0,
      startDateHourStr: getPreTimeStrOfHours(0),
      endDateHourStr: getPreTimeStrOfHours(0, true),
    };
  },
  watch: {
    time: {
      immediate: true,
      handler(val) {
        if (val) {
          this.needTriggerChangeEvent = false;
          this.startHour = val.start ?? 1;
          this.endHour = val.end ?? 0;

          //改变值时不触发事件
          setTimeout(() => {
            this.needTriggerChangeEvent = true;
          }, 500);
        }
      },
    },
    //startHour endHour 值为0时<el-input-number>不触发change事件,用watch监听代替事件
    startHour() {
      this.handleRecentHourStartChange();
    },
    endHour() {
      this.handleRecentHourEndChange();
    },
  },
  methods: {
    handleRecentHourStartChange() {
      this.startDateHourStr = getPreTimeStrOfHours(this.startHour);
      //设置终止时间不大于起始时间
      if (this.endHour > this.startHour) {
        this.endHour = this.startHour;
        this.handleRecentHourEndChange();
      }

      if (this.needTriggerChangeEvent) {
        this.$emit("startHourChange", this.startHour);
      }
    },

    handleRecentHourEndChange() {
      this.endDateHourStr = getPreTimeStrOfHours(this.endHour, true);
      if (this.needTriggerChangeEvent) {
        this.$emit("endHourChange", this.endHour);
      }
    },
  },
  created() {
    this.startDateHourStr = getPreTimeStrOfHours(this.startHour);
    this.endDateHourStr = getPreTimeStrOfHours(this.endHour, true);
  },
};
</script>

<style scoped lang="scss">
.recent-hour-section {
  min-height: 280px;

  .recent-hour-set-section {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 30px;

    .rencent-hour-input {
      width: 170px;
    }

    .separator {
      display: inline-block;
      margin-top: 27px;
      padding: 0 10px;
      font-weight: bold;
    }

    .time-label {
      font-size: 12px;
    }

    .time-date-hour-str {
      font-size: 12px;
      font-weight: bold;
      color: #1890ff;
    }

    .date-hour-section {
      margin-bottom: 10px;
    }
  }
  .comment-hour-set {
    font-size: 12px;
    margin-top: 20px;
  }
}
</style>
