<template>
  <div class="opet-scr-cnt-center">
    <div class="opet-scr-blk">
      <p class="opet-scr-blk-tlt">
        安全告警分布
        <el-radio-group class="opet-scr-time-btns" v-model="timeGroup" size="small" @change="changeTime">
          <el-radio-button label="2个月" value="60" />
          <el-radio-button label="1个月" value="30" />
          <el-radio-button label="1周" value="7" />
        </el-radio-group>
      </p>
      <div class="opet-scr-blk-chart center-pie-w">
        <div><UniversalChart :options="alarmPieOption" @selectchanged="pieClick1" :unselect="pie1Ref"></UniversalChart></div>
        <div><UniversalChart :options="attackPieOption" @selectchanged="pieClick2" :unselect="pie2Ref"></UniversalChart></div>
        <div><UniversalChart :options="anlansRate"></UniversalChart></div>
        <div><UniversalChart :options="safeBarOption"></UniversalChart></div>
      </div>
    </div>
    <div class="opet-scr-blk">
      <p class="opet-scr-blk-tlt">安全通报 & 预警</p>
      <div class="opet-scr-blk-chart opet-scr-table-w">
        <div class="opet-scr-tabs">
          <div v-for="(tab, key) in tableTypesMap" :class="{ active: key == activeTab }" class="opet-scr-tabs-blk" @click="changeTab(key)">{{ tab.label }} {{ tabCountMap[`${tab.attr}`] || 0 }}</div>
        </div>
        <div v-loading="tabLoading" class="opet-scr-table">
          <el-table size="small" :data="tableDatas" stripe style="width: 100%">
            <el-table-column type="index" label="序号" />
            <el-table-column prop="title" label="标题" showOverflowTooltip />
            <el-table-column prop="riskLevel" label="风险等级" />
            <el-table-column prop="createTime" label="提交时间" />
            <el-table-column prop="orderStatus" label="状态" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import lodash from "lodash-es";
import { onMounted, ref, nextTick } from "vue";
import { netValueChart } from "/@/api/scp/screen/netSafe.js";
import { pieCircleOptions, anlansRateOption, safeAlarmBarOptions } from "./chartOptions.js";
import UniversalChart from "../universalChart/index.vue";
let timeGroup = ref("7");
let tiemParms = ref({});
let pie1Ref = ref(false);
let pie2Ref = ref(false);

