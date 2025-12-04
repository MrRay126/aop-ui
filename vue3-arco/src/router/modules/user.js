// 用户信息页面
const userInfo = {
  name: "userInfo",
  path: "info",
  component: () => import("@/views/user/userInfo/index.vue"),
  meta: { title: "个人信息", var: "userInfo", hidden: false },
};

// 项目管理
const projectManage = {
  name: "projectManage",
  path: "projects",
  component: () => import("@/views/user/projectManage/index.vue"),
  meta: {
    title: "项目管理",
    var: "projectManage",
    hidden: false,
    roles: ["root", "admin"], // 该路由支持的角色
  },
};

// root: "root管理员",
// admin: "管理员",
// analyst: "分析师",
// project_member: "项目成员",

export default {
  userInfo,
  projectManage,
};
