import { computed } from "vue";
import type { EChartsOption } from "echarts";

interface optionsFn {
  (): EChartsOption;
}

export default function useChartOption(sourceOption: optionsFn) {
  const chartOption = computed<EChartsOption>(() => {
    return sourceOption();
  });
  return {
    chartOption,
  };
}
