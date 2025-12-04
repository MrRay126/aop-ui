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
  //markdown 数据
  {
    url: "/instruction/markdowntext",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: "# 一级标题\n##二级标题",
      };
    },
  },
  //数据集成table
  {
    url: "/integration/tabledata",
    method: "get",
    handler: async (ctx) => {
      const contentList = genOptions(10, (index) => {
        return {
          // isViewContent: false,
          id: index,
          logoPicture: "",
          channelTag: "渠道标识" + index,
          channelName: "新浪微博" + index,
          isConnected: pluckRandom([true, false]), // 是否接入
          connectedContents: ["#微博", "#用户信息", "#评论"],

          contentTypes: pluckSome([
            {
              id: 0,
              contentType: "博客",
              comment: "备注内容备注内容",
            },
            {
              id: 1,
              contentType: "评论",
              comment:
                " 评论的备注内容备注内容  评论的备注内容备注内容  评论的备注内容备注内容  评论的备注内容备注内容  评论的备注内容备注内容 ",
            },

            {
              id: 1,
              contentType: "博客转发",
              comment: "博客转发的备注内容备注内容",
            },
            {
              id: 1,
              contentType: "用户信息",
              comment: "用户信息的备注内容备注内容",
            },
          ]),
        };
      });

      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: { results: contentList, pager: { total: 100 } },
      };
    },
  },
  // 获取规则table数据表
  {
    url: "/rules/tabledata",
    method: "get",
    handler: async (ctx) => {
      console.log(ctx.request.body);
      const tableData = genOptions(10, (index) => {
        return {
          id: index,
          contentType: pluckRandom(["博客", "b站", "其他"]),
          taskName: "任务名称" + index,
          ruleParam: "{采集关键字:saki,页数:1}",
          etlPeriod: pluckRandom(["week", "day", "hour", "minute"]),
          configTime: "2020-10-20 12:00:00",
          status: pluckRandom(["stoped", "processing", "done"]),
        };
      });
      await delay(1000);
      ctx.body = {
        code: 1,
        message: "",
        data: { results: tableData, pager: { total: 100 } },
      };
    },
  },

  //获取配置规则 新增或编辑时的配置数据
  ///rule/config
  {
    url: "/rule/config",
    method: "get",
    handler: async (ctx) => {
      const rules = {
        contentType: "微博",
        logo: "",
        ruleList: genOptions(3, (index) => {
          return {
            label: "关键字搜索" + index,
            type: "list", // list || detail
            configs: {
              preTaskComment: "前置任务说明",
              params: [
                {
                  name: "keyword",
                  label: "采集关键字",
                  type: "string",
                  value: "keyword1",
                },
                { name: "uids", label: "用户id", type: "number", value: 0 },
              ],
              etlPeriod: {
                label: "每分钟",
                unit: "minutes", //时间单位   //延迟周期 day, hour, minute
                value: 1, // 具体数值 , 如1代表为1分钟
              },
              delayPeriod: {
                label: "10分钟",
                unit: "minutes", //延迟周期 day, hour, minute
                value: 10,
              },
              execType: {
                label: "执行一次",
                value: "execOnece",
              },
              comment: "注释内容",
            },
          };
        }),
      };

      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: rules,
      };
    },
  },

  //保存配置规则
  ///rule/config
  {
    url: "/rule/config",
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
    url: "/rule/config/delete",
    method: "delete",
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
    url: "/api/modify/ruleStatus",
    method: "put",
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
    url: "/api/get/algorithm/options",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: [
          { label: "算法1", value: 1 },
          { label: "算法2", value: 2 },
        ],
      };
    },
  },
];