const alarmPieOption = ref({});
const attackPieOption = ref({});
const anlansRate = ref({});
const safeBarOption = ref({});
const tabLoading = ref(true);
const tableTypesMap = ref({
  1: {
    label: "待下发",
    attr: "downSum",
    tabKey: "downStatus",
  },
  2: {
    label: "待反馈",
    attr: "unstartSum",
    tabKey: "unstartStatus",
  },
  3: {
    label: "执行中",
    attr: "haveSum",
    tabKey: "haveStatus",
  },
  4: {
    label: "闭环",
    attr: "doneSum",
    tabKey: "doneStatus",
  },
});
let alarmLevelArr = ref([]);
let attackArr = ref([]);
let pieSelectMap = ref({});
const tabCountMap = ref({});
const activeTab = ref(1);
const tableDatas = ref([
  { title: "***安全事件通报1", rank: "1", time: "", status: "" },
  { title: "流量超阈值安全事件通报", rank: "2", time: "", status: "" },
]);
const changeTab = (key) => {
  tabLoading.value = true;

  if (activeTab.value === +key) {
    activeTab.value = 0;
  } else {
    activeTab.value = +key;
  }
  getAlarmCount("202403191125348310047", true);
};
const fomatterAlarmPieDatas = (datas) => {
  let count = datas.reduce((pre, cur) => {
    return cur.alarmLevelSum + pre;
  }, 0);
  let chartArr = [];
  datas.forEach((item) => {
    alarmLevelArr.value = lodash.cloneDeep(datas);

    chartArr.push({
      name: item.alarmLevelLabel,
      index: item.alarmLevel,
      value: item.alarmLevelSum || 0,
    });
  });
  let pieData = {
    title: "告警总数",
    num: count,
    data: chartArr,
  };
  alarmPieOption.value = pieCircleOptions(pieData, 1);
};
const fomatterAttackPieDatas = (datas) => {
  let count = datas.reduce((pre, cur) => {
    return cur.alarmAttackSum + pre;
  }, 0);

  let chartArr = [];
  datas.forEach((item) => {
    attackArr.value = lodash.cloneDeep(datas);
    chartArr.push({
      name: item.alarmAttackLabel,
      value: item.alarmAttackSum || 0,
    });
  });
  let pieData = {
    title: "告警攻击手段",
    num: count,
    data: chartArr,
  };
  attackPieOption.value = pieCircleOptions(pieData, 2);
};
const formatBarDatas = (datas) => {
  // alarmAttemptSum - 企图
  // alarmCanSuccesSum 疑似成功
  // alarmCanFallSum 疑似失陷
  // alarmFailSum 失败
  // alarmHasFallenSum 已失陷
  // alarmSuccesSum 攻击成功
  let alarmAttemptSum = [];
  let alarmCanSuccesSum = [];
  let alarmCanFallSum = [];
  let alarmFailSum = [];
  let alarmHasFallenSum = [];
  let alarmSuccesSum = [];
  let deptNames = [];
  datas.forEach((item) => {
    item.deptName && deptNames.push(item.deptName);
    alarmAttemptSum.push(item.alarmAttemptSum);
    alarmCanSuccesSum.push(item.alarmCanSuccesSum);
    alarmCanFallSum.push(item.alarmCanFallSum);
    alarmFailSum.push(item.alarmFailSum);
    alarmHasFallenSum.push(item.alarmHasFallenSum);
    alarmSuccesSum.push(item.alarmSuccesSum);
  });
  safeBarOption.value = safeAlarmBarOptions({
    xData: deptNames,
    yData: [
      {
        name: "企图",
        data: alarmAttemptSum,
      },
      {
        name: "疑似成功",
        data: alarmCanSuccesSum,
      },
      {
        name: "疑似失陷",
        data: alarmCanFallSum,
      },
      {
        name: "失败",
        data: alarmFailSum,
      },
      {
        name: "已失陷",
        data: alarmHasFallenSum,
      },
      {
        name: "攻击成功",
        data: alarmSuccesSum,
      },
    ],
  });
};
const getAlarmCount = async (id, hasParam = false, paramsObj = null) => {
  let datas = {
    id: id,
  };
  if (hasParam && activeTab.value && id == "202403191125348310047") {
    tableDatas.value = [];
    datas.paramJson = {};
    let param = {};
    param[`${tableTypesMap.value[activeTab.value].tabKey}`] = 1;
    datas.paramJson = JSON.stringify(param);
  } else if (hasParam && paramsObj) {
    datas.paramJson = JSON.stringify(paramsObj);
  }
  let res = await netValueChart(datas);
  if (res.code == 200) {
    if (id == "202403191139506910069" && res.data.resultData.length > 0) {
      tabCountMap.value = res.data.resultData[0];
    }
    if (id == "202403191125348310047") {
      tableDatas.value = res.data.resultData || [];
      tabLoading.value = false;
    }
    if (id == "20240318172305460004" && res.data.resultData.length > 0) {
      fomatterAlarmPieDatas(res.data.resultData);
    }
    if (id == "202403181730041450005" && res.data.resultData.length > 0) {
      fomatterAttackPieDatas(res.data.resultData);
    }
    if (id == "202403181736053850011" && res.data.resultData.length > 0) {
      let rate = res.data.resultData[0].alarmSum ? res.data.resultData[0].unAlarmJudgeSum / res.data.resultData[0].alarmSum : 0;
      anlansRate.value = anlansRateOption(Number(rate).toFixed(1));
    }
    if (id == "202403181815342760021") {
      formatBarDatas(res.data.resultData);
    }
  } else {
    tabLoading.value = false;
  }
};

nextTick(() => {
  changeTime(7);
  // 6. 告警等级分布占比
  // getAlarmCount("20240318172305460004");
  // // 7. 告警攻击手段分布占比
  // getAlarmCount("202403181730041450005");

  // // 8. 分析研判比
  // getAlarmCount("202403181736053850011");

  // // 9. 各公司告警攻击结果分布
  // getAlarmCount("202403181815342760021");

  getAlarmCount("202403191139506910069");
  getAlarmCount("202403191125348310047", true);
});
const formatterTimes = () => {
  function getTimes(date2) {
    return `${date2.getFullYear()}-${date2.getMonth() + 1 < 10 ? `0${date2.getMonth() + 1}` : date2.getMonth() + 1}-${date2.getDate()}`;
  }
  let nowDate = new Date();
  let daysAgo = new Date(nowDate.getTime() - +timeGroup.value * 24 * 60 * 60 * 1000);
  let nowDay = getTimes(nowDate);
  let preDay = getTimes(daysAgo);
  tiemParms.value = {
    startDate: preDay,
    endDate: nowDay,
  };
};
const changeTime = (val, fresh = true) => {
  formatterTimes();
  pieSelectMap.value = {};
  getAlarmCount("20240318172305460004", true, tiemParms.value);
  getAlarmCount("202403181730041450005", true, tiemParms.value);
  getAlarmCount("202403181736053850011", true, tiemParms.value);
  getAlarmCount("202403181815342760021", true, tiemParms.value);
};

