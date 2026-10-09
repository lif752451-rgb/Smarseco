<template>
  <UniversalChart v-if="xAxisData.length > 0 && !loading" :options="optionInfo"  ref="chartRef"></UniversalChart>
  <NoDataCmpt v-else></NoDataCmpt>
</template>
<script setup lang="ts">
//  组件功能：用于常用的 echarts 的折线图渲染，接收参数如下：
// 1. seriesList  { name: string; data: number[]; color: string }[] 注意 color 为 rgba
// 2. xAxisData  {string[]} 横轴的列表
// import { CustomDeepClone } from "@/utils/format";

interface Props {
  seriesList: any[];
  xAxisData: string[];
  legendPosition?: { top: string; right: string };
  legendInfo?: any;
  yMax?: number;
  yMin?: number;
  dataZoom?: boolean;
  visual?: any;
  formatter?: any;
  yAxisName?: string[];
  showXAxisLabel?: boolean;
  xAxisFormat?: any;
  yAxisFormat?: any;
  grid?: any;
  theme?: string; //主题
}
//默认图例与图横向排列 horizontal vertical
const props = defineProps<Props>();
const { legendPosition, legendInfo, yMax, yMin, dataZoom, visual, formatter, yAxisName } = props;
const { seriesList, xAxisData }: any = toRefs<Props>(props);
const optionInfo: Ref<any> = ref();
const chartRef = ref(); //图表
const loading: Ref<boolean> = ref(true); // loading

let option: any = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
    formatter: formatter || "",
  },
  legend: {
    data: [],
    top: "top",
    right: 0,
    ...legendInfo,
    ...legendPosition,
  },
  grid: {
    top: 30,
    left: "3%",
    right: "4%",
    bottom: dataZoom ? 50 : "10%",
    containLabel: true,
    ...props.grid,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisLabel: {
      show: props.showXAxisLabel,
      formatter: props.xAxisFormat || undefined,
    },
    axisTick: {
      show: false,
    },
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
    splitNumber: 5,
    minInterval: 1,
    splitLine: {
      show: false,
    },
    max: yMax || null,
    axisLine: {
      show: true,
    },
  },
  dataZoom: [
    {
      show: Boolean(dataZoom),
      bottom: legendPosition?.top === "bottom" ? 35 : 20,
    },
  ],
  visualMap: [],
  series: [],
};
onMounted(() => {
  renderChart();
  watch(
    () => {
      return xAxisData.value;
    },
    (newVal, oldVal) => {
      loading.value = true;
      renderChart();
      nextTick(() => {
        loading.value = false;
      });
    },
    { deep: true, immediate: true }
  );
});
const yAxisItem = {
  type: "value",
  splitNumber: 5,
  minInterval: 1,
  splitLine: {
    show: false,
  },
  max: yMax || null,
  min: yMin || 0,
  axisLine: {
    show: true,
  },
  axisLabel: {
    formatter: props.yAxisFormat || undefined,
  },
  nameGap: 10,
};

const renderChart = () => {
  let series: any[] = [];
  let visualMap: any[] = [];
  if (!seriesList.value || !seriesList.value.length) return;
  seriesList.value.forEach((item: any, idx: number) => {
    series.push({
      name: item.name || idx,
      type: "line",
      symbolSize: item?.data?.length > 10 ? 0 : 4, //横轴大于 10 个，不展示点
      // stack: 'Total',
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: `rgba(${item.color},0.5)`, // 0% 处的颜色
            },
            {
              offset: 0.8,
              color: `rgba(${item.color},0)`, // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
      emphasis: {
        focus: "series",
      },
      data: item.data,
    });
    if (visual) {
      // debugger
      let tmpVisual = visual[idx];
      tmpVisual.pieces[tmpVisual.pieces.length - 1].color = `rgba(${item.color},1)`;
      // visualMap.push(CustomDeepClone(tmpVisual));
      visualMap.push(tmpVisual);
    }
  });
  option.yAxis =
    yAxisName && yAxisName.length
      ? yAxisName.map((item) => {
          return {
            ...yAxisItem,
            name: item,
          };
        })
      : yAxisItem;
  option.series = series;
  option.visualMap = visualMap;
  option.legend.data = seriesList.value.map((item: any) => {
    return item.name;
  });
  option.xAxis.data = xAxisData.value;
  option["color"] = seriesList.value.map((item: any) => {
    return `rgb(${item.color})`;
  });
  optionInfo.value = option;
};
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
