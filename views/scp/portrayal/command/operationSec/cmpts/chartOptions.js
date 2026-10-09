import echarts from "/@/utils/old/echartsUI";
import "echarts-liquidfill";
// 互联网资产分布图表配置
const gridInfos = {
  left: "3%",
  right: "3%",
  bottom: "3%",
  containLabel: true
};
const textColor = "#a5a4a4";
export let netBarChartOptions = (labels, datas, name = "数据") => {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: gridInfos,
    xAxis: [
      {
        type: "category",
        data: labels,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          rotate: "30",
          textStyle: {
            color: textColor, //更改坐标轴文字颜色
            fontSize: 12 //更改坐标轴文字大小
          }
        }
      }
    ],
    yAxis: {
      type: "value",
      axisLabel: {
        color: textColor
      },
      splitLine: {
        //分隔辅助线
        lineStyle: {
          type: [10, 5], //线的类型 虚线0
          opacity: 0.2, //透明度
          dashOffset: 5
        }
      }
    },
    series: [
      {
        name: name,
        type: "bar",
        barWidth: "40%",
        label: {
          show: true,
          position: "top",
          fontSize: 10,
          color: textColor
        },
        itemStyle: {
          color: "rgb(39, 73, 253)"
        },

        data: datas
      }
    ]
  };
};

// 安全工作落实情况图表配置
export const safeAlarmBarOptions = (datas) => {
  let xData = datas.xData;
  let yData = datas.yData || [{ name: "", data: [] }];
  let colorList = [
    "#bc2540",
    "#007c65",
    "#5ad8a6",
    "#f3a025",
    "#35bdd1",
    "#7b74dc",
    "#4caf50",
    "#d54a00",
    "#4caf50",
    "#133d67"
  ];
  let seriesArr = yData.map((item, k) => {
    return {
      name: item.name,
      data: item.data.length ? item.data : [0, 0, 0, 0, 0, 0],
      type: "bar",
      stack: "safe",
      emphasis: { focus: "series" },
      animationDuration: 1000,
      animationEasing: "cubicInOut",
      barWidth: 20,
      barGap: 0,
      barMinHeight: 1,
      itemStyle: {
        color: colorList[k],
        borderColor: "transparent",
        borderJoin: "round",
        borderType: "solid"
      },
      label: {
        show: false,
        color: "#fafafa",
        fontSize: 12
      }
    };
  });
  return {
    series: seriesArr,
    yAxis: {
      type: "value",
      axisLabel: {
        color: textColor,
        margin: 20
      },
      splitLine: {
        //分隔辅助线
        lineStyle: {
          type: [10, 5], //线的类型 虚线0
          opacity: 0.2, //透明度
          dashOffset: 5
        }
      }
    },
    dataZoom: {
      show: true,
      bottom: 10,
      height: 10,
      filterMode: "none" // 是否过滤数据
    },
    grid: {
      top: "5%",
      left: "2%",
      right: "3%",
      bottom: 30,
      containLabel: true
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xData,
      axisLine: { show: false },
      axisTick: { show: false }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line"
      },
      textStyle: {
        color: "#fafafa"
      },
      borderColor: "transparent",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      extraCssText: "backdrop-filter: blur(6px);",
      order: "seriesDesc"
    }
  };
};

