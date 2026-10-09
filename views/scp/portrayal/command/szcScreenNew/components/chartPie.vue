<template>
  <div :id="chartUuid" class="chart-bg">
  </div>
</template>

<script>
import echarts from '/@/utils/old/echartsUI';
import lodash from "lodash-es";
import { randomString } from '/@/utils/util.common';
import { reqDict } from "/@/api/common";
import { evilFn } from "/@/utils/util.common";

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    status: {
      type: [String, Number],
      default: null,
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
          textStyle: { color: '#FFFFFF' },
        },
        legend: {
          orient: "vertical",
          right: "5%",
          bottom: 10,
          top: 10,
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#F2F2F2",
            fontSize: 12,
          },
        },
        series: [
          {
            data: [],
            type: "pie",
            center: ["35%", "50%"],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: { color: "#F2F2F2" },
            radius: ["40%", "50%"],
          },
        ],
        color: [
          "#4e69b0",
          "#728bce",
          "#6fbbd5",
          "#78dfe6",
          "#67ead5",
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
        return evilFn(data);
      } else {
        return {};
      }
    },
    init() {
      this.option.series[0].data = [];
      if(this.data && this.data.theme){
        this.option.color = this.getThemeProperty(this.data.theme).color;
      }
      if (this.data && this.data.resultData && this.data.resultData.length) {
          this.option.series[0].data = this.data.resultData.map((item) => {
            let obj = {
              name: this.status == 'alarmOrder'?item.orderStatus:item.dictLabel,
              value:  this.status == 'alarmOrder'?item.allCount:item.total,
              paramsValue : item.dictValue,
            };
            if(this.data && this.data.jsonProperty &&  JSON.parse(this.data.jsonProperty) && JSON.parse(this.data.jsonProperty).legendDataColor){
              let legendDataColor =JSON.parse(this.data.jsonProperty).legendDataColor;
              if (legendDataColor.hasOwnProperty(obj.name + "") && legendDataColor[obj.name + ""] != null) {
                obj.itemStyle = {normal:{color: legendDataColor[obj.name + ""]}}
              }
            }
            return obj;
          });
      }
      if(this.data && this.data.jsonProperty){
        const content = JSON.parse(this.data.jsonProperty) || {};
        if (content.center) {
          this.option.series[0].center = content.center;
        }
        if (content.radius) {
          this.option.series[0].radius = content.radius;
        }
        if (content.legendRight) {
          this.option.legend.right = content.legendRight;
        }
        this.showNumProperty(content);
      }
      var chartDom = document.getElementById(this.chartUuid);
      this.name = this.data && this.data.name ? this.data.name : "";
      echarts.init(chartDom).dispose();
      var myChart = echarts.init(chartDom);
      myChart.setOption( this.option,
        myChart.off("click"),
        myChart.on("click", (params) => {
          this.$emit('chartPieClick',params.data, this.status)
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
  },
};
</script>

<style lang="less" scoped>
</style>
