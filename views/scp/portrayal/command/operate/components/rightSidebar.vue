<template>
  <div>
    <div class="card-wrap">
      <div class="card-top">告警闭环情况</div>
      <div class="card-cont alarm-situation">
        <el-row class="alarm-legend">
          <el-col :span="6"
            ><p>工单总数</p>
            <i>{{ alarmStatistics.alarmTotal }}</i></el-col
          >
          <el-col :span="6"
            ><p>研判中</p>
            <i>{{ alarmStatistics.alarmJudgeTotal }}</i></el-col
          >
          <el-col :span="6"
            ><p>已闭环</p>
            <i>{{ alarmStatistics.alarmClosedLoopTotal }}</i></el-col
          >
          <el-col :span="6"
            ><p>处理中</p>
            <i>{{ alarmStatistics.alarmNotClosedLoopTotal }}</i></el-col
          >
        </el-row>
        <div class="chart-title chart-title-border">告警闭环TOP5部门</div>
        <div class="alarm-list" @click="$emit('open', '各部门告警闭环情况', businessList, null, 'stack', ['已闭环', '处理中'])">
          <el-row class="alarm-item" v-for="(item, key) in businessList.slice(0, 5)" :key="key">
            <el-col class="dept-name" :span="5">
              <sm-text-tooltip :content="item.deptName" />
            </el-col>
            <el-col class="progress-box" :span="17">
              <div class="progress-item">
                <p v-if="item.closedLoopRate > 0" class="rate">{{ item.closedLoopRate }}%</p>
                <el-progress :percentage="item.closedLoopRate" :stroke-width="3" :show-text="false" />
              </div>
              <div class="progress-item">
                <p v-if="item.notClosedLoopRate > 0" class="rate" style="text-align: right">{{ item.notClosedLoopRate }}%</p>
                <el-progress :style="{ paddingLeft: item.closedLoopRate + '%' }" :percentage="100" :stroke-width="3" :show-text="false" />
              </div>
            </el-col>
            <el-col class="total" :span="2">{{ item.alarmTotal }}</el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="card-wrap">
      <div class="card-top">攻击类型分布</div>
      <el-row class="card-cont">
        <el-col class="card-cont-left-dashboard" :span="8">
          <div class="chart-title">隐患拦截率</div>
          <div class="chart-wrap">
            <div class="chart-box" ref="sickAssetRate"></div>
            <div class="chart-text">
              <p>
                拦截率<span :class="[interceptRingRate > 0 ? 'caret-top' : 'caret-bottom']">
                  {{ interceptRingRate > 0 ? "+" : "" }}{{ interceptRingRate }}%
                  <el-icon class="icon icon_img">
                    <CaretTop v-if="interceptRingRate > 0" />
                    <CaretBottom v-else />
                  </el-icon>
                </span>
              </p>
            </div>
          </div>
        </el-col>
        <el-col class="card-cont-right-progress" :span="16">
          <div class="chart-title chart-title-border">攻击类型分布TOP5</div>
          <div class="progress-list" @click="$emit('open', '攻击类型分布', actionTypeList)">
            <el-row class="progress-item" :gutter="8" v-for="(item, key) in actionTypeList.slice(0, 5)" :key="key">
              <el-col class="deptName" :span="7">
                <sm-text-tooltip :content="item.actionTypeName" />
              </el-col>
              <el-col class="progress" :span="17">
                <el-progress :percentage="item.actionTypeRate" :show-text="false" :stroke-width="10" />
                <sm-text-tooltip :content="String(item.actionTypeTotal)" />
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="card-wrap">
      <div class="card-top">终端安全情况</div>
      <div class="card-cont">
        <el-row class="card-cont-total" :gutter="16">
          <el-col :span="12">
            <el-row class="total-box" type="flex" align="middle">
              <el-image :src="util.getAssetsImages('home/endpoint-number-icon.png')" />
              <div class="total">
                <p>终端总数</p>
                <span>{{ terminalStatistics.endpointNumber }}</span>
              </div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="total-box" type="flex" align="middle">
              <el-image :src="util.getAssetsImages('home/anti-virus-coverage-icon.png')" />
              <div class="total">
                <p>防病毒覆盖率</p>
                <span>{{ terminalStatistics.antiVirusCoverage }}%</span>
              </div>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="terminal-chart" :gutter="20">
          <div class="chart-title chart-title-border">病毒感染终端数TOP5</div>
          <div class="chart-box" ref="terminal"></div>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "/@/utils/old/echartsUI";
import { reqCockpitData } from "/@/api/scp/screen";
import { dashboard } from "./Dashboard";
import { dateCalculator } from "/@/utils/old/DateCalculator";
import util from "/@/utils";
import SmTextTooltip from "/@/components/Tooltip";

