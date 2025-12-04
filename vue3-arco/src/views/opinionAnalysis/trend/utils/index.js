//时间范围大于30天时,去掉 “小时” 时间单位
export function getTimeUnitOptions(data) {
  let unitOptions = [];
  const dateCount =
    (new Date(data.end) - new Date(data.start)) / (24 * 60 * 60 * 1000);

  if (dateCount > 30) {
    unitOptions = [
      { label: "按天", unit: "day" },
      { label: "按周", unit: "week", weekStart: 0 },
      { label: "按月", unit: "month" },
      { label: "合计", unit: "sum" },
    ];
  } else {
    unitOptions = [
      { label: "按天", unit: "day" },

      {
        label: "按小时",
        unit: "hour",
      },
      { label: "按周", unit: "week", weekStart: 0 },
      { label: "按月", unit: "month" },
      { label: "合计", unit: "sum" },
    ];
  }
  return unitOptions;
}
