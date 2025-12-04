import {
  score,
  trend,
  wordCloud,
} from "@/views/opinionAnalysis/competition/data.js";

export const comments = {
  warn: "提供已有预警配置的预警趋势及风险推送详情。",
};

export const panelType = {
  total: "total", //总量数据
  positive: "positive", //正向数据
  negative: "negative", //负向数据
  pie: "pie", //正负占比
  channel: "channel", //渠道面板
  hotPoint: "hotPoint", //热点追踪
};

export const queryKeys = {
  projectId: "projectId",
  type: "type",
  id: "id",
  warn: "warn",
  warnName: "warnName",
};

//只有我的看板空间和我创建的看板空间内部的看板可以互相移动
//可编辑的看板同上

export const spaceType = {
  systemSpace: "system", //系统空间(舆情概览,预警看板在这个里面)
  mine: "mine", // 我的看板空间,系统默认(首次创建的看板在里面)
  myCreatedSpace: "myCreated", //我创建的看板空间
  sharedToMe: "sharedToMe", //共享给我的看板空间
};

export const bordType = {
  warn: "warn", //预警分析
  simple: "simple", //舆情概览
  opinion: "opinion", // 舆情分析
  shared: "shared", // 分享给我的看板
  customWeibo: "customWeibo",
  customBZhan: "customBzhan",
  customLeciyuan: "customLeciyuan",
  customLeciyuanKeyWord: "customLeciyuanKeyWord",
  customSilverPalace: "customSilverPalace",
};

//报表的类型
export const OpinionType = {
  trend: "trend", // 趋势分析
  theme: "theme", // 话题分析
  words: "words", // 词云
  spread: "spread", // 传播分析
  topic: "topic", // 主题分析
  competition: "competition", // 竟品分析
};

export const MarketType = {
  kol: "kol",
};

export const viewTypesLabel = {
  [OpinionType.trend]: "趋势分析",
  [OpinionType.theme]: "话题分析",
  [OpinionType.words]: "词云分析",
  [OpinionType.spread]: "传播分析",
  [OpinionType.topic]: "主题分析",
  [MarketType.kol]: "KOL分析",
  [OpinionType.competition]: "竟品分析",
};

export const viewDataTypeList = [
  { label: viewTypesLabel[OpinionType.trend], value: OpinionType.trend },
  { label: viewTypesLabel[OpinionType.theme], value: OpinionType.theme },
  { label: viewTypesLabel[OpinionType.words], value: OpinionType.words },
  { label: viewTypesLabel[OpinionType.spread], value: OpinionType.spread },
  { label: viewTypesLabel[MarketType.kol], value: MarketType.kol },
  {
    label: viewTypesLabel[OpinionType.competition],
    value: OpinionType.competition,
  },
];

//获取卡片的列表选项
export function getSizeOptions(type, card) {
  const cardSizeOptions = {
    [OpinionType.trend]: [
      { label: "大图", value: "big" },
      { label: "中图", value: "middle" },
    ],
    [OpinionType.theme]: [{ label: "大图", value: "big" }],
    [OpinionType.spread]: [{ label: "大图", value: "big" }],
    [OpinionType.words]: [
      { label: "大图", value: "big" },
      { label: "中图", value: "middle" },
    ],
    [MarketType.kol]: [{ label: "大图", value: "big" }],
  };

  const competitionCardSizeOptions = {
    [trend]: [
      { label: "大图", value: "big" },
      { label: "中图", value: "middle" },
    ],
    [score]: [
      { label: "大图", value: "big" },
      { label: "中图", value: "middle" },
    ],
    [wordCloud]: [{ label: "大图", value: "big" }],
  };

  if (card && card.report.type === OpinionType.competition) {
    return competitionCardSizeOptions[card.report.configs.anylysisType];
  }

  return cardSizeOptions[type] || [];
}

export const cardItem = {
  h: 15,
  w: 24,
  x: 0,
  y: 0,
  i: "3",
  report: {
    project_id: 1,
    dashboard_id: 1,
    id: 37,
    type: "trend",
    cardSize: "big",
    name: "trend-a",
    comment: "注释",
    configs: {
      // filters: {
      //   relTag: "and",
      //   children: [],
      // },
      // value: "aop.ods_aop",
      // time: {
      //   type: "relative",
      //   start: "2023-03-02 00:00:00",
      //   end: "2023-03-08 23:59:59",
      //   recent_day: "1-7",
      // },
      // time_unit: {
      //   unit: "hour",
      //   value: 1,
      //   weekStart: 0,
      // },
      // groups: [],
    },
  },
};

export const colNumber = 24;
export const middle = 12;
export const big = colNumber;
export const height = 15; // 15行

export const matedata = [
  {
    i: "0", // 索引值 必填
    h: 4, // 高度   必填
    w: 7, // 宽度   必填
    x: 2, // x 轴距离 必填
    y: 0, // y轴距离 必填
    // minW: 5, // 最小宽度 当 w的值小于minW时 采用minW的值
    // minH: 3, // 同上
    // maxW: 8, // 的最大宽度。如果w大于maxW，那么w将被设置为maxW。
    // maxH: 6, // 同上
    // isDraggable: true, // 单独控制这一个盒子是否可以拖动 未填写 继承父元素的 非必填
    // isResizable: true, // 单独控制这一个盒子是否可以调整大小 未填写 继承父元素的 非必填
    // static: false, // 这个盒子是静态的  不能被其他元素改变位置 会被覆盖在底部
    // dragIgnoreFrom: "", // 属性这值为css 选择器 项的哪些元素不应触发项的拖动事件// 具体不知道干嘛的 没有用到
    // dragAllowFrom: "", // 属性这值为css 选择器 项的哪些元素应触发项的拖动事件 // 文档这样写的
    // resizeIgnoreFrom: "", //属性这值为css 选择器 表示项的哪些元素不应触发项的调整大小事件。//来自文档翻译
  },
  {
    h: 4,
    i: "1",
    w: 4,
    x: 0,
    y: 1,
  },
  {
    h: 1,
    i: "2",
    w: 1,
    x: 0,
    y: 2,
  },
  {
    h: 1,
    i: "3",
    w: 1,
    x: 0,
    y: 3,
  },
];
