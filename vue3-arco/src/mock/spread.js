// 传播分析

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
    // 时间轴详情数据
    url: "/spread/timeline",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {},
      };
    },
  },

  {
    // 时间轴详情数据
    url: "/spread/timeline/more",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);

      // 时间轴数据
      const listData = (() => {
        const count = pluckRandom([0, 20]);
        const arr = new Array(count).fill(0);
        return arr.map(() => {
          let obj = {
            // position: (index + 1) % 2 == 0 ? "right" : "left",
            username: pluckRandom(["user1", "长的用户名成长的用户名称"]),
            type: pluckRandom(["转发", "发布"]), // 转发 或 发布
            content:
              "发布的内容发布的内容发布的内容发布的内容,发布的内容发布的内容发布的内容发布的内容发布的内容发布的内容,发布的内容",
            dateTime: "2022-02-01 20:10:10",
            repost: 10, // 转发
            favor: 10, // 点赞
            comment: 10, // 评论
          };
          return obj;
        });
      })();

      ctx.body = {
        code: 0,
        data: listData,
      };
    },
  },
  {
    // 时间轴详情数据
    url: "/api/ds/q/disseminationrank",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);

      ctx.body = {
        code: 0,
        data: {
          all_content_count: 3818,
          results: [
            {
              user: "偶像梦幻祭2",
              user_id: "7339351819",
              focus_num: 1040000,
              active_num: 25,
              spread_num: 11147,
              content_count: 3284,
              effect_num: 18021,
              center_num: 0,
              comments_count: 6642,

              info: {
                ID: "4967403727880266",
                渠道: "新浪微博",
                内容类型: "原创微博",
                内容: "#偶像梦幻祭[超话]# #偶像梦幻祭2# \n明天是\n\n🎊七种茨的生日🎊\nHappy Birthday！！\n\n🎁助理君准备了庆生十连礼包，将于今晚从转、赞、评中各摸1位制作人赠送！ ​  ​  ​ http://t.cn/A6WHsBc2 ​​​",
                作者ID: "7339351819",
                作者: "偶像梦幻祭2",
                发布时间: "2023-11-13 00:00:01",
                更新时间: "2023-11-20 00:11:00",
                采集时间: "2023-11-13 00:00:39",
                整体情感: {
                  label: "正向",
                  value: "positive",
                },
                ABAS分析: [
                  {
                    评价维度: "助理君",
                    观点词: [],
                    情感倾向: ["正向"],
                  },
                ],
                其他: {
                  转发数: 976,
                  评论数: 1055,
                  点赞数: 2077,
                  地区: "发布于 上海",
                },
              },
            },
          ],
          timeLineData: {
            chart: {
              dimensions: ["hour", "value"],
              source: [
                {
                  hour: "2023-11-13 00",
                  value: 5,
                },
                {
                  hour: "2023-11-13 01",
                  value: 0,
                },
                {
                  hour: "2023-11-13 02",
                  value: 0,
                },
                {
                  hour: "2023-11-13 03",
                  value: 0,
                },
                {
                  hour: "2023-11-13 04",
                  value: 0,
                },
                {
                  hour: "2023-11-13 05",
                  value: 0,
                },
                {
                  hour: "2023-11-13 06",
                  value: 0,
                },
                {
                  hour: "2023-11-13 07",
                  value: 0,
                },
                {
                  hour: "2023-11-13 08",
                  value: 0,
                },
                {
                  hour: "2023-11-13 09",
                  value: 0,
                },
                {
                  hour: "2023-11-13 10",
                  value: 0,
                },
                {
                  hour: "2023-11-13 11",
                  value: 1,
                },
                {
                  hour: "2023-11-13 12",
                  value: 1,
                },
                {
                  hour: "2023-11-13 13",
                  value: 16,
                },
                {
                  hour: "2023-11-13 14",
                  value: 0,
                },
                {
                  hour: "2023-11-13 15",
                  value: 0,
                },
                {
                  hour: "2023-11-13 16",
                  value: 0,
                },
                {
                  hour: "2023-11-13 17",
                  value: 1,
                },
                {
                  hour: "2023-11-13 18",
                  value: 0,
                },
                {
                  hour: "2023-11-13 19",
                  value: 0,
                },
                {
                  hour: "2023-11-13 20",
                  value: 0,
                },
                {
                  hour: "2023-11-13 21",
                  value: 0,
                },
                {
                  hour: "2023-11-13 22",
                  value: 1,
                },
                {
                  hour: "2023-11-13 23",
                  value: 23,
                },
                {
                  hour: "2023-11-14 00",
                  value: 1,
                },
                {
                  hour: "2023-11-14 01",
                  value: 0,
                },
                {
                  hour: "2023-11-14 02",
                  value: 0,
                },
                {
                  hour: "2023-11-14 03",
                  value: 0,
                },
                {
                  hour: "2023-11-14 04",
                  value: 0,
                },
                {
                  hour: "2023-11-14 05",
                  value: 0,
                },
                {
                  hour: "2023-11-14 06",
                  value: 0,
                },
                {
                  hour: "2023-11-14 07",
                  value: 0,
                },
                {
                  hour: "2023-11-14 08",
                  value: 0,
                },
                {
                  hour: "2023-11-14 09",
                  value: 2,
                },
                {
                  hour: "2023-11-14 10",
                  value: 0,
                },
                {
                  hour: "2023-11-14 11",
                  value: 0,
                },
                {
                  hour: "2023-11-14 12",
                  value: 1,
                },
                {
                  hour: "2023-11-14 13",
                  value: 0,
                },
                {
                  hour: "2023-11-14 14",
                  value: 1,
                },
                {
                  hour: "2023-11-14 15",
                  value: 2,
                },
                {
                  hour: "2023-11-14 16",
                  value: 23,
                },
                {
                  hour: "2023-11-14 17",
                  value: 0,
                },
                {
                  hour: "2023-11-14 18",
                  value: 0,
                },
                {
                  hour: "2023-11-14 19",
                  value: 0,
                },
                {
                  hour: "2023-11-14 20",
                  value: 0,
                },
                {
                  hour: "2023-11-14 21",
                  value: 0,
                },
                {
                  hour: "2023-11-14 22",
                  value: 0,
                },
                {
                  hour: "2023-11-14 23",
                  value: 18,
                },
                {
                  hour: "2023-11-15 00",
                  value: 9,
                },
                {
                  hour: "2023-11-15 01",
                  value: 0,
                },
                {
                  hour: "2023-11-15 02",
                  value: 0,
                },
                {
                  hour: "2023-11-15 03",
                  value: 0,
                },
                {
                  hour: "2023-11-15 04",
                  value: 0,
                },
                {
                  hour: "2023-11-15 05",
                  value: 0,
                },
                {
                  hour: "2023-11-15 06",
                  value: 0,
                },
                {
                  hour: "2023-11-15 07",
                  value: 0,
                },
                {
                  hour: "2023-11-15 08",
                  value: 0,
                },
                {
                  hour: "2023-11-15 09",
                  value: 0,
                },
                {
                  hour: "2023-11-15 10",
                  value: 0,
                },
                {
                  hour: "2023-11-15 11",
                  value: 1,
                },
                {
                  hour: "2023-11-15 12",
                  value: 1,
                },
                {
                  hour: "2023-11-15 13",
                  value: 0,
                },
                {
                  hour: "2023-11-15 14",
                  value: 0,
                },
                {
                  hour: "2023-11-15 15",
                  value: 0,
                },
                {
                  hour: "2023-11-15 16",
                  value: 0,
                },
                {
                  hour: "2023-11-15 17",
                  value: 20,
                },
                {
                  hour: "2023-11-15 18",
                  value: 0,
                },
                {
                  hour: "2023-11-15 19",
                  value: 0,
                },
                {
                  hour: "2023-11-15 20",
                  value: 1,
                },
                {
                  hour: "2023-11-15 21",
                  value: 0,
                },
                {
                  hour: "2023-11-15 22",
                  value: 2,
                },
                {
                  hour: "2023-11-15 23",
                  value: 18,
                },
                {
                  hour: "2023-11-16 00",
                  value: 0,
                },
                {
                  hour: "2023-11-16 01",
                  value: 0,
                },
                {
                  hour: "2023-11-16 02",
                  value: 0,
                },
                {
                  hour: "2023-11-16 03",
                  value: 0,
                },
                {
                  hour: "2023-11-16 04",
                  value: 0,
                },
                {
                  hour: "2023-11-16 05",
                  value: 0,
                },
                {
                  hour: "2023-11-16 06",
                  value: 0,
                },
                {
                  hour: "2023-11-16 07",
                  value: 0,
                },
                {
                  hour: "2023-11-16 08",
                  value: 0,
                },
                {
                  hour: "2023-11-16 09",
                  value: 0,
                },
                {
                  hour: "2023-11-16 10",
                  value: 0,
                },
                {
                  hour: "2023-11-16 11",
                  value: 5,
                },
                {
                  hour: "2023-11-16 12",
                  value: 1,
                },
                {
                  hour: "2023-11-16 13",
                  value: 1,
                },
                {
                  hour: "2023-11-16 14",
                  value: 0,
                },
                {
                  hour: "2023-11-16 15",
                  value: 0,
                },
                {
                  hour: "2023-11-16 16",
                  value: 9,
                },
                {
                  hour: "2023-11-16 17",
                  value: 11,
                },
                {
                  hour: "2023-11-16 18",
                  value: 1,
                },
                {
                  hour: "2023-11-16 19",
                  value: 0,
                },
                {
                  hour: "2023-11-16 20",
                  value: 4,
                },
                {
                  hour: "2023-11-16 21",
                  value: 6,
                },
                {
                  hour: "2023-11-16 22",
                  value: 10,
                },
                {
                  hour: "2023-11-16 23",
                  value: 0,
                },
                {
                  hour: "2023-11-17 00",
                  value: 0,
                },
                {
                  hour: "2023-11-17 01",
                  value: 0,
                },
                {
                  hour: "2023-11-17 02",
                  value: 0,
                },
                {
                  hour: "2023-11-17 03",
                  value: 0,
                },
                {
                  hour: "2023-11-17 04",
                  value: 0,
                },
                {
                  hour: "2023-11-17 05",
                  value: 0,
                },
                {
                  hour: "2023-11-17 06",
                  value: 0,
                },
                {
                  hour: "2023-11-17 07",
                  value: 0,
                },
                {
                  hour: "2023-11-17 08",
                  value: 0,
                },
                {
                  hour: "2023-11-17 09",
                  value: 4,
                },
                {
                  hour: "2023-11-17 10",
                  value: 0,
                },
                {
                  hour: "2023-11-17 11",
                  value: 0,
                },
                {
                  hour: "2023-11-17 12",
                  value: 2,
                },
                {
                  hour: "2023-11-17 13",
                  value: 0,
                },
                {
                  hour: "2023-11-17 14",
                  value: 0,
                },
                {
                  hour: "2023-11-17 15",
                  value: 0,
                },
                {
                  hour: "2023-11-17 16",
                  value: 20,
                },
                {
                  hour: "2023-11-17 17",
                  value: 2,
                },
                {
                  hour: "2023-11-17 18",
                  value: 0,
                },
                {
                  hour: "2023-11-17 19",
                  value: 0,
                },
                {
                  hour: "2023-11-17 20",
                  value: 0,
                },
                {
                  hour: "2023-11-17 21",
                  value: 0,
                },
                {
                  hour: "2023-11-17 22",
                  value: 0,
                },
                {
                  hour: "2023-11-17 23",
                  value: 21,
                },
                {
                  hour: "2023-11-18 00",
                  value: 0,
                },
                {
                  hour: "2023-11-18 01",
                  value: 3,
                },
                {
                  hour: "2023-11-18 02",
                  value: 0,
                },
                {
                  hour: "2023-11-18 03",
                  value: 0,
                },
                {
                  hour: "2023-11-18 04",
                  value: 0,
                },
                {
                  hour: "2023-11-18 05",
                  value: 0,
                },
                {
                  hour: "2023-11-18 06",
                  value: 0,
                },
                {
                  hour: "2023-11-18 07",
                  value: 0,
                },
                {
                  hour: "2023-11-18 08",
                  value: 0,
                },
                {
                  hour: "2023-11-18 09",
                  value: 0,
                },
                {
                  hour: "2023-11-18 10",
                  value: 0,
                },
                {
                  hour: "2023-11-18 11",
                  value: 0,
                },
                {
                  hour: "2023-11-18 12",
                  value: 2,
                },
                {
                  hour: "2023-11-18 13",
                  value: 0,
                },
                {
                  hour: "2023-11-18 14",
                  value: 2,
                },
                {
                  hour: "2023-11-18 15",
                  value: 1,
                },
                {
                  hour: "2023-11-18 16",
                  value: 0,
                },
                {
                  hour: "2023-11-18 17",
                  value: 19,
                },
                {
                  hour: "2023-11-18 18",
                  value: 0,
                },
                {
                  hour: "2023-11-18 19",
                  value: 0,
                },
                {
                  hour: "2023-11-18 20",
                  value: 0,
                },
                {
                  hour: "2023-11-18 21",
                  value: 0,
                },
                {
                  hour: "2023-11-18 22",
                  value: 9,
                },
                {
                  hour: "2023-11-18 23",
                  value: 10,
                },
                {
                  hour: "2023-11-19 00",
                  value: 4,
                },
                {
                  hour: "2023-11-19 01",
                  value: 0,
                },
                {
                  hour: "2023-11-19 02",
                  value: 0,
                },
                {
                  hour: "2023-11-19 03",
                  value: 0,
                },
                {
                  hour: "2023-11-19 04",
                  value: 0,
                },
                {
                  hour: "2023-11-19 05",
                  value: 0,
                },
                {
                  hour: "2023-11-19 06",
                  value: 0,
                },
                {
                  hour: "2023-11-19 07",
                  value: 0,
                },
                {
                  hour: "2023-11-19 08",
                  value: 0,
                },
                {
                  hour: "2023-11-19 09",
                  value: 0,
                },
                {
                  hour: "2023-11-19 10",
                  value: 0,
                },
                {
                  hour: "2023-11-19 11",
                  value: 0,
                },
                {
                  hour: "2023-11-19 12",
                  value: 0,
                },
                {
                  hour: "2023-11-19 13",
                  value: 0,
                },
                {
                  hour: "2023-11-19 14",
                  value: 0,
                },
                {
                  hour: "2023-11-19 15",
                  value: 0,
                },
                {
                  hour: "2023-11-19 16",
                  value: 20,
                },
                {
                  hour: "2023-11-19 17",
                  value: 0,
                },
                {
                  hour: "2023-11-19 18",
                  value: 0,
                },
                {
                  hour: "2023-11-19 19",
                  value: 1,
                },
                {
                  hour: "2023-11-19 20",
                  value: 0,
                },
                {
                  hour: "2023-11-19 21",
                  value: 1,
                },
                {
                  hour: "2023-11-19 22",
                  value: 0,
                },
                {
                  hour: "2023-11-19 23",
                  value: 20,
                },
              ],
            },
          },
        },
      };
    },
  },
  {
    // 时间轴详情数据
    url: "/user/comment/info",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: ["内容", "内容2"],
        message: "",
      };
    },
  },
];

// 传播分析计算
// url: "/api/ds/q/dissemination",

// 获取数据表数据
//  url: "/api/ds/q/disseminationrank",

//获取数据详情
//   url: "/api/ds/q/disseminationcontents",
