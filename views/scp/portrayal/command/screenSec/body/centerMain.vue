<template>
  <el-col :span="12" style="height: 100%">
    <el-row class="secure-header" type="flex">
      <div class="secure-header-total">当日疑似攻击次数<i>{{ accMonAttack }}</i></div>
      <div>
        <div class="secure-header-days" style="height: 100px; text-align: center;">
          <span class="day-text">{{ date }}</span>
        </div>
        <el-row class="secure-header-days" type="flex">
          <span class="day-text">安全平稳运行</span>
          <div class="days">
            <span v-for="(item, index) in safetyDays" :key="index">{{ item }}</span>
            <!-- <el-image :src="util.getAssetsImages('screen-sec/days-text.jpg')" /> -->
          </div>
          <span class="day-text" style="margin-left: 10px;">天</span>
        </el-row>
      </div>
      <div class="secure-header-total">当日封堵攻击次数<i>{{ accFlugAttack }}</i></div>
    </el-row>
    <div class="secure-body">
      <el-row class="showcase" type="flex">
        <el-col :span="6" class="sidebar">
          <div>
            <p style="margin-bottom: 20px;">{{ rawData }}</p>
            <el-image :src="util.getAssetsImages('screen-sec/secure-side-bg.png')" />
            <span>安全分析原始数据(条/日)</span>
          </div>
          <div>
            <div>
              <scroll-left :attackIpList="appSystemNameList" :position="'leftTop'"></scroll-left>
            </div>
            <el-image :src="util.getAssetsImages('screen-sec/secure-arrow-green.png')" />
            <div>
              <scroll-left :attackIpList="dataSourceList" :position="'leftBottom'"></scroll-left>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="content">
          <div class="center-wrap">
            <div class="model-bg"></div>
            <div class="model-wrap">
              <div class="ball-box">
                <div class="ball-warp"></div>
                <div class="ball">
                  <el-image class="ball-image" :src="util.getAssetsImages('screen-sec/ball.png')" />
                </div>
                <div class="ai"></div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="sidebar">
          <div>
            <p style="color: #FFCD00; margin-bottom: 20px;">{{ threatOrder }}</p>
            <el-image :src="util.getAssetsImages('screen-sec/secure-side-yellowbg.png')" />
            <span>威胁处置工单(条/日)</span>
          </div>
          <div>
            <div>
              <scroll-left :attackIpList="alarmTypeList" :position="'rightTop'"></scroll-left>
            </div>
            <el-image :src="util.getAssetsImages('screen-sec/secure-arrow-yellow.png')" />
            <div>
              <scroll-left :attackIpList="vulnTypeList" :position="'rightBottom'"></scroll-left>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="card-box">
            <div class="card-head">
              <el-image :src="util.getAssetsImages('screen-sec/small-title-11.png')" />
            </div>
            <div class="card-body">
              <div class="table-box">
                <div class="table-header">
                  <ul>
                    <li class="threat-Type">威胁类型</li>
                    <li class="threat-Type-repair">数量占比</li>
                    <li class="threat-Type-num">数量(条)</li>
                  </ul>
                </div>
                <div class="table-body" v-loading="trendsManagementLoading">
                  <ul v-for="(item,index) in threatTypeData" :key="index" class="right-threat-Type-box">
                    <li class="threat-Type"><sm-text-tooltip :content="item.name"></sm-text-tooltip></li>
                    <li class="threat-Type-repair"><div class="flex-wrap"><el-progress class="el-bg-inner-running" :percentage="item.repair"></el-progress></div></li>
                    <li class="threat-Type-num"><sm-text-tooltip :content="String(item.count)"></sm-text-tooltip></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="card-box">
            <div class="card-head">
              <el-image :src="util.getAssetsImages('screen-sec/small-title-10.png')" />
            </div>
            <div class="card-body">
              <div class="table-box">
                <div class="table-header">
                  <ul>
                    <li class="alarm-time">告警时间</li>
                    <li>攻击IP</li>
                    <li>受害资产</li>
                    <li>告警类型</li>
                    <li class="alarm-level">告警级别</li>
                  </ul>
                </div>
                <div class="table-body">
                  <TransitionGroup tag="div" name="fade" class="scrollbar new">
                    <ul v-for="item in newAlarmData" :key="item.id">
                      <li  class="alarm-time">{{ item.alarmTime }}</li>
                      <li>{{ item.attackIp }}</li>
                      <li>{{ item.victimizedAsset }}</li>
                      <li class="alarmTypeLabel" :class="`level${item.level}`">{{ item.alarmTypeLabel }}</li>
                      <li class="alarm-level"><div class="flex-wrap"><el-tag class="level_label" :class="`level${item.level}`">{{ item.levelLabel }}</el-tag></div></li>
                    </ul>
                  </TransitionGroup>
                </div>
                <div class="table-body">
                  <div ref="scrollbarRef" class="scrollbar animation">
                    <ul v-for="item in threatAlarmData" :key="item.id">
                      <li class="alarm-time"><sm-text-tooltip :content="item.alarmTime"></sm-text-tooltip></li>
                      <li><sm-text-tooltip :content="item.attackIp"></sm-text-tooltip></li>
                      <li><sm-text-tooltip :content="item.victimizedAsset"></sm-text-tooltip></li>
                      <li class="alarmTypeLabel" :class="`level${item.level}`"><sm-text-tooltip :content="item.alarmTypeLabel"></sm-text-tooltip></li>
                      <li class="alarm-level"><div class="flex-wrap"><el-tag class="level_label" :class="`level${item.level}`">{{ item.levelLabel }}</el-tag></div></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>

      </el-row>
      <div class="card-box">
        <div class="card-head">
          <el-image :src="util.getAssetsImages('screen-sec/small-title-9.png')" />
          <span class="unit">单位：条</span>
        </div>
        <div class="card-body" v-loading="trendsDataLoading">
          <div class="trendsChars-box">
            <trendsChars :trendsData="trendsData" />
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script>
import scrollLeft from './scroll-left.vue'
import trendsChars from "./trendsChars.vue"
import { getChartDataParam } from '/@/api/stp/visual/visual';
import SmTextTooltip from "/@/components/Tooltip";
import websocket from "/@/hooks/web/useWebsocket";
import { formatNumber } from '/@/utils/util.common';
import { formatFullDate } from '/@/utils/old/index.js';
import util from '/@/utils';

