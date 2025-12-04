export const SessionKey = {
  dashbordType: "dashbordType",
  warnBordId: "warnBordId",
};

export const PeriodValues = {
  oneByOne: "oneByOne",
  hour: "hour",
  day: "day",
};

//计算周期
export const CalcPeriodMaps = {
  [PeriodValues.oneByOne]: "逐条",
  [PeriodValues.hour]: "按小时",
  [PeriodValues.day]: "按天",
};

// 预警规则组件 对比选项
export const compareOptions = [
  {
    label: "高于",
    value: "gt",
  },
  {
    label: "低于",
    value: "lt",
  },
];

// 预警规则组件 对比类型选项
export const compareTypeOptions = [
  {
    label: "固定值",
    value: "fix",
  },

  {
    label: "上一小时",
    value: "oneHourBefore",
  },
  {
    label: "昨日同时刻",
    value: "sameTimeOfYestoday",
  },
  {
    label: "前一天",
    value: "oneDayBefore",
  },
  {
    label: "上周同一天",
    value: "sameDayOfLastweek",
  },
];

// 值类型选项
export const valueTypeOptions = [
  {
    label: "数值",
    value: "number",
    notForCompareTypes: [], // 不使用该值的 compareType(对比类型)
  },
  {
    label: "百分比",
    value: "percent",
    notForCompareTypes: ["fix"],
  },
];

export function getCompareTypeOptions(labels) {
  return compareTypeOptions.filter((item) => {
    return labels.includes(item.label);
  });
}

export function getValueTypeOptionsOf(compareType) {
  return valueTypeOptions.filter((item) => {
    return !item.notForCompareTypes.includes(compareType);
  });
}

export const dimenssion = [
  {
    label: "",
    prop: "",
    width: "50px",
    actionType: "selection",

    ifDisabled(row) {
      return !row.perms.edit;
    },

    ifVisible(row) {
      return row.perms.edit;
    },
  },

  {
    label: "预警名称",
    prop: "name",
    minWidth: "100px",
    // hasTooltip: true, //是否使用toolTip
  },
  {
    label: "预警描述",
    prop: "description",
    minWidth: "100px",
    // hasTooltip: true, //是否使用toolTip
  },
  {
    label: "累计触发次数",
    prop: "hit_count",
    minWidth: "100px",
    // contentType: "data",
    actionType: "sort", // 排序类型
    // hasTooltip: true, //是否使用toolTip
  },
  {
    label: "上次触发时间",
    prop: "preTriggerTime",
    minWidth: "100px",
    actionType: "sort", // 排序类型
    // hasTooltip: true, //是否使用toolTip
  },
  {
    label: "创建人",
    prop: "creator",
    minWidth: "100px",
    // hasTooltip: false, //是否使用toolTip
  },
  {
    label: "计算周期",
    prop: "calculatePeriod",
    minWidth: "100px",
    contentType: "tags",
    tagType: {
      day: "success",
      hour: "primary",
      oneByOne: "warning",
      default: "primary",
    },
  },

  {
    label: "操作",
    prop: "",
    width: "",

    isActionColumn: true, // 是否是操作列 查看、删除等
    actions: [
      {
        //函数或字符串
        label(row) {
          return "设置";
        },

        loadingRowTag: "",

        ifShow(row) {
          return true;
        },

        ifDisabled(row) {
          return !row.perms.edit;
        },

        action(row) {
          // console.log(this.$options.data());
          return this.handleTableRowSet(row);
        },
      },
    ],
  },
];
