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
    url: "/api/ds/q/authors",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: [
          {
            value: "4895150305968738",
          },
        ],
        message: "",
      };
    },
  },
];
