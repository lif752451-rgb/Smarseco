<template>
  <div class="overall-content">
    <!--标题-->
    <el-row class="overall-title">
      <el-col :span="16">
        <img class="company" :src="util.getAssetsImages('other/whole_cockpit.png')"/>
      </el-col>
      <el-col :span="8" class="date-time">
        <span>统计周期: {{startDate}} 至 {{endDate}} </span>

        <span class="date-line">
          <el-button @click="dateHandleClick" class="change-time">切换日期</el-button>
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
      <!--    ========    上半部分    ========-->
      <el-row :gutter="16">
        <!--   上-左边     -->
        <el-col :span="7">

          <!-- 受攻击单位 Top 10 -->
          <el-row>
            <victimTOP :state="state" :date="newDate" ref="victimTOP"></victimTOP>
          </el-row>
          <!--重点关注事件-->
          <el-row >
            <pointEvent :state="state" :date="newDate" ref="pointEvent"></pointEvent>
          </el-row>
        </el-col>
        <!--   上-中间     -->
        <el-col :span="10">
          <el-row>
            <count :state="state" :date="newDate" ref="count"></count>
          </el-row>
          <el-row>
            <!-- 各作战单位受攻击趋势TOP20 -->
            <instanceTOP :state="state" :date="newDate" ref="instanceTOP"></instanceTOP>
          </el-row>
        </el-col>
        <!--   上-右边     -->
        <el-col :span="7">
          <!-- 攻击IP TOP10-->
          <el-row>
            <attackTOP :state="state" :date="newDate" ref="attackTOP"></attackTOP>
          </el-row>
          <!-- 分值预估 -->
          <el-row :span="12">
            <scoreCount :state="state" :date="newDate" ref="scoreCount"></scoreCount>
          </el-row>
        </el-col>
      </el-row>
      <!--    ========    下半部分    ========-->
      <el-row :span="20">
        <el-col :span="24">
          <!--实时攻击分布-->
          <attackDistribute :state="state" :date="newDate" ref="attackDistribute"></attackDistribute>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script>
  import util from '/@/utils';
  import { reqDict} from "/@/api/common";
  import '/@/style/overall-situation.less';
  import victimTOP from '/@/views/scp/securityOperations/components/cockpit/victimTOP.vue'
  import attackTOP from '/@/views/scp/securityOperations/components/cockpit/attackTOP.vue'
  import instanceTOP from '/@/views/scp/securityOperations/components/cockpit/instanceTOP.vue'
  import count from '/@/views/scp/securityOperations/components/cockpit/count.vue'
  import pointEvent from '/@/views/scp/securityOperations/components/cockpit/pointEvent.vue'
  import attackDistribute from '/@/views/scp/securityOperations/components/overallSituation/attackDistribute.vue'
  import scoreCount from '/@/views/scp/securityOperations/components/cockpit/scoreCount.vue'
  export default {
    components: {
      attackDistribute,
      victimTOP,
      attackTOP,
      instanceTOP,
      count,
      pointEvent,
      scoreCount,
    },
    watch: {},
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
      })                  
    },
    beforeDestroy() {
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
        this.dateOpen = false;
        if(this.dateRange[0] != null && this.dateRange[0] !== "" && this.dateRange[1] != null && this.dateRange[1] !== ""){
          this.startDate = this.dateRange[0];
          this.endDate = this.dateRange[1];
          this.newDate = this.startDate + "#" + this.endDate;
          this.refreshData();
        }
      },
      refreshData(){
        this.$refs.victimTOP.refreshData(this.newDate);
        this.$refs.pointEvent.refreshData(this.newDate);
        this.$refs.count.refreshData(this.newDate);
        this.$refs.instanceTOP.refreshData(this.newDate);
        this.$refs.attackTOP.refreshData(this.newDate);
        this.$refs.attackDistribute.refreshData(this.newDate);
        this.$refs.scoreCount.refreshData(this.newDate);
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
  :deep(.el-scrollbar__thumb) {
    display: none;
  }

  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .overall-content{
    background: url("/@/assets/images/cockpit/背景v2.png") center center no-repeat #2e2f36;
    background-size: 100% 100%;
  }

  .change-time{
    width: 96px;
    height: 24px;
    margin: -3px 0 0 0;
    background-color: rgba(242,242,242,0.0980392);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #a5f3fd;
    border-radius: 4px;
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
