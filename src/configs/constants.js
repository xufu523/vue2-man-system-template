import { TreeSelect } from 'ant-design-vue';

const { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } = TreeSelect;

export const TREE_SELECT = {
  showAll: SHOW_ALL,
  showParent: SHOW_PARENT,
  showChild: SHOW_CHILD,
};

export const PAGE_SIZE = 10;

export const MENU_FIELD_NAMES = {
  label: 'title',
  icon: 'icon',
  path: 'path',
};

// 性别常量
export const SEX = [
  {
    value: '1',
    label: '男',
  },
  {
    value: '2',
    label: '女',
  },
];
