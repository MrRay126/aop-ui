<template>
  <div class="calendar">
    <template v-if="showDateStatus !== 0">
      <div class="calendar__monthyear">
        <div @click="goPrevHandler" class="calendar__monthyear-btnleft">
          &lt;
        </div>
        <div @click="goNextHandler" class="calendar__monthyear-btnright">
          &gt;
        </div>
        <div @click="clickYearHandler" class="calendar__monthyear-content">
          {{ yearStr }}
        </div>
      </div>
      <div class="calendar__listcontainer">
        <ul>
          <li
            :class="[
              'calendar__monthyear-list',
              {
                focus: isFocusedSettorItem(item),
                'calendar__monthyear-disabledset':
                  getSetItemDisabledStatus(item),
              },
            ]"
            v-for="item in listTimeItems"
            :key="item"
            @click="setSelectItem(item)"
          >
            {{ item }}{{ showDateStatus === 1 ? "月" : "" }}
          </li>
        </ul>
      </div>
    </template>

    <template v-if="showDateStatus === 0 && !isSettingHour">
      <!-- <template v-if="false"> -->
      <div class="calendar__monthyear">
        <div @click="goPrevMonth" class="calendar__monthyear-btnleft">‹</div>
        <div @click="goNextMonth" class="calendar__monthyear-btnright">›</div>
        <div @click="clickYearHandler" class="calendar__monthyear-content">
          {{ months[this.monthTime] }} {{ yearTime }}
        </div>
      </div>
      <div class="calendar__weekdays">
        <ul class="calendar__weekdays-container">
          <template v-for="item in weekDays">
            <li class="calendar__weekdays-container-item" :key="item">
              {{ item }}
            </li>
          </template>
        </ul>
      </div>
      <div class="calendar__dates">
        <ul>
          <li
            v-for="item in preDays"
            :key="item + 'pre'"
            :class="[
              'calendar__dates-day',
              getSelectedClassOfDay(item, 'prevNumber'),
              {
                'calendar__dates-disabled': getDisabledStatusClass(
                  item,
                  'prevNumber'
                ),
              },
            ]"
          >
            <span
              @click="dealDateClick('prevNumber', item)"
              :class="[
                'calendar__dates-day-number',
                {
                  'calendar__dates-day-number-whencompare':
                    isCompareBoundryOpened,
                },
                getClassOfDayNumber(item, 'prevNumber'),
              ]"
            >
              {{ item }}
            </span>
          </li>

          <li
            v-for="item in days"
            :key="item + 'cur'"
            :class="[
              'calendar__dates-day',
              getSelectedClassOfDay(item),
              { 'calendar__dates-disabled': getDisabledStatusClass(item) },
            ]"
          >
            <span
              @click="dealDateClick('curNumber', item)"
              :class="[
                'calendar__dates-day-number',
                {
                  'calendar__dates-day-number-whencompare':
                    isCompareBoundryOpened,
                },
                getClassOfDayNumber(item),
              ]"
            >
              {{ item }}
            </span>
          </li>

          <li
            v-for="item in afterDays"
            :key="item + 'next'"
            :class="[
              'calendar__dates-day',
              getSelectedClassOfDay(item, 'nextNumber'),
              {
                'calendar__dates-disabled': getDisabledStatusClass(
                  item,
                  'nextNumber'
                ),
              },
            ]"
          >
            <span
              @click="dealDateClick('nextNumber', item)"
              :class="[
                'calendar__dates-day-number',
                {
                  'calendar__dates-day-number-whencompare':
                    isCompareBoundryOpened,
                },
                getClassOfDayNumber(item, 'nextNumber'),
              ]"
            >
              {{ item }}
            </span>
          </li>
        </ul>
      </div>
    </template>

    <template v-if="showDateStatus === 0 && hasOpenHourTime">
      <div v-if="isSettingHour" class="time-selector-container">
        <div class="date-time" @click="commitHourTime">
          {{ this.hourDate.year }}-{{
            String(this.hourDate.month).padStart(2, "0")
          }}-{{ String(this.hourDate.day).padStart(2, "0") }}
        </div>
        <div class="hour-counter">
          <div>
            <div class="arrow" @click="timeNumberUp">▲</div>
            <div class="number-section">
              {{ timeNumber }}
            </div>
            <div class="arrow" @click="timeNumberDown">▼</div>
          </div>
        </div>
      </div>
      <div
        v-if="!isSettingHour"
        class="hour-time-container"
        @click="startSettingHour"
      >
        {{ String(hour).padStart(2, "0") }}:{{
          String(minutes).padStart(2, "0")
        }}:{{ String(seconds).padStart(2, "0") }}
      </div>
    </template>
  </div>
</template>

<script>
import { date as getTimeZoneDate } from "@/utils";

