// 个人信息

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
  // 获取用户信息
  // url: "/api/profile/",

  // 权限详情
  // url: "/api/permissions/",

  // 修改用户信息
  // url: "/api/profile/",

  //
  {
    url: "/password",
    method: "put",
    handler: async (ctx) => {
      await delay(1000);

      ctx.body = {
        code: 0,
        message: "修改成功!",
        data: null,
      };
    },
  },
];