export default {
  name: "rightSidebar",
  components: {
    SmTextTooltip,
  },
  data() {
    return {
      util,
      alarmStatistics: {
        alarmTotal: 0,
        alarmJudgeTotal: 0,
        alarmClosedLoopTotal: 0,
        alarmNotClosedLoopTotal: 0,
      },
      businessList: [],
      actionTypeList: [],
      interceptRingRate: "",
      terminalStatistics: {
        endpointNumber: 0,
        antiVirusCoverage: "",
      },
    };
  },
  created() {
    this.getTerminalCount();
  },
  methods: {
    /** 获取告警闭环情况 */
    getAlarmLoop(param) {
      const params = {
        id: "20221115173534960007",
        paramJson: JSON.stringify({ ...param }),
      };
      reqCockpitData(params).then(({ data: { resultData } }) => {
        const total = (Array.isArray(resultData) && resultData[0]) || {};
        for (const k in this.alarmStatistics) {
          k in total && (this.alarmStatistics[k] = total[k]);
        }
      });
    },
    getDialogData(title, id, total, type) {
      const params = { id };
      reqCockpitData(params).then(({ data: { resultData } }) => {
        if (resultData) {
          this.$emit("open", title, resultData, total, type);
        }
      });
    },
    /** 获取告警T0P5 */
    getAlarmTOP5(param) {
      const params = {
        id: "202211151738473380008",
        paramJson: JSON.stringify(param),
      };
      reqCockpitData(params).then(({ data: { resultData } }) => {
        if (resultData) {
          this.businessList = resultData.map((i) => {
            if (i.alarmTotal) {
              i.closedLoopRate = Number(((i.alarmClosedLoopTotal / i.alarmTotal) * 100).toFixed(0));
              i.notClosedLoopRate = 100 - i.closedLoopRate;
            }
            return {
              deptName: i.deptName,
              alarmTotal: i.alarmTotal,
              total1: i.alarmClosedLoopTotal,
              total2: i.alarmNotClosedLoopTotal,
              closedLoopRate: i.closedLoopRate,
              notClosedLoopRate: i.notClosedLoopRate,
            };
          });
        }
      });
    },
    /** 获取攻击类型分布 */
    getAttackDistributeTOP5(param) {
      const params = {
        id: "202211161626045440001",
        paramJson: JSON.stringify({
          startTime: dateCalculator.toBJTime(param.startTime),
          endTime: dateCalculator.toBJTime(param.endTime),
        }),
      };
      reqCockpitData(params).then(({ data: { resultData } }) => {
        if (resultData) {
          let maxActionTypeTotal = 0;
          this.actionTypeList = resultData.map((item, index) => {
            index === 0 && (maxActionTypeTotal = item.count);
            if (maxActionTypeTotal === 0) item.actionTypeRate = 0;
            else item.actionTypeRate = Math.round((item.count / maxActionTypeTotal) * 100);
            return {
              actionTypeName: item.name,
              actionTypeRate: item.actionTypeRate,
              actionTypeTotal: item.count,
            };
          });
        }
      });
    },
    /** 获取隐患拦截率 */
    getInterceptRingRate(par1, par2) {
      const params1 = {
        id: "202211161608319930000",
        paramJson: JSON.stringify({
          startTime: dateCalculator.toBJTime(par1.startTime),
          endTime: dateCalculator.toBJTime(par1.endTime),
        }),
      };
      const params2 = {
        id: "202211161608319930000",
        paramJson: JSON.stringify({
          startTime: dateCalculator.toBJTime(par2.startTime),
          endTime: dateCalculator.toBJTime(par2.endTime),
        }),
      };
      let interceptRate, lastInterceptRate;
      reqCockpitData(params1)
        .then(({ data: { resultData } }) => {
          try {
            const release = resultData.find((i) => i.name === "放行"),
              intercept = resultData.find((i) => i.name === "拦截");
            interceptRate = ((intercept.count / (release.count + intercept.count)) * 100 || 0).toFixed(1);
          } catch (e) {
            interceptRate = 0;
          }
          return reqCockpitData(params2);
        })
        .then(({ data: { resultData } }) => {
          try {
            const release = resultData.find((i) => i.name === "放行"),
              intercept = resultData.find((i) => i.name === "拦截");
            lastInterceptRate = ((intercept.count / (release.count + intercept.count)) * 100 || 0).toFixed(1);
          } catch (e) {
            lastInterceptRate = 0;
          }
          this.interceptRingRate = (interceptRate - lastInterceptRate).toFixed(1);
          const interceptOpt = dashboard.getOption(interceptRate, "", "#90F269", "#FFC057");
          echarts.init(this.$refs.sickAssetRate).setOption(interceptOpt);
        });
    },
    /** 获取终端总数 */
    getTerminalCount() {
      const params = { id: "202211161629417560003" };
      reqCockpitData(params).then(({ data: { resultData } }) => {
        if (resultData && resultData.length > 0) {
          const { endpointNumber, antiVirusCoverage } = resultData[0];
          this.terminalStatistics.antiVirusCoverage = antiVirusCoverage;
          this.terminalStatistics.endpointNumber = endpointNumber;
        }
      });
    },
    /** 获取感染终端TOP5 */
    getInfectedTerminalTOP5(param) {
      const params = {
        id: "202211161631423990004",
        paramJson: JSON.stringify({
          startTime: dateCalculator.toBJTime(param.startTime),
          endTime: dateCalculator.toBJTime(param.endTime),
        }),
      };
      reqCockpitData(params).then(({ data: { resultData } }) => {
        const option = {
          tooltip: {
            trigger: "axis",
            confine: true,
            axisPointer: { type: "shadow" },
          },
          grid: {
            left: "3%",
            right: "3%",
            bottom: "0%",
            top: "4%",
            containLabel: true,
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
            axisLabel: { show: false },
            splitLine: { show: false },
          },
          yAxis: {
            type: "category",
            data: [],
            axisLabel: {
              textStyle: { color: "#ffffff" },
              formatter(i) {
                return i.substring(0, 7) + "...";
              },
            },
            axisTick: { show: false },
            axisLine: { show: false },
          },
          series: [
            {
              data: [],
              type: "bar",
              barWidth: 15,
              label: { show: true, position: "right", color: "#FFFFFF" },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#3D00FF" },
                    { offset: 1, color: "#1CFFDF" },
                  ]),
                },
              },
            },
          ],
        };
        resultData &&
          resultData.slice(0, 5).forEach((i) => {
            option.yAxis.data.unshift(i.name);
            option.series[0].data.unshift(i.count);
          });
        echarts.init(this.$refs.terminal).setOption(option);
      });
    },
  },
};
</script>

