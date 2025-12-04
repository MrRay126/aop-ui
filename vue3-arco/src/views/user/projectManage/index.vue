<template>
  <div class="project-manage">
    <div class="inner-content">
      <div class="left" v-loading="loadingProjectInfo">
        <div class="left-title">项目信息</div>
        <ul class="info-container">
          <li class="list-item">
            <span class="title">项目ID</span>
            <span class="value">{{ projectInfo.id || "-" }}</span>
          </li>

          <li class="list-item">
            <span class="title">
              <span>项目名称</span>
              <span>
                <i
                  :class="{
                    'el-icon-check': projectInfo.inEditing,
                    'el-icon-edit-outline': !projectInfo.inEditing,
                  }"
                  style="cursor: pointer; margin-left: 5px"
                  @click="handleProjectNameEdit"
                ></i>
              </span>
            </span>
            <template v-if="projectInfo.inEditing">
              <el-input
                v-model="projectInfo.name"
                size="mini"
                style="width: 200px"
              ></el-input>
            </template>
            <template v-else>
              <span class="value">{{ projectInfo.name || "-" }}</span>
            </template>
          </li>

          <li class="list-item">
            <span class="title">创建日期</span>
            <span class="value">{{ projectInfo.createTime || "-" }}</span>
          </li>
          <li class="list-item project-mannager">
            <span class="title">项目管理员</span>
            <div class="value value-project-managers">
              <template v-for="(item, index) in projectInfo.admin">
                <span :key="index">
                  <span>{{ item }}</span>
                  <template v-if="index !== projectInfo.admin.length - 1">
                    <span>, </span>
                  </template>
                </span>
              </template>
            </div>
          </li>
          <!-- <li class="list-item only-title">
            <span class="title">接入关键字</span>
          </li>

          <ul class="keyword-list">
            <template v-for="(item, index) in projectInfo.keywords">
              <li class="key-word-item" :key="index">
                <span class="key-name">{{ item.channel }} :</span>
                <span class="key-value">{{ item.data.join(",") }}</span>
              </li>
            </template>
          </ul> -->

          <li class="list-item">
            <span class="title">项目类型</span>
            <span class="value">{{ projectInfo.projectType || "-" }}</span>
          </li>

          <li class="list-item">
            <span class="title">
              <!-- editingAccounts:::{{ projectInfo.editingAccounts }} -->
              <span>官方帐号(微博)</span>
              <span>
                <i
                  :class="{
                    'el-icon-check': projectInfo.editingAccounts,
                    'el-icon-edit-outline': !projectInfo.editingAccounts,
                  }"
                  style="cursor: pointer; margin-left: 5px"
                  @click="handleProjectAccountEdit"
                ></i>
              </span>
            </span>
            <template v-if="projectInfo.editingAccounts">
              <el-input
                v-model="projectInfo.officialAccounts"
                size="mini"
                style="width: 200px"
              ></el-input>
            </template>
            <template v-else>
              <span class="value">{{
                projectInfo.officialAccounts || "-"
              }}</span>
            </template>
          </li>
        </ul>
      </div>

      <div class="right" ref="rightContainer">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="成员信息" name="member">
            <!-- <div class="top-section">
              <span class="title">成员信息</span>
              <el-button type="primary" @click="handleAddNewMember" size="mini"
                >+ 新增成员</el-button
              >
            </div> -->
            <div class="content-section">
              <div class="search-member-container">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="请输入"
                  class="search-user-input"
                  @input="handleSearchInput"
                >
                  <template slot="append">
                    <el-button
                      icon="el-icon-search"
                      @click="handleClickSearch"
                      :loading="isLoadingTableData"
                    ></el-button>
                  </template>
                </el-input>

                <el-button
                  type="primary"
                  @click="handleAddNewMember"
                  size="mini"
                  >+ 新增成员</el-button
                >
              </div>
              <dynamic-table
                :height="500"
                :dimension="dimensions"
                :source="tableData"
                :filter="filter"
                :filterOptions="filterOptions"
                sortMode="single"
                :pager="pager"
                :loading="isLoadingTableData"
                @getTableData="handleDynamicTableGetData"
              ></dynamic-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="账号管理" name="acount">
            <account-manage
              :height="rightContainerHeight - 180"
            ></account-manage>
          </el-tab-pane>
          <el-tab-pane label="账号数据统计" name="acountData">
            <account-statistics
              :activeTab="activeTab"
              :height="rightContainerHeight - 65"
            ></account-statistics>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog
      title="新增成员"
      :visible="dialogVisible"
      @close="handleClose"
      @open="handleOpen"
      width="700px"
    >
      <div class="dialog-content">
        <div class="top-search-container">
          <span class="title">成员账号</span>
          <el-select
            class="search-input"
            size="mini"
            :multiple="true"
            :filterable="true"
            v-model="form.search"
            value-key="value"
            :filter-method="handleMemberFilter"
          >
            <template v-for="(item, index) in userOptionsFiltered">
              <el-option :key="index" :label="item.label" :value="item">
              </el-option>
            </template>
          </el-select>

          <el-button
            type="primary"
            plain
            size="mini"
            class="add-btn"
            @click="handleAddMember"
            >+ 添加</el-button
          >
        </div>
        <dynamic-table
          :height="400"
          :dimension="form.dimension"
          :source="form.tableData"
          :hasPagination="false"
        ></dynamic-table>

        <div class="btn-container">
          <el-button
            type="primary"
            :loading="submitting"
            :disabled="form.tableData.length === 0"
            @click="handleFormSubmit"
            >确定</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dynamicTable from "@/views/components/dynamicTable";
