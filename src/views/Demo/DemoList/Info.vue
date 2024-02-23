<template>
  <ASpin :spinning="spinning" class="person-info">
    <div class="basic-info">
      <h3 class="g-intro-title">基本信息</h3>
      <ARow :gutter="16" type="flex" class="g-info margin-top-15">
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol" class="g-info-label">
              <span title="人员姓名">人员姓名</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">{{ personInfo.name || '-' }}</ACol>
          </ARow>
        </ACol>
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol"  class="g-info-label">
              <span title="人员性别">人员性别</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">
              {{ $pub.transEnums(personInfo.sex, $constants.SEX) || '-' }}
            </ACol>
          </ARow>
        </ACol>
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol"  class="g-info-label">
              <span title="出生日期">出生日期</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">{{ personInfo.birthday || '-' }}</ACol>
          </ARow>
        </ACol>
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol"  class="g-info-label">
              <span title="身份证号">身份证号</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">{{ personInfo.idNum || '-' }}</ACol>
          </ARow>
        </ACol>
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol"  class="g-info-label">
              <span title="联系电话">联系电话</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">{{ personInfo.phone || '-' }}</ACol>
          </ARow>
        </ACol>
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol"  class="g-info-label">
              <span title="邮箱地址">邮箱地址</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">{{ personInfo.email || '-' }}</ACol>
          </ARow>
        </ACol>
      </ARow>
    </div>
    <ADivider class="margin-top-5 margin-bottom-15" />
    <div class="other-info">
      <h3 class="g-intro-title">其他信息</h3>
      <ARow :gutter="16" type="flex" class="g-info margin-top-15">
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol"  class="g-info-label">
              <span title="学历情况">学历情况</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">保密</ACol>
          </ARow>
        </ACol>
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol"  class="g-info-label">
              <span title="有无贷款">有无贷款</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">保密</ACol>
          </ARow>
        </ACol>
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol"  class="g-info-label">
              <span title="月薪">月薪</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">保密</ACol>
          </ARow>
        </ACol>
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol" class="g-info-label">
              <span title="性格爱好">性格爱好</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">个人特长及性格评价 这种介绍要恰如其分，尽可能使你的专长、兴趣、性格与你本人相吻合。</ACol>
          </ARow>
        </ACol>
        <ACol v-bind="mainCol" class="margin-bottom-15">
          <ARow>
            <ACol v-bind="labelCol" class="g-info-label">
              <span title="备注">备注</span>
            </ACol>
            <ACol v-bind="wrapperCol" class="g-info-content">
              年中秋节小长假放假时间为9月13日至15日三天，全国铁路网络和电话订票预售期为30天，今日(15日)起，旅客可通过网络和电话购买中秋节当天的火车票。
            </ACol>
          </ARow>
        </ACol>
      </ARow>
    </div>
  </ASpin>
</template>

<script>
import * as demoList from '@/services/demo/demoList';

export default {
  created() {
    const { id } = this.$route.query;

    this.fetchInfo(Number(id));
  },
  data() {
    return {
      mainCol: { xxl: 8, span: 12 },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      spinning: false,
      personInfo: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    async fetchInfo(id) {
      const personInfo = await this.callWithLoading(demoList.getInfo, { id }, 'spinning');

      this.updateState({ personInfo });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
