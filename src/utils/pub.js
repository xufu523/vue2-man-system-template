import moment from 'moment';

// 获取当前环境
export function getEnv() {
  return process.env.VUE_APP_DEPLOY || 'localhost';
}

export function dateToMoment(date) {
  if (date) return moment(date);
  return undefined;
}

export function dateFormat(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (date) {
    return moment(date).format(fmt);
  }

  return '';
}

// 格式化时间戳为xx天xx小时xx分钟xx秒
export function timeDiffFormat(timeDiff) {
  if (timeDiff) {
    const days = parseInt(timeDiff / (1000 * 60 * 60 * 24), 10);
    const hours = parseInt((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 10);
    const minutes = parseInt((timeDiff % (1000 * 60 * 60)) / (1000 * 60), 10);
    const seconds = (timeDiff % (1000 * 60)) / 1000;
    let str = '';

    if (days !== 0) str += `${days}天`;
    if (hours !== 0) str += `${hours}时`;
    if (minutes !== 0) str += `${minutes}分`;
    if (seconds !== 0) str += `${seconds}秒`;

    return str;
  }

  return '';
}

// 对enums数据转换 enums：[{}]
export function transEnums(text = '', enums = [{}], separator = '、') {
  const newText = text || [];
  const textArr = Array.isArray(newText) ? newText : [newText];
  const labelArr = [];

  textArr.forEach(value => {
    const findItem = enums.find(item => String(item.value) === String(value));

    if (findItem) {
      labelArr.push(findItem.label);
    } else {
      labelArr.push(value);
    }
  });

  return labelArr.join(separator);
}

// 对url后面的参数encodeURI()转码
export function queryEncodeUri(defaultQuery = {}) {
  const query = {};

  Object.keys(defaultQuery).forEach(item => {
    query[item] = encodeURI(defaultQuery[item]);
  });

  return query;
}

// 对url后面的参数decodeURI()解码
export function queryDecodeUri(defaultQuery = {}) {
  const query = {};

  Object.keys(defaultQuery).forEach(item => {
    query[item] = decodeURI(defaultQuery[item]);
  });

  return query;
}

// 对json数组去重
export function jsonDup(arr = [{}], key) {
  const obj = {};
  const newArr = arr.reduce((totalValue, currentItem) => {
    if (!obj[currentItem[key]]) {
      obj[currentItem[key]] = true;
      totalValue.push(currentItem);
    }

    return totalValue;
  }, []);

  return newArr;
}

// RangePicker的快捷选择时间配置
export function getRanges() {
  return {
    上个月: [
      moment()
        .subtract(1, 'months')
        .startOf('month'),
      moment()
        .subtract(1, 'months')
        .endOf('month'),
    ],
    本月: [moment().startOf('month'), moment()],
    最近一个月: [
      moment()
        .subtract(1, 'days')
        .subtract(1, 'months')
        .startOf('day'),
      moment()
        .subtract(1, 'days')
        .endOf('day'),
    ],
    最近一周: [
      moment()
        .subtract(7, 'days')
        .startOf('day'),
      moment()
        .subtract(1, 'days')
        .endOf('day'),
    ],
    昨天: [
      moment()
        .subtract(1, 'days')
        .startOf('day'),
      moment()
        .subtract(1, 'days')
        .endOf('day'),
    ],
    今天: [moment().startOf('day'), moment()],
  };
}

// RangePicker的defaultValueTime
export const defaultValueTime = [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')];

// 时间选择的disabledDate，限制最大时间不能大于今天
export function disabledMaxNow(current) {
  return current && current > moment().endOf('day');
}

// 时间选择的disabledDate，限制最小时间不能小于今天
export function disabledMinNow(current) {
  return current && current < moment().startOf('day');
}

// 防抖
export function debounce(fn, wait) {
  let timer = null;

  return function callback(...args) {
    const context = this;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}

// 解决浏览器的浮点相乘计算
export function floatMul(text1, text2) {
  const a = parseFloat(text1);
  const b = parseFloat(text2);

  if (Number.isNaN(a) || Number.isNaN(b)) return '';

  const d = a.toString();
  const e = b.toString();
  let c = 0;

  try {
    c += d.split('.')[1].length;
  } catch (error) {
    // console.log(error);
  }

  try {
    c += e.split('.')[1].length;
  } catch (error) {
    // console.log(error);
  }

  const powC = 10 ** c;

  return (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / powC;
}

// 解决浏览器的浮点相除计算
export function floatDiv(text1, text2) {
  const a = parseFloat(text1);
  const b = parseFloat(text2);

  if (Number.isNaN(a) || Number.isNaN(b)) return '';

  let c = 0;
  let d = 0;

  try {
    c = a.toString().split('.')[1].length;
  } catch (error) {
    // console.log(error);
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (error) {
    // console.log(error);
  }

  const e = Number(a.toString().replace('.', ''));
  const f = Number(b.toString().replace('.', ''));

  return floatMul(e / f, 10 ** (d - c));
}

// 解决浏览器的浮点相加计算
export function floatAdd(text1, text2) {
  const a = parseFloat(text1);
  const b = parseFloat(text2);

  if (Number.isNaN(a) || Number.isNaN(b)) return '';

  let c;
  let d;

  try {
    c = a.toString().split('.')[1].length;
  } catch (error) {
    c = 0;
  }

  try {
    d = b.toString().split('.')[1].length;
  } catch (error) {
    d = 0;
  }

  const e = 10 ** Math.max(c, d);

  return (floatMul(a, e) + floatMul(b, e)) / e;
}

// 解决浏览器的浮点相减计算
export function floatSub(text1, text2) {
  const a = parseFloat(text1);
  const b = parseFloat(text2);

  if (Number.isNaN(a) || Number.isNaN(b)) return '';

  let c;
  let d;

  try {
    c = a.toString().split('.')[1].length;
  } catch (error) {
    c = 0;
  }

  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }

  const e = 10 ** Math.max(c, d);

  return (floatMul(a, e) - floatMul(b, e)) / e;
}

// 格式化数字 添加千位符和保留指定小数
export function numFormat({ text, separator = '', n = 2 }) {
  let num = parseFloat(text);

  if (!Number.isNaN(num)) {
    num = num.toFixed(n).toString();

    const l = num
      .split('.')[0]
      .split('')
      .reverse();
    const r = n === 0 ? '' : num.split('.')[1];
    let t = '';

    for (let i = 0; i < l.length; i += 1) {
      t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? separator : '');
    }

    return (
      t
        .split('')
        .reverse()
        .join('') +
      (n === 0 ? '' : '.') +
      r
    );
  }

  return text;
}
