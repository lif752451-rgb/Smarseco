<template>
  <div class="opet-scr-cnt-top">
    <div class="opet-scr-blk">
      <p class="opet-scr-blk-tlt">互联网资产系统分布</p>
      <div class="opet-scr-blk-chart">
        <UniversalChart :options="netValueBarOption"></UniversalChart>
      </div>
    </div>
    <div class="opet-scr-blk">
      <p class="opet-scr-blk-tlt">安全工作落实</p>
      <div class="opet-scr-blk-chart opet-scr-process">
        <div v-for="progress in safeWorkChartsMap" class="opet-scr-process-svg">
          <el-progress type="circle" :percentage="formatPer(progress.already, progress.total)" :stroke-width="8" status="success" :color="progress.color" :stroke-linecap="'square'">
            <div class="opet-scr-process-inner">
              <p>完成率</p>
              <p>{{ formatPer(progress.already, progress.total) }}%</p>
            </div>
          </el-progress>
          <div class="opet-scr-process-infos">
            <p>{{ progress.name }}</p>
            <p>签订数/总数</p>
            <p>{{ progress.already }}/{{ progress.total }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="opet-scr-blk">
      <p class="opet-scr-blk-tlt">漏洞分布</p>
      <div class="opet-scr-blk-chart">
        <UniversalChart :options="bugBarOption"></UniversalChart>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, nextTick, reactive } from "vue";
import UniversalChart from "../universalChart/index.vue";
import { netBarChartOptions, bugBarChartOptions } from "./chartOptions.js";
import { netValueChart } from "/@/api/scp/screen/netSafe.js";
let netValueBarOption = ref({});
let bugBarOption = ref({});
let safeWorkChartsMap = reactive({
  safeDuty: { name: "安全责任", color: "#ffc107", total: 0, already: 0 },
  secrecy: { name: "保密协议", color: "#00b191", total: 0, already: 0 },
  rankPro: { name: "等级保护", color: "#2f67de", total: 0, already: 0 },
  safeCheck: { name: "安全考核", color: "#7b74dc", total: 0, already: 0 },
});
nextTick(() => {
  // 互联网资产分布
  getNetValDatas("202403211001127910000");
  // 1. 安全责任书
  getNetValDatas("202403181633328010000");
  // 2. 保密协议
  getNetValDatas("202403181638457990003");
  // 3. 等级保护
  getNetValDatas("202403181642115650006");
  // 4. 安全考核
  getNetValDatas("202403181647515370007");

  // 12. 漏洞分布
  getNetValDatas("202301121345384710012");
});

// 互联网资产分布
const getNetValDatas = async (id) => {
  let param = {
    id: id,
  };
  if (id == "202301121345384710012") {
    param.paramJson = '{"deptId":"100","category":"1,2,3","sortField":"tobeRepairedVulnNumber"}';
  }
  let res = await netValueChart(param);
  if (res.code == 200) {
    // 互联网资产分布
    if (id == "202403211001127910000") {
      let netChartsDatas = res.data.resultData || [];
      let names = netChartsDatas.map((item) => item.deptName);
      let nums = netChartsDatas.map((item) => +item.total);
      netValueBarOption.value = netBarChartOptions(names, nums, "资产");
    }
    if (id == "202403181633328010000" && res.data.resultData.length > 0) {
      safeWorkChartsMap.safeDuty.total = res.data.resultData[0].noticeTaskSum || 0;
      safeWorkChartsMap.safeDuty.already = res.data.resultData[0].noticeDoneSum || 0;
    }
    if (id == "202403181638457990003" && res.data.resultData.length > 0) {
      safeWorkChartsMap.secrecy.total = res.data.resultData[0].noticeTaskSum || 0;
      safeWorkChartsMap.secrecy.already = res.data.resultData[0].noticeDoneSum || 0;
    }
    if (id == "202403181642115650006" && res.data.resultData.length > 0) {
      safeWorkChartsMap.rankPro.total = res.data.resultData[0].equalEvaluationCount || 0;
      safeWorkChartsMap.rankPro.already = res.data.resultData[0].unfinishedEqualEvaluationCount || 0;
    }
    if (id == "202403181647515370007" && res.data.resultData.length > 0) {
      safeWorkChartsMap.safeCheck.total = res.data.resultData[0].taskSum || 0;
      safeWorkChartsMap.safeCheck.already = res.data.resultData[0].doneSum || 0;
    }
    if (id == "202301121345384710012" && res.data.resultData.length > 0) {
      getBugValDatas(res.data.resultData);
    }
  } else {
  }
};
const getBugValDatas = (datas) => {
  let deptNames = [];
  let fixedArr = [];
  let unFixedArr = [];
  datas.forEach((datas) => {
    fixedArr.push(datas.fixedVulnNumber);
    unFixedArr.push(datas.tobeRepairedVulnNumber);
    deptNames.push(datas.deptName);
  });
  let barData = {
    data: unFixedArr,
    data2: fixedArr,
    xAxis: deptNames,
  };
  bugBarOption.value = bugBarChartOptions(barData);
};
const formatPer = (num, total) => {
  let per = total ? num / total : 0;
  return Number(((per ? per : 0) * 100).toFixed(2));
};
</script>

<style lang="less">
.opet-scr-cnt-top {
  display: flex;
  justify-content: space-between;
  > div {
    width: calc(33.3% - 8px);
  }
  .opet-scr-process {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    .el-progress {
      transform: scale(0.9);
    }
    &-svg {
      width: calc(50% - 12px);
      display: flex;
      justify-content: center;
      .el-progress-circle__track {
        stroke: rgb(77, 89, 110);
      }
      .el-progress-circle__path {
        transform: rotateY(180deg) translateX(-100%);
      }
    }
    &-inner {
      font-size: 14px;
      font-weight: bold;
      color: #ccd8dd;
      line-height: 20px;
    }
    &-infos {
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      font-weight: bold;
      flex: 1;
      margin-left: 6%;
      > p:first-child {
        position: relative;
        font-size: 14px;
        width: 100px;
        &::before {
          content: " ";
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: rgb(12, 104, 190);
          border: solid 3px;
          border-color: #353f43;
          left: -5px;
          top: 4px;
        }
      }
      > p:nth-child(2) {
        font-size: 11px;
        font-weight: normal;
        color: #5d7092;
        line-height: 24px;
        width: 100px;
        border-bottom: 1.5px solid rgb(20, 86, 152);
      }
      > p:last-child {
        margin-top: 4px;
        font-size: 16px;
      }
    }
  }
}
</style>
