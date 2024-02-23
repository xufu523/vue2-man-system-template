<template>
    <div v-show="show" class="g-loading-bar">
      <div :style="styles" class="g-loading-bar-inner"></div>
    </div>
</template>

<script>
export default {
  name: 'GLoadingBar',
  props: {
    color: {
      type: String,
      default: '#1890ff',
    },
    failedColor: {
      type: String,
      default: '#f5222d',
    },
    height: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      percent: 0,
      status: 'success',
      show: false,
    };
  },
  computed: {
    styles() {
      const style = {
        width: `${this.percent}%`,
        height: `${this.height}px`,
      };

      if (this.status === 'success') {
        style.backgroundColor = this.color;
      } else if (this.status === 'error') {
        style.backgroundColor = this.failedColor;
      }

      return style;
    },
  },
};
</script>

<style lang="less" scoped>
.g-loading-bar {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  .g-loading-bar-inner {
    transition: width 0.2s linear;
  }
}
</style>
