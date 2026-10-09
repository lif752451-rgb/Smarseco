<template>
  <div class="overall-content" ref="cockpitScreen">
    <el-row class="overall-title" type="flex">
      <el-col :span="8">
        <div class="period-container" @click="isShowPeriod = !isShowPeriod">
          <p class="period-title">
            <el-image
              :src="
                util.getAssetsImages('battle-screen/date-period.png')
              "
            />
            <span>{{ currntPeriod }}</span>
          </p>
          <div
            class="period-box"
            :class="isShowPeriod ? 'show-period' : 'hidden-period'"
          >
            <div
              v-for="(item, index) in battlePeriod"
              class="period-item"
              :key="item.dictValue"
              @click="selectPeriod(index)"
              :class="{ selected: periodIndex == index }"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="center-img">
          <el-image
            :src="
              util.getAssetsImages('battle-screen/head-title.png')
            "
          />
        </div>
      </el-col>
      <el-col :span="8" class="head-right">
        <el-image
          @click="toggleFullScreen($refs.cockpitScreen)"
          class="right-icon"
          :src="
            util.getAssetsImages('battle-screen/full-screen-icon.png')
          "
        />
        <span class="mr-10"
          ><el-checkbox v-model="isTimeRefresh" @change="dataRefreh(isTimeRefresh)" class="time-class"
            >
            <span style="color: #FFFFFF; font-size: 14px;">每60s自动刷新</span>
            </el-checkbox
          ></span
        >
        <div class="time-box">
          <p class="time">距演习结束还有:
            <span>{{ restTimeDays }}</span>天
            <span>{{ restTimeHours }}</span>时
            <span>{{ restTimeMinutes }}</span>分
          </p>
        </div>
      </el-col>
    </el-row>
    <el-scrollbar class="overall-scrollbar">
      <el-row :gutter="20" class="battle-wrap">
        <el-col :span="8">
          <left-sidebar
            class="card"
            :leftData="leftData"
            :taskFollowList="taskFollowList"
            :countData="countData"
            @handleCount="handleCount"
          />
        </el-col>
        <el-col :span="8">
          <center-main
            class="card"
            @open="openAssetDialog"
            :mainData="mainData"
            :openOrder="openRealtedOrder"
          />
        </el-col>
        <el-col :span="8">
          <right-sidebar
            class="card"
            @open="openAttentionDetail"
            :attentionList="attentionList"
            :openResource="openResourceDetail"
            :rightData="rightData"
            :openCalendarDetail="openResourceCalendar"
          />
        </el-col>
        <el-col :span="24">
          <bottom-content class="card" :isTimeRefresh="isTimeRefresh" />
        </el-col>
      </el-row>
    </el-scrollbar>
    <detail-dialog
      :dialogVisible="assetVisible"
      :dialogTile="assetTitle"
      @close="() => (this.assetVisible = false)"
    >
      <asset-table :tableData="tableData" :isDialog="true" :assetType="assetType" @open="openRealtedOrder"/>
    </detail-dialog>
    <detail-dialog
      :dialogVisible="attentionVisible"
      dialogTile="重点关注情报详情"
      @close="() => (this.attentionVisible = false)"
    >
      <attention-detail :detailData="attentionDetailData" />
    </detail-dialog>
    <detail-dialog
      :dialogVisible="resourceVisible"
      :dialogTile="resourceClassifyTitle"
      @close="() => (this.resourceVisible = false)"
    >
      <resource-detail
        :detailData="rightData.resourceClassifyData"
      ></resource-detail>
    </detail-dialog>
    <detail-dialog
      :dialogVisible="resourcePersonVisible"
      :dialogTile="resourceCalendarTitle"
      @close="() => (this.resourcePersonVisible = false)"
    >
      <resource-detail
        :personnelData="rightData.calendarData"
      ></resource-detail>
    </detail-dialog>
    <detail-dialog
      :dialogVisible="relatedOrderVisible"
      :dialogTile="relatedOrderTitle"
      @close="() => (this.relatedOrderVisible = false)"
    >
      <related-order :detailData="mainData.orderData"/>
    </detail-dialog>
  </div>
