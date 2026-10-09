<template>
  <div class="fs-page rolling">
    <div class="fs-page-content">
      <div class="fs-container fs-layout-default fs-crud-container">
        <el-row>
          <el-col :span="16">
            <common-use />
          </el-col>
          <el-col :span="8">
            <el-collapse v-model="activeNamesTop" class="top-collapse-table">
              <el-collapse-item name="1">
                  <template #title>
                    <div class="warp-title">
                      <span>安全知识</span>
                      <el-button type="primary" @click.stop="handleMoreSafty" text link>
                        更多<el-icon><DArrowRight /></el-icon>
                      </el-button>
                    </div>
                  </template>
                  <div class="top-table-content" v-loading="manageLoading">
                    <div v-if="manageList.length">
                      <div v-for="(item, index) in manageList" :key="index" class="top-table-content-item">
                        <div class="item-title">
                          <span class="title">【{{ item.moduleLabel }}】</span>
                          <span class="link">
                            <sm-text-tooltip  :link="true" @click="toManageDetail(item)" :content="item.title" />
                          </span>
                        </div>
                        <span class="item-time">{{ item.publishTime }}</span>
                      </div>
                    </div>
                    <div v-else class="no-data">暂无数据</div>
                  </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
        <el-collapse v-if="analysisShow" v-model="activeNamesCenter" class="center-collapse">
          <el-collapse-item name="1" title="统计分析">
            <el-row :gutter="10" v-loading="numLoading">
              <el-col :span="3">
                <div class="wrap-box">
                  <div>
                    <div class="title">攻击沦陷</div>
                    <div class="title-sub">确认失陷资产数</div>
                    <div class="count">{{ attackNumData.success  }}</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="wrap-box">
                  <div>
                    <div class="title">攻击沦陷</div>
                    <div class="title-sub">可能失陷资产数</div>
                    <div class="count">{{ attackNumData.suspected  }}</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="6" v-for="(item,index) in countList" :key="index">
                <div class="wrap-box">
                  <div>
                    <div class="title">{{ item.title }}</div>
                    <div class="title-sub">{{ item.subTitle }}</div>
                    <div class="count">{{ item.doneNum }} / {{ item.total  }}</div>
                  </div>
                  <div>
                    <el-progress
                      type="circle"
                      :percentage="item.percentage"
                      :color="item.color"
                      :stroke-width="10"
                      :width="80"
                    >
                    <template #default="{ percentage }">
                      <p class="percentage-label">{{ item.percentageText }}</p>
                      <p class="percentage-value">{{ percentage }}%</p>
                    </template>
                    </el-progress>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="chart-wrap-box">
              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="content_box" v-loading="lineLoading">
                    <div class="content_title">安全态势趋势</div>
                    <div id="chartLineUuid" class="chart-bg"></div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="content_box" v-loading="pieLoading">
                    <div class="content_title">重大安全事件执行情况</div>
                    <div id="chartPieUuid" class="chart-bg"></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="body">
          <el-collapse v-model="activeNames" class="collapse-table">
            <el-collapse-item name="1">
              <template #title>
                <el-row justify="space-between" class="warp-title">
                  <el-row style="align-items: center">
                    <el-select style="width: 200px" v-model="menuType" @change="handleTabClick">
                      <el-option
                          v-for="(val, key) in {todo: '需我处理', done: '我已处理'}"
                          :key="key" :label="val" :value="key"
                      />
                    </el-select>
                    <el-row class="ml-10" style="align-items: center">
                      <span>模块：</span>
                      <span  @click.stop>
                        <el-radio-group v-model="formType" @change="handleRadioChange">
                          <el-radio-button v-for="radio in radioData" :key="radio.formType" :label="radio.formType">
                            {{radio.formName}}
                            <span v-if="menuType === 'todo' && radio.count" class="radio-tags">
                          <i class="radio-tags-count fx-center">{{radio.count}}</i>
                        </span>
                          </el-radio-button>
                        </el-radio-group>
                      </span>
                    </el-row>
                  </el-row>
                  <el-button type="primary" @click.stop="handleMore" text link>
                    更多<el-icon><DArrowRight /></el-icon>
                  </el-button>
                </el-row>
                </template>
                <table-list 
                    v-loading="loading"
                    :formType="formType"
                    :columns="formType === 'alarm' ? alarmColumns :  tableColumns"
                    :tableData="tableData"
                    :config="tableConfig"
                    :handleConfig="handleConfig"
                    :pageNum="pageParams.pageNum"
                    :pageSize="pageParams.pageSize"
                    ref="tableListRef"
                    @linkToPage="handleLinkTopage"/>
                <sm-pagination
                    :total="total"
                    v-model:page="pageParams.pageNum"
                    v-model:limit="pageParams.pageSize"
                    @paging-change="getTabList('refresh')"
                />
              </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div >
  </div>
  <institution-preview v-if="previewOpen" :open="previewOpen" :id="previewId" :name="previewName" :attList="previewAtt" :perms="'portal'" @close="handleClosePerview"/>
