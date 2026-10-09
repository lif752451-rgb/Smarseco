<template>
  <div>
    <detail-dialog
      v-if="detailOpen"
      :dialogVisible="detailOpen"
      :dialogTile="detailTitle"
      @close="close"
    >
      <div :id="chartUuid"  class="chart-bg"></div>
    </detail-dialog>
  </div>
</template>
<script>
import echarts from "/@/utils/old/echartsUI";
import lodash from "lodash-es";
import DetailDialog from "../component/detailDialog.vue";
import { randomString } from '/@/utils/util.common'
import chartPackageUtil from '/@/components/old/Visual/common'
import { reqRiskDomainNameTop5 } from '/@/api/scp/battleScreen'
import { reqDict} from "/@/api/common";
export default {
  components: {
    DetailDialog
  },
  props:{
    host: {
      type: String,
      default: ''
    },
    detailOpen: Boolean,
    detailDate: Object,
  },
  data(){
    return {
      chartUuid: '',
      option:{
        backgroundColor:'',
        legend: {
          textStyle: { //图例文字的样式
            fontSize: 13,
            fontWeight: 400,
          },
        },
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            crossStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [{
          show: false,
          type: 'slider',
          height : 12,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '100%',
          bottom: '35',
          backgroundColor:"rgba(47,69,84,0)", //组件的背景颜色
          fillerColor:"#F3F5F8", //选中范围的填充颜色。
          handleStyle: {
            color: '#fff',
            shadowBlur: 2,
            shadowColor: '#8F9BB3',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
        }],
        xAxis: {
          axisTick:{//去掉线头
            show:false
          },
          type: 'category',
          axisLabel: {
          },
        },
        yAxis: {
          type: 'value',
          axisLine:{       //y轴
            show:false
          },
          splitLine: {
            show: true,
            lineStyle:{
              type:'dashed'
            }
          }
        },
      },
      seriesOption: {
        type: 'line',
        barWidth: 13,//柱图宽度
      },
      data: {},
      detailTitle: '',
    }
  },
  mounted() {
    let _this= this
    this.chartUuid =  randomString(16);
    setTimeout(() => {
      _this.init()
    }, 0);
  },
  methods: {
    init() {
      this.detailTitle = this.host + ' 近期受攻击趋势';
      var chartDom = document.getElementById(this.chartUuid);
      echarts.init(chartDom).dispose();
      let myChart = echarts.init(chartDom);
      reqDict('visual_theme').then(data=> {
        let visualThemeData = data;
        reqRiskDomainNameTop5({
          id: '202308161519332870003',
          paramJson: JSON.stringify({ host: this.host, ...this.detailDate})
        }).then((res) => {
          this.data = res.data;
          let tempTheme = this.data.theme ? (lodash.find(visualThemeData, {dictValue: this.data.theme}) ? JSON.parse(lodash.find(visualThemeData, {dictValue:this.data.theme}).remark) : null) : null;
          if(tempTheme){
            this.data.color = tempTheme.color;
          }else{
            this.data.color = ["#4285F4"];
          }
          let option = chartPackageUtil.packageOption(this.data, this.option, this.seriesOption);
          lodash.set(option.yAxis, 'axisLabel.textStyle.color', '#ffffff');
          lodash.set(option.xAxis, 'axisLabel.textStyle.color', '#ffffff');
          lodash.set(option.legend, 'textStyle.color', '#ffffff');
          option.series[0].color = '#ffffff'
          option.series[0].label.color = '#ffffff'
          myChart.setOption(option);
        })
      });
    },
    close(){
      this.$emit('close')
    }
  },
};
</script>
<style lang="less" scoped>
.chart-bg{
  height: 350px;
  width: 100%;
}
</style>
