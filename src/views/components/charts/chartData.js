//获取line图options
import numeral from "numeral";

export const lineOption = {
  type: "line",
  version: 0,
  clear: true,
  // loading: false,
  title: {
    text: "",
    subtext: "",
    textStyle: {
      color: "#000",
      fontSize: 18,
    },
    subtextStyle: {
      color: "#aaa",
      fontSize: 12,
    },
  },

  grid: {
    top: "8%",
    bottom: "50",
    right: "50",
    left: "50",
    containLabel: true,
  },

  legend: {
    type: "scroll",
    bottom: 50,
    show: false,
  },

  dataZoom: [
    // { type: "inside" }, //用于添加滚轮缩放
    // { type: "slider" }, //用于添加滑动条缩放，
  ],

  tooltip: {
    appendToBody: true,
    trigger: "axis",
    textStyle: {
      color: "#9d9e9f",
      fontSize: 14,
    },

    enterable: true, // 鼠标是否可进入提示框浮层中
    hideDelay: 200, // 浮层隐藏的延迟
    confine: false,
    backgroundColor: "rgba(255,255,255, 1)",

    // position: function (point, params, dom, rect, size) {
    //   console.log("point:", point);
    //   // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
    //   // 提示框位置
    //   var x = 0; // x坐标位置
    //   var y = 0; // y坐标位置

    //   // 当前鼠标位置
    //   var pointX = point[0];
    //   var pointY = point[1];

    //   // 外层div大小
    //   // var viewWidth = size.viewSize[0];
    //   // var viewHeight = size.viewSize[1];

    //   // 提示框大小
    //   var boxWidth = size.contentSize[0];
    //   var boxHeight = size.contentSize[1];

    //   // boxWidth > pointX 说明鼠标左边放不下提示框
    //   if (boxWidth > pointX) {
    //     x = pointX - 100;
    //   } else {
    //     // 左边放的下
    //     x = pointX + 100;
    //   }

    //   // boxHeight > pointY 说明鼠标上边放不下提示框
    //   if (boxHeight > pointY) {
    //     y = pointY - 100;
    //   } else {
    //     // 上边放得下
    //     y = pointY + 100;
    //   }

    //   return [x, y];
    // },

    formatter: function (params) {
      // console.log(params.componentType, params);
      if (Array.isArray(params)) {
        var htmlStr = `
        <div>
          <p>${params[0].axisValue}</p>
          <div style="padding-right:12px;height: auto;max-height: 400px;overflow-y: auto;">`;

        for (var i = 0; i < params.length; i++) {
          const seriesName = params[i].seriesName;
          htmlStr += `<p style="color: #666;display:flex; align-items:center;justify-content:space-between;">
          <span>${params[i].marker}</span>
          <span style="vertical-align:middle;flex: 1;display: flex;align-items: center;justify-content: space-between;">
            <span style="padding-left:3px;display:inline-block; max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:no-wrap;margin-right:10px;">${seriesName}</span>
            <span>${numeral(params[i].value[seriesName]).format("0,000")}</span>
          </span>
          </p>`;
        }
        htmlStr += `
          </div>
        </div>`;
        return htmlStr;
      }
    },
  },

  toolbox: {
    show: false,
  },

  xAxis: [
    {
      type: "category",
      // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "",
      // min: 0,
      // max: 250,
      // interval: 50,
      axisLabel: {
        formatter: "{value}",
      },

      // axisLine: { show: false },
    },
    //   {
    //     type: "value",
    //     name: "",
    //     // min: 0,
    //     // max: 25,
    //     // interval: 5,
    //     axisLabel: {
    //       formatter: "{value} %",
    //     },
    //     splitLine: { show: false },
    //   },
  ],
  //   dataZoom: [
  //     {
  //       type: "slider",
  //       xAxisIndex: 0,
  //       filterMode: "none",
  //       left: "8%", //组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
  //       right: "8%",
  //     },
  //   ],
  dataset: {
    dimensions: [
      // "product", "2015", "2016", "2017"
    ],
    source: [
      // { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
      // { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
      // { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
      // { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
    ],
  },

  series: [
    // { type: "line", symbol: "none" },
    // { type: "line", symbol: "none" },
    // { type: "line", symbol: "none" },
  ],
};

