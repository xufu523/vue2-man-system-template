<template>
  <div class="hy-error">
    <div class="hy-error-main">
      <div class="hy-error-bg">
        <img class="hy-error-img" src="../../assets/404/404.png" alt="404" />
        <div class="hy-error-shadow">
          <img class="animate-shadow" src="../../assets/404/404-shadow.png" alt="shadow" />
        </div>
        <div class="hy-error-animate">
          <img class="animate-1" src="../../assets/404/404-1.png" alt="1" />
          <img class="animate-2" src="../../assets/404/404-2.png" alt="2" />
          <img class="animate-3" src="../../assets/404/404-3.png" alt="3" />
          <img class="animate-4" src="../../assets/404/404-4.png" alt="4" />
          <img class="animate-5" src="../../assets/404/404-5.png" alt="5" />
        </div>
      </div>
      <p v-if="$route.path === '/noAuth'">无此页面权限，请联系管理员开通或点<a @click="toLogin">退出</a>重新登录</p>
      <p v-else>您迷路了...别着急，点<a @click="toIndex">这里</a>找到出路</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as login from '@/services/login';

export default {
  computed: {
    ...mapGetters(['firstMenu']),
  },
  methods: {
    toIndex() {
      const firstMenuPath = this.firstMenu[this.$constants.MENU_FIELD_NAMES.path];

      this.$router.push(firstMenuPath || '/login');
    },
    toLogin() {
      this.$confirm({
        title: '提示',
        content: '是否确定退出登录？',
        onOk: async () => {
          try {
            await login.logout();
            this.$router.push('/login');
          } catch (error) {
            this.$router.push('/login');
          }
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.hy-error {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  background: #f3f3f4;
  .hy-error-main {
    position: absolute;
    width: 500px;
    top: 20%;
    left: 50%;
    margin-left: -250px;
    .hy-error-bg {
      position: relative;
      width: 500px;
      height: 184px;
      text-align: center;
      margin-bottom: 30px;
      img {
        opacity: 0;
        z-index: 99;
        width: 464px;
        height: 184px;
        transform: translateY(10px);
        animation: animShowUp 0.8s 2.1s forwards;
      }
      .hy-error-animate,
      .hy-error-shadow {
        position: absolute;
        top: 20px;
        left: 50%;
        z-index: 10;
        margin-left: -80px;
        width: 160px;
        height: 179px;
        img {
          opacity: 0;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 100;
          width: 100%;
          height: 100%;
          &.animate-1 {
            transform-origin: 82px 5px;
            animation: animateRotate 0.6s 0.3s forwards;
          }
          &.animate-2 {
            transform-origin: 148px 75px;
            animation: animateRotate 0.6s 0.6s forwards;
          }
          &.animate-3 {
            transform-origin: 77px 141px;
            animation: animateRotate 0.6s 0.9s forwards;
          }
          &.animate-4 {
            transform-origin: 11px 71px;
            animation: animateRotate 0.6s 1.2s forwards;
          }
          &.animate-5 {
            transform-origin: 89px 146px;
            animation: animateRotate 0.5s 1.6s forwards;
          }
          &.animate-shadow {
            transform: translateY(-10px);
            animation: animDown 0.8s 1.9s forwards;
          }
        }
      }
    }
    p {
      opacity: 0;
      line-height: 18px;
      font-size: 18px;
      text-align: center;
      font-weight: 100;
      color: #254f8c;
      transform: translateY(-20px);
      animation: animShowDown 0.8s 2.1s forwards;
      a {
        display: inline-block;
        padding: 0 4px;
        color: #ef5c6e;
      }
    }
  }
}
@keyframes animateRotate {
  0% {
    opacity: 0;
    transform: rotate(-43deg);
  }
  100% {
    opacity: 1;
    transform: rotate(0);
  }
}
@keyframes animDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes animShowUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes animShowDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
