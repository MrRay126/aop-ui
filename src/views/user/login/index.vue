<template>
  <div class="login">
    <div class="login-section">
      <div class="title">舆情分析系统</div>
      <div class="description">
        高效舆情分析解决方案 , 满足全生命周期的舆情分析需求
      </div>
      <div class="login-type">
        <span class="user-password-text">账户密码登录</span>
        <el-button
          type="text"
          class="sso-login-text"
          @click="ssoLogin"
          :loading="logining"
          >sso登录</el-button
        >
      </div>
      <el-form label-width="0" ref="loginForm" :rules="rules" :model="form">
        <el-form-item prop="username" class="username">
          <div>
            <el-input placeholder="账户" v-model="form.username"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="password" class="password">
          <div>
            <el-input
              placeholder="密码"
              v-model="form.password"
              show-password
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="auto-login">
        <el-checkbox v-model="isAutoLogin">
          <span class="auto-login-label">自动登录</span>
        </el-checkbox>
      </div>

      <el-button
        style="width: 100%"
        type="primary"
        :loading="logining"
        @click="handleSubmit"
        >登 录</el-button
      >
    </div>
    <div class="info">AOP@技术中台-舆情分析系统开发小组支持</div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
export default {
  props: {},
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      isAutoLogin: "",
      logining: false,

      rules: {
        username: [
          {
            message:
              "必须以英文字符开头,且仅支持1~20位英文字符、数字、英文.、英文-",
            required: true,
            pattern: /^[a-zA-Z0-9.-]{1,20}$/,
            trigger: "change",
          },
          {
            message:
              "必须以英文字符开头,且仅支持1~20位英文字符、数字、英文.、英文-1",
            required: true,
            pattern: /^[a-zA-Z]/,
            trigger: "change",
          },
        ],
        password: [
          {
            message: "仅支持6~128位英文字母和数字",
            pattern: /^[a-zA-Z0-9]{6,128}$/,
            required: true,
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    // sso登录
    ssoLogin() {
      this.logining = true;
      this.$store
        .dispatch("auth/ssoLogin")
        .then((ssoUrl) => {
          if (ssoUrl) {
            window.location = ssoUrl;
          }
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.logining = false;
        });
    },

    checkAutoLogin() {
      this.isAutoLogin = !!Cookies.get("auto_login");
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      if (username && password) {
        this.form.username = username;
        this.form.password = password;
      }

      if (this.isAutoLogin) {
        this.handleSubmit();
      }
    },

    //
    handleAutoLogin() {
      if (this.isAutoLogin) {
        Cookies.set("auto_login", true, { expires: 14 });
        Cookies.set("username", this.form.username, { expires: 14 });
        Cookies.set("password", this.form.password, { expires: 14 });
      } else {
        Cookies.remove("auto_login");
        Cookies.remove("username");
        Cookies.remove("password");
      }
    },

    async handleSubmit() {
      const pass = await this.validLoignInfo();
      if (!pass) return;
      this.handleAutoLogin();
      // api 提交数据
      this.logining = true;
      this.$store
        .dispatch("auth/login", this.form)
        .then(() => {
          this.$router.push({
            name: "dashbord",
          });
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.logining = false;
        });

      this.logining = false;
    },

    async validLoignInfo() {
      return new Promise((res) => {
        this.$refs["loginForm"].validate((pass) => {
          res(pass);
        });
      });
    },
  },

  mounted() {
    this.checkAutoLogin();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.login {
  width: 100%;
  height: 100%;
  background-color: $background-color;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .login-section {
    margin-top: 100px;
    width: 400px;
    height: auto;

    .title {
      text-align: center;
      font-size: 36px;
      margin-bottom: 20px;
    }

    .description {
      color: $color-light-text;
      margin-bottom: 40px;
      font-size: 14px;
      text-align: center;
    }

    .login-type {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .user-password-text {
        color: $color-light-text;
        font-size: 14px;
      }

      .sso-login-text {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .username {
      margin-bottom: 25px;
    }

    .password {
      margin-bottom: 25px;
    }

    .login-btn {
      height: 40px;
      line-height: 40px;
      background-color: $color-primary;
      color: #fff;
      text-align: center;
      border-radius: 5px;
      cursor: pointer;
    }

    .auto-login {
      margin-bottom: 20px;
      .auto-login-label {
        color: $color-light-text;
      }
    }
  }

  .info {
    color: $color-light-text;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>