// 漏洞分布 图表配置
export const bugBarChartOptions = (barData) => {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      show: true,
      top: 20,
      //   right: 50,
      //   itemGap: 20,
      textStyle: {
        color: "#fff"
      }
    },
    grid: gridInfos,
    xAxis: [
      {
        type: "category",
        data: barData.xAxis,
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: "#394458"
          }
        },
        axisLabel: {
          interval: 0,
          margin: 10,
          rotate: 30,
          // margin: 20,
          color: "#05D5FF",
          textStyle: {
            fontSize: 12,
            color: textColor //更改坐标轴文字颜色
          }
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          padding: [3, 0, 0, 0],
          formatter: "{value}",
          color: textColor
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: "#394458"
          }
        },
        splitLine: {
          lineStyle: {
            color: "#394458"
          }
        }
      }
    ],
    series: [
      {
        name: "待修复",
        type: "bar",
        barWidth: "18%",
        data: barData.data,
        itemStyle: {
          color: "#ff7728"
        }
      },
      {
        name: "已修复",
        type: "bar",
        barWidth: "18%",
        data: barData.data2,
        itemStyle: {
          color: "rgb(39, 73, 253)"
        }
      }
    ]
  };
};
const formatPer = (num, total) => {
  let per = total ? num / total : 0;
  return Number(((per ? per : 0) * 100).toFixed(2));
};
export const pieCircleOptions = (infos, type) => {
  let data = infos.data;
  let colorList = [
    "#f57423",
    "#e6a651",
    "#7b74dc",
    "#3A71A8",
    "#35bdd1",
    "#bc2540",
    "#5ad8a6",
    "#007c65",
    "#267EE5",
    "#E65D6E",
    "#BBBFC4",
    "#30B08F"
  ];
  // 资源使用色值
  let baseData1 = data.map((item) => {
    return {
      value: item.value,
      name: item.name,
      itemStyle: {
        normal: {
          color: "rgba(77, 89, 110, 0.6)"
        }
      }
    };
  });
  let legendAttr = {
    orient: "vertical",
    icon: data.length > 4 ? "circle" : "roundRect",
    // borderRadius: data.length > 4 ? 0 : 10,
    width: 100,
    itemWidth: 8,
    itemHeight: 8,
    height: 150,
    top: "center",
    formatter: (name) => {
      for (let i = 0; i < data.length; i++) {
        let percent = formatPer(data[i].value, infos.num);
        if (name == data[i].name) {
          return "{name|" + name + "}{value|" + "(" + percent + "%)}";
        }
      }
    },
    textStyle: {
      rich: {
        name: {
          color: "#ccd8dd",
          fontSize: 10,
          fontWeight: 400,
          height: 20,
          padding: [0, 0, 0, 5]
        },
        value: {
          color: "#ccd8dd",
          fontSize: 10,
          fontWeight: 500,
          height: 20,
          align: "left"
        }
      }
    }
  };
  let legendArr =
    data.length > 4
      ? [
          {
            ...legendAttr,
            right: 0,
            data: data.slice(Math.floor(data.length / 2), data.length).map((item) => item.name)
          },
          {
            ...legendAttr,
            right: "40%",
            data: data.slice(0, Math.ceil(data.length / 2)).map((item) => item.name)
          }
        ]
      : [
          {
            ...legendAttr,
            left: "70%",
            data: data.map((item) => item.name)
          }
        ];
  let pieCenterType = {
    1: ["38%", "50%"],
    2: ["15%", "50%"]
  };
  return {
    legend: legendArr,
    title: {
      show: true,
      text: infos.num,
      subtext: infos.title,
      x: type == 1 ? "36%" : "14%",
      y: "33%",
      itemGap: 6,
      textStyle: {
        color: "#ccd8dd",
        fontSize: 18,
        fontWeight: "800",
        lineHeight: 26,
        borderTopWidth: 20,
        borderColor: "red"
      },
      subtextStyle: {
        color: "#5d7092",
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 30
      },
      textAlign: "center"
    },
    tooltip: {
      show: true
    },
    color: colorList,
    series: [
      {
        // 这个是彩色圈圈
        type: "pie",
        selectedMode: "single",
        hoverAnimation: true,
        radius: ["72%", "78%"],
        center: pieCenterType[type],
        showEmptyCircle: false,
        selectedOffset: 0,
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          disabled: false,
          scaleSize: 3,
          scale: true,
          itemStyle: {
            borderWidth: 1,
            borderColor: "white"
          }
        },
        select: {
          itemStyle: {
            borderWidth: 2,
            borderColor: "white",
            borderRadius: "85%"
          }
        },
        data: data
      },
      {
        // 这个是灰色的圈圈
        type: "pie",
        zIndex: 0,
        tooltip: {
          show: false
        },
        showEmptyCircle: true,
        hoverAnimation: false,
        radius: ["65%", "72%"],
        center: pieCenterType[type],
        label: {
          normal: {
            show: false
          }
        },
        data: baseData1
      }
    ]
  };
};

export const anlansRateOption = (value = 0.4) => {
  return {
    series: [
      {
        name: "分析研判比",
        type: "liquidFill",
        radius: "60%",
        center: ["50%", "50%"],
        backgroundStyle: {
          color: "rgba(77, 89, 110, 0.2)"
        },
        data: [value, value],
        amplitude: 5, //水波振幅
        label: {
          //标签设置
          position: ["50%", "45%"],
          formatter: (params) => {
            return `${(params.value * 100).toFixed(0)}%\n {a|分析研判比}`;
          },
          rich: {
            a: {
              fontSize: 14
            }
          },
          textStyle: {
            fontSize: 20, //文本字号
            color: "#ccd8dd"
          }
        },
        outline: {
          show: false
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 1,
              color: "#004a99"
            },
            {
              offset: 0.85,
              color: "rgba(79,71,183,.8)"
            },
            {
              offset: 0.35,
              color: "rgba(79,71,183,.6)"
            },
            {
              offset: 0,
              color: "rgba(79,71,183,.4)"
            }
          ])
        }
      }
    ]
  };
};

export const netRiskOption = (datas) => {
  let colorList = [
    "#bc2540",
    "#007c65",
    "#5ad8a6",
    "#f3a025",
    "#35bdd1",
    "#7b74dc",
    "#4caf50",
    "#d54a00",
    "#4caf50",
    "#133d67"
  ];
  let seriesArr = Object.entries(datas.group).map((item, k) => {
    return {
      name: item[0],
      type: "scatter",
      symbolSize: function (val) {
        return val * 5;
      },
      data: item[1],
      animationDelay: function (idx) {
        return idx * 5;
      },
      itemStyle: {
        color: colorList[k],
        opacity: 0.6
      }
    };
  });
  return {
    tooltip: {
      position: "top"
    },
    legend: {
      show: false,
      left: "center"
    },
    xAxis: {
      name: "日期",
      type: "category",
      data: datas.date,
      boundaryGap: false,
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      name: "组织机构",
      type: "category",
      data: Object.keys(datas.group),
      axisLabel: {
        color: textColor,
        margin: 30
      },
      splitLine: {
        //分隔辅助线
        show: true,
        lineStyle: {
          type: [10, 5], //线的类型 虚线 0
          opacity: 0.2, //透明度
          dashOffset: 5,
          type: "dashed"
        }
      },
      axisLine: {
        show: false
      }
    },
    series: seriesArr
  };
};
