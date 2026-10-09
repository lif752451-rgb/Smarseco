<template>
  <div>
    <div class="card-wrap">
      <div class="card-top">
        <el-image
          class="card-top-head"
          :src="
            util.getAssetsImages('battle-screen/card-top-head.svg')
          "
        ></el-image>
        <div class="card-top-title">
          <p>资源统筹</p>
        </div>
      </div>
      <div class="resource">
        <div class="resource-classify">
          <div @click="$emit('open','安全专家','1')">
            <el-image class="classify-img" :src=" util.getAssetsImages('battle-screen/safety-group.png')" />
             <div class="clasify-box"><p>安全专家</p><span>{{ resourceData.safetyNameCount || 0 }}</span></div>
          </div>
          <div @click="$emit('open','报告组','2')">
            <el-image class="classify-img" :src=" util.getAssetsImages('battle-screen/reporting-group.png')" />
             <div class="clasify-box"><p>报告组</p><span>{{ resourceData.reportNameCount || 0 }}</span></div>
          </div>
          <div @click="$emit('open','情报组','3')">
            <el-image class="classify-img" :src=" util.getAssetsImages('battle-screen/intelligence-group.png')" />
             <div class="clasify-box"><p>情报组</p><span>{{ resourceData.intelligenceNameCount || 0 }}</span></div>
          </div>
          <div @click="$emit('open','安全监控组','4')">
            <el-image class="classify-img" :src=" util.getAssetsImages('battle-screen/monitoring-group.png')" />
             <div class="clasify-box"><p>安全监控组</p><span>{{ resourceData.safetyControlNameCount || 0 }}</span></div>
          </div>
          <div @click="$emit('open','分析研判组','5')">
            <el-image class="classify-img" :src=" util.getAssetsImages('battle-screen/analysis-group.png')" />
             <div class="clasify-box"><p>分析研判组</p><span>{{ resourceData.analyseNameCount || 0 }}</span></div>
          </div>
          <div @click="$emit('open','应急处置组','6')">
            <el-image class="classify-img" :src=" util.getAssetsImages('battle-screen/follow-group.png')" />
             <div class="clasify-box"><p>应急处置组</p><span>{{ resourceData.emergencyResponseNameCount || 0 }}</span></div>
          </div>
          <div @click="$emit('open','后续跟进组','7')">
            <el-image class="classify-img" :src=" util.getAssetsImages('battle-screen/follow-group.png')" />
             <div class="clasify-box"><p>后续跟进组</p><span>{{ resourceData.followNameCount || 0 }}</span></div>
          </div>
          <div @click="$emit('open','追踪溯源组','8')">
            <el-image class="classify-img" :src=" util.getAssetsImages('battle-screen/resource group.png')" />
             <div class="clasify-box"><p>追踪溯源组</p><span>{{ resourceData.sourceNameCount || 0}}</span></div>
          </div>
          <div @click="$emit('open','其他','9')">
            <el-image class="classify-img" :src=" util.getAssetsImages('battle-screen/other-group.png')" />
             <div class="clasify-box"><p>其他</p><span>{{ resourceData.otherNameCount || 0}}</span></div>
          </div>                                                                               
        </div>
      </div>
      <div class="calendar">
        <calendar :calendarArr="calendarList" @open="openCalendarDetail"/>
      </div>
    </div>
  </div>
</template>
<script>
import calendar from './calendar.vue'
import util from '/@/utils';
export default {
  props:{
    openResource:Function,
    resourceData:Object,
    openCalendarDetail:Function,
    calendarList:{
      type:Array,
      default:[]
    },
  },
  components:{
    calendar,
  },
  data(){
    return {
      util
    }
  },
  methods:{
  }
  
}
</script>
<style lang="less" scoped>
.resource{
  padding: 15px 0 15px 15px;
  .resource-classify{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap:5px;
    >div{
      padding: 5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex: 0 0 32%;
      .el-image{
        width: 32px;
        height: 32px;
      }
      .clasify-box{
          box-sizing: border-box;
          display: flex;
          width: calc(100% - 32px);
          flex-direction: row;
          justify-content: space-between;
          font-weight: 400;
          color: #FFFFFF;
          font-size: 14px;
          span{
            font-weight: 500;
            font-size: 18px;
          }
      }

    }
  }
}
.calendar{
  .duty-calendar{
    :deep(.content-title){
      display: none;
    }
  }
}
</style>