export default {
  props: {
    loading: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    trendsChars,
    scrollLeft,
    SmTextTooltip
  },
  data() {
    return {
      util,
      date: formatFullDate(new Date()),
      accMonAttack: 0,
      accFlugAttack: 0,
      safetyDays: [],
      rawData: 0,
      threatOrder: 0,
      appSystemNameList: [],
      dataSourceList: [],
      alarmTypeList: [],
      vulnTypeList: [],
      threatAlarmData: [],
      newAlarmData: [],
      threatTypeData: [],
      trendsData: [],
      trendsDataLoading: false,
      trendsManagementLoading: false,
      alarmTooltipConfig: {
        popperClass: 'alarm-tooltip-popper',
      }
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.date = formatFullDate(new Date());
    }, 1000);
  },
  mounted() {
    this.getThreatAlarm();
    this.getAppSystemNameList();
    this.getDataSourceList();
    this.getAlarmTypeList();
    this.listenAlarmScroll();
    this.getNewAlarmData();
    this.getVulnTypeList();
    this.getAccMonAttack();
    this.getAccFlugAttack();
    this.getRawData();
    this.getThreatOrder();
    this.getSafetyDays();
    this.get24TrendsData();
    this.getTrendsManagement();
  },
  beforeDestroy() {
    // 关闭连接
    websocket.close();
  },
  methods: {
    // 获取威胁管理数据
    getTrendsManagement(){
      this.trendsManagementLoading = true;
      let currentDay = new Date().format("yyyy-MM-dd");
      let params = {
        paramJson: JSON.stringify({
          startTime: currentDay+ "T00:00:00.000+0000"
        })
      }
      getChartDataParam({ id: "202312081822257260000", ...params }).then(({ data = {} }) => {
        const { resultData = [] } = data;
        let total = resultData?.length && resultData[0] && resultData[0].count || 0;
        if( total ){
          getChartDataParam({ id: "202312081724101540000", ...params }).then(({ data = {} }) => {
            const { resultData = [] } = data;
            resultData.forEach(item =>{
              item.repair = this.calcPercent(item.count, total);
            })
            this.threatTypeData = resultData;
          }).finally(() => {
            this.trendsManagementLoading  = false;
          })
        }else{
          this.trendsManagementLoading  = false;
          this.threatTypeData = [];
        }
      })
    },
    calcPercent(a, b) {
      let per = (a / b * 100).toFixed(0);
      if(per == 100 && a != b) {
        per = 99;
      }
      if(per == 0 && a != 0) {
        per = 1;
      }
      return Number(per);
    },
    // 获取趋势数据
    get24TrendsData(){
      this.trendsDataLoading  = true
      getChartDataParam({ id: "202312081523528910005" }).then(({ data = {} }) => {
        const { resultData = [] } = data;
        this.trendsData = resultData;
      }).finally(() => {
        this.trendsDataLoading  = false;
      })
    },
    /**
     * @description: 获取实时威胁告警数据
     */
    async getThreatAlarm() {
      const params = { id: "202312061409325540000" };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        this.threatAlarmData = resultData
        const distance = this.threatAlarmData.length * 75;
        const second = this.threatAlarmData.length * 3;
        document.documentElement.style.setProperty(`--top-distance`, `-${ distance }px`);
        document.documentElement.style.setProperty(`--scroll-second`, `${ second }s`);
      } catch (e) {
        console.warn(e)
      }
    },
    /**
     * @description: 监听实时威胁告警动画播放状态
     */
    listenAlarmScroll() {
      const scrollbarRef = this.$refs.scrollbarRef;
      scrollbarRef.addEventListener("webkitAnimationEnd",  async () => {
        scrollbarRef.classList.remove("animation")
        await this.getThreatAlarm();
        scrollbarRef.classList.add("animation")
      }, false)
    },
    /**
     * @description: 获取最新实时威胁告警数据
     */
    getNewAlarmData() {
      const newAlarmStore = [];
      let timer = null;
      websocket.init((res) => {
        try {
          newAlarmStore.unshift(JSON.parse(JSON.parse(res.data).message));
          if (this.newAlarmData.length === 0) {
            this.newAlarmData.push(newAlarmStore.pop());
          }
          if (timer !== null) {
            clearInterval(timer);
          }
          timer = setInterval(() => {
            this.newAlarmData.pop();
            if (newAlarmStore.length > 0) {
              this.newAlarmData.push(newAlarmStore.pop());
            } else {
              clearInterval(timer);
            }
          }, 3000)
        } catch (e) {
          console.info(e);
        }
      });
    },
    async getAppSystemNameList() {
      const params = { id: "202312061432578890000" };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        this.appSystemNameList = this.parseAttack(resultData, 'left')
      } catch (e) {
        console.warn(e)
      }
    },
    async getDataSourceList() {
      const params = { id: "202312061433238750001" };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        this.dataSourceList = this.parseAttack(resultData, 'left')
      } catch (e) {
        console.warn(e)
      }
    },
    async getAlarmTypeList() {
      const params = { id: "202312051409075270040" };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        this.alarmTypeList = this.parseAttack(resultData, 'right')
      } catch (e) {
        console.warn(e)
      }
    },
    async getVulnTypeList() {
      const params = { id: "202312051011555830011" };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        this.vulnTypeList = this.parseAttack(resultData, 'right')
      } catch (e) {
        console.warn(e)
      }
    },
    /** 随机边距 随机颜色透明度 随机行高 随机字体大小 **/
    parseAttack(resList, type) {
      resList.forEach((item) => {
        function random(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
        item.left = random(1, 50)
        item.lineHeight = random(30, 60)
        let opacity = random(30, 100) / 100
        item.color = type == 'left' ? `rgba(0, 255, 255, ${opacity})` : `rgba(255, 205, 0, ${opacity})`
        item.fontSize = random(16, 28)
      })
      return resList
    },
    // 累计监测攻击
    async getAccMonAttack() {
      const params = { id: "202312081445588600001" };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        let isUnit = resultData[0].count >= 100000000 ? true : false
        let n = resultData[0].count >= 100000000 ? 1 : 0
        this.accMonAttack = resultData[0].count ? formatNumber(resultData[0].count, n, ".", ",", isUnit) + (isUnit ? '+' : '') : 0
      } catch (e) {
        console.warn(e)
      }
    },
    // 累计封堵攻击
    async getAccFlugAttack() {
      const params = { id: "202312081452225110003" };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        let isUnit = resultData[0].count >= 100000000 ? true : false
        let n = resultData[0].count >= 100000000 ? 1 : 0
        this.accFlugAttack = resultData[0].count ? formatNumber(resultData[0].count, n, ".", ",", isUnit) + (isUnit ? '+' : '') : 0
      } catch (e) {
        console.warn(e)
      }
    },
    // 安全运行天数
    async getSafetyDays() {
      const params = { id: "202312071035032310000" };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        this.safetyDays = resultData[0].daysDiff.toString().split('')
      } catch (e) {
        console.warn(e)
      }
    },
    // 安全分析原始数据
    async getRawData() {
      let currentDay = new Date().format("yyyy-MM-dd");
      let time = currentDay + 'T00:00:00.000+0000'
      const params = {
        id: "202312051421146070041",
        paramJson: JSON.stringify({startTime: time})
      };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        let isUnit = resultData[0].count >= 100000000 ? true : false
        let n = resultData[0].count >= 100000000 ? 1 : 0
        this.rawData = resultData[0].count ? formatNumber(resultData[0].count, n, ".", ",", isUnit) + (isUnit ? '+' : '') : 0
      } catch (e) {
        console.warn(e)
      }
    },
    // 威胁处置工单(条/日)
    async getThreatOrder() {
      const params = { id: "202312050959122920010" };
      try {
        const { data: { resultData } } = await getChartDataParam(params)
        let isUnit = resultData[0].num >= 100000000 ? true : false
        let n = resultData[0].num >= 100000000 ? 1 : 0
        this.threatOrder = resultData[0].num ? formatNumber(resultData[0].num, n, ".", ",", isUnit) + (isUnit ? '+' : '') : 0
      } catch (e) {
        console.warn(e)
      }
    },
  }
}
</script>

