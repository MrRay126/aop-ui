import { OpinionType, MarketType } from "@/views/dashbord/data/index.js";

export const score = "score";
export const commentCount = "commentCount";
export const trend = "trend";
export const wordCloud = "wordCloud";

export const anylysisTypesLabel = {
  [trend]: "趋势",
  [score]: "评分",
  [wordCloud]: "词云",
};

export const scoreTypeLabel = {
  [score]: "评分",
  [commentCount]: "评论量",
};

export const scoreTypeOptions = [
  { label: "评分", value: score },
  { label: "评论量", value: commentCount },
];

export const unitOptions = [
  { label: "按天", unit: "day" },
  {
    label: "按小时",
    unit: "hour",
    children: [],
  },
  { label: "按周", unit: "week", weekStart: 0 },
  { label: "按月", unit: "month" },
  { label: "合计", unit: "sum" },
];

export function getDimension($parent) {
  const dimensions = [
    {
      width: "50px",
      actionType: "expand", //
      expandContentHtmlHandler: (header, row) => {
        return `<div style="padding:30px;line-height:25px;">${JSON.stringify(
          row.info,
          null,
          5
        )}</div>`;
      },
    },
    {
      label: "内容",
      prop: "content",
      minWidth: "150px",
    },

    {
      label: "整体情感",
      prop: "emotion",
      width: "100px",
      // actionType: "filter",

      contentType(row) {
        if (row.inEditing) {
          // this 指向自身
          return "component";
        }
        return "";
      },
      //内容组件, 设置content 支持 select input (使用coponent需先指定contentType为 'component')
      contentComponent: {
        handler(row) {
          if (row.inEditing) {
            // this 指向自身
            return "select";
          }
        },

        modelProp: "emotion",

        //组件配置项
        config(row) {
          return {
            // multiple: true,
            filterable: true,
            disabled: row.committing,
            "value-key": "value",
          };
        },

        //组件事件
        onChange() {},

        // select 组件的options
        options: [],
      },
    },

    {
      label: "文本类型",
      prop: "textType",
      width: "100px",
      hasTooltip: false,
      // actionType: "filter",

      contentType(row) {
        if (row.inEditing) {
          // this 指向自身
          return "component";
        }
        return "";
      },
      //内容组件, 设置content 支持 select input (使用coponent需先指定contentType为 'component')
      contentComponent: {
        handler(row) {
          if (row.inEditing) {
            // this 指向自身
            return "select";
          }
        },

        modelProp: "textType",

        //组件配置项
        config(row) {
          return {
            // multiple: true,
            filterable: true,
            disabled: row.committing,
            "value-key": "value",
          };
        },

        //组件事件
        onChange() {},

        // select 组件的options
        options: [],
      },
    },
    {
      label: "操作",
      prop: "",
      width: "300px",
      isActionColumn: true, // 是否是操作列 查看、删除等

      actions: [
        {
          name: "jumpOriginalArticleLink", // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
          loadingRowTag: "", // 操作过程自动loading设置任意值
          //函数或字符串
          label: "跳转原文",

          ifShow(row) {
            // this指向dynamic-table的父组件
            return !row.inEditing && row.link;
          },

          ifDisabled() {
            // this指向dynamic-table的父组件
            return false;
          },

          action(row) {
            // this指向dynamic-table的父组件
            return $parent.handleJumpLink(row);
          },
        },

        {
          label: "重新标注", // 名称

          ifShow: (row) => {
            // 计算是否显示
            return !row.inEditing;
          },
          ifDisabled: () => {
            // 计算disabled
            return false;
          },
          action(row) {
            // 操作动作

            return $parent.handleReDimension(row, $parent.dimensions); // 包含在<main> 中
          },
        },

        {
          label: "KOL分析", // 名称
          ifShow: (row) => {
            // 计算是否显示
            return !row.inEditing && row.authorId;
          },
          ifDisabled() {
            // 计算disabled
            return false;
          },
          action(row) {
            // 操作动作
            $parent.jumpAnylysis(row, MarketType.kol);
          },
        },

        {
          label: "传播分析", // 名称
          ifShow: (row) => {
            // 计算是否显示
            const channel = row["channelContentType"]?.split("-")[0];
            const contentType = row["channelContentType"]?.split("-")[1];

            return (
              !row.inEditing &&
              channel === "新浪微博" &&
              ["原创微博", "转发微博"].includes(contentType)
            );
          },
          ifDisabled() {
            return false;
          },
          action(row) {
            // 操作动作
            $parent.jumpAnylysis(row, OpinionType.spread);
          },
        },

        {
          label: "取消", // 名称
          ifShow: (row) => {
            // 计算是否显示
            return row.inEditing;
          },
          ifDisabled: (row) => {
            // 计算disabled
            return row.committing;
          },
          action(row) {
            // 操作动作
            return $parent.handleCancel(row);
          },
        },

        {
          label: "更新", // 名称
          loadingRowTag: true,

          ifShow: (row) => {
            // 计算是否显示
            return row.inEditing;
          },

          ifDisabled: () => {
            // 计算disabled
            return false;
          },
          action(row) {
            // 操作动作
            const configs = $parent.getParams();
            return $parent.handleUpdate(row, configs);
          },
        },
      ],
    },
  ];

  return dimensions;
}
