<template>
  <div class="fs-page">
    <div class="fs-page-content">
      <div class="fs-container fs-layout-default fs-crud-container">
        <div class="box">
          <div class="inner">
            <div class="header">
              <div class="fs-crud-header">
                <div class="fs-header-top">
                  <el-tabs type="card" v-model="formType" @tab-change="handleClick">
                    <el-tab-pane v-for="tab in tabData" :key="tab.formType" :label="`${tab.formName + ' ' + tab.count}`" :name="tab.formType"/>
                  </el-tabs>
                </div>
                <div class="fs-crud-search">
                  <searchForm :formType="formType" type="todo" @search="handleSearch"/>
                </div>
                <div class="fs-crud-actionbar">
                  <div class="sm-table-title">{{listTitle}}</div>
                </div>
                <div class="fs-crud-toolbar">
                  <div class="fs-toolbar">
                    <el-button icon="Refresh" @click="getTabList('refresh')" type="primary" circle />
                    <el-button icon="Search" @click="handleHideSearch" type="primary" circle />
                    <el-button @click="changeCompact" icon="Rank" circle />
                  </div>
                </div>
            </div>
          </div>
        <div class="body">
          <table-list
              v-loading="loading"
              :formType="formType"
              :columns="formType === 'alarm' ? alarmColumns :  tableColumns"
              :tableData="tableData"
              :config="tableConfig"
              :handleConfig="handleConfig"
              :pageNum="searchParams.pageNum"
              ref="tableListRef"
              :pageSize="searchParams.pageSize"/>
        </div>
        <div class="footer">
          <div class="fs-crud-footer">
            <sm-pagination
                :total="total"
                v-model:page="searchParams.pageNum"
                v-model:limit="searchParams.pageSize"
                @paging-change="getTableList"
            />
          </div>
        </div>
    </div>
  </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTodoTabCount, getTodoDataList } from '/@/api/sbp/homepage.js'
