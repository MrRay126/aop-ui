// 词云分析

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
  // 词云分析词云的详情数据
  // 1 result字段
  {
    url: "/api/ds/q/wordcloudword",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {
          result: {
            positive: {
              count: 1250,
              percent: "34.88%",
              data: [
                {
                  id: "493433271",
                  channel: "BiliBili",
                  content:
                    '【<em class="keyword">偶像梦幻祭</em>】bug是小<em class="keyword">偶像</em>最好的万圣节装扮,挺好的，下次就出这个服装吧',
                  update_time: null,
                  link: "http://www.bilibili.com/video/av493433271",
                  type: "视频",
                  publishTime: "2023-11-16 19:56:52",
                  collectionTime: "2023-11-16 20:00:04",
                  ABAS: [
                    {
                      评价维度: "bug",
                      观点词: "小偶像最好的万圣节装扮,挺好的",
                      情感倾向: "positive",
                    },
                    {
                      评价维度: "万圣节装扮",
                      观点词: "小偶像最好的万圣节装扮,挺好的",
                      情感倾向: "positive",
                    },
                    {
                      评价维度: "服装",
                      观点词: "下次就出这个服装吧",
                      情感倾向: "neutral",
                    },
                  ],
                  emotion: {
                    label: "正向",
                    value: "positive",
                  },
                  authorId: "14379839",
                  authorName: "0606752",
                  others: {},
                  channelContentType: "BiliBili-视频",
                  info: {
                    ID: "493433271",
                    渠道: "BiliBili",
                    内容类型: "视频",
                    内容: '【<em class="keyword">偶像梦幻祭</em>】bug是小<em class="keyword">偶像</em>最好的万圣节装扮,挺好的，下次就出这个服装吧',
                    作者ID: "14379839",
                    作者: "0606752",
                    发布时间: "2023-11-16 19:56:52",
                    更新时间: null,
                    采集时间: "2023-11-16 20:00:04",
                    整体情感: {
                      label: "正向",
                      value: "positive",
                    },
                    ABAS分析: [
                      {
                        评价维度: "bug",
                        观点词: "小偶像最好的万圣节装扮,挺好的",
                        情感倾向: "positive",
                      },
                      {
                        评价维度: "万圣节装扮",
                        观点词: "小偶像最好的万圣节装扮,挺好的",
                        情感倾向: "positive",
                      },
                      {
                        评价维度: "服装",
                        观点词: "下次就出这个服装吧",
                        情感倾向: "neutral",
                      },
                    ],
                    其他: {},
                  },
                  textType: {
                    label: "周边",
                    value: "foo",
                  },
                  time: "2023-11-16 19:56:52",
                },
              ],
            },
            negative: {
              count: 86,
              percent: "2.40%",
              data: [
                {
                  id: "493433271",
                  channel: "BiliBili",
                  content:
                    '【<em class="keyword">偶像梦幻祭</em>】bug是小<em class="keyword">偶像</em>最好的万圣节装扮,挺好的，下次就出这个服装吧',
                  update_time: null,
                  link: "http://www.bilibili.com/video/av493433271",
                  type: "视频",
                  publishTime: "2023-11-16 19:56:52",
                  collectionTime: "2023-11-16 20:00:04",
                  ABAS: [
                    {
                      评价维度: "bug",
                      观点词: "小偶像最好的万圣节装扮,挺好的",
                      情感倾向: "positive",
                    },
                    {
                      评价维度: "万圣节装扮",
                      观点词: "小偶像最好的万圣节装扮,挺好的",
                      情感倾向: "positive",
                    },
                    {
                      评价维度: "服装",
                      观点词: "下次就出这个服装吧",
                      情感倾向: "neutral",
                    },
                  ],
                  emotion: {
                    label: "正向",
                    value: "positive",
                  },
                  authorId: "14379839",
                  authorName: "0606752",
                  others: {},
                  channelContentType: "BiliBili-视频",
                  info: {
                    ID: "493433271",
                    渠道: "BiliBili",
                    内容类型: "视频",
                    内容: '【<em class="keyword">偶像梦幻祭</em>】bug是小<em class="keyword">偶像</em>最好的万圣节装扮,挺好的，下次就出这个服装吧',
                    作者ID: "14379839",
                    作者: "0606752",
                    发布时间: "2023-11-16 19:56:52",
                    更新时间: null,
                    采集时间: "2023-11-16 20:00:04",
                    整体情感: {
                      label: "正向",
                      value: "positive",
                    },
                    ABAS分析: [
                      {
                        评价维度: "bug",
                        观点词: "小偶像最好的万圣节装扮,挺好的",
                        情感倾向: "positive",
                      },
                      {
                        评价维度: "万圣节装扮",
                        观点词: "小偶像最好的万圣节装扮,挺好的",
                        情感倾向: "positive",
                      },
                      {
                        评价维度: "服装",
                        观点词: "下次就出这个服装吧",
                        情感倾向: "neutral",
                      },
                    ],
                    其他: {},
                  },
                  textType: {
                    label: "",
                    value: "",
                  },
                  time: "2023-11-16 19:56:52",
                },
              ],
            },
            others: {
              count: 2248,
              percent: "62.72%",
              data: [
                {
                  id: "493433271",
                  channel: "BiliBili",
                  content:
                    '【<em class="keyword">偶像梦幻祭</em>】bug是小<em class="keyword">偶像</em>最好的万圣节装扮,挺好的，下次就出这个服装吧',
                  update_time: null,
                  link: "http://www.bilibili.com/video/av493433271",
                  type: "视频",
                  publishTime: "2023-11-16 19:56:52",
                  collectionTime: "2023-11-16 20:00:04",
                  ABAS: [
                    {
                      评价维度: "bug",
                      观点词: "小偶像最好的万圣节装扮,挺好的",
                      情感倾向: "positive",
                    },
                    {
                      评价维度: "万圣节装扮",
                      观点词: "小偶像最好的万圣节装扮,挺好的",
                      情感倾向: "positive",
                    },
                    {
                      评价维度: "服装",
                      观点词: "下次就出这个服装吧",
                      情感倾向: "neutral",
                    },
                  ],
                  emotion: {
                    label: "正向",
                    value: "positive",
                  },
                  authorId: "14379839",
                  authorName: "0606752",
                  others: {},
                  channelContentType: "BiliBili-视频",
                  info: {
                    ID: "493433271",
                    渠道: "BiliBili",
                    内容类型: "视频",
                    内容: '【<em class="keyword">偶像梦幻祭</em>】bug是小<em class="keyword">偶像</em>最好的万圣节装扮,挺好的，下次就出这个服装吧',
                    作者ID: "14379839",
                    作者: "0606752",
                    发布时间: "2023-11-16 19:56:52",
                    更新时间: null,
                    采集时间: "2023-11-16 20:00:04",
                    整体情感: {
                      label: "正向",
                      value: "positive",
                    },
                    ABAS分析: [
                      {
                        评价维度: "bug",
                        观点词: "小偶像最好的万圣节装扮,挺好的",
                        情感倾向: "positive",
                      },
                      {
                        评价维度: "万圣节装扮",
                        观点词: "小偶像最好的万圣节装扮,挺好的",
                        情感倾向: "positive",
                      },
                      {
                        评价维度: "服装",
                        观点词: "下次就出这个服装吧",
                        情感倾向: "neutral",
                      },
                    ],
                    其他: {},
                  },
                  textType: {
                    label: "",
                    value: "",
                  },
                  time: "2023-11-16 19:56:52",
                },
              ],
            },
          },
        },
      };
    },
  },

  {
    url: "/first/level/table",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: genOptions(20, (index) => {
          return { keyword: "关键词" + index, volumn: 100 };
        }),
      };
    },
  },

  {
    url: "/second/level/table",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: genOptions(20, (index) => {
          return { keyword: "二级关键词" + index, volumn: 100 };
        }),
      };
    },
  },
];

// calculateWords
// url: "/api/ds/q/wordcloud",

// getDispositionWordTable
// url: "/api/ds/q/wordcloudword",

// getDetailTableData
// url: "/api/ds/q/wordcloudcontent",
