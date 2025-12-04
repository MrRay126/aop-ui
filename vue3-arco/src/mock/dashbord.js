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
  //获取项目列表(全局)
  {
    url: "/api/projects/",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: [
          {
            id: 1,
            name: "偶像梦幻祭2",
            code: "saki",
            created_at: "2022-12-17 20:13:27",
            updated_at: "2022-12-17 20:13:27",
            created_by_user: null,
            updated_by_user: null,
          },
          {
            id: 2,
            name: "test_proj2",
            code: "abc",
            created_at: "2022-12-17 20:13:53",
            updated_at: "2022-12-17 20:13:53",
            created_by_user: null,
            updated_by_user: null,
          },
        ],
        message: "",
      };
    },
  },

  //报表列表数据(drawer)
  {
    url: "/api/reports/",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: genOptions(10, (index) => {
          return {
            id: 142 + index,
            name: "trend111",
            comment: "trend111",
            type: "trend",
          };
        }),
        message: "",
      };
    },
  },

  //获取菜单
  {
    url: "/api/projects/:id/folders",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: [
          {
            id: 0,
            children: [
              {
                title: "舆情概览",
                name: "舆情概览",
                id: 55,
                type: "simple",
                spaceType: "system",
                dashbordPerms: {
                  rename: false,
                  remove: false,
                  move: false,
                  read: false,
                  share: false,
                  edit: false,
                },
              },
              {
                title: "预警分析",
                name: "预警分析",
                id: 56,
                type: "warn",
                spaceType: "system",
                dashbordPerms: {
                  rename: false,
                  remove: false,
                  move: false,
                  read: false,
                  share: false,
                  edit: false,
                },
              },
            ],
            name: "系统看板",
            spacePerms: {
              rename: false,
              remove: false,
              move: false,
              read: true,
              share: false,
            },
            title: "系统看板",
            description: null,
            uid: "57aa5u687",
            slug: "",
            created_at: null,
            updated_at: null,
            version: 1,
            type: "system",
            created_by_user: null,
            updated_by_user: null,
            parent: null,
            project: null,
          },
          {
            id: 0,
            children: [
              {
                title: "用户看板1",
                name: "用户看板1",
                id: 13,
                type: "opinion",
                spaceType: "mine",
                dashbordPerms: {
                  rename: true,
                  remove: true,
                  move: true,
                  read: true,
                  share: true,
                  edit: true,
                },
              },
              {
                title: "kan2",
                name: "kan2",
                id: 20,
                type: "opinion",
                spaceType: "mine",
                dashbordPerms: {
                  rename: true,
                  remove: true,
                  move: true,
                  read: true,
                  share: true,
                  edit: true,
                },
              },
            ],
            name: "我的看板",
            spacePerms: {
              rename: false,
              remove: false,
              move: false,
              read: true,
              share: false,
            },
            title: "我的看板",
            description: null,
            uid: "3BEERDWFa",
            slug: "",
            created_at: null,
            updated_at: null,
            version: 1,
            type: "mine",
            created_by_user: null,
            updated_by_user: null,
            parent: null,
            project: null,
          },
          {
            id: 28,
            children: [],
            name: "新建空间2",
            spacePerms: {
              rename: true,
              remove: true,
              move: true,
              read: true,
              share: true,
            },
            title: "新建空间2",
            description: null,
            uid: "4KEebYku7",
            slug: "xin-jian-kong-jian-1",
            created_at: "2023-02-27 18:21:39",
            updated_at: "2023-02-27 18:21:39",
            version: 1,
            type: "myCreated",
            created_by_user: 4,
            updated_by_user: 4,
            parent: null,
            project: 1,
          },
          {
            id: 35,
            children: [],
            name: "sapnce----sss",
            spacePerms: {
              rename: true,
              remove: true,
              move: true,
              read: true,
              share: true,
            },
            title: "sapnce----sss",
            description: null,
            uid: "5QxT8UWbK",
            slug: "sapnce-sss",
            created_at: "2023-03-01 15:27:54",
            updated_at: "2023-03-01 15:27:54",
            version: 1,
            type: "myCreated",
            created_by_user: 4,
            updated_by_user: 4,
            parent: null,
            project: 1,
          },
          {
            id: 36,
            children: [
              {
                title: "dash1",
                name: "dash1",
                id: 48,
                type: "opinion",
                spaceType: "myCreated",
                dashbordPerms: {
                  rename: true,
                  remove: true,
                  move: true,
                  read: true,
                  share: true,
                  edit: true,
                },
              },
              {
                title: "dasbsssssss",
                name: "dasbsssssss",
                id: 49,
                type: "opinion",
                spaceType: "myCreated",
                dashbordPerms: {
                  rename: true,
                  remove: true,
                  move: true,
                  read: true,
                  share: true,
                  edit: true,
                },
              },
            ],
            name: "空间空间空间空间空间空间空间空间空间空间空间",
            spacePerms: {
              rename: true,
              remove: true,
              move: true,
              read: true,
              share: true,
            },
            title: "空间空间空间空间空间空间空间空间空间空间空间",
            description: null,
            uid: "4TM5MAU8N",
            slug: "kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian",
            created_at: "2023-03-01 16:56:23",
            updated_at: "2023-03-01 16:56:23",
            version: 1,
            type: "myCreated",
            created_by_user: 4,
            updated_by_user: 4,
            parent: null,
            project: 1,
          },
          {
            id: 0,
            children: [
              {
                title: "谢明勋测试（mingxun.xie）",
                name: "谢明勋测试（mingxun.xie）",
                id: 18,
                type: "opinion",
                spaceType: "sharedToMe",
                dashbordPerms: {
                  rename: false,
                  remove: false,
                  move: false,
                  read: true,
                  share: false,
                  edit: false,
                },
              },
            ],
            name: "共享空间（mingxun.xie）",
            spacePerms: {
              rename: false,
              remove: false,
              move: false,
              read: true,
              share: false,
            },
            title: "共享空间（mingxun.xie）",
            description: null,
            uid: "4rsLEPhwE",
            slug: "",
            created_at: null,
            updated_at: null,
            version: 1,
            type: "sharedToMe",
            created_by_user: null,
            updated_by_user: null,
            parent: null,
            project: null,
          },
          {
            id: 0,
            children: [
              {
                title: "粉丝数（yimeng.liu）",
                name: "粉丝数（yimeng.liu）",
                id: 54,
                type: "opinion",
                spaceType: "sharedToMe",
                dashbordPerms: {
                  rename: false,
                  remove: false,
                  move: false,
                  read: true,
                  share: false,
                  edit: false,
                },
              },
            ],
            name: "共享空间（yimeng.liu）",
            spacePerms: {
              rename: false,
              remove: false,
              move: false,
              read: true,
              share: false,
            },
            title: "共享空间（yimeng.liu）",
            description: null,
            uid: "4NPTR27iL",
            slug: "",
            created_at: null,
            updated_at: null,
            version: 1,
            type: "sharedToMe",
            created_by_user: null,
            updated_by_user: null,
            parent: null,
            project: null,
          },
        ],
        message: "",
      };
    },
  },

  //获取菜单项的dashbord
  {
    url: "/api/dashboards/:id",
    method: "get",
    handler: async (ctx) => {
      await delay(200);
      ctx.body = {
        code: 0,
        data: {
          id: 55,
          panels: [
            {
              aop_type: "total",
              tooltipText:
                "总内容量<br/>总内容量：一定时间、一定渠道范围内媒体内容的总和<br/><br/>当前支持渠道内容：B站视频、TapTap评论、微博帖子",
              transformations: [],
              time: {
                type: "relative",
                recent_day: "0-0",
              },
              queries: [],
              project_id: null,
            },
            {
              aop_type: "positive",
              tooltipText:
                "正向内容量<br/>正向内容量：一定时间、一定渠道范围内情感分析为正向的媒体内容的总和<br/><br/>当前情感分析由NLP算法实现，我们会逐步提高其准确率",
              transformations: [],
              time: {
                type: "relative",
                recent_day: "0-0",
              },
              queries: [],
              project_id: null,
            },
            {
              aop_type: "negative",
              tooltipText:
                "负向内容量<br/>负向内容量：一定时间、一定渠道范围内情感分析为负向的媒体内容的总和<br/><br/>当前情感分析由NLP算法实现，我们会逐步提高其准确率",
              transformations: [],
              time: {
                type: "relative",
                recent_day: "0-0",
              },
              queries: [],
              project_id: null,
            },
            {
              aop_type: "pie",
              tooltipText:
                "正负占比<br/>当前情感分析由NLP算法实现，我们会逐步提高其准确率",
              transformations: [],
              time: {
                type: "relative",
                recent_day: "0-0",
              },
              queries: [],
              project_id: null,
            },
            {
              aop_type: "hotPoint",
              transformations: [],
              time: {
                type: "relative",
                recent_day: "0-0",
              },
              queries: [],
              project_id: null,
            },
            {
              aop_type: "channel",
              transformations: [],
              time: {
                type: "relative",
                recent_day: "0-0",
              },
              queries: [],
              project_id: null,
            },
          ],
          title: "舆情概览",
          description: "",
          uid: "5kp6477jK",
          slug: "yu-qing-gai-lan",
          created_at: "2023-02-08 16:09:00",
          updated_at: "2023-02-08 16:09:00",
          version: 1,
          type: "simple",
          schedule_type: 1,
          schedule_time: null,
          acl_type: 1,
          created_by_user: null,
          updated_by_user: null,
          folder: null,
          project: null,
          reports: [],
        },
        message: "",
      };
    },
  },

  //获取<舆情概览>面板某个卡片的数据
  {
    url: "/api/ds/query",
    method: "post",
    handler: async (ctx) => {
      await delay(200);
      const aop_type = ctx.request.body.aop_type;
      const data_of_aop_type = {
        total: {
          status: 3,
          rate: {
            week: {
              data: "11.91%",
              isUp: false,
            },
            day: {
              data: "217.75%",
              isUp: true,
            },
          },
          count: 7699,
          chartData: {
            dimensions: ["date", "count"],
            source: [
              {
                date: "2023-04-21 00:00:00",
                count: 8012,
              },
            ],
          },
          avgCount: 7699,
        },
        positive: {
          status: 3,
          debug_sqls: [
            'SELECT "sq0"."time_unit",COALESCE("sq1"."content_count",0) "content_count" FROM (SELECT time_unit FROM generate_series(\'2023-04-21 00:00:00\',\'2023-04-27 23:59:59.999999\',INTERVAL \'86400 SECOND\') "time_unit") "sq0" LEFT JOIN (SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",date_trunc(\'day\',pub_time) "time_unit" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-21T00:00:00\' AND \'2023-04-27T23:59:59.999999\' AND "project"=\'saki\' AND "sentiment_rough"=\'positive\' GROUP BY "time_unit") "sq1" ON "sq0"."time_unit"="sq1"."time_unit" ORDER BY "sq0"."time_unit" ASC',
            'select jsonb_object_agg(t1."X", t1.content_count) as "result" from ((SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",\'today\' as "X" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-27T00:00:00\' AND \'2023-04-27T17:02:29.576318\' AND "project"=\'saki\' AND "sentiment_rough"=\'positive\') UNION (SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",\'yesterday\' as "X" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-26T00:00:00\' AND \'2023-04-26T17:02:29.576318\' AND "project"=\'saki\' AND "sentiment_rough"=\'positive\') UNION (SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",\'this_week\' as "X" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-24T00:00:00\' AND \'2023-04-27T17:02:29.576318\' AND "project"=\'saki\' AND "sentiment_rough"=\'positive\') UNION (SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",\'last_week\' as "X" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-17T00:00:00\' AND \'2023-04-20T17:02:29.576318\' AND "project"=\'saki\' AND "sentiment_rough"=\'positive\')) t1',
          ],
          rate: {
            week: {
              data: "21.48%",
              isUp: false,
            },
            day: {
              data: "89.37%",
              isUp: true,
            },
          },
          count: 392,
          chartData: {
            dimensions: ["date", "count"],
            source: [
              {
                date: "2023-04-21 00:00:00",
                count: 8012,
              },
            ],
          },
          avgCount: 392,
        },
        negative: {
          status: 3,
          debug_sqls: [
            'SELECT "sq0"."time_unit",COALESCE("sq1"."content_count",0) "content_count" FROM (SELECT time_unit FROM generate_series(\'2023-04-21 00:00:00\',\'2023-04-27 23:59:59.999999\',INTERVAL \'86400 SECOND\') "time_unit") "sq0" LEFT JOIN (SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",date_trunc(\'day\',pub_time) "time_unit" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-21T00:00:00\' AND \'2023-04-27T23:59:59.999999\' AND "project"=\'saki\' AND "sentiment_rough"=\'negative\' GROUP BY "time_unit") "sq1" ON "sq0"."time_unit"="sq1"."time_unit" ORDER BY "sq0"."time_unit" ASC',
            'select jsonb_object_agg(t1."X", t1.content_count) as "result" from ((SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",\'today\' as "X" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-27T00:00:00\' AND \'2023-04-27T17:02:29.576334\' AND "project"=\'saki\' AND "sentiment_rough"=\'negative\') UNION (SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",\'yesterday\' as "X" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-26T00:00:00\' AND \'2023-04-26T17:02:29.576334\' AND "project"=\'saki\' AND "sentiment_rough"=\'negative\') UNION (SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",\'this_week\' as "X" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-24T00:00:00\' AND \'2023-04-27T17:02:29.576334\' AND "project"=\'saki\' AND "sentiment_rough"=\'negative\') UNION (SELECT COUNT(DISTINCT "id"||"channel"||"content_type") "content_count",\'last_week\' as "X" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-17T00:00:00\' AND \'2023-04-20T17:02:29.576334\' AND "project"=\'saki\' AND "sentiment_rough"=\'negative\')) t1',
          ],
          rate: {
            week: {
              data: "20.23%",
              isUp: false,
            },
            day: {
              data: "52.15%",
              isUp: true,
            },
          },
          count: 248,
          chartData: {
            dimensions: ["date", "count"],
            source: [
              {
                date: "2023-04-21 00:00:00",
                count: 8012,
              },
            ],
          },
          avgCount: 248,
        },

        // 饼图
        pie: {
          status: 3,
          pie: {
            positive: {
              name: "正向",
              value: 392,
            },
            negative: {
              name: "负向",
              value: 248,
            },
            others: {
              name: "中性",
              value: 7059,
            },
          },
        },

        // 渠道
        channel: {
          status: 3,
          debug_sqls: [
            "SELECT COUNT(DISTINCT id||channel||content_type) content_count,channel,content_type FROM aop.ods_aop WHERE pub_time BETWEEN '2023-04-27T00:00:00' AND '2023-04-27T17:02:29.569264' AND project='saki' GROUP BY channel,content_type",
            'SELECT TO_CHAR(date_trunc(\'hour\',pub_time),\'YYYY-MM-DD HH24:MI:SS\') "time_unit","channel",COUNT(DISTINCT "id"||"channel"||"content_type") "content_count" FROM "aop"."ods_aop" WHERE "pub_time" BETWEEN \'2023-04-27T00:00:00\' AND \'2023-04-27T17:02:29.569264\' AND "project"=\'saki\' GROUP BY "time_unit","channel" ORDER BY "time_unit" ASC,"channel" ASC',
          ],
          chartData: {
            dimensions: ["渠道", "数量"],
            source: genOptions(10, (index) => {
              return {
                渠道: pluckRandom(["微博-博文", "b站"]),
                数量: 829 + index,
              };
            }),
          },
          rankList: genOptions(10, (index) => {
            return {
              title: "微博-转发",
              count: 6680 + index,
              filter: {
                channel: pluckRandom(["weibo", "bilibili"]),
                content_type: "ref_micro_blog",
              },
            };
          }),

          legend: ["bilibili"],
          data: genOptions(10, (index) => {
            return ["2023-04-27 00:00:0" + index, 30 + index, "bilibili"];
          }),
        },

        //热点
        hotPoint: {
          wordType: "高频词",
          chartData: {
            高频词: genOptions(10, (index) => {
              return {
                name: "快乐" + index,
                value: 434,
                positive: 90,
                negative: 10,
                neutral: 334,
              };
            }),
          },
          rankList: {
            taptap: genOptions(10, (index) => {
              return {
                name: "千山万水总是情，给点凪砂日和追忆行不行，想看年少刚认识的时候的冲突，公主说自己曾经不耐烦过，凪砂说让日和君费心了，那么本来不太熟的两个人又是怎样磨合成亲密无间的家人的，凪砂又是怎么从怕生腼腆到和公主形影不离的，这些我ballball官方给点吧",
                value: 35 + index,
                link: "https://www.taptap.cn/review/35789123",
              };
            }),

            bilibili: genOptions(10, (index) => {
              return {
                name: "千山万水总是情，给点凪砂日和追忆行不行，想看年少刚认识的时候的冲突，公主说自己曾经不耐烦过，凪砂说让日和君费心了，那么本来不太熟的两个人又是怎样磨合成亲密无间的家人的，凪砂又是怎么从怕生腼腆到和公主形影不离的，这些我ballball官方给点吧",
                value: 35 + index,
                link: "https://www.taptap.cn/review/35789123",
              };
            }),

            weibo: genOptions(10, (index) => {
              return {
                name: "千山万水总是情，给点凪砂日和追忆行不行，想看年少刚认识的时候的冲突，公主说自己曾经不耐烦过，凪砂说让日和君费心了，那么本来不太熟的两个人又是怎样磨合成亲密无间的家人的，凪砂又是怎么从怕生腼腆到和公主形影不离的，这些我ballball官方给点吧",
                value: 35 + index,
                link: "https://www.taptap.cn/review/35789123",
              };
            }),
          },
        },
      };

      ctx.body = {
        code: 0,
        data: data_of_aop_type[aop_type],
        message: "",
      };
    },
  },

  // 舆情概览涉及的详情数据
  {
    url: "/api/ds/q/search",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {
          list: [
            {
              id: "4894926317557618",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "转发微博",
              author_id: "7490405364",
              author_name: "悠木耳",
              publish_time: "2023-04-27 00:00:40",
              collect_time: "2023-04-27 00:05:42",
              emotion: "中性",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926317557618",
              authorId: "7490405364",
              authorName: "悠木耳",
              others:
                '{"region_name": "发布于 浙江", "reposts_count": 0, "comments_count": 0, "attitudes_count": 0}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:00:40",
              collectionTime: "2023-04-27 00:05:42",
            },
            {
              id: "4894926334334519",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "仁哥生日快乐！",
              author_id: "6818239805",
              author_name: "Dorothy星辰",
              publish_time: "2023-04-27 00:00:44",
              collect_time: "2023-04-27 02:59:03",
              emotion: "中性",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926334334519",
              authorId: "6818239805",
              authorName: "Dorothy星辰",
              others:
                '{"region_name": "发布于 山西", "reposts_count": 0, "comments_count": 0, "attitudes_count": 0}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:00:44",
              collectionTime: "2023-04-27 02:59:03",
            },
            {
              id: "4894926346918226",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "兔兔——生日快乐宝贝！！！[抱一抱][抱一抱]",
              author_id: "5727345963",
              author_name: "芒果清酒不会喝酒",
              publish_time: "2023-04-27 00:00:47",
              collect_time: "2023-04-27 02:59:03",
              emotion: "正向",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926346918226",
              authorId: "5727345963",
              authorName: "芒果清酒不会喝酒",
              others:
                '{"region_name": "发布于 湖南", "reposts_count": 0, "comments_count": 0, "attitudes_count": 1}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:00:47",
              collectionTime: "2023-04-27 02:59:03",
            },
            {
              id: "4894926431326563",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "@限定芝士泡芙 你宝！",
              author_id: "7080344150",
              author_name: "歪吱乱嘎",
              publish_time: "2023-04-27 00:01:07",
              collect_time: "2023-04-27 02:59:05",
              emotion: "中性",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926431326563",
              authorId: "7080344150",
              authorName: "歪吱乱嘎",
              others:
                '{"region_name": "发布于 陕西", "reposts_count": 0, "comments_count": 2, "attitudes_count": 0}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:01:07",
              collectionTime: "2023-04-27 02:59:05",
            },
            {
              id: "4894926443381815",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "兔兔生日快乐！！！[送花花][送花花]",
              author_id: "1917123750",
              author_name: "阿落的废话罐子",
              publish_time: "2023-04-27 00:01:09",
              collect_time: "2023-04-27 02:59:03",
              emotion: "正向",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926443381815",
              authorId: "1917123750",
              authorName: "阿落的废话罐子",
              others:
                '{"region_name": "发布于 上海", "reposts_count": 0, "comments_count": 0, "attitudes_count": 0}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:01:09",
              collectionTime: "2023-04-27 02:59:03",
            },
            {
              id: "4894926447315410",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "生日快乐！！",
              author_id: "7213185528",
              author_name: "奈西子",
              publish_time: "2023-04-27 00:01:11",
              collect_time: "2023-04-27 02:59:03",
              emotion: "中性",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926447315410",
              authorId: "7213185528",
              authorName: "奈西子",
              others:
                '{"region_name": "发布于 湖南", "reposts_count": 0, "comments_count": 0, "attitudes_count": 0}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:01:11",
              collectionTime: "2023-04-27 02:59:03",
            },
            {
              id: "4894926448364540",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "我们宝宝生日快乐[親親][親親]",
              author_id: "7726488980",
              author_name: "彗星冷酷運轉",
              publish_time: "2023-04-27 00:01:11",
              collect_time: "2023-04-27 02:59:02",
              emotion: "中性",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926448364540",
              authorId: "7726488980",
              authorName: "彗星冷酷運轉",
              others:
                '{"region_name": "发布于 陕西", "reposts_count": 0, "comments_count": 0, "attitudes_count": 0}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:01:11",
              collectionTime: "2023-04-27 02:59:02",
            },
            {
              id: "4894926455969523",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "老婆生日快乐",
              author_id: "7036022027",
              author_name: "夏花欲冬藏",
              publish_time: "2023-04-27 00:01:13",
              collect_time: "2023-04-27 02:59:05",
              emotion: "中性",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926455969523",
              authorId: "7036022027",
              authorName: "夏花欲冬藏",
              others:
                '{"region_name": "发布于 四川", "reposts_count": 0, "comments_count": 0, "attitudes_count": 0}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:01:13",
              collectionTime: "2023-04-27 02:59:05",
            },
            {
              id: "4894926477721844",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "宝宝生日快乐！！上号啦[憧憬]",
              author_id: "7515084818",
              author_name: "Titycito",
              publish_time: "2023-04-27 00:01:17",
              collect_time: "2023-04-27 02:59:02",
              emotion: "正向",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926477721844",
              authorId: "7515084818",
              authorName: "Titycito",
              others:
                '{"region_name": "发布于 宁夏", "reposts_count": 0, "comments_count": 0, "attitudes_count": 0}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:01:17",
              collectionTime: "2023-04-27 02:59:02",
            },
            {
              id: "4894926547977584",
              channel: "weibo",
              content_type: "ref_micro_blog",
              content: "兔兔生日快乐！",
              author_id: "5219579242",
              author_name: "激光缓冲墨水",
              publish_time: "2023-04-27 00:01:35",
              collect_time: "2023-04-27 02:59:02",
              emotion: "中性",
              ABAS: null,
              link: "https://m.weibo.cn/detail/4894926547977584",
              authorId: "5219579242",
              authorName: "激光缓冲墨水",
              others:
                '{"region_name": "发布于 广东", "reposts_count": 0, "comments_count": 0, "attitudes_count": 0}',
              type: "ref_micro_blog",
              publishTime: "2023-04-27 00:01:35",
              collectionTime: "2023-04-27 02:59:02",
            },
          ],
          pager: {
            curPage: 1,
            pageSize: 10,
            total: 6680,
          },
          time: {
            startTime: "2023/04/27",
            endTime: "2023/04/27",
          },
          filterOptions: {
            channel: [
              {
                value: "weibo",
                label: "微博",
              },
            ],
            emotion: [
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
        message: "",
      };
    },
  },

  // 预警看板数据
  {
    url: "/api/alert/trend",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {
          chartData: {
            dimensions: ["time", "ssa"],
            source: [
              {
                time: "2023-04-24 18",
                ssa: 315,
              },
              {
                time: "2023-04-24 19",
                ssa: 393,
              },
              {
                time: "2023-04-24 20",
                ssa: 3104,
              },
              {
                time: "2023-04-24 21",
                ssa: 349,
              },
              {
                time: "2023-04-24 22",
                ssa: 444,
              },
              {
                time: "2023-04-24 23",
                ssa: 2578,
              },
              {
                time: "2023-04-25 00",
                ssa: 276,
              },
              {
                time: "2023-04-25 01",
                ssa: 145,
              },
              {
                time: "2023-04-25 02",
                ssa: 1252,
              },
              {
                time: "2023-04-25 03",
                ssa: 7,
              },
              {
                time: "2023-04-25 04",
                ssa: 1,
              },
              {
                time: "2023-04-25 05",
                ssa: 438,
              },
              {
                time: "2023-04-25 06",
                ssa: 9,
              },
              {
                time: "2023-04-25 07",
                ssa: 44,
              },
              {
                time: "2023-04-25 08",
                ssa: 625,
              },
              {
                time: "2023-04-25 09",
                ssa: 166,
              },
              {
                time: "2023-04-25 10",
                ssa: 284,
              },
              {
                time: "2023-04-25 11",
                ssa: 1590,
              },
              {
                time: "2023-04-25 12",
                ssa: 248,
              },
              {
                time: "2023-04-25 13",
                ssa: 231,
              },
              {
                time: "2023-04-25 14",
                ssa: 436,
              },
              {
                time: "2023-04-25 15",
                ssa: 54,
              },
              {
                time: "2023-04-25 16",
                ssa: 47,
              },
              {
                time: "2023-04-25 17",
                ssa: 112,
              },
              {
                time: "2023-04-25 18",
                ssa: 137,
              },
              {
                time: "2023-04-25 19",
                ssa: 87,
              },
              {
                time: "2023-04-25 20",
                ssa: 95,
              },
              {
                time: "2023-04-25 21",
                ssa: 403,
              },
              {
                time: "2023-04-25 22",
                ssa: 226,
              },
              {
                time: "2023-04-25 23",
                ssa: 139,
              },
              {
                time: "2023-04-26 00",
                ssa: 781,
              },
              {
                time: "2023-04-26 01",
                ssa: 49,
              },
              {
                time: "2023-04-26 02",
                ssa: 59,
              },
              {
                time: "2023-04-26 03",
                ssa: 446,
              },
              {
                time: "2023-04-26 04",
                ssa: 7,
              },
              {
                time: "2023-04-26 05",
                ssa: 7,
              },
              {
                time: "2023-04-26 06",
                ssa: 41,
              },
              {
                time: "2023-04-26 07",
                ssa: 18,
              },
              {
                time: "2023-04-26 08",
                ssa: 27,
              },
              {
                time: "2023-04-26 09",
                ssa: 406,
              },
              {
                time: "2023-04-26 10",
                ssa: 57,
              },
              {
                time: "2023-04-26 11",
                ssa: 60,
              },
              {
                time: "2023-04-26 12",
                ssa: 340,
              },
              {
                time: "2023-04-26 13",
                ssa: 71,
              },
              {
                time: "2023-04-26 14",
                ssa: 82,
              },
              {
                time: "2023-04-26 15",
                ssa: 349,
              },
              {
                time: "2023-04-26 16",
                ssa: 63,
              },
              {
                time: "2023-04-26 17",
                ssa: 59,
              },
              {
                time: "2023-04-26 18",
                ssa: 328,
              },
              {
                time: "2023-04-26 19",
                ssa: 102,
              },
              {
                time: "2023-04-26 20",
                ssa: 123,
              },
              {
                time: "2023-04-26 21",
                ssa: 566,
              },
              {
                time: "2023-04-26 22",
                ssa: 138,
              },
              {
                time: "2023-04-26 23",
                ssa: 167,
              },
              {
                time: "2023-04-27 00",
                ssa: 449,
              },
              {
                time: "2023-04-27 01",
                ssa: 42,
              },
              {
                time: "2023-04-27 02",
                ssa: 238,
              },
              {
                time: "2023-04-27 03",
                ssa: 16,
              },
              {
                time: "2023-04-27 04",
                ssa: 8,
              },
              {
                time: "2023-04-27 05",
                ssa: 19,
              },
              {
                time: "2023-04-27 06",
                ssa: 10,
              },
              {
                time: "2023-04-27 07",
                ssa: 23,
              },
              {
                time: "2023-04-27 08",
                ssa: 134,
              },
              {
                time: "2023-04-27 09",
                ssa: 44,
              },
              {
                time: "2023-04-27 10",
                ssa: 45,
              },
              {
                time: "2023-04-27 11",
                ssa: 304,
              },
              {
                time: "2023-04-27 12",
                ssa: 171,
              },
              {
                time: "2023-04-27 13",
                ssa: 143,
              },
              {
                time: "2023-04-27 14",
                ssa: 5646,
              },
              {
                time: "2023-04-27 15",
                ssa: 273,
              },
              {
                time: "2023-04-27 16",
                ssa: 95,
              },
              {
                time: "2023-04-27 17",
                ssa: 61,
              },
            ],
          },
          tableData: {
            pager: {
              total: 25972,
              pageSize: 10,
              curPage: 1,
            },
            source: [
              {
                ref_id: "4894114044184863",
                created_at: "2023-04-24 18:13:03",
                tags: ["ssa"],
                levels: [3],
                id: "4894114044184863",
                content:
                  "#偶像梦幻祭[超话]#问问夏目复活节的柄谷子在煤炉要搜什么关键词 ​​​",
                link: "https://m.weibo.cn/detail/4894114044184863",
                channel: "微博",
                author: "要和牙医一起吃雪糕",
                time: "2023-04-24 18:12:59",
              },
              {
                ref_id: "4894113827390190",
                created_at: "2023-04-24 18:13:03",
                tags: ["ssa"],
                levels: [3],
                id: "4894113827390190",
                content:
                  "#偶像梦幻祭[超话]#推推ins卡掉落，只用肾尾款，咪们看看[泪][泪] ​​​",
                link: "https://m.weibo.cn/detail/4894113827390190",
                channel: "微博",
                author: "ikoZzzz",
                time: "2023-04-24 18:12:07",
              },
              {
                ref_id: "4894114330710625",
                created_at: "2023-04-24 18:14:14",
                tags: ["ssa"],
                levels: [3],
                id: "4894114330710625",
                content: "#偶像梦幻祭[超话]# 大刀出 万圣栗签吧90 一个 ​​​",
                link: "https://m.weibo.cn/detail/4894114330710625",
                channel: "微博",
                author: "濑濑仁仁",
                time: "2023-04-24 18:14:07",
              },
              {
                ref_id: "4894114233194615",
                created_at: "2023-04-24 18:14:14",
                tags: ["ssa"],
                levels: [3],
                id: "4894114233194615",
                content:
                  "#偶像梦幻祭[超话]##valkyrie# \npo一套陈年老图（\n\n去年11月为了cp画的结果cp寄了，半年后想起来这图忘记做东西了x\n总之印的拍立得cp29先作为无料放送…！ \n\n领取条件：\n1、关注我账号\n2、自证是喜欢我产品的人（游戏，谷，产出均可） ​​​",
                link: "https://m.weibo.cn/detail/4894114233194615",
                channel: "微博",
                author: "你喝奶茶不加盐吗",
                time: "2023-04-24 18:13:44",
              },
              {
                ref_id: "4894114221136000",
                created_at: "2023-04-24 18:14:14",
                tags: ["ssa"],
                levels: [3],
                id: "4894114221136000",
                content: "#偶像梦幻祭[超话]# 接速刷琥珀！ ​​​",
                link: "https://m.weibo.cn/detail/4894114221136000",
                channel: "微博",
                author: "夜璃光",
                time: "2023-04-24 18:13:41",
              },
              {
                ref_id: "355398128",
                created_at: "2023-04-24 18:16:37",
                tags: ["ssa"],
                levels: [3],
                id: "355398128",
                content:
                  "【es大楼】天城一彩《边缘而生》特演：在现场，我是手（？）,-",
                link: "http://www.bilibili.com/video/av355398128",
                channel: "B站",
                author: "乌鲁克市民言峰轻雨",
                time: "2023-04-24 18:15:40",
              },
              {
                ref_id: "4894114891697087",
                created_at: "2023-04-24 18:16:37",
                tags: ["ssa"],
                levels: [3],
                id: "4894114891697087",
                content:
                  "#偶像梦幻祭[超话]# 收点漂亮便宜的吧唧，可以有伤，挂包上用的没想好好保护[赢牛奶] ​​​",
                link: "https://m.weibo.cn/detail/4894114891697087",
                channel: "微博",
                author: "柠檬籽榨汁机",
                time: "2023-04-24 18:16:21",
              },
              {
                ref_id: "4894114703218066",
                created_at: "2023-04-24 18:16:37",
                tags: ["ssa"],
                levels: [3],
                id: "4894114703218066",
                content:
                  "#偶像梦幻祭[超话]##春川宙[超话]# \n点击即刻拯救跑路人[开学季] ​​​",
                link: "https://m.weibo.cn/detail/4894114703218066",
                channel: "微博",
                author: "杯面杯面杯面",
                time: "2023-04-24 18:15:36",
              },
              {
                ref_id: "35747909",
                created_at: "2023-04-24 18:17:52",
                tags: ["ssa"],
                levels: [3],
                id: "35747909",
                content:
                  "碎了点钻拿到一卡了，轻松撤退，明明不是推但是这张琥珀真的很好看",
                link: "https://www.taptap.cn/review/35747909",
                channel: "TapTap",
                author: "罗宝线",
                time: "2023-04-24 18:06:06",
              },
              {
                ref_id: "4894115097483256",
                created_at: "2023-04-24 18:17:52",
                tags: ["ssa"],
                levels: [3],
                id: "4894115097483256",
                content:
                  "#偶像梦幻祭2[超话]#忘记发了，最近手不顺，感觉pc没希望了 ​​​",
                link: "https://m.weibo.cn/detail/4894115097483256",
                channel: "微博",
                author: "镜像森林里的玩偶士兵",
                time: "2023-04-24 18:17:10",
              },
            ],
            filterOptions: {
              levels: [
                {
                  label: "一级",
                  value: 1,
                },
                {
                  label: "二级",
                  value: 2,
                },
                {
                  label: "三级",
                  value: 3,
                },
              ],
              channel: [
                {
                  label: "微博",
                  value: "weibo",
                },
                {
                  label: "B站",
                  value: "bilibili",
                },
                {
                  label: "TapTap",
                  value: "taptap",
                },
              ],
              tags: [
                {
                  label: "s",
                  value: 53,
                },
                {
                  label: "第十条",
                  value: 44,
                },
                {
                  label: "ssa",
                  value: 40,
                },
                {
                  label: "ssaaa",
                  value: 25,
                },
                {
                  label: "ddsfdsfsdfsdfds",
                  value: 22,
                },
                {
                  label: "a777",
                  value: 19,
                },
                {
                  label: "a999",
                  value: 18,
                },
                {
                  label: "aaaa",
                  value: 17,
                },
                {
                  label: "a6",
                  value: 16,
                },
                {
                  label: "aa",
                  value: 15,
                },
              ],
            },
            filter: {
              time: "",
              levels: "",
              tags: null,
              channel: null,
            },
          },
          count: 0,
        },
        message: "",
      };
    },
  },

  //创建看板空间
  {
    url: "/api/folders/",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: null,
        message: "",
      };
    },
  },

  //重命名看板 type:dashbord(看板项) || nameSpace('看板空间')

  {
    url: "/api/folders/rename",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: null,
        message: "",
      };
    },
  },

  // 删除看板空间 @data { namespaceId:1}

  {
    url: "/api/alert/trend",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: [
          {
            id: 0,
            children: [
              {
                title: "舆情概览",
                name: "舆情概览",
                id: 55,
                type: "simple",
                spaceType: "system",
                dashbordPerms: {
                  rename: false,
                  remove: false,
                  move: false,
                  read: false,
                  share: false,
                  edit: false,
                },
              },
              {
                title: "预警分析",
                name: "预警分析",
                id: 56,
                type: "warn",
                spaceType: "system",
                dashbordPerms: {
                  rename: false,
                  remove: false,
                  move: false,
                  read: false,
                  share: false,
                  edit: false,
                },
              },
            ],
            name: "系统看板",
            spacePerms: {
              rename: false,
              remove: false,
              move: false,
              read: true,
              share: false,
            },
            title: "系统看板",
            description: null,
            uid: "5uFr8j5j3",
            slug: "",
            created_at: null,
            updated_at: null,
            version: 1,
            type: "system",
            created_by_user: null,
            updated_by_user: null,
            parent: null,
            project: null,
          },
          {
            id: 0,
            children: [
              {
                title: "用户看板1",
                name: "用户看板1",
                id: 13,
                type: "opinion",
                spaceType: "mine",
                dashbordPerms: {
                  rename: true,
                  remove: true,
                  move: true,
                  read: true,
                  share: true,
                  edit: true,
                },
              },
              {
                title: "kan2",
                name: "kan2",
                id: 20,
                type: "opinion",
                spaceType: "mine",
                dashbordPerms: {
                  rename: true,
                  remove: true,
                  move: true,
                  read: true,
                  share: true,
                  edit: true,
                },
              },
            ],
            name: "我的看板",
            spacePerms: {
              rename: false,
              remove: false,
              move: false,
              read: true,
              share: false,
            },
            title: "我的看板",
            description: null,
            uid: "4v3xLqKMx",
            slug: "",
            created_at: null,
            updated_at: null,
            version: 1,
            type: "mine",
            created_by_user: null,
            updated_by_user: null,
            parent: null,
            project: null,
          },
          {
            id: 28,
            children: [],
            name: "新建空间2",
            spacePerms: {
              rename: true,
              remove: true,
              move: true,
              read: true,
              share: true,
            },
            title: "新建空间2",
            description: null,
            uid: "4KEebYku7",
            slug: "xin-jian-kong-jian-1",
            created_at: "2023-02-27 18:21:39",
            updated_at: "2023-02-27 18:21:39",
            version: 1,
            type: "myCreated",
            created_by_user: 4,
            updated_by_user: 4,
            parent: null,
            project: 1,
          },
          {
            id: 35,
            children: [],
            name: "sapnce----sss",
            spacePerms: {
              rename: true,
              remove: true,
              move: true,
              read: true,
              share: true,
            },
            title: "sapnce----sss",
            description: null,
            uid: "5QxT8UWbK",
            slug: "sapnce-sss",
            created_at: "2023-03-01 15:27:54",
            updated_at: "2023-03-01 15:27:54",
            version: 1,
            type: "myCreated",
            created_by_user: 4,
            updated_by_user: 4,
            parent: null,
            project: 1,
          },
          {
            id: 36,
            children: [
              {
                title: "dash1",
                name: "dash1",
                id: 48,
                type: "opinion",
                spaceType: "myCreated",
                dashbordPerms: {
                  rename: true,
                  remove: true,
                  move: true,
                  read: true,
                  share: true,
                  edit: true,
                },
              },
              {
                title: "dasbsssssss",
                name: "dasbsssssss",
                id: 49,
                type: "opinion",
                spaceType: "myCreated",
                dashbordPerms: {
                  rename: true,
                  remove: true,
                  move: true,
                  read: true,
                  share: true,
                  edit: true,
                },
              },
            ],
            name: "空间空间空间空间空间空间空间空间空间空间空间",
            spacePerms: {
              rename: true,
              remove: true,
              move: true,
              read: true,
              share: true,
            },
            title: "空间空间空间空间空间空间空间空间空间空间空间",
            description: null,
            uid: "4TM5MAU8N",
            slug: "kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian-kong-jian",
            created_at: "2023-03-01 16:56:23",
            updated_at: "2023-03-01 16:56:23",
            version: 1,
            type: "myCreated",
            created_by_user: 4,
            updated_by_user: 4,
            parent: null,
            project: 1,
          },
          {
            id: 0,
            children: [
              {
                title: "谢明勋测试（mingxun.xie）",
                name: "谢明勋测试（mingxun.xie）",
                id: 18,
                type: "opinion",
                spaceType: "sharedToMe",
                dashbordPerms: {
                  rename: false,
                  remove: false,
                  move: false,
                  read: true,
                  share: false,
                  edit: false,
                },
              },
            ],
            name: "共享空间（mingxun.xie）",
            spacePerms: {
              rename: false,
              remove: false,
              move: false,
              read: true,
              share: false,
            },
            title: "共享空间（mingxun.xie）",
            description: null,
            uid: "5r5iMU42p",
            slug: "",
            created_at: null,
            updated_at: null,
            version: 1,
            type: "sharedToMe",
            created_by_user: null,
            updated_by_user: null,
            parent: null,
            project: null,
          },
          {
            id: 0,
            children: [
              {
                title: "粉丝数（yimeng.liu）",
                name: "粉丝数（yimeng.liu）",
                id: 54,
                type: "opinion",
                spaceType: "sharedToMe",
                dashbordPerms: {
                  rename: false,
                  remove: false,
                  move: false,
                  read: true,
                  share: false,
                  edit: false,
                },
              },
            ],
            name: "共享空间（yimeng.liu）",
            spacePerms: {
              rename: false,
              remove: false,
              move: false,
              read: true,
              share: false,
            },
            title: "共享空间（yimeng.liu）",
            description: null,
            uid: "3MEBgBEt6",
            slug: "",
            created_at: null,
            updated_at: null,
            version: 1,
            type: "sharedToMe",
            created_by_user: null,
            updated_by_user: null,
            parent: null,
            project: null,
          },
        ],
        message: "",
      };
    },
  },

  //报表列表数据(drawer)
  // url: "/api/reports/",
  {
    url: "/api/reports/",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: [
          {
            id: 142,
            name: "trend111",
            comment: "trend111",
            type: "trend",
          },
          {
            id: 118,
            name: "12",
            comment: "",
            type: "trend",
          },
          {
            id: 86,
            name: "trend123",
            comment: "",
            type: "trend",
          },
          {
            id: 138,
            name: "ssd",
            comment: "",
            type: "topic",
          },
          {
            id: 137,
            name: "trend1",
            comment: "trend1",
            type: "trend",
          },
          {
            id: 53,
            name: "传播分析1aa",
            comment: "抵达",
            type: "spread",
          },
          {
            id: 131,
            name: "sss1233",
            comment: "",
            type: "trend",
          },
          {
            id: 130,
            name: "ss2",
            comment: "",
            type: "theme",
          },
          {
            id: 129,
            name: "test-show",
            comment: "",
            type: "words",
          },
          {
            id: 128,
            name: "spread12",
            comment: "spread12",
            type: "spread",
          },
          {
            id: 117,
            name: "sss1234",
            comment: "",
            type: "trend",
          },
          {
            id: 116,
            name: "sss123",
            comment: "",
            type: "trend",
          },
          {
            id: 115,
            name: "sss12",
            comment: "",
            type: "trend",
          },
          {
            id: 114,
            name: "sss1",
            comment: "",
            type: "trend",
          },
          {
            id: 113,
            name: "qq",
            comment: "",
            type: "trend",
          },
          {
            id: 110,
            name: "trend12321",
            comment: "",
            type: "trend",
          },
          {
            id: 109,
            name: "trend1232",
            comment: "",
            type: "trend",
          },
          {
            id: 108,
            name: "test1",
            comment: "",
            type: "trend",
          },
          {
            id: 107,
            name: "sss",
            comment: "d",
            type: "theme",
          },
          {
            id: 89,
            name: "spread1",
            comment: "spread1",
            type: "spread",
          },
          {
            id: 85,
            name: "ss",
            comment: "",
            type: "theme",
          },
          {
            id: 37,
            name: "trend-a",
            comment: "aaa",
            type: "trend",
          },
          {
            id: 57,
            name: "保存的报表",
            comment: "注释",
            type: "trend",
          },
          {
            id: 54,
            name: "传播分析1aa",
            comment: "抵达",
            type: "spread",
          },
          {
            id: 51,
            name: "sds",
            comment: "",
            type: "trend",
          },
          {
            id: 47,
            name: "词云分析1123",
            comment: "",
            type: "words",
          },
          {
            id: 46,
            name: "词云分析123",
            comment: "词云分析123",
            type: "words",
          },
          {
            id: 43,
            name: "趋势分析2",
            comment: "cs",
            type: "trend",
          },
          {
            id: 42,
            name: "sasa",
            comment: "asas",
            type: "trend",
          },
          {
            id: 40,
            name: "ss",
            comment: "ssss",
            type: "trend",
          },
          {
            id: 38,
            name: "trend_new",
            comment: "new trend",
            type: "trend",
          },
          {
            id: 36,
            name: "111w",
            comment: "222",
            type: "words",
          },
          {
            id: 35,
            name: "111",
            comment: "222",
            type: "words",
          },
          {
            id: 34,
            name: "sd",
            comment: "ds",
            type: "trend",
          },
          {
            id: 17,
            name: "趋势分析报表66",
            comment: "趋势分析报表1",
            type: "trend",
          },
          {
            id: 12,
            name: "saas",
            comment: "asas",
            type: "trend",
          },
        ],
        message: "",
      };
    },
  },

  //获取看板的配置数据(内部卡的配置)
  //url: "/api/dashboards/layout",
  {
    url: "/api/dashboards/layout",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: [
          {
            h: 15,
            w: 24,
            x: 0,
            y: 30,
            i: "3",
            report: {
              configs: {
                filters: {
                  relTag: "and",
                  children: [],
                },
                value: "aop.ods_aop",
                time: {
                  type: "relative",
                  start: "2023-04-22 00:00:00",
                  end: "2023-04-22 23:59:59",
                  recent_day: "1-1",
                  from_some_day_to_now: false,
                  compare_from_some_day_to_now: false,
                  from_some_day_to_yestoday: false,
                  compare_from_some_day_to_yestoday: false,
                  checked: false,
                  contrast: {},
                },
                time_unit: {
                  unit: "hour",
                  value: 1,
                  weekStart: 0,
                },
                groups: [],
                project_id: 1,
                channel: "weibo",
                leader_count: 10,
              },
              project_id: 1,
              dashboard_id: 13,
              id: 53,
              type: "spread",
              cardSize: "big",
              name: "传播分析1aa",
              comment: "抵达",
              perms: [],
              created_at: "2023-03-24 16:57:54",
              updated_at: "2023-04-23 16:04:04",
              created_by_user: 4,
              updated_by_user: 4,
              project: 1,
            },
          },
          {
            h: 15,
            w: 24,
            x: 0,
            y: 15,
            i: "2",
            report: {
              configs: {
                filters: {
                  relTag: "and",
                  children: [],
                },
                value: "aop.ods_aop",
                time: {
                  type: "relative",
                  start: "2023-03-20 00:00:00",
                  end: "2023-04-22 23:59:59",
                  recent_day: "1-34",
                  from_some_day_to_now: false,
                  compare_from_some_day_to_now: false,
                  from_some_day_to_yestoday: false,
                  compare_from_some_day_to_yestoday: false,
                  checked: false,
                  contrast: {},
                },
                time_unit: {
                  unit: "day",
                  value: 1,
                  weekStart: 0,
                },
                groups: [
                  {
                    value: "channel",
                    category: "common",
                  },
                  {
                    value: "author_id",
                    category: "common",
                  },
                  {
                    value: "sentiment_rough",
                    category: "common",
                  },
                  {
                    value: 1,
                    category: "wordgroup",
                  },
                ],
                project_id: 1,
                table: {
                  search: "",
                  pager: {
                    curPage: 1,
                    pageSize: 10,
                    total: 1000,
                  },
                  filter: {},
                },
              },
              project_id: 1,
              dashboard_id: 13,
              id: 86,
              type: "trend",
              cardSize: "big",
              name: "trend123",
              comment: "",
              perms: [],
              created_at: "2023-04-13 10:26:12",
              updated_at: "2023-04-25 16:02:29",
              created_by_user: 4,
              updated_by_user: 4,
              project: 1,
            },
          },
          {
            h: 15,
            w: 24,
            x: 0,
            y: 0,
            i: "1",
            report: {
              configs: {
                filters: {
                  relTag: "and",
                  children: [],
                },
                value: "aop.ods_aop",
                time: {
                  type: "relative",
                  start: "2023/4/6 0:0:0",
                  end: "2023/4/12 23:59:59",
                  recent_day: "1-7",
                  from_some_day_to_now: false,
                  compare_from_some_day_to_now: false,
                  from_some_day_to_yestoday: false,
                  compare_from_some_day_to_yestoday: false,
                  checked: false,
                  contrast: {},
                },
                time_unit: {
                  unit: "hour",
                  value: 1,
                  weekStart: 0,
                },
                groups: {
                  watchType: "word",
                  value: [6],
                },
                project_id: 1,
              },
              project_id: 1,
              dashboard_id: 13,
              id: 85,
              type: "theme",
              cardSize: "big",
              name: "ss",
              comment: "",
              perms: [],
              created_at: "2023-04-13 09:53:45",
              updated_at: "2023-04-13 09:53:45",
              created_by_user: 4,
              updated_by_user: 4,
              project: 1,
            },
          },
        ],
        message: "",
      };
    },
  },

  //保存card配置的数据
  // url: "/api/dashboards/usersetting",

  {
    url: "/api/dashboards/usersetting",
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

  //创建看板
  //url: "/api/dashboards/"

  {
    url: "/api/dashboards/",
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

  //移动看板  type:dashbord(看板项) || nameSpace(看板空间)
  // url: "/api/dashboards/mv",

  {
    url: "/api/dashboards/mv",
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
  //删除看板
  // url: "/api/dashboards/delete_by_list"
  {
    url: "/api/dashboards/delete_by_list",
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

  // 获取看板配置的分组项列表
  // url: "/api/aopgroups/",
  {
    url: "/api/aopgroups/",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: [
          {
            label: "AnonymousUser",
            value: 1,
          },
          {
            label: "admin",
            value: 3,
          },
          {
            label: "lijun.zhang",
            value: 4,
          },
          {
            label: "mingxun.xie",
            value: 6,
          },
          {
            label: "yunong.liu",
            value: 7,
          },
          {
            label: "jay.li",
            value: 8,
          },
          {
            label: "sid.cheng",
            value: 9,
          },
          {
            label: "yongzhe.feng",
            value: 10,
          },
          {
            label: "jianmin.gao",
            value: 11,
          },
          {
            label: "mi.zhou",
            value: 12,
          },
          {
            label: "shixun.li",
            value: 13,
          },
          {
            label: "shi.pan",
            value: 14,
          },
          {
            label: "xiaochen.zhu",
            value: 15,
          },
          {
            label: "yimeng.liu",
            value: 16,
          },
          {
            label: "mingming.zhang",
            value: 17,
          },
          {
            label: "huan.wang",
            value: 18,
          },
          {
            label: "zhi.chai",
            value: 19,
          },
          {
            label: "ting.yu",
            value: 20,
          },
          {
            label: "xue.han",
            value: 21,
          },
          {
            label: "daniel.zeng",
            value: 22,
          },
          {
            label: "huafu.li",
            value: 23,
          },
          {
            label: "yuting.gao",
            value: 24,
          },
          {
            label: "xiaofan.hu",
            value: 25,
          },
          {
            label: "qiuzi.kan",
            value: 26,
          },
        ],
        message: "",
      };
    },
  },

  //保存看板配置
  // url: "/api/dashboards/conf",
  {
    url: "/api/dashboards/conf",
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

  //根据id获取dashbord看板本身的配置
  // url: "/api/dashboards/conf",
  {
    url: "/api/dashboards/conf",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {
          updateType: 2,
          updateTime: "07:00",
          permission: 1,
          group: [],
        },
        message: "",
      };
    },
  },

  //保存看板布局的配置
  // url: "/api/dashboards/layout"
  {
    url: "/api/dashboards/layout",
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

  // 微博&b站&乐次元看板配置
  {
    url: "/custom/card/configs",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      const query = ctx.request.query;
      ctx.body = {
        code: 0,
        message: "",
        data: query.id === "59" ? leciyuanConfigs() : wbConfigs(),
      };

      //微博配置
      function wbConfigs() {
        return [
          {
            report: {
              id: 1,
              name: "内容趋势",
              type: "trend",
              configs: {
                time: {
                  type: "relative",
                  recent_day: "0-0",
                },
              },
            },
            isErrorOccured: false,
            errorMessage: "",
          },
          {
            report: {
              id: 2,
              name: "主题分布",
              type: "theme",
              configs: {
                time: {
                  type: "relative",
                  recent_day: "0-0",
                },
              },
            },
            isErrorOccured: false,
            errorMessage: "",
          },
          {
            report: {
              id: 3,
              name: "话题聚类",
              type: "topic",
              configs: {
                time: {
                  type: "relative",
                  recent_day: "0-0",
                },
              },
            },
            isErrorOccured: false,
            errorMessage: "",
          },
          {
            report: {
              id: 4,
              name: "玩家讨论内容",
              type: "playerDiscuss",
              configs: {
                time: {
                  type: "relative",
                  recent_day: "0-0",
                },
              },
            },
            isErrorOccured: false,
            errorMessage: "",
          },
        ];
      }

      //乐次元的配置
      function leciyuanConfigs() {
        return {
          cardList: [
            {
              visible: true,
              report: {
                id: 1,
                name: "商品宣发微博转评赞雷达",
                type: "lcyRadar",
                configs: {
                  time: {
                    type: "relative",
                    recent_day: "0-0",
                  },
                },
              },
              isErrorOccured: false,
              errorMessage: "",
            },
            {
              visible: true,
              report: {
                id: 1,
                name: "商品宣发微博转评赞平均趋势",
                type: "lcyTrend",
                configs: {
                  time: {
                    type: "relative",
                    recent_day: "0-0",
                  },
                },
              },
              isErrorOccured: false,
              errorMessage: "",
            },
            {
              visible: true,
              report: {
                id: 2,
                name: "商品宣发微博明细",
                type: "lcyDataTable",
                configs: {
                  time: {
                    type: "relative",
                    recent_day: "0-0",
                  },
                },
              },
              isErrorOccured: false,
              errorMessage: "",
            },
          ],
          selectsFilters: [
            {
              name: "product",
              options: [{ label: "商品", value: "p1" }],
              defaultValue: ["p1"],
              multiple: true,
            },
            {
              name: "levelTwo",
              options: [{ label: "二级标签1", value: "e1" }],
              defaultValue: ["e1"],
              multiple: true,
            },
            {
              name: "period",
              options: [{ label: "宣发阶段", value: "per1" }],
              multiple: true,
            },
            {
              name: "weiboType",
              options: [{ label: "图文", value: "per1" }],
              multiple: true,
            },
          ],
        };
      }
    },
  },

  //自定义卡的数据
  {
    url: "/custom/card/data",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);

      const body = ctx.request.body;
      const cardType = body.type;
      const datas = {
        trend: {
          dimensions: ["product", "2015", "2016", "2017"],
          source: [
            { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
            { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
            { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
            { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
          ],
        },

        // 主题分布图
        theme: {
          ranks: [
            {
              word: "生日",
              volume: 3889,
              data: {
                count: 90.38,
                isUp: false,
              },
              rank: 1,
            },
            {
              word: "偶像",
              volume: 261,
              data: {
                count: 22.5,
                isUp: true,
              },
              rank: 2,
            },
            {
              word: "宝宝",
              volume: 244,
              data: {
                count: 34.38,
                isUp: false,
              },
              rank: 3,
            },
            {
              word: "燐音",
              volume: 180,
              data: {
                count: 44.44,
                isUp: false,
              },
              rank: 4,
            },
            {
              word: "巡演",
              volume: 158,
              data: {
                count: 29.03,
                isUp: false,
              },
              rank: 5,
            },
            {
              word: "角色",
              volume: 80,
              data: {
                count: 10,
                isUp: false,
              },
              rank: 6,
            },
            {
              word: "游戏",
              volume: 52,
              data: {
                count: 60,
                isUp: false,
              },
              rank: 7,
            },
            {
              word: "抽奖",
              volume: 22,
              data: {
                count: 0,
                isUp: false,
              },
              rank: 8,
            },
            {
              word: "关卡",
              volume: 1,
              data: {
                count: 0,
                isUp: false,
              },
              rank: 9,
            },
            {
              word: "外貌",
              volume: 0,
              data: {
                count: 0,
                isUp: false,
              },
              rank: 10,
            },
          ],
        },

        //话题类聚
        topic: [
          {
            name: "抽奖",
            value: 10,
            positive: 9,
            negative: 1,
            neutral: 0,
            tagText: "表掐",
          },
        ],

        // 玩家讨论
        playerDiscuss: {
          status: 3,
          pager: {
            curPage: 1,
            pageSize: 10,
            total: 62389,
          },
          list: [
            {
              id: "00b44800a0a408ab35c42f14ca3e7f30",
              content: null,
              link: null,
              publishTime: "2024-05-20 04:00:05",
              emotion: null,
              authorId: null,
              authorName: null,
              channelContentType: "华为应用中心-评分",
              info: {
                ID: "00b44800a0a408ab35c42f14ca3e7f30",
                渠道: "华为应用中心",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-20 04:00:05",
                更新时间: "",
                采集时间: "2024-05-20 04:00:05",
                整体情感: null,
                ABAS分析: [],
                其他: {
                  评分: "4.4",
                  评论量: 759,
                },
              },
              textType: {
                label: "",
                value: "",
              },
            },
            {
              id: "01385e607bd030eab4d0c8ca3bfd07cc",
              content: null,
              link: null,
              publishTime: "2024-05-17 05:00:05",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: null,
              authorName: null,
              channelContentType: "BiliBili-评分",
              info: {
                ID: "01385e607bd030eab4d0c8ca3bfd07cc",
                渠道: "BiliBili",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-17 05:00:05",
                更新时间: "",
                采集时间: "2024-05-17 05:00:05",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [],
                其他: {
                  state: 3,
                  star_number_list: [4140, 781, 1276, 1677, 7186],
                  valid_comment_number: 17880,
                  评分: 6.9,
                  评论量: 18158,
                },
              },
              textType: {
                label: "常规信息",
                value: "default",
              },
            },
            {
              id: "031480d3f794c4ae0fb16a61be200975",
              content: null,
              link: null,
              publishTime: "2024-05-17 12:00:05",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: null,
              authorName: null,
              channelContentType: "BiliBili-评分",
              info: {
                ID: "031480d3f794c4ae0fb16a61be200975",
                渠道: "BiliBili",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-17 12:00:05",
                更新时间: "",
                采集时间: "2024-05-17 12:00:05",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [],
                其他: {
                  state: 3,
                  star_number_list: [4140, 781, 1276, 1677, 7186],
                  valid_comment_number: 17880,
                  评分: 6.9,
                  评论量: 18158,
                },
              },
              textType: {
                label: "常规信息",
                value: "default",
              },
            },
            {
              id: "03c14f6fbd2e72e929c30f4b26b38111",
              content: null,
              link: null,
              publishTime: "2024-05-14 18:00:07",
              emotion: null,
              authorId: null,
              authorName: null,
              channelContentType: "华为应用中心-评分",
              info: {
                ID: "03c14f6fbd2e72e929c30f4b26b38111",
                渠道: "华为应用中心",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-14 18:00:07",
                更新时间: "",
                采集时间: "2024-05-14 18:00:07",
                整体情感: null,
                ABAS分析: [],
                其他: {
                  评分: "4.4",
                  评论量: 762,
                },
              },
              textType: {
                label: "",
                value: "",
              },
            },
            {
              id: "03c770932e72eaf54a6a3077bd85e108",
              content: null,
              link: null,
              publishTime: "2024-05-20 05:00:06",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: null,
              authorName: null,
              channelContentType: "BiliBili-评分",
              info: {
                ID: "03c770932e72eaf54a6a3077bd85e108",
                渠道: "BiliBili",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-20 05:00:06",
                更新时间: "",
                采集时间: "2024-05-20 05:00:06",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [],
                其他: {
                  state: 3,
                  star_number_list: [4142, 782, 1276, 1677, 7190],
                  valid_comment_number: 17890,
                  评分: 6.9,
                  评论量: 18168,
                },
              },
              textType: {
                label: "常规信息",
                value: "default",
              },
            },
            {
              id: "03ef8e5c937f98708a956d45bbc0d663",
              content: null,
              link: null,
              publishTime: "2024-05-16 19:00:10",
              emotion: null,
              authorId: null,
              authorName: null,
              channelContentType: "华为应用中心-评分",
              info: {
                ID: "03ef8e5c937f98708a956d45bbc0d663",
                渠道: "华为应用中心",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-16 19:00:10",
                更新时间: "",
                采集时间: "2024-05-16 19:00:10",
                整体情感: null,
                ABAS分析: [],
                其他: {
                  评分: "4.4",
                  评论量: 763,
                },
              },
              textType: {
                label: "",
                value: "",
              },
            },
            {
              id: "0445947c3c2ab3db8d5d70e23b8ebb5c",
              content: null,
              link: null,
              publishTime: "2024-05-20 15:00:05",
              emotion: null,
              authorId: null,
              authorName: null,
              channelContentType: "华为应用中心-评分",
              info: {
                ID: "0445947c3c2ab3db8d5d70e23b8ebb5c",
                渠道: "华为应用中心",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-20 15:00:05",
                更新时间: "",
                采集时间: "2024-05-20 15:00:05",
                整体情感: null,
                ABAS分析: [],
                其他: {
                  评分: "4.4",
                  评论量: 759,
                },
              },
              textType: {
                label: "",
                value: "",
              },
            },
            {
              id: "04acb882ae26868eab2dfb4a2a0f47c2",
              content: null,
              link: null,
              publishTime: "2024-05-19 08:00:05",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: null,
              authorName: null,
              channelContentType: "BiliBili-评分",
              info: {
                ID: "04acb882ae26868eab2dfb4a2a0f47c2",
                渠道: "BiliBili",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-19 08:00:05",
                更新时间: "",
                采集时间: "2024-05-19 08:00:05",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [],
                其他: {
                  state: 3,
                  star_number_list: [4142, 782, 1276, 1677, 7189],
                  valid_comment_number: 17888,
                  评分: 6.9,
                  评论量: 18166,
                },
              },
              textType: {
                label: "常规信息",
                value: "default",
              },
            },
            {
              id: "0583680426f0d87fc31924cf8f145cc4",
              content: null,
              link: null,
              publishTime: "2024-05-15 12:00:05",
              emotion: null,
              authorId: null,
              authorName: null,
              channelContentType: "华为应用中心-评分",
              info: {
                ID: "0583680426f0d87fc31924cf8f145cc4",
                渠道: "华为应用中心",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-15 12:00:05",
                更新时间: "",
                采集时间: "2024-05-15 12:00:05",
                整体情感: null,
                ABAS分析: [],
                其他: {
                  评分: "4.4",
                  评论量: 761,
                },
              },
              textType: {
                label: "",
                value: "",
              },
            },
            {
              id: "05cc7113351801d28639c9321d403171",
              content: null,
              link: null,
              publishTime: "2024-05-18 04:00:05",
              emotion: {
                label: "中性",
                value: "neutral",
              },
              authorId: null,
              authorName: null,
              channelContentType: "BiliBili-评分",
              info: {
                ID: "05cc7113351801d28639c9321d403171",
                渠道: "BiliBili",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-18 04:00:05",
                更新时间: "",
                采集时间: "2024-05-18 04:00:05",
                整体情感: {
                  label: "中性",
                  value: "neutral",
                },
                ABAS分析: [],
                其他: {
                  state: 3,
                  star_number_list: [4142, 781, 1276, 1677, 7188],
                  valid_comment_number: 17883,
                  评分: 6.9,
                  评论量: 18161,
                },
              },
              textType: {
                label: "常规信息",
                value: "default",
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
                value: "bilibili-review_score",
                label: "BiliBili-评分",
              },
              {
                value: "bilibili-review",
                label: "BiliBili-评价",
              },
              {
                value: "appstore-review",
                label: "苹果应用商店-评价",
              },
              {
                value: "weibo-micro_blog",
                label: "新浪微博-原创微博",
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
                value: "douyin-short_video",
                label: "抖音短视频-短视频",
              },
              {
                value: "bilibili-video",
                label: "BiliBili-视频",
              },
              {
                value: "huawei-review_score",
                label: "华为应用中心-评分",
              },
              {
                value: "weibo-comment",
                label: "新浪微博-评论",
              },
              {
                value: "bilibili-comment",
                label: "BiliBili-评论",
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

        //乐次元趋势图
        lcyTrend: {
          dimensions: ["time", "评论", "点赞", "转发"],
          source: [
            {
              time: "2022-01",
              评论: 100,
              点赞: 200,
              转发: 100,

              details: {
                xxx徽章: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },

                xxx徽章2: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },
              },
            },

            {
              time: "2022-02",
              评论: 80,
              点赞: 10,
              转发: 50,

              details: {
                xxx徽章: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },

                xxx徽章2: {
                  评论: 10,
                  点赞: 20,
                  转发: 3,
                },
              },
            },

            {
              time: "2022-03",
              评论: 30,
              点赞: 20,
              转发: 100,

              details: {
                xxx徽章: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },

                xxx徽章2: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },
              },
            },
          ],
        },

        // 乐次元数据表
        lcyDataTable: {
          status: 3,
          pager: {
            curPage: 1,
            pageSize: 10,
            total: 62389,
          },
          list: genOptions(10, (index) => {
            return {
              id: index,
              productName: "xx徽章",
              levelTwoTag: "二级标签",
              weiboType: "微博类型",
              publishTime: "2020-12-20 20:30:30",
              repostsCount: 200,
              commentsCount: 100,
              attitudesCount: 10,

              //展开info
              info: {
                ID: "00b44800a0a408ab35c42f14ca3e7f30",
                渠道: "华为应用中心",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-05-20 04:00:05",
                更新时间: "",
                采集时间: "2024-05-20 04:00:05",
                整体情感: null,
                ABAS分析: [],
                其他: {
                  评分: "4.4",
                  评论量: 759,
                },
              },
            };
          }),
          filterOptions: {
            levelTwoTag: [
              {
                label: "全部",
                value: "",
              },
              {
                label: "饰品",
                value: "1",
              },
            ],
            weiboType: [
              {
                label: "全部",
                value: "",
              },
              {
                label: "图文",
                value: "1",
              },
            ],
          },
        },
      };

      ctx.body = {
        code: 0,
        message: "",
        data: datas[cardType],
      };
    },
  },

  {
    url: "/disscuss/card/filter/options",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: [
          { label: "游戏玩法讨论", value: "1" },
          { label: "技术支持", value: "2" },
          { label: "用户反馈", value: "3" },
        ],
      };
    },
  },

  // 主题分布 card table数据
  {
    url: "/topic/card/table",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",

        data: {
          positive: {
            percent: "10%",
            count: 10, // 所有评价内容量
            data: [{ content: "内容", time: "2023/04/02", channel: "渠道" }],
          },
          negative: {
            percent: "20%",
            count: 100, // 所有评价内容量
            data: [{ content: "内容", time: "2023/04/02", channel: "渠道" }],
          },
          others: {
            percent: "70%",
            count: 10, // 所有评价内容量
            data: [{ content: "内容", time: "2023/04/02", channel: "渠道" }],
          },

          filterOptions: {
            channelContentType: [
              {
                label: "全部",
                value: "",
              },
              {
                value: "weibo-ref_micro_blog",
                label: "新浪微博-转发微博",
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
                value: "bilibili-video",
                label: "BiliBili-视频",
              },
              {
                value: "weibo-comment",
                label: "新浪微博-评论",
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
            channel: [
              {
                label: "全部",
                value: "",
              },
              {
                label: "新浪微博",
                value: "weibo",
              },
              {
                label: "BiliBili",
                value: "bilibili",
              },
              {
                label: "TapTap",
                value: "taptap",
              },
              {
                label: "苹果应用商店",
                value: "appstore",
              },
              {
                label: "抖音短视频",
                value: "douyin",
              },
              {
                label: "华为应用中心",
                value: "huawei",
              },
              {
                label: "小米游戏中心",
                value: "mi",
              },
              {
                label: "NGA玩家社区",
                value: "nga",
              },
              {
                label: "百度贴吧",
                value: "tieba",
              },
              {
                label: "小红书",
                value: "xhs",
              },
              {
                label: "知乎",
                value: "zhihu",
              },
              {
                label: "百度搜索",
                value: "baidu",
              },
              {
                label: "Youtube",
                value: "youtube",
              },
              {
                label: "Reddit",
                value: "reddit",
              },
              {
                label: "Twitter",
                value: "twitter",
              },
              {
                label: "GoogleStore",
                value: "google_store",
              },
            ],
          },
        },
      };
    },
  },

  // 话题类聚, 后面第2个table
  {
    url: "/theme/card/table",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {
          word: {
            positive: {
              data: [
                {
                  word: "快乐",
                  volume: 3732,
                },
                {
                  word: "快樂",
                  volume: 43,
                },
                {
                  word: "喜欢",
                  volume: 5,
                },
                {
                  word: "好棒",
                  volume: 4,
                },
                {
                  word: "好强",
                  volume: 4,
                },
                {
                  word: "明天",
                  volume: 3,
                },
                {
                  word: "快乐永远开心",
                  volume: 3,
                },
                {
                  word: "开心",
                  volume: 3,
                },
                {
                  word: "祝福",
                  volume: 3,
                },
                {
                  word: "忙忘",
                  volume: 2,
                },
                {
                  word: "特别厉害",
                  volume: 2,
                },
                {
                  word: "喜庆",
                  volume: 2,
                },
                {
                  word: "好厉害",
                  volume: 2,
                },
                {
                  word: "一年一次",
                  volume: 2,
                },
                {
                  word: "伟大的！",
                  volume: 2,
                },
                {
                  word: "和小燐一起过",
                  volume: 2,
                },
                {
                  word: "完美",
                  volume: 2,
                },
                {
                  word: "特别完美",
                  volume: 1,
                },
                {
                  word: "提前祝快乐",
                  volume: 1,
                },
                {
                  word: "好萌的生賀",
                  volume: 1,
                },
                {
                  word: "好爱哦",
                  volume: 1,
                },
                {
                  word: "好萌",
                  volume: 1,
                },
                {
                  word: "愉快",
                  volume: 1,
                },
                {
                  word: "强",
                  volume: 1,
                },
                {
                  word: "伟大",
                  volume: 1,
                },
                {
                  word: "宝宝的",
                  volume: 1,
                },
                {
                  word: "可怜",
                  volume: 1,
                },
                {
                  word: "太美了",
                  volume: 1,
                },
                {
                  word: "同一天",
                  volume: 1,
                },
                {
                  word: "太萌了",
                  volume: 1,
                },
                {
                  word: "好美丽",
                  volume: 1,
                },
                {
                  word: "好看",
                  volume: 1,
                },
                {
                  word: "おめでとう/Happy Birthday/生日快乐",
                  volume: 1,
                },
                {
                  word: "太帅了",
                  volume: 1,
                },
                {
                  word: "喜悦",
                  volume: 1,
                },
                {
                  word: "一起过",
                  volume: 1,
                },
                {
                  word: "三毛缟斑",
                  volume: 1,
                },
                {
                  word: "超绝无敌",
                  volume: 1,
                },
                {
                  word: "可愛",
                  volume: 1,
                },
                {
                  word: "和队友一块过",
                  volume: 1,
                },
                {
                  word: "过生日",
                  volume: 1,
                },
                {
                  word: "快乐，永远帅气",
                  volume: 1,
                },
                {
                  word: "好",
                  volume: 1,
                },
                {
                  word: "可爱",
                  volume: 1,
                },
                {
                  word: "忙",
                  volume: 1,
                },
                {
                  word: "おめでとう",
                  volume: 1,
                },
                {
                  word: "美美",
                  volume: 1,
                },
                {
                  word: "美得无敌",
                  volume: 1,
                },
                {
                  word: "好酷",
                  volume: 1,
                },
                {
                  word: "推过了",
                  volume: 1,
                },
                {
                  word: "好帅！",
                  volume: 1,
                },
                {
                  word: "萌",
                  volume: 1,
                },
                {
                  word: "庆祝",
                  volume: 1,
                },
                {
                  word: "纪念日",
                  volume: 1,
                },
                {
                  word: "幸福",
                  volume: 1,
                },
                {
                  word: "爆点金币",
                  volume: 1,
                },
              ],
              count: 3855,
              percent: "99.15%",
            },
            negative: {
              data: [
                {
                  word: "快乐",
                  volume: 12,
                },
                {
                  word: "钻全下果生日池",
                  volume: 2,
                },
                {
                  word: "快樂",
                  volume: 1,
                },
                {
                  word: "太萌了",
                  volume: 1,
                },
              ],
              count: 16,
              percent: "0.41%",
            },
            others: {
              data: [
                {
                  word: "快乐",
                  volume: 12,
                },
                {
                  word: "快",
                  volume: 2,
                },
                {
                  word: "明天",
                  volume: 1,
                },
                {
                  word: "好耶",
                  volume: 1,
                },
                {
                  word: "收到春川宙的谷",
                  volume: 1,
                },
              ],
              count: 17,
              percent: "0.44%",
            },
            total: 3888,
          },
        },
        message: "",
      };
    },
  },

  // 话题类聚, 后面第3个table
  {
    url: "/theme/detail/table",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {
          status: 3,
          pager: {
            curPage: 1,
            pageSize: 20,
            total: 3732,
          },
          list: [
            {
              id: "1104778093",
              channel: "BiliBili",
              content: "【自存】ES全员生日祝福(2023),生日快乐～☆",
              update_time: "2024-05-21 10:40:15",
              classification: "fan_content",
              link: "http://www.bilibili.com/video/av1104778093",
              type: "视频",
              publishTime: "2024-05-20 10:12:19",
              collectionTime: "2024-05-20 10:30:09",
              ABAS: [
                {
                  评价维度: "生日",
                  观点词: "快乐",
                  情感倾向: "positive",
                },
              ],
              emotion: {
                label: "正向",
                value: "positive",
              },
              authorId: "21231786",
              authorName: "MZ-02",
              others: {
                子分区名称: "手机游戏",
                "稿件总时长（秒）": 675,
                播放数: 3,
                粉丝数: 17,
                关注数: 182,
                标签: [
                  "生日快乐��",
                  "偶像梦幻祭",
                  "ES",
                  "偶像梦幻祭2",
                  "生日快乐",
                  "生日",
                  "必剪创作",
                ],
              },
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1104778093",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "【自存】ES全员生日祝福(2023),生日快乐～☆",
                作者ID: "21231786",
                作者: "MZ-02",
                发布时间: "2024-05-20 10:12:19",
                更新时间: "2024-05-21 10:40:15",
                采集时间: "2024-05-20 10:30:09",
                整体情感: {
                  label: "正向",
                  value: "positive",
                },
                ABAS分析: [
                  {
                    评价维度: "生日",
                    观点词: "快乐",
                    情感倾向: "positive",
                  },
                ],
                其他: {
                  子分区名称: "手机游戏",
                  "稿件总时长（秒）": 675,
                  播放数: 3,
                  粉丝数: 17,
                  关注数: 182,
                  标签: [
                    "生日快乐��",
                    "偶像梦幻祭",
                    "ES",
                    "偶像梦幻祭2",
                    "生日快乐",
                    "生日",
                    "必剪创作",
                  ],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
              time: "2024-05-20 10:12:19",
            },
            {
              id: "1254666832",
              channel: "BiliBili",
              content: "「ES」三毛缟斑生日来电��,妈妈生日快乐！！！",
              update_time: "2024-05-18 01:10:14",
              classification: "fan_content",
              link: "http://www.bilibili.com/video/av1254666832",
              type: "视频",
              publishTime: "2024-05-17 00:44:54",
              collectionTime: "2024-05-17 01:00:11",
              ABAS: [
                {
                  评价维度: "生日",
                  观点词: "快乐",
                  情感倾向: "positive",
                },
              ],
              emotion: {
                label: "正向",
                value: "positive",
              },
              authorId: "17349559",
              authorName: "_Misakii_",
              others: {
                子分区名称: "手机游戏",
                "稿件总时长（秒）": 31,
                播放数: 26,
                获赞数: 1,
                粉丝数: 51,
                关注数: 150,
                签名: "＼＼\\\\٩( 'ω' )و //／／",
                标签: [
                  "偶像梦幻祭",
                  "偶像梦幻祭2",
                  "三毛缟斑",
                  "MaM",
                  "必剪创作",
                ],
              },
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1254666832",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "「ES」三毛缟斑生日来电��,妈妈生日快乐！！！",
                作者ID: "17349559",
                作者: "_Misakii_",
                发布时间: "2024-05-17 00:44:54",
                更新时间: "2024-05-18 01:10:14",
                采集时间: "2024-05-17 01:00:11",
                整体情感: {
                  label: "正向",
                  value: "positive",
                },
                ABAS分析: [
                  {
                    评价维度: "生日",
                    观点词: "快乐",
                    情感倾向: "positive",
                  },
                ],
                其他: {
                  子分区名称: "手机游戏",
                  "稿件总时长（秒）": 31,
                  播放数: 26,
                  获赞数: 1,
                  粉丝数: 51,
                  关注数: 150,
                  签名: "＼＼\\\\٩( 'ω' )و //／／",
                  标签: [
                    "偶像梦幻祭",
                    "偶像梦幻祭2",
                    "三毛缟斑",
                    "MaM",
                    "必剪创作",
                  ],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
              time: "2024-05-17 00:44:54",
            },
            {
              id: "1354719141",
              channel: "BiliBili",
              content:
                '✧三毛缟斑2024.5.16生日快乐✧,『东京时间·2024.5.16 00:00』\n『北京时间·2024 5.15 23:00』\n\n三毛缟斑生日快乐！\n今年是第二次给你过生日啦，ママ生日快乐哦！\n在人生这条路上，你已经不再是孤单的一等星啦，而是最耀眼的那一颗✩！希望你不再迷茫，能够在舞台上自由的随心欢笑，歌唱和起舞，做你喜欢的MAM！拥有独属于你的幸福，成为你所憧憬的自己吧！\n"きっと you can do 信じよう!"',
              update_time: "2024-05-16 23:40:19",
              classification: "fan_content",
              link: "http://www.bilibili.com/video/av1354719141",
              type: "视频",
              publishTime: "2024-05-15 23:00:03",
              collectionTime: "2024-05-15 23:30:45",
              ABAS: [
                {
                  评价维度: "生日",
                  观点词: "快乐",
                  情感倾向: "positive",
                },
              ],
              emotion: {
                label: "正向",
                value: "positive",
              },
              authorId: "512886303",
              authorName: "弥弥弥弥弥罐头",
              others: {
                子分区名称: "音游",
                "稿件总时长（秒）": 43,
                播放数: 114,
                评论数: 4,
                收藏数: 4,
                投币数: 2,
                获赞数: 30,
                粉丝数: 108,
                关注数: 237,
                签名: "cn白崎弥/阿弥 #cosplay \n可以叫我阿弥！坐标西安\n扩列请走企鹅：1678414737\n这边拿来堆点舞什么的～～",
                标签: [
                  "快乐",
                  "生贺",
                  "偶像梦幻祭",
                  "偶像梦幻祭2",
                  "生日",
                  "三毛缟斑",
                  "三毛缟斑0516生日快乐",
                  "谷阵",
                  "谷美",
                ],
              },
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1354719141",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: '✧三毛缟斑2024.5.16生日快乐✧,『东京时间·2024.5.16 00:00』\n『北京时间·2024 5.15 23:00』\n\n三毛缟斑生日快乐！\n今年是第二次给你过生日啦，ママ生日快乐哦！\n在人生这条路上，你已经不再是孤单的一等星啦，而是最耀眼的那一颗✩！希望你不再迷茫，能够在舞台上自由的随心欢笑，歌唱和起舞，做你喜欢的MAM！拥有独属于你的幸福，成为你所憧憬的自己吧！\n"きっと you can do 信じよう!"',
                作者ID: "512886303",
                作者: "弥弥弥弥弥罐头",
                发布时间: "2024-05-15 23:00:03",
                更新时间: "2024-05-16 23:40:19",
                采集时间: "2024-05-15 23:30:45",
                整体情感: {
                  label: "正向",
                  value: "positive",
                },
                ABAS分析: [
                  {
                    评价维度: "生日",
                    观点词: "快乐",
                    情感倾向: "positive",
                  },
                ],
                其他: {
                  子分区名称: "音游",
                  "稿件总时长（秒）": 43,
                  播放数: 114,
                  评论数: 4,
                  收藏数: 4,
                  投币数: 2,
                  获赞数: 30,
                  粉丝数: 108,
                  关注数: 237,
                  签名: "cn白崎弥/阿弥 #cosplay \n可以叫我阿弥！坐标西安\n扩列请走企鹅：1678414737\n这边拿来堆点舞什么的～～",
                  标签: [
                    "快乐",
                    "生贺",
                    "偶像梦幻祭",
                    "偶像梦幻祭2",
                    "生日",
                    "三毛缟斑",
                    "三毛缟斑0516生日快乐",
                    "谷阵",
                    "谷美",
                  ],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
              time: "2024-05-15 23:00:03",
            },
            {
              id: "1504570801",
              channel: "BiliBili",
              content:
                "【自存】三毛缟斑2024生日,斑生日快乐！\n戴着小杏给的胸针去向全大楼炫耀这句，我又嗑到了...哎哟斑杏99！！",
              update_time: "2024-05-17 19:40:12",
              classification: "fan_content",
              link: "http://www.bilibili.com/video/av1504570801",
              type: "视频",
              publishTime: "2024-05-16 19:03:30",
              collectionTime: "2024-05-16 19:30:14",
              ABAS: [
                {
                  评价维度: "生日",
                  观点词: "快乐",
                  情感倾向: "positive",
                },
                {
                  评价维度: "胸针",
                  观点词: "漂亮",
                  情感倾向: "positive",
                },
                {
                  评价维度: "斑杏",
                  观点词: "喜欢",
                  情感倾向: "positive",
                },
              ],
              emotion: {
                label: "正向",
                value: "positive",
              },
              authorId: "34680338",
              authorName: "啤酒茶-斑杏已婚99",
              others: {
                子分区名称: "手机游戏",
                "稿件总时长（秒）": 136,
                播放数: 46,
                收藏数: 2,
                投币数: 2,
                获赞数: 6,
                粉丝数: 266,
                关注数: 153,
                签名: "✙cn啤酒茶✙es｜三毛缟斑/月永雷欧/衣更真绪｜斑杏上头中｜APH左独左耀/主产独中✙天雷右独右耀✙请不要在我面前讨论独中外的右耀\n",
                标签: ["偶像梦幻祭", "偶像梦幻祭2", "三毛缟斑"],
              },
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1504570801",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "【自存】三毛缟斑2024生日,斑生日快乐！\n戴着小杏给的胸针去向全大楼炫耀这句，我又嗑到了...哎哟斑杏99！！",
                作者ID: "34680338",
                作者: "啤酒茶-斑杏已婚99",
                发布时间: "2024-05-16 19:03:30",
                更新时间: "2024-05-17 19:40:12",
                采集时间: "2024-05-16 19:30:14",
                整体情感: {
                  label: "正向",
                  value: "positive",
                },
                ABAS分析: [
                  {
                    评价维度: "生日",
                    观点词: "快乐",
                    情感倾向: "positive",
                  },
                  {
                    评价维度: "胸针",
                    观点词: "漂亮",
                    情感倾向: "positive",
                  },
                  {
                    评价维度: "斑杏",
                    观点词: "喜欢",
                    情感倾向: "positive",
                  },
                ],
                其他: {
                  子分区名称: "手机游戏",
                  "稿件总时长（秒）": 136,
                  播放数: 46,
                  收藏数: 2,
                  投币数: 2,
                  获赞数: 6,
                  粉丝数: 266,
                  关注数: 153,
                  签名: "✙cn啤酒茶✙es｜三毛缟斑/月永雷欧/衣更真绪｜斑杏上头中｜APH左独左耀/主产独中✙天雷右独右耀✙请不要在我面前讨论独中外的右耀\n",
                  标签: ["偶像梦幻祭", "偶像梦幻祭2", "三毛缟斑"],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
              time: "2024-05-16 19:03:30",
            },
            {
              id: "1954706151",
              channel: "BiliBili",
              content:
                "【0518天城燐音生贺】Love sick,甜橙小燐生日快乐！\n提前两周滑铲搞出来了中途一直在修改什么的（汗）\n其实按个人标准来讲这真的算是第一次做手书了（什么标准？\n总之艰难的做出来了毕竟我真的不会剪视频啊！连自己画的分镜和草稿都没看懂啊救命！\n除了手书里的注意事项外\n内容中有大量的个人理解和编造（x）ooc也很致歉（鞠躬）\n以及本人的表达能力有限但是真的尽力了，因为我认为他真的很适合这首歌！！！！\n感谢各位能够看完！\n再次在这一天祝天城燐音生日快乐！",
              update_time: "2024-05-19 05:40:10",
              classification: "fan_content",
              link: "http://www.bilibili.com/video/av1954706151",
              type: "视频",
              publishTime: "2024-05-18 05:18:29",
              collectionTime: "2024-05-18 05:30:11",
              ABAS: [
                {
                  评价维度: "手书",
                  观点词: "艰难的做出来了",
                  情感倾向: "neutral",
                },
                {
                  评价维度: "视频剪辑",
                  观点词: "不会",
                  情感倾向: "negative",
                },
                {
                  评价维度: "个人理解和编造",
                  观点词: "大量",
                  情感倾向: "neutral",
                },
                {
                  评价维度: "OOC",
                  观点词: "很致歉",
                  情感倾向: "neutral",
                },
                {
                  评价维度: "表达能力",
                  观点词: "有限",
                  情感倾向: "negative",
                },
                {
                  评价维度: "天城燐音",
                  观点词: "适合这首歌",
                  情感倾向: "positive",
                },
                {
                  评价维度: "生日",
                  观点词: "快乐",
                  情感倾向: "positive",
                },
              ],
              emotion: {
                label: "正向",
                value: "positive",
              },
              authorId: "440914738",
              authorName: "shdnxuabskoe",
              others: {
                子分区名称: "短片·手书",
                "稿件总时长（秒）": 189,
                播放数: 126,
                弹幕数: 1,
                评论数: 8,
                收藏数: 9,
                投币数: 20,
                分享数: 3,
                获赞数: 24,
                粉丝数: 116,
                关注数: 257,
                标签: ["手书", "生贺", "偶像梦幻祭2", "天城燐音"],
              },
              channelContentType: "BiliBili-视频",
              info: {
                ID: "1954706151",
                渠道: "BiliBili",
                内容类型: "视频",
                内容: "【0518天城燐音生贺】Love sick,甜橙小燐生日快乐！\n提前两周滑铲搞出来了中途一直在修改什么的（汗）\n其实按个人标准来讲这真的算是第一次做手书了（什么标准？\n总之艰难的做出来了毕竟我真的不会剪视频啊！连自己画的分镜和草稿都没看懂啊救命！\n除了手书里的注意事项外\n内容中有大量的个人理解和编造（x）ooc也很致歉（鞠躬）\n以及本人的表达能力有限但是真的尽力了，因为我认为他真的很适合这首歌！！！！\n感谢各位能够看完！\n再次在这一天祝天城燐音生日快乐！",
                作者ID: "440914738",
                作者: "shdnxuabskoe",
                发布时间: "2024-05-18 05:18:29",
                更新时间: "2024-05-19 05:40:10",
                采集时间: "2024-05-18 05:30:11",
                整体情感: {
                  label: "正向",
                  value: "positive",
                },
                ABAS分析: [
                  {
                    评价维度: "手书",
                    观点词: "艰难的做出来了",
                    情感倾向: "neutral",
                  },
                  {
                    评价维度: "视频剪辑",
                    观点词: "不会",
                    情感倾向: "negative",
                  },
                  {
                    评价维度: "个人理解和编造",
                    观点词: "大量",
                    情感倾向: "neutral",
                  },
                  {
                    评价维度: "OOC",
                    观点词: "很致歉",
                    情感倾向: "neutral",
                  },
                  {
                    评价维度: "表达能力",
                    观点词: "有限",
                    情感倾向: "negative",
                  },
                  {
                    评价维度: "天城燐音",
                    观点词: "适合这首歌",
                    情感倾向: "positive",
                  },
                  {
                    评价维度: "生日",
                    观点词: "快乐",
                    情感倾向: "positive",
                  },
                ],
                其他: {
                  子分区名称: "短片·手书",
                  "稿件总时长（秒）": 189,
                  播放数: 126,
                  弹幕数: 1,
                  评论数: 8,
                  收藏数: 9,
                  投币数: 20,
                  分享数: 3,
                  获赞数: 24,
                  粉丝数: 116,
                  关注数: 257,
                  标签: ["手书", "生贺", "偶像梦幻祭2", "天城燐音"],
                },
              },
              textType: {
                label: "粉丝内容",
                value: "fan_content",
              },
              time: "2024-05-18 05:18:29",
            },
          ],
          filterOptions: {
            channelContentType: [
              {
                label: "全部",
                value: "",
              },
              {
                value: "weibo-ref_micro_blog",
                label: "新浪微博-转发微博",
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
                value: "bilibili-video",
                label: "BiliBili-视频",
              },
              {
                value: "weibo-comment",
                label: "新浪微博-评论",
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
            channel: [
              {
                label: "全部",
                value: "",
              },
              {
                label: "新浪微博",
                value: "weibo",
              },
              {
                label: "BiliBili",
                value: "bilibili",
              },
              {
                label: "TapTap",
                value: "taptap",
              },
              {
                label: "苹果应用商店",
                value: "appstore",
              },
              {
                label: "抖音短视频",
                value: "douyin",
              },
              {
                label: "华为应用中心",
                value: "huawei",
              },
              {
                label: "小米游戏中心",
                value: "mi",
              },
              {
                label: "NGA玩家社区",
                value: "nga",
              },
              {
                label: "百度贴吧",
                value: "tieba",
              },
              {
                label: "小红书",
                value: "xhs",
              },
              {
                label: "知乎",
                value: "zhihu",
              },
              {
                label: "百度搜索",
                value: "baidu",
              },
              {
                label: "Youtube",
                value: "youtube",
              },
              {
                label: "Reddit",
                value: "reddit",
              },
              {
                label: "Twitter",
                value: "twitter",
              },
              {
                label: "GoogleStore",
                value: "google_store",
              },
            ],
          },
        },
        message: "",
      };
    },
  },

  ///乐次元自定义看板
  /// 乐次元趋势图

  {
    url: "/leciyuan/trend/chart",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {
          dimensions: ["time", "评论", "点赞", "转发"],
          source: [
            {
              time: "2022-01",
              评论: 100,
              点赞: 200,
              转发: 100,
              details: {
                xxx徽章: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },
                xxx徽章2: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },
              },
            },
          ],
        },
      };
    },
  },
  /// 乐次元数据表
  {
    url: "/leciyuan/product/table",
    method: "post",
    handler: async (ctx) => {
      await delay(1000);

      ctx.body = {
        code: 0,
        data: {
          list: genOptions(2, (index) => {
            return {
              id: index,
              content: null,
              repostsCount: 0,
              commentsCount: 0,
              attitudesCount: 0,
              link: null,
              publishTime: "2024-06-05 07:00:10",
              emotion: null,
              authorId: null,
              authorName: null,
              channelContentType: "华为应用中心-评分",
              info: {
                ID: "019378f8b4dbf88f054720a5710c3966",
                渠道: "华为应用中心",
                内容类型: "评分",
                内容: null,
                作者ID: null,
                作者: null,
                发布时间: "2024-06-05 07:00:10",
                更新时间: "",
                采集时间: "2024-06-05 07:00:10",
                整体情感: null,
                ABAS分析: [],
                其他: {
                  评分: "4.4",
                  评论量: 703,
                },
              },
              textType: {
                label: "",
                value: "",
              },
            };
          }),
          pager: {
            curPage: 1,
            pageSize: 10,
            total: 1089,
          },
          time: {
            startTime: "2024/06/05",
            endTime: "2024/06/05",
          },
          filterOptions: {
            channelContentType: [
              {
                label: "全部",
                value: "",
              },
              {
                value: "bilibili-video",
                label: "BiliBili-视频",
              },
              {
                value: "huawei-review_score",
                label: "华为应用中心-评分",
              },
              {
                value: "bilibili-comment",
                label: "BiliBili-评论",
              },
              {
                value: "weibo-ref_micro_blog",
                label: "新浪微博-转发微博",
              },
              {
                value: "weibo-micro_blog",
                label: "新浪微博-原创微博",
              },
              {
                value: "weibo-comment",
                label: "新浪微博-评论",
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
        message: "",
      };
    },
  },
];
