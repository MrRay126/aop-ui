<template>
  <div class="top">
    <div class="app-list">
      <template v-if="appList.length > 0">
        <el-dropdown
          @command="handleAppSelect"
          @visible-change="handleOptionVisibleChange"
          trigger="click"
        >
          <div class="app-text">
            <span class="app-name">{{ app.label }}</span>
            <span class="icon-container">
              <template v-if="isAppOptionsVisible">
                <i class="el-icon-arrow-up"></i>
              </template>
              <template v-else>
                <i class="el-icon-arrow-down"></i>
              </template>
            </span>
          </div>
          <template #dropdown>
            <el-dropdown-menu style="min-width: 100px">
              <template v-for="(appItem, index) in appList">
                <el-dropdown-item :command="appItem" :key="index">
                  <span
                    :class="{
                      'focus-app': appItem.id === $store.state.dashbord.app.id,
                    }"
                    >{{ appItem.label }}</span
                  >
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>

    <div class="menu-and-user">
      <div class="menu-section">
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          background-color="#0d1d64"
          text-color="#fff"
          active-text-color="#fff"
          @select="handleSelectMenu"
        >
          <template v-for="(item, index) in menus">
            <template v-if="isUsefulArray(item.children)">
              <el-submenu
                :key="index"
                :index="item.name"
                :disabled="item.disabled"
                background-color="#fff"
                popper-class="menu-poper"
              >
                <template #title>{{ item.title }}</template>
                <template v-for="(child, cindex) in item.children">
                  <el-menu-item
                    :index="child.name"
                    :disabled="child.disabled"
                    :key="cindex"
                  >
                    <span
                      :class="{ 'focus-menu-item': child.name === $route.name }"
                    >
                      {{ child.title }}
                    </span>
                  </el-menu-item>
                </template>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item
                :index="item.name"
                :disabled="item.disabled"
                :key="index"
                >{{ item.title }}</el-menu-item
              >
            </template>
          </template>
        </el-menu>
      </div>
      <div class="actions-container">
        <el-tooltip content="任务管理器" placement="top-start" effect="light">
          <template slot="content">
            <div style="min-width: 60px">任务管理器</div>
          </template>
          <span
            class="el-icon-circle-check down-load-icon"
            @click="handleShowDownloadManager"
          ></span>
        </el-tooltip>
        <el-popover placement="top-start" title="" trigger="hover">
          <template>
            <div class="tip-content">
              <div class="qr-code-pic">
                <img
                  src="@/assets/feedback.png"
                  style="width: 130px; height: auto"
                />
              </div>
              <div class="right">
                <div class="tip-text">
                  <p class="title">产品反馈</p>
                  <p>点击下方链接,帮助我们优化产品!</p>
                  <p>
                    <a
                      href="https://wenjuan.feishu.cn/m/cfm?t=sXPHr9Lt0sKi-x7xw"
                      class="anchor"
                      target="_blank"
                    >
                      https://wenjuan.feishu.cn/m/cfm?t=sXPHr9Lt0sKi-x7xw
                    </a>
                  </p>
                </div>
                <p class="contact">有任何意见和建议,欢迎联系@李博</p>
              </div>
            </div>
          </template>

          <svg-icon
            slot="reference"
            icon-class="edit"
            size="14"
            class="edit"
          ></svg-icon>
        </el-popover>
        <el-tooltip content="使用说明" placement="top-start" effect="light">
          <template slot="content">
            <div style="min-width: 60px">使用说明</div>
          </template>
          <span style="line-height: 1" class="doc">
            <svg-icon
              icon-class="document"
              size="14"
              @click="handleViewConstruction"
            ></svg-icon>
          </span>
        </el-tooltip>
        <el-dropdown :disabled="false" @command="handleClickUserItem">
          <span class="icon-user">
            <svg-icon icon-class="user" size="16"></svg-icon>
          </span>
          <el-dropdown-menu slot="dropdown">
            <template v-for="(childRoute, index) in userRoute.children">
              <template v-if="childRoute.meta && !childRoute.meta.hidden">
                <el-dropdown-item :command="childRoute.name" :key="index">
                  <span
                    class="list-item"
                    :class="{ focus: $route.name === childRoute.name }"
                    >{{ childRoute.meta.title }}</span
                  >
                </el-dropdown-item>
              </template>
            </template>

            <el-dropdown-item command="logout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <download-manager
      :visible="downloadManagerVisible"
      @close="handleClose"
    ></download-manager>
  </div>
</template>
<script>
import { getMenuList } from "./utils";
import downloadManager from "@/views/components/downloadManager";
import { mapGetters } from "vuex";
import { initRoutes } from "@/router/permission.js";
import { save } from "@/utils";

