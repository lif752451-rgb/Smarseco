<template>
	<div :id="chartUuid" class="chart-bg"></div>
</template>

<script>
import { randomString } from '/@/utils/util.common'
import echarts from '/@/utils/old/echartsUI'
export default {
	components: {
	},
	props: {
		data: {
			type: [Number, String],
			default: 0
		},
		level: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			chartUuid: "",
			option: {
        backgroundColor: '',
        radius: ['40%', '40%'],
        grid: {
          left: 'center',
          bottom: 0,
          top: "1%",
        },
        series: [
          {
            type: 'gauge',
            radius: '240',
            startAngle: 180,
            endAngle: 0,
            center: [ '50%', '75%' ],
            splitNumber: 5,         // 分隔线之间分割的刻度数,默认 5。
            axisTick: {             // 刻度(线)样式。
              show: true,             // 是否显示刻度(线),默认 true。
								length: 15,
              lineStyle: {
                color: 'auto',
                width: 3,     // 刻度线样式。   
                type: "solid",              //线的类型,默认 solid。 此外还有 dashed,dotted
              },
            },
            splitLine: {
								length: 25,
              splitNumber: 20,
              lineStyle: {
                color: 'auto',
                width: 8
              }
            },
            pointer: {
              length: '20%',
              width: 10,
              offsetCenter: [0, '-60%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisLine: {
              lineStyle: {
                width: 16, // 这个是修改外圈宽度的属性
                color: [[0.3, new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#FFD700" }, //柱图渐变色
                    { offset: 1, color: "#FF0017" }, //柱图渐变色
                  ])
                ], // 0-30%的颜色
                [0.7, new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#FFD700" }, //柱图渐变色
                    { offset: 1, color: "#00FF60" }, //柱图渐变色
                  ])
                ],
                [1, new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#00FF60" }, //柱图渐变色
                    { offset: 1, color: "#00F2E6" }, //柱图渐变色
                  ])
                ],
                ],
              }
            },
            axisLabel: { // 分割刻度提示
              show: true,
              overflow: 'truncate',
              distance: 26,
              fontSize: 22,
              color: "#ffffff"
            },
            textStyle: {
              fontSize: 8
            },
            detail: {               // 仪表盘详情，用于显示数据。(仪表盘的数值字体样式和显示位置)
              show: true,             // 是否显示详情,默认 true。
              offsetCenter: [0, '-25%'],// 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: "#727272",          // 文字的颜色,默认 auto。
              fontSize: 32,           // 文字的字体大小,默认 15。
              formatter: value => {
                return `{value|${value}}\n\n{name|${this.level}}`
              },
              rich: {
                name: {
                  fontSize: 40,
                  color: `#ffffff`,
                  lineHeight: 44,
                },
                value: {
                  fontSize: 40,
                  color: `#ffffff`,
                  lineHeight: 24,
                }
              }
            },
            data: [{ value: 0 }]
          },
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: [
              '50%',
              '75%'
            ],
            radius: '260', // 1行3
            axisLine: { // 坐标轴线
              lineStyle: { // 属性lineStyle控制线条样式
                width: 5,
                color: [
                  [1, new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#02A6F9" }, //柱图渐变色
                    { offset: 1, color: "#1b3d51" }, //柱图渐变色
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
        ]
      },
		}
	},
	computed: {},
	watch: {
		data: {
			handler() {
				this.$nextTick(() => {
					this.init();
				})
			},
			immediate: true,
			deep: true,
		},
	},
	mounted() {
		let _this = this
		this.chartUuid = randomString(16);
		setTimeout(() => {
			_this.init()
		}, 0);
	},
	created() { },

	methods: {
		init() {
			let chartDom = document.getElementById(this.chartUuid);
			echarts.init(chartDom).dispose();
			if (this.data) {
				this.option.series[0].data[0]['value'] = this.data;
			}
			let myChart = echarts.init(chartDom);
			myChart.setOption(this.option);
			window.addEventListener("resize", function () {
        myChart.resize();
      });
		},
	},
}
</script>

<style lang="less" scoped>
.chart-bg {
	width: 100%;
	height: 350px;
}
</style>
