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
exports.routes = [
  {
    url: "/api/ai/summary",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);

      ctx.body = {
        code: 0,
        data: {
          state: "success", // success failed running
          errorMsg: "错误信息错误信息错误信息错误信息错误信息错误信息错误信息",
          taskId: 6,
          data: "<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>",
        },
        message: "",
      };
    },
  },
  {
    url: "/api/ai/summary/byid",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);

      ctx.body = {
        code: 0,
        data: {
          summary: {
            state: "running", // success failed running
            errorMsg:
              "错误信息错误信息错误信息错误信息错误信息错误信息错误信息",
            taskId: 6,
            data: "<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>,<span>整体氛围:<br/>总体活跃且积极,总体活跃且积极<br/>总体活跃且积极总体活跃且积极,总体活跃且积极,总体活跃且积极总体活跃且积极</span>",
          },

          time: {
            type: "absolute", // absolute|relative 绝对时间|相对时间
            start: "2020/11/1 0:0:0", //开始时间字符串
            end: "2022/11/7 23:59:59",
            recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
          },

          filter: {
            value: "",
            filters: {
              relTag: "and",
              children: [
                {
                  id: "3f5084d4-1a07-426a-def8-a46e70db0f6f",
                  key: "id",
                  relation: "eq",
                  value: ["4947275568644481", "666"],
                },
              ],
            },
          },
        },
        message: "",
      };
    },
  },
];
