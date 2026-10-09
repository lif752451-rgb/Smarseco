<template>
  <ECharts v-if="renderChart" ref="vChart" :option="chartOption" :autoresize="autoResize" :style="{ width, height }" @click="chartClick" @legendselectchanged="chartLegendSelectChanged" @selectchanged="chartSelectChanged" />
</template>

<script lang="ts" setup>
import echarts from "/@/utils/old/echartsUI";
import ECharts from "vue-echarts";
import useChartOption from "./chart-option";
import { nextTick, ref, defineProps, defineEmits, watch } from "vue";
echarts;
interface Emits {
  (event: "click", value: unknown): void;
  (event: "legendselectchanged", value: unknown): void;
  (event: "selectchanged", value: unknown): void;
}
let vChart = ref(null);
const props = defineProps({
  options: {
    type: Object,
    default() {
      return {};
    },
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "100%",
  },
  unselect: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits<Emits>();
const renderChart = ref(false);
nextTick(() => {
  renderChart.value = true;
});
// watch(
//   () => props.unselect,
//   (val) => {
//     if (val) {
//       console.log("unselect", val);
//       vChart.value.dispatchAction({
//         type: "unselect",
//       });
//     }
//   },
//   {
//     deep: true,
//     immediate: true,
//   }
// );
const { chartOption } = useChartOption(() => {
  return { ...props.options };
});

function chartClick(val) {
  emits("click", val);
}

function chartLegendSelectChanged(val) {
  emits("legendselectchanged", val);
}
function chartSelectChanged(val) {
  emits("selectchanged", val);
}
</script>