import accountManage from "./components/accountManage.vue";
import accountStatistics from "./components/accountStatistics.vue";

import { dimensions, formDimensions } from "./data.js";

export default {
  props: {},
  components: {
    dynamicTable,
    accountManage,
    accountStatistics,
  },
  data() {
    return {
      rightContainerHeight: 0,
      activeTab: "member", // member  acount  acountData
      loadingProjectInfo: false,
      projectInfo: {
        id: "-",
        name: "-",
        createTime: "-",
        admin: [],
        keywords: [],
        projectType: "",
        officialAccounts: "",

        inEditing: false,
        editingAccounts: false,
      },

      dimensions,
      tableData: [],
      filter: {},
      filterOptions: {},
      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },

      isLoadingTableData: false,
      search: "",

      dialogVisible: false,

      userOptions: [],
      userOptionsFiltered: [],

      form: {
        search: [],
        dimension: formDimensions,
        tableData: [],
      },

      submitting: false,

      roleList: [],
    };
  },

  watch: {
    "$store.getters.appId": {
      immediate: true,
      handler(val) {
        if (val) {
          this.init();
        }
      },
    },
  },

  methods: {
    handleMemberFilter(val) {
      this.userOptionsFiltered = this.userOptions.filter((userItem) => {
        return userItem.label.includes(val) || userItem.value.includes(val);
      });
    },

    handleProjectAccountEdit() {
      if (this.projectInfo.editingAccounts) {
        this.$set(this.projectInfo, "editingAccounts", false);

        const payload = {
          project_id: this.$store.getters.appId,
          ...this.projectInfo,
        };
        this.$store
          .dispatch("projectManage/updateProjectInfo", payload)
          .then(() => {
            //
            this.$message({
              message: "修改成功!",
              type: "success",
            });

            // window.location.reload();
          })
          .catch(() => {
            // noop
          })
          .finally(() => {
            // noop
          });
      } else {
        this.$set(this.projectInfo, "editingAccounts", true);
      }
    },

    handleProjectNameEdit() {
      if (this.projectInfo.inEditing) {
        this.$set(this.projectInfo, "inEditing", false);

        const payload = {
          project_id: this.$store.getters.appId,
          ...this.projectInfo,
        };
        this.$store
          .dispatch("projectManage/updateProjectInfo", payload)
          .then(() => {
            //
            this.$message({
              message: "修改成功!",
              type: "success",
            });

            window.location.reload();
          })
          .catch(() => {
            // noop
          })
          .finally(() => {
            // noop
          });
      } else {
        this.$set(this.projectInfo, "inEditing", true);
      }
    },

    getRoleList() {
      this.roleList = [];
      const payload = {
        project_id: this.$store.getters.appId,
      };

      this.$store
        .dispatch("projectManage/getRoleList", payload)
        .then((resData) => {
          this.roleList = resData;
          const rolesColumn = this.form.dimension.find((item) => {
            return item.prop === "roles";
          });
          rolesColumn.contentComponent.options = this.roleList;

          //resData;
        })
        .catch(() => {
          // noop
        });
    },

    // 新增成员按钮
    handleAddNewMember() {
      this.dialogVisible = true;
    },

    //保存新建表单
    handleFormSubmit() {
      // api
      this.submitting = true;
      const payload = {
        project_id: this.$store.getters.appId,
        members: this.getSaveMembers(this.form.tableData),
      };

      if (payload.members.length === 0) {
        this.$message({
          message: "请添加项目成员后再保存!",
          type: "warning",
        });
        return;
      }

      this.$store
        .dispatch("projectManage/saveMember", payload)
        .then(() => {
          this.$message({
            message: "保存成功!",
            type: "success",
          });

          this.dialogVisible = false;

          this.getTableData();
          this.getProjectInfo();
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    getSaveMembers(list) {
      return list.map((item) => {
        return {
          id: item.id,
          memberName: item.memberName,
          displayName: item.displayName,
          rolesData: item.rolesData,
          permision: item.permision,
        };
      });
    },

    handleClose() {
      this.dialogVisible = false;
      this.submitting = false;
      this.form.search = [];
      this.form.tableData = [];
    },

    handleOpen() {
      this.userOptions = [];
      this.userOptionsFiltered = [];

      const payload = {
        project_id: this.$store.getters.appId,
      };

      this.$store
        .dispatch("projectManage/getMemberOptions", payload)
        .then((resData) => {
          this.userOptions = resData;
          this.userOptionsFiltered = resData;
        })
        .catch(() => {
          // noop
        });
    },
    // 添加成员
    handleAddMember() {
      this.form.search = this.form.search.filter((userItem) => {
        return !this.checkIfIncludes(userItem);
      });

      const tableRows = this.form.search.map((item) => {
        return {
          id: item.id,
          memberName: item.value,
          displayName: item.label,
          roles: item.rolesData.label,
          rolesData: this.roleList[0] || {},
          permision: item.permision,
        };
      });
      this.form.tableData = [...this.form.tableData, ...tableRows];
      this.form.search = [];
    },

    checkIfIncludes(user) {
      return this.form.tableData.some((item) => {
        return item.memberName === user.value;
      });
    },

    handleDynamicTableGetData(data) {
      this.filter = data.filter;
      this.pager = data.pager;
      this.getTableData();
    },

    //查询search
    handleClickSearch() {
      this.getTableData();
    },

    handleSearchInput() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getTableData();
      }, 300);
    },

    //编辑
    handleEdit(row) {
      this.$set(row, "inEditing", true);

      // this.$set(header.contentComponent, "options", this.roleList);
      const rolesColumn = this.dimensions.find((item) => {
        return item.prop === "roles";
      });
      rolesColumn.contentComponent.options = this.roleList;
    },

    // 取消编辑
    handleCancel(row) {
      this.$set(row, "inEditing", false);
      this.getTableData();
    },

    //确定编辑
    handleCommit(row) {
      const payload = {
        project_id: this.$store.getters.appId,
        members: this.getSaveMembers([row]),
      };

      return this.$store
        .dispatch("projectManage/updateMember", payload)
        .then(() => {
          this.$message({
            message: "更新成功!",
            type: "success",
          });
          this.getTableData();
          this.getProjectInfo();
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.$set(row, "inEditing", false);
        });
    },

    // 删除操作
    handleDelete(row) {
      // api

      this.$confirm("确定要删除吗?", "提示")
        .then(() => {
          // set loading
          this.$set(row, "delete", true);
          const payload = {
            project_id: this.$store.getters.appId,
            user_id: row.id,
          };
          this.$store
            .dispatch("projectManage/deleteMember", payload)
            .then(() => {
              this.$message({
                message: "删除成功!",
                type: "success",
              });
              this.getTableData();
              this.getProjectInfo();
            })
            .catch(() => {
              // noop
            })
            .finally(() => {
              this.$set(row, "delete", false);
            });
        })
        .catch(() => {
          // noop
        });
    },

    getProjectInfo() {
      this.loadingProjectInfo = true;
      const payload = {
        project_id: this.$store.getters.appId,
      };
      this.$store
        .dispatch("projectManage/getProjectInfo", payload)
        .then((resData) => {
          if (resData) {
            this.projectInfo = resData;
          }
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.loadingProjectInfo = false;
        });
    },

    getTableData() {
      this.isLoadingTableData = true;
      const payload = {
        project_id: this.$store.getters.appId,
        search: this.search,
        ...this.pager,
        ...this.filter,
      };

      this.$store
        .dispatch("projectManage/getTableData", payload)
        .then((resData) => {
          if (resData) {
            this.tableData = resData.results.map((item) => {
              item.roles = item.rolesData.label;
              return item;
            });

            this.filterOptions = {
              ...resData.filterOptions.rolesData,
              roles: resData.filterOptions.rolesData,
            };

            this.pager.total = resData.pager.total;
          }
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingTableData = false;
        });
    },

    getRightContainerHeight() {
      this.rightContainerHeight = this.$refs["rightContainer"].offsetHeight;
    },

    initEvent() {
      let timer = 0;
      window.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.getRightContainerHeight();
        }, 30);
      };
    },

    init() {
      this.getProjectInfo();
      this.getTableData();
      this.getRoleList();
      this.initEvent();
    },
  },
  mounted() {
    this.getRightContainerHeight();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.dialog-content {
  .top-search-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0;

    .search-input {
      margin-left: 20px;
      width: 450px;
    }

    .add-btn {
      margin-left: 20px;
    }
  }

  .btn-container {
    padding: 10px;
    text-align: right;
  }
}

