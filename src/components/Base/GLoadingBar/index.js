import GLoadingBar from './GLoadingBar';

let color = '#1890ff';
let duration = 700;
let failedColor = '#f5222d';
let height = 2;
let loadingBarInstance = null;
let timer = null;

function getLoadingBarInstance() {
  loadingBarInstance =
    loadingBarInstance || GLoadingBar.newInstance({ color, failedColor, height });

  return loadingBarInstance;
}

function update(options) {
  const instance = getLoadingBarInstance();

  instance.update(options);
}

function hide() {
  setTimeout(() => {
    update({
      show: false,
    });
    setTimeout(() => {
      update({
        percent: 0,
      });
    }, 200);
  }, duration);
}

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export default {
  start() {
    clearTimer();

    let percent = 0;

    update({
      percent,
      status: 'success',
      show: true,
    });

    timer = setInterval(() => {
      percent += Math.floor(Math.random() * 3 + 1);
      if (percent > 90) {
        clearTimer();
      }
      update({
        percent,
        status: 'success',
        show: true,
      });
    }, 200);
  },
  update(percent) {
    clearTimer();
    update({
      percent,
      status: 'success',
      show: true,
    });
  },
  finish() {
    clearTimer();
    update({
      percent: 100,
      status: 'success',
      show: true,
    });
    hide();
  },
  error() {
    clearTimer();
    update({
      percent: 100,
      status: 'error',
      show: true,
    });
    hide();
  },
  config(options = {}) {
    const {
      color: paramColor,
      duration: paramDuration,
      failedColor: paramFailedColor,
      height: paramHeight,
    } = options;

    paramColor && (color = paramColor);
    paramDuration && (duration = paramDuration);
    paramFailedColor && (failedColor = paramFailedColor);
    paramHeight && (height = paramHeight);
  },
  destroy() {
    clearTimer();

    const instance = getLoadingBarInstance();

    loadingBarInstance = null;
    instance.destroy();
  },
};
