//舆情面板
const portal = {
  name: "dashbord",
  path: "/dashbord",
  component: () => import("@/views/dashbord"),
  meta: { var: "dashbord", title: "舆情看板" },
};

export default {
  portal,
};
