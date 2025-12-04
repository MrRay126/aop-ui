export const options = [
  { value: "eq", label: "等于" },
  { value: "neq", label: "不等于" },
  { value: "lt", label: "小于" },
  { value: "lte", label: "小于等于" },
  { value: "gt", label: "大于" },
  { value: "gte", label: "大于等于" },
  { value: "between", label: "区间" },
  { value: "like", label: "包含" },
  { value: "notLike", label: "不包含" },
  { value: "match", label: "正则匹配" },
  { value: "notMatch", label: "正则不匹配" },
  { value: "notNull", label: "有值" },
  { value: "null", label: "无值" },
];

//适配数据,结果格式如下:
/** 
     [
        { 
           label: "表1",
           value: 1, 
           keyList:[
             {
               label:'',
               value:'',
               type:'text',
             },
             {
               label:'',
               value:'',
               type:'chanel',
               choices:[
                  {
                    value: "zhinan",
                    label: "指南",
                    children:[]
                  }
                ]
             }
          ]
        },
        
      ]

*/

export function fitListData(ListData) {
  function fitFields(fields) {
    const resultData = fields.map((fieldItem) => {
      return {
        label: fieldItem.title,
        value: fieldItem.code,
        type: fieldItem.type,
        options: fieldItem.options,
        choices: fitValueOptions(fieldItem.choices || []), // value选项
      };
    });
    return resultData;
  }

  function fitValueOptions(optionsList) {
    function fitDealer(options) {
      const data = options.map((optionItem) => {
        let result = {
          label: optionItem.title,
          value: optionItem.code,
        };
        if (optionItem.choices) {
          result.children = fitDealer(optionItem.choices);
        }
        return result;
      });
      return data;
    }

    return fitDealer(optionsList);
  }

  let list = ListData.map((item) => {
    return {
      label: item.title,
      value: item.code,
      keyList: fitFields(item.fields),
      groups: item.groups, //分组数据,用于趋势分析的分组筛选可选项
      valueComponentConfig: item.valueComponentConfig,
    };
  });

  return list;
}

/**
 *
 * @param {String} keyType  key值type
 * @param {String} relation 关系label
 * @param {Object} componentConfig 组件配置文件
 * @returns {Object} 组件配置
 */

export function getValueComponentType(key, relation, componentConfig) {
  let component = {
    name: null,
    options: {},
  };

  const keyValue = key.value;
  const keyType = key.type;

  const keyComponentConfig =
    componentConfig.keys[keyValue] || componentConfig.types[keyType];

  if (keyComponentConfig) {
    keyComponentConfig.forEach((item) => {
      // 包含的relation关系
      if (
        Array.isArray(item.includesRelations) &&
        item.includesRelations.includes(relation)
      ) {
        component = item.component;
      }

      // 排除的relation关系
      if (
        Array.isArray(item.excludesRelations) &&
        !item.excludesRelations.includes(relation)
      ) {
        component = item.component;
      }

      // // 未配置任何relation关系直接使用组件配置
      if (!item.includesRelations && !item.excludesRelations) {
        component = item.component || component;
      }
    });
  }

  return component;
}

/**
 *  根据值用的组件类型不同,获取初始值
 * @keyType {String} keyType key值的类型  text number channel
 * @param {String} relation  关系的值
 * @returns 无值: null, 有值: [] | ‘’ | 0
 */
export function getInitialValue(component) {
  const componentName = component.name;
  switch (componentName) {
    case "number":
      return 0;
    case "text":
      return "";
    case "datetime":
      return null;
    case "numberBetween":
    case "cascader":
    case "datetimeRange":
      return [];

    default:
    // noop
  }

  if (componentName === "select") {
    if (component.options.isMultipleSelect) {
      return [];
    }
    return null;
  }

  return null;
}

//获取
export function travelFilterItem(tree, dealor) {
  const children = tree.children;
  children.forEach((item) => {
    if (item.children) {
      travelFilterItem(item, dealor);
    } else {
      dealor(item);
    }
  });
}

// 验证空的filter项 // @return 验证通过未true , 不通过为false
export function validEmptyFilterItem(data) {
  //{ id: uuid(), key: 3, relation: "eq", value: [] },
  let hasEmptyKey = false;
  let hasEmptyRelation = false;
  let hasEmptyValue = false;

  travelFilterItem(data, (filterItem) => {
    if (!filterItem.key) {
      hasEmptyKey = true;
    }
    if (!filterItem.relation) {
      hasEmptyRelation = true;
    }

    if (!validValue(filterItem)) {
      hasEmptyValue = true;
    }
  });

  function validValue(filterItem) {
    const relation = filterItem.relation;
    const value = filterItem.value;
    if (relation === "between") {
      // 值需要 数组长度2且数组值有效
      const isUsefulArray =
        Array.isArray(value) &&
        value.length === 2 &&
        isUsefulValue(value[0]) &&
        isUsefulValue(value[1]);

      return isUsefulArray;
    } else if (relation === "notNull" || relation === "null") {
      // 不需要验证值
      return true;
    } else {
      // 常规单值
      return isUsefulValue(value);
    }
  }

  function isUsefulValue(val) {
    if (val === null || val === "" || val === undefined) {
      return false;
    }

    if (Array.isArray(val)) {
      return val.length > 0;
    }

    return true;
  }

  // console.log(hasEmptyKey, hasEmptyRelation, hasEmptyValue, data);

  return !(hasEmptyKey || hasEmptyRelation || hasEmptyValue);
}

// 值输入组件配置文件

/**
 涉及的值输入组件如下:  
 1 number 数值输入组件
 2 numberBetween  数值区间组件
 3 cascader  级连选择器组件
 4 text  文本输入组件
 5 select  下拉选择组件
 6 datetime  日期组件
 7 datetimeRange  日期范围组件
**/

export const componentconfig = {
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
};
