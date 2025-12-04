//元数据管理
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
  //数据监控 请求监控图表
  {
    url: "/meta/charts",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: {
          //数据监控
          dataWatch: {
            dimensions: ["product", "2015"],
            source: [
              { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
              { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
              { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
              { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
            ],
            collectCount: 1000, //采集数量
            storedCount: 1000, // 入库数量
          },

          //请求监控
          requestWatch: {
            dimensions: ["product", "2015"],
            source: [
              { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
              { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
              { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
              { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
            ],
            requestCount: 1000, //请求数量
            finishCount: 100, //完成数量
          },
        },
      };
    },
  },

  //字段管理列表
  {
    url: "/meta/fields/table",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: {
          //数据监控
          results: genOptions(10, (index) => {
            return {
              name: "field" + index,
              displayName: "字段" + index,
              fieldType: pluckRandom(["number", "string"]),
              comment: "备注内容",
            };
          }),
          pager: { total: 100 },
          filterOptions: {
            fieldType: [
              { label: "文本", value: "string" },
              { label: "数值", value: "number" },
            ],
          },
        },
      };
    },
  },
  {
    url: "/meta/channels",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: [
          {
            label: "导航1",
            value: "0",
            children: [
              { label: "子导航1", value: "1" },
              { label: "子导航2", value: "2" },
            ],
          },
          {
            label: "导航2",
            value: "3",
          },
        ],
      };
    },
  },
];
