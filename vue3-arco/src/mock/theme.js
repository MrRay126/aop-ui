// 话题分析

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

//getKeyWordTableData
// url: "/api/ds/q/topic",

//getDispositionTableData
// url: "/api/ds/q/topic-word",

//getDetailTableData
// url: "/api/ds/q/topic-content",

//获取热词选项
//  url: "/api/search/labels/",

// 获取热词组选项
//url: "/api/search/labels/",
