<template>
  <ATreeSelect
    showSearch
    :showCheckedStrategy="$constants.TREE_SELECT.showAll"
    :filterTreeNode="filterTreeNode"
    :dropdownClassName="loading ? 'g-tree-loading' : ''"
    :notFoundContent="loading ? '加载中...' : '暂无数据'"
    :allowClear="allowClear"
    :treeData="treeData"
    :treeDefaultExpandedKeys="treeDefaultExpandedKeys"
    :treeCheckable="treeCheckable"
    :maxTagCount="maxTagCount"
    :disabled="disabled"
    :placeholder="placeholder"
    :value="treeValue"
    @change="handleChange"
  >
    <span
      slot="title"
      slot-scope="{ name }"
      :title="name"
    >
      {{ name }}
    </span>
  </ATreeSelect>
</template>

<script>
export default {
  name: 'GTreeSelect',
  components: {},
  created() {
    this.setDefaultExpandedKeys();
  },
  data() {
    return {
      treeDefaultExpandedKeys: [],
      treeValue: this.value,
    };
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: [String, Number, Array, Object],
    },
    allowClear: {
      type: Boolean,
      default: false,
    },
    treeCheckable: {
      type: Boolean,
      default: false,
    },
    maxTagCount: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Array,
      required: true,
      default: () => [],
    },
    treeDataMap: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  computed: {},
  watch: {
    value(val) {
      this.treeValue = val;
    },
    treeDataMap() {
      this.setDefaultExpandedKeys();
    },
  },
  methods: {
    filterTreeNode(inputValue, treeNode) {
      if (treeNode.data.props.name.indexOf(inputValue) !== -1) {
        return true;
      }

      return false;
    },
    setDefaultExpandedKeys() {
      if (!Object.keys(this.treeDataMap).length) return;

      const defaultExpandedKeys = [];
      let values = [];

      if (Array.isArray(this.value)) {
        values = this.value;
      } else if (this.value) {
        values = [this.value];
      }

      values.forEach(value => defaultExpandedKeys.push(...this.getParentsKeys(value)));
      this.treeDefaultExpandedKeys = [...new Set(defaultExpandedKeys)];
    },
    getParentsKeys(value) {
      const parentsKeys = [];
      const getParentKey = key => {
        const ownItem = this.treeDataMap[key] || {};
        const parentId = ownItem.parentId || ownItem.regulatorId;

        if (parentId) {
          parentsKeys.push(parentId);
          getParentKey(parentId);
        }
      };

      getParentKey(value);

      return parentsKeys;
    },
    handleChange(value, label, extra) {
      const $options = this.$options || {};
      const propsData = $options.propsData || {};

      if (!('value' in propsData)) {
        this.treeValue = value;
      }

      if (this.treeCheckable) {
        this.$emit('change', value, label, extra);
      } else {
        value !== this.treeValue && this.$emit('change', value, label, extra);
      }
    },
  },
};
</script>
