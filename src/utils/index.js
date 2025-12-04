export default {
  getUrlKey: function (name) {
    // eslint-disable-next-line no-sparse-arrays
    return (
      decodeURIComponent(
        (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
          location.href
        ) || ["", ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  },
};
/**
 * 获取指定时间在当年的第几周
 * @param {Date} time
 */
export function getWeek(time) {
  let date = time;
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let d1 = new Date(year, month, day);
  let d2 = new Date(year, 0, 1);
  let d = Math.round((d1.valueOf() - d2.valueOf()) / 86400000);
  let week = Math.ceil((d + d2.getDay()) / 7);
  return week;
}

/**
 * 获取指定时间在当年的第几季度
 * @param {Date} time
 */
export function getQuarter(time) {
  let date = time;
  let month = date.getMonth();
  return Math.ceil((month + 1) / 3);
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object" && time instanceof Date) {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(), // 一周的第几天
    w: getWeek(date), // 在一年中的第几周
    q: getQuarter(date), // 在一年中的第几季度
  };
  const time_str = format.replace(/{([ymdhisawq])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * 判断是否有效的日期类型
 * @param {Date} date
 * @returns true是有效的日期型|false表示无效的日期型
 */
export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
      '"}'
  );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}
// export function simpleDeepClone(source) {
//   return JSON.parse(JSON.stringify(source));
// }
/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + "";
  const randomNum = parseInt((1 + Math.random()) * 65536) + "";
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * 动态加载js
 * @param {String} url
 */
export const loadJs = (url) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";
    document.body.appendChild(script);
    script.onload = () => {
      resolve();
    };
  });
};

/**
 * 动态加载css
 * @param {String} url
 */
export const loadCss = (url) => {
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
    link.onload = () => {
      resolve();
    };
  });
};

/**
 * uuid
 */
export const uuid = () => {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
    }
  );
  return uuid;
};

/**
 * 判断对象是否有效
 * @param {Object} v
 */
export const isDef = (v) => {
  return v !== undefined && v !== null;
};

/**
 * 判断对象是否无效
 * @param {Object} v
 */
export const isUndef = (v) => {
  return v === undefined || v === null;
};

/**
 * 如果v无效返回d，否则返回v
 * @param {Object} v
 * @param {Object} d
 */
export const isUndefValue = (v, d) => {
  return isDef(v) ? v : isDef(d) ? d : "";
};

/**
 * json的对象复制
 * @param {Object} v
 */
export const cloneObject = (v) => (v ? JSON.parse(JSON.stringify(v)) : v);

/**
 * 向localStorage中保存内容
 */
export function save(name, value) {
  window.sessionStorage.setItem(name, value);
}

/**
 * 读取localStorag中的内容
 */
export function read(name) {
  return window.sessionStorage.getItem(name);
}

export function readOnce(name) {
  const value = window.sessionStorage.getItem(name);
  window.sessionStorage.removeItem(name);
  return value;
}

/**
 * 根据key删除localStorage中的内容
 */
export function remove(name) {
  window.sessionStorage.removeItem(name);
}

/**
 * 判断是否为一个有效的数组
 * @param {any} value
 */
export function validArray(value) {
  let flag = false;
  if (value && Array.isArray(value) && value.length > 0) {
    flag = true;
  }
  return flag;
}

/**
 * 判断变量是否为有效的数字型
 * @param {any} num
 */
export function isNum(num) {
  return typeof num === "number" && !isNaN(num);
}

export function format(value, ...args) {
  return require("util").format(value, args);
}

export function export2excel(res) {
  let cd = res.headers["content-disposition"];
  let name = cd.substr(cd.indexOf("filename=") + 9);
  let blob = new Blob([res.data]);
  let downloadElement = document.createElement("a");
  downloadElement.style.display = "none";
  let href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = name;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
}

export function exportByUrl(url) {
  let downloadElement = document.createElement("a");
  downloadElement.style.display = "none";
  downloadElement.href = url;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
}

export function date(tz = 8, dt = "") {
  tz ||= "Etc/GMT-8"; //表示东八区;
  if (typeof tz === "string") {
    let pos = tz.indexOf("GMT");
    if (pos > -1) {
      tz = tz.substring(pos + 3);
      tz = parseInt(tz);
      tz = -tz;
    } else {
      throw new Error("TimeZone Is Error");
    }
  }
  let offset = (dt ? new Date(dt) : new Date()).getTimezoneOffset();
  let date = (dt ? new Date(dt) : new Date()).getTime();
  let out = new Date(date + offset * 60 * 1000 + tz * 60 * 60 * 1000);
  return out;
}

// 可用的值 非空值判断
export function isUsefulValue(value) {
  return typeof value !== "undefined" && value !== "" && value !== null;
}

// 枚举值,转化为list
export function getLabelvalueList(dict, isStringValue = false) {
  const list = [];
  for (let prop in dict) {
    list.push({
      label: dict[prop],
      value: isStringValue ? prop : Number(prop),
    });
  }
  return list;
}

// bool类型的枚举值,转化为list
export function getLabelvalueListOfBool(dict) {
  const list = [];
  for (let prop in dict) {
    list.push({
      label: dict[prop],
      value: prop === "true" ? true : false,
    });
  }
  return list;
}

// 反转dict名值对
export function getLabelMap(obj, isStringValue = false) {
  const dict = {};
  for (let prop in obj) {
    dict[obj[prop]] = isStringValue ? prop : Number(prop);
  }
  return dict;
}
