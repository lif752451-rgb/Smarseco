<template>
  <div class="alarm_view">
    <div class="title">攻击日志趋势图</div>
    <div :id="chartUuid" class="chart-bg"></div>
  </div>
</template>

<script>
import echarts from "/@/utils/old/echartsUI";
import { randomString } from "/@/utils/util.common";
export default {
  name: "alarmFlow",
  props: {
    alarmViewData: {
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
        tooltip: {
          backgroundColor: "#030e2e",
          borderColor: "rgb(255, 255, 0)",
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#a1d5f2",
            },
          },
          textStyle: {
            color: "#fff", //设置文字颜色
          },
        },
        xAxis: {
          axisTick: {
            //去掉线头
            show: true,
          },
          type: "category",
          data: [],
          axisLabel: {
            color: "#9CC9FF", //x轴的字体颜色
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
            color: "#9CC9FF", //y轴的轴线的宽度和颜色
          },
          axisLabel: {
            color: "#9CC9FF", //y轴的字体颜色
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
            name: "日志数量",
            data: [],
            showSymbol: true,
            type: "line",
            smooth: true, // 平滑曲线
            label: {
              // 顶部文案
              // show: true,
              position: "top",
              fontSize: 12,
              color: "#9CC9FF",
            },
            symbol: "circle",
            lineStyle: {
              // 设置线条的style等
              normal: {
                color: "#FFC836", // 折线线条颜色:黄色
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
                    color: "#FFC836",
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 200, 54,0)",
                  },
                ]
              ),
            },
            itemStyle: {
              normal: {
                color: "Yellow",
                borderWidth: 1, // 拐点边框大小
                borderColor: "#fff",
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
    alarmViewData: {
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
      this.option.color = "#267EE5";
      this.alarmViewData.forEach((item, index) => {
        this.option.xAxis.data[index] = item.name;
        this.option.series[0].data[index]= item.count;
      });
      var chartDom = document.getElementById(this.chartUuid);
      echarts.init(chartDom).dispose();
      var myChart = echarts.init(chartDom);
      console.log("option", this.option);
      myChart.setOption(this.option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
  },
};
</script>

<style scoped lang="less">
.alarm_view {
  .title {
    height: 37px;
    background: url("/@/assets/images/szc_screen/alarm_view_title1.png")
      left center no-repeat;
    background-size: 100% 100%;
    font-size: 18px;
    color: #fff;
    font-weight: 500;
    text-indent: 40px;
  }
  .chart-bg {
    width: 100%;
    height: 248px;
  }
}
</style>
