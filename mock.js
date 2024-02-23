import Mock from 'mockjs';

const { Random } = Mock;
const code = 0;

// mock 登录
const makeLogin = req => {
  const body = JSON.parse(req.body);

  if (body.userName === 'admin' && body.password === '123456') {
    return {
      code,
      result: true,
      data: {
        userName: 'admin',
        token: 'hsdfkshfkj123sdf',
        menus: [
          {
            path: '/demo',
            title: 'Demo模块',
            icon: 'folder',
            children: [
              {
                path: '/demo/demoList',
                title: 'Demo列表',
                icon: 'file',
              },
            ],
          },
        ],
      },
    };
  }

  return {
    code: 1,
    result: false,
    msg: '用户名或密码错误',
    data: null,
  };
};

Mock.mock(RegExp('/api/login.*'), 'post', makeLogin);

// mock 退出登录
const makeLogout = () => ({
  code,
  result: true,
  msg: '退出成功',
  data: null,
});

Mock.mock(RegExp('/api/logout.*'), 'post', makeLogout);

// mock list
const getList = total => {
  const list = [];

  for (let i = 0; i < total; i += 1) {
    list.push({
      id: i + 1,
      name: Random.cname(),
      sex: Random.pick(['1', '2']),
      birthday: Random.date(),
      idNum: Random.id(),
      phone: '13523528888',
      email: Random.email(),
    });
  }

  return list;
};
const list = getList(73);

const makeListData = req => {
  const { pageNum, pageSize, name, sex } = JSON.parse(req.body);
  const startNum = (pageNum - 1) * pageSize;
  const endNum = startNum + pageSize;
  let filterList = list;

  if (name) {
    filterList = list.filter(item => item.name === name);
  }

  if (sex) {
    filterList = list.filter(item => item.sex === sex);
  }

  return {
    code,
    result: true,
    data: {
      result: filterList.slice(startNum, endNum),
      totalCount: filterList.length,
    },
  };
};

Mock.mock(RegExp('/api/list.*'), 'post', makeListData);

// mock 新增
const makeAdd = req => {
  const body = JSON.parse(req.body);

  body.id = new Date().getTime();
  list.unshift(body);

  return {
    code,
    result: true,
    data: null,
  };
};

Mock.mock(RegExp('/api/add.*'), 'post', makeAdd);

// mock 修改
const makeEdit = req => {
  const { id, name, sex, birthday, idNum, phone, email } = JSON.parse(req.body);
  const findItem = list.find(item => item.id === id);

  findItem.name = name;
  findItem.sex = sex;
  findItem.birthday = birthday;
  findItem.idNum = idNum;
  findItem.phone = phone;
  findItem.email = email;

  return {
    code,
    result: true,
    data: null,
  };
};

Mock.mock(RegExp('/api/edit.*'), 'post', makeEdit);

// mock 详情
const makeInfo = req => {
  const { id } = JSON.parse(req.body);
  const findItem = list.find(item => item.id === id);

  return {
    code,
    result: true,
    data: findItem,
  };
};

Mock.mock(RegExp('/api/info.*'), 'post', makeInfo);

// mock 删除
const makeRemove = req => {
  const { id } = JSON.parse(req.body);
  const findIndex = list.findIndex(item => item.id === id);

  list.splice(findIndex, 1);

  return {
    code,
    result: true,
    data: null,
  };
};

Mock.mock(RegExp('/api/remove.*'), 'post', makeRemove);
