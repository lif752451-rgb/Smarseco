<template>
  <div class="screen-page" ref="screen">
    <el-row class="screen-head" type="flex">
      <el-col :span="8">
        <el-row class="left-date" type="flex">
          <el-image :src="util.getAssetsImages('home/time-icon.png')"></el-image>
          <p :class="{ active: dateType === 'week' }" @click="handleSelectDate('week')">最近7天</p>
          <p :class="{ active: dateType === 'today' }" @click="handleSelectDate('today')">今天</p>
        </el-row>
      </el-col>
      <el-col :span="8">
        <div class="center-title"><el-image :src="util.getAssetsImages('home/head-title.png')"/></div>
      </el-col>
      <el-col :span="8">
        <el-image @click="toggleFullScreen($refs.screen)" class="right-icon" :src="util.getAssetsImages('home/full-screen-icon.png')"/>
      </el-col>
    </el-row>
    <el-scrollbar class="overall-scrollbar">
      <el-row :gutter="20" class="cockpit-wrap">
        <el-col :span="6">
          <left-sidebar
            class="sidebar" ref="leftSidebar" @open="openChartDialog"
          />
        </el-col>
        <el-col :span="12">
          <center-main
            class="center-main" ref="centerMain" @open="openChartDialog"
          />
        </el-col>
        <el-col :span="6">
          <right-sidebar
            class="sidebar" ref="rightSidebar" @open="openChartDialog"
          />
        </el-col>
      </el-row>
    </el-scrollbar>
    <chart-dialog v-if="chartOption.visible" :option="chartOption" @close="chartOption.visible = false"/>
  </div>
</template>
<script>
import leftSidebar from './components/leftSidebar.vue';
import { toggleFullScreen } from "/@/utils/util.web";
import centerMain from './components/centerMain.vue';
import rightSidebar from './components/rightSidebar.vue';
import { dateCalculator } from "/@/utils/old/DateCalculator";
import chartDialog from './components/chartDialog.vue';
import util from '/@/utils';
export default {
  name: 'scp-command-operate-netsecurity',
  components: {
    leftSidebar,
    rightSidebar,
    centerMain,
    chartDialog
  },
  data () {
    return {
      util,
      dateType: '',
      chartOption: {
        title: '',
        data: [],
        total: 0,
        type: '',
        legend: [],
        visible: false,
        loopData: []
      }
    }
  },
  mounted() {
    this.handleSelectDate('week');
  },
  methods: {
    toggleFullScreen,
    /** 选择日期 */
    handleSelectDate(type) {
      this.dateType = type
      const params1 = {}, params2 = {};
      if (type === 'week') {
        params1.startTime = dateCalculator.getDistanceToday(-7, false) + ' 00:00:00'
        params1.endTime = dateCalculator.dateFormat(false) + ' 23:59:59'
        params2.startTime = dateCalculator.getDistanceToday(-14, false) + ' 00:00:00'
        params2.endTime= dateCalculator.getDistanceToday(-7, false) + ' 23:59:59'
      } else {
        params1.startTime = dateCalculator.dateFormat(false) + ' 00:00:00'
        params1.endTime = dateCalculator.dateFormat(false) + ' 23:59:59'
        params2.startTime = dateCalculator.getDistanceToday(-1, false) + ' 00:00:00'
        params2.endTime = dateCalculator.getDistanceToday(-1, false) + ' 23:59:59'
      }
      this.$nextTick(() =>{
        this.$refs.leftSidebar.getSickAssetRate(params1, params2)
        this.$refs.centerMain.getKeySafeguard(params1)
        this.$refs.centerMain.getTopologicalMap(params1)
        this.$refs.centerMain.getRiskMonitoring(params1)
        this.$refs.rightSidebar.getAlarmLoop(params1)
        this.$refs.rightSidebar.getAlarmTOP5(params1)
        this.$refs.rightSidebar.getAttackDistributeTOP5(params1)
        this.$refs.rightSidebar.getInterceptRingRate(params1, params2)
        this.$refs.rightSidebar.getInfectedTerminalTOP5(params1)
      })
    },

    /** 打开图表会话框 */
    openChartDialog(...args) {
      Object.entries(this.chartOption).forEach(([key], idx) => {
        this.chartOption[key] = args[idx]
      })
      if (this.chartOption.type === 'safetScore') {
        this.chartOption.data.forEach(i => i.scoreTotal = i.safetyScore)
      }
      if (this.chartOption.type === 'deptRiskAvg') {
        this.chartOption.data.forEach(i => i.riskAvgTotal = i.riskAvgNumber)
      }
      if (this.chartOption.type === 'deptBugFix') {
        this.chartOption.data.forEach(i => i.bugFixPCTTotal = i.bugFixPCT)
      }
      this.chartOption.total && (this.chartOption.title += `（${ this.chartOption.total }）`)
      this.chartOption.visible = true
    }
  }
}
</script>

