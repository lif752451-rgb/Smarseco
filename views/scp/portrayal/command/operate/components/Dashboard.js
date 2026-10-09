import lodash from 'lodash-es';

class Dashboard {
  constructor() {
    this.title = {
      x: 'center', y: 'center',
        textStyle: {
        rich:{
          a: { fontSize: 16, color: '#c6c8d2' },
          c: { fontSize: 10, color: '#6d7392', verticalAlign: 'bottom', padding: [0,2] }
        }
      }
    }
    this.series = [
      {
        type: 'pie', radius: ['88%', '70%'],
        silent: true, clockwise: true,
        startAngle: 105, z: 0, zlevel: 0,
        label: { normal: { position: "center" } },
        data: [
          {
            name: "",
            itemStyle: {
              normal: { color: { colorStops: [{ offset: 0 }, { offset: 1 }] } }
            }
          }, {
            name: "",
            label: { normal: { show: false } },
            itemStyle: { normal: { color: "#343b62" } }
          }
        ]
      },
      {
        name: "", type: "gauge", radius: "88%", center: ['50%', '50%'],
        startAngle: 0, endAngle: -359.9, splitNumber: 24, hoverAnimation: true,
        axisTick: { show: false },
        splitLine: { length: 69, lineStyle: { width: 4, color: "#020C3D" } },
        axisLabel: { show: false },
        pointer: { show: false },
        axisLine: { lineStyle: { opacity: 0 } },
        detail: { show: false },
        data: [{ value: 0, name: "" }]
      }
    ]
  }
  getOption(value, comparator, color1, color2) {
    let title = lodash.cloneDeep(this.title);
    title.text = `{a|${ comparator }${ value }}{c|%}`;
    let series = lodash.cloneDeep(this.series);
    series[0].data[0].value = value;
    series[0].data[0].itemStyle.normal.color.colorStops[0].color = color1;// 0% 处的颜色
    series[0].data[0].itemStyle.normal.color.colorStops[1].color = color2;// 100% 处的颜色
    series[0].data[1].value = 100 - value;
    return { title: title, series: series }
  }
}

export const dashboard = new Dashboard()
