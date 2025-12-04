import { isUsefulValue } from "@/utils";

export const statusOptions = [
  { label: "已配置", value: "done", disabled: true },
  { label: "审核中", value: "processing" },
  { label: "已停用", value: "stoped" },
  { label: "已运行", value: "running" },
  { label: "配置失败", value: "configFailed", disabled: true },
];

export function getOptions(labels = [], options) {
  return labels.map((label) => {
    return options.find((item) => {
      return item.label === label;
    });
  });
}

export const dimensions = [
  {
    label: "规则ID",
    prop: "id",
    minWidth: "100px",
  },
  {
    label: "内容类型",
    prop: "contentType",
    minWidth: "100px",
  },
  {
    label: "任务名称",
    prop: "taskName",
    minWidth: "100px",
  },
  {
    label: "规则参数",
    prop: "ruleParam",
    minWidth: "200px",
    hasTooltip(row, header) {
      return row[header.prop]?.length > 20;
    },
  },

  {
    label: "算法处理",
    prop: "hasAlgorithm",
    minWidth: "200px",
    contentType: "tags",
    tagType: {
      有: "success",
      无: "danger",
    },
  },

  {
    label: "执行周期",
    prop: "period",
    minWidth: "100px",
    // hasTooltip: true,
  },
  {
    label: "配置时间",
    prop: "configTime",
    // hasTooltip: true,
    minWidth: "100px",
  },
  {
    label: "状态",
    prop: "status",
    minWidth: "150px",

    /**
     *  @type: fn || string:
     *
     * @values:
     *
     * 1.tag标签:'tags'
     * 2.格式化可点击数据: 'data'
     * 3.组件: 'component'
     *
     * */

    contentType() {
      return !this.hasAuditPerm ? "tags" : "component";
    },

    tagType: {
      stoped: "warning",
      processing: "info",
      done: "primary",
      running: "success",
      configFailed: "danger",
      default: "primary",
    },

    contentComponent: {
      handler() {
        return this.hasAuditPerm ? "select" : "";
      },

      modelProp: "statusData",

      //组件配置项
      config() {
        return {
          "value-key": "value",
          size: "mini",
        };
      },

      onChange(row) {
        this.modifyRuleStatus(row);
      },

      // select 组件的options
      options: statusOptions, // getOptions(["审核中", "已停用", "已运行"], statusOptions),
    },
  },
  {
    label: "操作",
    width: "120px",
    isActionColumn: true, // 是否是操作列 查看、删除等
    actions: [
      // {
      //   name: "modify", // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
      //   loadingRowTag: "", // 操作过程自动loading设置任意值
      //   //函数或字符串
      //   label(row) {
      //     // this指向dynamic-table的父组件
      //     return "修改";
      //   },

      //   ifShow(row) {
      //     // this指向dynamic-table的父组件
      //     return true;
      //   },

      //   ifDisabled(row) {
      //     // this指向dynamic-table的父组件
      //     return false;
      //   },

      //   action(row) {
      //     // this指向dynamic-table的父组件
      //     return this.handleModify(row);
      //   },
      // },
      {
        name: "delete", // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
        loadingRowTag: "", // 操作过程自动loading设置任意值
        //函数或字符串
        label(row) {
          // this指向dynamic-table的父组件
          return "删除";
        },

        ifShow(row) {
          // this指向dynamic-table的父组件
          return true;
        },

        ifDisabled(row) {
          // this指向dynamic-table的父组件
          return !this.hasDeletePerm;
        },

        action(row) {
          // this指向dynamic-table的父组件
          return this.handleDelete(row);
        },
      },
    ],
  },
];

//调度类时间周期选项
const etlPeriodTimes = [
  {
    label: "每分钟",
    unit: "minutes",
    value: 1,
  },
  {
    label: "每10分钟",
    unit: "minutes",
    value: 10,
  },
  {
    label: "每30分钟",
    unit: "minutes",
    value: 30,
  },
  {
    label: "每小时",
    unit: "hour",
    value: 1,
  },
  {
    label: "每2小时",
    unit: "hour",
    value: 2,
  },
  {
    label: "每6小时",
    unit: "hour",
    value: 6,
  },
  {
    label: "每12小时",
    unit: "hour",
    value: 12,
  },
  {
    label: "每天",
    unit: "day",
    value: 1,
  },
];

// 延时类时间周期选项
const delayPeriodTimes = [
  {
    label: "0分钟",
    unit: "minutes",
    value: 0,
  },
  {
    label: "30分钟",
    unit: "minutes",
    value: 30,
  },
  {
    label: "1小时",
    unit: "hour",
    value: 1,
  },
  {
    label: "2小时",
    unit: "hour",
    value: 2,
  },
  {
    label: "6小时",
    unit: "hour",
    value: 6,
  },
  {
    label: "12小时",
    unit: "hour",
    value: 12,
  },
  {
    label: "1天",
    unit: "day",
    value: 1,
  },
  {
    label: "3天",
    unit: "day",
    value: 3,
  },
  {
    label: "7天",
    unit: "day",
    value: 7,
  },
];

//执行方式选项
const execTypeOptions = [{ label: "仅执行一次", value: "execOnece" }];

// type :etlPeriod || delayPeriod || execType
export function getPeriodOptions(type = "etlPeriod") {
  if (type === "etlPeriod") {
    return etlPeriodTimes;
  } else if (type === "delayPeriod") {
    return delayPeriodTimes;
  } else if (type === "execType") {
    return execTypeOptions;
  }
}

/***
 configs: {
//     preTaskComment: "帖子搜索",
//     params: [
//       {
//         name: "keyword",
//         label: "采集关键字",
//         type: "string",
//         value: "keyword1",
//       },
//       { name: "uids", label: "用户id", type: "number", value: 0 },
//     ],
//     etlPeriod: "day", // 调度周期
//     delayPeriod: "day", // 延时周期
//     comment: "注释内容",
//   },
 */

// 验证配置的规则必须全部填写
export function validRuleList(ruleList) {
  let validPass = true;
  ruleList.forEach((listItem) => {
    const configs = listItem.configs;

    if ("params" in configs) {
      const passParam = configs["params"].every((paramItem) => {
        return isUsefulValue(paramItem.value);
      });

      if (!passParam) {
        validPass = false;
      }
    }

    if ("etlPeriod" in configs) {
      if (!isUsefulValue(configs["etlPeriod"].value)) {
        validPass = false;
      }
    }

    if ("delayPeriod" in configs) {
      if (!isUsefulValue(configs["delayPeriod"].value)) {
        validPass = false;
      }
    }
  });

  return validPass;
}
