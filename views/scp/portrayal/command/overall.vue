<template>
  <div class="overall-content">
    <!--标题-->
    <el-row class="overall-title">
      <el-col :span="16">
        <span class="overall-tag">{{stateName}}</span>
        <img class="company" :src="util.getAssetsImages('other/whole_company.png')"/>
      </el-col>
      <el-col :span="8" class="date-time">
        <span>统计周期: {{startDate}} 至 {{endDate}} </span>
        <span class="date-line">
          <el-button @click="dateHandleClick" class="change-time">
            切换日期
          </el-button>
          <el-date-picker
            popper-class="date-time-range"
            v-model="dateRange"
            @change="dateHandleChange"
            :disabled-date="dateOptions"
            ref="datePicker"
            class="hidden"
            type="datetimerange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </span>
      </el-col>
    </el-row>
    <el-scrollbar class="overall-scrollbar">
      <el-row :gutter="16">
        <el-col :span="8">
          <!--告警处置总览-->
          <alarmDisposal :state="state" :date="newDate" ref="alarmDisposal"></alarmDisposal>
        </el-col>
        <el-col :span="16">
          <el-row :gutter="16">
            <el-col :span="12">
              <!--统计数据-->
              <statistics :state="state" :date="newDate" ref="statistics"></statistics>
              <securityAlarm :state="state" :date="newDate" ref="securityAlarm"></securityAlarm>
              <!--已失陷资产-->
              <fallAsset :state="state" :date="newDate" ref="fallAsset"></fallAsset>
            </el-col>
            <el-col :span="12">
              <!--资源统筹-->
              <resourcesPlan :state="state" :date="newDate"></resourcesPlan>
              <!--值班日历-->
              <dutyCalendar :state="state" :date="newDate" ></dutyCalendar>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <powerAttack :state="state" :date="newDate" ref="powerAttack"></powerAttack>
        </el-col>
        <el-col :span="12">
          <alarmFlow :state="state" :date="newDate" ref="alarmFlow"></alarmFlow>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!--安全告警类型-->
          <alarmType :state="state" :date="newDate" ref="alarmType"></alarmType>
        </el-col>
        <el-col :span="24">
          <!--实时攻击分布-->
          <attackDistribute :state="state" :date="newDate" ref="attackDistribute"></attackDistribute>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script>
  import { reqDict} from "/@/api/common";
  import util from '/@/utils';
  import '/@/style/overall-situation.less';
  import securityAlarm from '/@/views/scp/securityOperations/components/overallSituation/securityAlarm.vue'
  import alarmDisposal from '/@/views/scp/securityOperations/components/overallSituation/alarmDisposal.vue'
  import statistics from '/@/views/scp/securityOperations/components/overallSituation/statistics.vue'
  import resourcesPlan from '/@/views/scp/securityOperations/components/overallSituation/resourcesPlan.vue'
  import dutyCalendar from '/@/views/scp/securityOperations/components/overallSituation/dutyCalendar.vue'
  import powerAttack from '/@/views/scp/securityOperations/components/overallSituation/powerAttack.vue'
  import alarmType from '/@/views/scp/securityOperations/components/overallSituation/alarmType.vue'
  import attackDistribute from '/@/views/scp/securityOperations/components/overallSituation/attackDistribute.vue'
  import alarmFlow from '/@/views/scp/securityOperations/components/overallSituation/alarmFlow.vue'
  export default {
    components: {
      securityAlarm,
      alarmDisposal,
      statistics,
      resourcesPlan,
      dutyCalendar,
      powerAttack,
      alarmType,
      attackDistribute,
      alarmFlow,
    },
    data() {
      return {
        util,
        state:"",
        date:"",
        stateName:"",
        startDate: "",
        endDate: "",
        newDate:"",
        days: 0,
        dateOpen:false,
        dateRange:"",
        dateOptions:  (date)=> {
          return new Date("2021-04-07") > date;
        },
        timer: null,
      }
    },
    created() {
      reqDict('scp_normalcy_config').then( res =>{
        let data = res[0];
        this.stateName = data.remark;
        this.state = data.dictLabel;
        if(data.dictValue === "#"){
          let tempDate = new Date(); // 获取今天的日期
          this.endDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
          tempDate.setDate(tempDate.getDate() - 30) // 今天的前N天的日期，N自定义
          this.startDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
          this.date = this.startDate + "#" + this.endDate;
        }else{
            this.date = data.dictValue;
            this.startDate = data.dictValue.split("#")[0];
            this.endDate = data.dictValue.split("#")[1];
        }
        this.newDate = this.date;
        this.timer = setInterval(() => {
          this.refreshData();
        }, 60000);
      })
      
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer)//在vue实例销毁钱，清除我们的定时器
      }
    },
    methods: {
      dateHandleClick () {
        this.dateOpen = !this.dateOpen;
        if( this.dateOpen){
          this.$refs.datePicker.handleOpen();
        }else{
          this.$refs.datePicker.handleClose();
        }
      },
      dateHandleChange (date) {
        this.dateRange = date;
        if(this.dateRange[0] != null && this.dateRange[0] !== "" && this.dateRange[1] != null && this.dateRange[1] !== ""){
          this.startDate = this.dateRange[0];
          this.endDate = this.dateRange[1];
          this.newDate = this.startDate + "#" + this.endDate;
          this.refreshData();
        }
        if (this.timer) {
          clearInterval(this.timer)//在vue实例销毁钱，清除我们的定时器
        }
        this.timer = setInterval(() => {
          this.refreshData();
        }, 60000);
      },
      refreshData(){
        this.$nextTick(() =>{
          this.$refs.securityAlarm && this.$refs.securityAlarm.refreshData(this.newDate);
          this.$refs.alarmDisposal && this.$refs.alarmDisposal.refreshData(this.newDate);
          this.$refs.statistics &&   this.$refs.statistics.refreshData(this.newDate);
          this.$refs.powerAttack && this.$refs.powerAttack.refreshData(this.newDate);
          this.$refs.alarmType && this.$refs.alarmType.refreshData(this.newDate);
          this.$refs.attackDistribute && this.$refs.attackDistribute.refreshData(this.newDate);
          this.$refs.alarmFlow && this.$refs.alarmFlow.refreshData(this.newDate);
        })
      },
    }
  }
