<template>
  <el-col :span="6" style="height: 100%">
    <div class="card-box">
      <div class="card-head">
        <el-image :src="util.getAssetsImages('screen-sec/small-title-7.png')"></el-image>
      </div>
      <div class="card-body">
        <div v-loading="gaugeLoading">
          <chartGauge class="chartGauge" :data="gaugeData" :level="level"></chartGauge>
          <div class="repair-warp-box">
            <div class="repair-item first">
              <div class="repair-item-text">资产信息完整率</div>
              <div class="repair-item-num">{{ assetInfoIntegrityRate }}%</div>
            </div>
            <el-progress class="el-bg-inner-running" :percentage="assetInfoIntegrityRate" :show-text="false"></el-progress>
          </div>
          <div class="repair-warp-box">
            <div class="repair-item">
              <div class="repair-item-text">系统防护覆盖率</div>
              <div class="repair-item-num">{{ coverageRate }}%</div>
            </div>
            <el-progress class="el-bg-inner-running coverageRate" :percentage="coverageRate" :show-text="false"></el-progress>
          </div>
          <div class="repair-warp-box end">
            <div class="repair-item">
              <div class="repair-item-text">系统风险处置率</div>
              <div class="repair-item-num">{{ interceptionRate }}%</div>
            </div>
            <el-progress class="el-bg-inner-running" :percentage="interceptionRate" :show-text="false"></el-progress>
          </div>
        </div>
      </div>
    </div>

    <div class="card-box">
      <div class="card-head">
        <el-image :src="util.getAssetsImages('screen-sec/small-title-4.png')" />
      </div>
      <div class="card-body pt-30">
        <div class="disposal-box" v-loading="alarmLoading">
          <div class="disposal-header">
            <div class="disposal-header-item disposal-header-left">
              <el-image :src="util.getAssetsImages('screen-sec/threat-total-icon.png')"></el-image>
              <div>
                <div class="disposal-total">{{ alarmSum.alarmLoopCount }}</div>
                <div class="disposal-text">累计威胁闭环数</div>
              </div>
            </div>
            <div class="disposal-header-item disposal-header-right">
              <el-image :src="util.getAssetsImages('screen-sec/disposal_rate.png')"></el-image>
              <div>
                <div class="disposal-total">{{ alarmSum.repair }}%</div>
                <div class="disposal-text">威胁处置率</div>
              </div>
            </div>
          </div>
          <div class="chart-box-pie">
            <chartPie status="1" :data="alarmTypeList" :total="alarmSum.alarmLoopCount" />
          </div>
        </div>
      </div>
    </div>

    <div class="card-box">
      <div class="card-head">
        <el-image :src="util.getAssetsImages('screen-sec/small-title-8.png')" />
      </div>
      <div class="card-body">
        <div class="disposal-box" v-loading="loopLoading">
          <div class="disposal-header">
            <div class="disposal-header-item disposal-header-left">
              <el-image :src="util.getAssetsImages('screen-sec/vulnerability-total-icon.png')"></el-image>
              <div>
                <div class="disposal-total">{{ loopSum.vulnLoopCount }}</div>
                <div class="disposal-text">累计漏洞修复数</div>
              </div>
            </div>
            <div class="disposal-header-item disposal-header-right">
              <el-image :src="util.getAssetsImages('screen-sec/disposal_rate.png')"></el-image>
              <div>
                <div class="disposal-total">{{ loopSum.repair }}%</div>
                <div class="disposal-text">漏洞修复率</div>
              </div>
            </div>
          </div>
          <div class="chart-box-pie">
            <chartPie status="2" :data="vulnTypeList" :total="loopSum.vulnLoopCount" />
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script>
import { getChartDataParam } from '/@/api/stp/visual/visual';
import chartGauge from './chartGauge.vue';
import chartPie from "./chartPie.vue";
import util from '/@/utils';
export default {
  components: { chartPie, chartGauge },
  data() {
    return {
      util,
      alarmSum: {
        alarmLoopCount: 0,
        alarmCount: 0,
        repair: 0,
      },
      alarmTypeList: {},
      loopSum: {
        vulnLoopCount: 0,
        vulnCount: 0,
        repair: 0,
      },
      vulnTypeList: {},
      loopLoading: false,
      alarmLoading: false,
      gaugeLoading: false,
      gaugeData: 0,
      level: "",
      repairList: [],
      topLoading: false,
      assetInfoIntegrityRate: 0,
      coverageRate: 0,
    }
  },
  computed: {
    interceptionRate() {
      return Number(((this.alarmSum.repair + this.loopSum.repair)/2).toFixed(0));
    }
  },
  created() {
    this.getVulnerabilityFun();
    this.getThreatFun();
    this.getRightTopData();
  },
  methods: {
    // 获取评分
    getRightTopData(){
      this.topLoading = true;
      // 系统整体安全评分
      getChartDataParam({ id: "202312081451367260002" }).then(({ data = {} }) => {
        const { resultData = [] } = data;
        if (resultData && resultData.length) {
          this.gaugeData = resultData[0].score || 0;
          this.level = resultData[0].level || "";
        }
      })
      // 资产信息完整率
      getChartDataParam({ id: "202312081455364200004" }).then(({ data = {} }) => {
        const { resultData = [] } = data;
        if (resultData && resultData.length) {
          this.assetInfoIntegrityRate = resultData[0].assetInfoIntegrityRate || 0;
        }
      })
      // 主机防护覆盖率
      getChartDataParam({ id: "202312081424013930000" }).then(({ data = {} }) => {
        const { resultData = [] } = data;
        if (resultData && resultData.length) {
          const assetCount =  resultData[0].assetCount || 0;
          const protectionCount =  resultData[0].protectionCount || 0;
          this.coverageRate = this.calcPercent(protectionCount, assetCount);
        }
      })
    },
    getVulnerabilityFun() {
      this.loopLoading = true;
      getChartDataParam({ id: "202312041434508800000" }).then(({ data = {} }) => {
        const { resultData = [] } = data;
        if (resultData && resultData.length) {
          this.loopSum.vulnCount = resultData[0].vulnCount || 0;
          this.loopSum.vulnLoopCount = resultData[0].vulnLoopCount || 0;
          this.loopSum.repair = this.calcPercent(this.loopSum.vulnLoopCount, this.loopSum.vulnCount);
        }
        getChartDataParam({ id: "20231204144016510001" }).then(({ data = {} }) => {
          this.vulnTypeList = data;
        }).finally(() => {
          this.loopLoading = false;
        })
      })
    },
    getThreatFun() {
      this.alarmLoading = true;
      getChartDataParam({ id: "202312041148264320027" }).then(({ data = {} }) => {
        const { resultData = [] } = data;
        if (resultData && resultData.length) {
          this.alarmSum.alarmCount = resultData[0].alarmCount || 0;
          this.alarmSum.alarmLoopCount = resultData[0].alarmLoopCount || 0;
          this.alarmSum.repair = this.calcPercent(this.alarmSum.alarmLoopCount, this.alarmSum.alarmCount);
        }

        getChartDataParam({ id: "202312041352281410121" }).then(({ data = {} }) => {
          this.alarmTypeList = data;
        }).finally(() => {
          this.alarmLoading = false;
        })
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
    }
  }
}
</script>

<style scoped lang="less">
.card-body {
  padding: 30px 0 0 0 !important;
  &.pt-30{
    padding: 30px 0 20px 0 !important;
  }
  :deep(.el-loading-mask) {
    background-color: hsla(0, 0%, 100%, 0);
  }
  :deep(.el-loading-spinner .path) {
    stroke: #57f4fd;
  }
}

.disposal-box {
  .disposal-header {
    display: flex;

    .disposal-header-left {
      background: url("/@/assets/images/screen-sec/disposal-header-left.png") no-repeat center center;
    }

    .disposal-header-right {
      background: url("/@/assets/images/screen-sec/disposal-header-right.png") no-repeat center center;
    }

    .disposal-header-item {
      padding: 12px 0 20px 40px;
      width: 50%;
      display: flex;
      align-items: center;
      background-size: 100% 100%;

      .el-image {
        width: 40px;
        height: 40px;
        margin-right: 24px;
      }

      .disposal-total {
        font-size: 36px;
        font-weight: bold;
        color: #E6F4FF;
      }

      .disposal-text {
        font-size: 36px;
        font-weight: 400;
        color: rgba(183, 217, 255, 0.8);
      }
    }
  }

  .chart-box-pie {
    height: 360px;
  }
}

.repair-warp-box {
  padding:0 40px;
  &.end{
    margin-bottom: 40px;
  }
  .repair-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    margin: 25px 0;
    &.first{
      margin-top: 0;
    }
    .repair-item-text{
      font-size: 36px;
      font-weight: 500;
      color: #B2C1C8;
    }
    .repair-item-num{
      font-size: 36px;
      font-weight: bold;
      color: #B2C1C8;
    }
  }

  :deep(.el-bg-inner-running) {
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
    &.coverageRate{
      .el-progress-bar__inner {
        background: linear-gradient(270deg, #45E2E2 0%, rgba(69,226,226,0.15) 100%);
      }
    }

    .el-progress-bar__outer {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      z-index: 1;
      overflow: visible; // 关键
    }
  }
}
</style>
