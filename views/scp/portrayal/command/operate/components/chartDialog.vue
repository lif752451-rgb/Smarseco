<template>
  <div>
    <el-dialog
      class="chart-dialog" :title="option.title" :model-value="option.visible"
      :close-on-click-modal="false" :close-on-press-escape="false"
      :modal-append-to-body="false"
      width="1200px" :before-close="() => this.$emit('close')">
      <div class="chart" ref="chart"></div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from "/@/utils/old/echartsUI";
import lodash from 'lodash-es';
export default {
  name: "chartDialog",
  props: {
    option: Object
  },
  data () {
    return {
      chartOpt: {
        legend: { textStyle: { color: '#9CC9FF' }, show: true },
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          backgroundColor: '#0B2041', textStyle: { color: '#FFFFFF' }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
        xAxis: {
          type: 'category', data: [], axisLabel: { textStyle:
              { color: '#9CC9FF' }, rotate: 45 },
          axisLine: {lineStyle: {color: '#9CC9FF'}},
        },
        yAxis: {
          type: 'value', axisLabel: {textStyle: {color: '#9CC9FF'}},
          splitLine: {show: true, lineStyle: {color: ['rgba(205,211,255,0.21)'], type: 'solid'}}
        },
        series: [{
          name: '', type: 'bar', stack: 'Ad', data: [], itemStyle: {
            normal: { color: new echarts.graphic.LinearGradient(
                0, 1, 0, 0, [
                  { offset: 0, color: '#1954FF' },
                  { offset: 1, color: '#0FE7FF' }]
              ) }
          }, barWidth: 16, label: {
            show: true, position: 'top', color: '#FFFFFF', formatter(i) {
              if(i.data === 0) return ''
            }
          }
        }]
      }
    }
  },
  mounted() {
    this.generateBarChart()
  },
  methods: {
    /** 生成柱状图 */
    generateBarChart () {
      this.option.data.forEach((item, idx) => {
        this.chartOpt.xAxis.data.push(item[this.getTotalName(item, 'Name')])
        if (this.option.type === 'stack') {
          if (idx === 0) {
            this.chartOpt.series[1] = lodash.cloneDeep(this.chartOpt.series[0])
            this.chartOpt.series[1].name = this.option.legend[1]
            this.chartOpt.series[1].itemStyle.normal.color = new echarts.graphic.LinearGradient(
              0, 1, 0, 0, [
                { offset: 0, color: '#FFB25D' },
                { offset: 1, color: '#FF0068' }]
            )
          }
          this.chartOpt.series[0].name = this.option.legend[0]
          this.chartOpt.series[0].data.push(item.total1)
          this.chartOpt.series[1].data.push(item.total2)
        } else {
          this.chartOpt.series[0].data.push(item[this.getTotalName(item, 'Total')])
        }
      })
      if (this.option.type === 'deptBugFix') {
        this.chartOpt.tooltip.formatter = '{b} <br/> {c}%'
        this.chartOpt.series[0].label.formatter = '{c}%'
      }
      this.$nextTick(_ => echarts.init(this.$refs.chart).setOption(this.chartOpt))
    },
    /** 动态获取总数键名 */
    getTotalName(item, key) {
      let name
      for (const k in item) k.includes(key) && (name = k)
      return name
    }
  }
}
</script>

<style  lang="less" scoped>
:deep(.chart-dialog){
  background: url("/@/assets/images/home/dialog-bg.png") center center no-repeat !important;
  background-size: contain!important; margin-top: 18vh!important;
  .el-dialog__header {
    background: transparent;
    padding: 34px 40px 0;
    height: 48px;
   .el-dialog__title {
      color: #FFFFFF; font-size: 13px; text-indent: 20px;
      line-height: 36px;
      display: inline-block;
      line-height: 5;
    }
    .el-dialog__headerbtn {
      top: 11px;
      right: -16px;
      .el-dialog__close { color: transparent; }
    }
    .el-icon { color: #FFFFFF }
  }
  .chart {
    height: 460px; margin-top: 10px;
  }
}
</style>
