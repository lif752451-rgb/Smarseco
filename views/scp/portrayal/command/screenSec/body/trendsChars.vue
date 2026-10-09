<template>
  <div :id="chartUuid" class="chart-bg"></div>
</template>

<script>
import echarts from '/@/utils/old/echartsUI'
import { randomString } from '/@/utils/util.common'
export default {
  name: "alarmFlow",
  props: {
    trendsData: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.chartUuid = randomString(16);
  },
  data() {
    return {
      chartUuid: "",
      option: {
        // title: {
        //   text: '单位：条',
        //   right: 30,
        //   top: 0,
        //   textStyle: {
        //     color: "#7893B2",
        //     fontSize: 24
        //   }
        // },
        tooltip: {
          backgroundColor: "rgba(255,255,255,0.06)",
          borderColor:"#0390f8",
          trigger: "axis",
          axisPointer: {
            type: 'line', // 默认为line，line直线，cross十字准星，shadow阴影
            crossStyle: {
              color: "#0390f8",
            },
          },
          textStyle: {
            color: "#fff", //设置文字颜色
            fontSize: 24
          },
        },
        xAxis: {
          axisTick: {
            //去掉线头
            show: false,
            lineStyle: {
              color: "rgba(205, 211, 255,0.2)"
            }
          },
          type: "category",
          data: [],
          axisLabel: {
            fontSize: 24,
            color: "#7893B2", //x轴的字体颜色
            interval: 0, //坐标轴刻度的显示间隔，在类目轴中有效
            rotate: 30,
            padding: [20, 0, 0, 0],
            // X轴label长度大于8就用省略号，移动到的时候全显示
            formatter(value) {
              return value;
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            //y轴
            show: false,
            width: 1,
            color: "#7893B2", //y轴的轴线的宽度和颜色
          },
          axisLabel: {
            color: "#7893B2", //y轴的字体颜色
            fontSize: 24
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "rgba(205, 211, 255,0.2)", //中间的虚线颜色
            },
          },
        },
        series: [
          {
            name: "攻击数",
            data: [],
            showSymbol: true,
            type: "line",
            smooth: true, // 平滑曲线
            label: {
              // 顶部文案
              // show: true,
              position: "top",
              fontSize: 24,
              color: "#9CC9FF",
            },
            symbol: "circle",
            lineStyle: {
              // 设置线条的style等
              normal: {
                color: "rgba(47, 175, 248, 0.84)", // 折线线条颜色:黄色
                width: 3
              },
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1, //变化度
                //渐变色
                [
                  {
                    offset: 0,
                    color: "rgba(47, 175, 248, 0.44)",
                  },
                  {
                    offset: 1,
                    color: "rgba(53, 154, 211, 0)",
                  },
                ]
              ),
            },
            itemStyle: {
              normal: {
                color: "#0390f8",
                borderWidth: 1, // 拐点边框大小
                borderColor: "rgba(205, 211, 255,0.2)",
              },
            },
          },
        ],
        grid: {
          top: "4%",
          left: "0%",
          right: "2%",
          bottom: "4%",
          //是否显示刻度标签
          containLabel: true,
        },
        color: "#9CC9FF",
      },
    };
  },
  watch: {
    trendsData: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 未完成高风险告警工单
    init() {
      this.option.xAxis.data = [];
      this.option.series[0].data = [];
      this.option.color = "rgba(47, 175, 248, 0.84)";
      if(this.trendsData && this.trendsData.length){
        this.trendsData.forEach((item, index) => {
          this.option.xAxis.data[index] = item.name
          this.option.series[0].data[index] = item.count
        });
        var chartDom = document.getElementById(this.chartUuid);
        echarts.init(chartDom).dispose();
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
.chart-bg{
  width: 100%;
  height: 340px;
}
</style>
