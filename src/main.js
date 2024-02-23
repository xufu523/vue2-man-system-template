/**
 * mock数据使用，实际开发项目时请删除此引入
 * 登录账号：admin，登录密码：123456
 */
import '../mock';

import 'ant-design-vue/dist/antd.css';
import '@/styles/common.less';
import Vue from 'vue';
import Antd, { message } from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import composes from './composes';

Vue.config.productionTip = false;
message.config({ maxCount: 1 });

Vue.use(Antd);
Vue.use(composes);


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
