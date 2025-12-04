export const isUsefulArray = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};

//根据路由生成菜单项
export const getMenuList = (asyncRoutes) => {
  //菜单
  const routesCopy = JSON.parse(JSON.stringify(asyncRoutes));
  let menuList = routesCopy.filter((item) => {
    if (Array.isArray(item.children)) {
      item.children = item.children.filter((childItem) => {
        return !childItem?.meta?.hidden;
      });
    }
    return !item.meta.hidden || (item.meta.hidden && item.name === "home"); //舆情面板在home路由下
  });

  menuList = menuList.map((item) => {
    const menuItem = {
      title: item.meta.title,
      name: item.name,

      children: [],
    };

    if (item.name === "home") {
      //使用舆情面板路由生成
      const opinion = item.children[0];
      menuItem.title = opinion.meta.title;
      menuItem.name = opinion.name;
      menuItem.path = opinion.path;
      menuItem.children = [];
    } else {
      if (isUsefulArray(item.children)) {
        menuItem.children = item.children.map((item) => {
          return {
            title: item.meta.title,
            name: item.name,
            path: item.path,
          };
        });
      }
    }

    return menuItem;
  });

  return menuList;
};
