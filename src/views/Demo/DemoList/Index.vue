<template>
  <div>
    <GTablePage
      :columns="columns"
      :searchData="searchData"
      :getList="getList"
      :scroll="{ x: true }"
      ref="tablePage"
      @resetSearch="data => searchData = data"
    >
      <AFormItem label="人员姓名">
        <AInput allowClear placeholder="请输入人员姓名" v-model="searchData.name" />
      </AFormItem>
      <AFormItem label="人员性别">
        <ASelect
          allowClear
          :options="$constants.SEX"
          placeholder="请选择人员性别"
          v-model="searchData.sex"
        />
      </AFormItem>
      <div slot="otherBtns">
        <AButton type="primary" icon="plus" @click="handleSetedOpen()">新增</AButton>
      </div>
    </GTablePage>
    <!-- 新增、修改弹窗 -->
    <AModal
      destroyOnClose
      :title="setedModalTitle"
      :visible="setedVisible"
      :confirmLoading="confirmLoading"
      @ok="handleSetedOk"
      @cancel="handleModalCancel"
    >
      <AForm :form="setedForm" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <AFormItem label="人员姓名">
          <AInput
            allowClear
            autocomplete="off"
            placeholder="请输入人员姓名"
            v-decorator="[
              'name',
              {
                initialValue: modalData.name,
                rules: [
                  { required: true, message: '人员姓名不能为空' },
                ],
              }
            ]"
          />
        </AFormItem>
        <AFormItem label="人员性别">
          <ASelect
            allowClear
            :options="$constants.SEX"
            placeholder="请选择人员性别"
            v-decorator="[
              'sex',
              {
                initialValue: modalData.sex,
                rules: [
                  { required: true, message: '人员性别不能为空' },
                ],
              }
            ]"
          />
        </AFormItem>
        <AFormItem label="出生日期">
          <ADatePicker
            allowClear
            placeholder="请选择出生日期"
            v-decorator="[
              'birthday',
              {
                initialValue: $pub.dateToMoment(modalData.birthday),
                rules: [
                  { required: true, message: '出生日期不能为空' },
                ],
              }
            ]"
          />
        </AFormItem>
        <AFormItem label="身份证号">
          <AInput
            allowClear
            placeholder="请输入身份证号"
            v-decorator="[
              'idNum',
              {
                initialValue: modalData.idNum,
                rules: [
                  { required: true, message: '身份证号不能为空' },
                  {
                    validator: (rule, value, callback) => {
                      if (value && !$validate.idCodeValid(value)) {
                        callback('身份证号格式不正确');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              }
            ]"
          />
        </AFormItem>
        <AFormItem label="联系电话">
          <AInput
            allowClear
            autocomplete="off"
            placeholder="请输入联系电话"
            v-decorator="[
              'phone',
              {
                initialValue: modalData.phone,
                rules: [
                  { required: true, message: '联系电话不能为空' },
                  {
                    validator: (rule, value, callback) => {
                      if (value && !$validate.phoneValid(value)) {
                        callback('联系电话格式不正确');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              }
            ]"
          />
        </AFormItem>
        <AFormItem label="邮箱地址">
          <AInput
            allowClear
            autocomplete="off"
            placeholder="请输入邮箱地址"
            v-decorator="[
              'email',
              {
                initialValue: modalData.email,
                rules: [
                  { required: true, message: '邮箱地址不能为空' },
                  { type: 'email', message: '邮箱地址格式不正确' },
                ],
              }
            ]"
          />
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import GTablePage from '@/components/Base/GTablePage.vue';
import * as demoList from '@/services/demo/demoList';

export default {
  components: { GTablePage },
  created() {},
  activated() {
    if (!this.isFirstEnter) {
      if (this.fromRoute.path !== '/demo/demoList/info') {
        this.$refs.tablePage.reload();
      }
    }

    this.isFirstEnter = false;
  },
  data() {
    return {
      isFirstEnter: true,
      searchData: {
        name: '',
        sex: undefined,
      },
      columns: [
        {
          title: '人员姓名',
          dataIndex: 'name',
        },
        {
          title: '人员性别',
          dataIndex: 'sex',
          customRender: text => this.$pub.transEnums(text, this.$constants.SEX),
        },
        {
          title: '出生日期',
          dataIndex: 'birthday',
        },
        {
          title: '身份证号',
          dataIndex: 'idNum',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
        },
        {
          title: '邮箱地址',
          dataIndex: 'email',
        },
        {
          title: '操作',
          dataIndex: 'customOperate',
          fixed: 'right',
          width: 10,
          customRender: (text, row) => (
            <div class="custom-operate-btns">
              <AButton type="primary" size="small" onClick={() => this.toInfo(row)}>
                详情
              </AButton>
              <AButton type="primary" size="small" onClick={() => this.handleSetedOpen(row)}>
                修改
              </AButton>
              <AButton type="danger" size="small" onClick={() => this.handleRemove(row)}>
                删除
              </AButton>
            </div>
          ),
        },
      ],
      getList: demoList.getList,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      confirmLoading: false,
      modalData: {},
      setedForm: this.$form.createForm(this),
      setedVisible: false,
    };
  },
  computed: {
    ...mapState(['fromRoute']),
    setedModalTitle() {
      return this.modalData.id ? '修改人员' : '新增人员';
    },
  },
  watch: {},
  methods: {
    handleSetedOpen(row = {}) {
      this.updateState({ setedVisible: true, modalData: row });
    },
    handleSetedOk() {
      this.setedForm.validateFields(async (error, values) => {
        if (!error) {
          const { birthday, ...otherValues } = values;
          const { id } = this.modalData;
          const postData = { ...otherValues, birthday: birthday && birthday.format('YYYY-MM-DD') };

          if (id) {
            postData.id = id;

            await this.callWithLoading(demoList.edit, postData, 'confirmLoading');
            this.$refs.tablePage.refresh();
          } else {
            await this.callWithLoading(demoList.add, postData, 'confirmLoading');
            this.$refs.tablePage.reload();
          }

          this.$message.success(`${this.setedModalTitle}成功`);
          this.handleModalCancel();
        }
      });
    },
    handleModalCancel() {
      this.updateState({ setedVisible: false });
    },
    handleRemove({ id }) {
      this.$confirm({
        title: '提示',
        content: '是否确定删除？',
        onOk: async () => {
          await demoList.remove({ id });

          this.$message.success('删除成功');
          this.$refs.tablePage.reduceRefresh();
        },
      });
    },
    toInfo({ id }) {
      this.$router.push({
        path: '/demo/demoList/info',
        query: { id },
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
