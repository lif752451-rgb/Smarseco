<template>
  <div class="footer_main"
       :style="{ zIndex: alarmDetail || alarmTypeDialogShow ? '1000' : '998' }">
    <img
      class="screen_footer_img"
      :src="util.getAssetsImages('szc_screen/footer.png')"
    />
    <el-row :gutter="20">
      <!-- 告警概览 -->
      <el-col :span="6">
        <div class="alarm">
          <div class="title" @click="alarmDetail = true">告警概览</div>
          <div class="loopSum">
            <div class="order order_total">
              <div class="order_box" @click="handerLoop()">
                <div class="order_text">工单总数</div>
                <div class="order_num" v-loading="loading.loopSum">
                  {{ alarmSum.allCount }}
                </div>
              </div>
            </div>
            <div class="order order_done" @click="handerLoop(1)">
              <div class="order_box">
                <div class="order_text">已完成</div>
                <div class="order_num" v-loading="loading.loopSum">
                  {{ alarmSum.doneCount }}
                </div>
              </div>
            </div>
            <div class="order order_wait" @click="handerLoop(2)">
              <div class="order_box">
                <div class="order_text">未完成</div>
                <div class="order_num" v-loading="loading.loopSum">
                  {{ alarmSum.undoneCount }}
                </div>
              </div>
            </div>
          </div>
          <div class="table_title">
            <div class="table_img table_left_img"></div>
            <div class="table_title_text">未完成高风险告警工单</div>
            <div class="table_img table_right_img"></div>
          </div>
          <div class="table_box">
            <div class="header table_header">
              <div class="loop_name">告警标题</div>
              <div class="loop_rank">告警级别</div>
              <div class="loop_status">工单状态</div>
            </div>
            <el-carousel
              :interval="5000"
              direction="vertical"
              arrow="never"
              indicator-position="none"
              v-if="alarmList.length"
              v-loading="loading.loopList"
            >
              <el-carousel-item v-for="pageItem in pageList" :key="pageItem">
                <div
                  class="header page_item"
                  v-for="(item, index) in alarmList.slice(
                    pageSize * (pageItem - 1),
                    pageSize * pageItem
                  )"
                  :key="index"
                  @click="handerAlarm(item)"
                >
                  <div class="loop_name vuln_name">{{ item.title }}</div>
                  <div class="loop_rank">
                    <span class="level_label" :class="`level${item.level}`">{{
                      item.levelLabel
                    }}</span>
                  </div>
                  <div class="loop_status state_label">
                    {{ item.orderStatus }}
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div class="without-data loop_data" v-else>
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 告警类型排行TOP5 -->
      <el-col :span="6">
        <div class="alarm-type-box" @click="showTypeDialog">
          <div class="title">告警类型排行TOP5</div>
          <div class="asset-type-top">
            <el-row class="rate-top">
              <el-col :span="3"><span>排名</span></el-col>
              <el-col :span="16"><span>告警类型</span></el-col>
              <el-col :span="5" style="text-align: right"
                ><span>告警数量</span></el-col
              >
            </el-row>
            <el-row class="rate-list">
              <el-row v-if="alarmTop5List.length">
                <el-col :span="2" class="rate-item">
                  <div
                    class="item-img"
                    v-for="(item, key) in alarmTop5List.length"
                    :key="key"
                  >
                    <div :class="`rate-index`">{{ key + 1 }}</div>
                  </div>
                </el-col>
                <el-col :span="22" class="rate-chart">
                  <div class="chart" ref="alarmTypeChart"></div>
                </el-col>
              </el-row>
              <el-row v-else class="without-data">
                <span>暂无数据</span>
              </el-row>
            </el-row>
          </div>
        </div>
      </el-col>
      <!-- 告警流量趋势图 -->
      <el-col :span="12"> <alarm-flow v-bind="$attrs" /> </el-col>
    </el-row>
    <!-- 告警类型top5 -->
    <alarmTypeDialog
      v-if="alarmTypeDialogShow"
      :alarmTypeDialogShow="alarmTypeDialogShow"
      :typeData="alarmTypeData"
      @closeDetail="alarmTypeDialogShow = false"
      @typeCharsClick="typeCharsClick"
    />
    <!-- 告警概览详情 -->
    <alarmDetailDialog
      v-if="alarmDetail"
      :open="alarmDetail"
      :alarmSum="alarmSum"
      :paramsJson="paramsJson"
      @closeDetail="alarmDetail = false"
      @handleToPath="handerLoop"
      @rowClick="handerAlarm"
    />
  </div>
