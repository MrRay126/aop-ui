// 趋势分析

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
    url: "/api/ds/tables",
    method: "get",
    handler: async (ctx) => {
      ctx.body = {
        code: 0,
        data: [
          {
            title: "舆情内容",
            code: "aop.ods_aop",
            fields: [
              {
                title: "识别ID",
                type: "text",
                code: "id",
                options: [
                  {
                    value: "eq",
                    label: "等于",
                  },
                  {
                    value: "neq",
                    label: "不等于",
                  },
                ],
              },
              {
                title: "上传转发ID",
                type: "text",
                code: "ref_id",
                options: [
                  {
                    value: "eq",
                    label: "等于",
                  },
                  {
                    value: "neq",
                    label: "不等于",
                  },
                ],
              },
              {
                title: "转发原帖ID",
                type: "text",
                code: "org_id",
                options: [
                  {
                    value: "eq",
                    label: "等于",
                  },
                  {
                    value: "neq",
                    label: "不等于",
                  },
                ],
              },
              {
                title: "作者粉丝数",
                type: "number",
                code: "followers_count",
                options: [
                  {
                    value: "eq",
                    label: "等于",
                  },
                  {
                    value: "neq",
                    label: "不等于",
                  },
                  {
                    value: "lt",
                    label: "小于",
                  },
                  {
                    value: "lte",
                    label: "小于等于",
                  },
                  {
                    value: "gt",
                    label: "大于",
                  },
                  {
                    value: "gte",
                    label: "大于等于",
                  },
                  {
                    value: "between",
                    label: "区间",
                  },
                  {
                    value: "notNull",
                    label: "有值",
                  },
                  {
                    value: "null",
                    label: "无值",
                  },
                ],
              },
              {
                title: "渠道",
                type: "channel",
                code: "channel",
                options: [
                  {
                    value: "eq",
                    label: "等于",
                  },
                  {
                    value: "neq",
                    label: "不等于",
                  },
                ],
                choices: [
                  {
                    title: "信息流",
                    type: "channel",
                    code: "channel",
                    options: [
                      {
                        value: "eq",
                        label: "等于",
                      },
                      {
                        value: "neq",
                        label: "不等于",
                      },
                    ],
                    choices: [
                      {
                        title: "微博-博文",
                        code: "weibo",
                      },
                    ],
                  },
                  {
                    title: "视频",
                    type: "channel",
                    code: "channel",
                    options: [
                      {
                        value: "eq",
                        label: "等于",
                      },
                      {
                        value: "neq",
                        label: "不等于",
                      },
                    ],
                    choices: [
                      {
                        title: "B站-视频",
                        code: "bilibili",
                      },
                    ],
                  },
                  {
                    title: "评价",
                    type: "channel",
                    code: "channel",
                    options: [
                      {
                        value: "eq",
                        label: "等于",
                      },
                      {
                        value: "neq",
                        label: "不等于",
                      },
                    ],
                    choices: [
                      {
                        title: "TapTap-评价",
                        code: "taptap",
                      },
                    ],
                  },
                ],
              },
              {
                title: "类型",
                type: "text",
                code: "content_type",
                options: [
                  {
                    value: "eq",
                    label: "等于",
                  },
                  {
                    value: "neq",
                    label: "不等于",
                  },
                ],
                choices: [
                  {
                    title: "视频",
                    code: "video",
                  },
                  {
                    title: "review",
                    code: "review",
                  },
                ],
              },
              {
                title: "情感倾向",
                code: "sentiment_rough",
                type: "text",
                options: [
                  {
                    value: "eq",
                    label: "等于",
                  },
                  {
                    value: "neq",
                    label: "不等于",
                  },
                ],
                choices: [
                  {
                    title: "正向",
                    code: "positive",
                  },
                  {
                    title: "负向",
                    code: "negative",
                  },
                  {
                    title: "中性",
                    code: "neutral",
                  },
                ],
              },
              {
                title: "内容",
                type: "text",
                code: "content",
                options: [
                  {
                    value: "like",
                    label: "包含",
                  },
                  {
                    value: "notLike",
                    label: "不包含",
                  },
                  {
                    value: "match",
                    label: "正则匹配",
                  },
                  {
                    value: "notMatch",
                    label: "正则不匹配",
                  },
                ],
              },
              {
                title: "作者",
                type: "text",
                code: "author",
                options: [
                  {
                    value: "eq",
                    label: "等于",
                  },
                  {
                    value: "neq",
                    label: "不等于",
                  },
                  {
                    value: "like",
                    label: "包含",
                  },
                  {
                    value: "notLike",
                    label: "不包含",
                  },
                  {
                    value: "match",
                    label: "正则匹配",
                  },
                  {
                    value: "notMatch",
                    label: "正则不匹配",
                  },
                ],
              },
              {
                title: "作者ID",
                type: "text",
                code: "author_id",
                options: [
                  {
                    value: "eq",
                    label: "等于",
                  },
                  {
                    value: "neq",
                    label: "不等于",
                  },
                ],
              },
            ],
            groups: [
              {
                title: "通用属性",
                name: "common",
                data: [
                  {
                    title: "作者",
                    value: "author",
                    type: "文本",
                  },
                  {
                    title: "渠道",
                    value: "channel",
                    type: "文本",
                  },
                  {
                    title: "作者id",
                    value: "author_id",
                    type: "文本",
                  },
                  {
                    title: "粗粒度情感",
                    value: "sentiment_rough",
                    type: "文本",
                  },
                ],
              },
              {
                title: "渠道属性",
                name: "channel",
                data: [],
              },
              {
                title: "热词组",
                name: "wordgroup",
                data: [
                  {
                    title: "asdasd",
                    value: 56,
                    type: "文本",
                  },
                  {
                    title: "词组1",
                    value: 1,
                    type: "文本",
                  },
                ],
              },
              {
                title: "热词",
                name: "word",
                data: [],
              },
            ],
          },
        ],
        message: "",
      };
    },
  },

  {
    url: "/api/ds/q/ttdetail",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);

      ctx.body = {
        code: 0,
        data: {
          filterOptions: {
            textType: [{ label: "BUG", value: "bug" }],
            channelContentType: [
              {
                label: "全部",
                value: "",
              },
              {
                label: "新浪微博",
                value: "weibo",
              },
            ],
            emotion: [
              {
                value: "",
                label: "全部",
              },
              {
                value: "positive",
                label: "正向",
              },
              {
                value: "negative",
                label: "负向",
              },
              {
                value: "neutral",
                label: "中性",
              },
            ],
          },

          list: genOptions(10, (index) => {
            return {
              id: "0ee8f2139bf74f5cb351b90091e66aee" + index,
              channelContentType: "微博-原创博客", // 渠道-内容类型
              content: "你把我登录奖励吞了是什么意思……", // 内容

              link: pluckRandom(["https://www.baidu.com", ""]), // 原文链接
              authorName: "y*******", // 作者名称
              publishTime: "2023-09-02 17:48:00", // 发布时间
              emotion: { label: "中性", value: "neutral" }, // 整体情感的对象值(前端使用label)
              textType: { label: "BUG", value: "bug" }, // 文本类型的value值(前端使用label)

              // json显示
              info: {
                link: null, // 原文链接
                authorName: "y*******", // 作者名称
                publishTime: "2023-09-02 17:48:00", // 发布时间
                emotion: { label: "中性", value: "neutral" }, // 整体情感的对象值(前端使用label)
                textType: { label: "BUG", value: "bug" },
              },

              authorId: 99759804, // 用户id(如果没有则不返回或返回null, 用于跳转kol分析)
            };
          }),

          pager: {
            curPage: 1,
            pageSize: 10,
            total: 2548,
          },
        },
        message: "",
      };
    },
  },

  {
    url: "/api/emotion/options",
    method: "get",
    handler: async (ctx) => {
      ctx.body = {
        code: 0,
        data: [
          { label: "正面", value: "positive" },
          { label: "负面", value: "negative" },
          { label: "中性", value: "neutral" },
        ],
        message: "",
      };
    },
  },

  {
    url: "/api/texttype/options",
    method: "get",
    handler: async (ctx) => {
      ctx.body = {
        code: 0,
        data: [{ label: "bug", value: "bug" }],
        message: "",
      };
    },
  },

  {
    url: "/api/detail/update",
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
];

// getTrendData
// url: "/api/ds/q/trend",

// getFilterOptions
// url: "/api/ds/tables",

// 趋势分析维度表
// url: "/api/ds/q/trendtable",

// 趋势分析数据详情
// url: "/api/ds/q/ttdetail"

//  趋势分析 大卡table表
// url: "/api/ds/q/trendcard",
