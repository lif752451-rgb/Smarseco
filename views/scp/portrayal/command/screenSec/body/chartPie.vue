<template>
  <div :id="chartUuid" class="chart-bg">
  </div>
</template>

<script>
import echarts from '/@/utils/old/echartsUI'
import lodash from "lodash-es";
import { randomString } from '/@/utils/util.common'
import { reqDict } from "/@/api/common";
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    status: {
      type: [String, Number],
      default: null,
    },
    total: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    dataRange() {
      const {  data } = this;
      return {  data };
    },
  },
  watch: {
    dataRange: {
      handler() {
        this.$nextTick(() => {
          this.init();
        })
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      visualThemeData: [],
      chartUuid: "",
      name: "",
      option: {
        tooltip: {
          trigger: "item",
          backgroundColor: '#0B2041',
          textStyle: { color: '#FFFFFF',  fontSize: 30 },
        },
        legend: {
          // selectedMode:false,
          orient: 'vertical',
          top: 'center',
          right: 0,
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 8,
          verticalAlign: 'middle',
          itemGap: 15,//间居
          width: 440,//图例的宽度，想要对齐这个必须要有
          textStyle: {
            backgroundColor: 'transparent',
            rich: {
              name:{
                fontSize: 30,
                algin: "left",
                width: 280,
                height: 40,
                color: '#8FADCC',
                verticalAlign: 'top',
              },
              repair: {
                fontSize: 30,
                color: '#EEEEEE',
                algin: "right",
                width: 100,
                height: 40,
                verticalAlign: 'top',
              },
              value: {
                fontSize: 30,
                color: '#EEEEEE',
                algin: "right",
                width: 80,
                height: 40,
                verticalAlign: 'top',
              }
            }
          },
        },
        series: [
          {
            color:  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(38, 191, 255, 0.2)" }, //柱图渐变色
              { offset: 1, color: "rgba(38, 151, 255, 0.08)" }, //柱图渐变色
            ]),
            type: 'pie',
            hoverAnimation: false, //鼠标移入变大
            center: ['25%', '50%'],
            radius: ['0%', '50%'],
            label: {
              show: true,
              position: 'center',
              formatter:'威胁处置',
              color: '#ffffff',
              fontSize: 32,
              fontWeight: 'bold',
            },
            tooltip: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              }
            },
            data: [{
              value: 9,
              name: '',
              itemStyle: { }
            }]
          },
          {
            name: '',
            type: 'pie',
            radius: ['60%', '70%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                borderWidth: 2,	//边框的宽度
                borderColor: '#001129'	//边框的颜色
              }
            },
            label: {
              show: false,
              position: 'center',
              formatter:'威胁处置',
              color: '#ffffff',
              fontSize: 30,
              fontWeight: 'bold',
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
          },
          {
						type: 'gauge',
						center: ['50%','50%'],
						radius: '85%', // 1行3
						axisLine: { // 坐标轴线
							lineStyle: { // 属性lineStyle控制线条样式
								width: 12,
								color: [
									[1, new echarts.graphic.LinearGradient(0, 0, 0, 1, [
										{ offset: 0, color: "rgba(38, 191, 255, 0.2)" }, //柱图渐变色
										{ offset: 1, color: "rgba(38, 151, 255, 0.08)" }, //柱图渐变色
									])],
								],
							}
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
						axisTick: {
							show: false
						},
					},
        
        ],
        color: [
          "#537dfe",
          "#275ff4",
          "#5d4bff",
          "#f8bc44",
          "#f94043",
          "#a2e8a4",
          "#caec93",
          "#ebec93",
          "#ece093",
          "#eccb93",
          "#eaba76",
        ],
      },
    };
  },
  created() {
    reqDict("visual_theme").then((data) => {
      this.visualThemeData = data;
    });
  },
  mounted() {
    let _this = this;
    this.chartUuid = randomString(16);
    this.$nextTick(() => {
      _this.init();
    });
  },
  methods: {
    //判断不存在
    isNotNull(data, property) {
      if (property == undefined) {
        return undefined != data && null != data;
      } else {
        return (
          undefined != data && null != data && data.hasOwnProperty(property)
        );
      }
    },
    //判断不存在
    isNotNullLength(data, property) {
      if (property == undefined) {
        return undefined != data && null != data && data.length;
      } else {
        return (
          undefined != data &&
          null != data &&
          data.hasOwnProperty(property) &&
          data[property].length
        );
      }
    },
    //将属性里的转义字符转义
    escapeProperty(data) {
      if (data != null && data != "" && data != "[]" && data != "{}") {
        if (data.indexOf("&lt;") > -1) {
          data = data.replace(/&(lt);/gi, "<");
        }
        if (data.indexOf("&gt;") > -1) {
          data = data.replace(/&(gt);/gi, ">");
        }
        return eval("(" + data + ")");
      } else {
        return {};
      }
    },
    init() {
      this.option.series[1].data = [];
      this.option.series[1].name  = this.status=="1"? "威胁处置": "脆弱性处置";
      this.option.series[0].center =  this.option.series[1].center =  this.option.series[2].center = this.status=="1"?  ['25%', '55%']:  ['75%', '55%'];
      this.option.series[0].label.formatter = this.status=="1"? "威胁处置": "脆弱性处置";
      this.option.legend.right = this.status=="1"? 10 : "auto";
      this.option.legend.left = this.status=="1"? "auto" : 10;
      if (this.data && this.data.resultData && this.data.resultData.length) {
          this.option.series[1].data = this.data.resultData.map((item) => {
            let obj = {
              name: this.status=="1"? item.alarmTypeLabel: item.vulnTypeLabel,
              value: this.status=="1"? item.alarmTypeCount : item.vulnTypeCount,
              paramsValue : item.dictValue,
            }
            return obj;
          });
          let targetType = this.status=="1"? 'alarmTypeCount' : 'vulnTypeCount';
          let targetName = this.status=="1"? 'alarmTypeLabel' : 'vulnTypeLabel';
          this.option.legend.formatter = (name) =>{
            let target;
            for (let i = 0; i < this.data.resultData.length; i++) {
              if (this.data.resultData[i][targetName] === name) {
                target = this.data.resultData[i][targetType]
              }
            }
            var arr = [
              '{name|' + name + '}',
              '{repair|'  +(this.total ? ((target / this.total) * 100).toFixed(0) : 0) + '%}',
              '{value|' + target+ '}',
            ]
            return arr.join('  ')
          }
      }
      var chartDom = document.getElementById(this.chartUuid);
      this.name = this.data && this.data.name ? this.data.name : "";
      echarts.init(chartDom).dispose();
      var myChart = echarts.init(chartDom);
      myChart.setOption( this.option,
        myChart.off("click"),
        myChart.on("click", (params) => {
         
        })
      );
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    getThemeProperty(theme) {
      for (let item of this.visualThemeData) {
        if (item.dictValue === theme) {
          return JSON.parse(item.remark);
        }
      }
      return {};
    },
    //饼图、散点图是否显示数字
    showNumProperty(content) {
      if (
        this.isNotNull(content, "showNum") &&
        this.isNotNullLength(this.option, "series")
      ) {
        let showNum = content.showNum;
        if (showNum != true) {
          this.option.series.forEach((item) => {
            lodash.set(item, "label.formatter", function (val) {
              return (
                "" +
                (val.data.name && val.data.name.length > showNum
                  ? val.data.name.substr(0, showNum) + "..."
                  : val.data.name) +
                " : " +
                val.data.value +
                " (" +
                val.percent +
                "%)"
              );
            });
          });
        } else {
          this.option.series.forEach((item) => {
            lodash.set(item, "label.formatter", {
              formatter: "{b} : {c} ({d}%)",
            });
          });
        }
        lodash.set(this.option, "tooltip.formatter", function (val) {
          return (
            '<i style="display: inline-block;width: 10px;height: 10px;background: ' +
            val.color +
            ';margin-right: 5px;border-radius: 50%;}"></i> ' +
            val.data.name +
            " : " +
            val.data.value +
            " (" +
            val.percent +
            "%)"
          );
        });
      }
    },
    toColor(color,p){
      let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      if(reg.test(color)){
        return this.colorHex(color,p);
      }else{
        let hoverColor = '';
        let Numbers = color.match(/(\d(\.\d+)?)+/g);
        if(Numbers && Numbers.length){
          Numbers = Numbers.slice(0,3).concat(p);
          hoverColor = 'rgba('+Numbers.join(',')+')';
          return hoverColor;
        }
      }
    },
    colorHex(h,p){
      // 16进制颜色值的正则
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      // 把颜色值变成小写
      var color = h;
      if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
          var colorNew = "#";
          for (var i = 1; i < 4; i += 1) {
            colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
          }
          color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
          colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        colorChange = colorChange.slice(0,3).concat(p);
        return "rgba(" + colorChange.join(",") + ")";
      } else {
        return color;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.chart-bg{
  width: 100%;
  height: 100%;
}
</style>
