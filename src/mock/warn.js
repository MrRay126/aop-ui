// 预警管理

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
    url: "/api/alert/trend",
    method: "post",
    async handler(ctx) {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: {
          pager: {
            curPage: 1,
            pageSize: 30,
            total: 1,
          },
          source: [
            {
              warnMessage: "预警信息通知",
              time: "2020/12/12",
              tags: ["tag1", "预警2"],
            },
          ],
        },
      };
    },
  },

  {
    url: "/alert/detail",
    method: "post",
    async handler(ctx) {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: {
          status: 3,
          pager: {
            curPage: 1,
            pageSize: 10,
            total: 9825,
          },
          list: [
            {
              id: "063335e0c50d316e4674ca4dd938d0fe",
              content: null,
              link: null,
              publishTime: "2024-05-05 16:00:09",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: null,
              authorName: null,
              channelContentType: "BiliBili-评分",
              info: {
                ID: "063335e0c50d316e4674ca4dd938d0fe",
                渠道: "BiliBili",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-05 16:00:09",
                更新时间: "",
                采集时间: "2024-05-05 16:00:09",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [],
                其他: {
                  state: 3,
                  star_number_list: [4150, 781, 1282, 1677, 7186],
                  valid_comment_number: 17895,
                  评分: 6.9,
                  评论量: 18150,
                },
              },
              textType: {
                label: "常规信息",
                value: "default",
              },
            },
            {
              id: "09833505df384491bfaf4012f54e4bce",
              content: null,
              link: null,
              publishTime: "2024-05-05 21:00:09",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: null,
              authorName: null,
              channelContentType: "BiliBili-评分",
              info: {
                ID: "09833505df384491bfaf4012f54e4bce",
                渠道: "BiliBili",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-05 21:00:09",
                更新时间: "",
                采集时间: "2024-05-05 21:00:09",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [],
                其他: {
                  state: 3,
                  star_number_list: [4150, 781, 1282, 1677, 7186],
                  valid_comment_number: 17897,
                  评分: 6.9,
                  评论量: 18152,
                },
              },
              textType: {
                label: "常规信息",
                value: "default",
              },
            },
            {
              id: "0ece720a0011879eb57dc0fe6d7784c7",
              content: null,
              link: null,
              publishTime: "2024-05-05 06:00:05",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: null,
              authorName: null,
              channelContentType: "BiliBili-评分",
              info: {
                ID: "0ece720a0011879eb57dc0fe6d7784c7",
                渠道: "BiliBili",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-05 06:00:05",
                更新时间: "",
                采集时间: "2024-05-05 06:00:05",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [],
                其他: {
                  state: 3,
                  star_number_list: [4150, 781, 1280, 1677, 7186],
                  valid_comment_number: 17892,
                  评分: 6.9,
                  评论量: 18147,
                },
              },
              textType: {
                label: "常规信息",
                value: "default",
              },
            },
            {
              id: "1004019920",
              content: "【es2/国服】蜂团的Xday,自存",
              link: "http://www.bilibili.com/video/av1004019920",
              publishTime: "2024-05-05 00:37:03",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: "435649",
              authorName: "莉可莉絲",
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1004019920",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "【es2/国服】蜂团的Xday,自存",
                作者ID: "435649",
                作者: "莉可莉絲",
                发布时间: "2024-05-05 00:37:03",
                更新时间: "2024-05-06 01:10:12",
                采集时间: "2024-05-05 01:00:18",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [
                  {
                    评价维度: "活动",
                    观点词: "蜂团的Xday",
                    情感倾向: "neutral",
                  },
                  {
                    评价维度: "游戏模式",
                    观点词: "自存",
                    情感倾向: "neutral",
                  },
                ],
                其他: {
                  子分区名称: "MV",
                  "稿件总时长（秒）": 163,
                  播放数: 27,
                  获赞数: 2,
                  粉丝数: 9,
                  关注数: 393,
                  签名: "很杂食，喜欢的都会发一下（es发不出被bang了（哭",
                  标签: ["偶像梦幻祭", "Crazy:B", "偶像梦幻祭2"],
                },
              },
              textType: {
                label: "游戏讨论",
                value: "gameplay_discussion",
              },
            },
            {
              id: "1004026505",
              content: "【es】八周年抽卡记录,-",
              link: "http://www.bilibili.com/video/av1004026505",
              publishTime: "2024-05-05 19:41:04",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: "1100651852",
              authorName: "司桃桃桃桃桃子_",
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1004026505",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "【es】八周年抽卡记录,-",
                作者ID: "1100651852",
                作者: "司桃桃桃桃桃子_",
                发布时间: "2024-05-05 19:41:04",
                更新时间: "2024-05-06 20:10:13",
                采集时间: "2024-05-05 20:00:14",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [
                  {
                    评价维度: "抽卡记录",
                    观点词: "八周年",
                    情感倾向: "positive",
                  },
                ],
                其他: {
                  子分区名称: "手机游戏",
                  "稿件总时长（秒）": 239,
                  稿件参与的活动id: 4012192,
                  播放数: 17,
                  收藏数: 1,
                  获赞数: 2,
                  粉丝数: 24,
                  关注数: 191,
                  签名: "推萧逸 夏彦 明星昴流 莱欧斯利 祁煜））",
                  标签: [
                    "游戏里的春天",
                    "转角遇到春天",
                    "二次元",
                    "偶像梦幻祭",
                    "抽卡",
                    "偶像梦幻祭2",
                    "八周年",
                  ],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
            },
            {
              id: "1004050063",
              content:
                "［补档/绘画过程］去年画的一些弓茨相关,bgm:夜行Night Journey-ヨルシカ\n碰巧翻到了，再发一下（俗称炒冷饭（被打）\n我cp好萌(´；ω；`)",
              link: "http://www.bilibili.com/video/av1004050063",
              publishTime: "2024-05-05 17:23:08",
              emotion: {
                label: "正向",
                value: "positive",
              },
              authorId: "399110086",
              authorName: "Limn355",
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1004050063",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "［补档/绘画过程］去年画的一些弓茨相关,bgm:夜行Night Journey-ヨルシカ\n碰巧翻到了，再发一下（俗称炒冷饭（被打）\n我cp好萌(´；ω；`)",
                作者ID: "399110086",
                作者: "Limn355",
                发布时间: "2024-05-05 17:23:08",
                更新时间: "2024-05-06 17:40:05",
                采集时间: "2024-05-05 17:30:12",
                整体情感: {
                  label: "正向",
                  value: "positive",
                },
                ABAS分析: [
                  {
                    评价维度: "绘画过程",
                    观点词: "好萌",
                    情感倾向: "positive",
                  },
                  {
                    评价维度: "补档",
                    观点词: "好萌",
                    情感倾向: "positive",
                  },
                  {
                    评价维度: "夜行Night Journey-ヨルシカ",
                    观点词: "好听",
                    情感倾向: "positive",
                  },
                ],
                其他: {
                  子分区名称: "绘画",
                  "稿件总时长（秒）": 76,
                  播放数: 57,
                  收藏数: 1,
                  投币数: 2,
                  获赞数: 3,
                  粉丝数: 202,
                  关注数: 439,
                  签名: "∠( ᐛ 」∠)＿感谢喜欢",
                  标签: [
                    "夜行",
                    "偶像梦幻祭",
                    "同人",
                    "绘画",
                    "绘画过程",
                    "偶像梦幻祭2",
                    "设施组",
                    "PROCREATE",
                    "es",
                    "弓茨",
                  ],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
            },
            {
              id: "1004070237",
              content:
                "【5.2上海eso舞台】Acanthe+美丽的夜莺 二连跳 -Valkyrie-,影片美伽：莫言@莫言是个憨批  \r\n斋宫宗：梓桑@木辛叒木  \r\n非常感谢莫言大人愿意来陪我圆梦了一直执念着的瓦爬台！虽然中间发生了些抓马事件但是是一次非常愉快的合作 ！\r\n上台有点仓促所以放了好多炮致歉啊啊啊啊",
              link: "http://www.bilibili.com/video/av1004070237",
              publishTime: "2024-05-05 08:00:00",
              emotion: {
                label: "正向",
                value: "positive",
              },
              authorId: "23178061",
              authorName: "木辛叒木",
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1004070237",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "【5.2上海eso舞台】Acanthe+美丽的夜莺 二连跳 -Valkyrie-,影片美伽：莫言@莫言是个憨批  \r\n斋宫宗：梓桑@木辛叒木  \r\n非常感谢莫言大人愿意来陪我圆梦了一直执念着的瓦爬台！虽然中间发生了些抓马事件但是是一次非常愉快的合作 ！\r\n上台有点仓促所以放了好多炮致歉啊啊啊啊",
                作者ID: "23178061",
                作者: "木辛叒木",
                发布时间: "2024-05-05 08:00:00",
                更新时间: "2024-05-06 08:40:11",
                采集时间: "2024-05-05 08:30:10",
                整体情感: {
                  label: "正向",
                  value: "positive",
                },
                ABAS分析: [
                  {
                    评价维度: "舞台表现",
                    观点词: "非常愉快的合作",
                    情感倾向: "positive",
                  },
                  {
                    评价维度: "抓马事件",
                    观点词: "发生了些",
                    情感倾向: "negative",
                  },
                  {
                    评价维度: "炮",
                    观点词: "放了好多",
                    情感倾向: "neutral",
                  },
                ],
                其他: {
                  子分区名称: "宅舞",
                  "稿件总时长（秒）": 463,
                  稿件参与的活动id: 1725213,
                  播放数: 393,
                  评论数: 10,
                  收藏数: 23,
                  投币数: 26,
                  分享数: 4,
                  获赞数: 55,
                  粉丝数: 269,
                  关注数: 250,
                  标签: [
                    "Acanthe",
                    "我在漫展跳宅舞",
                    "偶像梦幻祭",
                    "宅舞翻跳",
                    "斋宫宗",
                    "cos",
                    "影片美伽",
                    "美丽的夜莺",
                    "ESO",
                    "Valkyrie",
                    "BDF2024宅舞大赛",
                  ],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
            },
            {
              id: "1004074240",
              content:
                "【AI金玟庭】Winter-Silent Oath (原唱:Knights),看到李茂珍节目上冬冬的这个造型就想做这首了，特别合适\n歌词来源网易云（侵权删）",
              link: "http://www.bilibili.com/video/av1004074240",
              publishTime: "2024-05-05 13:25:31",
              emotion: {
                label: "正向",
                value: "positive",
              },
              authorId: "435997098",
              authorName: "夕言shika_",
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1004074240",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "【AI金玟庭】Winter-Silent Oath (原唱:Knights),看到李茂珍节目上冬冬的这个造型就想做这首了，特别合适\n歌词来源网易云（侵权删）",
                作者ID: "435997098",
                作者: "夕言shika_",
                发布时间: "2024-05-05 13:25:31",
                更新时间: "2024-05-06 13:40:06",
                采集时间: "2024-05-05 13:30:20",
                整体情感: {
                  label: "正向",
                  value: "positive",
                },
                ABAS分析: [
                  {
                    评价维度: "造型",
                    观点词: "特别合适",
                    情感倾向: "positive",
                  },
                ],
                其他: {
                  子分区名称: "翻唱",
                  "稿件总时长（秒）": 312,
                  播放数: 192,
                  评论数: 2,
                  分享数: 1,
                  获赞数: 1,
                  粉丝数: 252,
                  关注数: 90,
                  签名: "一般es人 斋宫宗单推 cp看板不拆不逆\n初三生\n",
                  标签: [
                    "Silent Oath",
                    "AI",
                    "偶像梦幻祭2",
                    "aespa",
                    "金玟庭",
                    "金旼炡",
                    "Knights",
                    "Winter",
                    "es2",
                  ],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
            },
            {
              id: "1004081922",
              content: "es出物视频第二期/内含其他古早IP想要可以一起,-",
              link: "http://www.bilibili.com/video/av1004081922",
              publishTime: "2024-05-05 22:25:16",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: "521127240",
              authorName: "釒艮銀",
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1004081922",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "es出物视频第二期/内含其他古早IP想要可以一起,-",
                作者ID: "521127240",
                作者: "釒艮銀",
                发布时间: "2024-05-05 22:25:16",
                更新时间: "2024-05-06 22:40:11",
                采集时间: "2024-05-05 22:30:09",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [
                  {
                    评价维度: "es出物视频",
                    观点词: "第二期/内含其他古早IP想要可以一起",
                    情感倾向: "neutral",
                  },
                ],
                其他: {
                  子分区名称: "日常",
                  "稿件总时长（秒）": 31,
                  播放数: 134,
                  评论数: 2,
                  获赞数: 4,
                  粉丝数: 70,
                  关注数: 70,
                  标签: [
                    "Ylang Ylang",
                    "偶像梦幻祭",
                    "偶像梦幻祭2",
                    "必剪创作",
                  ],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
            },
            {
              id: "1004083166",
              content: "大人们的ringing evil phone（？,-",
              link: "http://www.bilibili.com/video/av1004083166",
              publishTime: "2024-05-05 14:19:14",
              emotion: {
                label: "负向",
                value: "negative",
              },
              authorId: "3493295453898943",
              authorName: "银雪玖",
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1004083166",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "大人们的ringing evil phone（？,-",
                作者ID: "3493295453898943",
                作者: "银雪玖",
                发布时间: "2024-05-05 14:19:14",
                更新时间: "2024-05-06 14:40:12",
                采集时间: "2024-05-05 14:30:17",
                整体情感: {
                  label: "负向",
                  value: "negative",
                },
                ABAS分析: [],
                其他: {
                  子分区名称: "音游",
                  "稿件总时长（秒）": 165,
                  播放数: 11,
                  评论数: 1,
                  获赞数: 1,
                  粉丝数: 51,
                  关注数: 812,
                  签名: "我只是个爱唱歌，爱小哥哥小姐姐，爱看直播，爱vtuber，爱画画，爱玩es的人",
                  标签: ["音乐游戏", "二次元", "偶像梦幻祭", "偶像梦幻祭2"],
                },
              },
              textType: {
                label: "其他",
                value: "others",
              },
            },
          ],
          filterOptions: {
            channelContentType: [
              {
                label: "全部",
                value: "",
              },
              {
                value: "weibo-comment",
                label: "新浪微博-评论",
              },
              {
                value: "taptap-post",
                label: "TapTap-帖子",
              },
              {
                value: "huawei-review",
                label: "华为应用中心-评价",
              },
              {
                value: "weibo-ref_micro_blog",
                label: "新浪微博-转发微博",
              },
              {
                value: "huawei-review_score",
                label: "华为应用中心-评分",
              },
              {
                value: "bilibili-review",
                label: "BiliBili-评价",
              },
              {
                value: "weibo-micro_blog",
                label: "新浪微博-原创微博",
              },
              {
                value: "bilibili-comment",
                label: "BiliBili-评论",
              },
              {
                value: "appstore-review",
                label: "苹果应用商店-评价",
              },
              {
                value: "bilibili-video",
                label: "BiliBili-视频",
              },
              {
                value: "douyin-short_video",
                label: "抖音短视频-短视频",
              },
              {
                value: "bilibili-review_score",
                label: "BiliBili-评分",
              },
            ],
            textType: [
              {
                label: "全部",
                value: "",
              },
              {
                label: "交易相关",
                value: "transaction_discussion",
              },
              {
                label: "常规信息",
                value: "default",
              },
              {
                label: "其他",
                value: "others",
              },
              {
                label: "技术支持",
                value: "technical_support",
              },
              {
                label: "用户反馈",
                value: "user_feedback",
              },
              {
                label: "粉丝内容",
                value: "fan_content",
              },
              {
                label: "游戏讨论",
                value: "gameplay_discussion",
              },
              {
                label: "闲聊",
                value: "off-topic-discussions",
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
        },
      };
    },
  },
];

// 获取table列表
// url: "/api/alertrules/",

// 删除 报警项
// url: `/api/alertrules/deletebyids`,

//订阅简报
// url: `/api/alertrules/${data.id}/subscribe`,

// 取消订阅简报
// url: `/api/alertrules/${data.id}/unsubscribe`,

// 保存报警设置
//"/api/alertrules/",

// 更新报警设置
// url: `/api/alertrules/${data.id}`,

//根据id 获取预警配置的内容
//url: `/api/alertrules/${params.id}`,

// 获取预警成员列表
// url: `/api/users`,

// 获取过滤条件选项 同趋势分析
// url: "/api/ds/tables",

// 获取预警分析页面的 预警过滤器选项
// url: "http://localhost:3000/warn/filters"
