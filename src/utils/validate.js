/* eslint-disable max-len */

// 身份证校验
export function idCodeValid(code) {
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  };
  let checkBool = true;

  if (!code || !/^\d{6}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    checkBool = false;
  } else if (!city[code.substr(0, 2)]) {
    checkBool = false;
  } else if (
    new Date(`${code.substring(6, 10)}/${code.substring(10, 12)}/${code.substring(12, 14)}`).getTime() >
    new Date().getTime()
  ) {
    checkBool = false;
  } else {
    const codeArr = code.split('');

    // 加权因子
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

    // 校验位
    const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    let ai = 0;
    let wi = 0;

    for (let i = 0; i < 17; i += 1) {
      ai = codeArr[i];
      wi = factor[i];
      sum += ai * wi;
    }

    if (parity[sum % 11].toString() !== codeArr[17]) {
      checkBool = false;
    }
  }

  return checkBool;
}

// 手机号码验证
export function mobPhoneValid(phoneNum) {
  return /^1\d{10}$/.test(phoneNum);
}

// 座机号码或者传真号码验证
export function fixedPhoneValid(phoneNum) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}(-[0-9]{1,4})?$/.test(phoneNum);
}

// 电话号码验证
export function phoneValid(phoneNum) {
  return mobPhoneValid(phoneNum) || fixedPhoneValid(phoneNum);
}

// 车牌号验证
export function carNumValid(carNum) {
  const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
  const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;

  if (carNum.length === 7) return creg.test(carNum);
  if (carNum.length === 8) return xreg.test(carNum);
  return false;
}
