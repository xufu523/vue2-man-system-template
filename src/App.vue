<template>
  <AConfigProvider :locale="locale" :getPopupContainer="getPopupContainer">
    <template slot="renderEmpty">
      <span>暂无数据</span>
    </template>
    <div id="app">
      <RouterView />
    </div>
  </AConfigProvider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

export default {
  created() {},
  data() {
    return {
      locale: zhCN,
    };
  },
  methods: {
    getPopupContainer(el, dialogContext) {
      if (dialogContext) {
        return dialogContext.getDialogWrap();
      }

      if (el) {
        const parentsClass = [];
        let parentEl = el.parentNode;

        while (parentEl.tagName !== 'BODY') {
          const parentElClass = parentEl.className.split(' ');

          parentsClass.push(...parentElClass);
          parentEl = parentEl.parentNode;
        }

        if (parentsClass.includes('router-view-box')) {
          return document.querySelector('.router-view-box');
        }

        return document.body;
      }

      return document.body;
    },
  },
};
</script>