</template>
<script>
import { getTodoTabCount, getTodoDataList, getDoneTabCount, getDoneDataList, getManageList,
  getDeviceNum, getNoticeNum, getSafeNum, getAlarmCount, getAttackNum, getGreatIncident
} from '/@/api/sbp/homepage.js';
import lodash from "lodash-es";
import commonUse from './components/commonUse.vue'
import TableList from './components/TableList.vue'
import { showLoading, hideLoading } from '/@/utils/old/loading.js';
import SmPagination from "/@/components/Pagination";
import InstitutionPreview from '/@/views/stp/knowledge/institution/commonPage/preview.vue';
import router from "/@/router";
import useToolbar from "/@/hooks/web/useToolbar";
import { getMenuIdByPerm, getmenuByPerms, reqDict } from "/@/api/common";
import { SmTextTooltip } from "/@/components/Tooltip";
import { formatNumber } from "/@/utils/util.common";
import echarts from "/@/utils/old/echartsUI";
import { randomString } from "/@/utils/util.common";
const { changeCompact, handleHideSearch } = useToolbar();
export default {
  name: 'operate',
  components: {
    SmPagination,
    commonUse,
    TableList,
    SmTextTooltip,
    InstitutionPreview
  },
  computed: {
    username() {
      return this.$store.state.user.name;
    },
  },
  data() {
    return {
      activeNames: "1",
      activeNamesTop: "1",
      activeNamesCenter: "1",
      manageLoading: false,
      previewOpen: false,
      previewId: null,
      previewName: "",
      previewAtt: [],
      manageList: [],
      menuType: 'todo',
      todoCount: 0,
      basePath: '',
      //分页
      pageParams: {
        pageNum: 1,
        pageSize: 20,
      },
      tableColumns: [
        {
          label: "标题",
          key: "title",
          minWidth: '200px',
          slot: "title",
        },
        {
          label: "工单状态",
          type: 'point',
          key: "workStatus",
          slot: "workStatus",
          width: "150px",
        },
        
        {
          label: "提交人",
          key: "committer",
          width: "200px",
        },
        {
          label: "提交时间",
          key: "commitTime",
          width: "180px",
        },
      ],
      alarmColumns:[],
      total: 0,
      loading: false,
      radioData: [],
      formType: '',
      tableData: [],
      tableConfig: {
        tableHeight: '350px',
        selection: false,
        index: true,
        noDataMsg: '暂无数据'
      },
      // 表格操作列参数
      handleConfig: {
        handleWidth: 140,
        handleShow: true,
      },

      permsPath: '',
      todoPath: '',
      donePath: '',
      attackNumData: {
        suspected: 0,
        success: 0,
      },
      lineOption: {
        legend: { show: false },
        tooltip: { trigger: "axis",
          axisPointer: { type: "cross", crossStyle: { color: "#999"} },
          formatter(res) {
            let obj = res && res.length && res[0] || {};
            let str = obj.data && obj.data.time || "";
            str +='<br> <i style="display: inline-block;width: 10px;height: 10px;background: #FFD54C;margin-right: 5px;}"></i> ' + obj.seriesName + " <span style='padding: 0 0 0 10px;font-weight: bold;'>" + obj.data.value + "</span>";
            return str;
          }
        },
        xAxis: {
          //去掉线头
          axisTick: { show: true }, type: "category", data: [],
          axisLabel: {
            interval: 0, rotate: 30,padding: [20, 0, 0, 0],
            // X轴label长度大于8就用省略号，移动到的时候全显示
            formatter(value) {
              return value;
            }
          }
        },
        yAxis: {
          type: "value", axisLine: { show: false },
          splitLine: { show: true, lineStyle: { type: "dashed" } }
        },
        series: [
          {
            name: "安全事件", data: [], showSymbol: false, type: "line",
            areaStyle: {
              color:   new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0,color:  'rgba(255, 213, 76,0.6)'}, 
                { offset: 1, color: 'rgba(255, 213, 76,0.05)'}
              ]),
            },
            smooth: false, // 平滑曲线
            label: {
              // 顶部文案
              show: false,
              position: "top",
              fontSize: 12
            }
          }
        ],
        grid: { left: "4%",right: "4%",bottom: "4%",containLabel: true },
        color: '#FFD54C'
      },
      lineLoading: false,
      chartPieUuid:  randomString(18),
      pieLoading: false,
      pieOption: {
        tooltip: {
          trigger: "item",
          formatter:  (val)=> {
            return (
             '<i style="display: inline-block;width: 10px;height: 10px;background: ' +
                val.color +';margin-right: 5px;border-radius: 50%;}"></i> ' + val.data.name +
                " : " +val.data.value +" (" +val.percent +"%)");
          }
        },
        legend:{
          orient: "vertical", right: "5%",  top: "20%", itemWidth: 10, itemHeight: 10,
          textStyle: { color: "#333", fontSize: 12 },
          formatter: (name)=> {
            let data = [...this.pieOption.series[0].data,...this.pieOption.series[1].data];
            let tarValue;
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                tarValue = data[i].value;
              }
            }
            return `${name}：${tarValue}`;
          }
        },
        series: [
          {
            data: [], type: "pie", center: ["35%", "50%"],
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0,shadowColor: "rgba(0, 0, 0, 0.5)"},
            },
            label: {
              formatter:  (val) =>{
                return ( "" +(val.data.name.length > 6? val.data.name.substr(0, 6) + "..."
                    : val.data.name) +" : " + val.data.value + " (" + val.percent +"%)");
              }
            }, 
            radius: ["60%", "50%"],
            color: ["#b8ea8f","#ffa39e"]
          },
          {
            data: [], type: "pie", center: ["35%", "50%"],
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0,shadowColor: "rgba(0, 0, 0, 0.5)"},
            },
            label: {
              formatter:  (val) =>{
                return ( "" +(val.data.name.length > 6? val.data.name.substr(0, 6) + "..."
                    : val.data.name) +" : " + val.data.value + " (" + val.percent +"%)");
              }
            },
            radius: ["30%", "40%"],
            color: ["#395d1e","#558d2b","#8c5d5a","#5b1610"]
          },
        ],
      },
      countList: [
        { title: "防守态势", subTitle: "安全设备 在线数/总数", percentageText: "在线率", percentage: 0,doneNum: 0, total: 0, color: "#FFC836"},
        { title: "安全绩效", subTitle: "安全通报 完成数/总数",  percentageText: "完成率",  percentage: 0, total: 0,doneNum: 0, color: "#19BE6B"},
        {title: "安全通报", subTitle: "安全事件 完成数/总数", percentageText: "完成率",  percentage: 0, total: 0,doneNum: 0,  color: "#267EE5"},
      ],
      numLoading: false,
      analysisShow: false
    }
  },
  created() {
    this.initAlarmColumns()
    this.permsPath = '';
    reqDict('menu_open_close').then((data) => {
      this.analysisShow = data[0].remark ? JSON.parse(data[0].remark).open : false;
      if(this.analysisShow) {
        this.getNumFun();
        this.getLineData();
        this.getPieData();
      }
    })
    this.findPath(this.permission_allMenus,'personal:wait');
    if(this.permsPath){
      this.todoPath = this.permsPath;
    }
    this.permsPath = '';
    this.findPath(this.permission_allMenus,'personal:done');
    if(this.permsPath){
      this.donePath = this.permsPath;
      if(!this.todoPath){
        this.menuType = 'done'
      }
    }
    this.getTabList();
    this.getManageListFun();
    
  },
  methods: {
    changeCompact, handleHideSearch,
    findPath(menus, perms) {
      if(menus && menus.length){
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].perms == perms) {
            this.permsPath =  menus[i].path;
          } else {
            if (menus[i].children) {
              this.findPath(menus[i].children, perms);
            }
          }
        }
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
    async getTabList(refresh) {
      showLoading()
      try {
        if (this.menuType === 'todo' ) {
          const { data = [] } = await getTodoTabCount();
          this.radioData = data || [];
          this.todoCount = this.radioData.reduce((total, current) => ((current.count + Number(total))), 0);
        } else {
          if(this.donePath){
            const { data = [] } = await getDoneTabCount()
            this.radioData = data || []
          }
        }
        if (this.radioData.length) {
          this.formType = !!refresh ? this.formType : this.radioData[0].formType
          this.basePath = !!refresh ? this.basePath : this.radioData[0].path
          this.getTableList();
        }
      } finally {
        hideLoading();
      }
    },
    async getTableList() {
      const params = {
        formType: this.formType,
        ...this.pageParams,
      };
      this.loading = true;
      const {data = {}} = (this.menuType === 'todo') ? await getTodoDataList(params) : await getDoneDataList(params);
      this.tableData = data.list || []
      this.total = data.total || 0;
      this.loading = false;
    },
    handleSearch(params) {
      this.searchParams = {...params}
      this.getTableList()
    },
    handleTabClick() {
      this.handleResetParams();
      this.getTabList(true);
    },
    handleRadioChange() {
      this.$nextTick(()=>{
        this.$refs.tableListRef.refreshColumns()
      })
      this.handleResetParams();
      const radio = lodash.find(this.radioData, (o) => (o.formType === this.formType));
      this.basePath = radio.path || ''
      this.getTableList();
    },
    handleCurrentChange(pageNum) {
      this.pageParams.pageNum = pageNum;
      this.getTableList();
    },
    handleLinkTopage(row) {
      if (row.id) {
        let path = this.basePath, active, status, code, organizationId, auditType;
        if(this.formType === 'asset_modify' || this.formType === 'alarm_whitelist') {
          active = this.menuType === 'todo' ? '0' : '1'
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
          status = row.workStatusSign;
          auditType = this.menuType === 'todo'? "waitAudit" : row.workStatusSign == 2?"doneAudit": "waitAudit";
        }else if(this.formType === 'compliance_check_feedback'){
          let listTitle = [
            { label: "待反馈", tbaName: "TO_BE_FEED" },
            { label: "待审核", tbaName: "TO_BE_EXAMINE" },
            { label: "已完成", tbaName: "DONE" }
          ]
          status = (lodash.find(listTitle, {label: row.workStatus})|| {}).tbaName || 'ALL';
        }else if(this.formType =="compliance_agreement_duty_sign" ||this.formType =="compliance_agreement_secret_sign" ){
          active = this.menuType === 'todo' ? 'wait' : 'done'
        }else if(this.formType =="knowledge_institution_manage"){
          let listTitle = [
            { label: 1, tbaName: "wait" },
            { label: 2, tbaName: "wait" },
            { label: 3, tbaName: "done" }
          ]
          active = (lodash.find(listTitle, {label: row.workStatusSign})|| {}).tbaName || 'wait';
          status = row.workStatusSign;
        }
        const url = router.resolve({ path, query: { id: row.id, active, status, code, organizationId, auditType } });
        window.open(url.href, "_blank");
      }
    },
    handleMore() {
      router.push({
        path: `/sbp/${this.menuType}`,
        query: { type: this.formType}
      })
    },
    handleResetParams() {
      this.pageParams.pageNum = 1;
      this.total = 0;
      this.tableData = [];
    },
    // 跳转到安全知识页面
    handleMoreSafty(){
      getmenuByPerms({ perms: "institution:portal" }).then((res) => {
        getMenuIdByPerm({ perms: "institution:portal" }).then(data => {
          const url = router.resolve({ path: data.path });
          window.open(url.href, "_blank")
        })
      })
    },
    // 获取安全知识列表
    getManageListFun(){
      this.manageLoading = true;
      let params = {
        pageSize: 5,
        pageNum: 1
      }
      getManageList(params).then((data) =>{
        this.manageList = data;
        this.manageLoading = false;
      })
    },
    toManageDetail(row){
      this.previewId = row.id;
      this.previewName = row.title;
      this.previewAtt = row.attList || [];
      this.previewOpen = true;
    },
    handleClosePerview() {
      this.previewId = "";
      this.previewName = "";
      this.previewOpen = false;
      this.previewAtt = [];
    },
    getNumFun(){
      this.numLoading = true;
      Promise.all([getDeviceNum(),getNoticeNum(),getSafeNum(), getAttackNum()]).then((res) =>{
        this.countList.forEach((item,index) => {
          let data = res[index] || {};
          for (var key in data) {
            if(key == 'up' ||key == 'doneNum'){
              item['doneNum'] = data[key]? formatNumber(data[key],0, ".", ",", false):  0;
            }
            if(key == 'totalNum'||key == 'total'){
              item['total'] = data[key]? formatNumber(data[key],0, ".", ",", false):  0;
            }
          }
          item.percentage = data['percentage']? Number(data['percentage'].split("%")[0]) : 0;
        })
        for (var key in this.attackNumData) {
          this.attackNumData[key] = res[3][key]?formatNumber(res[3][key],0, ".", ",", false) : 0
        }
        this.numLoading = false;
      })
    },
    getLineData(){
      this.lineLoading = true;
      getAlarmCount().then(data =>{
        if(data && data.length){
          data.forEach((item, index) => {
            const obj = {
              name: item.time,
              value: item.count,
              time: item.value,
            };
            this.lineOption.xAxis.data[index] = item.time;
            this.lineOption.series[0].data[index] = obj;
          })
        }
        let chartDom = document.getElementById('chartLineUuid');
        echarts.init(chartDom).dispose();
        let myChart = echarts.init(chartDom);
        myChart.setOption( this.lineOption);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
        this.lineLoading = false;
      })
    },
    // 获取饼图
    getPieData(){
      this.pieLoading = true;
      getGreatIncident().then(data =>{
        const { first= [], second= [] } = data;
        this.pieOption.series[0].data = first.map((item, index) => {
          const obj = { name: item.name,value: item.count };
          return obj
        })
        this.pieOption.series[1].data = second.map((item, index) => {
          const obj = { name: item.name,value: item.count };
          return obj
        })
        this.$nextTick(() =>{
          let chartDomPie = document.getElementById('chartPieUuid');
          echarts.init(chartDomPie).dispose();
          let pieChart = echarts.init(chartDomPie);
          pieChart.setOption(this.pieOption);
          window.addEventListener("resize", function () {
            pieChart.resize();
          });
        })
        this.pieLoading = false
      })
    },
   
  }
}
</script>
<style lang="less" scoped>
:deep(.collapse-table){
  margin-top: 10px;
  .el-collapse-item__header{
    padding: 5px 0 5px 10px;
    height: auto;
    text-indent: 0%;
    .el-radio-button__inner{
      padding: 8px 20px;
      display: inline;
    }
  }
  .warp-title{
    width: 100%;
  }
  .el-collapse-item__content{
    padding-bottom: 50px;
    // height: 350px;
    height: calc(100vh - 470px);
    .el-table{
      margin-bottom: 10px;
    }
  }
}
:deep(.top-collapse-table){
  margin: 10px 10px 10px 0;
  .warp-title{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .top-table-content{
    height: 210px;
    .top-table-content-item{
      width: 100%;
      font-size: 14px;
      height: 42px;
      line-height: 42px;
      border-bottom: solid 1px var(--el-border-color);
      display: flex;
      .item-title{
        width: calc(100% - 100px);
        .title{
          width: 84px;
          display: inline-block;
        }
        .link{
          display: inline-block;
          width: calc(100% - 84px);
        }
      }
      .item-time{
        width: 100px;
      }
    }
    .no-data{
      text-align: center;
      font-size: 16px;
      line-height: 200px;
    }
  }
}
:deep(.center-collapse){
  margin:0  10px;
  .wrap-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90px;
    border: 1px solid var(--el-border-color);
    font-weight: 500;
    padding: 10px;
    .title{
      font-size: 16px;
    }
    .title-sub{
      font-size: 14px;
    }
    .count{
      font-size: 20px;
    }
    .el-progress{
      margin-top: 5px;
    }
  }
  .chart-wrap-box{
    margin-top: 10px;
    height: 300px;
    .el-row{
      height: 300px;
    }
    .content_box{
      width: 100%;
      height: 100%;
      border: 1px solid var(--el-border-color);
      .content_title {
        padding:0  16px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid var(--el-border-color);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        font-weight: 500;
        font-size: 16px;
        color: #515a6e;
      }
      .chart-bg {
        width: 100%;
        height: calc(100% - 40px);
        padding: 0 20px;
      }
    }
  }
}
.homepage-operate-page {
  height: 100%;
  overflow-y: auto;
  .operate-card {
    width: 99%;
    &.common-operate {
      height: auto;
      flex-shrink: 0;
      margin-bottom: 16px;
    }
    &.operate-content {
      flex: 1;
      height: 100%;
      padding: 6px 16px;
      margin-bottom: 8px;
    }
  }

  .el-tabs__item {
    user-select: none;
    outline: none;
  }
}
.position-fixed {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.handleMoreClass{
  position: sticky;
  top: 0;
  padding: 5px;
  color: var(--el-color-primary)
}
.fx-m-between {
  display: flex;
  justify-content: space-between;
}
.radio-tags {
  position: relative;
  .radio-tags-count {
    position: absolute;
    top: -12px;
    left: -3px;
    height: 14px;
    padding: 2px 5px;
    color: #fff;
    font-size: 12px;
    background: #e11515;
    border-radius: 10px;
    z-index: 999;
  }
}
// 子元素行排列，水平垂直居中
.fx-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
