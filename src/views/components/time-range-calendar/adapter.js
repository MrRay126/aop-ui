export function timeApiDataToLocal(time) {
  const calendarPanelData = {
    timeRange: [],
    compareTimeRange: [],
    isCompareDateOpened: false,
    compareType: 0,
    listType: "dynamic",
    recentDay: "",
    compareRecentDay: "",
    fromSomeDayToNow: false,
    compareFromSomeDayToNow: false,
    fromSomeDayToYestoday: false,
    compareFromSomeDayToYestoday: false,
  };
  calendarPanelData.listType = time.type === "relative" ? "dynamic" : "static";

  //转化时间字符串日期中 - 为 / 兼容safri
  calendarPanelData.timeRange = [
    time.start ? new Date(time.start.replaceAll("-", "/")) : undefined,
    time.end ? new Date(time.end.replaceAll("-", "/")) : undefined,
  ];

  calendarPanelData.recentDay = time.recent_day;

  calendarPanelData.fromSomeDayToNow = time.from_some_day_to_now ? true : false;
  calendarPanelData.compareFromSomeDayToNow = time.compare_from_some_day_to_now
    ? true
    : false;

  calendarPanelData.fromSomeDayToYestoday = time.from_some_day_to_yestoday
    ? true
    : false;
  calendarPanelData.compareFromSomeDayToYestoday =
    time.compare_from_some_day_to_yestoday ? true : false;

  if (time.checked) {
    calendarPanelData.compareRecentDay = time.contrast.recent_day;
    const cStart = time.contrast.start;
    const cEnd = time.contrast.end;
    calendarPanelData.isCompareDateOpened = true;

    calendarPanelData.compareType = time.contrast.type === "stage" ? 0 : 1;

    calendarPanelData.compareTimeRange = [
      cStart ? new Date(cStart) : undefined,
      cEnd ? new Date(cEnd) : undefined,
    ];

    // ? this.getTimeRangeFromDynamicNumber(Number(cStart), Number(cEnd))
    // : this.getTimeRangeFromDateStr(cStart, cEnd);
  }
  return calendarPanelData;
}

export function timeLocalDataToApi(
  timeData,
  options = { hasCompareAction: true }
) {
  // 获取常规时间信息
  const time = {};
  time.type = timeData.listType === "dynamic" ? "relative" : "absolute";
  time.start = getDateString(timeData.timeRange[0]);
  time.end = getDateString(timeData.timeRange[1]);
  time.recent_day = timeData.recentDay;

  time.from_some_day_to_now = timeData.isSomeDayToNowBtnUsed;
  time.compare_from_some_day_to_now = timeData.isCompareSomeDayToNowBtnUsed;
  time.from_some_day_to_yestoday = timeData.isSomeDayToYestodayBtnUsed;
  time.compare_from_some_day_to_yestoday =
    timeData.isCompareSomeDayToYestodayBtnUsed;

  if (options.hasCompareAction) {
    // 获取对比时间信息
    time.checked =
      Array.isArray(timeData.compareTimeRange) &&
      timeData.compareTimeRange.length > 0;

    const contrastTime = {};
    if (time.checked) {
      contrastTime.recent_day = timeData.compareRecentDay;

      contrastTime.type = timeData.compareType === 0 ? "stage" : "custom";

      contrastTime.start = getDateString(timeData.compareTimeRange[0]);
      contrastTime.end = getDateString(timeData.compareTimeRange[1]);
    }
    time.contrast = contrastTime;
  }

  return time;
}

export function getDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
}
