// 热词管理
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
    url: "/api/hotwords/",
    method: "get",
    handler: async (ctx) => {
      console.log("request body is:", ctx.request.boody);
      await delay(1000);

      ctx.body = {
        code: 0,
        message: "",
        data: {
          total: 11,
          results: genOptions(10, (index) => {
            const permType = pluckRandom([1, 2, 3]);
            return {
              id: index,
              name: "热词" + index,
              comment: "33333333333",
              creator: "yimeng.liu",
              createTime: "2022/12/24 23:00:00",
              updateTime: "2022/12/24 23:00:00",
              alias: genOptions(10, (index) => {
                return {
                  id: 96,
                  name: "alias" + index,
                };
              }),
              perms: {
                edit: true,
                remove: pluckRandom([true, false]),
              },

              permission: {
                type: permType,
                values: permType === 3 ? pluckSome([4, 6, 7, 8, 9, 10]) : [],
              },
            };
          }),

          filterOptions: {
            creator: [
              {
                label: "yunong.liu",
                value: 7,
              },
              {
                label: "mingxun.xie",
                value: 6,
              },
              {
                label: "lijun.zhang",
                value: 4,
              },
              {
                label: "yimeng.liu",
                value: 16,
              },
              {
                label: "xue.han",
                value: 21,
              },
              {
                label: "jay.li",
                value: 8,
              },
            ],
          },
        },
      };
    },
  },

  // 删除热词
  {
    url: "/api/hotwords/deletebyids",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: null,
      };
    },
  },

  {
    url: "/api/hotwordgroups/",
    method: "get",
    handler: async (ctx) => {
      console.log("request body is:", ctx.request.boody);
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: {
          pager: {
            total: 11,
          },

          results: genOptions(10, (index) => {
            return {
              id: index,
              name: "热词组" + index,
              creator: "yimeng.liu",
              createTime: "2022/12/24 23:00:00",
              members: [{ id: 6, name: "你推" }],
              alias: [{ id: 96, name: "33333" }],
              perms: {
                edit: true,
                remove: pluckRandom([true, false]),
              },
              comment: "备注注释",
              permission: { type: 3, values: [4] },
            };
          }),

          filterOptions: {
            creator: [
              {
                label: "yunong.liu",
                value: 7,
              },
              {
                label: "mingxun.xie",
                value: 6,
              },
              {
                label: "lijun.zhang",
                value: 4,
              },
              {
                label: "yimeng.liu",
                value: 16,
              },
              {
                label: "xue.han",
                value: 21,
              },
              {
                label: "jay.li",
                value: 8,
              },
            ],
          },
        },
      };
    },
  },
];

//创建词
// url: "/api/hotwords/",

//删除词
// url: "/api/hotwords/deletebyids",

// 修改词
// url: "/api/hotwords/",

// 获取词的table列表数据
// url: "/api/hotwords/",

// 创建词组
// url: "/api/hotwordgroups/",

// 删除词组
// url: "/api/hotwordgroups/deletebyids",

// 修改词组
// url: "/api/hotwordgroups/",

// 获取词组的table列表数据
// url: "/api/hotwordgroups/",

// getWordMemberOptions
//  url: "/api/hotwords/",

// getUsers
//  url: "/api/users",

//getWordTypeList
// url: "/api/wordtypes/",

//获取停用词列表
//   url: "/api/disabledwords/",

// saveStopWordList
// url: "/api/disabledwords/",
