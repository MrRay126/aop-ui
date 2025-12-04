import { getLabelvalueList, getLabelMap } from "@/utils";

export function getDimension(vm) {
  return [
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
      label: "渠道-内容类型",
      prop: "channelContentType",
      width: "200px",
      actionType: "filter", // 排序类型
      // hasTooltip: true,
    },
    {
      label: "内容",
      prop: "content",
      hasTooltip: false,
      minWidth: "200px",
      actionType: "search", // 排序类型
    },
    {
      label: "作者名称",
      prop: "authorName",
      // hasTooltip: true,
      width: "200px",
    },
    {
      label: "发布时间",
      prop: "publishTime",
      actionType: "sort",
      width: "200px",
      // hasTooltip: true,
    },
    {
      label: "整体情感",
      prop: "emotion",
      width: "120px",
      actionType: "filter",

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
      width: "120px",
      hasTooltip: false,
      actionType: "filter",

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
      label: "转发数",
      prop: "repostsCount",
      actionType: "",
      width: "100px",
    },
    {
      label: "评论数",
      prop: "commentsCount",
      actionType: "",
      width: "100px",
    },
    {
      label: "点赞数",
      prop: "attitudesCount",
      actionType: "",
      width: "100px",
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
            return vm.handleJumpLink(row);
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
          action: (row) => {
            // 操作动作
            return vm.handleReDimension(row);
          },
        },
        {
          label: "下钻分析", // 名称

          ifShow: (row) => {
            // 计算是否显示
            return !row.inEditing;
          },
          ifDisabled: () => {
            // 计算disabled
            return false;
          },
          action: (row) => {
            // 操作动作
            return vm.handleXiaZuan(row);
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
          action: (row) => {
            // 操作动作
            return vm.handleCancel(row);
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
          action: (row) => {
            // 操作动作
            return vm.handleUpdate(row);
          },
        },
      ],
    },
  ];
}

export const types = {
  0: "评论趋势",
  1: "转发趋势",
  2: "评论词云",
  3: "转发词云",
  4: "传播分析",
};

export const typeMapCn = getLabelMap(types);
export const typesList = getLabelvalueList(types);

export function getSpreadTableDimension() {
  return [
    {
      width: "50px",
      actionType: "expand", //
      // expandContentHtmlHandler: (header, row) => {

      //   return `<div style="padding:30px;line-height:25px;">${JSON.stringify(
      //     row.info,
      //     null,
      //     5
      //   )}</div>`;
      // },
    },

    {
      label: "用户",
      prop: "user",
      minWidth: "100px",
      // hasTooltip: true, //是否使用toolTip
    },
    {
      label: "关注度",
      prop: "focus_num",
      minWidth: "80px",
      // hasTooltip: true,
    },
    {
      label: "活跃度",
      prop: "active_num",
      minWidth: "80px",
      actionType: "info",
      tip: "相关帖子发布数",
      // hasTooltip: true,
    },
    {
      label: "扩散度",
      prop: "spread_num",
      actionType: "info",
      tip: "获得的总转发数",
      minWidth: "80px",
      // hasTooltip: true,
    },
    {
      label: "内容量",
      prop: "content_count",
      minWidth: "80px",
      // hasTooltip: true,
    },
    {
      label: "影响度",
      prop: "effect_num",
      actionType: "info",
      tip: "获得的总点赞数",
      minWidth: "80px",
      // hasTooltip: true,
    },
    {
      label: "讨论度",
      prop: "comments_count",
      // actionType: "info",
      // tip: "用户在传播中的中心程度",
      minWidth: "80px",
      // hasTooltip: true,
    },
  ];
}