export default {
  name: "Calendar",
  props: {
    isStartTimeCalendar: {
      type: Boolean,
      default: false,
    },
    isEndTimeCalendar: {
      type: Boolean,
      default: false,
    },
    // 设置大于当前日期的日子不可选择
    limitBeforeCurrentDate: {
      type: Boolean,
      default: true,
    },
    // 对比时间范围
    compareTimeRange: {
      type: Array,
      default() {
        return [];
      },
    },
    // 普通时间范围
    timeRange: {
      type: Array,
      default() {
        return [getTimeZoneDate(), getTimeZoneDate()];
      },
    },
    hasHourTime: {
      type: Boolean,
      default: false,
    },
    displayStatus: {
      type: Boolean,
      default: false,
    },
    hourTime: {
      type: Number,
      default: 0,
    },
    timeZone: {
      type: String,
      default: "Etc/GMT-8", //东八区
    },
  },
  data() {
    return {
      hourDate: {
        year: "",
        month: "",
        day: "",
      },
      hasOpenHourTime: false,
      isSettingHour: false,
      timeNumber: 0,

      hour: 0,
      minutes: 59,
      seconds: 59,
      dateTime: getTimeZoneDate(this.timeZone).getDate(), //日历交互显示使用日期 生成日期列表...等用
      monthTime: getTimeZoneDate(this.timeZone).getMonth(), //日历交互显示使用月份 生成日期列表...等用
      yearTime: getTimeZoneDate(this.timeZone).getFullYear(), //日历交互显示使用年 生成日期列表...等用
      settorYearTime: null, //日历点击日期后使用的年份
      settorMonthTime: null, //日历点击日期后使用的月份
      months: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
      weekDays: ["一", "二", "三", "四", "五", "六", "日"],
      preDays: [],
      days: [],
      afterDays: [],
      boundryDates: [
        // new Date('2021/7/15'),
        // new Date('2021/7/22')
      ],
      compareBoundryDates: [
        // new Date('2021/7/1'),
        // new Date('2021/7/14')
      ],
      isCompareBoundryOpened: false,
      isStartEndDateInSamePage: false,
      isStartEndTimeInSameMonth: false,
      noTimeInCurPage: false,
      selectDateNumbers: [],
      selectAfterDateNumbers: [],
      selectPrevDateNumbers: [],
      showDateStatus: 0, // 0日期  1月份  2年份
      yearStr: getTimeZoneDate(this.timeZone).getFullYear(),
      listTimeItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

      restoredStartTime: null,
      restoredCompareStartTime: null,
      restoredEndTime: null,
      restoredCompareEndTime: null,
    };
  },
  computed: {
    // 闰年计算
    isLeapYear: function () {
      let date = new Date(`${this.yearTime}/${this.monthTime + 1}/1`);
      var y = date.getFullYear();
      return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    },
    nowDate() {
      return getTimeZoneDate(this.timeZone);
    },
  },
  watch: {
    compareTimeRange: {
      handler(arrayValue) {
        if (this.isTimeRangeEqual(arrayValue, this.compareBoundryDates)) {
          return;
        }
        this.compareBoundryDates = arrayValue;
        this.isCompareBoundryOpened = arrayValue.length === 2;
        // if (this.isStartTimeCalendar) {
        //   this.compareBoundryDates[0].setHours(
        //     this.hour,
        //     this.minutes,
        //     this.seconds,
        //     0
        //   );
        // } else {
        //   this.compareBoundryDates[1].setHours(
        //     this.hour,
        //     this.minutes,
        //     this.seconds,
        //     0
        //   );
        // }
        this.init();
      },
      immediate: true,
    },
    timeRange: {
      handler(arrayValue) {
        if (this.isTimeRangeEqual(arrayValue, this.boundryDates)) {
          return;
        }
        this.boundryDates = [...arrayValue];
        this.init();
      },
      immediate: true,
    },
    hourTime: {
      handler(val) {
        this.hour = val;
        if (this.isSettingHour) {
          this.timeNumber = this.hour;
        }
      },
      immediate: true,
    },
    hasHourTime: {
      handler(val) {
        this.hasOpenHourTime = val;
      },
      immediate: true,
    },
    displayStatus(val) {
      if (val === false) {
        this.commitHourTime();
      }
      this.resetCalendarToInitialStateFromSetting();
    },
  },
  methods: {
    getNewDate(date) {
      return new Date(date);
    },
    isFocusedSettorItem(item) {
      const dateNow = this.nowDate;

      //月份选择
      if (this.showDateStatus === 1) {
        //使用0点比较
        return (
          new Date(
            `${this.settorYearTime}/${this.settorMonthTime + 1}/1 0:0:0`
          ).getTime() <=
            this.getNewDate(dateNow.getTime()).setHours(0, 0, 0, 0) &&
          this.settorYearTime === this.yearTime &&
          this.settorMonthTime + 1 === item
        );
      }
      //设置年份
      if (this.showDateStatus === 2) {
        return item <= dateNow.getFullYear() && item === this.settorYearTime;
      }
      //设置设置器的状态
    },
    //重置使用状态为初始显示状态
    resetCalendarToInitialStateFromSetting() {
      this.isSettingHour = false;
      this.showDateStatus = 0;
      this.setCalendarInitialTime();
    },
    startSettingHour() {
      this.timeNumber = this.hour;
      this.isSettingHour = true;
      this.refreshDateOfHourSettor();
    },
    refreshDateOfHourSettor() {
      const timeRange = this.timeRange;
      const compareTimeRange = this.compareTimeRange;
      if (this.isStartTimeCalendar) {
        if (this.isCompareBoundryOpened) {
          this.setDateOfHourPanel(compareTimeRange[0]);
        } else {
          this.setDateOfHourPanel(timeRange[0]);
        }
      } else {
        if (this.isCompareBoundryOpened) {
          this.setDateOfHourPanel(compareTimeRange[1]);
        } else {
          this.setDateOfHourPanel(timeRange[1]);
        }
      }
    },
    setDateOfHourPanel(date) {
      this.hourDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    },
    commitHourTime() {
      if (this.isSettingHour) {
        const hour = this.timeNumber;
        this.$emit("changeHourTime", {
          hour,
          isStartTimeCalendar: this.isStartTimeCalendar,
          isEndTimeCalendar: this.isEndTimeCalendar,
        });

        this.isSettingHour = false;
        // if (this.isStartTimeCalendar) {
        //   if (this.isCompareBoundryOpened) {
        //     this.compareBoundryDates[0].setHours(hour);
        //     this.$emit("update:compareTimeRange", this.compareBoundryDates);
        //   } else {
        //     this.boundryDates[0].setHours(hour);
        //     this.$emit("update:timeRange", this.boundryDates);
        //   }
        // }
        // if (this.isEndTimeCalendar) {
        //   if (this.isCompareBoundryOpened) {
        //     this.compareBoundryDates[1].setHours(hour);
        //     this.$emit("update:compareTimeRange", this.compareBoundryDates);
        //   } else {
        //     this.boundryDates[1].setHours(hour);
        //     this.$emit("update:timeRange", this.boundryDates);
        //   }
        // }
      }
    },
    timeNumberUp() {
      if (this.timeNumber < 23) {
        this.timeNumber += 1;
      } else {
        this.timeNumber = 0;
      }
    },
    timeNumberDown() {
      if (this.timeNumber > 0) {
        this.timeNumber -= 1;
      } else {
        this.timeNumber = 23;
      }
    },
    init(isYearMonthSettorInit) {
      if (!isYearMonthSettorInit) {
        this.setCalendarInitialTime();
      }
      this.initDateNumbers();
      this.refreshMonthOrYearSetter();
      this.refreshDateOfHourSettor();
    },
    calendarCanBeRendered() {
      this.timeRange.length !== 0;
    },
    isTimeRangeEqual(range1, range2) {
      return (
        Array.isArray(range1) &&
        Array.isArray(range2) &&
        range1.length === 2 &&
        range2.length === 2 &&
        range1[0].getTime() === range2[0].getTime() &&
        range1[1].getTime() === range2[1].getTime()
      );
    },
    setCalendarInitialTime() {
      if (this.isStartTimeCalendar) {
        if (this.isCompareBoundryOpened) {
          this.setTime(this.compareTimeRange[0]);
        } else {
          this.setTime(this.timeRange[0]);
        }
      }
      if (this.isEndTimeCalendar) {
        if (this.isCompareBoundryOpened) {
          this.setTime(this.compareTimeRange[1]);
        } else {
          this.setTime(this.timeRange[1]);
        }
      }
    },
    setTime(date) {
      //设置日历交互用时间
      this.yearTime = date.getFullYear();
      this.monthTime = date.getMonth();
      //设置日期当前选中的时间
      this.settorYearTime = this.yearTime;
      this.settorMonthTime = this.monthTime;
    },

    initDateNumbers() {
      let prevMonth = this.getPrevMonth(this.monthTime);
      let curMonthFirstDateWeekDay = this.getWeekDayOfMonthDay(
        this.yearTime,
        this.monthTime,
        1
      );
      this.preDays = this.getPreDateNumbers(
        prevMonth,
        curMonthFirstDateWeekDay
      );
      this.days = this.getCurMonthDateNumbers(this.monthTime);
      this.afterDays = this.getNextMonthDateNumbers(
        this.preDays.length,
        this.days.length
      );
    },
    getPrevMonth(monthTime) {
      let prevMonth = monthTime - 1;
      if (prevMonth < 0) {
        prevMonth = 11;
      }
      return prevMonth;
    },
    getNextMonth(monthTime) {
      let nextMonth = monthTime + 1;
      if (nextMonth > 11) {
        nextMonth = 0;
      }
      return nextMonth;
    },
    getDaysInMonth: function (month) {
      return [
        31,
        this.isLeapYear ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ][month];
    },

    getWeekDayOfMonthDay(year, month, dateNumber) {
      let date = new Date();
      date.setFullYear(year);
      date.setMonth(month);
      date.setDate(dateNumber);
      return date.getDay();
    },
    getPreDateNumbers(preMonth, weekNumber) {
      let preDateNumbers = [];
      let monthDays = this.getDaysInMonth(preMonth);
      let i = 1;
      weekNumber = weekNumber === 0 ? 7 : weekNumber;
      while (i < weekNumber) {
        preDateNumbers.unshift(monthDays);
        monthDays--;
        i++;
      }
      return preDateNumbers;
    },
    getCurMonthDateNumbers(month) {
      let monthDays = this.getDaysInMonth(month);
      let curMonthDaysNumbers = [];
      let i = 0;
      while (i < monthDays) {
        curMonthDaysNumbers.push(i + 1);
        i++;
      }
      return curMonthDaysNumbers;
    },
    getNextMonthDateNumbers(preMonthDays, currentMonthDays) {
      const dateCounts = 42;
      const resetDateCounts = dateCounts - preMonthDays - currentMonthDays;
      let curMonthDaysNumbers = [];
      let i = 0;
      while (i < resetDateCounts) {
        curMonthDaysNumbers.push(i + 1);
        i++;
      }
      return curMonthDaysNumbers;
    },
    // 下个月
    goNextMonth() {
      this.monthTime += 1;
      if (this.monthTime === 12) {
        this.monthTime = 0;
        this.yearTime += 1;
      }

      this.initDateNumbers();
    },
    // 上个月
    goPrevMonth() {
      this.monthTime -= 1;
      if (this.monthTime === -1) {
        this.monthTime = 11;
        this.yearTime -= 1;
        if (this.yearTime < 0) {
          this.yearTime = 1;
        }
      }

      this.initDateNumbers();
    },
    /// 需添加年的控制
    isTimeInCurrentPage(time) {
      const curYearMonth = `${this.yearTime}/${this.monthTime}`;
      const prevMonth = this.getPrevMonth(this.monthTime);
      const nextMonth = this.getNextMonth(this.monthTime);

      let preYearMonth = "";
      let nextYearMonth = "";
      if (prevMonth === 11) {
        preYearMonth = `${this.yearTime - 1}/${prevMonth}`;
      }
      if (nextMonth === 0) {
        nextYearMonth = `${this.yearTime + 1}/${nextMonth}`;
      }

      // 开始日期的日历需要对比结束日期和当前选中的日期（当前选中的为开始日期）
      // 结束日期的日历需要对比开始日期和当前选中的日期

      const timeYearMonth = `${time.getFullYear()}/${time.getMonth()}`;
      const timeDate = time.getDate();

      if (timeYearMonth === curYearMonth) {
        return this.days.includes(timeDate);
      }
      if (timeYearMonth === preYearMonth) {
        return this.preDays.includes(timeDate);
      }
      if (timeYearMonth === nextYearMonth) {
        return this.afterDays.includes(timeDate);
      }
      return false;
    },
    // 获取不可点击disable状态样式
    getDisabledStatusClass(number, type) {
      let yearTime = this.yearTime;
      let monthTime = this.monthTime;
      if (type === "prevNumber") {
        monthTime = this.getPrevMonth(this.monthTime);
        if (monthTime === 11) yearTime -= 1;
      }
      if (type === "nextNumber") {
        monthTime = this.getNextMonth(this.monthTime);
        if (monthTime === 0) yearTime += 1;
      }
      const numberDateTime = new Date(
        `${yearTime}/${monthTime + 1}/${number}`
      ).getTime();

      const currentDateTime = this.getNewDate(this.nowDate).setHours(
        0,
        0,
        0,
        0
      );

      if (this.isStartTimeCalendar) {
        // 大于当前日起为不可点击状态

        if (numberDateTime > currentDateTime && this.limitBeforeCurrentDate) {
          return true;
        }
      }

      if (this.isEndTimeCalendar) {
        // 大于当前日期 小于正常范围或对比范围边界值为不可点击状态
        let startTime = this.isCompareBoundryOpened
          ? this.compareBoundryDates[0]
          : this.boundryDates[0];
        startTime = this.getNewDate(startTime).setHours(0, 0, 0, 0);

        if (numberDateTime < startTime || numberDateTime > currentDateTime) {
          return true;
        }
      }
      return false;
    },
    getSelectedClassOfDay(number, type) {
      let yearTime = this.yearTime;
      let className = "";

      const boundryStartDate = `${this.boundryDates[0].getFullYear()}/${
        this.boundryDates[0].getMonth() + 1
      }/${this.boundryDates[0].getDate()}`;
      const boundryEndDate = `${this.boundryDates[1].getFullYear()}/${
        this.boundryDates[1].getMonth() + 1
      }/${this.boundryDates[1].getDate()}`;

      let monthTime = this.monthTime;
      if (type === "prevNumber") {
        monthTime = this.getPrevMonth(this.monthTime);
        if (monthTime === 11) yearTime -= 1;
      }
      if (type === "nextNumber") {
        monthTime = this.getNextMonth(this.monthTime);
        if (monthTime === 0) yearTime += 1;
      }
      const date = `${yearTime}/${monthTime + 1}/${number}`;
      /// /正常区间
      if (date === boundryStartDate && date === boundryEndDate) {
        // 终止点同 样式
        className = "selected last first";
      } else if (date === boundryStartDate) {
        // 终止点样式
        className = "selected first";
      } else if (date === boundryEndDate) {
        // 起始点样式
        className = "selected last";
      }

      const numberDate = new Date(date);

      /// /对比区间
      if (this.isCompareBoundryOpened) {
        const compareBoundryStartDate = `${this.compareBoundryDates[0].getFullYear()}/${
          this.compareBoundryDates[0].getMonth() + 1
        }/${this.compareBoundryDates[0].getDate()}`;
        const compareBoundryEndDate = `${this.compareBoundryDates[1].getFullYear()}/${
          this.compareBoundryDates[1].getMonth() + 1
        }/${this.compareBoundryDates[1].getDate()}`;

        if (
          date === compareBoundryStartDate &&
          date === compareBoundryEndDate
        ) {
          // 终止点同 样式
          className = "compare-selected last first";
        } else if (date === compareBoundryStartDate) {
          // 终止点样式
          className = "compare-selected first";
        } else if (date === compareBoundryEndDate) {
          // 起始点样式
          className = "compare-selected last";
        }

        if (this.inBoundryAndCompareBoundry(numberDate)) {
          className = "compare-cross-selected";

          // 起止点重合按 对比区间背景色 选择区间前景色
          if (date === compareBoundryStartDate && date === boundryStartDate) {
            className = "compare-selected  first";
          }
          if (date === compareBoundryStartDate && date === boundryEndDate) {
            className = "compare-selected last first";
          }

          if (date === compareBoundryEndDate && date === boundryStartDate) {
            className = "compare-selected last first";
          }

          if (date === compareBoundryEndDate && date === boundryEndDate) {
            className = "compare-selected last";
          }
        } else if (this.inBoundry(numberDate)) {
          className = "selected";
        } else if (this.inCompareBoundry(numberDate)) {
          className = "compare-selected";
        }
      } else {
        if (this.inBoundry(numberDate)) {
          className = "selected";
        }
      }

      // 设置当前日期样式
      const today = this.getNewDate(this.nowDate).setHours(0, 0, 0, 0);

      if (numberDate.getTime() === today) {
        className += " today";
      }
      return className;
    },

    inBoundryAndCompareBoundry(numberDate) {
      const start = this.getStartTimeOfDate(this.boundryDates[0]);
      const end = this.getStartTimeOfDate(this.boundryDates[1]);
      const cStart = this.getStartTimeOfDate(this.compareBoundryDates[0]);
      const cEnd = this.getStartTimeOfDate(this.compareBoundryDates[1]);

      return (
        numberDate >= start &&
        numberDate <= end &&
        numberDate >= cStart &&
        numberDate <= cEnd
      );
    },
    inBoundry(numberDate) {
      let start = this.getStartTimeOfDate(this.boundryDates[0]);
      let end = this.getStartTimeOfDate(this.boundryDates[1]);
      return numberDate > start && numberDate < end;
    },
    inCompareBoundry(numberDate) {
      const cStart = this.getStartTimeOfDate(this.compareBoundryDates[0]); //new Date(this.compareBoundryDates[0].getTime());
      const cEnd = this.getStartTimeOfDate(this.compareBoundryDates[1]); //new Date(this.compareBoundryDates[1].getTime());
      return numberDate > cStart && numberDate < cEnd;
    },
    getStartTimeOfDate(date) {
      const dateCopy = new Date(date.getTime());
      return new Date(dateCopy.setHours(0, 0, 0, 0));
    },
    getClassOfDayNumber(number, type) {
      let yearTime = this.yearTime;
      const boundryStartDate = `${this.boundryDates[0].getFullYear()}/${
        this.boundryDates[0].getMonth() + 1
      }/${this.boundryDates[0].getDate()}`;
      const boundryEndDate = `${this.boundryDates[1].getFullYear()}/${
        this.boundryDates[1].getMonth() + 1
      }/${this.boundryDates[1].getDate()}`;

      let monthTime = this.monthTime;
      if (type === "prevNumber") {
        monthTime = this.getPrevMonth(this.monthTime);
        //如果下个月是12月份 对应年份需要减1
        if (monthTime === 11) yearTime -= 1;
      }
      if (type === "nextNumber") {
        monthTime = this.getNextMonth(this.monthTime);
        //如果下个月是1月份 对应年份需要加1
        if (monthTime === 0) yearTime += 1;
      }

      const date = `${yearTime}/${monthTime + 1}/${number}`;

      if (date === boundryStartDate) {
        // 起始点样式
        if (this.isStartTimeCalendar) {
          if (this.isCompareBoundryOpened) {
            return "calendar__dates-day-focusdeep";
          } else {
            return "calendar__dates-day-focuslight";
          }
        }
        if (this.isEndTimeCalendar) {
          return "calendar__dates-day-focusdeep";
        }
      }

      if (date === boundryEndDate) {
        // 终止点样式
        if (this.isStartTimeCalendar) {
          return "calendar__dates-day-focusdeep";
        }
        if (this.isEndTimeCalendar) {
          if (this.isCompareBoundryOpened) {
            return "calendar__dates-day-focusdeep";
          } else {
            return "calendar__dates-day-focuslight";
          }
        }
      }

      if (this.isCompareBoundryOpened) {
        const compareBoundryStartDate = `${this.compareBoundryDates[0].getFullYear()}/${
          this.compareBoundryDates[0].getMonth() + 1
        }/${this.compareBoundryDates[0].getDate()}`;
        const compareBoundryEndDate = `${this.compareBoundryDates[1].getFullYear()}/${
          this.compareBoundryDates[1].getMonth() + 1
        }/${this.compareBoundryDates[1].getDate()}`;

        if (date === compareBoundryStartDate) {
          if (this.isStartTimeCalendar) {
            return "calendar__dates-day-compare-focuslight";
          }
          if (this.isEndTimeCalendar) {
            return "calendar__dates-day-compare-focusdeep";
          }
        }
        if (date === compareBoundryEndDate) {
          if (this.isStartTimeCalendar) {
            return "calendar__dates-day-compare-focusdeep";
          }
          if (this.isEndTimeCalendar) {
            return "calendar__dates-day-compare-focuslight";
          }
        }
      }
    },

    dealDateClick(type, dateNumber) {
      const isDateDisabled = this.getDisabledStatusClass(dateNumber, type);
      if (isDateDisabled) return;
      switch (type) {
        case "prevNumber":
          this.goPrevMonth();
          break;
        case "curNumber":
          // noop
          break;
        case "nextNumber":
          this.goNextMonth();
          break;
      }
      this.dateTime = dateNumber;
      let selectDate = new Date(
        `${this.yearTime}/${this.monthTime + 1}/${this.dateTime}`
      );
      selectDate = this.getSelectedDateWithTime(selectDate);

      const dateNow = this.getNewDate(this.nowDate);
      const cDate = new Date(selectDate.getTime()).setHours(0, 0, 0, 0);
      // 大于当前日期的日子不可选择
      if (this.limitBeforeCurrentDate && cDate > dateNow.setHours(0, 0, 0, 0)) {
        return;
      }

      //设置日历选中的年和月
      this.settorYearTime = this.yearTime;
      this.settorMonthTime = this.monthTime;

      this.setRestoreTime();
      // 更新边界值
      if (this.isCompareBoundryOpened) {
        this.setBoundryData(selectDate, this.compareBoundryDates).then(() => {
          this.$emit("update:compareTimeRange", this.compareBoundryDates);
        });
      } else {
        this.setBoundryData(selectDate, this.boundryDates).then(() => {
          this.$emit("update:timeRange", this.boundryDates);
        });
      }
      // 触发事件
      this.emitBoundryChangeEvent(selectDate);
    },
    getSelectedDateWithTime(selectedDate) {
      return this.hasOpenHourTime
        ? new Date(
            selectedDate.setHours(this.hour, this.minutes, this.seconds, 0)
          )
        : this.isStartTimeCalendar
        ? new Date(selectedDate.setHours(0, 0, 0, 0))
        : new Date(selectedDate.setHours(23, 59, 59, 0));
    },
    resetHourTime() {
      this.hour = this.isStartTimeCalendar ? 0 : 23;
      this.minutes = this.isStartTimeCalendar ? 0 : 59;
      this.seconds = this.isStartTimeCalendar ? 0 : 59;
    },
    // 缓存改变之前的值 用于判断是否发生change
    setRestoreTime() {
      if (this.isStartTimeCalendar) {
        if (this.isCompareBoundryOpened) {
          this.restoredCompareStartTime = this.compareTimeRange[0];
        } else {
          this.restoredStartTime = this.timeRange[0];
        }
      } else if (this.isEndTimeCalendar) {
        if (this.isCompareBoundryOpened) {
          this.restoredCompareEndTime = this.compareTimeRange[1];
        } else {
          this.restoreEndTime = this.timeRange[1];
        }
      }
    },
    // 触发时间区间改变事件
    emitBoundryChangeEvent(selectDate) {
      const setlectedTime = selectDate.getTime();

      if (this.isStartTimeCalendar) {
        if (this.isCompareBoundryOpened) {
          if (setlectedTime !== this.restoredCompareStartTime) {
            this.$emit("compareStartDateChange", [
              selectDate,
              this.compareBoundryDates[1],
            ]);
          }
        } else {
          if (setlectedTime !== this.restoredStartTime) {
            this.$emit("startDateChange", [selectDate, this.boundryDates[1]]);
          }
        }
        return;
      }

      if (this.isEndTimeCalendar) {
        if (this.isCompareBoundryOpened) {
          if (setlectedTime !== this.restoredCompareEndTime) {
            this.$emit("compareEndDateChange", [
              this.compareBoundryDates[0],
              selectDate,
            ]);
          }
        } else {
          if (setlectedTime !== this.restoredEndTime) {
            this.$emit("endDateChange", [this.boundryDates[0], selectDate]);
          }
        }
      }
    },
    setBoundryData(selectDate, boundryDates) {
      const thenObject = {
        then: function (fn) {
          if (typeof fn === "function") {
            fn();
          }
        },
      };

      if (this.isStartTimeCalendar) {
        boundryDates.splice(0, 1, selectDate);
        if (boundryDates[0] > boundryDates[1]) {
          const endDate = new Date(boundryDates[0].getTime());
          endDate.setHours(
            boundryDates[1].getHours(),
            boundryDates[1].getMinutes(),
            boundryDates[1].getSeconds()
          );
          boundryDates.splice(0, 2, boundryDates[0], endDate);
        }
      }

      if (this.isEndTimeCalendar) {
        // 小于起始日期的日期不可点击
        if (selectDate < boundryDates[0]) return thenObject;
        boundryDates.splice(
          1,
          1,
          new Date(
            `${this.yearTime}/${this.monthTime + 1}/${this.dateTime} ${
              this.hour
            }:${this.minutes}:${this.seconds}`
          )
        );
      }
      return thenObject;
    },

    goPrevHandler() {
      //设置月份
      if (this.showDateStatus === 1) {
        if (this.yearTime > 1000) {
          this.yearTime -= 1;
          this.yearStr = this.yearTime;
        }
      }
      if (this.showDateStatus === 2) {
        this.yearTime -= 10;
        if (this.yearTime >= 1000) {
          this.showYearList(this.yearTime);
        }
      }
    },
    goNextHandler() {
      if (this.showDateStatus === 1) {
        if (this.yearTime >= 1000) {
          this.yearTime += 1;
          this.yearStr = this.yearTime;
        }
      }
      if (this.showDateStatus === 2) {
        this.yearTime += 10;
        if (this.yearTime <= 9999) {
          this.showYearList(this.yearTime);
        }
      }
    },
    clickYearHandler() {
      if (this.showDateStatus < 2) {
        this.showDateStatus += 1;
      }
      //获取设置面板显示用的年值

      if (this.showDateStatus === 1) {
        this.showMonthList();
        this.yearStr = this.yearTime;
      }
      if (this.showDateStatus === 2) {
        this.showYearList(this.yearTime);
      }
    },
    refreshMonthOrYearSetter() {
      //设置月份
      if (this.showDateStatus === 1) {
        this.yearStr = this.yearTime;
      }
      //设置年份
      if (this.showDateStatus === 2) {
        this.showYearList(this.yearTime);
      }
    },
    // 点击时间选项
    setSelectItem(time) {
      if (this.showDateStatus === 2) {
        // 设置大于当前日期的日子不可选择
        const dateNow = this.getNewDate(this.nowDate);
        if (time > dateNow.getFullYear()) {
          return;
        }
        if (this.isEndTimeCalendar) {
          const startTime = this.isCompareBoundryOpened
            ? this.compareBoundryDates[0]
            : this.boundryDates[0]; //modify
          if (time < startTime.getFullYear()) {
            return;
          }
        }
        this.yearStr = this.yearTime = time;
      }
      // 月份选择
      if (this.showDateStatus === 1) {
        const selectDate = new Date(`${this.yearTime}/${time}/1`);
        const dateNow = this.getNewDate(this.nowDate);
        // 设置大于当前日期的日子不可选择
        if (this.limitBeforeCurrentDate && selectDate > dateNow) {
          return;
        }

        if (this.isEndTimeCalendar) {
          const selectDate = new Date(
            `${this.yearTime}/${time}/${this.getDaysInMonth(time - 1)}`
          );
          const startMonthDate = this.isCompareBoundryOpened
            ? this.compareBoundryDates[0]
            : this.boundryDates[0]; //modify
          if (selectDate < startMonthDate) {
            return;
          }
        }

        this.monthTime = time - 1;
      }

      /// 设置点击后的变化
      if (this.showDateStatus > 0) {
        this.showDateStatus -= 1;
      }
      if (this.showDateStatus === 1) {
        this.showMonthList();
        // 设置选中项
      }
      if (this.showDateStatus === 0) {
        const isYearMonthSettorInit = true;
        this.init(isYearMonthSettorInit);
      }
    },
    showMonthList() {
      this.listTimeItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    },
    showYearList(yearBase) {
      const pre = String(yearBase).substr(0, 3);
      const startTime = Number(pre + 0);
      const endTime = Number(pre + 9);
      this.yearStr = `${startTime}~${endTime}`;
      this.listTimeItems = [];
      let i = startTime;
      while (i <= endTime) {
        this.listTimeItems.push(i);
        i++;
      }
      this.listTimeItems.unshift(startTime - 1);
      this.listTimeItems.push(endTime + 1);
    },
    getSetItemDisabledStatus(time) {
      if (this.showDateStatus === 2) {
        // 设置大于当前日期的日子不可选择
        const dateNow = this.getNewDate(this.nowDate);
        if (time > dateNow.getFullYear()) {
          return true;
        }
        if (this.isEndTimeCalendar) {
          const startTime = this.isCompareBoundryOpened
            ? this.compareBoundryDates[0]
            : this.boundryDates[0]; //modify
          if (time < startTime.getFullYear()) {
            return true;
          }
        }
      }
      // 月份选择
      if (this.showDateStatus === 1) {
        const selectDate = new Date(`${this.yearTime}/${time}/1 0:0:0`);
        const dateNow = this.getNewDate(this.nowDate);
        // 设置大于当前日期的日子不可选择
        if (this.limitBeforeCurrentDate && selectDate > dateNow) {
          return true;
        }

        if (this.isEndTimeCalendar) {
          const selectDate = new Date(
            `${this.yearTime}/${time}/${this.getDaysInMonth(time - 1)} 23:59:59`
          );

          const startMonthDate = this.isCompareBoundryOpened
            ? this.compareBoundryDates[0]
            : this.boundryDates[0]; //modify
          if (selectDate < startMonthDate) {
            return true;
          }
        }
      }
    },
  },
  created() {
    if (this.isStartTimeCalendar) {
      this.minutes = 0;
      this.seconds = 0;
    } else {
      this.minutes = 59;
      this.seconds = 59;
    }

    // 如果未指定时间范围参数则默认选中当天
    // if (this.timeRange.length === 0) {
    //   this.timeRange[0] = this.getNewDate(this.nowDate);
    //   this.timeRange[1] = this.getNewDate(this.nowDate);
    // }
    // this.init()
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$height: 22px;
$dayBlockWidth: 28px;
$dayBlockHeight: 24px;
$dayNumberWidth: 20px;
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  float: left;
}

.calendar {
  font-family: "TA-Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  user-select: none;
  width: 228px;
  box-sizing: border-box;
  margin: 0;
  padding: 4px 15px;
  border: 1px solid #efefef;

  .time-selector-container {
    padding-top: 10px;
    .date-time {
      text-align: center;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
    }

    .hour-counter {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .arrow {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        cursor: pointer;
        &:hover {
          background: #efefef;
        }
      }
    }
  }
  .hour-time-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 28px;
    margin: 5px 0;
    cursor: pointer;

    &:hover {
      background: #efefef;
    }
  }

  .today {
    font-weight: bold;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      border-bottom: 10px solid #5978f9;
      border-left: 10px solid transparent;
    }
  }
  &__listcontainer {
    overflow: auto;
  }

  &__monthyear {
    height: 30px;
    line-height: 30px;

    &-list {
      float: left;
      width: 25%;
      height: 57px;
      line-height: 57px;
      text-align: center;
      &.focus {
        background: #1890ff;
        color: #fff;
        &:hover {
          background: #1890ff;
          color: #fff;
        }
      }
      &:hover {
        background: #efefef;
        color: #000;
      }
    }

    &-disabledset {
      color: #999;
      &:hover {
        background: transparent;
        color: #999;
      }
    }

    &-btnleft {
      padding: 0 10px;
      float: left;
      cursor: pointer;
      font-size: 21px;
      color: #3d90ff;
      height: 100%;
      line-height: 26px;

      &:hover {
        background: rgb(237, 237, 237);
      }
    }
    &-btnright {
      padding: 0 10px;
      float: right;
      cursor: pointer;
      font-size: 21px;
      color: #3d90ff;
      height: 100%;
      line-height: 26px;

      &:hover {
        background: rgb(237, 237, 237);
      }
    }
    &-content {
      font-size: 14px;
      font-weight: bold;
      color: #323234;
      margin: 0 35px;
      text-align: center;

      &:hover {
        background: rgb(237, 237, 237);
      }
    }
  }

  &__weekdays {
    position: relative;
    height: $height;
    margin-top: 10px;

    &-container {
      margin: 0;
      padding: 0;

      &-item {
        margin: 0;
        padding: 0;
        font-size: 12px;
        width: $dayBlockWidth;
      }
    }
  }

  &__dates {
    overflow: auto;

    &-disabled {
      color: #c0c4cc;
    }

    &-day {
      &.compare-selected {
        background: rgba(255, 167, 86, 0.1);
      }
      &.selected {
        background: rgba(89, 120, 249, 0.1);
      }
      &.compare-cross-selected {
        background: rgba(126, 70, 107, 0.1);
      }
      &.first {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }

      &.last {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      width: $dayBlockWidth;
      height: $dayBlockHeight;
      text-align: center;
      line-height: $dayBlockHeight;
      font-size: 12px;
      margin-top: 5px;

      &-focuslight {
        background: #5978f9;
        color: #fff;
      }

      &-focusdeep {
        background: #a5b5f7;
        color: #fff;
      }
      &-compare-focuslight {
        background: #ffa756;
        color: #fff;
      }
      &-compare-focusdeep {
        background: rgba(255, 167, 86, 0.5);
        color: #fff;
      }

      &-number {
        display: block;
        width: $dayNumberWidth;
        height: $dayNumberWidth;
        line-height: $dayNumberWidth;
        margin-left: 4px;
        margin-top: 2px;
        border-radius: 10px;
        cursor: pointer;
        &:hover {
          background: #5978f9;
          color: #fff;
        }
      }
      &-number-whencompare {
        &:hover {
          background: #ffa756;
          color: #fff;
        }
      }
    }
  }
}
</style>
