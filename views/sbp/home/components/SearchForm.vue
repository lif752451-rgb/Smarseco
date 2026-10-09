<template>
  <el-row class="sm-search-wrapper">
    <el-form inline :model="searchForm" ref="searchForm" @submit.prevent>
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="标题" prop="title">
            <el-input @keyup.enter="onSearchSubmit()" v-model="searchForm.title" :placeholder="titlePlaceholder" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="status.includes(formType) || tabNames.includes(formType)">
          <el-form-item prop="workStatus" label="工单状态">
            <el-select v-model="searchForm.workStatus" clearable placeholder="精确匹配：工单状态">
              <el-option v-for="(item, index) in dictData" :label="tabNames.includes(formType)?item.label:item.dictLabel" :value="tabNames.includes(formType)?item.value : item.dictLabel" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提交人" prop="committer">
            <el-input @keyup.enter="onSearchSubmit()" v-model="searchForm.committer" placeholder="模糊搜索：提交人" clearable ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-show="isFold || !status.includes(formType)">
          <el-form-item label="提交时间" prop="commitTime">
            <el-date-picker
                v-model="searchForm.commitTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-button @click="onSearchSubmit" type="primary"><el-icon><Search /></el-icon><span class="ml-5">搜索</span> </el-button>
      <el-button @click="resetsearchForm" ><el-icon><Refresh /></el-icon><span class="ml-5">重置</span></el-button>
      <el-button v-if="status.includes(formType)" @click="onMoreSerach">
        <el-icon>
          <CaretBottom v-if="isFold" />
          <CaretTop v-else />
        </el-icon>
        <span class="ml-5">{{ setFoldText }}</span>
      </el-button>
    </el-row>
  </el-row>
</template>
<script>
import { getDictType } from '/@/api/sbp/homepage.js';
import lodash from "lodash-es";
export default {
  name: 'SearchForm',
  props: ['formType', 'type'],
  data() {
    return {
      // 搜索字段表单值
      searchForm: {
        title: '',
        workStatus: '',
        committer: '',
        commitTime:'',
      },
      status: ['alarm', 'vuln', 'risk'],
      tabNames: ['security_notice_manage','compliance_check_feedback','compliance_agreement_duty_sign','compliance_agreement_secret_sign','knowledge_institution_manage'],
      dictData: [],
      isFold: false,
      titlePlaceholder: '',
    };
  },
  computed: {
    /** 设置更多折叠图标 */
    setFoldIcon() {
      return this.isFold ? "Bottom" : "Top";
    },
    setFoldText() {
      return this.isFold ? "收起" : "展开";
    },
  },
  watch: {
    formType(curVal, oldVal) {
      if (curVal !== oldVal) {
        if(this.formType ==='vuln_whitelist'){
          this.titlePlaceholder = '模糊搜索：漏洞大类/IP/域名/漏洞概述'
        }else if(this.formType ==='vuln'){
          this.titlePlaceholder = '模糊搜索：漏洞大类/漏洞ID/漏洞概述'
        }else if(this.formType === 'alarm_whitelist'){
          this.titlePlaceholder = '模糊搜索：上报单位/白名单ID/报备标题';
        }else{
          this.titlePlaceholder = '输入标题'
        }
        this.dictData = [];
        if (this.status.includes(curVal)) {
          this.getDictList(curVal);
        }
        if(this.tabNames.includes(curVal)){
          if(curVal =="security_notice_manage"){
            this.dictData = [
              { label: "待提交", value: 0 },
              { label: "待审核", value: 1 },
              { label: "已审核", value: 2 },
            ]
          }else if(curVal =="compliance_check_feedback"){
            this.dictData = [
              { label: "待反馈", value: 0 },
              { label: "待审核", value: 1 },
              { label: "已完成", value: 2 }
            ]
          }else if(curVal =='compliance_agreement_duty_sign' || curVal == "compliance_agreement_secret_sign"){
            this.dictData = [{ label: '未响应', value: '0' }, { label: '已完成', value: '2' }]
          }else if(curVal == 'knowledge_institution_manage'){
            this.dictData = [
              { label: "待提交", value: 1 },
              { label: "待审核", value: 2 },
              { label: "已审核", value: 3 },
            ]
          }
        }
        this.$refs['searchForm'].resetFields();
        this.isFold = false;
      }
    }
  },
  methods: {
    async getDictList(type) {
      const types = {
        alarm: 'alarm_order_status', // 告警闭环
        vuln: 'vuln_work_status',// 漏洞闭环
        risk: 'risk_work_status',// 风险闭环
      }
      const filterDictData = {
        alarm: ['归档', '无需处置'],
        vuln: ['已归档', '误报'],
        risk: ['已关闭'],
      }
     
      const { data =[] } = await getDictType(types[type]);
      if(!!this.type) {
        if (data && data.length) {
          this.dictData = data.filter(item => {
            const filter = filterDictData[this.formType]
            if (!filter.includes(item.dictLabel)) {
              return item
            }
          })
        }
      } else {
        this.dictData = data || [];
      }
    },
    // 搜索
    onSearchSubmit() {
      let params = Object.assign({pageNum: 1}, this.searchForm);
      if(this.searchForm.commitTime && this.searchForm.commitTime.length === 2){
        params.commitTimeStart = this.searchForm.commitTime[0];
        params.commitTimeEnd = this.searchForm.commitTime[1];
      }else{
        params.commitTimeStart = '';
        params.commitTimeEnd = '';
      }
      delete params.commitTime;
      params.title = params.title?params.title.trim(): '';
      params.committer = params.committer?params.committer.trim(): '';
      this.$emit('search', params);
    },
    // 重置
    resetsearchForm() {
      this.$refs['searchForm'].resetFields();
      let params = Object.assign({pageNum: 1, pageSize: 20}, this.searchForm );
      params.commitTimeStart = '';
      params.commitTimeEnd = '';
      params.title = '';
      params.workStatus = '';
      params.workStatusSign = '';
      params.committer = '';
      this.$emit('search', params);
    },
    onMoreSerach() {
      this.isFold = !this.isFold;
    }
  },
};
</script>


