<template>
  <div class="opet-scr-cnt-bot opet-scr-blk">
    <p class="opet-scr-blk-tlt">网络风险态势</p>
    <div class="opet-scr-blk-chart">
      <!-- <ChartScatter :params="netRiskChartOp"></ChartScatter> -->
      <ChartPreview :chartData="netRiskChartOp"></ChartPreview>

      <!-- <UniversalChart :options="netRiskChartOp"></UniversalChart> -->
    </div>
  </div>
</template>
<script setup>
import { ref, nextTick } from "vue";
import ChartScatter from "/@/components/old/Visual/chartScatter.vue";
import UniversalChart from "../universalChart/index.vue";
import { netRiskOption } from "./chartOptions.js";
import { netValueChart } from "/@/api/scp/screen/netSafe.js";
import ChartPreview from "/@/components/old/Visual/chartPreview.vue";
import { getChartDataParam } from "/@/api/stp/visual/visual";

let netRiskChartOp = ref({
  xAxisData: [],
  seriesData: [],
  text: "",
  top: "44%",
  radius: ["40%", "50%"],
  grid: {
    left: "3%",
    right: "4%",
    bottom: "7%",
    containLabel: true,
  },
  hiddenLegend: true,
});
nextTick(() => {
  getChartDatas();
});

const getChartDatas = async () => {
  let res = await netValueChart({
    id: "202403191431481410092",
  });
  if (res.code == 200) {
    let returnArr = res.data.resultData.map((item) => {
      return {
        ...item,
        name: item.name.substring(0, 10),
      };
    });
    netRiskChartOp.value = {
      ...netRiskChartOp.value,
      ...res.data,
      refresh: false,
      resultData: returnArr,
      resultTotal: res.data.resultTotal ? res.data.resultTotal : null,
      loading: false,
      styleType: 2,
      color: ["#932222", "#cf6338", "rgba(190,164,75,0.9)", "#437890", "#c2cf38", "#398db7", "#cdab30", "#394cb7", "rgba(97,145,197,0.9)", "#133d67"],
      legend: {
        show: false,
        left: "center",
      },
      grid: {
        left: "7%",
        right: "4%",
        bottom: 30,
        top: "10%",
      },
    };
  }
};
</script>

<style lang="less">
.opet-scr-cnt-bot {
  .opet-scr-blk-chart {
    > .content {
      height: 100%;
    }
  }
}
</style>
