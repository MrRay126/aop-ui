// 报表管理
const { require, baseUrl } = exports;
const path = require("path");
// const fs = require("fs");
// const multipart = require("connect-multiparty");
// var multipartMiddleware = multipart();

const {
  randomNumber,
  pluckRandom,
  pluckSome,
  genOptions,
  delay,
} = require("./utils/index.js");
// const requireFile = require("./utils/require.js");
const dataPath = path.join(baseUrl, "../data.js");
// const data = requireFile(dataPath);
// const { noGoalNoAbData, noGoalHasAbData, goalAndAbData, goalsNoAbData } = data;
// console.log('createFile:',)
exports.dataPaths = [dataPath];
exports.routes = [];

// getReportsTableData
// url: "/api/reports/search",

// 保存报表
// url: "/api/reports/",

// 获取报表的配置数据
//  url: `/api/reports/${params.id}`,

// 删除报表
// url: `/api/reports/`; //delete

// 创建异步任务
//  url: `/api/tasks/`
