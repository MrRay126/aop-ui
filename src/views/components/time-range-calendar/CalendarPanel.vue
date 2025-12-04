<template>
  <transition name="slide-fade">
    <div ref="pannel" class="pannel" v-show="isContainerShow" @click.stop="">
      <div class="pannel__topsection">
        <div
          v-show="isShowDynamicTab"
          @click="timeTypeClickHandler('dynamic')"
          :class="[
            'pannel__topsection-label',
            { focus: listType === 'dynamic' },
          ]"
        >
          动态时间
        </div>
        <div
          v-show="isShowStaticTab"
          @click="timeTypeClickHandler('static')"
          :class="[
            'pannel__topsection-label',
            { focus: listType === 'static' },
          ]"
        >
          静态时间
        </div>
        <!-- <template v-if="!isHourMode"> -->
        <span class="pannel__topsection-timetext">({{ timeRangeStr }})</span>
        <!-- </template> -->
      </div>
      <div class="pannel-content-section">
        <div class="left-btn-section">
          <div class="fastsettor">
            <template v-for="button in sideBtns">
              <template v-if="isUseTheButton(button)">
                <div
                  :key="button.name"
                  @click="qiuckButtonHandler(button.name)"
                  :class="[
                    button.isSmallBtn ? 'fastsettor__small' : 'fastsettor__big',
                    { 'sidebtn-focus': buttonFocused === button.name },
                    {
                      'sidebtn-focus-compare':
                        buttonFocusedCompare === button.name,
                    },
                  ]"
                >
                  {{ button.label }}
                </div>
              </template>
            </template>
          </div>
        </div>
        <div class="right-calendar-section">
          <div class="calendar-container">
            <template v-if="isHourMode">
              <recent-time
                :time="recentHourTime"
                @startHourChange="handleRencentStartHourChange"
                @endHourChange="handleRencentEndHourChange"
              ></recent-time>
            </template>
            <template v-else>
              <div class="timer">
                <div class="timer-start">
                  起始时间：
                  <span class="timer-label">{{ startTimeStr }}</span>
                </div>
                <Calendar
                  ref="startCalendar"
                  v-show="isCalendarShow"
                  :displayStatus="displayStatus"
                  :hasHourTime="hasHourTime"
                  :hourTime="startUseHourTime"
                  :isStartTimeCalendar="true"
                  :timeRange.sync="timeRange"
                  :compareTimeRange.sync="compareTimeRange"
                  :timeZone="timeZone"
                  @compareStartDateChange="handleCalendarDateClick"
                  @startDateChange="handleCalendarDateClick"
                  @changeHourTime="handleCalendarHourTimeChange"
                ></Calendar>
              </div>
              <div class="timer">
                <div class="timer-end">
                  终止时间：
                  <span class="timer-label">{{ endTimeStr }}</span>
                </div>
                <Calendar
                  ref="endCalendar"
                  v-show="isCalendarShow"
                  :displayStatus="displayStatus"
                  :hasHourTime="hasHourTime"
                  :hourTime="endUseHourTime"
                  :isEndTimeCalendar="true"
                  :timeRange.sync="timeRange"
                  :compareTimeRange.sync="compareTimeRange"
                  :timeZone="timeZone"
                  @compareEndDateChange="handleCalendarDateClick"
                  @endDateChange="handleCalendarDateClick"
                  @changeHourTime="handleCalendarHourTimeChange"
                ></Calendar>
              </div>
            </template>
          </div>
          <div class="bottom-section">
            <div class="bottomsection-left" v-if="hasCompareAction">
              <el-checkbox
                @change="handleChangeIfCompare"
                v-model="isCompareDateOpened"
                :label="!isHourMode ? '日期对比' : '小时对比'"
              ></el-checkbox>
              <template v-if="isCompareDateOpened">
                <el-select
                  v-model="compareType"
                  size="mini"
                  class="bottomsection-compareselect"
                  @change="handleCompareTypeChange"
                >
                  <el-option :value="0" label="上一阶段"></el-option>
                  <el-option :value="1" label="自定义"></el-option>
                </el-select>
                <!-- <template v-if="!isHourMode"> -->
                <span class="bottomsection-comparetext">
                  {{ compareTimeLabel }}
                </span>
                <!-- </template> -->
              </template>
            </div>
            <!-- span flex布局占位符 保证flex容器内有无对比日期按钮都始终居右 -->
            <span></span>
            <div class="bottomsection-right">
              <el-button @click="cancelHandler" size="small" type="plain">
                取消
              </el-button>
              <el-button @click="apply" size="small" type="primary">
                应用
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Calendar from "./Calendar.vue";
import recentTime from "./components/recentTime.vue";
import { getPreTimeStrOfHours } from "./utils.js";
import { date as getTimeZoneDate } from "@/utils";