</script>
<style scoped lang="less">
  :deep(.hidden){
    position: absolute;
    visibility: hidden;
    top: -6px;
    right: 10px;
  }
  :deep.el-scrollbar__thumb {
    display: none;
  }

  :deep(.el-scrollbar__wrap){
    overflow-x: hidden;
    overflow-y: auto;
  }

  .change-time{
    width: 96px;
    height: 24px;
    margin: -3px 0 0 0;
    background-color: rgba(242,242,242,0.0980392);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #a5f3fd;
    border-radius: 0px;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #A5F3FD;
    line-height: 22px;
    text-align: center;
    cursor: pointer;
  }
  .date-time :deep(span.ivu-date-picker-cells-cell-disabled), .date-time :deep(span.ivu-date-picker-cells-cell-disabled:hover){
    background: rgba(255,255,255,0.2);
  }
  .date-time :deep(.ivu-date-picker .ivu-select-dropdown){
    background: #323e52;
    border: 1px solid #a5f3fd;
    left: auto !important;
    right: 10px;
  }
  .date-time :deep(.ivu-date-picker-cells-cell:hover em){
    background: #2d8cf0;
    color: #FFFFFF;
  }
  .date-time :deep(.ivu-date-picker-cells-cell-range:before){
    background: rgba(255,255,255,0.2);
  }
  .date-time :deep(.ivu-date-picker .ivu-select-dropdown .ivu-picker-confirm .ivu-btn-default){
    background: #323e52;
    color: #c5c8ce;
    border-color: #c5c8ce;
  }
  .date-time :deep(.ivu-date-picker .ivu-select-dropdown .ivu-picker-confirm .ivu-btn-primary){
    border-color: #a5f3fd;
    background: #323e52;
    color: #A5F3FD;
  }
</style>
