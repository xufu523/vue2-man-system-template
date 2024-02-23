<template>
  <ASelect
    showSearch
    :showArrow="false"
    :filterOption="false"
    :defaultActiveFirstOption="false"
    :notFoundContent="loading ? undefined : '暂无数据'"
    :mode="mode"
    :allowClear="allowClear"
    :placeholder="placeholder"
    :maxTagCount="maxTagCount"
    :value="selectValue"
    :disabled="disabled"
    @search="handleSearch"
    @change="handleChange"
  >
    <ASpin v-if="loading" slot="notFoundContent" size="small" />
    <slot :datas="datas" v-if="$scopedSlots.default"></slot>
    <ASelectOption
      v-else
      v-for="item in datas"
      :key="item[fieldNames.value]"
      :value="item[fieldNames.value]"
      :title="item[fieldNames.label]"
      :itemInfo="item"
    >
      {{ item[fieldNames.label] }}
    </ASelectOption>
  </ASelect>
</template>

<script>
export default {
  name: 'GRemoteSelect',
  components: {},
  created() {
    this.handleSearch = this.$pub.debounce(this.fetchSearch, 500);
  },
  data() {
    return {
      loading: false,
      datas: this.initDatas,
      selectValue: this.value,
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
    remoteMethod: {
      type: Function,
    },
    initDatas: {
      type: Array,
      default: () => [],
    },
    mode: {
      type: String,
      default: 'default',
    },
    allowClear: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请输入关键字检索',
    },
    maxTagCount: {
      type: Number,
      default: 2,
    },
    fieldNames: {
      type: Object,
      default: () => ({ label: 'label', value: 'value' }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      this.selectValue = val;
    },
    initDatas(val) {
      this.datas = val || [];
    },
  },
  methods: {
    async fetchSearch(keyword) {
      if (keyword) {
        this.datas = [];
        this.loading = true;

        try {
          const datas = await this.remoteMethod(keyword);

          this.datas = (datas || []).slice(0, 20);
        } catch (error) {
          throw error;
        } finally {
          this.loading = false;
        }
      }
    },
    handleChange(value, option) {
      this.$emit('change', value, option);
    },
    resetDatas() {
      this.datas = this.initDatas;
    },
  },
};
</script>
