// 项目管理
const { require, baseUrl } = exports;
const path = require("path");
const fs = require("fs");
// const multipart = require("connect-multiparty");
// var multipartMiddleware = multipart();

const {
  randomNumber,
  pluckRandom,
  pluckSome,
  genOptions,
  delay,
  varifyDataProp,
} = require("./utils/index.js");
// const requireFile = require("./utils/require.js");
const dataPath = path.join(baseUrl, "../data.js");
// const data = requireFile(dataPath);
// const { noGoalNoAbData, noGoalHasAbData, goalAndAbData, goalsNoAbData } = data;
// console.log('createFile:',)

let requestCount = 0;
exports.dataPaths = [dataPath];
exports.routes = [
  //获取项目信息
  {
    url: "/api/project/info",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {
          id: "0",
          name: "项目名称",
          createTime: "2022-12-12 00:22:22",
          admin: ["张三", "李四"],
          keywords: [{ channel: "微博", data: ["偶像梦幻祭1", "偶像梦幻祭3"] }],
        },
      };
    },
  },

  // 获取数据表数据
  {
    url: "/api/project/table/data",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        data: {
          source: genOptions(10, (index) => {
            return {
              id: index,
              memberName: "san.zhang",
              displayName: "张三" + index,
              // roles: "项目分析师",
              rolesData: {
                label: "项目分析师",
                value: "analyst",
              },

              permision: ["全部权限"],
              lastLoginTime: "2022-12-22 12:12:12",
            };
          }),

          filterOptions: {
            roles: [
              {
                label: "项目分析师",
                value: "analyst",
              },
              {
                label: "项目成员",
                value: "member",
              },
            ],
          },

          pager: {
            curPage: 1,
            pageSize: 10,
            total: pluckRandom([123, 333]),
          },
        },
      };
    },
  },

  // 保存新建
  {
    url: "/api/save/member",
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

  // 更新数据
  {
    url: "/api/update/member",
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

  // delete
  {
    url: "/api/update/member",
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

  //获取成员选项
  {
    url: "/api/member/list",
    method: "get",
    handler: async (ctx) => {
      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: genOptions(10, (index) => {
          return {
            id: index,
            label: pluckRandom(["张三", "李四", "王二麻"]),
            value: "username" + index,
            permision: ["全部权限"],
            rolesData: {
              label: "项目分析师",
              value: "analyst",
            },
          };
        }),
      };
    },
  },

  /**
   * 账号管理数据表
   */

  //获取成员选项
  {
    url: "/account/table",
    method: "get",
    handler: async (ctx) => {
      requestCount++;
      await delay(requestCount % 2 === 0 ? 1000 : 5000);
      ctx.body = {
        code: 0,
        message: "",
        data: {
          results: genOptions(10, (index) => {
            return {
              accountId: index, //账号id,
              name: pluckRandom([
                "长名称的名字比较长的名称" + requestCount,
                "middlename element" + requestCount,
                "shortname" + requestCount,
              ]),
              channel: pluckRandom(["B站", "微博", "抖音", "小红书"]),
              cookie: pluckRandom([
                "cookie value",
                "short",
                "lllong value of cookie value value",
              ]),
              comment: pluckRandom([
                "备注",
                "备注的内容中等长度的字符串",
                "备注的内容长等长度的字符串,备注的内容长等长度的字符串",
              ]),
              updateTime: "2022-12-12 00:22:22",
              status: pluckRandom(["normal", "abnormal", "stoped"]),
              patchable: pluckRandom([true, false]),

              detail: {
                dimensions: genOptions(
                  pluckRandom([3, 10, 20, 30]),
                  (index) => {
                    return {
                      label: "2022-12-" + (index + 1),
                      prop: "column" + (index + 1),
                      minWidth: 110,
                    };
                  }
                ),

                source: genOptions(pluckRandom([3, 10, 20, 30]), () => {
                  return {
                    column1: "column1",
                    column2: "column1",
                    column3: "column1",
                    column4: "column1",
                  };
                }),
              },
            };
          }),

          pager: {
            total: 100,
          },
        },
      };
    },
  },

  //补全数据
  {
    url: "/request/patch",
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

  //新增媒体账号
  {
    url: "/add/new/account",
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

  //编辑媒体账号
  {
    url: "/edit/account",
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

  //删除媒体账号
  {
    url: "/delete/account",
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

  /**
   *  媒体账号数据统计
   * */

  // line-chart数据
  {
    url: "/account/line/chart",
    method: "post",
    handler: async (ctx) => {
      // 参数验证
      varifyDataProp(ctx.request.body, [
        {
          when: function () {
            return true;
          },
          needDataKeys: ["project_id", "channel", "time"],
          message: "error:line chart 接口",
        },
      ]);

      await delay(1000);
      ctx.body = {
        code: 0,
        message: "",
        data: {
          dimensions: ["product", "2015", "2016", "2017"],
          source: [
            { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
            { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
            { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
            { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
          ],
        },
      };
    },
  },

  // 账号统计数据
  {
    url: "/account/statistic/table",
    method: "post",
    handler: async (ctx) => {
      // 参数验证
      varifyDataProp(ctx.request.body, [
        {
          when: function () {
            return true;
          },
          needDataKeys: ["project_id", "channel", "pager", "filter", "time"],
          message: "error:table 接口",
        },
      ]);

      await delay(3000);
      ctx.body = {
        code: 0,
        message: "",
        data: {
          results: {
            dimensions: genOptions(10, (index) => {
              return {
                label: "2022-" + String(index).padStart(2, "0"),
                prop: "column" + index,
                minWidth: "100px",
                actionType: "sort",
              };
            }),

            source: genOptions(10, () => {
              const obj = {};
              for (let i = 0; i < 10; i++) {
                obj["column" + i] = pluckRandom([100, 200, 300, 400]);
              }
              return obj;
            }),
          },

          pager: { total: 100 },
        },
      };
    },
  },

  {
    url: "/export/file/:id",
    method: "get",
    handler: async (ctx) => {
      const filename = "dp_manual_dim.xlsx";

      // const filePath = path.join(baseUrl, "../test.zip");
      const filePath =
        "/Users/happyelements/Desktop/bimMock/dp_manual_dim.xlsx";
      const readStream = await fs.createReadStream(filePath, {
        // highWaterMark: 1,
      });
      const size = fs.statSync(filePath).size;

      ctx.set("Content-disposition", "attachment; filename=" + filename);
      // ctx.set("Content-type", "application/force-download");
      ctx.set("Content-type", "application/octet-stream");
      // ctx.set(
      //   "Content-type",
      //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      // );
      ctx.set("Content-Length", size);

      ctx.body = readStream;
    },
  },
];
