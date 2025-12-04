export const lastSevenDays = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
export const last31Days = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
export const lastOneDay = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

export const lastSixDays = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
export const today = new Date();
// 获取日期字符串
function getDateStr(date, isStart = true) {
  const endTime = isStart ? "0:0:0" : "23:59:59";
  return `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${endTime}`;
}

export default {
  "1-7": {
    start: getDateStr(lastSevenDays),
    end: getDateStr(lastOneDay, false),
  },
  "0-6": {
    start: getDateStr(lastSixDays),
    end: getDateStr(today, false),
  },
    "1-31":{
        start: getDateStr(last31Days),
        end: getDateStr(lastOneDay, false),

    }
};
