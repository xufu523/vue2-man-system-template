/**
 * 路由meta说明
 * keepAlive       Boolean类型     路由组件是否使用keep-alive
 * breadcrumbName  String类型      面包屑
 */

import Vue from 'vue';
import Router from 'vue-router';
import { message } from 'ant-design-vue';
import GLoadingBar from '../components/Base/GLoadingBar';
import store from '../store';
import { MENU_FIELD_NAMES } from '../configs/constants';

const originalPush = Router.prototype.push;

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(error => error);
};

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('../views/Layout.vue'),
      children: [
        {
          path: 'demo/demoList',
          name: 'demo.demoList',
          meta: {
            keepAlive: true,
          },
          component: () => import('../views/Demo/DemoList/Index.vue'),
        },
        {
          path: 'demo/demoList/info',
          name: 'demo.demoList.info',
          meta: {
            breadcrumbName: '人员详情',
          },
          component: () => import('../views/Demo/DemoList/Info.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/noAuth',
      name: 'error-noAuth',
      component: () => import('../views/Error/Index.vue'),
    },
    {
      path: '*',
      name: 'error-404',
      component: () => import('../views/Error/Index.vue'),
    },
  ],
});

router.beforeEach(({ path }, from, next) => {
  const noValidPaths = ['/login', '/', '/noAuth'];

  store.commit('updateFromRoute', from);
  GLoadingBar.start();

  if (noValidPaths.includes(path)) {
    next();
  } else if (store.state.userInfo.userName) {
    const findItem = store.getters.simpleMenus.find(item => {
      const menuPath = item[MENU_FIELD_NAMES.path];

      return path.startsWith(menuPath);
    });

    if (findItem) {
      next();
    } else {
      GLoadingBar.finish();
      next({ path: '/noAuth', replace: true });
    }
  } else {
    message.error('登录超时，请重新登录');
    GLoadingBar.finish();
    next('/login');
  }
});

router.afterEach(() => {
  const contentDom = document.querySelector('.router-view-box');
  const rightSiderDom = document.querySelector('.right-sider');

  if (contentDom) {
    contentDom.scrollTop = 0;
    contentDom.scrollLeft = 0;
  }

  if (rightSiderDom) {
    rightSiderDom.scrollTop = 0;
    rightSiderDom.scrollLeft = 0;
  }

  GLoadingBar.finish();
});

export default router;