<style scoped lang="less">
.card-wrap {
  .alarm-situation {
    .alarm-legend {
      color: #ffffff;
      font-weight: 400;
      margin-bottom: 10px;
      .el-col {
        i {
          font-size: 22px;
          font-style: normal;
        }
      }
      .el-col:nth-child(n + 2) {
        padding-left: 20px;
        position: relative;
        &:before {
          content: "";
          width: 14px;
          height: 4px;
          position: absolute;
          left: 0;
          top: 9px;
        }
      }
      .el-col:nth-child(2) {
        &:before {
          background-image: linear-gradient(90deg, #00c297 6%, #00c297 100%);
        }
      }
      .el-col:nth-child(3) {
        &:before {
          background-image: linear-gradient(90deg, #00e2ff 6%, #0068ff 100%);
        }
      }
      .el-col:nth-child(4) {
        &:before {
          background-image: linear-gradient(90deg, #ffb25d 0%, #ff0068 100%);
        }
      }
    }
    .alarm-list {
      margin-top: 20px;
      .alarm-item {
        margin-bottom: 3px;
        color: #ffffff;
        :deep(.progress-box) {
          position: relative;
          height: 28px;
          .progress-item {
            width: 100%;
            position: absolute;
            .rate {
              color: #ffffff;
              font-size: 10px;
            }
            .el-progress {
              .el-progress-bar__outer {
                background-color: transparent;
              }
            }
          }
          .progress-item:nth-child(1) {
            .el-progress {
              z-index: 9;
              .el-progress-bar__inner {
                background-image: linear-gradient(90deg, #00e2ff 6%, #0068ff 100%);
              }
            }
          }
          .progress-item:nth-child(2) {
            .el-progress {
              .el-progress-bar__inner {
                background-image: linear-gradient(90deg, #ffb25d 0%, #ff0068 100%);
              }
            }
          }
        }
        .total {
          font-size: 16px;
          color: #00f9ff;
          text-align: right;
          width: 30px;
        }
      }
    }
  }
  .terminal-chart {
    width: 100%;
    margin-top: 20px;
    padding: 0 16px;
    .chart-title {
      margin-bottom: 6px !important;
    }
    .chart-box {
      height: 140px;
      width: 100%;
      background: transparent;
    }
  }
}
:deep(.tool-tip-box) {
  width: auto;
  .tooltip-content {
    font-size: 12px;
    color: #fff;
  }
}
:deep(.total) {
  .tooltip-content {
    font-size: 14px;
    color: #00f9ff;
  }
}
</style>
