<template>
  <div class="center-main">
    <el-row class="key-support">
      <el-col :span="12">
        <div
          class="image-box"
          :style="{ 'background-image': `url(${ util.getAssetsImages(`home/assets-${ attackResult.asset }-bg.png`) })` }">
        </div>
      </el-col>
      <el-col :span="12">
        <div
          class="image-box"
          :style="{ 'background-image': `url(${ util.getAssetsImages(`home/area-${ attackResult.area }-bg.png`) })` }">
        </div>
      </el-col>
    </el-row>
    <el-row class="data-center">
      <el-row>
        <el-col :span="8">
          <el-image :src="util.getAssetsImages('home/data-center-head-bg.png')"/>
        </el-col>
        <el-col :span="8">.</el-col>
        <el-col :span="8">
          <el-image style="transform: scaleX(-1)" :src="util.getAssetsImages('home/data-center-head-bg.png')"/>
        </el-col>
      </el-row>
      <div class="topological-map-wrap">
        <div class="title">
          <el-image style="width: 100px" :src="util.getAssetsImages('home/data-center-text.png')"></el-image>
        </div>
        <el-row class="topological-list" type="flex" justify="space-between" align="middle">
          <div class="topological-item" v-for="(item, key) in areaList" :key="key">
            <div class="topological">
              <transition name="fade">
                <el-popover
                  popper-class="topological-popover-box" style="background: red"
                  placement="bottom" width="220" trigger="hover" 
                  :teleported="false" :show-arrow="false"
                >
                  <div class="popover-cont">
                    <h6>
                      <span :class="`${ item.attackResult }`"></span>
                      {{ item.areaName }}：{{  filterStatus(item.attackResult) }}
                    </h6>
                    <ul>
                      <li v-for="(ip, key) in (item.ipList || []).slice(0, 5)" :key="key">{{ ip }}</li>
                    </ul>
                  </div>

                  <template #reference>
                    <img :src="util.getAssetsImages(`home/data-center-${ item.attackResult }${ item.attackResult === 'other' ? '1' : imgIndex }.png`)"
                         class="img" :key="imgIndex"  alt="">
                  </template>
                </el-popover>
              </transition>
            </div>
            <div class="area-name">{{ item.areaName }}</div>
          </div>
        </el-row>
      </div>
    </el-row>
    <el-row class="card-wrap safety-evaluation">
      <el-row class="chart-warp">
        <div class="card-top">各部门安全评价</div>
        <div class="card-cont">
          <div @click="$emit('open', '各部门安全评价', safetScoreList, null, 'safetScore')" class="chart-box" ref="evaluation"></div>
        </div>
      </el-row>
    </el-row>
    <el-row class="card-wrap risk-monitor">
      <el-row class="chart-warp">
        <div class="card-top">攻击监测</div>
        <el-row class="card-cont">
          <el-col class="risk-monitor-left" :span="12">
            <div class="funnel-diagram-box">
              <div :class="['funnel-diagram', `funnel-diagram${ riskFunnelList.length }`] ">
                <ul>
                  <li v-for="(item, key) in riskFunnelList" :key="key">{{ item.name }}</li>
                </ul>
              </div>
            </div>
          </el-col>
          <el-col class="risk-monitor-right" :span="12">
            <div class="table-name">攻击拦截TOP5</div>
            <div class="table-box">
              <el-row class="table-head">
                <el-col :span="3">排名</el-col>
                <el-col :span="15">安全设备</el-col>
                <el-col :span="6">拦截数</el-col>
              </el-row>
              <el-row class="table-row" v-for="(item, key) in interceptionList" :key="key">
                <el-col :class="['rank', `rank${ key + 1 }`]" :span="3">{{ key + 1 }}</el-col>
                <el-col class="name" :span="15">{{ item.name }}</el-col>
                <el-col class="total" :span="6">{{ item.count }}</el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import { reqSafeguard, reqTopological, reqCockpitData } from '/@/api/scp/screen';
