<template>
  <el-dialog
    v-if="open"
    :model-value="open"
    width="800px"
    custom-class="szcScreen_new_dialog_common"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :modal-append-to-body="false"
  >
    <template #title>
      <div  class="dialog_title">漏洞概览</div>
    </template>
    <img
      class="close_btn"
      @click="handleClose"
      :src="util.getAssetsImages('szc_screen/dialog_close.png')"
    />
    <div class="flex-box bottom-left"></div>
    <div class="flex-box bottom-right"></div>
    <div class="dialog-wrap-content">
      <el-tabs v-model="tab_status"  class="drawer-tabs" @tab-click="handleTabChange">
        <el-tab-pane label="统计概览" name="sunDetail">
          <el-row :gutter="16" class="sum-box">
            <el-col :span="4">
              <p class="title">漏洞工单总数</p>
              <p class="num mt-8">{{ loopSum.all }}</p>
            </el-col>
            <el-col :span="4" class="canClick" @click="handleToPath('complete')">
              <p class="title">已修复</p>
              <p class="num mt-8">{{ loopSum.complete }}</p>
            </el-col>
            <el-col :span="4" class="canClick" @click="handleToPath('noComplete')">
              <p class="title">未修复</p>
              <p class="num mt-8">{{ loopSum.noComplete }}</p>
            </el-col>
            <el-col :span="4" class="canClick" @click="handleToPath('noCompleteHigh')">
              <p class="title">未修复中高风险</p>
              <p class="num mt-8">{{ loopSum.noCompleteHigh }}</p>
            </el-col>
            <el-col :span="4">
              <p class="title">逾期修复率</p>
              <p class="num mt-8">{{ loopSum.repair }}</p>
            </el-col>
            <el-col :span="4" class="canClick" @click="handleToPath('noPush')">
              <p class="title">待推送</p>
              <p class="num mt-8">{{ loopSum.noPush }}</p>
            </el-col>
          </el-row>
          <div class="chart_title">
            <img :src="util.getAssetsImages('szc_screen/dialog_title_line.png')"/>
            <span>漏洞等级分布</span>
            <img :src="util.getAssetsImages('szc_screen/dialog_title_line.png')"/>
          </div>
          <div class="chart-content">
            <chartPie
              :data="leveList"
              ref="chartLine1"
              status="vulnLevel"
              @chartPieClick="chartPieClick"
            />
          </div>
          <div class="chart_title">
            <img :src="util.getAssetsImages('szc_screen/dialog_title_line.png')"/>
            <span>漏洞工单状态分布</span>
            <img :src="util.getAssetsImages('szc_screen/dialog_title_line.png')"/>
          </div>
          <div class="chart-content">
            <chartPie
              :data="orderList"
              ref="chartLine2"
              status="vulnOrder"
              @chartPieClick="chartPieClick"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="未修复中高风险漏洞" name="info">
          <div class="table-box">
            <el-table
              v-loading="vulnLoading"
              class="mb-10"
              :class="vulnLoading?'empty-loading':''"
              element-loading-background="transparent"
              :data="loopList"
              stripe
              :height="500"
              style="width: 100%;"
              @row-click="rowClick"
            >
              <el-table-column prop="code"  label="漏洞ID" :show-overflow-tooltip="true" align="left"  width="140"></el-table-column>
              <el-table-column prop="categoryLabel" :show-overflow-tooltip="true" label="漏洞大类"  width="90" align="left"></el-table-column>
              <el-table-column prop="ip" width="130" :show-overflow-tooltip="true" align="left" label="IP/域名"></el-table-column>
              <el-table-column prop="description" :show-overflow-tooltip="true" width="180" align="left" label="漏洞概述"></el-table-column>
              <el-table-column width="90"  align="left"  label="漏洞等级">
                <template #default=" { row } ">
                  <el-tag  class="level" :class="`level${row.level}`">{{ row.level_label}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="vuln_type" :show-overflow-tooltip="true"  width="110" align="left" label="漏洞类型"></el-table-column>
              <el-table-column prop="create_time" :show-overflow-tooltip="true" width="160" align="left" label="提交时间"></el-table-column>
              <el-table-column prop="work_order_state_label" width="80" align="left" label="工单状态"></el-table-column>
            </el-table>
            <sm-pagination
              :total="total"
              v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize"
              popperClass="szc_screen_pagination"
              @paging-change="getTableData"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
import { reqAssetData } from "/@/api/scp/szcScreen";
import chartPie from "../chartPie.vue";
import { getmenuByPerms } from "/@/api/common";
import util from '/@/utils';
import SmPagination from "/@/components/Pagination";

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    loopSum: {
      type: Object,
      default: ()=>{}
    },
    paramsJson: {
      type: Object,
      default: ()=>{}
    },
  },
  components: {chartPie, SmPagination},
  data() {
    return {
      util,
      tab_status: 'sunDetail',
      leveList: {},
      orderList: {},
      hasPath: '',
      queryParams: { pageNum: 1, pageSize: 20 },
      total: 0,
      loopList: [],
      vulnLoading: false,
      closepermsList: [
        {name:'host',perms:'vuln:loop:host',category:'1',path:'/stp/vuln/loop'},
        {name:'web',perms:'vuln:loop:web',category:'2',path:'/stp/vuln/loop'},
        {name:'code',perms:'vuln:loop:code',category:'3',path:'/stp/vuln/loop'}
      ]
    };
  },
  created() {
    const paramJson = {
      ...this.paramsJson,
    };
    const levelPrams = {
      id: "202306121122206150010",
      paramJson: JSON.stringify(paramJson),
    }
    reqAssetData(levelPrams).then(({ data = {} }) => {
      this.leveList = data;
    })
    const orderPrams = {
      id: "202306121122315080011",
      paramJson: JSON.stringify(paramJson),
    }
    reqAssetData(orderPrams).then(({ data = {} }) => {
      this.orderList = data;
    })
  },
  mounted() {

  },
  beforeDestroy() {},
  watch: {

  },
  computed: {

  },
  methods: {
    handleClose() {
      this.$emit("closeDetail");
    },
    // 切换tab
    handleTabChange(tab,event){
      if(tab.paneName == 'info'){
        this.getTableData()
      }
    },
    chartPieClick(data, trigger){
      this.hasPath = '';
      let params = {
        pushTime: `${this.paramsJson.dateStart},${this.paramsJson.dateEnd}`,
      }
      let path = '/stp/vuln/loop';
      let perms = 'vuln:loop:host';
      if(trigger == 'vulnLevel'){
        path =`/stp/vuln/loop`
        params.levels = data.paramsValue;
        params.code = 'HOST';
        params.deptPath = '100';
      }else if(trigger == 'vulnOrder'){
        if(data.paramsValue == '0'){
          // 待推送 跳转到漏洞发现
          perms = 'vuln:host';
          path ='/stp/vuln/all'
          params.deptPath = '100';
          params.status = '0';
        }else{
          perms = 'vuln:loop:host';
          path = `/stp/vuln/loop`
          params.workOrderStateList = data.paramsValue;
          params.code = 'HOST';
          params.deptPath = '100';
        }
      }
      getmenuByPerms({ perms: perms }).then((res) => {
        if (res && res.code == 200) {
          const routeUrl = this.$router.resolve({
            path: path,
            query: params,
          });
          window.open(routeUrl.href)
        }
      })
    },
    handleToPath(trigger){
      this.$emit('handleToPath',trigger)
    },
    // 获取列表数据
    getTableData(){
      this.vulnLoading = true;
      const paramJson = {
        ...this.paramsJson,
        ...this.queryParams,
        pageStart:  (this.queryParams.pageNum - 1 ) * this.queryParams.pageSize,
      }
      const params = {
        id: "202306121122139410009",
        paramJson: JSON.stringify(paramJson),
      };
      reqAssetData(params).then(({ data = {} }) => {
        const { resultData = [] } = data;
        resultData.forEach((item) => {
          for (let key in item) {
            item[key] = item[key] || "-";
          }
        });
        this.loopList = resultData;
        this.vulnLoading = false;
      });
      const paramsTotal = {
        id: "202306161349154340012",
        paramJson: JSON.stringify(paramJson),
      };
      reqAssetData(paramsTotal).then(({ data = {} }) => {
        const { resultData = [] } = data;
        if(resultData && resultData.length){
          this.total = resultData[0].count;
        }
      });
    },
    // 点击某一行
    rowClick(row){
      this.$emit('rowClick',row);
    }

  },
};
</script>

