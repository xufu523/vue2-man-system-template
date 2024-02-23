import Vue from 'vue';
import GLoadingBar from './GLoadingBar.vue';

GLoadingBar.newInstance = (props = {}) => {
  const instance = new Vue({
    data: props,
    render(h) {
      return h(GLoadingBar, { props });
    },
  });
  const component = instance.$mount();
  document.body.appendChild(component.$el);

  const LoadingBar = instance.$children[0];

  return {
    update(options) {
      if (options.status) LoadingBar.status = options.status;
      if ('percent' in options) LoadingBar.percent = options.percent;
      if ('show' in options) LoadingBar.show = options.show;
    },
    component: LoadingBar,
    destroy() {
      document.body.removeChild(document.getElementsByClassName('g-loading-bar')[0]);
    },
  };
};

export default GLoadingBar;
