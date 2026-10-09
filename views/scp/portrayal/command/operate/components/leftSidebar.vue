<template>
  <div>
    <div class="card-wrap">
      <div class="card-top">资产概览</div>
      <div class="card-cont">
        <el-row class="card-cont-total" :gutter="16">
          <el-col :span="12">
            <el-row
              class="total-box" type="flex" justify="center" align="middle"
              @click="getDialogData('资产总数', '202211151508208000000', assetOverview.assetTotal)">
              <el-image :src="util.getAssetsImages('home/assets-total-icon.png')"/>
              <div class="total">
                <p>资产总数</p>
                <span>{{ assetOverview.assetTotal }} <i>个</i></span>
              </div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row
              class="total-box" type="flex" justify="center" align="middle"
              @click="getDialogData('业务系统总数', '202211151515479930001', assetOverview.businessSystemTotal)">
              <el-image :src="util.getAssetsImages('home/business-total-icon.png')"/>
              <div class="total">
                <p>业务系统总数</p>
                <span>{{ assetOverview.businessSystemTotal }} <i>个</i></span>
              </div>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="card-cont-dashboard" :gutter="20">
          <el-col :span="8">
            <div
              class="chart-box" ref="internetRate"
              @click="getDialogData('互联网资产', '202211151522287040002', assetOverview.internetAssetTotal)">
            </div>
            <div class="chart-name">互联网资产占比</div>
          </el-col>
          <el-col :span="8">
            <div
              class="chart-box" ref="letterRate"
              @click="getDialogData('信创系统资产', '202211151527101630003', assetOverview.letterAssetTotal)">
            </div>
            <div class="chart-name">信创系统占比</div>
          </el-col>
          <el-col :span="8">
            <div
              class="chart-box" ref="integrityRate"
              @click="getDialogData('信息完整资产', '202211151538246530005', assetOverview.infoCompleteTotal)">
            </div>
            <div class="chart-name">资产信息完整率占比</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="card-wrap">
      <div class="card-top">业务系统风险</div>
      <el-row class="card-cont">
        <el-col class="card-cont-left-dashboard" :span="8">
          <div class="chart-title">资产带病率</div>
          <div class="chart-wrap">
            <div class="chart-box" ref="sickAssetRate"></div>
            <div class="chart-text">
              <p>带病率<span :class="[sickAssetRingRatio > 0 ? 'caret-top' : 'caret-bottom']">
                {{ sickAssetRingRatio > 0 ? '+' : '' }} {{ sickAssetRingRatio }}%
                <el-icon class="icon icon_img" v-if="sickAssetRingRatio > 0"><CaretTop /></el-icon>
                <el-icon class="icon icon_img" v-else><CaretBottom /></el-icon>
              </span>
              </p>
            </div>
          </div>
        </el-col>
        <el-col class="card-cont-right-progress" :span="16">
          <div class="chart-title chart-title-border">业务系统风险TOP5</div>
          <div class="progress-list">
            <el-row class="progress-item" :gutter="8"
                    v-for="(item, key) in systemRiskList" :key="key">
              <el-col class="deptName" :span="8">
                <sm-text-tooltip :content="item.instance" />
              </el-col>
              <el-col class="progress" :span="16">
                <el-progress :percentage="item.riskRate" :show-text="false" :stroke-width="10"/>
                <sm-text-tooltip :content="item.sickAssetTotal" />
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="card-wrap">
      <div class="card-top">脆弱性监测</div>
      <div class="card-cont">
        <el-row class="card-cont-total" :gutter="16">
          <el-col :span="12">
            <el-row class="total-box" type="flex"  align="middle">
              <el-image :src="util.getAssetsImages('home/assets-total-icon.png')"/>
              <div class="total" @click="getDialogData('漏洞总数', '202211151722307680003', vulnerability.riskTotal)">
                <p>漏洞总数</p>
                <span>{{ vulnerability.riskTotal }} <i>个</i></span>
              </div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="total-box" type="flex" align="middle">
              <el-image :src="util.getAssetsImages('home/business-total-icon.png')"/>
              <div class="total"
                   @click="getDialogData('漏洞闭环效率', '202211161857232090000', null, 'deptRiskAvg')">
                <p>平均闭环天数</p>
                <span>{{ vulnerability.riskAvgNumber }} <i>天</i></span>
              </div>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="card-cont-dashboard" :gutter="20">
          <el-col :span="8">
            <div
              class="chart-box" ref="highRiskRate"
              @click="getDialogData('高危漏洞', '20221115172400820004')">
            </div>
            <div class="chart-name">高危</div>
          </el-col>
          <el-col :span="8">
            <div
              class="chart-box" ref="criticalRate"
              @click="getDialogData('危急漏洞', '2022111517265330005')">
            </div>
            <div class="chart-name">危急</div>
          </el-col>
          <el-col :span="8">
            <div
              class="chart-box" ref="bugFixesRate"
              @click="getDialogData('各部门漏洞修复率', '202211151728047970006', null, 'deptBugFix')">
            </div>
            <div class="chart-name">漏洞修复率</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "/@/utils/old/echartsUI";