</template>
<script>
import leftSidebar from "./leftSidebar/index.vue";
import { toggleFullScreen } from "/@/utils/util.web";
import centerMain from "./centerMain/index.vue";
import assetTable from "./centerMain/assetTable.vue";
import relatedOrder from './centerMain/relatedOrder.vue'

import rightSidebar from "./rightSidebar/index.vue";
import attentionDetail from "./rightSidebar/attentionDetail.vue";
import resourceDetail from "./rightSidebar/resourceDetail.vue";

import bottomContent from "./bottomContent.vue";
import detailDialog from "./component/detailDialog.vue";
import {
  reqAttentionData,
  reqAttentionDetail,
  reqSourceList,
  reqSourcePerson,
  reqCalendarPerson,
  reqAlarmData,
  getTaskData,
  getTaskCount,
  getAssetDate,
  reqRiskDomainNameTop5,
  getRelatedOrder,
  getNewAddCount
} from "/@/api/scp/battleScreen";
import { getConfigDate } from "/@/api/scp/command/confige";
import lodash from "lodash-es";
import util from '/@/utils';
import { reqDict } from "/@/api/common";
export default {
  name: "scp-command-battleScreen",
  components: {
    leftSidebar,
    rightSidebar,
    centerMain,
    bottomContent,
    assetTable,
    detailDialog,
    attentionDetail,
    resourceDetail,
    relatedOrder,
  },
  data() {
    return {
      util,
      timer: null,
      assetVisible: false,
      assetTitle: "",
      attentionVisible: false,
      attentionList: [],
      taskFollowList: [],
      type: "all",
      attentionDetailData: {},
      resourceVisible: false,
      resourceClassifyTitle: "",
      resourceCalendarTitle: "",
      resourcePersonVisible: false,
      isShowPeriod: false,
      periodIndex: 0,
      periodValue: "",
      battlePeriod: [],
      tableData: [],
      assetType:'',
      mainData: {
        targetStatus: "",
        relatedStatus: "",
        confirmData: [],
        seemData: [],
        newAddFallDataCount: '',
        newAddSeemFallDataCount: '',
        gradeData: [],
        confirmLoading:false,
        seemLoading:false,
        orderData:[]
      },
      rightData: {
        resourceData: {},
        resourceClassifyData: [],
        calendarData: null,
        calendarList: [],
        riskData: [],
        riskDate: {},
      },
      leftData:{
        alarmData:{}
      },
      countData:{},
      currentTime:new Date(),
      relatedOrderVisible:false,
      relatedOrderTitle:'',
      restTimeDays:0,
      restTimeHours:0,
      restTimeMinutes:0,
      isTimeRefresh: false
    }
  },
  created() {
    this.getPeriod();
  },
  computed: {
    currntPeriod() {
      if (this.battlePeriod.length)
        return `作战周期:  ${this.battlePeriod[this.periodIndex].label}`;
      return "";
    },
  },
  watch: {
    currntPeriod() {
      this.periodValue = this.battlePeriod[this.periodIndex].dictValue;
      this.refreshData();
    },
    deep: true,
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    toggleFullScreen,
    dataRefreh(Boolean) {
      if (Boolean) {
        this.timer = setInterval(() => {
          this.refreshData()
        }, 60 * 1000)
      } else {
        clearTimeout(this.timer);
      }
    },
    selectPeriod(index){
      this.periodIndex = index;
      this.restTime();
    },
    refreshData() {
      this.getTaskFollowList();
      this.getTaskCounts();
      this.getAttentionList();
      this.getTargetDataFun();
      this.getRelatedDataFun();
      this.getFallDataFun();
      this.getSeemFallDataFun();
      this.getNewAddFallDataCount();
      this.getNewAddSeemFallDataCount();
      this.getGradeDataFun();
      this.getResourceDataFun();
      this.getAlarmDataFun();
      this.getRiskDomainNameTop5();
      this.restTime()
    },
    restTime(){
        const startTime = this.currentTime; 
        let endTime = new Date();
        if (this.battlePeriod.length){
          let { endTime:endTimeStr } = this.battlePeriod[this.periodIndex].remark
          endTime = new Date(endTimeStr);
        }
        let countDown = (endTime.getTime() - startTime.getTime())/1000;
        countDown = countDown > 0 ? countDown : 0;
        console.log('countDown',countDown);
        this.restTimeDays = parseInt(countDown/(24*60*60));
        this.restTimeHours = parseInt(countDown/(60*60)%24);
        this.restTimeMinutes = parseInt(countDown/60%60);
    },
    getPeriod() {
      reqDict("combat_fight_period").then(( data ) => {
        let dictArr = data.map((item) => {
          let { dictLabel, dictValue, remark } = item;
          const start = JSON.parse(remark)
            .startTime.split(" ")[0]
            .replaceAll("-", ".");
          const end = JSON.parse(remark)
            .endTime.split(" ")[0]
            .replaceAll("-", ".");
          return {
            label: `${dictLabel}(${start}-${end})`,
            dictValue,
            remark: JSON.parse(remark),
          };
        });
        this.battlePeriod = dictArr;
      });
    },
    //靶标资产状态
    getTargetDataFun() {
      let params = {
        combatFightPeriod: this.periodValue,
        cmdConfigeItemExplain: "cmd:confige:target",
      };
      this.commonReqBattle(getConfigDate, params, (targetStatus) => {
        this.mainData.targetStatus = targetStatus.content;
      });
    },
    //靶标相关资产状态
    getRelatedDataFun() {
      let params = {
        combatFightPeriod: this.periodValue,
        cmdConfigeItemExplain: "cmd:confige:targetrelated",
      };
      this.commonReqBattle(getConfigDate, params, (relatedStatus) => {
        this.mainData.relatedStatus = relatedStatus.content;
      });
    },
    //确认失陷资产
    getFallDataFun() {
      this.mainData.confirmData = []
      this.mainData.confirmLoading = true;
      let params = {
        combatFightPeriod: this.periodValue,
        cmdConfigeItemExplain: "cmd:confige:confirmfall",
      };
      this.commonReqBattle(getAssetDate, params, (confirmData) => {
        this.mainData.confirmLoading = false;
        this.mainData.confirmData = confirmData;
      });
    },
    // 疑似失陷资产
    getSeemFallDataFun() {
      this.mainData.seemData  = []
      this.mainData.seemLoading = true;
      let params = {
        combatFightPeriod: this.periodValue,
        cmdConfigeItemExplain: "cmd:confige:seemfall",
      };
      this.commonReqBattle(getAssetDate, params, (seemData) => {
        this.mainData.seemLoading = false;
        this.mainData.seemData = seemData;
      });
    },
    // 获取近30分钟新增失陷资产
    getNewAddFallDataCount() {
      this.mainData.newAddFallDataCount = ''
      let params = {
        combatFightPeriod: this.periodValue,
        cmdConfigeItemExplain: "cmd:confige:confirmfall",
      };
      getNewAddCount(params).then((res) => {
        if(res && res.code == 200) {
          this.mainData.newAddFallDataCount = res.data
        }
      })
    },
    // 获取近30分钟新增疑似失陷资产
    getNewAddSeemFallDataCount() {
      this.mainData.newAddSeemFallDataCount = ''
      let params = {
        combatFightPeriod: this.periodValue,
        cmdConfigeItemExplain: "cmd:confige:seemfall",
      };
      getNewAddCount(params).then((res) => {
        if(res && res.code == 200) {
          this.mainData.newAddSeemFallDataCount = res.data
        }
      })
    },
    // 得失分概况
    getGradeDataFun(){
      this.mainData.gradeData = [] 
      let params = { combatFightPeriod: this.periodValue, cmdConfigeItemExplain: "cmd:confige:grade"}
      this.commonReqBattle(getConfigDate, params, gradeData => {
        this.mainData.gradeData = JSON.parse(gradeData.content)
      })
    },
    // 获取风险域名top5
    getRiskDomainNameTop5(){
      this.rightData.riskData = []
      let { startTime, endTime} = this.battlePeriod[this.periodIndex].remark
      startTime = startTime.replaceAll(' ','T')
      endTime = endTime.replaceAll(' ','T')
      let params = {id:'202304061930582720097',paramJson:JSON.stringify({startTime, endTime})}
      this.commonReqBattle(reqRiskDomainNameTop5, params, res => {
        if(res.resultData){
          this.rightData.riskData = [...res.resultData.slice(0,5)];
          this.rightData.riskDate = {startTime, endTime};
        }
      })
    },
    // 公共方法
    commonReqBattle(func, params, callback) {
      func(params).then(({ data }) => {
        try {
          callback(data);
        } catch (e) {
          console.warn(e);
        }
      });
    },
    // 任务跟进数量
    getTaskCounts() {
      const period = this.battlePeriod[this.periodIndex].dictValue;
      getTaskCount(period).then((res) => {
        const { data = {} } = res;
        for (let key in data) {
          data[key] = data[key] || 0;
        }
        this.countData = data;
      });
    },
    handleCount(type) {
      this.type = type;    
      this.getTaskFollowList();
      this.getTaskCounts();
    },
    // 任务跟进情况
    getTaskFollowList() {
      this.taskFollowList = []
      const period = this.battlePeriod[this.periodIndex].dictValue;
      const params = {
        period,
        type: this.type,
      };
      getTaskData(params).then((res) => {
        if (res && res.data) {
          this.taskFollowList = res.data || [];
        }
      });
    },
    // 重点关注情报列表
    getAttentionList() {
      this.attentionList = []
      const period = this.battlePeriod[this.periodIndex].dictValue;
      const params = {
        combatFightPeriodList: [period],
        pageSize: 20,
        pageNum: 1,
      };
      this.commonReqBattle(reqAttentionData, params, (attentionData) => {
        this.attentionList = lodash.cloneDeep(attentionData.list);
      });
    },
    // 重点关注情报详情
    openAttentionDetail(id) {
      let params = id;
      this.commonReqBattle(reqAttentionDetail, params, (attentionDetail) => {
        this.attentionDetailData = lodash.cloneDeep(attentionDetail);
        this.attentionVisible = !this.attentionVisible;
      });
    },
    // 资源统筹接口
    getResourceDataFun() {
      let params = this.periodValue;
      this.commonReqBattle(reqSourceList, params, (resourceData) => {
        let { sortClassList: calendarList, ...rest } = resourceData;
        this.rightData.resourceData = { ...rest };
        this.rightData.calendarList = calendarList;
      });
    },
    //  点击安全专家等接口
    openResourceDetail(title, type) {
      this.rightData.resourceClassifyData = [];
      let params = { period: this.periodValue, type };
      this.commonReqBattle(reqSourcePerson, params, (classifyData) => {
        this.rightData.resourceClassifyData = classifyData || [];
        this.resourceClassifyTitle = `${title}(${this.rightData.resourceClassifyData.length})`;
        this.resourceVisible = !this.resourceVisible;
      });
    },
    // 值班详情
    openResourceCalendar(time) {
      this.rightData.calendarData = null;
      let params = { period: this.periodValue, time };
      this.commonReqBattle(reqCalendarPerson, params, (calendarData) => {
        this.rightData.calendarData = calendarData || null;
        this.resourceCalendarTitle = `${new Date(time).format(
          "yyyy年MM月dd日"
        )} 人员排班`;
        this.resourcePersonVisible = !this.resourcePersonVisible;
      });
    },
    // 重点关注告警
    getAlarmDataFun() {
      let params = { fightPeriodType: this.periodValue };
      this.commonReqBattle(reqAlarmData, params, (alarmData) => {
        this.leftData.alarmData = alarmData;
      });
    },
    // 打开失陷资产详情
    openAssetDialog(type) {
      this.tableData = []
      if (type === "fallAsset") {
        this.tableData = this.mainData.confirmData;
        this.assetTitle = `确认失陷资产 (${this.tableData.length})`;
      } else if (type === "seemFallAsset") {
        this.tableData = this.mainData.seemData;
        this.assetTitle = `可能失陷资产 (${this.tableData.length})`;
      }
      this.assetType = type
      this.assetVisible = !this.assetVisible;
    },
    // 打开关联工单弹框
    openRealtedOrder(item) {
      let { internalIp, assetType, cmdConfigeItemExplain, combatFightPeriod,total } = item 
      
      let assetName = ''
      let params = { internalIp,cmdConfigeItemExplain,combatFightPeriod };
      this.commonReqBattle(getRelatedOrder, params, (orderData) => {
        if (assetType === "fallAsset") assetName = '确认失陷资产'
        if (assetType === "seemFallAsset") assetName = '可能失陷资产'
        this.relatedOrderTitle = `${assetName} ${internalIp} 关联工单(${total})`
        this.relatedOrderVisible = true;
        this.mainData.orderData = orderData
      });
    },

  },
};
</script>
<style scoped lang="less">
.overall-content {
  padding: 0;
  overflow-y: auto;
  background: url("/@/assets/images/battle-screen/screen-bg.png") center
    center no-repeat;
  background-size: 100% 100%;
  height: 100%;
  .overall-title {
    background: url("/@/assets/images/battle-screen/head-bg.png") center
      center no-repeat;
    background-size: 100% 100%;
    margin: 0;
    height: 80px;
    padding: 20px 20px;
    p {
      font-family: SourceHanSansSC-Bold;
      font-size: 16px;
      color: #06edff;
      font-weight: 700;
      cursor: pointer;
    }
    .period-title {
      display: flex;
      align-items: center;
      .el-image {
        width: 24px;
        height: 23px;
        margin-right: 10px;
      }
    }
    .center-img {
      width: 348px;
      margin: 0 auto;
    }
    .head-right{
      display: flex;
      flex-direction: row-reverse;
      .right-icon {
        width: 24px;
        height: 24px;
        float: right;
      }
      .time-class {
        padding-top: 3px;
        :deep(.el-checkbox__inner) {
          border: 1px solid #00FFFF !important;
          background-color: #051F43 !important;
        }
        :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
          border: 1px solid rgba(0, 255, 255, 0.4) !important;
          background-color: rgba(0, 255, 255, 0.4) !important;
        }
      }
      .time-box{
         height: 24px;
         line-height: 24px;
         margin-right: 30px;
        .time{
          display: flex;
          align-items: center;
          color: #F2F2F2;
          font-size: 16px;
          span{
            color: #00FFFF;
            font-size: 20px;
            padding: 0 10px;
          }
        }
      }
    }
    .period-box {
      display: none;
      width: 60%;
      font-size: 13px;
      line-height: 32px;
      padding: 3px 12px;
      font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
      font-weight: 400;
      font-style: normal;
      color: #d7d7d7;
      background-color: #1b284a;
      word-wrap: break-word;
      text-transform: none;
      border: 1px solid rgba(128, 255, 255, 0.4);
      z-index: 9999;
      position: relative;
      top: 2px;
      .period-item {
        cursor: pointer;
        &.selected {
          color: #00ffff;
        }
      }
    }
    .hidden-period {
      display: none;
    }
    .show-period {
      display: block;
    }
  }
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .battle-wrap {
    padding: 20px;
    :deep(.card) {
      .card-wrap {
        margin-bottom: 20px;
        .card-top {
          display: flex;
          .card-top-haad {
            width: 12px;
            height: 40px;
          }
          .card-top-title {
            background: url("/@/assets/images/battle-screen/card-top-bg.svg")
              center center no-repeat;
            background-size: 100% 100%;
            margin-left: 2px;
            box-sizing: border-box;
            width: calc(100% - 12px);
            padding: 8px 2px 8px 16px;
            border-image: url("/@/assets/images/battle-screen/card-top-head-bottom.png")
              30 30 round;
            p {
              font-family: "PingFangSC-Medium", "PingFang SC Medium",
                "PingFang SC", sans-serif;
              font-weight: 500;
              font-style: normal;
              font-size: 16px;
              color: #ffffff;
              text-align: left;
            }
          }
        }
        .card-cont {
          padding: 15px 10px 0;
          height: 300px;
          overflow-y: auto;
          background-image: linear-gradient(
            180deg,
            rgba(0, 152, 247, 0.02) 2%,
            rgba(0, 223, 228, 0.2) 100%
          );
        }
        div::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }
    }
  }
}
</style>