export default {
  name: "CalendarPanel",
  components: {
    Calendar,
    recentTime,
  },
  props: {
    // 是否使用设置最近/过去n小时功能 , 开启时会显示侧边栏按钮
    hasRecentHourAction: {
      type: Boolean,
      default: false,
    },
    /** @param: isAutoTriggerApplyTimeEvent
     *     true(载入即触发一次)
     *     false(首次载入不触发,手动触发)
     * **/
    isAutoTriggerApplyTimeEvent: {
      type: Boolean,
      default: true,
    },

    isPanelShow: {
      type: Boolean,
      default: false,
    },

    hasCompareAction: {
      type: Boolean,
      default: false,
    },
    calendarPanelData: {
      type: Object,
      default() {
        return {};
      },
    },
    hasHourTime: {
      type: Boolean,
      default: false,
    },
    isShowDynamicTab: {
      type: Boolean,
      default: true,
    },
    isShowStaticTab: {
      type: Boolean,
      default: true,
    },
    timeZone: {
      type: String,
      default: "Etc/GMT-8",
    },
  },
  data() {
    return {
      //设置最近/过去几小时的数据
      isHourMode: false,
      recentHourStart: 1,
      recentHourEnd: 0,
      compareRecentHourStart: 1,
      compareRecentHourEnd: 0,
      recentHourTime: {},

      isSomeDayToNowBtnUsed: false, //是否某日至今按钮使用状态(不和控制样式的混用) //选择操作后,自某日至今再次打开面板回显时保证能是聚焦状态,因为0-20等无法判断出是根据‘自某日至今’生成
      isCompareSomeDayToNowBtnUsed: false, //是否对比状态下 某日至今按钮使用状态(不和控制样式的混用)
      isSomeDayToYestodayBtnUsed: false,
      isCompareSomeDayToYestodayBtnUsed: false,
      displayStatus: true,
      startUseHourTime: 0,
      startHourTime: 0,
      startCompareHourTime: 0,

      endUseHourTime: 23,
      endHourTime: 23,
      endCompareHourTime: 23,
      recentDay: "",
      compareRecentDay: "",
      // 按钮和时间显示数据  //name 用于获取操作方法 和控制按钮样式 //新增按钮时只需而外添加一个name名称的method
      sideBtns: [
        {
          label: "昨日",
          name: "yestoday",
          isSmallBtn: true,
          visible: true,
          priority: 1,
          syncWithRight: true, //右侧选中时左侧按钮是否同步
          timeTag: "1-1", //前1天到前1天
        },
        {
          label: "今日",
          name: "today",
          isSmallBtn: true,
          visible: true,
          priority: 1,
          syncWithRight: true,
          timeTag: "0-0",
        },
        {
          label: "上周",
          name: "lastWeek",
          isSmallBtn: true,
          visible: true,
          priority: 1,
          syncWithRight: false,
          timeTag: "W1",
        },
        {
          label: "本周",
          name: "thisWeek",
          isSmallBtn: true,
          visible: true,
          priority: 1,
          syncWithRight: false,
          timeTag: "W0",
        },
        {
          label: "上月",
          name: "lastMonth",
          isSmallBtn: true,
          visible: true,
          priority: 1,
          syncWithRight: false,
          timeTag: "M1",
        },
        {
          label: "本月",
          name: "thisMonth",
          isSmallBtn: true,
          visible: true,
          priority: 1,
          syncWithRight: false,
          timeTag: "M0",
        },
        {
          label: "过去7天",
          name: "lastSevenDays",
          isSmallBtn: true,
          visible: true,
          priority: 3,
          syncWithRight: true,
          timeTag: "1-7",
        },
        {
          label: "最近7天",
          name: "recentSevenDays",
          isSmallBtn: true,
          visible: true,
          priority: 3,
          syncWithRight: true,
          timeTag: "0-6",
        },
        {
          label: "过去30天",
          name: "lastThirtyDays",
          isSmallBtn: true,
          visible: true,
          priority: 3,
          syncWithRight: true,
          timeTag: "1-30",
        },
        {
          label: "最近30天",
          name: "recentThirtyDays",
          isSmallBtn: true,
          visible: true,
          priority: 3,
          syncWithRight: true,
          timeTag: "0-29",
        },
        {
          label: "自某日至昨日",
          name: "fromSomeDayToYestoday",
          isSmallBtn: false,
          visible: true,
          priority: 0,
          syncWithRight: false,
          // timeTag: "0-",
        },
        {
          label: "自某日至今日",
          name: "fromSomeDayToNow",
          isSmallBtn: false,
          visible: true,
          priority: 0,
          syncWithRight: false,
          // timeTag: "0-",
        },
        {
          label: "前天",
          name: "beforeYestoday",
          isSmallBtn: false,
          visible: false,
          priority: 1,
          syncWithRight: true,
          timeTag: "2-2",
        },

        {
          label: "最近/过去n小时",
          name: "hourSet",
          isSmallBtn: false,
          visible: true,
          priority: 1,
          syncWithRight: false,
          timeTag: "",
        },
      ],

      compareRecentDayDict: {
        cyestoday: "2-2",
        ctoday: "1-1",
        clastWeek: "W2",
        cthisWeek: "W1",
        clastMonth: "M2",
        cthisMonth: "M1",
        clastSevenDays: "8-14",
        crecentSevenDays: "7-13",
        clastThirtyDays: "31-60",
        crecentThirtyDays: "30-59",
      },

      compareTimeLabelDict: {
        cyestoday: "前日",
        ctoday: "昨日",
        clastWeek: "上上周",
        cthisWeek: "上周",
        clastMonth: "上上月",
        cthisMonth: "上月",
        clastSevenDays: "过去14 - 过去8天",
        crecentSevenDays: "过去13 - 过去7天",
        clastThirtyDays: "过去60 - 过去31天",
        crecentThirtyDays: "过去59 - 过去30天",
      },
      listType: "dynamic", // dynamic  static
      buttonFocused: "",
      buttonFocusedStore: "",
      buttonFocusedCompare: "",
      isCompareDateOpened: false,
      compareType: 0,
      startTimeStr: "2021-7-29",
      endTimeStr: "2021-7-29",
      timeRangeStr: "过去至今n天",
      compareTimeLabel: "过去30天",
      timeRange: [
        // new Date('2021/6/7'),
        // new Date('2021/7/7')
      ],
      compareTimeRange: [
        // new Date('2021/4/7'),
        // new Date('2021/6/7')
      ],
      yearMonthInShow: null,
      millisecondsOfOneDay: 24 * 60 * 60 * 1000,
      curSelectBtnNameForResetSelectedBtn: "",
      isCalendarShow: true,
      isContainerShow: true,
      panelResetData: null,
    };
  },
  computed: {
    // 闰年计算
    isLeapYear() {
      let date = new Date(`${this.yearTime}/${this.monthTime + 1}/1`);
      var y = date.getFullYear();
      return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    },
    nowDate() {
      return getTimeZoneDate(this.timeZone);
    },
    todayZeroStartTime() {
      return this.getNewDate(this.nowDate).setHours(0, 0, 0, 0);
    },
  },
  watch: {
    timeRange(dateRange) {
      this.startTimeStr = this.getDateString(dateRange[0]);
      this.endTimeStr = this.getDateString(dateRange[1]);
    },

    isPanelShow(val) {
      this.displayStatus = val;

      if (!val) {
        this.hideAndResetData();
      } else {
        this.isContainerShow = true;
        this.isCalendarShow = true;
      }
    },

    calendarPanelData: {
      handler(panelData) {
        this.panelResetData = { ...panelData };
        this.resetPannel(this.panelResetData);
        this.handelCalendarInputDataChange(); //输出事件 改变标签显示值
      },
      immediate: true,
    },
    //监听timezone异步变化,刷新面板显示(根据timezone时期的当前日期)
    timeZone() {
      this.resetPannel(this.panelResetData);
      // this.handelCalendarInputDataChange();
    },
  },
  methods: {
    isUseTheButton(btn) {
      if (btn.visible) {
        if (btn.name === "hourSet") {
          return this.hasRecentHourAction && this.listType === "dynamic"; // '最近/过去几n小时' 按钮只在动态时间展示
        }
        return true;
      } else {
        return false;
      }
    },
    //开始时间change
    handleRencentStartHourChange(data) {
      if (this.isCompareDateOpened) {
        this.compareRecentHourStart = data;
        //设置对比的显示时间字符串
        this.compareTimeLabel = this.getRecentHourLabelStr(
          this.compareRecentHourStart,
          this.compareRecentHourEnd
        );
        this.setCompareTypeSelfDefined();
      } else {
        this.recentHourStart = data;
        //设置输出的显示时间字符串
        this.timeRangeStr = this.getRecentHourLabelStr(
          this.recentHourStart,
          this.recentHourEnd
        );
      }
    },
    handleRencentEndHourChange(data) {
      if (this.isCompareDateOpened) {
        this.compareRecentHourEnd = data;
        //设置对比的显示时间字符串
        this.compareTimeLabel = this.getRecentHourLabelStr(
          this.compareRecentHourStart,
          this.compareRecentHourEnd
        );
        this.setCompareTypeSelfDefined();
      } else {
        this.recentHourEnd = data;
        //设置输出的显示时间字符串
        this.timeRangeStr = this.getRecentHourLabelStr(
          this.recentHourStart,
          this.recentHourEnd
        );
      }
    },

    ///保存动态时间的临时数据
    setTabData() {
      const setNormalTime = (sideBtn) => {
        if (sideBtn) {
          //执行sidebtn 点击操作
          const needResetCompareType = false;
          this.qiuckButtonHandler(sideBtn, needResetCompareType);
        } else {
          if (this.listType === "dynamic") {
            //根据时间范围生成 显示和输出recentDay
            this.timeRangeStr = this.getDynamicTimeStr(this.timeRange);
            const normalTagStart = this.countDateFromSomeDateToNow(
              this.timeRange[1]
            );
            const normalTagEnd = this.countDateFromSomeDateToNow(
              this.timeRange[0]
            );
            const normalTagStr = `${normalTagStart}-${normalTagEnd}`;
            this.recentDay = normalTagStr;
          } else if (this.listType === "static") {
            this.timeRangeStr = this.getStaticTimeStr(this.timeRange);
            this.recentDay = "";

            //某日至今
            if (
              this.buttonFocused === "fromSomeDayToNow" ||
              this.buttonFocusedStore === "fromSomeDayToNow"
            ) {
              this.recentDay = "StartToNow";
            }

            //某日至昨日
            if (
              this.buttonFocused === "fromSomeDayToYestoday" ||
              this.buttonFocusedStore === "fromSomeDayToYestoday"
            ) {
              this.recentDay = "StartToYestoday";
            }
          }
        }
      };

      const setCompareTime = (sideBtn) => {
        if (sideBtn) {
          //执行sidebtn 点击操作
          const needResetCompareType = false;
          this.qiuckButtonHandler(sideBtn, needResetCompareType);
        } else {
          if (this.listType === "dynamic") {
            //根据时间范围生成 显示和输出compareRecentDay
            this.compareTimeLabel = this.getDynamicTimeStr(
              this.compareTimeRange
            );
            const tagStart = this.countDateFromSomeDateToNow(
              this.compareTimeRange[1]
            );
            const tagEnd = this.countDateFromSomeDateToNow(
              this.compareTimeRange[0]
            );
            const tagStr = `${tagStart}-${tagEnd}`;
            this.compareRecentDay = tagStr;
          } else if (this.listType === "static") {
            this.compareTimeLabel = this.getStaticTimeStr(
              this.compareTimeRange
            );
            this.compareRecentDay = "";
            if (this.buttonFocusedCompare === "fromSomeDayToNow") {
              this.compareRecentDay = "StartToNow";
            }

            if (this.buttonFocusedCompare === "fromSomeDayToYestoday") {
              this.compareRecentDay = "StartToYestoday";
            }
          }
        }
      };

      //保持按钮状态
      const storeBtnstatus = () => {
        this.focusedBtn = {
          normal: this.buttonFocused,
          compare: this.buttonFocusedCompare,
        };
      };

      //重置状态
      const resetBtnStatus = () => {
        this.buttonFocused = this.focusedBtn.normal;
        this.buttonFocusedCompare = this.focusedBtn.compare;
      };

      storeBtnstatus();
      if (!this.isCompareDateOpened) {
        const sideBtnName = this.buttonFocused;
        setNormalTime(sideBtnName);
      } else {
        const normalSideBtn = this.buttonFocusedStore;
        const compareSideBtn = this.buttonFocusedCompare;
        this.isCompareDateOpened = false; //临时配置状态为false 保证按钮按false执行动作
        setNormalTime(normalSideBtn);

        this.isCompareDateOpened = true; //还原为true
        setCompareTime(compareSideBtn);
      }
      resetBtnStatus();
    },
    resetBtnUsedStatus() {
      //目前只有某日至今按钮 + 自某日至昨日
      this.isSomeDayToNowBtnUsed = false;
      this.isSomeDayToYestodayBtnUsed = false;
    },
    resetCompareBtnUsedStatus() {
      //目前对比状态只有自某日至今按钮 + 自某日至昨日

      this.isCompareSomeDayToNowBtnUsed = false;
      this.isCompareSomeDayToYestodayBtnUsed = false;
    },

    ///
    setSomeDayToNowBtnStatusToUsed() {
      this.isSomeDayToNowBtnUsed = true;
    },
    ///
    setCompareSomeDayToNowBtnStatusToUsed() {
      this.isCompareSomeDayToNowBtnUsed = true;
    },

    ///至昨日
    setSomeDayToYestodayBtnStatusToUsed() {
      this.isSomeDayToYestodayBtnUsed = true;
    },
    ///自昨日
    setCompareSomeDayToYestodayBtnStatusToUsed() {
      this.isCompareSomeDayToYestodayBtnUsed = true;
    },

    getNewDate(date) {
      return new Date(date);
    },
    getDateString(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    },
    // 获取某日距离当天的天数
    countDateFromSomeDateToNow(date) {
      const dateCopy = new Date(date.getTime()); //避免影响原date
      const fromTime = dateCopy.setHours(0, 0, 0, 0);
      const nowTime = this.todayZeroStartTime;
      return Math.round(
        Math.abs(nowTime - fromTime) / this.millisecondsOfOneDay
      );
    },
    // 获取超前n天的日期
    getDateBeforeNowAccordingDates(dayCount) {
      const ms = dayCount * this.millisecondsOfOneDay;
      const nowTime = this.todayZeroStartTime;
      return new Date(nowTime - ms);
    },
    timeTypeClickHandler(type) {
      this.listType = type;
      //'最近过去n小时' 的状态
      if (this.isHourMode) {
        this.isHourMode = false;
        //设置到初始重置状态,如果初始状态是设置的最近过去n小时则设置到今天 ‘today’
        const originIsHour = this.panelResetData.recentDay
          ?.toLowerCase()
          .includes("h");
        if (originIsHour) {
          this.isCompareDateOpened = false;
          this.compareTimeRange = [];
          //重置使用'today'快捷按钮
          this.qiuckButtonHandler("today");
        } else {
          //重置到初始状态
          this.listType = this.panelResetData.listType;
          const panelResetData = { ...this.panelResetData };
          panelResetData.listType = this.listType;
          this.resetPannel(panelResetData);
          //重置后执行当前标签点击,设置当前状态
          this.timeTypeClickHandler(type);
        }
      } else {
        this.setTabData();
      }
    },

    handleChangeIfCompare() {
      this.$emit("compareStateChange", this.isCompareDateOpened);

      const isRecentHourInuse = this.hasRecentHourAction && this.isHourMode;
      if (isRecentHourInuse) {
        if (this.isCompareDateOpened) {
          this.buttonFocusedCompare = "hourSet";
          this.setRecentHourToPreStage();

          this.compareTimeLabel = this.getRecentHourLabelStr(
            this.compareRecentHourStart,
            this.compareRecentHourEnd
          );
        } else {
          this.buttonFocusedCompare = "";
          //设置回显到组件
          this.setDataForRecentHourTimeShow();

          //设置输出的显示时间
          this.timeRangeStr = this.getRecentHourLabelStr(
            this.recentHourStart,
            this.recentHourEnd
          );
        }
        return;
      } else {
        //其他正正常情况
        this.quickCompareCheckBoxHandler();
        this.setCompareTypePreStage();
        this.changHourTimeInUse();
      }
    },
    setRecentHourToPreStage() {
      const stageLen = this.recentHourStart - this.recentHourEnd;
      this.compareRecentHourEnd = this.recentHourStart + 1;
      this.compareRecentHourStart = this.compareRecentHourEnd + stageLen;
      //设置回显到组件
      this.setDataForRecentHourTimeShow();
    },
    handleCompareTypeChange() {
      const isPreStageSelected = this.compareType === 0;
      const isRecentHour = this.hasRecentHourAction && this.isHourMode;

      if (isPreStageSelected) {
        if (isRecentHour) {
          //设置小时为上一阶段
          this.setRecentHourToPreStage();

          //设置对比的显示时间
          this.compareTimeLabel = this.getRecentHourLabelStr(
            this.compareRecentHourStart,
            this.compareRecentHourEnd
          );
        } else {
          //模拟取消对比时间选择,再次选择
          this.isCompareDateOpened = false;
          this.quickCompareCheckBoxHandler();
          this.isCompareDateOpened = true;
          this.quickCompareCheckBoxHandler();
        }
      }
    },

    //使用正常时间的小时时间 或对比的小时时间
    changHourTimeInUse() {
      if (!this.isCompareDateOpened) {
        this.startUseHourTime = this.startHourTime;
        this.endUseHourTime = this.endHourTime;
        // console.log("this.startUseHourTime:", this.startUseHourTime);
      } else {
        //开启对比时间时同步正常时间的小时配置
        this.startCompareHourTime = this.startHourTime;
        this.endCompareHourTime = this.endHourTime;
        //设置显示用的小时时间
        this.startUseHourTime = this.startHourTime;
        this.endUseHourTime = this.endHourTime;
        // this.startUseHourTime = 0;
        // this.endUseHourTime = 23;
        this.compareTimeRange[0].setHours(this.startCompareHourTime);
        this.compareTimeRange[1].setHours(this.endCompareHourTime);
      }
    },

    handleCalendarHourTimeChange({
      hour,
      isStartTimeCalendar,
      isEndTimeCalendar,
    }) {
      if (isStartTimeCalendar) {
        this.startUseHourTime = hour;
        if (this.isCompareDateOpened) {
          // this.startCompareHourTime = hour;
          this.compareTimeRange[0].setHours(hour);
        } else {
          this.startHourTime = hour;
          this.timeRange[0].setHours(hour);
        }
      }

      if (isEndTimeCalendar) {
        this.endUseHourTime = hour;
        if (this.isCompareDateOpened) {
          // this.endCompareHourTime = hour;
          this.compareTimeRange[1].setHours(hour);
        } else {
          this.endHourTime = hour;
          this.timeRange[1].setHours(hour);
        }
      }
    },

    setStaticRencentDay(methodName) {
      let tagStr = "";
      if (methodName === "fromSomeDayToNow") {
        tagStr = "StartToNow";
      }

      if (methodName === "fromSomeDayToYestoday") {
        tagStr = "StartToYestoday";
      }

      if (this.isCompareDateOpened) {
        this.compareRecentDay = tagStr;
      } else {
        this.recentDay = tagStr;
      }
    },
    setDynamicRecentDay(methodName, range) {
      let tagStr = "";
      if (methodName) {
        //使用侧边按钮的情况
        if (methodName === "fromSomeDayToNow") {
          const count = this.countDateFromSomeDateToNow(range[0]);
          tagStr = `0-${count}`;
        } else if (methodName === "fromSomeDayToYestoday") {
          const count = this.countDateFromSomeDateToNow(range[0]);
          tagStr = `1-${count}`;
        } else {
          const currentClickBtn = this.sideBtns.find((btn) => {
            return btn.name === methodName;
          });
          tagStr = currentClickBtn.timeTag;
        }
      } else {
        //只有时间范围没有侧边按钮的情况，没有匹配到侧边按钮
        if (range.length > 0) {
          const tagStart = this.countDateFromSomeDateToNow(range[1]);
          const tagEnd = this.countDateFromSomeDateToNow(range[0]);
          tagStr = `${tagStart}-${tagEnd}`;
        }
      }
      if (this.isCompareDateOpened) {
        this.compareRecentDay = tagStr;
      } else {
        this.recentDay = tagStr;
      }
    },
    //输出的按钮时间逻辑标识 methodName 值可以不存在 时间范围必须存在
    // setRecentDayTag
    setRecentDayTag(methodName, range) {
      if (this.listType === "dynamic") {
        this.setDynamicRecentDay(methodName, range);
      }
      if (this.listType === "static") {
        this.setStaticRencentDay(methodName);
      }
    },
    setHourTimeOfTimeRange(timeRange, startHour, endHour) {
      timeRange[0].setHours(startHour, 0, 0);
      timeRange[1].setHours(endHour, 59, 59);
      return timeRange;
    },
    setRange(range) {
      if (this.isCompareDateOpened) {
        this.compareTimeRange = this.setHourTimeOfTimeRange(
          range,
          this.startCompareHourTime,
          this.endCompareHourTime
        );
      } else {
        this.timeRange = this.setHourTimeOfTimeRange(
          range,
          this.startHourTime,
          this.endHourTime
        );
      }
    },

    setDisplayTimeString(rangeData) {
      const timeDisplayTypeMethods = {
        dynamic: this.getDynamicTimeStr,
        static: this.getStaticTimeStr,
      };

      const timeDisplayFn = timeDisplayTypeMethods[this.listType].bind(this); // listType :'dynamic' || 'static'
      const displayTimeRangeData = rangeData;
      const timeStr = timeDisplayFn(displayTimeRangeData);

      if (!this.isCompareDateOpened) {
        this.timeRangeStr = timeStr;
      } else {
        this.compareTimeLabel = timeStr;
      }
    },
    // 左侧快捷按钮时间标签
    setQuickButtonTimeStr(operationName) {
      let timeLabel = "";
      if (this.listType === "dynamic") {
        timeLabel = this.getDynamicTimeStrOfSideQuickButton(operationName);
      }
      if (this.listType === "static") {
        let timeRangeData = this.isCompareDateOpened
          ? this.compareTimeRange
          : this.timeRange;
        timeLabel = this.getStaticTimeStr(timeRangeData, operationName);
      }
      if (this.isCompareDateOpened) {
        this.compareTimeLabel = timeLabel;
      } else {
        this.timeRangeStr = timeLabel;
      }
    },
    // 正常时间同对比时间
    getDynamicTimeStrOfSideQuickButton(operationName) {
      const NameLabelDict = {};
      this.sideBtns.forEach((item) => {
        NameLabelDict[item.name] = item.label;
      });

      let timeLabel = NameLabelDict[operationName];

      if (operationName === "fromSomeDayToNow") {
        const timeRange = this["fromSomeDayToNow"]();
        timeLabel = `自过去${Math.floor(this.getDaysInRange(timeRange))}天至今`;
      }

      if (operationName === "fromSomeDayToYestoday") {
        const timeRange = this["fromSomeDayToYestoday"]();
        timeLabel = `自过去${
          Math.floor(this.getDaysInRange(timeRange)) + 1
        }天至昨日`;
      }

      return timeLabel;
    },

    // setQuickButtonDynamTimeStr () {},
    // 点击日期对比复选框时设置的时间标签
    setCompareCheckBoxTimeStr(operationName) {
      let timeLabel = "";
      if (this.listType === "dynamic") {
        timeLabel = this.setCompareCheckBoxDynamicTimeStr(operationName);
      } else {
        timeLabel = this.getStaticTimeStr(this.compareTimeRange, operationName);
      }
      this.compareTimeLabel = timeLabel;
    },

    setCompareCheckBoxDynamicTimeStr(operationName) {
      const timeLabelDict = this.$options.data().compareTimeLabelDict;
      // console.log("timeLabelDict:", timeLabelDict);

      let timeLabel = timeLabelDict[operationName];

      if (operationName === "cfromSomeDayToNow") {
        const timeRange = this["cfromSomeDayToNow"]();
        timeLabel = `自过去${Math.floor(this.getDaysInRange(timeRange))}天至今`;
      }

      if (operationName === "cfromSomeDayToYestoday") {
        const timeRange = this["cfromSomeDayToYestoday"]();
        timeLabel = `自过去${Math.floor(
          this.getDaysInRange(timeRange) + 1
        )}天至昨日`;
      }

      return timeLabel;
    },
    setCompareCheckBoxRecentDay(operationName, timeRange) {
      if (this.listType === "dynamic") {
        this.setCompareCheckBoxDynamicRecentDay(operationName, timeRange);
      }
      if (this.listType === "static") {
        this.setCompareCheckBoxStaticRecentDay(operationName, timeRange);
      }
    },
    ///动态时间下的设置
    setCompareCheckBoxDynamicRecentDay(operationName, timeRange) {
      if (operationName) {
        if (operationName === "cfromSomeDayToNow") {
          const timeRange = this["cfromSomeDayToNow"]();
          const endNumber = this.getDaysInRange(timeRange);
          this.compareRecentDay = `0-${endNumber}`;
          return;
        }
        if (operationName === "cfromSomeDayToYestoday") {
          const timeRange = this["cfromSomeDayToYestoday"]();
          const endNumber = this.getDaysInRange(timeRange) + 1;
          this.compareRecentDay = `1-${endNumber}`;
          return;
        }
        this.compareRecentDay = this.compareRecentDayDict[operationName];
      } else {
        //如果没有选中的操作按钮
        if (timeRange.length > 0) {
          const tagStart = this.countDateFromSomeDateToNow(timeRange[1]);
          const tagEnd = this.countDateFromSomeDateToNow(timeRange[0]);
          this.compareRecentDay = `${tagStart}-${tagEnd}`;
        }
      }
    },
    //静态时间下的设置 只有自某日至今需要设置 其他清空
    setCompareCheckBoxStaticRecentDay(operationName) {
      this.compareRecentDay = "";
      if (operationName === "cfromSomeDayToNow") {
        this.compareRecentDay = "StartToNow";
      }
      if (operationName === "cfromSomeDayToYestoday") {
        this.compareRecentDay = "StartToYestoday";
      }
    },
    // 点击日期按钮时
    getDynamicTimeStr(range) {
      // 动态时间分为tag时间和 文本描述时间
      const startDateCount = this.countDateFromSomeDateToNow(range[0]);
      const endDateCount = this.countDateFromSomeDateToNow(range[1]);
      const lastDateCount = startDateCount - endDateCount + 1;

      const timeTag = this.getTagNameStrOfTime(range);
      if (timeTag) return timeTag;

      if (endDateCount === 0) {
        return `最近${lastDateCount}天`;
      } else if (endDateCount === 1) {
        return `过去${lastDateCount}天`;
      } else {
        return `过去${startDateCount}天 - 过去${endDateCount}天`;
      }
    },
    // 如：'(2021-07-20 ~ 2022-07-28)'
    getStaticTimeStr(range, operationName) {
      const startDateStr = this.getDateString(range[0]);
      const endDateStr = this.getDateString(range[1]);

      //自某日至今
      if (
        operationName === "fromSomeDayToNow" ||
        operationName === "cfromSomeDayToNow" //对比时间
      ) {
        return `自${startDateStr}至今`;
      }
      //自某日至昨日
      if (
        operationName === "fromSomeDayToYestoday" ||
        operationName === "cfromSomeDayToYestoday" //对比时间
      ) {
        return `自${startDateStr}至昨日`;
      }
      return `${startDateStr} ~ ${endDateStr}`;
    },
    // 获取中文名称的日期显示
    getTagNameStrOfTime(range) {
      let timeTagStr = "";

      const sideBtns = this.sideBtns.filter((btnItem) => btnItem.syncWithRight);

      const buttonNames = sideBtns.map((item) => item.name);
      const len = buttonNames.length;
      let i = 0;
      const operationsOfSamePeriod = [];

      for (; i < len; i++) {
        const operationItem = buttonNames[i];

        if (this.isTimeRangeEqual(range, this[operationItem]())) {
          operationsOfSamePeriod.push(operationItem);
        }
      }
      const useOperationName = this.getUseFulTimeTag(operationsOfSamePeriod);
      timeTagStr = this.getDynamicTimeStrOfSideQuickButton(useOperationName); // buttonNameDict[useOperationName]
      return timeTagStr;
    },

    getUseFulTimeTag(operationNameArr) {
      if (operationNameArr.length === 0) return;
      //上一次选择操作选择的按钮
      let curSelectBtnName = this.curSelectBtnNameForResetSelectedBtn;
      const hasCurBtn = operationNameArr.includes(curSelectBtnName);

      //优先级靠前的按钮
      let sortedPriorityBtnsNames = JSON.parse(JSON.stringify(this.sideBtns))
        .sort((pre, next) => next.priority - pre.priority)
        .map((btn) => btn.name);

      //获取同时满足情况的按钮中优先级最高的按钮
      let firstToUseBtn = "";
      let i = 0;
      let len = sortedPriorityBtnsNames.length;
      for (; i < len; i++) {
        if (operationNameArr.includes(sortedPriorityBtnsNames[i])) {
          firstToUseBtn = sortedPriorityBtnsNames[i];
          break;
        }
      }

      return hasCurBtn
        ? curSelectBtnName
        : firstToUseBtn
        ? firstToUseBtn
        : operationNameArr[0];
    },
    // get
    // 快速复选框选中操作
    quickCompareCheckBoxHandler() {
      this.resetCompareBtnUsedStatus();

      if (this.isCompareDateOpened) {
        let operationName = "";
        if (this.buttonFocused) {
          const operationPreTag = "c";
          operationName = `${operationPreTag}${this.buttonFocused}`;
        }

        if (operationName) {
          const timeRange = this[operationName]();
          this.compareTimeRange = this.setHourTimeOfTimeRange(
            timeRange,
            this.startUseHourTime,
            this.endUseHourTime
          );
          this.setFocusedCompareQuickButton(operationName);
          this.setCompareCheckBoxTimeStr(operationName);
          this.setCompareCheckBoxRecentDay(operationName, timeRange);

          if (operationName === "cfromSomeDayToNow") {
            this.setCompareSomeDayToNowBtnStatusToUsed();
          }

          if (operationName === "cfromSomeDayToYestoday") {
            this.setCompareSomeDayToYestodayBtnStatusToUsed();
          }
        } else {
          const timeRange = this.getSameLengthPeriodBeforeRange(this.timeRange);
          // console.log(timeRange);
          this.compareTimeRange = this.setHourTimeOfTimeRange(
            timeRange,
            this.startUseHourTime,
            this.endUseHourTime
          );

          this.compareTimeLabel = this.getDynamicTimeStr(this.compareTimeRange);
          this.setCompareCheckBoxRecentDay("", timeRange);
        }

        this.buttonFocusedStore = this.buttonFocused;
        this.buttonFocused = "";
      } else {
        this.buttonFocused = this.buttonFocusedStore;
        this.buttonFocusedCompare = "";
        this.compareTimeRange = [];
        this.compareRecentDay = "";
        this.cancelCompare();
      }
    },
    setFocusedCompareQuickButton(operation) {
      const labelDict = {
        cyestoday: "",
        ctoday: "yestoday",
        clastWeek: "",
        cthisWeek: "lastWeek",
        clastMonth: "",
        cthisMonth: "lastMonth",
        clastSevenDays: "",
        crecentSevenDays: "",
        clastThirtyDays: "",
        crecentThirtyDays: "",
        cfromSomeDayToNow: "fromSomeDayToNow",
        cfromSomeDayToYestoday: "fromSomeDayToYestoday",
      };
      this.buttonFocusedCompare = labelDict[operation];
    },
    cnoQuickButton() {
      return this.getSameLengthPeriodBeforeRange(this.timeRange);
    },
    // 日期对比 categories
    cyestoday() {
      this.buttonFocusedCompare = "";
      const theDayPreYeaterday = this.getDateBeforeNowAccordingDates(2);
      return [theDayPreYeaterday, new Date(theDayPreYeaterday.getTime())];
    },
    ctoday() {
      this.buttonFocusedCompare = "yestoday";
      const timeRange = this.yestoday();
      return timeRange;
    },
    clastWeek() {
      this.buttonFocusedCompare = "";
      const timeRange = this.getSameLengthPeriodBeforeRange(this.timeRange);
      return timeRange;
    },
    cthisWeek() {
      this.buttonFocusedCompare = "lastWeek";
      const timeRange = this.lastWeek();
      return timeRange;
    },
    clastMonth() {
      this.buttonFocusedCompare = "";
      return this.getMonthDaysOfPre(2);
    },
    cthisMonth() {
      this.buttonFocusedCompare = "lastMonth";
      return this.getMonthDaysOfPre(1);
    },
    clastSevenDays() {
      const endDate = this.getDateBeforeNowAccordingDates(8);
      const startDate = this.getDateBeforeNowAccordingDates(14);
      return [startDate, endDate];
    },
    crecentSevenDays() {
      const endDate = this.getDateBeforeNowAccordingDates(7);
      const startDate = this.getDateBeforeNowAccordingDates(13);
      return [startDate, endDate];
    },
    clastThirtyDays() {
      const endDate = this.getDateBeforeNowAccordingDates(31);
      const startDate = this.getDateBeforeNowAccordingDates(60);
      return [startDate, endDate];
    },
    crecentThirtyDays() {
      const endDate = this.getDateBeforeNowAccordingDates(30);
      const startDate = this.getDateBeforeNowAccordingDates(59);
      return [startDate, endDate];
    },
    cfromSomeDayToNow() {
      this.buttonFocusedCompare = "fromSomeDayToNow";

      const dateCount = this.getDaysInRange(this.timeRange) + 1;
      const startDate = this.getDateBeforeNowAccordingDates(dateCount * 2 - 1);
      const dateNow = this.getNewDate(this.nowDate);
      return [startDate, dateNow];
    },
    cfromSomeDayToYestoday() {
      this.buttonFocusedCompare = "fromSomeDayToYestoday";

      const dateCount = this.getDaysInRange(this.timeRange) + 1;
      const startDate = this.getDateBeforeNowAccordingDates(dateCount * 2);
      const yestoday = this.getDateBeforeNowAccordingDates(1);

      return [startDate, yestoday];
    },
    // 日期对比取消勾选
    cancelCompare() {
      this.qiuckButtonHandler(this.buttonFocused);
    },

    qiuckButtonHandler(methodName, resetCompareType = true) {
      //处理设置小时快捷按钮
      if (methodName === "hourSet") {
        if (this.isCompareDateOpened) {
          if (this.buttonFocusedCompare !== "hourSet") {
            this.isCompareDateOpened = false;

            this.buttonFocusedCompare = "";
            this.qiuckButtonHandler("hourSet");
            return;
          }
          this.buttonFocusedCompare = methodName;
          this.setDataForRecentHourTimeShow();

          //设置对比的显示时间
          this.compareTimeLabel = this.getRecentHourLabelStr(
            this.compareRecentHourStart,
            this.compareRecentHourEnd
          );
        } else {
          this.buttonFocused = methodName;
          this.setDataForRecentHourTimeShow();

          //重置recentHour的显示
          if (!this.isHourMode) {
            this.initRecentHour();
          }

          //设置时间提示显示字符
          this.timeRangeStr = this.getRecentHourLabelStr(
            this.recentHourStart,
            this.recentHourEnd
          );
        }
        this.isHourMode = true;
        return;
      } else {
        if (this.isHourMode) {
          this.isHourMode = false;
          this.isCompareDateOpened = false;
          this.buttonFocusedCompare = "";
          this.compareTimeRange = [];
        }
      }

      //处理其他按钮
      this.isCompareDateOpened
        ? this.resetCompareBtnUsedStatus()
        : this.resetBtnUsedStatus();

      if (methodName) {
        // 设置样式 记录选中标签
        if (this.isCompareDateOpened) {
          this.buttonFocusedCompare = methodName;
          this.buttonFocused = "";
          this.curSelectBtnNameForResetSelectedBtn = this.buttonFocusedCompare;

          if (resetCompareType) {
            this.setCompareTypeSelfDefined();
          }
        } else {
          this.buttonFocusedCompare = "";
          this.buttonFocused = methodName;
          this.curSelectBtnNameForResetSelectedBtn = this.buttonFocused;
        }

        const range = this[methodName]();
        this.setRange(range);
        this.setQuickButtonTimeStr(methodName);
        this.setRecentDayTag(methodName, range);

        if (methodName === "fromSomeDayToNow") {
          this.isCompareDateOpened
            ? this.setCompareSomeDayToNowBtnStatusToUsed()
            : this.setSomeDayToNowBtnStatusToUsed();
        }

        if (methodName === "fromSomeDayToYestoday") {
          this.isCompareDateOpened
            ? this.setCompareSomeDayToYestodayBtnStatusToUsed()
            : this.setSomeDayToYestodayBtnStatusToUsed();
        }
      }
    },
    //初始化recentHour
    initRecentHour() {
      const initData = this.$options.data();
      this.recentHourStart = initData.recentHourStart;
      this.recentHourEnd = initData.recentHourEnd;
      this.compareRecentHourStart = initData.compareRecentHourStart;
      this.compareRecentHourEnd = initData.compareRecentHourEnd;
      this.recentHourTime = {
        start: this.recentHourStart,
        end: this.recentHourEnd,
      };
    },

    // 前天
    beforeYestoday() {
      const startDate = this.getDateBeforeNowAccordingDates(2);
      const range = [startDate, new Date(startDate.getTime())];
      return range;
    },
    yestoday() {
      const startDate = this.getDateBeforeNowAccordingDates(1);
      const range = [startDate, new Date(startDate.getTime())];
      return range;
    },
    today() {
      const startDate = this.getDateBeforeNowAccordingDates(0);
      const range = [startDate, new Date(startDate.getTime())];
      return range;
    },
    getWeekDayCountOfToday() {
      const dateNow = this.getNewDate(this.nowDate);
      let weekDayCount = dateNow.getDay();
      weekDayCount = weekDayCount === 0 ? 7 : weekDayCount;
      return weekDayCount;
    },
    lastWeek() {
      const weekDayCount = this.getWeekDayCountOfToday();
      const range = [
        this.getDateBeforeNowAccordingDates(weekDayCount + 6),
        this.getDateBeforeNowAccordingDates(weekDayCount),
      ];
      return range;
    },
    thisWeek() {
      const weekDayCount = this.getWeekDayCountOfToday();
      const range = [
        this.getDateBeforeNowAccordingDates(weekDayCount - 1),
        this.getDateBeforeNowAccordingDates(0),
      ];

      return range;
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

    lastMonth() {
      return this.getMonthDaysOfPre(1);
    },
    thisMonth() {
      const nowDate = this.getNewDate(this.nowDate);
      const dayCounts = nowDate.getDate();
      const startTime = nowDate.setDate(1);
      const range = [
        new Date(startTime),
        new Date(startTime + (dayCounts - 1) * this.millisecondsOfOneDay),
      ];
      return range;
    },
    lastSevenDays() {
      const range = [
        this.getDateBeforeNowAccordingDates(7),
        this.getDateBeforeNowAccordingDates(1),
      ];
      return range;
    },
    recentSevenDays() {
      const range = [
        this.getDateBeforeNowAccordingDates(6),
        this.getDateBeforeNowAccordingDates(0),
      ];
      return range;
    },
    lastThirtyDays() {
      const range = [
        this.getDateBeforeNowAccordingDates(30),
        this.getDateBeforeNowAccordingDates(1),
      ];
      return range;
    },
    recentThirtyDays() {
      const range = [
        this.getDateBeforeNowAccordingDates(29),
        this.getDateBeforeNowAccordingDates(0),
      ];
      return range;
    },
    fromSomeDayToNow() {
      const dateNow = this.getNewDate(this.nowDate);
      return [
        this.isCompareDateOpened ? this.compareTimeRange[0] : this.timeRange[0],
        dateNow,
      ];
    },
    fromSomeDayToYestoday() {
      const yestoday = this.getDateBeforeNowAccordingDates(1);
      let someDay;
      if (this.isCompareDateOpened) {
        //结束时间为yestoday,开始时间不能大于结束时间yestoday
        someDay =
          this.compareTimeRange[0] > yestoday
            ? new Date(yestoday)
            : this.compareTimeRange[0];
      } else {
        someDay =
          this.timeRange[0] > yestoday ? new Date(yestoday) : this.timeRange[0];
      }
      return [someDay, yestoday];
    },
    getMonthDaysOfPre(beforeCount) {
      const dateNow = this.getNewDate(this.nowDate);
      let todayCountOfCurMonth = dateNow.getDate();
      let curMonth = dateNow.getMonth();

      let preMonthNumber = curMonth - 1 < 0 ? 11 : curMonth - 1; // 前一个月月份
      let preMonthDateCounts = this.getDaysInMonth(preMonthNumber);

      let endDateCount = todayCountOfCurMonth;
      let startDateCount = endDateCount + preMonthDateCounts - 1;

      let monthNumber = preMonthNumber;
      if (beforeCount > 1) {
        let i = beforeCount - 1;
        while (i > 0) {
          i -= 1;
          endDateCount = startDateCount + 1;
          monthNumber = monthNumber - 1 < 0 ? 11 : monthNumber - 1;
          startDateCount += this.getDaysInMonth(monthNumber);
        }
      }

      const endDate = this.getDateBeforeNowAccordingDates(endDateCount);
      const startDate = this.getDateBeforeNowAccordingDates(startDateCount);
      const range = [startDate, endDate];
      return range;
    },
    getDaysInRange(range) {
      const startDate = new Date(range[0].getTime()).setHours(0, 0, 0);
      const endDate = new Date(range[1].getTime()).setHours(0, 0, 0);
      return Math.round((endDate - startDate) / this.millisecondsOfOneDay);
    },
    getSameLengthPeriodBeforeNow(range) {
      const daysCount = this.getDaysInRange(range) + 1;
      return [
        this.getDateBeforeNowAccordingDates(daysCount * 2),
        this.getDateBeforeNowAccordingDates(daysCount + 1),
      ];
    },
    getSameLengthPeriodBeforeRange(range) {
      // const gapDaysTime =
      //   range[1].getTime() - range[0].getTime() + this.millisecondsOfOneDay;

      const startTime = this.getNewDate(range[0]).setHours(0, 0, 0, 0);
      const endTime = this.getNewDate(range[1]).setHours(0, 0, 0, 0);

      const gapDaysTime = endTime - startTime;
      const rangeEndTime = startTime - this.millisecondsOfOneDay;
      const rangeStartTime = rangeEndTime - gapDaysTime;
      return [new Date(rangeStartTime), new Date(rangeEndTime)];
    },
    resetCurYearMonthInShow() {
      const nowDate = this.getNewDate(this.nowDate);
      this.yearMonthInShow = new Date(
        nowDate.getFullYear(),
        nowDate.getMonth(),
        1
      );
    },

    handleCalendarDateClick(timeRange) {
      this.resetButtonStyle(timeRange);
      this.setDisplayTimeString(timeRange);
      this.setCompareTypeSelfDefined();

      const operationName = this.getMatchedSideBtnAccordingTimeRange(timeRange);
      //operationName undefined || operationName
      this.setRecentDayTag(operationName, timeRange);

      this.isCompareDateOpened
        ? this.resetCompareBtnUsedStatus()
        : this.resetBtnUsedStatus();
    },

    // resetQuickSetButton(timeRange) {
    //   this.resetButtonStyle(timeRange);
    //   this.setDisplayTimeString(timeRange);
    // },

    setCompareTypeSelfDefined() {
      if (this.hasCompareAction && this.isCompareDateOpened) {
        this.compareType = 1;
      }
    },
    setCompareTypePreStage() {
      if (this.hasCompareAction && this.isCompareDateOpened) {
        this.compareType = 0;
      }
    },
    resetButtonStyle(timeRange) {
      // 点击日期选择时，设置快捷按钮样式
      const operationName = this.getMatchedSideBtnAccordingTimeRange(timeRange);
      if (this.isCompareDateOpened) {
        this.buttonFocused = "";
        this.buttonFocusedCompare = operationName;
      } else {
        this.buttonFocused = operationName;
        this.buttonFocusedCompare = "";
        this.buttonFocusedStore = operationName;
      }
    },
    //获取和点击时间范围匹配的侧边栏按钮 返回值 字符串 或 undefined||''
    getMatchedSideBtnAccordingTimeRange(timeRange) {
      const sideBtns = this.sideBtns.filter((btnItem) => btnItem.syncWithRight);

      // 获取按钮可见性
      const sideBtnVisibleDict = {};
      sideBtns.forEach((btn) => {
        sideBtnVisibleDict[btn.name] = btn.visible;
      });
      const operationNameArr = sideBtns.map((item) => item.name);

      const matchedOperationArr = [];
      let i = 0;
      let len = operationNameArr.length;
      for (; i < len; i++) {
        const operationItem = operationNameArr[i];
        if (
          sideBtnVisibleDict[operationItem] &&
          this.isTimeRangeEqual(timeRange, this[operationItem]())
        ) {
          matchedOperationArr.push(operationItem);
        }
      }

      const operationName = this.getUseFulTimeTag(matchedOperationArr);
      return operationName;
    },
    isTimeRangeEqual(timeRange1, timeRange2) {
      const timeRange1Start = new Date(timeRange1[0].getTime());
      const timeRange1End = new Date(timeRange1[1].getTime());

      const timeRange2Start = new Date(timeRange2[0].getTime());
      const timeRange2End = new Date(timeRange2[1].getTime());
      return (
        timeRange1Start.setHours(0, 0, 0, 0) ===
          timeRange2Start.setHours(0, 0, 0, 0) &&
        timeRange1End.setHours(0, 0, 0, 0) ===
          timeRange2End.setHours(0, 0, 0, 0)
      );
    },

    hideAndResetData() {
      this.isCalendarShow = false;
      setTimeout(() => {
        this.isContainerShow = false;
        this.$emit("hide", this.panelResetData);
      }, 200);
      this.resetPannel(this.panelResetData);
    },

    cancelHandler() {
      this.$emit("cancel", this.panelResetData);
    },

    apply() {
      this.displayStatus = false;
      setTimeout(() => {
        this.panelResetData = this.getPanelData();
        this.$emit("apply", this.panelResetData);
        this.$emit("hide", this.panelResetData);
      }, 100);
    },
    handelCalendarInputDataChange() {
      const pannelData = this.getPanelData();
      this.$emit("dataChange", pannelData);
    },
    getPanelData() {
      const panelData = {
        listType: this.listType, // 'dynamic' 'static'
        timeLabel: this.timeRangeStr,
        timeRange: [...this.timeRange],
        recentDay: this.recentDay,
        compareRecentDay: this.compareRecentDay,
        isSomeDayToNowBtnUsed: this.isSomeDayToNowBtnUsed,
        isCompareSomeDayToNowBtnUsed: this.isCompareSomeDayToNowBtnUsed,
        isSomeDayToYestodayBtnUsed: this.isSomeDayToYestodayBtnUsed,
        isCompareSomeDayToYestodayBtnUsed:
          this.isCompareSomeDayToYestodayBtnUsed,
      };

      if (this.hasCompareAction && this.isCompareDateOpened) {
        panelData.compareTimeRange = [...this.compareTimeRange];
        panelData.compareTimeLabel = this.compareTimeLabel;
        panelData.compareType = this.compareType; // 0上一阶段  1自定义
      }

      //显式严格处理小时,避免设置最近过去n小时的影响
      if (!this.isHourMode) {
        this.setHoursOfTimeRange(panelData);
      }

      //获取过去几小时的数据 重新定义 rencentDay 和 compareRecentDay
      this.setRecentHourData(panelData);
      return panelData;
    },

    //显式严格处理小时,避免设置最近过去n小时的影响
    setHoursOfTimeRange(panelData) {
      if (this.hasCompareAction && this.isCompareDateOpened) {
        if (!this.hasHourTime) {
          panelData.compareTimeRange = [
            new Date(panelData.compareTimeRange[0].setHours(0, 0, 0)),
            new Date(panelData.compareTimeRange[1].setHours(23, 59, 59)),
          ];
        }
      }

      if (!this.hasHourTime) {
        panelData.timeRange = [
          new Date(panelData.timeRange[0].setHours(0, 0, 0)),
          new Date(panelData.timeRange[1].setHours(23, 59, 59)),
        ];
      }
    },
    setRecentHourData(panelData) {
      //获取过去几小时的数据 重新定义 rencentDay 和 compareRecentDay
      if (this.hasRecentHourAction) {
        if (this.isHourMode) {
          panelData.recentDay = `${this.recentHourEnd}-${this.recentHourStart}h`;
          // console.log(
          //   "this.recentHourStart:",
          //   this.recentHourStart,
          //   "this.recentHourEnd:",
          //   this.recentHourEnd
          // );
          // console.log(666);
          panelData.timeRange = [
            new Date(getPreTimeStrOfHours(this.recentHourStart)),
            new Date(getPreTimeStrOfHours(this.recentHourEnd, true)),
          ];

          panelData.timeLabel = this.getRecentHourLabelStr(
            this.recentHourStart,
            this.recentHourEnd
          );

          if (this.hasCompareAction && this.isCompareDateOpened) {
            panelData.compareRecentDay = `${this.compareRecentHourEnd}-${this.compareRecentHourStart}h`;
            panelData.compareTimeRange = [
              new Date(getPreTimeStrOfHours(this.compareRecentHourStart)),
              new Date(getPreTimeStrOfHours(this.compareRecentHourEnd, true)),
            ];
          }
        }
      }
    },
    getRecentHourLabelStr(startHour, endHour) {
      //最近n小时
      //过去n小时
      // 过去n小时- 过去n小时
      if (endHour === 0) {
        return `最近${startHour + 1}小时`;
      }
      if (endHour === 1) {
        return `过去${startHour}小时`;
      }
      return `过去${startHour}小时-过去${endHour}小时`;
    },

    //设置过去/最近n小时回显用值
    setDataForRecentHourTimeShow() {
      this.recentHourTime = {
        start: this.isCompareDateOpened
          ? this.compareRecentHourStart
          : this.recentHourStart,
        end: this.isCompareDateOpened
          ? this.compareRecentHourEnd
          : this.recentHourEnd,
      };
    },

    resetPannel(panelResetData) {
      // panelResetData = {
      //   timeRange: [
      //     new Date("2021/8/20 16:0:0"),
      //     new Date("2021/8/26 23:59:59"),
      //   ],
      //   compareTimeRange: [
      //     new Date("2021/8/20 18:0:0"),
      //     new Date("2021/8/25 23:59:59"),
      //   ],
      //   // compareTimeRange: [],
      //   // isCompareDateOpened: false,
      //   recentDay: "W0",
      //   compareRecentDay: "2-10",
      //   compareType: 0,
      //   listType: "dynamic",
      // };

      //重置listType
      this.listType = panelResetData.listType;

      this.isCompareDateOpened =
        Array.isArray(panelResetData.compareTimeRange) &&
        panelResetData.compareTimeRange.length > 0;

      const recentDay = panelResetData.recentDay;
      const compareRecentDay = panelResetData.compareRecentDay;

      //获取正常时间范围的按钮或具体日期
      //回显最近过去n小时的情况
      const isRecentHour =
        recentDay && recentDay[recentDay.length - 1].toLowerCase() === "h";
      const isRecentHourCompare =
        compareRecentDay &&
        compareRecentDay[compareRecentDay.length - 1].toLowerCase() === "h";

      if (!isRecentHour) {
        if (panelResetData.timeRange[0] instanceof Date) {
          this.startHourTime = panelResetData.timeRange[0].getHours();
        }
        if (panelResetData.timeRange[1] instanceof Date) {
          this.endHourTime = panelResetData.timeRange[1].getHours();
        }
      }

      this.startUseHourTime = this.startHourTime;
      this.endUseHourTime = this.endHourTime;

      //重置选中按钮(可能存在二次设置时首次的设置残留)
      this.buttonFocused = "";
      this.buttonFocusedCompare = "";
      this.buttonFocusedStore = "";

      if (this.isCompareDateOpened) {
        if (!isRecentHourCompare) {
          if (panelResetData.compareTimeRange[0] instanceof Date) {
            this.startCompareHourTime =
              panelResetData.compareTimeRange[0].getHours();
          }
          if (panelResetData.compareTimeRange[1] instanceof Date) {
            this.endCompareHourTime =
              panelResetData.compareTimeRange[1].getHours();
          }
        }

        this.startUseHourTime = this.startCompareHourTime;
        this.endUseHourTime = this.endCompareHourTime;
      }

      const getDates = (recentDay) => {
        const startEndStrArr = recentDay.split("-");
        const startDate = this.getDateBeforeNowAccordingDates(
          Number(startEndStrArr[1])
        );
        const endDate = this.getDateBeforeNowAccordingDates(
          Number(startEndStrArr[0])
        );
        return [startDate, endDate];
      };

      const resetNormalDynamicTime = () => {
        this.recentDay = panelResetData.recentDay;
        this.isCompareDateOpened = false;

        const currentBtn = this.sideBtns
          .filter((btn) => btn.visible)
          .find((btnItem) => {
            return btnItem.timeTag === recentDay;
          });

        this.isSomeDayToNowBtnUsed = panelResetData.fromSomeDayToNow;
        this.isSomeDayToYestodayBtnUsed = panelResetData.fromSomeDayToYestoday;

        //手动设置 ,时间范围的值; 完全新加载时 ,fromSomeDayToNow | fromSomeDayToYestoday的 qiuckButtonHandler  需要this.timerange有初始值
        let timeRange = getDates(recentDay);
        timeRange = this.setHourTimeOfTimeRange(
          timeRange,
          this.startHourTime,
          this.endHourTime
        );
        this.timeRange = timeRange;
        if (this.isSomeDayToNowBtnUsed) {
          const btnName = "fromSomeDayToNow";
          this.qiuckButtonHandler(btnName);
        } else if (this.isSomeDayToYestodayBtnUsed) {
          const btnName = "fromSomeDayToYestoday";

          this.qiuckButtonHandler(btnName);
        } else if (currentBtn) {
          this.qiuckButtonHandler(currentBtn.name);
        } else {
          this.setDisplayTimeString(timeRange);
        }

        // if (this.isSomeDayToNowBtnUsed) {
        //   const btnName = "fromSomeDayToNow";
        //   this.qiuckButtonHandler(btnName);
        // }

        // if (this.isSomeDayToYestodayBtnUsed) {
        //   const btnName = "fromSomeDayToYestoday";
        //   this.qiuckButtonHandler(btnName);
        // }

        ////数据回传时回显时触发显示,需要根据至某日至今类型的判断 (应为既设置时间又设置qiuckButtonHandler)
        ////输出自某日至今时应保存一个状态记录设置 点击应用时设置 n-0至
      };

      const resetNormalStaticTime = () => {
        this.isCompareDateOpened = false;
        this.timeRange = panelResetData.timeRange;
        //StartToNow
        const isFromSomeDayToNow =
          panelResetData.recentDay &&
          panelResetData.recentDay.toLowerCase() === "starttonow";

        const isFromSomeDayToYestoday =
          panelResetData.recentDay &&
          panelResetData.recentDay.toLowerCase() === "starttoyestoday";

        if (isFromSomeDayToNow) {
          this.recentDay = "StartToNow";
          const todayDateTime = this.getNewDate(this.nowDate);
          this.timeRange = this.setHourTimeOfTimeRange(
            [this.timeRange[0], todayDateTime],
            this.startHourTime,
            this.endHourTime
          );

          // this.setDisplayTimeString(this.timeRange);
          this.buttonFocused = "fromSomeDayToNow";
          this.qiuckButtonHandler("fromSomeDayToNow");
        } else if (isFromSomeDayToYestoday) {
          this.recentDay = "StartToYestoday";
          const yestoday = this.getDateBeforeNowAccordingDates(1);
          this.timeRange = this.setHourTimeOfTimeRange(
            [this.timeRange[0], yestoday],
            this.startHourTime,
            this.endHourTime
          );

          // this.setDisplayTimeString(this.timeRange);
          this.buttonFocused = "fromSomeDayToYestoday";
          this.qiuckButtonHandler("fromSomeDayToYestoday");
        } else {
          //this.resetQuickSetButton(this.timeRange);

          this.setDisplayTimeString(this.timeRange);
          this.buttonFocused = "";
          this.buttonFocusedCompare = "";
        }
      };

      const resetCompareDynamicTime = () => {
        this.compareRecentDay = panelResetData.compareRecentDay;
        this.isCompareDateOpened = true;
        this.buttonFocusedStore = this.buttonFocused;
        this.buttonFocused = "";
        this.isCompareSomeDayToNowBtnUsed =
          panelResetData.compareFromSomeDayToNow;

        this.isCompareSomeDayToYestodayBtnUsed =
          panelResetData.compareFromSomeDayToYestoday;

        // console.log("buttonFocused:", this.buttonFocused);

        //上一阶段对比产生的时间定义
        const cRecentDayDict = {};
        for (let prop in this.compareRecentDayDict) {
          cRecentDayDict[this.compareRecentDayDict[prop]] = prop;
        }
        const operationName = cRecentDayDict[compareRecentDay];

        if (operationName) {
          const timeRange = this[operationName]();

          this.compareTimeRange = this.setHourTimeOfTimeRange(
            timeRange,
            this.startCompareHourTime,
            this.endCompareHourTime
          );
          //时间标签和选中按钮
          this.compareTimeLabel = this.compareTimeLabelDict[operationName];
          const btnsdict = {
            ctoday: "yestoday",
            cthisWeek: "lastWeek",
            cthisMonth: "lastMonth",
          };
          this.buttonFocusedCompare = btnsdict[operationName];
        } else {
          //
          const timeRange = getDates(compareRecentDay);
          this.compareTimeRange = this.setHourTimeOfTimeRange(
            timeRange,
            this.startCompareHourTime,
            this.endCompareHourTime
          );
          this.setDisplayTimeString(timeRange);
        }

        if (this.isCompareSomeDayToNowBtnUsed) {
          const btnName = "fromSomeDayToNow";
          // const needResetCompareType = false;

          this.qiuckButtonHandler(btnName);
          this.compareType = panelResetData.compareType;

          return;
        }

        if (this.isCompareSomeDayToYestodayBtnUsed) {
          const btnName = "fromSomeDayToYestoday";

          this.qiuckButtonHandler(btnName);
          this.compareType = panelResetData.compareType;
          return;
        }

        //常规按钮产生的时间定义
        const currentBtn = this.sideBtns
          .filter((btn) => btn.visible)
          .find((btnItem) => {
            return btnItem.timeTag === compareRecentDay;
          });
        if (currentBtn) {
          this.qiuckButtonHandler(currentBtn.name);
        }

        this.compareType = panelResetData.compareType;
      };

      const resetCompareStaticTime = () => {
        this.isCompareDateOpened = true;
        this.compareTimeRange = panelResetData.compareTimeRange;

        const isFromSomeDayToNow =
          panelResetData.compareRecentDay.toLowerCase() === "starttonow";
        const isFromSomeDayToYestoday =
          panelResetData.compareRecentDay.toLowerCase() === "starttoyestoday";

        if (isFromSomeDayToNow) {
          this.compareRecentDay = "StartToNow";

          const todayDateTime = this.getNewDate(this.nowDate);
          this.compareTimeRange = this.setHourTimeOfTimeRange(
            [this.compareTimeRange[0], todayDateTime],
            this.startCompareHourTime,
            this.endCompareHourTime
          );

          this.buttonFocusedStore = this.buttonFocused;
          this.buttonFocusedCompare = "fromSomeDayToNow";
          this.qiuckButtonHandler("fromSomeDayToNow");
        } else if (isFromSomeDayToYestoday) {
          this.compareRecentDay = "StartToYestoday";

          const yestoday = this.getDateBeforeNowAccordingDates(1);
          this.compareTimeRange = this.setHourTimeOfTimeRange(
            [this.compareTimeRange[0], yestoday],
            this.startCompareHourTime,
            this.endCompareHourTime
          );

          this.buttonFocusedStore = this.buttonFocused;
          this.buttonFocusedCompare = "fromSomeDayToYestoday";
          this.qiuckButtonHandler("fromSomeDayToYestoday");
        } else {
          // this.resetQuickSetButton(this.compareTimeRange);
          this.setDisplayTimeString(this.compareTimeRange);
        }
        //对比类型 自定义
        this.compareType = panelResetData.compareType;
      };

      //重置设置的对比时间数据
      const clearCompareTime = () => {
        this.compareTimeRange = [];
        this.compareRecentDay = "";
        this.buttonFocusedStore = "";
        this.buttonFocusedCompare = "";
      };

      const setRecentHourTimeData = (recentDay, compareRecentDay) => {
        if (recentDay) {
          recentDay = recentDay.toLowerCase().replace("h", "");
          const recentHour = recentDay.split("-");
          this.recentHourEnd = Number(recentHour[0]);
          this.recentHourStart = Number(recentHour[1]);

          this.compareTimeLabel = this.getRecentHourLabelStr(
            this.compareRecentHourStart,
            this.compareRecentHourEnd
          );

          //设置输出的显示时间
          this.timeRangeStr = this.getRecentHourLabelStr(
            this.recentHourStart,
            this.recentHourEnd
          );
        }
        if (compareRecentDay) {
          compareRecentDay = compareRecentDay.toLowerCase().replace("h", "");
          const cRecentHour = compareRecentDay.split("-");

          this.compareRecentHourEnd = Number(cRecentHour[0]);
          this.compareRecentHourStart = Number(cRecentHour[1]);

          //设置对比的显示时间
          this.compareTimeLabel = this.getRecentHourLabelStr(
            this.compareRecentHourStart,
            this.compareRecentHourEnd
          );
        }
      };

      if (isRecentHour) {
        //初始化最近过去n小时显示
        setRecentHourTimeData(recentDay, compareRecentDay);
        this.isHourMode = true;
        //设置回显的使用值
        this.setDataForRecentHourTimeShow();

        this.buttonFocused = "hourSet";
        if (this.isCompareDateOpened) {
          this.buttonFocusedCompare = "hourSet";
        }
        //补充日期数据以备切换到日期使用(自末日至今)
        this.timeRange = panelResetData.timeRange;
      } else {
        //重置前需要重置对比时间的数据,原因是如过重置没有对比数据时,对比时间的数据会保留导致继续显示
        clearCompareTime();
        if (!this.isCompareDateOpened) {
          if (this.listType === "dynamic") {
            resetNormalDynamicTime();
          }
          if (this.listType === "static") {
            resetNormalStaticTime();
          }
        } else {
          if (this.listType === "dynamic") {
            resetNormalDynamicTime();
            resetCompareDynamicTime();
          }
          if (this.listType === "static") {
            resetNormalStaticTime();
            resetCompareStaticTime();
          }
        }
      }
    },
  },

  created() {
    // 首次载入初始化应用过去30天
    if (this.isAutoTriggerApplyTimeEvent) {
      this.apply();
    }
  },
  mounted() {
    this.$refs["pannel"].style.maxWidth = window.innerWidth + "px";
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$btnSectionWidth: 136px;
$btnSectionMarginLeft: 20px;
.pannel-content-section {
  width: 100%;
  height: auto;
  overflow-x: auto;

  .left-btn-section {
    width: $btnSectionWidth;
    margin-left: $btnSectionMarginLeft;
    float: left;

    .fastsettor {
      width: 100%;
      color: #323234;
      text-align: center;
      font-size: 12px;
      line-height: 32px;
      margin-top: 34px;
      flex-shrink: 0;

      &__small {
        width: 62px;
        height: 28px;
        line-height: 26px;

        float: left;
        margin-bottom: 8px;

        background-color: #f5f7fa;
        border: 1px solid #f5f7fa;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        &:nth-child(even) {
          margin-left: 6px;
        }
      }

      &__big {
        width: 130px;
        height: 29px;
        line-height: 26px;
        float: left;
        margin-bottom: 9px;

        background-color: #f5f7fa;
        border: 1px solid #f5f7fa;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
      }
    }

    .sidebtn-focus {
      border-color: rgba(89, 120, 249, 0.5);
      color: #5f7ada;
    }

    .sidebtn-focus-compare {
      border-color: rgba(255, 167, 86, 0.5);
      color: rgb(240, 146, 57);
    }
  }

  .right-calendar-section {
    margin-left: 164px;
    // padding: 0 20px 0 20px;
    width: 535px;

    .calendar-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      // height: 300px;

      .timer {
        text-align: center;
        font-size: 14px;

        .timer-label {
          color: rgb(61, 144, 255);
        }
      }

      .timer-start {
        height: 18px;
        width: 228px;
        line-height: 18px;
        margin: 8px 0;
      }
      .timer-end {
        height: 18px;
        width: 228px;
        line-height: 18px;
        margin: 8px 0;
      }
    }

    .bottom-section {
      border-top: 1px solid #efefef;
      box-sizing: border-box;
      width: 100%;
      height: 48px;
      padding: 8px 3px;
      margin-top: 15px;
      line-height: 32px;
      text-align: right;
      display: flex;
      justify-content: space-between;
      overflow-x: auto;

      .bottomsection-left {
        text-align: left;
        float: left;
        flex-shrink: 0;
        margin-right: 5px;
      }

      .bottomsection-right {
        text-align: right;
        float: right;
        flex-shrink: 0;
      }

      .bottomsection-compareselect {
        margin-left: 10px;
        width: 100px;
      }

      .bottomsection-comparetext {
        display: inline-block;
        margin: 4px 0 4px 8px;
        padding: 0 12px;
        color: #606265;
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        background-color: #f5f7fa;
        border-radius: 20px;
        margin-right: 10px;
      }
    }
  }
}

.slide-fade-enter-active {
  transform-origin: center top;
  animation: slideDownIn 0.2s ease-out both;
}

.slide-fade-leave-active {
  transform-origin: center top;
  animation: slideDownIn 0.2s reverse ease-in both;
}

@keyframes slideDownIn {
  0% {
    transform: scaleY(0.5);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}

.pannel {
  font-family: "TA-Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  color: #42546d;
  width: 708px;
  min-height: 380px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

  overflow: hidden;

  &__hiddeninput {
    width: 0;
    height: 0;
    opacity: 0;
  }

  &__content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    min-height: 285px;
    padding: 10px 24px 16px;
    overflow: auto;

    &-timer {
      &-start {
        height: 18px;
        width: 228px;
        line-height: 18px;
        margin: 8px 0;
      }
      &-end {
        height: 18px;
        width: 228px;
        line-height: 18px;
        margin: 8px 0;
      }
      & .timer-label {
        color: rgb(61, 144, 255);
      }
    }
  }

  &__topsection {
    height: 45px;
    width: 100%;
    border-bottom: 1px solid #efefef;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow-x: auto;
    padding-right: 15px;

    &-label {
      display: inline-block;
      height: 44px;
      margin-left: 16px;
      padding: 0 16px;
      color: #666;
      line-height: 42px;
      text-align: center;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      flex-shrink: 0;

      &.focus {
        color: #1890ff;
        border-bottom: 1px solid #1890ff;
      }
    }

    &-timetext {
      display: inline-block;
      margin-left: 60px;
      color: #919191;
      flex-shrink: 0;
    }
  }
}
</style>
–
