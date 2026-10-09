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
          <p>重点关注情报</p>
        </div>
      </div>
      <div class="cart-count">
        <div v-if="attentionList.length">
          <div
            :class="{ 'recent': isRecent(item.updateTime) }"
            class="count-item"
            v-for="(item, index) in attentionList"
            :key="item.id"
            @click="$emit('open',item.id)"
          >
            <div class="item-index">{{ index + 1 }}</div>
            <p class="item-title">
              <sm-text-tooltip :content="item.title" :teleported="true" />
            </p>
          </div>
        </div>
        <div v-else class="without-data">
          <span>暂无数据</span>
        </div>
      </div>
    </div>
    <div class="card-wrap">
      <div class="card-top">
        <el-image
          class="card-top-head"
          :src="
            util.getAssetsImages('battle-screen/card-top-head.svg')
          "
        ></el-image>
        <div class="card-top-title">
          <p>风险域名TOP5</p>
        </div>
      </div>
      <div class="">
        <el-row class="rate-top">
          <el-col :span="2">排名</el-col>
          <el-col :span="17">域名</el-col>
          <el-col :span="5" style="text-align: right" >受攻击次数</el-col>
        </el-row>
        <el-row class="rate-list">
          <el-row  v-if="rightData.riskData.length" >
            <el-col :span="2" class="rate-item">
              <div class="item-img"  v-for="(item, key) in rightData.riskData.length" :key="key">
                <div  :class="`rate-icon${ key + 1 }`">{{ key + 1 }}</div>
              </div>
            </el-col>
            <el-col :span="22"  class="rate-chart">
              <risk-domain  :riskDate="rightData.riskDate" :riskData="rightData.riskData"/>
            </el-col>
          </el-row>
          <el-row  v-else class="without-data">
            <span>暂无数据</span>
          </el-row>

        </el-row>
      </div>
    </div>
    <resource-card
      @open ="openResource"
      :resourceData="rightData.resourceData"
      :calendarList ="rightData.calendarList"
      :openCalendarDetail ="openCalendarDetail"
      />
  </div>
</template>
<script>
import resourceCard from './resourceCard.vue'
import SmTextTooltip from "/@/components/Tooltip";
import RiskDomain from './riskDomain.vue';
import util from '/@/utils';
export default {
  name: "rightSidebar",
  components:{
    resourceCard,
    SmTextTooltip,
    RiskDomain
  },
  props: {
    attentionList:Array,
    openResource:Function,
    rightData:Object,
    openCalendarDetail:Function
  },
  data() {
    return {
      util
    };
  },
  methods: {
    openCalendarDetail1(time){
      console.log(time);
    },
    isRecent(updateTime){
      return (new Date().getTime() - new Date(updateTime).getTime())  < 12*60*60*1000
    }
  },
};
</script>
<style lang="less" scoped>
.cart-count {
  background: url("/@/assets/images/battle-screen/card-body-bg.svg") center center no-repeat;
  background-size: 100% 100%;
  padding: 14px;
  box-sizing: border-box;
  height: 187px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 4px!important; // 横向滚动条
    height: 4px; // 纵向滚动条 必写
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(128, 255, 255, 1);
    border-radius: 3px;
  }
  > div {
    .count-item {
      cursor: pointer;
      display: flex;
      .item-index {
        width: 24px;
        display: inline-block;
        height: 24px;
        background: rgba(128, 255, 255, 0.2);
        font-size: 13px;
        text-align: center;
        color: #57f4fd;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      .item-title {
        width: calc(100% - 24px);
        padding-left: 5px;
        text-align: left;
        font-size: 14px;
        line-height: 24px;
        color: #f2f2f2;
        word-wrap: break-word;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &.recent {
        .item-index {
          color: #f8d45b;
          background: rgba(248, 212, 91, 0.2);
        }
        .item-title {
          color: #f8d45b;
        }
      }
    }
  }
}
.rate-top {
  border-bottom: 1px solid #225a81;
  line-height: 35px;
  font-weight: 400;
  font-size: 14px;
  color: #00DFE4;
  text-align: left;
  padding-left: 14px;
}
.rate-list {
  padding-left: 14px;
  height: 210px;
  .el-row{
    width: 100%;
  }
  .rate-item {
    font-size: 14px;
    text-align: left;
    font-weight: 400;
    .item-img { height: 30px }
    & .item-img{
      margin-top: 10px;
      div {
        height: 30px; width: 30px; line-height: 30px; color: #FFFFFF;
        margin-top: 5px;
        background: url("/@/assets/images/cockpit-screen/top-fourth.png") center center no-repeat;
        background-size: 100% 100%; text-align: center;
      }
      .rate-icon1 { background-image: url("/@/assets/images/cockpit-screen/top-one.png") }
      .rate-icon2 { background-image: url("/@/assets/images/cockpit-screen/top-two.png") }
      .rate-icon3 { background-image: url("/@/assets/images/cockpit-screen/top-third.png") }
    }
    & .item-img:nth-child(2) {
      color: #BDDBFF;
    }
    & .item-img:nth-child(3) {
      text-align: right;
      color: #FFFFFF;
    }
  }
  .rate-chart{
    padding-top: 10px;
  }

}
.without-data{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dddddd;
}

</style>
