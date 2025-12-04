import { OpinionType } from "@/views/dashbord/data";

//趋势分析
const words = {
  name: OpinionType.words,
  path: OpinionType.words,
  component: () => import("@/views/opinionAnalysis/words"),
  meta: { var: OpinionType.words, title: "词云分析" },
};

//趋势分析
const trend = {
  name: OpinionType.trend,
  path: OpinionType.trend,
  component: () => import("@/views/opinionAnalysis/trend"),
  meta: { var: OpinionType.trend, title: "趋势分析" },
};

//主题分析
const topic = {
  name: OpinionType.topic,
  path: OpinionType.topic,
  component: () => import("@/views/opinionAnalysis/topic"),
  meta: { var: OpinionType.topic, title: "主题分析" },
};

//话题分析
const theme = {
  name: OpinionType.theme,
  path: OpinionType.theme,
  component: () => import("@/views/opinionAnalysis/theme"),
  meta: { var: OpinionType.theme, title: "话题分析" },
};

// //报表管理
const reports = {
  name: "reports",
  path: "reports",
  component: () => import("@/views/opinionAnalysis/reportManage"),
  meta: { var: "reportManage", title: "看板管理" },
};

//传播分析
const spread = {
  name: OpinionType.spread,
  path: OpinionType.spread,
  component: () => import("@/views/opinionAnalysis/spread"),
  meta: { var: OpinionType.spread, title: "传播分析" },
};

//竞品分析
const competition = {
  name: OpinionType.competition,
  path: OpinionType.competition,
  component: () => import("@/views/opinionAnalysis/competition"),
  meta: { var: OpinionType.competition, title: "竞品分析" },
};

// kol分析
const kol = {
  name: "kol",
  path: "kol",
  component: () => import("@/views/opinionAnalysis/kol/index"),
  meta: { var: "kol", title: "KOL分析" },
};

export default {
  words,
  trend,
  theme,
  reports,
  spread,
  topic,
  competition,
  kol,
};