import { dateCalculator } from '/@/utils/old/DateCalculator';
import echarts from "/@/utils/old/echartsUI";
import util from '/@/utils';
export default {
  name: 'centerMain',
  props: {
  },
  data() {
    return {
      util,
      attackResult: {
        area: 'other',
        asset: 'other'
      },
      areaList: [],
      imgIndex: 1,
      timer: null,
      interceptionList: [],
      riskFunnelList: [],
      safetScoreList: []
    }
  },
  mounted() {
    this.generateEvaluationChart()
    echarts.init(this.$refs.evaluation).resize()
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    /** 获取重点保护状态 */
    getKeySafeguard (params) {
      reqSafeguard(params).then(({ data }) => {
        const { areaAttackResult, assetAttackResult } = data
        this.attackResult.area = areaAttackResult
        this.attackResult.asset = assetAttackResult
      })
    },
    /** 获取拓扑图数据 */
    getTopologicalMap(params) {
      reqTopological(params).then(({ data }) => {
        this.areaList = data.slice(0, 5)
        const index = this.areaList.findIndex(i => i.attackResult !== 'other')
        index >= 0 && this.setRotationTimer()
      })
    },
    /** 生成安全评价图表 */
    generateEvaluationChart () {
      const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { textStyle: { color: '#9CC9FF' } },
        grid: { left: '3%', right: '3%', bottom: '0%', top: '12%', containLabel: true },
        xAxis: {
          type: 'category', data: [],
          axisLabel: { textStyle:
              { color: '#9CC9FF' }, rotate: 45 },
          axisLine: {lineStyle: {color: '#9CC9FF'}},
        },
        yAxis: {
          type: 'value', axisLabel: {textStyle: {color: '#9CC9FF'}},
          splitLine: {show: true, lineStyle: {color: ['rgba(205,211,255,0.21)'], type: 'solid'}},
        },
        color: '#00ECFF',
        series: [
          { data: [], type: 'bar', barWidth: 15, itemStyle: {
              normal: { color: new echarts.graphic.LinearGradient(
                  0, 1, 0, 0, [
                    { offset: 0, color: '#3D00FF' },
                    { offset: 1, color: '#1CFFDF' }]
                ) }
            }, label: {
            show: true, position: 'top', color: '#FFFFFF'
          } }
        ]
      }
      const param = { id: '202211151802395550009' }
      reqCockpitData(param).then(({ data: { resultData } }) => {
        this.safetScoreList = resultData
        resultData.slice(0, 15).forEach(i => {
          option.xAxis.data.push(i.deptName)
          option.series[0].data.push(i.safetyScore)
        })
        echarts.init(this.$refs.evaluation).setOption(option)
      })
    },
    /** 设置图片轮播定时器 */
    setRotationTimer() {
      this.timer = setInterval(() => {
        this.imgIndex ++;
        if(this.imgIndex === 4) this.imgIndex = 1
      }, 500)
    },
    /** 获取风险监测 */
    getRiskMonitoring (param) {
      const params = {
        id: '202211161632475910005',
        paramJson: JSON.stringify({
          startTime: dateCalculator.toBJTime(param.startTime),
          endTime: dateCalculator.toBJTime(param.endTime)
        })
      }
      reqCockpitData(params).then(({ data: { resultData } }) => {
        if (resultData) {
          this.riskFunnelList = this.interceptionList = resultData.slice(0, 5)
        }
      })
    },
    filterStatus(val) {
      const map = new Map([
        ['other', '安全'], ['fail', '警告'], ['win', '危险']
      ])
      return map.get(val)
    }
  }
}
</script>
<style scoped lang="less">
.center-main {
  .key-support {
    margin-top: 20px;
    .image-box {
      width: 80%; height: 80px; line-height: 70px;
      background-position: center center; background-repeat: no-repeat;
      background-size: contain; text-align: center;
      font-size: 24px; font-weight: normal; color: #FFFFFF;
      padding-left: 20px; margin: 0 auto;
    }
  }
  .data-center {
    margin-top: 16px;
    .topological-map-wrap {
      width: 100%;
      background: url("/@/assets/images/home/data-center-bg.png") 50% 8% no-repeat;
      background-size: 218px 161px;
      .title {
        text-align: center; font-size: 18px; font-weight: bold;
      }
      .topological-list {
        background: url("/@/assets/images/home/data-center-circle.png") center center no-repeat;
        height: 278px; width: 630px; margin: 0 auto; padding: 30px 0 30px;
        background-size: 95%;
        & div:nth-child(2),
        & div:nth-child(3),
        & div:nth-child(4){ align-self: flex-end; }
        .topological-item {
          .topological {
            position: relative; width: 100px; height: 100px;
            .img {
              width: 100px; height: 100px; position: absolute
            }
            .fade-enter-active, .fade-leave-active {
              transition: opacity .5s;
            }
            .fade-enter, .fade-leave-to {
              opacity: 0;
            }
          }
          .area-name { font: italic bold 20px 微软雅黑; color: rgba(256, 256, 256, 0.4); }
        }
      }
    }
  }
  .safety-evaluation {
    margin-top: 20px;
    .chart-warp {
      width: 100%;
      .card-cont { height: 250px!important; width: 100%;}
      .chart-box {
        height: 200px; width: 100%; background: transparent;
      }
    }
  }
  .risk-monitor {
    .chart-warp,.card-cont{
      width: 100%;
    }
    .risk-monitor-left {
      .funnel-diagram-box {
        width: 90%; margin: 40px auto 0; background: rgba(5, 0, 100, 0.8);
        padding: 10px;
        .funnel-diagram {
          background-image: url("/@/assets/images/home/funnel-one-column.png");
          background-position: center center; background-repeat: no-repeat;
          background-size: 100% 100%; height: 200px;
          ul {
            list-style: none; text-align: center; color: rgba(22, 183, 220, 0.8);
            line-height: 150px;
          }
        }
        .funnel-diagram2 {
          background-image: url("/@/assets/images/home/funnel-two-column.png");
          ul { line-height: 95px; }
        }
        .funnel-diagram3 {
          background-image: url("/@/assets/images/home/funnel-three-column.png");
          ul { line-height: 65px }
        }
        .funnel-diagram4 {
          background-image: url("/@/assets/images/home/funnel-four-column.png");
          ul { line-height: 48px }
        }
        .funnel-diagram5 {
          background-image: url("/@/assets/images/home/funnel-five-column.png");
          ul {  line-height: 39px }
        }
      }
    }
    .risk-monitor-right {
      .table-name {
        color: #FFFFFF; padding: 0 0 10px 30px; position: relative;
        margin-bottom: 20px; border-bottom: 1px solid #0043A4;
        &:before {
          content: url("/@/assets/images/home/card-subtitle-dec.png");
          position: absolute; top: 2px; left: 0;
        }
      }
      .table-box {
        text-indent: 10px;
        .table-head {
          text-align: left; font-size: 12px; color: #00F9FF;
          line-height: 14px;
        }
        .table-row {
          background-image: radial-gradient(circle at 16% 4.3%, rgba(0,255,200,0.20) 0%, rgba(85,0,255,0.15) 89%);
          border-radius: 15px; line-height: 30px; color: #FFFFFF; margin-top: 11px;
          .rank { font-size: 14px }
          .rank1 { color: #FF6900; font-weight: bold; font-size: 18px }
          .rank2 { color: #00FF9E; font-weight: bold; font-size: 18px }
          .rank3 { color: #00F9FF; font-weight: bold; font-size: 18px }
          .name { color: #00F9FF; font-size: 16px }
          .total { font-size: 12px }
        }
      }
    }
  }
}
</style>
<style lang="less">
.topological-popover-box {
  background: #11184d !important; 
  color: #FFFFFF !important; border: none;
  box-shadow: 0 0 8px #E0E6ED;
  .popover-cont {
    h6 {
      padding: 0 0 0 30px; position: relative; font-size: 14px;
      font-weight: normal;
      span {
        border-radius: 50%; position: absolute; left: 0; top: 3px;
        width: 13px; height: 13px; display: block;
      }
      span.other { background: #03BF16 }
      span.fail { background: orange }
      span.win { background: red }
    }
    ul {
      padding: 0 0 0 30px; list-style-type: none; margin-top: 6px;
    }
  }
}
</style>
