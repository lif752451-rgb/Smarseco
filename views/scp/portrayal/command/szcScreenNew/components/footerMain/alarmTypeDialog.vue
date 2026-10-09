<template>
  <el-dialog
    v-if="alarmTypeDialogShow"
    :model-value="alarmTypeDialogShow"
    width="800px"
    custom-class="szcScreen_new_dialog_common"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :modal-append-to-body="false"
  >
    <template #title>
      <div  class="dialog_title">告警类型排行</div>
    </template>
    <img
      class="close_btn"
      @click="handleClose"
      :src="util.getAssetsImages('szc_screen/dialog_close.png')"
    />
    <div class="flex-box bottom-left"></div>
    <div class="flex-box bottom-right"></div>
    <div class="dialog-wrap-content">
      <el-scrollbar class="alarm-type-content">
        <div class="chart-alarm-type" ref="chart"></div>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>

<script>
import echarts from "/@/utils/old/echartsUI";
import util from '/@/utils';
export default {
  props: {
    alarmTypeDialogShow: {
      type: Boolean,
      default: false,
    },
    typeData: {
      type: Array,
      default: []
    },
  },
  components: {},
  data() {
    return {
      util,
      chartOpt: {
        legend: { textStyle: { color: '#F2F2F2' }, show: true,  itemWidth: 10,
          itemHeight: 10 },
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          backgroundColor: '#0B2041', textStyle: { color: '#FFFFFF' },
          borderWidth: "2",borderColor: '#37eefc'
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
        xAxis: {
          type: 'category', data: [], axisLabel: { textStyle:
              { color: '#E8F0FC' }, rotate: 45 },
          axisLine: {lineStyle: {color: '#E8F0FC'}},
          axisLabel: {
            interval: 0,
            rotate: 30,
            padding: [20, 0, 0, 0],
            // X轴label长度大于8就用省略号，移动到的时候全显示
            formatter (value) {
              if (value.length > 14) {
                return `${ value.slice(0, 14) }...`
              }
              return value
            }
          },
        },
        yAxis: {
          type: 'value', axisLabel: {textStyle: {color: '#E8F0FC'}},
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
    };
  },
  created() {},
  mounted() {
    this.generateBarChart(this.typeData);
  },
  beforeDestroy() {},
  watch: {
    typeData: {
      handler(val) {
        this.$nextTick(() => {
          this.generateBarChart(val);
        })
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit("closeDetail");
    },
     /** 生成柱状图 */
     generateBarChart (typeData) {
      typeData.forEach((item, index) => {
        const obj = {
          value: item.attackMeansCount, 
          name: item.attackMeansLabel
        };
        this.chartOpt.xAxis.data[index]= obj.name;
        this.chartOpt.series[0].data[index]= obj;
      })
      this.$nextTick(_ => {
        this.chartOpt.series[0].name = '告警数量';
        var myChart = echarts.init(this.$refs.chart);
        myChart.setOption(this.chartOpt,
          myChart.off("click"),
          myChart.on("click", (params) => {
            this.$emit('typeCharsClick',params.data)
          })
        )
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      })
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-wrap-content{
  height: 460px !important; 
  .alarm-type-content {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #fff;
    :deep(.el-scrollbar__thumb) {
      display: none !important;
    }
    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }
    .chart-alarm-type{
      width: 100%;
      height: 428px;
    }
  }
}

</style>