<style scoped lang="less">
.screen-page {
  background: url("/@/assets/images/home/screen-bg.png") center center no-repeat;
  background-size: 100% 100%; padding: 0; overflow: auto;
  .overall-scrollbar {
    height: calc(100vh - 138px) !important;
    :deep(.el-scrollbar__thumb) {
      display: none !important;
    }
    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }
  }
  .screen-head {
    background: url("/@/assets/images/home/head-bg.png") center center no-repeat;
    background-size: 105% 100%; margin: 0; height: 90px; padding: 20px 20px;
    .left-date {
      padding: 0 0 0 10px;
      p {
        margin-left: 6px; font-size: 16px; color: #999999;
        cursor: pointer; margin-right: 50px;
      }
      p.active { color: #06EDFF }
    }
    .center-title {
      width: 348px; margin: 0 auto;
    }
    .right-icon { float: right; }
  }
  :deep(.cockpit-wrap){
    padding: 0 20px;
    .sidebar, .center-main {
      .chart-title {
        color: #FFFFFF; padding: 0 0 10px 30px; position: relative;
        margin-bottom: 20px;
        &:before {
          content: url("/@/assets/images/home/card-subtitle-dec.png");
          position: absolute; top: 2px; left: 0;
        }
      }
      .chart-title-border { border-bottom: 1px solid #0043A4;width: 100%; }
      .card-wrap {
        margin-top: 20px; padding: 16px;
        background-image: linear-gradient(0deg, rgba(0,6,74,0.21) 0%, rgba(0,6,73,0.23) 100%);
        box-shadow: inset 0 0 54px 0 rgba(44,0,255,0.50); position: relative;
        border: solid 1px rgba(#227FFD, 0.6);
        .card-top {
          color: #FFFFFF; padding-left: 30px; position: relative;
          font-size: 20px;
          &:before {
            content: url("/@/assets/images/home/card-title-dec.png");
            width: 20px; height: 20px; position: absolute;
            top: 2px; left: 0;
          }
        }
        .card-cont {
          padding-top: 20px; height: 310px; position: relative;
          &:before {
            content: url("/@/assets/images/home/corner-box.png");
            position: absolute; left: -16px; bottom: -16px; transform: scaleY(-1);
          }
          &:after {
            content: url("/@/assets/images/home/corner-box.png");
            position: absolute; right: -16px; bottom: -16px; transform: scale(-1);
          }
          .card-cont-total {
            .total-box {
              background: rgba(65,81,241,0.12); border: 1px solid rgba(108,241,245,0.34);
              box-shadow: inset 0 0 18px 0 rgba(26,255,200,0.32); padding: 10px 0;
              .el-image { width: 60px }
              .total{
                color: #FFFFFF;
                p { margin-bottom: 4px; font-size: 13px; }
                span {
                  font-family: PingFangSC-Regular; font-size: 20px;
                  color: #FFFFFF; font-weight: 400;
                  i { font-size: 11px; font-style: normal }
                }
              }
            }
          }
          .card-cont-dashboard {
            padding: 20px;
            .chart-box {
              height: 100px; width: 95px; background: transparent;
              margin: 0 auto;
            }
            .chart-name {
              margin-top: 10px; font-size: 12px; color: #FFFFFF;
              text-align: center; font-weight: 400;
            }
          }
          .card-cont-left-dashboard {
            .chart-wrap {
              background-image: linear-gradient(0deg, rgba(0,6,74,0.21) 0%, rgba(0,6,73,0.23) 100%);
              box-shadow: inset 0 0 32px 0 rgba(25 , 104, 255, 1); position: relative;
              padding: 40px 5px; text-align: center; color: #FFFFFF; border-radius: 10px;
              .chart-box {
                height: 100px; background: transparent; width: 111px; margin: 0 auto 20px;
              }
              .chart-text {
                span { font-size: 10px }
                .caret-top { color: #FF4158 }
                .caret-bottom { color: #00ff9e }
              }
            }
          }
          .card-cont-right-progress {
            padding-left: 16px;
            .progress-list {
              .progress-item {
                background-image: radial-gradient(circle at 16% 4.3%, rgba(0,255,200,0.20) 0%, rgba(85,0,255,0.15) 89%);
                border-radius: 16px; padding: 6px 0 6px 6px; margin-bottom: 11px;
                .deptName {
                  .ivu-tooltip {
                    width: 100%;
                    p {
                      font-size: 12px; color: #FFFFFF; overflow: hidden;
                      white-space: nowrap; text-overflow: ellipsis;
                    }
                  }
                }
                .progress {
                  display: flex; justify-content: space-between;
                  align-items: center;
                  .el-progress {
                    width: calc(100% - 30px);
                    .el-progress-bar__outer {
                      background: transparent; border: solid 1px rgba(0,72,255,0.30);
                      .el-progress-bar__inner {
                        background-image: linear-gradient(90deg, #00E2FF 6%, #0068FF 100%);
                      }
                    }
                  }
                  .total {
                    width: 30px; color: #00F9FF; white-space: normal;
                    overflow: hidden; text-overflow: ellipsis; text-align: right;
                  }
                }
              }
            }
          }
        }
        div::-webkit-scrollbar {
          width: 0; height: 0;
        }
        &:before {
          content: url("/@/assets/images/home/corner-box.png");
          position: absolute; left: 0; top: 0;
        }
        &:after {
          content: url("/@/assets/images/home/corner-box.png");
          position: absolute; right: 0; top: 0; transform: scaleX(-1);
        }
      }
    }
  }
}
</style>
