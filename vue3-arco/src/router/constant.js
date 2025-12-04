let out = {};

export const buildConstant = (route, root = "") => {
  let path = route.path;

  // 构建带children的路由的变量
  if (route.children) {
    for (let item of route.children) {
      if (item.children) {
        buildConstant(item, path);
      } else if (item.path.substring(0, 1) !== "/") {
        let url = item.path ? path + "/" + item.path : path;
        if (item.meta && item.meta.var) {
          out[item.meta.var] = root ? root + "/" + url : url;
        }
      } else {
        if (item.meta && item.meta.var) {
          out[item.meta.var] = item.path;
        }
      }
    }
  } else {
    // 构建不带children的路由的变量
    if (route.meta?.var) {
      out[route.meta.var] = route.path;
    }
  }
};

window.aop = out;
