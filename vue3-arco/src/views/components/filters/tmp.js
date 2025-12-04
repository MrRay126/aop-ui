const d = {
  code: 0,
  data: [
    {
      title: "舆情内容",
      code: "aop.ods_aop",
      fields: [
        {
          title: "识别ID",
          code: "id",
          type: "text",
          options: [
            {
              label: "等于",
              value: "eq",
            },
            {
              label: "不等于",
              value: "neq",
            },
          ],
        },
        {
          title: "原始内容ID",
          code: "org_id",
          type: "text",
          options: [
            {
              label: "等于",
              value: "eq",
            },
            {
              label: "不等于",
              value: "neq",
            },
          ],
        },
        {
          title: "关联内容ID",
          code: "ref_id",
          type: "text",
          options: [
            {
              label: "等于",
              value: "eq",
            },
            {
              label: "不等于",
              value: "neq",
            },
          ],
        },
        {
          title: "粉丝数",
          code: "followers_count",
          type: "number",
          options: [
            {
              label: "等于",
              value: "eq",
            },
            {
              label: "不等于",
              value: "neq",
            },
            {
              label: "小于",
              value: "lt",
            },
            {
              label: "小于等于",
              value: "lte",
            },
            {
              label: "大于",
              value: "gt",
            },
            {
              label: "大于等于",
              value: "gte",
            },
            {
              label: "区间",
              value: "between",
            },
            {
              label: "有值",
              value: "notNull",
            },
            {
              label: "无值",
              value: "null",
            },
          ],
        },
        {
          title: "渠道",
          code: "channel",
          type: "channel",
          options: [
            {
              label: "等于",
              value: "eq",
            },
            {
              label: "不等于",
              value: "neq",
            },
          ],
          choices: [
            {
              title: "新浪微博",
              code: "weibo",
              type: "channel",
              choices: [
                {
                  title: "原创微博",
                  code: "micro_blog",
                },
                {
                  title: "转发微博",
                  code: "ref_micro_blog",
                },
                {
                  title: "评论",
                  code: "comment",
                },
              ],
            },
            {
              title: "BiliBili",
              code: "bilibili",
              type: "channel",
              choices: [
                {
                  title: "视频",
                  code: "video",
                },
                {
                  title: "弹幕",
                  code: "danmuku",
                },
                {
                  title: "评论",
                  code: "comment",
                },
                {
                  title: "评价",
                  code: "review",
                },
              ],
            },
            {
              title: "TapTap",
              code: "taptap",
              type: "channel",
              choices: [
                {
                  title: "评价",
                  code: "review",
                },
                {
                  title: "帖子",
                  code: "post",
                },
              ],
            },
            {
              title: "苹果应用商店",
              code: "appstore",
              type: "channel",
              choices: [
                {
                  title: "评价",
                  code: "review",
                },
              ],
            },
            {
              title: "抖音短视频",
              code: "douyin",
              type: "channel",
              choices: [
                {
                  title: "短视频",
                  code: "short_video",
                },
              ],
            },
            {
              title: "华为应用中心",
              code: "huawei",
              type: "channel",
              choices: [
                {
                  title: "评价",
                  code: "review",
                },
              ],
            },
            {
              title: "小米游戏中心",
              code: "mi",
              type: "channel",
              choices: [
                {
                  title: "评价",
                  code: "review",
                },
              ],
            },
            {
              title: "NGA玩家社区",
              code: "nga",
              type: "channel",
              choices: [
                {
                  title: "帖子",
                  code: "post",
                },
              ],
            },
            {
              title: "百度贴吧",
              code: "tieba",
              type: "channel",
              choices: [
                {
                  title: "帖子",
                  code: "post",
                },
              ],
            },
            {
              title: "小红书",
              code: "xhs",
              type: "channel",
              choices: [
                {
                  title: "笔记",
                  code: "note",
                },
              ],
            },
            {
              title: "知乎",
              code: "zhihu",
              type: "channel",
              choices: [
                {
                  title: "回答",
                  code: "answer",
                },
              ],
            },
            {
              title: "百度搜索",
              code: "baidu",
              type: "channel",
              choices: [
                {
                  title: "搜索结果",
                  code: "search_result",
                },
              ],
            },
          ],
        },
        {
          title: "内容类型",
          code: "content_type",
          type: "text",
          options: [
            {
              label: "等于",
              value: "eq",
            },
            {
              label: "不等于",
              value: "neq",
            },
          ],
          choices: [
            {
              title: "帖子",
              code: "post",
            },
            {
              title: "视频",
              code: "video",
            },
            {
              title: "弹幕",
              code: "danmuku",
            },
            {
              title: "评论",
              code: "comment",
            },
            {
              title: "评价",
              code: "review",
            },
            {
              title: "搜索结果",
              code: "search_result",
            },
            {
              title: "回答",
              code: "answer",
            },
            {
              title: "笔记",
              code: "note",
            },
            {
              title: "短视频",
              code: "short_video",
            },
            {
              title: "原创微博",
              code: "micro_blog",
            },
            {
              title: "转发微博",
              code: "ref_micro_blog",
            },
          ],
        },
        {
          title: "整体情感",
          code: "sentiment_rough",
          type: "text",
          options: [
            {
              label: "等于",
              value: "eq",
            },
            {
              label: "不等于",
              value: "neq",
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
          title: "文本内容",
          code: "content",
          type: "text",
          options: [
            {
              label: "包含",
              value: "like",
            },
            {
              label: "不包含",
              value: "notLike",
            },
            {
              label: "正则匹配",
              value: "match",
            },
            {
              label: "正则不匹配",
              value: "notMatch",
            },
          ],
        },
        {
          title: "作者",
          code: "author",
          type: "text",
          options: [
            {
              label: "等于",
              value: "eq",
            },
            {
              label: "不等于",
              value: "neq",
            },
            {
              label: "包含",
              value: "like",
            },
            {
              label: "不包含",
              value: "notLike",
            },
            {
              label: "正则匹配",
              value: "match",
            },
            {
              label: "正则不匹配",
              value: "notMatch",
            },
          ],
        },
        {
          title: "作者ID",
          code: "author_id",
          type: "text",
          options: [
            {
              label: "等于",
              value: "eq",
            },
            {
              label: "不等于",
              value: "neq",
            },
          ],
        },
        {
          title: "热词",
          code: "hotword",
          type: "text",
          options: [
            {
              value: "like",
              label: "包含",
            },
            {
              value: "notLike",
              label: "不包含",
            },
          ],
          choices: [
            {
              title: "d d",
              code: 63,
            },
            {
              title: "只有我可以看到",
              code: 62,
            },
            {
              title: "是大神",
              code: 61,
            },
            {
              title: "test_ww",
              code: 60,
            },
            {
              title: "为什么",
              code: 59,
            },
            {
              title: "我当时",
              code: 58,
            },
            {
              title: "武德",
              code: 57,
            },
            {
              title: "推",
              code: 54,
            },
            {
              title: "删除热词2",
              code: 50,
            },
            {
              title: "test系统-妈咪",
              code: 38,
            },
            {
              title: "111",
              code: 36,
            },
            {
              title: "热词2",
              code: 31,
            },
            {
              title: "啦啦啦_你看的到吗有一个下划线",
              code: 27,
            },
            {
              title: "22222",
              code: 19,
            },
            {
              title: "你推",
              code: 6,
            },
            {
              title: "妈咪",
              code: 2,
            },
          ],
        },
        {
          title: "热词组",
          code: "hotwordgroup",
          type: "text",
          options: [
            {
              value: "like",
              label: "包含",
            },
            {
              value: "notLike",
              label: "不包含",
            },
          ],
          choices: [
            {
              title: "阿八八八",
              code: 87,
            },
            {
              title: "test_group_3",
              code: 86,
            },
            {
              title: "test_group_2",
              code: 85,
            },
            {
              title: "test_word_group",
              code: 84,
            },
            {
              title: "test_group",
              code: 83,
            },
            {
              title: "zz",
              code: 82,
            },
            {
              title: "ss",
              code: 81,
            },
            {
              title: "删除热词组3",
              code: 77,
            },
            {
              title: "test1",
              code: 73,
            },
            {
              title: "测试非法词",
              code: 68,
            },
            {
              title: "3333",
              code: 66,
            },
            {
              title: "11",
              code: 43,
            },
            {
              title: "030405",
              code: 40,
            },
            {
              title: "测试一下",
              code: 39,
            },
            {
              title: "liuyntest-分享3333",
              code: 8,
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
              title: "阿八八八",
              value: 87,
              type: "文本",
            },
            {
              title: "test_group_3",
              value: 86,
              type: "文本",
            },
            {
              title: "test_group_2",
              value: 85,
              type: "文本",
            },
            {
              title: "test_word_group",
              value: 84,
              type: "文本",
            },
            {
              title: "test_group",
              value: 83,
              type: "文本",
            },
            {
              title: "zz",
              value: 82,
              type: "文本",
            },
            {
              title: "ss",
              value: 81,
              type: "文本",
            },
            {
              title: "删除热词组3",
              value: 77,
              type: "文本",
            },
            {
              title: "test1",
              value: 73,
              type: "文本",
            },
            {
              title: "测试非法词",
              value: 68,
              type: "文本",
            },
            {
              title: "3333",
              value: 66,
              type: "文本",
            },
            {
              title: "11",
              value: 43,
              type: "文本",
            },
            {
              title: "030405",
              value: 40,
              type: "文本",
            },
            {
              title: "测试一下",
              value: 39,
              type: "文本",
            },
            {
              title: "liuyntest-分享3333",
              value: 8,
              type: "文本",
            },
          ],
        },
        {
          title: "热词",
          name: "word",
          data: [
            {
              title: "d d",
              value: 63,
              type: "文本",
            },
            {
              title: "只有我可以看到",
              value: 62,
              type: "文本",
            },
            {
              title: "是大神",
              value: 61,
              type: "文本",
            },
            {
              title: "test_ww",
              value: 60,
              type: "文本",
            },
            {
              title: "为什么",
              value: 59,
              type: "文本",
            },
            {
              title: "我当时",
              value: 58,
              type: "文本",
            },
            {
              title: "武德",
              value: 57,
              type: "文本",
            },
            {
              title: "推",
              value: 54,
              type: "文本",
            },
            {
              title: "删除热词2",
              value: 50,
              type: "文本",
            },
            {
              title: "test系统-妈咪",
              value: 38,
              type: "文本",
            },
            {
              title: "111",
              value: 36,
              type: "文本",
            },
            {
              title: "热词2",
              value: 31,
              type: "文本",
            },
            {
              title: "啦啦啦_你看的到吗有一个下划线",
              value: 27,
              type: "文本",
            },
            {
              title: "22222",
              value: 19,
              type: "文本",
            },
            {
              title: "你推",
              value: 6,
              type: "文本",
            },
            {
              title: "妈咪",
              value: 2,
              type: "文本",
            },
          ],
        },
      ],
      valueComponentConfig: {
        //key值和组件的对应关系
        keys: {
          id: [
            {
              includesRelations: ["等于", "不等于"], //includesRelations:包含的relation关系,excludesRelations: 不包含的relation关系;   如果不配置 includesRelations,和excludesRelations则默认所有关系使用配置的组件
              component: {
                name: "select", // 值输入组件名称
                options: {
                  //组件的配置选项
                  isRemote: true, // 是否是远程搜索
                  isMultipleSelect: true, // 是否是多选
                },
              },
            },
          ],

          channel: [
            {
              component: {
                name: "cascader",
                options: {},
              },
            },
          ],

          content: [
            {
              component: {
                name: "text",
                options: {},
              },
            },
          ],
          author_id: [
            {
              component: {
                name: "select",
                options: {
                  isRemote: true,
                  isMultipleSelect: true,
                },
              },
            },
          ],
          author: [
            {
              component: {
                name: "select",
                options: {
                  isRemote: true,
                  isMultipleSelect: true,
                },
              },
            },
          ],
          ref_id: [
            {
              component: {
                name: "select",
                options: {
                  isRemote: true,
                  isMultipleSelect: true,
                },
              },
            },
          ],
          org_id: [
            {
              component: {
                name: "select",
                options: {
                  isRemote: true,
                  isMultipleSelect: true,
                },
              },
            },
          ],

          followers_count: [
            {
              excludesRelations: ["有值", "无值"],
              component: {
                name: "number",
                options: {},
              },
            },
            {
              includesRelations: ["区间"], // 如果不配置 includesRelations,和excludesRelations则默认所有关系使用配置的组件
              component: {
                name: "numberBetween",
                options: {},
              },
            },
          ],

          sentiment_rough: [
            {
              component: {
                name: "select",
                options: {
                  isMultipleSelect: true,
                },
              },
            },
          ],

          content_type: [
            {
              component: {
                name: "select",
                options: {},
              },
            },
          ],

          hotword: [
            {
              component: {
                name: "select",
                options: {
                  isMultipleSelect: true,
                },
              },
            },
          ],
          hotwordgroup: [
            {
              component: {
                name: "select",
                options: {
                  isMultipleSelect: true,
                },
              },
            },
          ],
        },
        //key值的数据类型和组件的对应关系
        types: {
          //数值类型的字段
          number: [
            {
              includesRelations: ["有值", "无值"],
              component: {
                name: null,
              },
            },
            {
              includesRelations: ["区间"],
              component: {
                name: "numberBetween",
              },
            },
            {
              excludesRelations: ["有值", "无值", "区间"],
              component: {
                name: "number",
                options: {},
              },
            },
          ],
          //文本类型的字段
          text: [
            {
              excludesRelations: ["有值", "无值"],
              component: {
                name: "text",
                options: {},
              },
            },
          ],
          //日期类型的字段
          datetime: [
            {
              includesRelations: ["区间"],
              component: {
                name: "datetimeRange",
              },
            },
            {
              excludesRelations: ["区间"],
              component: {
                name: "datetime",
                options: {},
              },
            },
          ],
        },
      },
    },
  ],
  message: "",
};
