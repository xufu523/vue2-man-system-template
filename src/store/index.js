import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state() {
    return {
      // 当前登录用户的信息
      userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
      // 当前登录用户所拥有的菜单权限
      menus: JSON.parse(localStorage.getItem('menus') || '[]'),
      // 路由跳转的上一个路由
      fromRoute: {},
    };
  },
  getters: {
    // menus简单数组
    simpleMenus: state => {
      const simpleMenus = [];
      const transformToArray = menus => {
        menus.forEach(item => {
          if (item.children && item.children.length) {
            transformToArray(item.children);
          } else {
            simpleMenus.push(item);
          }
        });
      };

      transformToArray(state.menus);

      return simpleMenus;
    },
    // 第一个导航
    firstMenu: state => {
      const getFirstMenu = menus => {
        if (!menus.length) {
          return {};
        }

        if (menus[0].children && menus[0].children.length) {
          return getFirstMenu(menus[0].children);
        }

        return menus[0];
      };

      return getFirstMenu(state.menus);
    },
  },
  mutations: {
    resetState(state) {
      state.userInfo = {};
      state.menus = [];
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    updateMenus(state, menus) {
      state.menus = menus;
    },
    updateFromRoute(state, fromRoute) {
      state.fromRoute = fromRoute;
    },
  },
  actions: {},
});
