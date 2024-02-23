import * as pub from '../utils/pub';
import * as validate from '../utils/validate';
import * as constants from '../configs/constants';
import mixins from './mixins';

export default {
  install(Vue) {
    // 公共方法模块
    Vue.prototype.$pub = pub;

    // 表单验证模块
    Vue.prototype.$validate = validate;

    // 常量模块
    Vue.prototype.$constants = constants;

    // 全局mixins混入
    Vue.mixin(mixins);
  },
};
