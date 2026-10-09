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
          <p>得失分概况</p>
        </div>
      </div>
      <div class="card-count">
        <div class="card-count-score">
          <div>
            <p class="score-count">{{sumGainScore}}</p>
            <p class="score-name">总得分</p>
          </div>
          <div>
            <p class="score-count">{{sumLoseScore}}</p>
            <p class="score-name">总失分</p>
          </div>
          <div>
            <p class="score-count">{{sumEstimateGainScore}}</p>
            <p class="score-name">预估总得分</p>
          </div>
          <div>
            <p class="score-count">{{sumEstimateLoseScore}}</p>
            <p class="score-name">预估总失分</p>
          </div>
        </div>
        <div class="chart" ref="myChart" id="scoreEchart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from  "/@/utils/old/echartsUI";
import lodash from "lodash-es";
import 'echarts/theme/macarons.js'
import util from '/@/utils';

export default {
  props:{
    charData:Array
  },
  data() {
    return {
      util,
      chart:null,
      sumGainScore:0,
      sumLoseScore:0,
      sumEstimateGainScore:0,
      sumEstimateLoseScore:0,
      commonOption: {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          textStyle: { color: "#FFFFFF",fontSize:14 },
          borderWidth:0,
          extraCssText:'width:274px',
          formatter:(data)=>{
            const [gainItem,loseItem,estimateGainItem,estimateLoseItem,explainItem] = data;
            const seriesName = gainItem.axisValue;
            const {marker:gainM,seriesName:gainN,value:gainV} = gainItem
            const {marker:loseM,seriesName:loseN,value:loseV} = loseItem
            const {marker:eGainM,seriesName:eGainN,value:eGainV} = estimateGainItem
            const {marker:eLoseM,seriesName:eLoseN,value:eLoseV} = estimateLoseItem
            const {seriesName:explainN,value:explainV} = explainItem
            const res = 
            `${seriesName}<br/>
             ${gainM}${gainN}: ${gainV}<br/>
             ${loseM}${loseN}: ${Math.abs(loseV)}<br/>
             ${eGainM}${eGainN}: ${eGainV}<br/>
             ${eLoseM}${eLoseN}: ${Math.abs(eLoseV)}<br/>
             ${explainN}:<br/>
             <div class='tooltip-explain'>${explainV}</div>`
            return res
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "8%",
          containLabel: true,
        },
        dataZoom: [
          {
            type: 'inside',
            // start: 0,
            // end: endZoom,    // 这里end跟数据有关系 数据越多，end越小 end是百分比例
            startValue: 0, // 从头开始。
            endValue: 6,  // 最多六个
            minValueSpan: 6,  // 放大到最少几个
            maxValueSpan: 365,  //  缩小到最多几个
          },
          {
            type: 'slider',
            show: true,
            height: 10,
            left: '5%',
            right: '5%',
            bottom: '5%',
            start: 0,
            end: 100,
            textStyle: {
              color: '#d4ffff',
              fontSize: 11,
            },
          },
          
        ],
        xAxis: {
          type: "category",
          data: [],
          axisLabel: { textStyle: { color: "#F2F2F2" }, rotate: 45,interval:0,padding:5},
          axisLine: { lineStyle: { color: "#4ea0b1" ,width:1} },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: { textStyle: { color: "#F2F2F2" } },
          splitLine: {
            show: true,
            lineStyle: { color: ["rgba(205,211,255,0.21)"], type: "dashed" },
          },
        },
        series: [
          {
            name: "得分",
            type: "bar",
            data: [],
            stack:'分数',
            itemStyle: { color:'#95ca42'},
            barWidth: 16,
            barGap:'30',/*多个并排柱子设置柱子之间的间距*/
          },
          {
            name: "失分",
            type: "bar",
            data: [],
            stack:'分数',
            itemStyle: { color:'#fea708'},
            barWidth: 16,
            barGap:'30%',
          },
          {
            name: "预估得分",
            type: "bar",
            data: [],
            stack:'分数',
            itemStyle: { color:'#deffa8'},
            barWidth: 16,
            barGap:'30%',
          },
          {
            name: "预估失分",
            type: "bar",
            data: [],
            stack:'分数',
            itemStyle: { color:'#f9d15f' },
            barWidth: 16,
            barGap:'30%',
          },
          {
            name: '说明',
            type: 'bar',
            symbolSize: 0, // symbol的大小设置为0
            showSymbol: false, // 不显示symbol
            itemStyle:{
              color:'rgba(0, 0, 0, 0)' 
            },
            barWidth: 0,
            stack:'分数',
            data: [],
            barGap:'30%',
        }
        ],
      },
    };
  },
  watch:{
    charData(val){
        this.myChart.showLoading();
        this.initEcharts(val)
    }
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById('scoreEchart'), 'macarons')
  },
  methods:{
    initEcharts(charData){
      this.myChart.clear();
      this.myChart.showLoading();
      let chartOption = lodash.cloneDeep(this.commonOption);
      let xAxisData = []
      let gainSoreArr = []
      let loseSoreArr = []
      let explainArr = []
      let estimateLoseArr = []
      let estimateGainArr = []
      let estimateGain = 0
      let estimateLose = 0
      let sumGain = 0
      let sumLose = 0
      charData.map(item=>{
        let {date,goal=0,pointsAgainst=0,explain='',estimateGoal=0,estimatePointsAgainst=0} = item
        xAxisData.push(date)
        gainSoreArr.push(goal)
        loseSoreArr.push(-pointsAgainst)
        explainArr.push(explain)
        estimateGainArr.push(estimateGoal)
        estimateLoseArr.push(-estimatePointsAgainst)
        estimateGain+=parseInt(estimateGoal)
        estimateLose+=parseInt(estimatePointsAgainst)
        sumGain+=parseInt(goal)
        sumLose+=parseInt(pointsAgainst)
      })
      this.sumGainScore = sumGain
      this.sumLoseScore = sumLose
      this.sumEstimateGainScore = estimateGain
      this.sumEstimateLoseScore = estimateLose
      chartOption.xAxis.data = xAxisData;
      chartOption.series[0].data = gainSoreArr
      chartOption.series[1].data = loseSoreArr
      chartOption.series[2].data = estimateGainArr
      chartOption.series[3].data = estimateLoseArr
      chartOption.series[4].data = explainArr
      this.myChart.setOption(chartOption);
      this.myChart.hideLoading();
    }
  }
};
</script>
<style lang="less" scoped>
.card-wrap {
  .card-count-score {
    display: flex;
    gap: 20px;
    padding: 10px 0;
    box-sizing: border-box;
    > div {
      background: url("/@/assets/images/battle-screen/score-bg.svg")
        center center no-repeat;
      background-size: 100% 100%;
      height: 100%;
      width: 153px;
      height: 62px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .score-count {
        font-weight: 500;
        font-size: 18px;
        color: #00ffff;
      }
      .score-name {
        font-weight: 400;
        color: #f2f2f2;
        font-size: 14px;
      }
    }
  }
  .chart {
    height: 245px;
    margin-top: 10px;
    width: 100%;
    
  }
}
</style>
<style>
.tooltip-explain{
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
}
</style>
