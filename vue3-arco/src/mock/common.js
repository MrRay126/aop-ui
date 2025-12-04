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
exports.routes = [
  //重命名
  {
    url: "/rename/collect/filter",
    method: "put",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: null,
        message: "",
      };
    },
  },
  //删除
  {
    url: "/delete/collect/filter",
    method: "delete",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: null,
        message: "",
      };
    },
  },
  //获取数据列表
  {
    url: "/get/collect/filter/data",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);

      const titles = [
        "简短指标标题",
        "收藏中等长度的标题内容",
        "收藏指标的较长长度的标题文字类型的收藏标题",
        "超长收藏指标的较长长度的标题文字类型的收藏标题超长收藏指标的较长长度的标题文字类型的收藏标题",
      ];
      ctx.body = {
        code: 0,
        data: genOptions(20, (index) => {
          return {
            id: 0,
            title: pluckRandom(titles),
            filterData: {
              relTag: "and",
              children: [
                {
                  id: "8ed756b6-8c8b-4e2f-8ad9-d9e44e7e1b28",
                  key: "id",
                  relation: "eq",
                  value: ["4944496938190573"],
                },
              ],
            },
          };
        }),
        message: "",
      };
    },
  },

  //获取数据列表
  {
    url: "/save/collect/filter/data",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: null,
        message: "",
      };
    },
  },
];
