//根据时间值获取日期字符串
export function getPreTimeStrOfHours(hourCount, isEndHour) {
  const backTime = hourCount * 60 * 60 * 1000;
  const toTime = Date.now() - backTime;
  const date = new Date(toTime);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dateTime = String(date.getDate()).padStart(2, "0");
  let hour = date.getHours();
  // hour = hour + (isEndHour ? 1 : 0);
  hour = String(hour).padStart(2, "0");
  return `${year}/${month}/${dateTime} ${hour}:${isEndHour ? "59" : "00"}`;
}
