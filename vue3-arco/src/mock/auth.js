//sso跳转地址 (需redirect 直接跳转到首页)
// url: "/sso/login",

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
  //正常的逻辑时跳转sso登陆,sso回跳后设置token,  此处不返回登陆正确sso地址 直接设置token
  {
    url: "/sso/login",
    method: "get",
    handler: async (ctx) => {
      await delay(200);

      ctx.cookies.set("access_token", "access_token_value");
      ctx.body = {
        code: 0,
        message: "",
        data: { url: "" },
      };
    },
  },

  {
    url: "/api/profile/",
    method: "get",
    handler: async (ctx) => {
      await delay(200);
      ctx.body = {
        code: 0,
        message: "",
        data: {
          id: 0,
          description: "座右铭",
          username: "lijun.zhang",
          displayName: "张立君",
          phone: "1512345672",
          email: "werrew@happy.cn",
          roles: [
            "root", // root: "root管理员", admin: "管理员", analyst: "分析师", project_member: "项目成员",
          ],
        },
      };
    },
  },

  ///login
  {
    url: "/login",
    method: "post",
    handler: async (ctx) => {
      await delay(200);
      ctx.body = {
        code: pluckRandom([0, 1]),
        message: "登录失败:用户名或密码错误",
        data: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        },
      };
    },
  },
];