import { reqCockpitData } from '/@/api/scp/screen';
import { dashboard } from './Dashboard';
import SmTextTooltip from "/@/components/Tooltip";
import util from '/@/utils';
export default {
  name: 'leftSidebar',
  components: {
    SmTextTooltip
  },
  data () {
    return {
      util,
      // 资产概览统计
      assetOverview: {
        assetTotal: 0,
        businessSystemTotal: 0,
        internetAssetTotal: 0,
        letterAssetTotal: 0,
        infoCompleteTotal: 0,
      },
      sickAssetRingRatio: '',
      // 系统风险TOP5
      systemRiskList: [],
      // 脆弱性监控统计
      vulnerability: {
        riskTotal: 0,
        riskAvgNumber: 0,
      }
    }
  },
  mounted() {
    this.getAssetOverview()
    this.getVulnerability()
    this.getSystemRiskTOP5()
  },
  methods: {
    /** 获取资产概览 */
    getAssetOverview () {
      const param = { id: '202211141814122990009' }
      reqCockpitData(param).then(({ data: { resultData } }) => {
        if (Array.isArray(resultData) && resultData.length > 0) {
          const { internetAssetTotal, letterAssetTotal, infoIncompleteTotal } = resultData[0]
          for (const k in this.assetOverview) k in resultData[0] && (this.assetOverview[k] = resultData[0][k])
          this.generateDashboard(internetAssetTotal, this.assetOverview.assetTotal, '#197eda','#37cbf7', 'internetRate')
          this.generateDashboard(letterAssetTotal, this.assetOverview.assetTotal, '#e4912c','#f0c249', 'letterRate')
          this.generateDashboard(infoIncompleteTotal, this.assetOverview.assetTotal, '#f92167','#ed7159', 'integrityRate')
        }
      })
    },
    /** 获取会话框数据 */
    getDialogData (title, id, total, type) {
      const params = { id }
      reqCockpitData(params).then(({ data: { resultData } }) => {
        if (resultData) {
          this.$emit('open', title, resultData, total, type)
        }
      })
    },
    /** 生成仪表盘图表 */
    generateDashboard (number, total, color1, color2, chartName = '') {
      let ratio = (number / total * 100) || 0, comparator;
      chartName === 'integrityRate' && (ratio = 100 - ratio)
      if (ratio < 1 && ratio !== 0) {
        ratio = 1
        comparator = '<'
      } else if (ratio > 99 && ratio !== 100) {
        ratio = 99
        comparator = '>'
      } else {
        comparator = ''
        ratio = Math.round(ratio)
      }
      const option = dashboard.getOption(ratio, comparator, color1, color2)
      echarts.init(this.$refs[chartName]).setOption(option, true)
    },
    /** 获取业务系统风险TOP5 */
    getSystemRiskTOP5 () {
      const params = { id: '202211151647306570000' }
      reqCockpitData(params).then(({ data: { resultData } }) => {
        let maxSickAssetTotal = 0
        Array.isArray(resultData) && (this.systemRiskList = resultData.slice(0, 5)).forEach((item, index) => {
          index === 0 && (maxSickAssetTotal = item.sickAssetTotal)
          if (maxSickAssetTotal === 0) item.riskRate = 0
          else item.riskRate = Math.round(item.sickAssetTotal / maxSickAssetTotal * 100)
        })
      })
    },
    /** 获取资产带病率 */
    getSickAssetRate (par1, par2) {
      const params1 = {
        id: '202211151650281470001',
        paramJson: JSON.stringify(par1)
      }
      const params2 = {
        id: '202211151650281470001',
        paramJson: JSON.stringify(par2)
      }
      let sickAssetRate, lastSickAssetRate;
      reqCockpitData(params1).then(({ data: { resultData } }) => {
        try {
          const { assetTotal, sickAssetTotal = 0 } = resultData[0]
          sickAssetRate = ((sickAssetTotal / assetTotal * 100) || 0).toFixed(1)
        } catch (e) {
          sickAssetRate = 0
        }
        return reqCockpitData(params2)
      }).then(({ data: { resultData } }) => {
        try {
          const { assetTotal, sickAssetTotal = 0 } = resultData[0]
          lastSickAssetRate = ((sickAssetTotal / assetTotal * 100) || 0).toFixed(1)
          this.sickAssetRingRatio = (sickAssetRate - lastSickAssetRate).toFixed(1)
        } catch (e) {
          this.sickAssetRingRatio = 0
        }
        const sickAssetOpt = dashboard.getOption(sickAssetRate, '', '#90F269','#FFC057')
        echarts.init(this.$refs.sickAssetRate).setOption(sickAssetOpt, true)
      })
    },
    /** 获取脆弱性监控 */
    getVulnerability () {
      const param = { id: '202211151702196180002' }
      reqCockpitData(param).then(({ data: { resultData } }) => {
        const result = (Array.isArray(resultData) && resultData.length > 0 && resultData[0]) || {}
        const { highRiskPCT, criticalPCT, bugFixPCT } = result
        for (const k in this.vulnerability) k in result && (this.vulnerability[k] = result[k])
        const vulnerabilityOpt = dashboard.getOption(highRiskPCT, '', '#197eda','#37cbf7')
        echarts.init(this.$refs.highRiskRate).setOption(vulnerabilityOpt, true)
        const criticalOpt = dashboard.getOption(criticalPCT, '', '#e4912c','#f0c249')
        echarts.init(this.$refs.criticalRate).setOption(criticalOpt, true)
        const bugFixesOpt = dashboard.getOption(bugFixPCT, '', '#f92167','#ed7159')
        echarts.init(this.$refs.bugFixesRate).setOption(bugFixesOpt, true)
      })
    }
  }
}
</script>

<style scoped lang="less">
.progress-item{
  :deep(.tool-tip-box){
    width: auto;
    .tooltip-content{
      font-size: 12px;
      color: #fff;
    }
  }
  :deep(.total){
    width: 30px;
    .tooltip-content{
      font-size: 14px;
      color: #00f9ff;
    }
  }
}
</style>
