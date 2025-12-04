//404 页面
const notFound = {
  path: "/404",
  component: () => import("@/views/components/errorPage/404.vue"),

  meta: { var: "notFound", hidden: true },
};

const redirect404 = {
  path: "/:pathMatch(.*)*",
  redirect: "/404",
  hidden: true,
  meta: { var: "redirect404", hidden: true },
};

// 用户登录页面;
const login = {
  path: "/login",
  component: () => import("@/views/user/login/index.vue"),
  meta: {
    title: "用户登录",
    var: "login",
    hidden: true,
  },
};

export default {
  notFound,
  redirect404,
  login,
};
