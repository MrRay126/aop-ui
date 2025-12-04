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
    url: "/api/tasks/:downloadtype/download/",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: { id: 1 },
      };
    },
  },

  {
    url: "/api/tasks/:id/state/",
    method: "get",
    handler: async (ctx) => {
      console.log(ctx.request.params.id);
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",

        data: {
          url: `http://localhost:3000/export/file/${ctx.params.id}`,
          status: "success",
        },
      };
    },
  },
];

// 舆情分析 分析详情 预警分析等下载
// const url = `/api/tasks/${data.urlParams.download_type}/download/`;

////下载任务的状态判断,  // PENDING = 0, _('pending') PROCESSING = 1, _('processing') SUCCESS = 2, _('success') FAILED = 3, _('failed') CANCEL = 4, _('cancel')
// url: `/api/tasks/${id}/state/`,