<style scoped lang="less">
.secure-header {
  display: flex;
  justify-content: space-between;
  .secure-header-total {
    width: 600px; height: 228px;
    background: url("/@/assets/images/screen-sec/secure-total-bg.png") center center
    no-repeat;
    line-height: 228px; text-align: center;
    font-size: 32px; color: #8FADCC;
    i {
      font-size: 43px;
      font-family: Roboto-BoldCondensedItalic, Roboto;
      font-weight: normal;
      color: #EEEEEE;
      line-height: 51px;
      text-shadow: 0px 0px 23px #2096F7;
      margin-left: 27px;
    }
  }
  .secure-header-days {
    align-items: center;
    span.day-text {
      font-size: 40px;
      color: #05CFF7;
      line-height: 52px;
      background: linear-gradient(180deg, #FFFFFF 0%, #00B6F9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-right: 10px;
    }
    div.days {
      display: flex;
      align-items: center;
      & > * {
        margin: 0 5px;
      }
      span {
        width: 64px;
        height: 87px;
        line-height: 87px;
        display: inline-block;
        background: url("/@/assets/images/screen-sec/days-bg.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        font-size: 43px;
        font-weight: normal;
        color: #FFFFFF;
        letter-spacing: 3px;
      }
      .el-image {
        width: 55px;
      }
    }
  }
}
.secure-body {
  height: 100%;
  .showcase {
    align-items: center;
    .sidebar:last-child {
      flex-direction: row-reverse;
      > div:last-child {
        .el-image {
          transform: translateX(30px);
        }
      }
    }
    .sidebar {
      display: flex;
      align-items: center;
      text-align: center;
      font-weight: normal;
      color: #EEEEEE;
      line-height: 63px;
      text-shadow: 0 0 23px #0E6BB6;
      > div:first-child {
        p {
          font-size: 53px;
          transform: translateY(65px);
        }
        .el-image {
          width: 80%;
        }
        span {
          font-size: 28px;
          background-color: rgba(0, 16, 55, 0.8);
          display: inline-block;
          width: 320px;
          height: 74px;
          border: 2px solid;
          border-image: linear-gradient(to left, #5DA9FF, #00519C) 1;
          font-weight: 500;
          color: #CCDDFF;
        }
      }
      > div:last-child {
        span {
          font-size: 20px;
          font-weight: 500;
          color: #CCDDFF;
          line-height: 28px;
        }
        .el-image {
          width: calc(100% + 30px);
          transform: translateX(-30px);
        }
      }
    }
    .content {
      height: 100%;
      position: relative;
      .center-wrap {
        height: 700px;
      }
      .model-bg{
        height: 590px;
        width: 100%;
        position: absolute;
        background: url("/@/assets/images/screen-sec/secure-main-bg.png") no-repeat left bottom;
        background-size: contain;
        bottom: 0;
      }
      .model-wrap {
        .ball-box{
          width: 292px;
          height: 292px;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          .ball-warp{
            width: 100%;
            height: 100%;
            background: url("/@/assets/images/screen-sec/ball-warp.png") no-repeat center center;
            background-size: 100% 100%;
            position: absolute;
            animation: rotate 15s linear infinite;
          }
          .ball{
            width: 232px;
            height: 232px;
            position: absolute;
            transform: translate(-50%,-50%);
            top: 50%;
            left: 50%;
            .ball-image{
              width: 100% !important;
              height: 100% !important;
              animation: rotate 15s linear infinite;
            }
          }
          .ai{
            width: 160px;
            height: 146px;
            background: url("/@/assets/images/screen-sec/secure-ai.png") no-repeat center center;
            background-size: 100% 100%;
            position: absolute;
            transform: translate(-50%,-50%);
            top: 50%;
            left: 50%;
          }
        }
      }
    }
  }
  .card-box {
    .card-head {
      background: unset;
      position: relative;
      .unit{
        position: absolute;
        font-size: 24px;
        color: #7893B2;
        top: 30px;
        right: 40px;
      }
      .el-image {
        margin-left: 10px;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 40%;
        width: 400px;
        height: 20px;
        background-image: linear-gradient(to left, rgba(0, 208, 255, 0), rgba(0, 208, 255, 0.5));
      }
    }
    .card-body {
      padding: 20px 0;
      .table-box {
        ul {
          list-style: none;
          overflow: hidden;
          background-color: rgba(47, 132, 206, 0.2);
          li {
            float: left;
            width: 20%;
            font-size: 24px;
            color: #ABCDF2;
            padding: 10px 10px;
            text-align: left;
            &.threat-Type{
              width: 38%;
            }
            &.threat-Type-repair{
              width: 40%;
            }
            &.threat-Type-num{
              width: 22%;
            }
            &.alarm-level{
              width: 15%;
            }
            &.alarm-time{
              width: 25%;
            }
          }
        }
        .table-body {
          max-height: 450px;
          overflow-y: auto;
          &::-webkit-scrollbar {
            display: none;
          }
          .scrollbar {
            ul {
              li {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                height: 75px;
                line-height: 75px;
              }
            }
          }
          .scrollbar.animation {
            transform: translateY(0);
            animation: scroll-top var(--scroll-second) linear 1;
            @keyframes scroll-top {
              form {
                transform: translateY(0);
              }
              to {
                transform: translateY(var(--top-distance));
              }
            }
          }
          .scrollbar.new {
            position: relative;
            ul {
              width: 100%;
              li:first-child {
                position: relative;
                &::before {
                  content: "new";
                  position: absolute;
                  left: 0;
                  top: 0;
                  background: red;
                  border-radius: 4px;
                  height: 30px;
                  line-height: 30px;
                  padding: 0 4px;
                  color: #ffffff;
                }
              }
            }
            /* 1. 声明过渡效果 */
            .fade-move,
            .fade-enter-active,
            .fade-leave-active {
              transition: all 0.5s ease;
            }
            /* 2. 声明进入和离开的状态 */
            .fade-enter-from,
            .fade-leave-to {
              opacity: 0;
              transform: translateX(30px);
            }
            /* 3. 确保离开的项目被移除出了布局流
                  以便正确地计算移动时的动画效果。 */
            .fade-leave-active {
              position: absolute;
            }
          }
          ul:nth-child(1n) {
            background-color: transparent;
          }
          ul:nth-child(2n) {
            background-color: rgba(23, 100, 169, 0.1);
          }
          :deep(.level_label){
            padding:  8px !important;
            line-height: 40px;
            height: 40px;
            font-size: 24px;
            &.level4 {
              border: 1px solid rgba(161, 213, 242, 0.3);
              background: rgba(161, 213, 242, 0.2);
              color: rgba(161, 213, 242, 1);
            }
            &.level3 {
              border: 1px solid rgba(194, 128, 255, 0.3);
              background: rgba(194, 128, 255, 0.2);
              color: rgba(194, 128, 255, 1);
            }
            &.level2 {
              border: 1px solid rgba(255, 200, 54, 0.3);
              background: rgba(255, 200, 54, 0.2);
              color: rgba(255, 200, 54, 1);
            }
            &.level1 {
              border: 1px solid rgba(207, 19, 34, 0.3);
              background: rgba(207, 19, 34, 0.2);
              color: rgba(207, 19, 34, 1);
            }
          }
          :deep(.alarmTypeLabel){
            &.level4 {
              color: rgba(161, 213, 242, 1);
            }
            &.level3 {
              color: rgba(194, 128, 255, 1);
            }
            &.level2 {
              color: rgba(255, 200, 54, 1);
            }
            &.level1 {
              color: rgba(207, 19, 34, 1);
            }
          }
          :deep(.tooltip){
            height: 100%;
            .tooltip-content{
              height: 100%;
              line-height: 55px;
            }
          }
          .flex-wrap{
            display: flex;
            align-items: center;
            height: 100%;
            :deep(.el-bg-inner-running) {
              width: 100%;
              .el-progress-bar__inner {
                height: 8px;
                background: linear-gradient(270deg, #02A6F9 0%, rgba(2, 166, 249, 0.15) 100%);

                &::after {
                  width: 34px;
                  height: 48px;
                  background: url("/@/assets/images/screen-sec/active_repair.png") no-repeat center center;
                  position: absolute;
                  top: -20px;
                  right: -17px;
                }
              }
              .el-progress-bar__outer {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 4px;
                z-index: 1;
                overflow: visible; // 关键
              }
              .el-progress-bar{
                width: 80%;
              }
              .el-progress__text{
                font-size: 24px !important;
                font-weight: bold;
                color: #02A6F9;
              }
            }
          }
          ul.right-threat-Type-box li{
            height: 75px;
            line-height: 75px;
          }
        }
      }
    }
  }
}
:deep(.el-loading-mask){
  background-color: hsla(0, 0%, 100%, 0);
}
:deep(.el-loading-spinner .path){
  stroke: #57f4fd;
}
.trendsChars-box{
  width: 100%;
  height: 340px;
}
/* 360°旋转动画 */
@keyframes rotate{
  /* 需要兼容的自行补入噢 */
  0%{transform:rotate(0deg);}
  100%{transform:rotate(360deg);}
}
</style>
<style lang="less">
.alarm-tooltip-popper {
  font-size: 28px;
}
</style>