export const pieOptions = {
  title: {
    text: "",
    subtext: "",
    left: "center",
  },
  tooltip: {
    show: false,
    trigger: "item",
  },
  legend: {
    orient: "verticle",
    left: "right",
    top: "middle",
    show: true,
  },

  series: [
    {
      silent: "ture", //鼠标hover时不放大
      name: "Access From",
      type: "pie",
      radius: ["40%", "80%"],
      left: "-80",
      top: "0",
      right: "0",
      bottom: "0",
      label: {
        show: false,
        formatter: (params) => {
          return `${params.value}` + "\r\n" + `${params.name}%`;
        },
        color: "#9d9e9f",
      },

      data: [
        // { value: 1048, name: "Search Engine" },
        // { value: 735, name: "Direct" },
        // { value: 580, name: "Email" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

export const barOptions = {
  type: "bar",
  version: 0,
  clear: false,
  loading: false,
  title: {
    text: "",
    subtext: "",
    textStyle: {
      color: "#000",
      fontSize: 18,
    },
    subtextStyle: {
      color: "#aaa",
      fontSize: 12,
    },
  },
  grid: [
    [
      {
        // show: false,
        left: "2%",
        top: "20",
        right: "2%",
        bottom: "20%",
        containLabel: true,
      },
    ],
  ],
  legend: {
    type: "scroll",
    top: "bottom",
  },
  tooltip: {
    trigger: "axis",
    textStyle: {
      color: "#9d9e9f",
      fontSize: 14,
    },
  },
  toolbox: {
    show: false,
  },
  xAxis: {
    type: "category",
    show: true,
    axisLabel: {
      align: "center",
      color: "#8d9eb9",
    },
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: "value",
    show: true,
    axisLine: {
      show: true,
    },
    axisTick: {
      show: true,
    },
    // axisLabel: {
    //   formatter: (value) => {
    //     return value + "%";
    //   },
    // },
  },
  dataset: { dimension: [], source: [] },
  series: [],
};

export const stackBarOptions = {
  legend: {
    data: ["bar", "bar2", "bar3", "bar4"],
    left: "10%",
  },

  tooltip: {},

  xAxis: {
    data: [],
  },

  grid: [
    [
      {
        // show: false,
        left: "2%",
        top: "20",
        right: "2%",
        bottom: "20%",
        containLabel: true,
      },
    ],
  ],
  series: [
    // {
    //   name: "bar",
    //   type: "bar",
    //   stack: "one",
    //   emphasis: emphasisStyle,
    //   data: data1,
    // },
    // {
    //   name: "bar2",
    //   type: "bar",
    //   stack: "one",
    //   emphasis: emphasisStyle,
    //   data: data2,
    // },
  ],
};

export const getWordCloudOptions = (configs) => {
  return {
    tooltip: {},

    series: [
      {
        type: "wordCloud",
        gridSize: configs.gridSize || 20, // 可以调节词间距离
        sizeRange: [12, 50],
        rotationRange: [0, 0],
        shape: configs.shape,
        width: 600,
        height: 600,
        drawOutOfBound: true,

        textStyle: {
          normal: {},
        },

        emphasis: {
          textStyle: {
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        data: [
          // {
          //   name: "Sam S Club",
          //   value: 10000,
          //   textStyle: {
          //     color: "#fff",
          //   },
          //   emphasis: {
          //     textStyle: {
          //       color: "blue",
          //     },
          //   },
          // },
          // {
          //   name: "Macys",
          //   value: 6181,
          // },
          // {
          //   name: "Amy Schumer",
          //   value: 4386,
          // },
          // {
          //   name: "Jurassic World",
          //   value: 4055,
          // },
          // {
          //   name: "Charter Communications",
          //   value: 2467,
          // },
          // {
          //   name: "Chick Fil A",
          //   value: 2244,
          // },
          // {
          //   name: "Planet Fitness",
          //   value: 1898,
          // },
          // {
          //   name: "Pitch Perfect",
          //   value: 1484,
          // },
          // {
          //   name: "Express",
          //   value: 1112,
          // },
          // {
          //   name: "Home",
          //   value: 965,
          // },
          // {
          //   name: "Point Break",
          //   value: 265,
          // },
        ],
      },
    ],
  };
};

// 主题河流图
export const themeRiver = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "line",
      lineStyle: {
        color: "rgba(0,0,0,0.2)",
        width: 1,
        type: "solid",
      },
    },
  },
  legend: {
    data: ["DQ", "TY", "SS", "QG", "SY", "DD"],
  },
  singleAxis: {
    top: 50,
    bottom: 50,
    axisTick: {},
    axisLabel: {},
    type: "time",
    axisPointer: {
      animation: true,
      label: {
        show: true,
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        opacity: 0.2,
      },
    },
  },

  series: [
    {
      type: "themeRiver",
      emphasis: {
        itemStyle: {
          // shadowBlur: 20,
          // shadowColor: "rgba(0, 0, 0, 0.8)",
        },
      },
      data: [
        ["2015/11/08", 10, "DQ"],
        ["2015/11/09", 15, "DQ"],
        ["2015/11/10", 35, "DQ"],
        ["2015/11/11", 38, "DQ"],
        ["2015/11/12", 22, "DQ"],
        ["2015/11/13", 16, "DQ"],
        ["2015/11/14", 7, "DQ"],
        ["2015/11/15", 2, "DQ"],
        ["2015/11/16", 17, "DQ"],
        ["2015/11/17", 33, "DQ"],
        ["2015/11/18", 40, "DQ"],
        ["2015/11/19", 32, "DQ"],
        ["2015/11/20", 26, "DQ"],
        ["2015/11/21", 35, "DQ"],
        ["2015/11/22", 40, "DQ"],
        ["2015/11/23", 32, "DQ"],
        ["2015/11/24", 26, "DQ"],
        ["2015/11/25", 22, "DQ"],
        ["2015/11/26", 16, "DQ"],
        ["2015/11/27", 22, "DQ"],
        ["2015/11/28", 10, "DQ"],
        ["2015/11/08", 35, "TY"],
        ["2015/11/09", 36, "TY"],
        ["2015/11/10", 37, "TY"],
        ["2015/11/11", 22, "TY"],
        ["2015/11/12", 24, "TY"],
        ["2015/11/13", 26, "TY"],
        ["2015/11/14", 34, "TY"],
        ["2015/11/15", 21, "TY"],
        ["2015/11/16", 18, "TY"],
        ["2015/11/17", 45, "TY"],
        ["2015/11/18", 32, "TY"],
        ["2015/11/19", 35, "TY"],
        ["2015/11/20", 30, "TY"],
        ["2015/11/21", 28, "TY"],
        ["2015/11/22", 27, "TY"],
        ["2015/11/23", 26, "TY"],
        ["2015/11/24", 15, "TY"],
        ["2015/11/25", 30, "TY"],
        ["2015/11/26", 35, "TY"],
        ["2015/11/27", 42, "TY"],
        ["2015/11/28", 42, "TY"],
      ],
    },
  ],
};

//获取颜色值
export function getTextColor() {
  return (
    "rgb(" +
    [
      Math.round(Math.random() * 160),
      Math.round(Math.random() * 160),
      Math.round(Math.random() * 160),
    ].join(",") +
    ")"
  );
}

//获取蓝色色值
export function getBlueColors() {
  let colors = [];
  for (let i = 0, len = 160; i < len; i += 3) {
    colors.push("rgb(" + [0, 0, i].join(",") + ")");
  }
  return colors;
}

export const treeMap = {
  // color: ["#fac858", "#ee6666"],
  title: {
    text: "",
    left: "center",
  },
  tooltip: {
    show: true,
    formatter: (info) => {
      let { name, value, positive, negative, neutral, tagText } = info.data;
      return `<div style='font-size:16px;font-weight:bold;margin-bottom:5px;'>${name}</div>
              <div style="font-size:14px;margin-bottom:5px;">内容总量: ${value}</div>
              <div style="font-size:14px;margin-bottom:5px;">正向内容量: ${positive}</div>
              <div style="font-size:14px;margin-bottom:5px;">负向内容量: ${negative}</div>
              <div style="font-size:14px;margin-bottom:5px;">中性内容量: ${neutral}</div>
              <div style="font-size:14px;margin-bottom:5px;max-width:240px;word-break:break-all;overflow:hidden;white-space:initial;">主题标签: <span>${tagText}</span></div>
              `;
    },
  },

  series: [
    {
      type: "treemap",
      name: "", //面包屑名称
      nodeClick: false, //去除点击移动效果
      roam: false, //禁止鼠标拖拽缩放

      left: "10",
      top: "middle",
      width: "90%",
      height: "90%",
      data: [],
      label: {
        position: ["10%", "10%"],
        lineHeight: 30,
        width: 20,
        fontSize: 14,
        show: true, //显示标签
        formatter: function (params) {
          let arr = [
            `{title|${params.data.name}}`,
            `{bottom|${params.data.tagText || ""}}`,
          ];

          return arr.join("\n");
        },

        rich: {
          title: {
            color: "#fff",
            fontSize: 16,
          },
          // middle: {
          //   color: "red",
          //   fontSize: 14,
          // },
          bottom: {
            // position: ["10%", "10%"],
            // align: "right",
            // verticalAlign: "bottom",
            color: "#fff",
            fontSize: 14,
          },
        },
      },
      emphasis: {
        //鼠标移动到上面的效果
        itemStyle: {
          // color: "#fff",
        },
        // focus: "self", //只展示自己
      },
      select: {
        //搭配selectedMode使用
        itemStyle: {
          color: "#4c4c4c",
        },
      },
      itemStyle: {
        gapWidth: 3, //格子间隙
      },

      selectedMode: false,
      ////下方面包屑路径
      breadcrumb: {
        show: false,
        itemStyle: {
          color: "#409eff",
        },
      },
    },
  ],
};

// 线标注点数据转化 coords: [[x,y]] to: coords:[{coord:[x,y]}]
export function generateMarkpointCoord(coords = []) {
  return coords.map((item) => {
    return { coord: item };
  });
}

//图表 colors
export const colors = [
  //蓝
  "#00a8e1",
  "#c4e0f8",

  //绿色
  "#42d196",
  "#caf7e9",

  //黄色
  "#f9be56",
  "#ffe9c3",

  //橙色
  "#ff6600",
  "#fcdeca",

  //红色
  "#f65b5e",
  "#ffdedf",

  //紫色
  "#ff3ce4",
  "#fbaff0",
];

export const radarOptions = {
  color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
  legend: {
    bottom: 50,
    show: true,
  },
  radar: [
    {
      indicator: [
        { text: 'Indicator1' },
        { text: 'Indicator2' },
        { text: 'Indicator3' },
      ],
      center: ['50%', '50%'],
      radius: 120,
      startAngle: 90,
      splitNumber: 4,
      shape: 'circle',
      axisName: {
        formatter: '【{value}】',
        color: '#428BD4'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(211, 253, 250, 0.8)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(211, 253, 250, 0.8)'
        }
      }
    },
  ],
  series: [
    {
      type: 'radar',
      emphasis: {
        lineStyle: {
          width: 4
        }
      },
      data: [
        {
          value: [100, 8, 0.4, -80, 2000],
          name: 'Data A'
        },
        {
          value: [60, 5, 0.3, -100, 1500],
          name: 'Data B',
        }
      ]
    },
  ]
}