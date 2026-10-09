<template>
  <div>
    <div class="chart" ref="myChart" id="riskChart"></div>
    <domain-detail v-if="detailOpen" :detailDate="riskDate" :detailOpen="detailOpen" :host="host"  @close="() => this.detailOpen = false"></domain-detail>
  </div>
</template>
<script>
import echarts from  "/@/utils/old/echartsUI";
import lodash from "lodash-es";
import 'echarts/theme/macarons.js'
import DomainDetail from './domainDetail.vue'

export default {
  components: {
    DomainDetail
  },
  props:{
    riskData:Array,
    riskDate:Object,
  },
  data(){
    return {
      chart:null,
      option:{
        grid: {
          left: "0%",
          bottom: "0%",
          top: "0%",
          right:'18%',
          height:200,
        },
        xAxis: {
          show: false,
          splitLine:{show:false},
          axisLabel:{show:false},
          axisTick:{show:false},
          axisLine:{show:true},
        },
        yAxis: [          
          {
            type:'category',
            inverse:true,
            axisLine:{show:false},
            axisTick:{show:false},
            axisLabel:{show:false},
            splitLine:{show:false},
          },
          {
            show:true,
            inverse:true,
            axisLabel:{
              textStyle:{
                color:'#FFFFFF',
                fontSize:'14',
                padding:[0,0,0,15],
              },
              formatter:'{value}'
            },
            axisLine:{ show:false },
            splitLine:{ show:false },
            axisTick:{ show:false },
            },
          ],
        series: [
          {
            yAxisIndex:0,
            name:'value',
            showBackground:true,
            backgroundStyle:{
              color:'rgba(12,183,216,0.2)',
              borderRadius:2,
            },
            type:'bar',
            barCategoryGap:0,
            barWidth:6,
            barGap:10,
            data:[],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                  0, 0, 1, 0,
                  [
                      {offset: 0, color: '#00f5d3'},
                      {offset: 0.5, color: '#cff2a4'},
                      {offset: 1, color: '#fd0a00 '}
                  ]
              ),
              barBorderRadius: [3, 3, 3, 3],
            },
            label:{
              normal:{
                show:true,
                position:[0,'-15px'],
                color:'#BDDBFF',
                textStyle:{fontSize:12},
                formatter:(a,b)=>a.name
              }
            },
          }
        ]
      },
      host: '',
      detailOpen: false
    }
  },
  watch:{
    riskData(val){
        this.myChart.showLoading();
        this.initEcharts(val)
    }
  },
  mounted(){
    this.myChart = echarts.init(document.getElementById('riskChart'), 'macarons')
    if(this.riskData.length)this.initEcharts(this.riskData)
  },
  methods:{
    initEcharts(charData){
      this.myChart.clear();
      this.myChart.showLoading();
      let chartOption = lodash.cloneDeep(this.option);
      const yAxisData = charData.map(item=>item.count)
      chartOption.yAxis[1].data = yAxisData
      const seriesData = charData.map(item=>{
        return {value:item.count,name:item.name}
      })
      chartOption.grid.height = charData.length * 40
      chartOption.series[0].data = seriesData
      this.myChart.setOption(chartOption);
      this.myChart.hideLoading();
      this.myChart.off('click');
      this.myChart.on('click', (chart) => {
        this.host = chart.data.name;
        this.detailOpen = true;
      });
    }
  },
};
</script>
<style lang="less" scoped>
.chart{
  height: 200px;
  width: 100%;
}
</style>
