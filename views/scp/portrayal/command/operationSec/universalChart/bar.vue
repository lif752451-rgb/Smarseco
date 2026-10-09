<template>
  <UniversalChart v-if="!noData" :options="optionInfo" @click="chartClick"></UniversalChart>
  <NoDataCmpt v-else type="bar"></NoDataCmpt>
</template>
<script setup lang="ts">
import { Ref, ref } from "vue";

//  组件功能：用于常用的 echarts 的状柱图渲染，接收参数如下：
// 1. seriesDataMap  {[key:string]:number} 形如 {"交换机":{value:12},"路由器":{value:12}}
interface Props {
  seriesDataMap: { [key: string]: any };
  originSort?: boolean;
  theme?: string; //主题
  isdataZoom?: boolean; //是否显示滚动条
  notShowYaxis?: boolean; //是否显示Y轴
  isShowLabel?: boolean; // 是否上方显示数值
}
const noData: Ref<boolean> = ref(false);

const props = defineProps<Props>();
const optionInfo: Ref<any> = ref();
const emits = defineEmits(["barClick"]);

let option: any = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {},
  color: {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "#03DFFC", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "#1B66CE", // 100% 处的颜色
      },
    ],
    global: false, // 缺省为 false
  },
  grid: {
    left: props.notShowYaxis ? "10" : "40",
    right: "0",
    bottom: "30",
    top: "20",
  },
  dataZoom: props.isdataZoom
    ? [
        //滑动条
        {
          show: true, //是否显示滑动条
          type: "inside", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
          startValue: 0, // 从头开始。
          endValue: 4, // 一次性展示6个。
          showDataShadow: false,
          height: 2,
          bottom: 10,
        },
      ]
    : [],
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    show: !props.notShowYaxis,
    type: "value",
    min: 0,
    minInterval: 1,
    splitNumber: 5,
    splitLine: {
      lineStyle: {
        type: "dashed",
        opacity: 0.6,
      },
    },
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
      showBackground: false,
      itemStyle: {},
      barWidth: 24,
      barMinHeight: 5,
      label: {
        //柱体上显示数值
        show: props.isShowLabel, //开启显示
        position: "top", //在上方显示
        textStyle: {
          //数值样式
          fontSize: "12px",
        },
        formatter: "{c}",
      },
    },
  ],
};

const renderChart = () => {
  let listMap = Object.keys(props.seriesDataMap)
    .map((item) => {
      const value = props.seriesDataMap[item];
      let tmpItem = value;
      if (!isNaN(Number(value))) {
        tmpItem = { value: value };
      }
      return {
        label: item,
        ...tmpItem,
      };
    })
    .filter((item) => {
      return item.value > 0;
    });
  noData.value = listMap.length <= 0;
  if (!props.originSort) {
    listMap.sort((a, b) => b.value - a.value);
  }
  option.series[0].data = listMap.map((item) => {
    let tmpDataItem = { value: item.value, name: item.key };
    if (item.rgb) {
      tmpDataItem["itemStyle"] = {
        color: `rgb(${item.rgb})`,
      };
    }
    if (item.color) {
      tmpDataItem["itemStyle"] = {
        color: item.color,
      };
    }
    return tmpDataItem;
  });
  option.xAxis.data = listMap.map((item) => {
    return item.label;
  });
  optionInfo.value = option;
};

const chartClick = (event) => {
  emits("barClick", event?.data);
};

watch(
  () => props.seriesDataMap,
  () => {
    renderChart();
  },
  {
    deep: true,
    immediate: true,
  }
);

defineExpose({
  renderChart,
});
</script>
<style scoped lang="less">
.echarts-wrap {
  width: 100%;
  height: 100%;
}
</style>