const pieClick1 = (val) => {
  pieSelectMap.value = {
    ...tiemParms.value,
  };
  console.log("pie2Ref.value", pie2Ref.value);
  pie2Ref.value = true;
  let selectArr = val?.selected || [];
  if (selectArr.length) {
    let index = selectArr[0].dataIndex[0];
    // 需要筛选
    pieSelectMap.value.alarmLevel = alarmLevelArr.value[index].alarmLevel;
    getAlarmCount("202403181730041450005", true, pieSelectMap.value);
    getAlarmCount("202403181736053850011", true, pieSelectMap.value);
    getAlarmCount("202403181815342760021", true, pieSelectMap.value);
  } else {
    // 不需要筛选
    changeTime(timeGroup.value, false);
  }
};

const pieClick2 = (val) => {
  pieSelectMap.value = {
    ...tiemParms.value,
  };
  pie1Ref.value = true;
  let selectArr = val?.selected || [];
  if (selectArr.length) {
    let index = selectArr[0].dataIndex[0];
    // 需要筛选
    pieSelectMap.value.attackMeans = attackArr.value[index].alarmAttackLabel;
    getAlarmCount("20240318172305460004", true, pieSelectMap.value);
    getAlarmCount("202403181736053850011", true, pieSelectMap.value);
    getAlarmCount("202403181815342760021", true, pieSelectMap.value);
  } else {
    // 不需要筛选
    changeTime(timeGroup.value, false);
  }
};
</script>

<style lang="less">
.opet-scr-tab-Pse {
  position: absolute;
  content: "";
  width: 6px;
  height: 2px;
  top: -5px;
  background-color: rgba(0, 98, 255, 0.6);
}
.opet-scr-cnt-center {
  display: flex;
  justify-content: space-between;
  height: 420px;
  > div {
    width: calc(50% - 8px);
  }
  .center-pie-w {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    overflow: hidden;
    > div {
      width: calc(50% - 8px);
      height: calc(50% - 8px);
    }
    > div:first-child {
      width: 30%;
    }
    > div:nth-child(2) {
      width: calc(100% - 30%);
    }
    > div:nth-child(3) {
      width: 35%;
    }
    > div:last-child {
      flex: 1;
    }
  }
  .opet-scr-time-btns {
    .el-radio-button__inner {
      background: transparent;
      color: #0062ff;
      border-color: #0062ff;
    }
    .el-radio-button.is-active {
      background: #0062ff;
      .el-radio-button__inner {
        color: white;
      }
      // border-color: #0062ff;
    }
  }
  .opet-scr-table-w {
    height: 395px;
    overflow: hidden;
    .opet-scr-tabs {
      display: flex;
      align-items: center;
      margin: 8px 0;
      justify-content: space-between;
      > div {
        font-size: 14px;
        font-weight: bold;
        width: calc(25% - 12px);
        line-height: 36px;
        text-align: center;
        border: solid 1px #133d67;
        color: #0062ff;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        &::before {
          .opet-scr-tab-Pse();
          left: 0;
        }
        &::after {
          .opet-scr-tab-Pse();
          right: 0;
        }
      }
      > div.active {
        background-color: rgba(0, 98, 255, 0.6);
        color: white;
      }
    }
    .opet-scr-table {
      .el-loading-mask {
        background-color: rgba(19, 61, 103, 0.6);
      }
      .el-table {
        background-color: transparent;
      }
      .el-table th.el-table__cell {
        background-color: #062349;
        .cell {
          color: #adc5dd;
        }
      }
      .el-table tr {
        background-color: #062349;
        color: #e8f8ff;
      }
      .el-table .el-table__cell {
        border-bottom: rgba(19, 61, 103, 1);
      }
      .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
        background-color: #0e1b37;
        color: #e8f8ff;
      }
      .el-table__inner-wrapper::before {
        display: none;
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
        background-color: #13264d;
      }
    }
  }
}
</style>
