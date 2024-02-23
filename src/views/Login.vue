<template>
  <div class="login">
    <video class="login-bg" src="../assets/login-bg.mp4" muted autoplay loop />
    <AForm class="login-form" :form="form">
      <AFormItem>
        <div class="login-top">
          <!-- <img class="login-logo" src="../assets/logo.png" alt=""> -->
          <h1 class="login-title">用户登录</h1>
        </div>
      </AFormItem>
      <AFormItem>
        <AInput
          class="login-ipt"
          size="large"
          placeholder="用户名"
          v-decorator="[
            'userName',
            {
              initialValue: loginData.userName,
              rules: [
                { required: true, message: '用户名不能为空' },
                { max: 20, message: '最大长度不能超过20' }
              ],
            }
          ]"
        >
          <AIcon slot="prefix" type="user" />
        </AInput>
      </AFormItem>
      <AFormItem>
        <AInput
          class="login-ipt"
          size="large"
          type="password"
          placeholder="密码"
          v-decorator="[
            'password',
            {
              initialValue: loginData.password,
              rules: [
                { required: true, message: '密码不能为空' },
                { min: 6, message: '最小长度不能少于6' },
                { max: 20, message: '最大长度不能超过20' }
              ],
            }
          ]"
        >
          <AIcon slot="prefix" type="lock" />
        </AInput>
      </AFormItem>
      <AFormItem>
        <AButton
          class="login-btn"
          htmlType="submit"
          size="large"
          :loading="loading"
          @click="handleSubmit"
        >
          登录
        </AButton>
      </AFormItem>
    </AForm>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import * as login from '@/services/login';

export default {
  created() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('menus');
    this.resetState();
  },
  destroyed() {},
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      loginData: {
        userName: '',
        password: '',
      },
    };
  },
  computed: {},
  methods: {
    ...mapMutations(['resetState', 'updateUserInfo', 'updateMenus']),
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true;

          try {
            const { token, menus, ...userInfo } = (await login.login(values)) || {};

            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(userInfo || {}));
            localStorage.setItem('menus', JSON.stringify(menus || []));
            this.updateUserInfo(userInfo || {});
            this.updateMenus(menus || []);
            this.$router.push('/');
          } catch (error) {
            throw error;
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style lang="less">
.login {
  height: 100%;
  min-height: 480px;
  min-width: 1110px;
  position: relative;
  overflow: hidden;
  background: #101038;
  .login-bg {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
  .login-form {
    width: 360px;
    padding: 30px;
    position: absolute;
    top: 50%;
    right: 12.5%;
    transform: translate(0, -50%);
    z-index: 10;
    background: #282b58;
    border-radius: 4px;
    .login-top {
      text-align: center;
    }
    .login-logo {
      height: 40px;
    }
    .login-title {
      font-size: 22px;
      color: #c1c4ec;
      letter-spacing: 0;
      font-weight: 500;
      margin-bottom: 0;
    }
    .login-ipt {
      .ant-input-prefix {
        color: #b9b9d4;
        font-size: 20px;
        left: 9px;
      }
      .ant-input {
        background: rgba(15, 15, 57, 0.4);
        border-color: transparent;
        color: #ffffff;
        padding-left: 35px;
        &:focus,
        &:hover {
          background: rgba(15, 15, 57, 0.8);
          border-color: transparent;
          box-shadow: none;
        }
      }
    }
    .login-btn {
      width: 100%;
      background: #4d29e7;
      border-color: #4d29e7;
      color: #ffffff;
      &:hover,
      &:focus {
        background: #7e60ff;
        border-color: #7e60ff;
      }
    }
  }
}
</style>