<style lang="less" scoped>
.dialog-wrap-content{
  padding: 0 16px 16px !important;
  height: 630px !important;
  color: #F2F2F2;
  :deep(.drawer-tabs){
    .el-tabs__item {
      color: #F2F2F2;
      &.is-active {
        color: #00FFFF;
      }
    }
    .el-tabs__active-bar{
      background:linear-gradient(244deg,rgba(255,255,255,0) 0%, #00FFFF 50%,rgba(255,255,255,0) 100%);
    }
    .el-tabs__nav-wrap::after{
      background-color: #364863;
      height: 1px;
    }

  }
  .sum-box{
    text-align: center;
    .title{
      color: #00FFFF;
    }
  }
  .chart_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #00FFFF;
    font-size: 14px;
    font-weight: 500;
    margin: 20px 0;
    img {
      width: 40%;
      &:last-child {
        transform: rotateY(180deg);
      }
    }
  }

  .canClick{
    cursor: pointer;
  }
  .chart-content{
    height: 180px;
    .chart-bg{
      height: 180px;
      width: 100%;
    }
  }
}
.table-box{
  background-color: transparent;
  :deep(.el-table) {
    background-color: transparent;
    &::before{
      height: 0px;
    }
    .el-table__inner-wrapper::before{
      height: 0px;
    }
    .el-table__header-wrapper {
      background-color: transparent;
      border-bottom: 1px solid rgba(128,255,255,.4);
      .el-table__header {
        background-color: transparent;
        thead {
          background-color: transparent;
          tr {
            background-color: transparent;
            th ,  th.is-leaf{
              font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
              font-weight: 400;
              font-style: normal;
              color: #00FFFF;
              padding: 0 !important;
              height: 32px !important;
              font-size: 13px;
              line-height: 32px;
              background-color: transparent!important;
              border:none
            }

          }
        }
      }
    }
    .el-table__body-wrapper{
      background-color: transparent;
      min-height: 267px;
      .el-scrollbar__thumb{
        background-color: rgba(128, 255, 255, 1);
        border-radius: 3px;
      }

      tr{
        background-color: transparent;
        &:nth-child(2n+1){
          background-color: rgba(128, 255, 255, 0.09)!important;
        }
        td{
          background-color: transparent;
          border: none;
          font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
          font-weight: 400;
          font-style: normal;
          color: #BDDBFF;
          padding: 0;
          height: 40px;
          font-size: 13px;
          line-height: 40px;
          .level {
            line-height: 18px !important;
            padding: 2px 8px;
            border-radius: 12px !important;
            color: #f2f2f2;
            &.level3 {
              border: 1px solid rgba(207, 19, 34, 0.8);
              background: rgba(207, 19, 34, 0.2);
            }
            &.level2 {
              border: 1px solid rgba(255, 200, 54, 0.8);
              background: rgba(255, 200, 54, 0.2);
            }
            &.level1 {
              border: 1px solid rgba(194, 128, 255, 0.8);
              background: rgba(194, 128, 255, 0.2);
            }
            &.level0 {
              border: 1px solid rgba(0, 235, 125, 0.8);
              background: rgba(0, 235, 125, 0.2);
            }
          }

        }
      }

    }

    &.empty-loading{
      .el-table__empty-block{
        display: none;
      }
      .el-loading-spinner .path {
        stroke: #57f4fd;
      }
    }
  }
  :deep( .el-pagination){
    background-color: transparent;
    justify-content: flex-end;
    &.is-background{
      .el-pager li:not(.disabled):hover{
        color: #80ffff;
      }
      .el-pager li:not(.disabled).is-active{
        background-color: rgba(128, 255, 255, 0.21)!important;
        color: #80ffff;
      }
    }
    .el-pagination__total,.el-pagination__jump{
      color: #fff;
    }
    .el-pager li{
      background-color: rgba(128, 255, 255, 0.09);
      color: #fff;
    }
    .btn-prev,.btn-next{
      background-color: rgba(128, 255, 255, 0.09);
    }
    .el-input__inner,.el-input__wrapper{
      background-color: rgba(128, 255, 255, 0.09)!important;
      color: #fff;
    }
    .el-input__suffix{
      background-color: rgba(128, 255, 255, 0.09)!important;
    }
    .el-input__wrapper{
      padding: 0;
      box-shadow: none;
      border:1px solid #80ffff !important;
    }
    .el-select__caret,.el-icon{
      color: #80ffff;
    }
    .el-input__suffix-inner>:first-child{
      margin: 0 8px;
    }
  }
}
</style>