</template>
<script>
import { isJurisdictionOrder } from "/@/api/scp/szcScreen";
import alarmFlow from "./alarmFlow.vue";
import lodash from "lodash-es";
import echarts from "/@/utils/old/echartsUI";
import "echarts/theme/macarons.js";
import alarmTypeDialog from "./alarmTypeDialog.vue";
import alarmDetailDialog from "./alarmDetailDialog.vue";
import {  ElMessage } from "element-plus";
import { hasMenuPerms, getmenuByPerms} from "/@/api/common";
import util from '/@/utils';
export default {
  components: {
    alarmFlow,
    alarmTypeDialog,
    alarmDetailDialog,
  },
  props: {
    alarmTypeData: {
      type: Array,
      default: [],
    },
    alarmSum: {
      type: Object,
      default: () => {},
    },
    alarmList: {
      type: Array,
      default: () => [],
    },
    paramsJson: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      util,
      pageSize: 5,
      chart: null,
      option: {
        grid: {
          left: "0%",
          bottom: "0%",
          top: "0%",
          right: "12%",
          height: 200,
          width: '100%'
        },
        xAxis: {
          show: false,
          splitLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: true },
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false },
          },
          {
            show: true,
            inverse: true,
            axisLabel: {
              textStyle: {
                color: "#FFFFFF",
                fontSize: "13",
                // padding: [0, 0, 0, 10],
              },
              formatter: "{value}",
            },
            axisLine: { show: false },
            splitLine: { show: false },
            axisTick: { show: false },
          },
        ],
        series: [
          {
            yAxisIndex: 0,
            name: "value",
            showBackground: true,
            backgroundStyle: {
              color: "transparent",
              borderRadius: 2,
              borderColor: "#0157ff", // 设置边框颜色
              borderWidth: 2, // 设置边框宽度
              borderType: "solid", // 设置边框类型
            },
            type: "bar",
            barCategoryGap: 0,
            barWidth: 6,
            barGap: 10,
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#00f5d3" },
                { offset: 0.5, color: "#137c53" },
                { offset: 1, color: "#cd342d " },
              ]),
              barBorderRadius: [3, 3, 3, 3],
            },
            label: {
              normal: {
                show: true,
                position: [0, "-15px"],
                color: "#BDDBFF",
                textStyle: { fontSize: 12 },
                formatter: (a, b) => a.name,
              },
            },
          },
        ],
      },
      myChart: null,
      alarmTypeDialogShow: false,
      typeData: [],
      alarmTop5List: [],
      alarmDetail: false,
    };
  },
  watch: {
    alarmTypeData: {
      handler(val) {
        if (val && val.length) {
          if (val.length > 5) {
            const list = lodash.cloneDeep(val);
            this.alarmTop5List = list.splice(0, 5);
          } else {
            this.alarmTop5List = val;
          }
          this.$nextTick(() => {
            let chart = this.$refs.alarmTypeChart;
            if (chart) {
              this.myChart = echarts.init(
                this.$refs.alarmTypeChart,
                "macarons"
              );
              this.myChart.showLoading();
              window.addEventListener("resize", () => {
                this.myChart.resize();
              });
              this.initEcharts(this.alarmTop5List);
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    pageList() {
      return Math.ceil(this.alarmList.length / this.pageSize);
    },
  },
  methods: {
    handerAlarm(row) {
      isJurisdictionOrder(row.businessKey).then((res) => {
        if (res.code == 200) {
          const routeUrl = this.$router.resolve({
            path: "/stp/menaceManege",
            query: {  id: row.id },
          });
          window.open(routeUrl.href);
        } else {
          ElMessage({ message: "暂无权限", type: "warning" });
        }
      });
    },
    handerLoop(value, boolean) {
      hasMenuPerms({ perms: "alarm:closed" }).then(({ data }) => {
        if (data) {
          let params = {};
          if (boolean) {
            params["id"] = value;
          } else {
            params = {
              createStartTime: this.paramsJson.dateStart,
              createEndTime: this.paramsJson.dateEnd,
            };
            if (value === 1) {
              params["orderStatus"]= ["complete", "noNeedHandle"];
            } else if (value === 2) {
              params["orderStatus"]= ["judge", "handle", "audit"];
            }
          }
          const routeUrl = this.$router.resolve({
            path: "/stp/menaceManege",
            query: params,
          });
          window.open(routeUrl.href);
        } else {
          ElMessage({ message: "暂无权限", type: "warning" });
        }
      });
    },
    // 将实参转化为URL
    changesUrl(obj) {
      var arr = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p)) {
          arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return arr.join("&");
    },
    initEcharts(charData) {
      this.myChart.clear();
      this.myChart.showLoading();
      let chartOption = lodash.cloneDeep(this.option);
      const yAxisData = charData.map((item) => item.attackMeansCount);
      chartOption.yAxis[1].data = yAxisData;
      const seriesData = charData.map((item) => {
        return { value: item.attackMeansCount, name: item.attackMeansLabel };
      });
      chartOption.grid.height = charData.length * 40;
      chartOption.series[0].data = seriesData;
      this.myChart.setOption(chartOption);
      this.myChart.hideLoading();
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },
    // 打开告警类型的dialog
    showTypeDialog() {
      // 拿回数据后打开
      this.alarmTypeDialogShow = true;
    },
    // 跳转告警闭环
    typeCharsClick(data) {
      getmenuByPerms({ perms: 'alarm:closed' }).then((rel) => {
        if (rel && rel.code == 200) {
          const routeUrl = this.$router.resolve({
            path: "/stp/menaceManege",
            query: {
              attackMean: data.name,
              createStartTime: this.paramsJson.dateStart,
              createEndTime: this.paramsJson.dateEnd
            }
          });
          window.open(routeUrl.href);
        }
      })
    },
  },
};
</script>
<style lang="less" scoped>
.footer_main {
  width: 100%;
  position: fixed;
  bottom: 0;
  .screen_footer_img {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .alarm {
    cursor: pointer;
    .title {
      height: 37px;
      background: url("/@/assets/images/szc_screen/alarm_title.png")
        left center no-repeat;
      background-size: 100% 100%;
      font-size: 18px;
      color: #fff;
      font-weight: 500;
      text-indent: 40px;
    }
    .loopSum {
      display: flex;
      justify-content: space-between;
      align-content: center;
      width: 100%;
      height: 40px;
      .order {
        height: 100%;
        width: 33%;
        background-size: 100% 100% !important;
        &.order_total {
          background: url("/@/assets/images/szc_screen/order_total.png")
            center center no-repeat;
        }
        &.order_done {
          background: url("/@/assets/images/szc_screen/order_done.png")
            center center no-repeat;
        }
        &.order_wait {
          background: url("/@/assets/images/szc_screen/order_wait.png")
            center center no-repeat;
        }
        .order_box {
          margin-left: 50%;
          height: 100%;
          padding-top: 6px;
          padding-bottom: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: left;
          font-size: 12px;
          color: #fff;
          font-weight: 500px;
          cursor: pointer;
        }
      }
    }
    .table_title {
      width: 100%;
      height: 18px;
      margin: 5px 0;
      display: flex;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      line-height: 18px;
      .table_img {
        flex: 1;
        height: 100%;
        background: url("/@/assets/images/szc_screen/table_right_img.png")
          center center no-repeat;
        background-size: 100% 100% !important;
        &.table_left_img {
          transform: scaleX(-1);
        }
      }
      .table_title_text {
        margin: 0 5px;
      }
    }
    .table_box {
      .header {
        display: flex;
        font-size: 12px;
        height: 30px;
        align-items: center;

        &.table_header {
          font-size: 13px;
          font-weight: 500px;
          color: #fff;
          line-height: 30px;
          // border-bottom: 1px solid rgba(0, 223, 228, 0.3);
          box-sizing: border-box;
        }
        .loop_name {
          flex: 1;
          padding: 0 10px;
          box-sizing: border-box;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &.vuln_name {
            color: #bddbff;
          }
        }
        .loop_rank {
          width: 60px;
          margin: 0 10px;
          display: flex;
          .level_label {
            line-height: 18px;
            padding: 2px 8px;
            border-radius: 12px;
            color: #f2f2f2;
            &.level4 {
              border: 1px solid rgba(161, 213, 242, 0.8);
              background: rgba(161, 213, 242, 0.2);
            }
            &.level3 {
              border: 1px solid rgba(194, 128, 255, 0.8);
              background: rgba(194, 128, 255, 0.2);
            }
            &.level2 {
              border: 1px solid rgba(255, 200, 54, 0.8);
              background: rgba(255, 200, 54, 0.2);
            }
            &.level1 {
              border: 1px solid rgba(207, 19, 34, 0.8);
              background: rgba(207, 19, 34, 0.2);
            }
          }
        }

        .loop_status {
          width: 60px;
          &.state_label {
            color: #bddbff;
          }
        }
      }
    }
    .page_item {
      cursor: pointer;
      &:nth-child(2n-1) {
        background: rgba(1, 16, 44, 1);
      }
      &:nth-child(2n) {
        background: rgba(1, 6, 16, 1);
      }
    }
    :deep(.el-carousel__container) {
      height: 150px;
    }
    .without-data {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #dddddd;
      &.loop_data {
        height: 150px;
      }
    }
  }
  .alarm-type-box {
    .title {
      height: 37px;
      background: url("/@/assets/images/szc_screen/alarm_title.png")
        center center no-repeat;
      background-size: 100% 100%;
      font-size: 18px;
      color: #fff;
      font-weight: 500;
      text-indent: 40px;
    }
    .asset-type-top {
      padding: 0px 10px;
      font-weight: 400;
      .rate-top {
        font-style: normal;
        font-size: 14px;
        color: #fff;
        margin: 10px 0;
        span {
          padding: 5px 7px;
          border-radius: 40px;
          background-image: linear-gradient(
            to right,
            rgba(0, 63, 199, 0.9),
            rgba(0, 27, 78, 0.7)
          );
        }
      }
    }
    .rate-list {
      height: 200px;
      :deep(.el-row){
        width: 100%;
      }
      .rate-item {
        font-size: 14px;
        text-align: left;
        font-weight: 400;
        border-radius: 40px;
        color: #00040c;
        background-image: linear-gradient(
          to bottom,
          rgba(0, 14, 49, 0.9),
          rgba(0, 4, 12, 0.2)
        );
        .item-img {
          height: 30px;
        }
        & .item-img {
          margin-top: 10px;
          div {
            line-height: 30px;
            color: #ffffff;
            margin-top: 5px;
            text-align: center;
          }
        }
      }
      .rate-chart {
        padding-top: 10px;
        padding-left: 15px;
      }
      .chart {
        height: 200px;
        width: 100%;
      }
    }
    .without-data {
      width: 100%;
      height: 60px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #dddddd;
    }
  }
  :deep(.el-loading-mask) {
    background-color: hsla(0, 0%, 100%, 0);
  }
  :deep(.el-loading-spinner .path){
    stroke: #57f4fd;
  }
}
</style>
