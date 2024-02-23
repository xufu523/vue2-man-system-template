<template>
  <div class="g-table-page">
    <ASpin :spinning="innerLoading || loading">
      <div v-if="$slots.pageHeader">
        <slot name="pageHeader"></slot>
      </div>
      <div class="search-box" v-if="$slots.default">
        <AForm class="search-form" layout="vertical" ref="searchForm" :style="searchFormStyle">
          <div class="search-left" ref="searchLeft">
            <slot></slot>
          </div>
          <div class="search-right">
            <AFormItem label="查询按钮">
              <AButton type="primary" icon="search" @click="handleSearch">查询</AButton>
              <slot name="otherSearchBtns"></slot>
              <AButton
                v-for="(item, index) in exportOptions"
                :key="index"
                type="primary"
                icon="download"
                @click="handleExport(item.exportFn)"
              >
                {{ item.btnName || '导出' }}
              </AButton>
            </AFormItem>
          </div>
        </AForm>
        <div class="search-divider"></div>
        <div class="more-search" v-show="showMoreSearchBtn">
          <div class="more-search-btn" @click="handleExpandSearch">
            <AIcon :type="moreSearchBtn.icon" class="more-search-icon" />
            <span>{{ moreSearchBtn.text }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="exportOptions.length || $slots.otherSearchBtns" class="no-search-box">
        <slot name="otherSearchBtns"></slot>
        <AButton
          v-for="(item, index) in exportOptions"
          :key="index"
          type="primary"
          icon="download"
          @click="handleExport(item.exportFn)"
        >
          {{ item.btnName || '导出' }}
        </AButton>
      </div>
      <div class="other-btns" v-if="$slots.otherBtns">
        <slot name="otherBtns"></slot>
      </div>
      <div v-if="$slots.tableHeader">
        <slot name="tableHeader"></slot>
      </div>
      <slot v-if="$scopedSlots.tableContent" name="tableContent" :datas="dataSource"></slot>
      <ATable
        v-else
        bordered
        :rowKey="rowKey"
        :rowClassName="rowClassName"
        :dataSource="dataSource"
        :columns="newColumns"
        :rowSelection="rowSelection"
        :pagination="false"
        :scroll="scroll"
        :locale="locale"
        :customRow="customRow"
        :size="size"
      />
      <APagination
        v-if="isPagination && total"
        v-bind="pagination"
        @change="handlePageChange"
        @showSizeChange="handlePageChange"
      />
      <div v-if="$slots.pageFooter">
        <slot name="pageFooter"></slot>
      </div>
    </ASpin>
  </div>
</template>

<script>
export default {
  name: 'GTablePage',
  components: {},
  created() {
    this.handleSearch();
  },
  mounted() {
    if (this.$slots.default) {
      this.moreSearchBtnChange();
      window.addEventListener('resize', this.handleResize);
    }
  },
  activated() {
    if (!this.isFirstEnter && this.$slots.default) {
      this.moreSearchBtnChange();
      window.addEventListener('resize', this.handleResize);
    }

    this.isFirstEnter = false;
  },
  deactivated() {
    window.removeEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  data() {
    const { pageSize } = this.pageOptions;

    return {
      innerLoading: false,
      params: {
        ...this.dealSearchData(),
        pageNum: 1,
        pageSize: pageSize || this.$constants.PAGE_SIZE,
      },
      // 初始化时的参数
      initParams: {
        ...this.dealSearchData(),
        pageNum: 1,
        pageSize: pageSize || this.$constants.PAGE_SIZE,
      },
      dataSource: [],
      total: 0,
      // 是否第一次进入页面
      isFirstEnter: true,
      searchFormStyle: {
        height: `${this.showMoreSearchBtnHeight}px`,
      },
      showMoreSearchBtn: false,
      expandSearch: false,
    };
  },
  props: {
    searchData: {
      type: [Object, Function],
      default: () => ({}),
    },
    getList: {
      type: Function,
      required: true,
    },
    // 用于生成导出按钮，[{ exportFn: fn, btnName: '导出' }] exportFn-导出函数，btnName: 导出按钮的名称
    exportOptions: {
      type: Array,
      default: () => [],
    },
    resultNames: {
      type: Object,
      default: () => ({ datas: 'result', total: 'totalCount' }),
    },
    columns: {
      type: Array,
      required: true,
    },
    rowKey: {
      type: [String, Function],
      default: 'id',
    },
    rowClassName: {
      type: Function,
    },
    // 是否发送请求，用于处理进入页面请求其他数据，list请求依赖上一个请求的结果
    isSendRequest: {
      type: Boolean,
      default: true,
    },
    isPagination: {
      type: Boolean,
      default: true,
    },
    showMoreSearchBtnHeight: {
      type: Number,
      default: 69,
    },
    orderNumField: {
      type: [Object, Boolean],
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    rowSelection: {
      type: Object,
    },
    scroll: {
      type: Object,
    },
    // 分页配置参数 支持pageSize、showSizeChanger配置
    pageOptions: {
      type: Object,
      default: () => ({}),
    },
    locale: {
      type: Object,
    },
    customRow: {
      type: Function,
    },
    size: {
      type: String,
      default: 'default',
    },
  },
  computed: {
    pagination() {
      const { showSizeChanger } = this.pageOptions;
      const { pageNum: current, pageSize } = this.params;

      return {
        current,
        pageSize,
        total: this.total || 0,
        showTotal: t => `共 ${t} 条`,
        showSizeChanger: typeof showSizeChanger === 'boolean' ? showSizeChanger : true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
      };
    },
    newColumns() {
      if (this.orderNumField) {
        const orderNumField = {
          title: '序号',
          dataIndex: 'customOrderNum',
          customRender: (text, record, index) => (this.params.pageNum - 1) * this.params.pageSize + index + 1,
          ...(typeof this.orderNumField === 'object' ? this.orderNumField : {}),
        };

        return [orderNumField, ...this.columns];
      }

      return this.columns;
    },
    moreSearchBtn() {
      if (this.expandSearch) {
        return { icon: 'up', text: '收起' };
      }

      return { icon: 'down', text: '更多' };
    },
  },
  watch: {
    isSendRequest(val) {
      if (val) {
        this.params = {
          ...this.dealSearchData(),
          pageNum: 1,
          pageSize: this.$constants.PAGE_SIZE,
        };
        this.initParams = {
          ...this.dealSearchData(),
          pageNum: 1,
          pageSize: this.$constants.PAGE_SIZE,
        };
        this.handleSearch();
      }
    },
  },
  methods: {
    async fetchList(triggerType) {
      if (this.isSendRequest) {
        this.innerLoading = true;

        try {
          const result = await this.getList(this.params, triggerType);
          if (Array.isArray(result)) {
            this.dataSource = result;
            this.total = result.length;
          } else if (result && typeof result === 'object') {
            this.dataSource = result[this.resultNames.datas] || [];
            this.total = result[this.resultNames.total] || 0;
          } else {
            this.dataSource = [];
            this.total = 0;
          }
        } catch (error) {
          this.dataSource = [];
          this.total = 0;

          throw error;
        } finally {
          this.innerLoading = false;
        }
      }
    },
    handleSearch() {
      const { pageSize } = this.params;
      this.params = { ...this.dealSearchData(), pageNum: 1, pageSize };
      this.fetchList();
      this.$emit('search', this.params);
    },
    handlePageChange(pageNum, pageSize) {
      this.params.pageNum = pageNum;
      this.params.pageSize = pageSize;
      this.fetchList('pageChange');
    },
    handleExport(exportFn) {
      exportFn(this.params);
    },
    handleExpandSearch() {
      if (this.expandSearch) {
        this.expandSearch = false;
        this.searchFormStyle = { height: `${this.showMoreSearchBtnHeight}px` };
      } else {
        this.expandSearch = true;
        this.searchFormStyle = { height: `${this.$refs.searchLeft.offsetHeight}px` };
      }
    },
    handleResize() {
      this.moreSearchBtnChange();

      if (this.expandSearch) {
        this.searchFormStyle = { height: `${this.$refs.searchLeft.offsetHeight}px` };
      } else {
        this.searchFormStyle = { height: `${this.showMoreSearchBtnHeight}px` };
      }
    },
    // 是否出现更多按钮
    moreSearchBtnChange() {
      setTimeout(() => {
        if (this.$refs.searchLeft.offsetHeight > this.showMoreSearchBtnHeight) {
          this.showMoreSearchBtn = true;
        } else {
          this.showMoreSearchBtn = false;
        }
      }, 10);
    },
    // 处理查询数据
    dealSearchData() {
      let searchData = {};

      if (typeof this.searchData === 'object') {
        searchData = JSON.parse(JSON.stringify(this.searchData));
      } else if (typeof this.searchData === 'function') {
        searchData = JSON.parse(JSON.stringify(this.searchData() || {}));
      }

      return searchData;
    },
    // 数据减少操作后刷新数据，会对pageNum和当前数据量做判断。使用场景：删除等操作
    reduceRefresh() {
      if (this.dataSource.length === 1 && this.params.pageNum > 1) {
        this.params.pageNum -= 1;
      }

      this.fetchList();
    },
    // 刷新数据 - 当前参数
    refresh() {
      this.fetchList();
    },
    // 重新加载数据-初始化时参数
    reload() {
      const { pageNum, pageSize, ...searchData } = JSON.parse(JSON.stringify(this.initParams));

      this.params = { ...searchData, pageNum, pageSize };
      this.$emit('resetSearch', searchData);
      this.fetchList();
    },
  },
};
</script>

<style lang="less">
.g-table-page {
  .search-box {
    margin-bottom: 15px;
  }
  .no-search-box {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .ant-btn {
      margin-left: 10px;
    }
  }
  .search-form {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: -4px;
    overflow: hidden;
    transition: all 0.3s;
    .ant-select {
      width: auto;
    }
    .ant-input,
    .ant-input-number,
    .ant-select-selection--single {
      width: 170px;
    }
    .ant-select-selection--multiple {
      width: 350px;
      ul,
      ol {
        display: flex;
        align-items: center;
      }
      .ant-select-selection__rendered::after {
        display: none;
      }
      .ant-select-search {
        max-width: 50%;
      }
    }
    .ant-calendar-picker {
      width: 350px !important;
      .ant-calendar-picker-input {
        width: 100%;
      }
    }
    .ant-calendar-single-picker {
      width: 170px !important;
      .ant-calendar-picker-input {
        width: 100%;
      }
    }
    .search-left {
      display: flex;
      flex-wrap: wrap;
      .ant-form-item {
        padding-right: 10px;
        margin-bottom: 0;
        flex: none;
      }
    }
    .search-right {
      flex: none;
      .ant-form-item {
        margin-bottom: 0;
      }
      .ant-form-item-label {
        visibility: hidden;
      }
      .ant-form-item-children {
        display: flex;
        align-items: center;
      }
      .ant-btn {
        margin-left: 10px;
      }
    }
  }
  .search-divider {
    height: 1px;
    background: #d9d9d9;
    margin-top: 7px;
  }
  .more-search {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    .more-search-btn {
      display: flex;
      align-items: center;
      background: #fafafa;
      padding: 0 5px;
      font-size: 12px;
      line-height: 20px;
      border: 1px solid #d9d9d9;
      border-top: 0;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      position: relative;
      top: -1px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
    .more-search-icon {
      margin-right: 3px;
    }
  }
  .other-btns {
    margin-bottom: 15px;
    .ant-btn {
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .custom-operate-btns {
    .ant-btn {
      margin-left: 5px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