.project-manage {
  padding: 20px;
  height: 100%;
  background: #f0f2f5;
  overflow: auto;

  .inner-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .left {
      height: 100%;
      width: 400px;
      background: #fff;
      padding: 20px;
      flex-grow: 0;
      flex-shrink: 0;
      position: relative;

      ul,
      li {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .left-title {
        font-size: 18px;
        text-align: center;
        line-height: 24px;
        height: 24px;
        margin-bottom: 20px;
      }

      .info-container {
        position: absolute;
        top: 50px;
        left: 0;
        bottom: 10px;
        width: 100%;
        padding: 20px;
        overflow-y: auto;

        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          padding: 8px 0;
          color: $color-text;

          &.project-mannager {
            align-items: flex-start;
          }

          .only-title {
            justify-content: flex-start;
          }

          .title {
            font-size: 14px;
            flex: 0 0 auto;
          }

          .value {
            font-size: 12px;

            &.value-project-managers {
              max-width: 260px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              flex-wrap: wrap;

              span {
                white-space: pre;
              }
            }
          }
        }

        .keyword-list {
          display: inline-block;
          padding-left: 20px;
          font-size: 12px;
          color: $color-text;
          padding-top: 10px;

          .key-word-item {
            margin-left: 10px;
            margin-bottom: 15px;
            list-style: circle;

            .key-name {
              padding-right: 5px;
              font-weight: bold;
            }
          }
        }
      }
    }

    .right {
      flex-grow: 1;
      flex-shrink: 1;
      min-width: 1000px;
      margin-left: 15px;
      padding: 10px;
      height: 100%;
      background: #fff;

      .top-section {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid $color-border;

        .title {
          font-size: 16px;
          color: $color-text;
        }
      }

      .content-section {
        padding: 10px;

        .search-member-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          padding-top: 0px;
          .search-user-input {
            width: 300px;
          }
        }
      }

      // 账号管理
      .account-container {
      }
      // 账号数据统计
      .account-data-container {
      }
    }
  }
}
</style>
