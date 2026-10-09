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
      <div  class="dialog_title">集权系统被攻击情况</div>
    </template>
    <img
      class="close_btn"
      @click="handleClose"
      :src="util.getAssetsImages('szc_screen/dialog_close.png')"
    />
    <div class="flex-box bottom-left"></div>
    <div class="flex-box bottom-right"></div>
    <div class="dialog-wrap-content">
      <el-row :gutter="16" class="sum-box">
        <el-col :span="8">
          <p class="title">集权系统被攻击告警总数</p>
          <p class="num mt-8">{{ alarmSun.all }}</p>
        </el-col>
        <el-col :span="8">
          <p class="title">已完成</p>
          <p class="num mt-8">{{ alarmSun.complete }}</p>
        </el-col>
        <el-col :span="8">
          <p class="title">未完成</p>
          <p class="num mt-8">{{ alarmSun.noComplete }}</p>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table
          v-loading="alarmLoading"
          class="mb-10"
          :class="alarmLoading?'empty-loading':''"
          element-loading-background="transparent"
          :data="alarmList"
          stripe
          :height="380"
          style="width: 100%;"
          @row-click="rowClick"
        >
          <el-table-column prop="alarmId"  label="告警ID" :show-overflow-tooltip="true" align="left"  width="130"></el-table-column>
          <el-table-column prop="title" label="告警标题" :show-overflow-tooltip="true" width="200" align="left"></el-table-column>
          <el-table-column prop="attackIp" width="130" :show-overflow-tooltip="true" align="left" label="攻击IP"></el-table-column>
          <el-table-column prop="victimizedIp" :show-overflow-tooltip="true" width="130" align="left" label="受害IP/URL"></el-table-column>
          <el-table-column width="90"  align="left"  label="告警级别" :show-overflow-tooltip="true">
            <template #default=" { row } ">
              <el-tag  class="level" :class="`level${row.level}`">{{ row.levelLabel}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="100"  align="left"  label="攻击结果" :show-overflow-tooltip="true">
            <template #default=" { row } ">
              <el-tag  class="level" :class="getResultClass(row)">{{ row.attackResultLabel}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="attackMeans" :show-overflow-tooltip="true" width="130" align="left" label="攻击手段"></el-table-column>
          <el-table-column prop="createTime"  width="160" align="left" label="提交时间"></el-table-column>
          <el-table-column prop="orderStatus" width="80" align="left" label="工单状态"></el-table-column>
        </el-table>
        <sm-pagination
          :total="total"
          popperClass="szc_screen_pagination"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @paging-change="getTableData"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { reqAssetData  } from "/@/api/scp/szcScreen";
import SmPagination from "/@/components/Pagination";
import chartPie from "../chartPie.vue";
import util from '/@/utils';
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
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
      alarmList: [],
      alarmLoading: false,
      alarmSun: {
        all: 0,
        complete: 0,
        noComplete: 0
      }
    };
  },
  created() {
    this.getTableData()
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
    // 获取列表数据
    getTableData(){
      this.alarmLoading = true;
      const paramJson = {
        ...this.paramsJson,
        ...this.queryParams,
        pageStart:  (this.queryParams.pageNum - 1 ) * this.queryParams.pageSize,
      }
      const params = {
        id: "202306121121145710007",
        paramJson: JSON.stringify(paramJson),
      };
      reqAssetData(params).then(({ data = {} }) => {
        const { resultData = [] } = data;
        resultData.forEach((item) => {
          for (let key in item) {
            item[key] = item[key] || "-";
          }
        });
        this.alarmList = resultData;
        this.alarmLoading = false;
      });
      const paramsTotal = {
        id: "202306121121031730006",
        paramJson: JSON.stringify(paramJson),
      };
      reqAssetData(paramsTotal).then(({ data = {} }) => {
        const { resultData = [] } = data;
        if(resultData && resultData.length){
          this.total = resultData[0].allCount;
          this.alarmSun.all = resultData[0].allCount;
          this.alarmSun.complete = resultData[0].doneCount;
          this.alarmSun.noComplete = resultData[0].undoneCount;
        }
      });
    },
    // 点击某一行
    rowClick(row){
      this.$emit('rowClick',row)
    },
    getResultClass(row){
      let className = "attackResult ";
      switch (row.attackResultLabel) {
        case "已失陷":
          className += "bg1";
          break;
        case "疑似失陷":
          className += "bg2";
          break;
        case "攻击成功":
          className += "bg3";
          break;
        case "疑似成功":
          className += "bg4";
          break;
        case "企图":
          className += "bg5";
          break;
        case "失败":
          className += "bg6";
          break;
        default:
          className += "bg";
      }
      return className;
    }
  },
};
</script>

<style lang="less" scoped>
.dialog-wrap-content{
  padding: 16px 16px 16px !important;
  color: #F2F2F2;
  height: 510px !important;

  .canClick{
    cursor: pointer;
  }
  .sum-box{
    text-align: center;
    .title{
      color: #00FFFF;
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
    .el-table__body-wrapper {
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
            &.level4 {
              border: 1px solid rgba(161, 213, 242, 0.8);
              background: rgba(161, 213, 242, 0.2);
            }
            &.level3 {
              border: 1px solid rgba(194, 128, 255, 0.8);
              background: rgba(194, 128, 255, 0.2);
            }
            &.level2 {
              border: 1px solid rgba(255, 200, 54, 0.8);
              background: rgba(255, 200, 54, 0.2);
            }
            &.level1 {
              border: 1px solid rgba(207, 19, 34, 0.8);
              background: rgba(207, 19, 34, 0.2);
            }
          }
          .attackResult{
            line-height: 18px !important;
            border-radius: 12px !important;
            margin-left: auto;
            border: none;
            color: #f2f2f2;
            &.bg{
              border: 1px solid rgba(194, 128, 255, 0.8);
              background: rgba(194, 128, 255, 0.2);
            }
            &.bg1{
              border: 1px solid rgba(207, 19, 34, 0.8);
              background: rgba(207, 19, 34, 0.2);
            }
            &.bg2{
              border: 1px solid rgba(237, 64, 20, 0.8);
              background: rgba(237, 64, 20, 0.2);
            }
            &.bg3{
              border: 1px solid rgba(255, 99, 71, 0.8);
              background: rgba(255, 99, 71, 0.2);
            }
            &.bg4{
              border: 1px solid rgba(255, 200, 54, 0.8);
              background: rgba(255, 200, 54, 0.2);
            }
            &.bg5{
              border: 1px solid rgba(194, 128, 255, 0.8);
              background: rgba(194, 128, 255, 0.2);
            }
            &.bg6{
              border: 1px solid rgba(161, 213, 242, 0.8);
              background: rgba(161, 213, 242, 0.2);
            }

          }


        }
      }

    }

    &.empty-loading{
      .el-table__empty-block{
        display: none;
      }
     .el-loading-spinner .path{
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
