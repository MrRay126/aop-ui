<template>
  <div class="user-info">
    <div class="left-section">
      <div class="top">
        <div class="basic-info">
          <div class="pic-cont">
            <!-- <img class="pic" src="" title="头像" alt="头像" /> -->
            <svg-icon icon-class="head" size="100" class="info-icon"></svg-icon>
          </div>
          <!-- {{ user }} -->
          <div class="name">{{ user.displayName || "-" }}</div>
          <div class="des" :title="user.description">
            {{ user.description || "-" }}
          </div>
        </div>
        <div class="other-info">
          <span class="other-info-item">
            <svg-icon icon-class="#" size="14" class="info-icon"></svg-icon>
            {{
              (Array.isArray(user.roles) &&
                user.roles
                  .map((item) => {
                    return roleDict[item];
                  })
                  .join(",")) ||
              "-"
            }}
          </span>
          <span class="other-info-item">
            <svg-icon icon-class="user" size="14" class="info-icon"></svg-icon>
            {{ user.username || "-" }}
          </span>
          <span class="other-info-item">
            <svg-icon icon-class="phone" size="14" class="info-icon"></svg-icon>
            {{ user.phone || "-" }}
          </span>
          <span class="other-info-item">
            <svg-icon icon-class="email" size="14" class="info-icon"></svg-icon>
            {{ user.email || "-" }}
          </span>
        </div>
      </div>
      <div class="bottom">
        <div class="version-title">系统版本号</div>
        <div class="version">
          <span>{{ system.version }}</span>
          <span>当前版本</span>
        </div>
      </div>
    </div>

    <div class="right-section">
      <el-tabs v-model="tabActive">
        <el-tab-pane label="基本信息" name="basic">
          <div class="basic-info">
            <el-form label-width="80px">
              <el-form-item label="显示名:">
                <div class="form-item-section">
                  <el-input
                    class="input-item"
                    v-model="basicInfo.displayName.value"
                    :disabled="!basicInfo.displayName.inEditing"
                  ></el-input>
                  <el-button
                    type="text"
                    :loading="basicInfo.displayName.saving"
                    @click="handleModify('displayName')"
                    >{{
                      basicInfo.displayName.inEditing ? "保存" : "修改"
                    }}</el-button
                  >
                </div>
              </el-form-item>

              <el-form-item label="账号:">
                <div class="form-item-section">
                  <span class="account-number">{{ user.username }}</span>
                </div>
              </el-form-item>

              <el-form-item label="描述:">
                <div class="form-item-section">
                  <el-input
                    type="textarea"
                    rows="3"
                    class="input-item"
                    maxlength="100"
                    show-word-limit
                    v-model="basicInfo.description.value"
                    :disabled="!basicInfo.description.inEditing"
                  ></el-input>
                  <el-button
                    type="text"
                    :loading="basicInfo.description.saving"
                    @click="handleModify('description')"
                    >{{
                      basicInfo.description.inEditing ? "保存" : "修改"
                    }}</el-button
                  >
                </div>
              </el-form-item>

              <el-form-item label="手机号:">
                <div class="form-item-section">
                  <el-input
                    class="input-item"
                    v-model="basicInfo.phone.value"
                    :disabled="!basicInfo.phone.inEditing"
                  ></el-input>
                  <el-button
                    type="text"
                    :loading="basicInfo.phone.saving"
                    @click="handleModify('phone')"
                    >{{
                      basicInfo.phone.inEditing ? "保存" : "绑定"
                    }}</el-button
                  >
                </div>
              </el-form-item>

              <el-form-item label="邮箱:">
                <div class="form-item-section">
                  <el-input
                    class="input-item"
                    v-model="basicInfo.email.value"
                    :disabled="!basicInfo.email.inEditing"
                  ></el-input>
                  <el-button
                    type="text"
                    :loading="basicInfo.email.saving"
                    @click="handleModify('email')"
                  >
                    {{ basicInfo.email.inEditing ? "保存" : "绑定" }}
                  </el-button>
                </div>
              </el-form-item>

              <template v-if="hasModifyPasswordPermission">
                <el-form-item label="密码:">
                  <div class="form-item-section">
                    <el-input
                      class="input-item"
                      v-model="basicInfo.password.value"
                      :disabled="true"
                      show-password
                    ></el-input>
                    <el-button type="text" @click="handleModify('password')">
                      修改
                    </el-button>
                  </div>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="权限详情" name="perm">
          <div class="perm-detail-container">
            <el-form label-width="80px">
              <el-form-item label="权限类型:">
                <div class="perm-form-item-container">
                  <el-radio-group v-model="permsInfo.permType">
                    <el-radio-button :label="0">功能权限</el-radio-button>
                    <el-radio-button :label="1">数据权限</el-radio-button>
                  </el-radio-group>
                </div>
              </el-form-item>

              <template v-if="permsInfo.permType === 0">
                <el-form-item label="权限级别:">
                  <div class="perm-form-item-container">
                    <span class="perm-form-item">
                      {{
                        (Array.isArray(permsInfo.roles) &&
                          permsInfo.roles
                            .map((item) => {
                              return roleDict[item];
                            })
                            .join(" , ")) ||
                        "-"
                      }}
                    </span>
                  </div>
                </el-form-item>
                <el-form-item label="权限信息:">
                  <div class="perm-form-item-container">
                    <el-table :data="permsInfo.permData" border>
                      <template v-for="(header, index) in dimensions">
                        <template v-if="header.prop !== 'perm'">
                          <el-table-column
                            :key="index"
                            :label="header.label"
                            :prop="header.prop"
                            :min-width="header.width"
                          >
                          </el-table-column>
                        </template>

                        <template v-else>
                          <el-table-column
                            :key="index"
                            :label="header.label"
                            :prop="header.prop"
                            :min-width="header.width"
                          >
                            <template #default="scope">
                              <el-tag type="success">
                                {{ operationPermDict[scope.row.perm] }}
                              </el-tag>
                            </template>
                          </el-table-column>
                        </template>
                      </template>
                    </el-table>
                  </div>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="权限级别:">
                  <div class="perm-form-item-container">
                    <span class="perm-form-item">
                      {{
                        permsInfo.dataPerm
                          .map((item) => {
                            return dataPermDict[item];
                          })
                          .join(" , ")
                      }}
                    </span>
                  </div>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="basicInfo.password.inEditing"
      @close="handlePasswordDialogClose"
      @open="handlePasswordDialogOpen"
      width="700px"
    >
      <el-form
        ref="passwordForm"
        label-width="100px"
        :model="passwordForm"
        :rules="passwordRules"
      >
        <el-form-item label="旧密码:" prop="oldValue">
          <el-input
            class="password-input-item"
            placeholder="请输入"
            show-password
            v-model="passwordForm.oldValue"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newValue">
          <el-input
            class="password-input-item"
            placeholder="请输入"
            show-password
            clearable
            v-model="passwordForm.newValue"
          ></el-input>
        </el-form-item>
        <el-form-item label="再次输入:" prop="repeat">
          <el-input
            class="password-input-item"
            placeholder="请输入"
            show-password
            clearable
            v-model="passwordForm.repeat"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="btns-container">
        <el-button
          size="mini"
          type="plain"
          @click="handleEditPasswordCancel"
          :loading="isSubmittingPassword"
          >取消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="handleEditPasswordSubmit"
          :loading="isSubmittingPassword"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { isPhoneNumber, validEmail } from "@/utils/validate.js";
