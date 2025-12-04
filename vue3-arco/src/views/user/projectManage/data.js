export const formDimensions = [
  {
    label: "成员账号",
    prop: "memberName",
  },

  {
    label: "显示名",
    prop: "displayName",
  },

  {
    label: "项目角色",
    prop: "roles",
    //设置content 支持 select input

    contentType: "component",

    contentComponent: {
      handler() {
        // if (row.inEditing) {
        return "select";
        // }
      },

      modelProp: "rolesData",

      //组件配置项
      config() {
        // this 指向为table组件的父组件
        return {
          filterable: true,
          "value-key": "value",
        };
      },

      onChange(row) {
        // this 指向为table组件的父组件
        row.roles = row.rolesData.label;
      },
      // select 组件的options
      options: [],
    },
  },

  {
    label: "数据权限",
    prop: "permision",
    contentType: "tags", // tag标签:tags   格式化可点击数据: data
    tagType: {
      default: "primary",
    },
  },
];

export const dimensions = [
  {
    label: "成员账号",
    prop: "value",
    width: "",
    // hasTooltip: true, //是否使用toolTip
  },
  {
    label: "显示名",
    prop: "label",
  },
  {
    label: "项目角色",
    prop: "roles",
    actionType: "filter", // 排序类型

    contentType: "component",
    //设置content 支持 select input
    contentComponent: {
      handler(row) {
        if (row.inEditing) {
          return "select";
        }
      },

      modelProp: "rolesData",

      //组件配置项
      config(row) {
        // this 指向父组件
        return {
          // multiple: true,
          filterable: true,
          disabled: row.committing,
          "value-key": "value",
        };
      },

      onChange() {
        // this 指向父组件
        // row.roles = row.rolesData.label;
      },

      // select 组件的options
      options: [],
    },
  },
  {
    label: "数据权限",
    prop: "permision",
    contentType: "tags", // tag标签:tags   格式化可点击数据: data
    tagType: {
      default: "primary",
    },
  },
  {
    label: "最后登陆时间",
    prop: "lastLoginTime",
    actionType: "sort", // 排序类型
  },
  {
    label: "操作",
    prop: "",
    width: "",

    isActionColumn: true, // 是否是操作列 查看、删除等
    actions: [
      {
        name: "edit",
        loadingRowTag: "",
        //函数或字符串
        label() {
          return "编辑";
        },

        ifShow(row) {
          return !row.inEditing;
        },

        ifDisabled() {
          return false;
        },

        action(row, header) {
          // this 指向父组件
          return this.handleEdit(row, header);
        },
      },

      {
        name: "delete",
        loadingRowTag: "",
        //函数或字符串
        label() {
          return "删除";
        },

        ifShow(row) {
          return !row.inEditing;
        },

        ifDisabled() {
          return false;
        },

        action(row) {
          return this.handleDelete(row);
        },
      },

      {
        name: "commit",
        loadingRowTag: "committing",
        //函数或字符串
        label() {
          return "确定";
        },

        ifShow(row) {
          return row.inEditing;
        },

        ifDisabled() {
          return false;
        },

        action(row) {
          return this.handleCommit(row);
        },
      },

      {
        name: "cancel",
        loadingRowTag: "",
        //函数或字符串
        label() {
          return "取消";
        },

        ifShow(row) {
          return row.inEditing;
        },

        ifDisabled() {
          return false;
        },

        action(row) {
          return this.handleCancel(row);
        },
      },
    ],
  },
];

export const accountDimensions = [
  {
    width: "50px",
    actionType: "expand",
  },

  {
    label: "账号ID",
    prop: "accountId",
    width: "100px",
    actionType: "search", // 排序类型
    // hasTooltip: true,
  },
  {
    label: "名称",
    prop: "name",
    hasTooltip: false,
    minWidth: "200px",
  },
  {
    label: "渠道",
    prop: "channel",
    minWidth: "100px",
    hasTooltip: false,
  },
  {
    label: "Cookie录入",
    prop: "cookie",
    minWidth: "200px",
    hasTooltip: true,
  },
  {
    label: "备注说明",
    prop: "comment",
    minWidth: "200px",
    hasTooltip: true,
  },
  {
    label: "更新时间",
    prop: "updateTime",
    minWidth: "200px",
    actionType: "sort",
  },

  {
    label: "状态",
    prop: "status",

    contentType: "tags", // tag标签:tags   格式化可点击数据: data
    tagType: {
      normal: "success",
      stoped: "warning",
      abnormal: "danger",
    },

    width: "100px", // 宽度
    hasTooltip: false,
  },
  {
    label: "操作",
    prop: "",
    minWidth: "200px",

    isActionColumn: true, // 是否是操作列 查看、删除等

    contentType() {
      return !this.hasAuditPerm ? "tags" : "component";
    },

    actions: [
      {
        name: "edit", // 操作过程使用手动设置loading的情况 $set(row,'edit',true)
        loadingRowTag: "", // 操作过程自动loading设置任意值

        //函数或字符串
        label() {
          // this指向dynamic-table的父组件
          return "编辑";
        },

        ifShow() {
          // this指向dynamic-table的父组件
          return true;
        },

        ifDisabled() {
          // this指向dynamic-table的父组件
          return false;
        },

        action(row) {
          // this指向dynamic-table的父组件
          return this.handleEdit(row);
        },
      },

      {
        name: "delete", // 操作过程使用手动设置loading的情况 $set(row,'delete',true)
        label: "删除", // 名称
        loadingRowTag: "", // 操作过程自动loading设置任意值
        ifShow() {
          // 计算是否显示
          // this指向dynamic-table的父组件
          return true;
        },
        ifDisabled() {
          // 计算disabled
          // this指向dynamic-table的父组件
          return false;
        },
        action(row) {
          // 操作动作
          // this指向dynamic-table的父组件
          return this.handleDelete(row);
        },
      },

      {
        name: "request", // 操作过程使用手动设置loading的情况 $set(row,'delete',true)
        label: "请求数据", // 名称
        loadingRowTag: "", // 操作过程自动loading设置任意值
        ifShow(row) {
          // 计算是否显示
          // this指向dynamic-table的父组件
          return row.patchable;
        },
        ifDisabled() {
          // 计算disabled
          // this指向dynamic-table的父组件
          return false;
        },
        action(row) {
          // 操作动作
          // this指向dynamic-table的父组件
          return this.handleRequestData(row);
        },
      },
    ],
  },
];

export const statusList = [
  {
    label: "正常",
    value: "normal",
  },
  {
    label: "异常",
    value: "abnormal",
  },
  {
    label: "停用",
    value: "stoped",
  },
];

export function getChannelList() {
  return [
    { title: "微博", value: "weibo", type: "plain" },
    { title: "B站", value: "bilibili", type: "primary" },
    { title: "抖音", value: "douyin", type: "plain", disabled: true },
    { title: "小红书", value: "xhs", type: "plain", disabled: true },
  ];
}