import lodash from "lodash-es";
const { changeCompact, handleHideSearch } = useToolbar();
import TableList from './components/TableList.vue'
import searchForm from "./components/SearchForm.vue";
import SmPagination from "/@/components/Pagination";
import { showLoading, hideLoading } from '/@/utils/old/loading.js';
import useToolbar from "/@/hooks/web/useToolbar";
import router from "/@/router";
export default {
  name: "sbp-home-todo",
  components: {
    searchForm,
    TableList,
    SmPagination,
  },
  data() {
    return {
      formType: '',
      basePath: '',
      loading: false,
      total: 0,
      tabData: [],
      tableData: [],
      dictData: [],
      noPerssion: false,
      searchParams: {
        pageNum: 1,
        pageSize: 20,
      },
      tableColumns: [
        {
          label: "标题",
          key: "title",
          minWidth: '200px',
          disabled: 'disabled',
        },
        {
          label: "工单状态",
          key: "workStatus",
          slot: "workStatus",
          width: "180px",
        },
       
        {
          label: "提交人",
          key: "committer",
          width: "200px",
        },
        {
          label: "提交时间",
          key:"commitTime",
          width: "200px",
        }
      ],
      alarmColumns:[],
      tableConfig: {
        tableHeight: 380,
        selection: false,
        index: true,
        noDataMsg: '暂无数据'
      },
      // 表格操作列参数
      handleConfig: {
        handleWidth: 140,
        handleShow: true,
        hasView: true,
        handleView: this.handleView,
      },
    }
  },
 
  created () {
    this.initAlarmColumns()
    this.tableConfig.tableHeight = window.innerHeight - 380;
  },
  computed: {
    listTitle() {
      const routeName = this.$route.meta.title || '需我处理'
      const tabData = lodash.find(this.tabData, (o) => (o.formType === this.formType))
      const tabLabel = (tabData && tabData.formName) || ''
      return `${tabLabel} - ${routeName}列表（${this.total}）`
    },
    username() {
      return this.$store.state.user.name;
    }
  },
  mounted() {
    const { type = '' } = this.$route.query;
    this.formType = type;
    this.getTabList(!!type);
    this.$nextTick(() => {
      this.tableConfig.tableHeight = window.innerHeight - 310;
    });
  },
  methods: {
    changeCompact,
    handleHideSearch,
    async getTabList(refresh) {
      showLoading()
      try {
        const { data = [] } = await getTodoTabCount()
        this.tabData = data || []
        if (this.tabData.length === 0) {
          this.noPerssion = true;
        } else {
          this.formType = !!refresh ? this.formType : this.tabData[0].formType
          const formTypeData = lodash.find(this.tabData, (o) => (o.formType === this.formType));
          this.basePath = formTypeData.path || ''
          this.getTableList();
        }
      } finally {
        hideLoading()
      }
    },
    initAlarmColumns() {
      this.alarmColumns = lodash.cloneDeep(this.tableColumns)
      this.alarmColumns.splice(1,0, {
          label: "告警级别",
          type: "point",
          key: "levelLabel",
          slot: "levelLabel",
          width: "150px"
        },
        {
          label: "攻击结果",
          type: "point",
          key: "attackResultLabel",
          slot: "attackResultLabel",
          width: "150px"
        },
        {
          label: "指派人",
          key: "assignedPerson",
          slot: "assignedPerson",
          width: "200px"
        },
        {
          label: "受害IP/URL归属信息",
          key: "victimizedAscription",
          slot: "victimizedAscription",
          width: "200px"
        })
    },
    async getTableList() {
      this.loading = true;
      const { data = {} } = this.formType && await getTodoDataList({
        formType: this.formType,
        ...this.searchParams
      })
      this.tableData = data.list || []
      this.total = data.total || 0
      this.loading = false;
    },
    handleView(row) {
      if (row.id) {
        let path = this.basePath, active, status, code, organizationId, auditType;
        if(this.formType === 'asset_modify' || this.formType === 'alarm_whitelist') {
          active = '0'
        }else if(this.formType ==='vuln_whitelist'){
          // 加上工单状态 跳转漏洞白名单 待审核直接打开审核页面 已完成打开详情页面
          status = row.workStatusSign
        }else if(this.formType ==='vuln'){
          const closepermsList = [
            {category:'1',code:'HOST'}, // 主机漏洞
            {category:'2',code:'WEB'}, // web漏洞
            {category:'3',code:'CODE'} // 弱口令
          ]
          code = (lodash.find(closepermsList, {category: row.category})|| {}).code || 'HOST';
          path += "/stp/vuln/loop";
        } else if (this.formType === "alarm") {
          organizationId = 100;
        }else if(this.formType === 'security_notice_manage'){
          auditType = "waitAudit";
        }else if(this.formType === 'compliance_check_feedback'){
          let listTitle = [
            { label: "待反馈", tbaName: "TO_BE_FEED" },
            { label: "待审核", tbaName: "TO_BE_EXAMINE" },
            { label: "已完成", tbaName: "DONE" }
          ]
          status = (lodash.find(listTitle, {label: row.workStatus})|| {}).tbaName || 'ALL';
        }else if(this.formType =="compliance_agreement_duty_sign" ||this.formType =="compliance_agreement_secret_sign" ){
          active =  'wait';
        }else if(this.formType =="knowledge_institution_manage"){
          let listTitle = [
            { label: 1, tbaName: "wait" },
            { label: 2, tbaName: "wait" },
            { label: 3, tbaName: "done" }
          ]
          active = (lodash.find(listTitle, {label: row.workStatusSign})|| {}).tbaName || 'wait';
          status = row.workStatusSign;
        }
        const url = router.resolve({ path, query: { id: row.id, active, status, code, organizationId } });
        window.open(url.href, "_blank")
      }
    },
    handleSearch(params) {
      this.searchParams = {
        ...this.searchParams,
        ...params
      }
      this.getTableList()
    },
    handleClick() {
      this.$nextTick(()=>{
        this.$refs.tableListRef.refreshColumns()
      })
      const radio = lodash.find(this.tabData, (o) => (o.formType === this.formType));
      this.basePath = radio.path || ''
      this.handleResetParams();
      this.getTableList();
    },
    handleResetParams() {
      this.searchParams = {
        pageNum: 1,
        pageSize: 20,
      }
      this.tableData = [];
      this.total = 0;
    }
  }
}
</script>
<style lang="less" scoped>

</style>