export default {
  props: {},
  data() {
    return {
      user: {
        id: 0,
        // description: "座右铭描述",
        // roles: ["root"],
        // username: "liuyunong",
        // displayName: "展示名",
        // phone: "12333131231",
        // email: "werrew@happy.cn",
      },

      system: {
        version: "1.3.1.1215_Beta",
        des: "当前版本",
      },

      tabActive: "basic",

      basicInfo: {
        displayName: { value: "", inEditing: false, saving: false },
        description: { value: "", inEditing: false, saving: false },
        phone: { value: "", inEditing: false, saving: false },
        email: { value: "", inEditing: false, saving: false },
        password: {
          value: "",
          inEditing: false,
          saving: false,
        },
      },
      isSubmittingPassword: false,
      passwordForm: {
        oldValue: "",
        newValue: "",
        repeat: "",
      },
      passwordRules: {
        oldValue: [
          {
            message: "仅支持6~128位英文字母和数字",
            pattern: /^[a-zA-Z0-9]{6,128}$/, // [а-я]匹配基本西里尔字母
            required: true,
            trigger: "change",
          },
        ],
        newValue: [
          {
            message: "仅支持6~128位英文字母和数字",
            pattern: /^[a-zA-Z0-9]{6,128}$/, // [а-я]匹配基本西里尔字母
            required: true,
            trigger: "change",
          },
        ],
        repeat: [
          {
            message: "仅支持6~128位英文字母和数字",
            pattern: /^[a-zA-Z0-9]{6,128}$/, // [а-я]匹配基本西里尔字母
            required: true,
            trigger: "change",
          },
        ],
      },

      permsInfo: {
        permType: 0,
        roles: ["root", "admin"],
        permData: [
          // {
          //   action_category: "舆情看板",
          //   action_name: "查看看板",
          //   perm: "edit",
          //   action_detail: "提交功能反馈",
          // },
        ],

        dataPerm: [
          // "all"
        ],
      },

      dimensions: [
        { label: "功能大类", prop: "action_category", width: 100 },
        { label: "功能模块", prop: "action_name", width: 100 },
        { label: "操作权限", prop: "perm", width: 100 },
        { label: "功能明细", prop: "action_detail", width: 100 },
      ],

      roleDict: {
        root: "root管理员",
        admin: "管理员",
        analyst: "分析师",
        project_member: "项目成员",
      },

      dataPermDict: {
        all: "全部数据",
      },

      operationPermDict: {
        view: "查看",
        edit: "编辑",
        use: "功能使用",
      },
    };
  },
  computed: {
    hasModifyPasswordPermission() {
      /// 只有非sso登录的用户可以修改密码
      return !this.$store.state.auth.userInfo.isSsoLogin;
    },
  },
  watch: {
    "$store.getters.appId": {
      immediate: true,
      handler(val) {
        if (val) {
          // this.user = this.$store.state.auth.userInfo;
          this.getUserInfo();
          this.getPermInfo();
        }
      },
    },
  },
  methods: {
    handlePasswordDialogOpen() {
      // this.passwordForm.oldValue = this.basicInfo.password.value;
      this.$nextTick(() => {
        this.$refs["passwordForm"].clearValidate();
      });
    },

    handlePasswordDialogClose() {
      this.basicInfo.password.inEditing = false;
      this.passwordForm = this.$options.data().passwordForm;

      this.$nextTick(() => {
        this.$refs["passwordForm"].clearValidate();
      });
    },

    handleEditPasswordCancel() {
      this.handlePasswordDialogClose();
    },

    async handleEditPasswordSubmit() {
      const validPass = await this.validPassword();
      if (validPass) {
        //新旧密码不能一致
        if (!this.validNewValueNotEqToOldValue()) {
          this.$message({
            message: "新密码与旧密码不能一致",
            type: "warning",
          });
          return;
        }

        //两次输入密码需一致
        if (!this.validRepeatValueEqToNewValue()) {
          this.$message({
            message: "再次输入的密码值和新密码值需要保持一致!",
            type: "warning",
          });
          return;
        }

        this.isSubmittingPassword = true;

        this.$store
          .dispatch("user/modifyPassword", this.passwordForm)
          .then(() => {
            this.$message({
              message: "修改成功!",
              type: "success",
            });
            this.handlePasswordDialogClose();
          })
          .catch(() => {
            // noop
          })
          .finally(() => {
            this.isSubmittingPassword = false;
          });
      }
    },
    validPassword() {
      return new Promise((res) => {
        this.$refs["passwordForm"].validate((valid) => {
          res(valid);
        });
      });
    },
    // 再次输入值是否和新值一致
    validRepeatValueEqToNewValue() {
      return this.passwordForm.repeat === this.passwordForm.newValue;
    },

    // 新值不能和旧值一致
    validNewValueNotEqToOldValue() {
      return this.passwordForm.newValue !== this.passwordForm.oldValue;
    },

    handleModify(prop) {
      if (!this.basicInfo[prop].inEditing) {
        this.basicInfo[prop].inEditing = true;
      } else {
        // valid
        const valid = this.validate(prop);
        if (!valid) {
          this.$message({
            message: valid.message,
            type: "error",
          });
          return;
        }
        // api  save
        this.basicInfo[prop].saving = true;
        this.basicInfo[prop].inEditing = false;

        this.modifyUserInfo()
          .then(() => {
            this.$message({
              message: "修改成功!",
              type: "success",
            });

            this.getUserInfo();
          })
          .catch(() => {
            // noop
          })
          .finally(() => {
            this.basicInfo[prop].saving = false;
          });
      }
    },

    validate(prop) {
      const value = this.basicInfo[prop].value?.trim();
      if (prop === "email") {
        return {
          prop,
          isPass: value && validEmail(value),
          message: "请输入正确的email!",
        };
      }

      if (prop === "phone") {
        return {
          prop,
          isPass: value && isPhoneNumber(value),
          message: "请输入正确的电话号码!",
        };
      }

      if (prop === "displayName") {
        return {
          prop,
          isPass: typeof value === "string" && value.trim() !== "",
          message: "显示名不能为空!",
        };
      }

      return true;
    },

    modifyUserInfo() {
      const payload = {
        id: this.user.id,
        displayName: this.basicInfo.displayName.value,
        description: this.basicInfo.description.value,
        phone: this.basicInfo.phone.value,
        email: this.basicInfo.email.value,
      };

      return this.$store.dispatch("user/modifyUserInfo", payload);
    },

    getUserInfo() {
      const payload = { project_id: this.$store.getters.appId };
      this.$store
        .dispatch("auth/getUserInfo", payload)
        .then((data) => {
          this.user = data;

          for (let prop in this.basicInfo) {
            this.basicInfo[prop].value = data[prop];
          }
          this.permsInfo.roles = data.roles;
          this.basicInfo.password.value = "12345678";
        })
        .catch(() => {
          // noop
        });
    },

    getPermInfo() {
      const payload = {
        project_id: this.$store.getters.appId,
        username: this.user.username,
        roles: this.user.roles,
      };
      this.$store
        .dispatch("user/getPermInfo", payload)
        .then((data) => {
          this.permsInfo.permData = data.actionPerm;
          this.permsInfo.dataPerm = data.dataPerm;
        })
        .catch(() => {
          // noop
        });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.user-info {
  height: 100%;
  padding: 10px;
  display: flex;
  align-items: top;
  justify-content: space-between;
  background: $background-color;
  overflow: auto;

  .password-input-item {
    width: 500px;
  }

  .btns-container {
    text-align: right;
    padding-right: 60px;
    padding-top: 20px;
  }

  .left-section {
    margin-right: 20px;
    background: #fff;
    width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .top {
      width: 100%;
      padding: 10px;
      text-align: center;
      color: $color-text;

      .basic-info {
        padding: 20px;

        .pic-cont {
          padding: 10px 0;

          .pic {
            width: 100px;
            height: auto;
            margin-bottom: 10px;
          }
        }

        .name {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .des {
          font-size: 12px;
          //   text-overflow: ellipsis;
          //   overflow: hidden;
          //   white-space: pre;
        }
      }

      .other-info {
        font-size: 14px;
        padding: 20px 0 0 20px;

        .other-info-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 10px;

          .info-icon {
            margin-right: 10px;
          }
        }
      }
    }

    .bottom {
      width: 100%;
      padding: 20px;

      font-size: 12px;
      color: $color-text;

      .version-title {
        font-weight: bold;
        font-size: 14px;
        padding: 5px 0;
      }

      .version {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .right-section {
    padding: 20px;
    background: #fff;
    min-width: 1000px;
    overflow: auto;
    height: 100%;

    flex: 1 1 auto;

    .basic-info {
      padding: 20px;
      padding-top: 30px;

      .input-item {
        width: 300px;
        margin-right: 10px;
      }

      .account-number {
        color: $color-disabled;
      }

      .form-item-section {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
      }
    }

    .perm-detail-container {
      width: 100%;
      overflow: auto;
      padding: 20px;

      .perm-form-item {
        color: $color-text;
      }

      .perm-form-item-container {
        padding: 0 20px;
      }
    }
  }
}
</style>