export default {
  name: "top",
  props: {},
  components: {
    downloadManager,
  },
  data() {
    return {
      app: {},
      isAppOptionsVisible: false,
      menus: [],
      activeMenu: "",

      introductionUrl:
        "https://rzvo5fieru.feishu.cn/wiki/YeKPwmHFviDVfPkKqRNc8B5SnWh",
    };
  },

  computed: {
    ...mapGetters({ downloadManagerVisible: "isTaskPannelVisible" }),
    userRoute() {
      const userRoute = this.$store.state.auth.routes.find((item) => {
        return item.name === "user";
      });
      return userRoute;
    },

    userHasProjectManagePerm() {
      return this.$store.getters.perms.some((userPermItem) => {
        return ["root", "admin"].includes(userPermItem);
      });
    },

    appList() {
      return this.$store.state.dashbord.appList || [];
    },

    permRoutes() {
      return this.$store.state.auth.routes || [];
    },
  },

  watch: {
    $route: {
      immediate: true,
      handler() {
        this.getFocusedMenu(this.menus);
      },
    },

    permRoutes: {
      immediate: true,
      handler() {
        this.initMenus();
      },
    },

    "$store.getters.app": {
      immediate: true,
      handler(val) {
        if (val) {
          this.app = val;
        }
      },
    },

    // //app列表加载后,需根据路由projectId参数更新app( 页面首次加载时)
    // appList: {
    //   handler(val) {
    //     if (Array.isArray(val)) {
    //       this.getRouteAppAndSetToCurrentApp(this.$route);
    //     }
    //   },
    // },
  },
  methods: {
    getRouteAppAndSetToCurrentApp(route) {
      const projectId = route.query["projectId"];
      if (projectId) {
        const findApp = this.appList.find((item) => {
          return item.code === projectId;
        });

        if (findApp) {
          this.handleAppSelect(findApp);
        }
      }
    },
    handleShowDownloadManager() {
      this.$store.dispatch("task/openTaskPannel");
    },
    handleClose() {
      this.$store.dispatch("task/closeTaskPannel");
    },
    handleViewConstruction() {
      window.open(this.introductionUrl);
    },

    handleClickUserItem(command) {
      if (command === "userInfo") {
        this.$router.replace({
          name: "userInfo",
        });
      } else if (command === "projectManage") {
        this.$router.replace({
          name: "projectManage",
        });
      } else if (command === "logout") {
        this.$store.dispatch("auth/logout").then(() => {
          window.location.reload();
        });
      }
    },

    handleAppSelect(item) {
      this.app = item;

      save("projectId", item.id);

      // 去除可能存在的query
      this.$router.replace({
        path: this.$route.path,
      });

      // 全局记录当前app
      // this.$store.commit("dashbord/SET_CUR_APP", item);
      initRoutes(item.id);
    },

    handleOptionVisibleChange(visible) {
      this.isAppOptionsVisible = visible;
    },

    handleSelectMenu(index, indexPath) {
      const routeName = indexPath[1] || indexPath[0];

      if (this.$route.name !== routeName) {
        this.$router.push({
          name: indexPath[1] || indexPath[0], //一级导航用0 ,二级导航用1
          // path: "/opinion/trend",
        });
      } else {
        // 重复点击路由时恢复到路由初始状态并刷新页面
        location.hash = `${this.$route.path}`;
        window.location.reload();
      }
    },

    isUsefulArray(arr) {
      return Array.isArray(arr) && arr.length > 0;
    },

    //获取聚焦的menu
    getFocusedMenu(menus = []) {
      const routeName = this.$route.name;
      let activeMenuName = "";

      menus.forEach((item) => {
        if (item.name === routeName) {
          activeMenuName = item.name;
        } else if (this.isUsefulArray(item.children)) {
          const childRoute = item.children.find((item) => {
            return item.name === routeName;
          });
          if (childRoute) {
            activeMenuName = childRoute.name;
          }
        }
      });

      this.activeMenu = activeMenuName;
    },

    // 下载界面
    handleDownloadManager() {
      this.$emit("openManager");
    },

    //菜单功能
    initMenus() {
      const menuList = getMenuList(this.permRoutes);
      this.menus = menuList;
      this.getFocusedMenu(menuList);
    },
  },
  // // 页面已加载 路由改变后, 需设置当前app
  // beforeRouteUpdate(to, form, next) {
  //   console.log(1111);
  //   this.getRouteAppAndSetToCurrentApp(to);
  //   next();
  // },
  created() {
    // 设置默认选中的app
    // this.app = this.$store.state.dashbord.app.label;
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.focus-app {
  color: $color-primary;
}

.list-item {
  display: inline-block;
  min-width: 60px;

  &.focus {
    color: rgb(255, 208, 75);
  }
}

.tip-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 480px;

  .qr-code-pic {
    img {
      width: 140px;
      height: auto;
    }
    flex-shrink: 0;
  }

  .right {
    color: $color-text;
    margin-left: 20px;

    .tip-text {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      font-size: 12px;

      p {
        margin-bottom: 10px;
        margin-top: 0px;
        padding: 0;
      }

      .title {
        font-size: 16px;
        font-weight: bold;
      }

      .anchor {
        color: $color-text;
      }
    }

    .contact {
      text-align: right;
      font-size: 12px;
    }
  }
}

.focus-menu-item {
  color: rgb(255, 208, 75);
}

.top {
  width: 100%;
  // height: 80px;
  padding-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #0d1d64;

  .el-icon-edit {
    color: #fff;
    cursor: pointer;
  }

  .icon-user {
    color: #fff;
    // vertical-align: -3px;
    line-height: 16px;
    vertical-align: middle;
    cursor: pointer;
  }

  .down-load-icon {
    margin-right: 10px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }

  .app-list {
    padding-left: 30px;
    min-width: 100px;

    .app-text {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      line-height: 20px;
      font-size: 16px;
      margin-right: 20px;

      .app-name {
        cursor: pointer;
      }

      .icon-container {
        line-height: 14px;
        margin-left: 3px;
      }
    }
  }

  .menu-and-user {
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .actions-container {
      flex: 0 1 auto;
      margin-right: 30px;
      color: #fff;

      display: flex;
      align-items: center;
      justify-content: flex-end;

      .edit {
        margin-right: 10px;
        vertical-align: -1px;
      }

      .doc {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }

  :deep(.el-menu) {
    border: none !important;
  }
}
</style>
