<template>
  <div class="login">
    <div class="login-section">
      <div class="title">舆情分析系统</div>
      <div class="description">
        高效舆情分析解决方案 , 满足全生命周期的舆情分析需求
      </div>
      <div class="login-type">
        <span class="user-password-text">账户密码登录</span>
        <a-button type="text" class="sso-login-text" :loading="logining" @click="ssoLogin">
          sso登录
        </a-button>
      </div>
      <a-form ref="loginForm" :model="form" :rules="rules" layout="vertical">
        <a-form-item field="username" class="username">
          <a-input v-model="form.username" placeholder="账户" allow-clear />
        </a-form-item>
        <a-form-item field="password" class="password">
          <a-input-password
            v-model="form.password"
            placeholder="密码"
            allow-clear
          />
        </a-form-item>
      </a-form>
      <div class="auto-login">
        <a-checkbox v-model:checked="isAutoLogin">
          <span class="auto-login-label">自动登录</span>
        </a-checkbox>
      </div>

      <a-button style="width: 100%" type="primary" :loading="logining" @click="handleSubmit">
        登 录
      </a-button>
    </div>
    <div class="info">AOP@技术中台-舆情分析系统开发小组支持</div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Cookies from 'js-cookie';

const router = useRouter();
const store = useStore();

const form = reactive({
  username: '',
  password: '',
});

const rules = reactive({
  username: [
    {
      message: '必须以英文字符开头,且仅支持1~20位英文字符、数字、英文.、英文-',
      required: true,
      pattern: /^[a-zA-Z0-9.-]{1,20}$/,
      trigger: 'change',
    },
    {
      message: '必须以英文字符开头,且仅支持1~20位英文字符、数字、英文.、英文-1',
      required: true,
      pattern: /^[a-zA-Z]/,
      trigger: 'change',
    },
  ],
  password: [
    {
      message: '仅支持6~128位英文字母和数字',
      pattern: /^[a-zA-Z0-9]{6,128}$/,
      required: true,
      trigger: 'change',
    },
  ],
});

const isAutoLogin = ref(false);
const logining = ref(false);
const loginForm = ref();

const ssoLogin = () => {
  logining.value = true;
  store
    .dispatch('auth/ssoLogin')
    .then((ssoUrl) => {
      if (ssoUrl) {
        window.location = ssoUrl;
      }
    })
    .catch(() => {
      // noop
    })
    .finally(() => {
      logining.value = false;
    });
};

const checkAutoLogin = () => {
  isAutoLogin.value = !!Cookies.get('auto_login');
  const username = Cookies.get('username');
  const password = Cookies.get('password');
  if (username && password) {
    form.username = username;
    form.password = password;
  }

  if (isAutoLogin.value) {
    handleSubmit();
  }
};

const handleAutoLogin = () => {
  if (isAutoLogin.value) {
    Cookies.set('auto_login', 'true', { expires: 14 });
    Cookies.set('username', form.username, { expires: 14 });
    Cookies.set('password', form.password, { expires: 14 });
  } else {
    Cookies.remove('auto_login');
    Cookies.remove('username');
    Cookies.remove('password');
  }
};

const validLoginInfo = async () => {
  try {
    await loginForm.value?.validate();
    return true;
  } catch (err) {
    if (err?.errorFields?.length) {
      return false;
    }
    return false;
  }
};

const handleSubmit = async () => {
  const pass = await validLoginInfo();
  if (!pass) return;
  handleAutoLogin();
  logining.value = true;
  store
    .dispatch('auth/login', form)
    .then(() => {
      router.push({
        name: 'dashbord',
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      logining.value = false;
    });
};

onMounted(() => {
  checkAutoLogin();
});
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
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
