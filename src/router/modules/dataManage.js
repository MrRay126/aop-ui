// 数据管理
// import warnComponent from "@/views/dataManage/warn";

//预警管理
const warn = {
  name: "warn",
  path: "warn",
  component: () => import("@/views/dataManage/warn"),
  meta: { var: "warn", title: "预警管理" },
};

//预警管理
const warnConfig = {
  name: "warnConfig",
  path: "warn/config",
  component: () => import("@/views/dataManage/warn/config.vue"),
  meta: { var: "warnConfig", title: "预警配置", hidden: true },
};

//报表管理
const reports = {
  name: "reports",
  path: "reports",
  component: () => import("@/views/opinionAnalysis/reportManage"),
  meta: { var: "reportManage", title: "报表管理", hidden: false },
};

//元数据管理
const hotWords = {
  name: "hotwords",
  path: "hotwords",
  component: () => import("@/views/dataManage/hotWords"),
  meta: { var: "hotwords", title: "热词管理" },
};

// data integration

// 数据集成
const dataIntegration = {
  name: "dataIntegration",
  path: "dataIntegration",
  component: () => import("@/views/dataManage/dataIntegration"),
  meta: { var: "dataIntegration", title: "数据集成" },
};

// 元数据管理
const metaData = {
  name: "metaData",
  path: "metadata",
  component: () => import("@/views/dataManage/metaData"),
  meta: { var: "metaData", title: "元数据管理" },
};

export default {
  warn,
  warnConfig,

  reports,
  hotWords,
  dataIntegration,
  metaData,
};
