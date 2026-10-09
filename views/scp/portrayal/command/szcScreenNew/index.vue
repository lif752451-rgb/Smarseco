<template>
  <div class="screen_content" ref="screen">
    <img
      class="screen_left_img"
      :src="util.getAssetsImages('szc_screen/screen_left.png')"
    />
    <img
      class="screen_right_img"
      :src="util.getAssetsImages('szc_screen/scrern_right.png')"
    />
    <!-- 头部 -->
    <screen-head
        @emitChecked="(val) => this.topoChecked = val"
        @openFullScreen="toggleFullScreen($refs.screen)"
        @handleTime="handleTime"
    />
    <div class="container">
      <!-- 中部 -->
      <el-row class="cockpit-wrap" :gutter="20">
        <el-col :span="2" style="height: 10px">
          <leftSidebar
            :assetOverview="assetOverview"
            :paramsJson="paramsJson"
            :loading="loadingLeft"
          />
        </el-col>
        <el-col :span="17">
          <screenMain
            ref="screenMain"
            :checked="topoChecked"
            @openAppDetail="openAppDetail"
            @openAreaDetail="openAreaDetail"
          />
        </el-col>
        <el-col :span="5">
          <rightSidebar
            :loopSum="loopSum"
            :loopList="loopList"
            :paramsJson="paramsJson"
            :systemList="systemList"
            :loading="loadingRight"
          />
        </el-col>
      </el-row>
      <!-- 下部 -->
      <footer-main
        :loading="loadingFooter"
        :paramsJson="paramsJson"
        :alarmSum="alarmSum"
        :alarmList="alarmList"
        :alarmViewData="alarmViewData"
        :alarmTypeData="alarmTypeData"
      />
    </div>

    <!-- 应用详情 -->
    <appDetail
      ref="appDetail"
      :title="appDetailTitle"
      v-model:visible="appDetailVisible"
    />
    <!-- 区域详情 -->
    <areaDetail
      ref="areaDetail"
      :title="areaDetailTitle"
      v-model:visible="areaDetailVisible"
      @openAppDetail="openAppDetail"
    />
  </div>
</template>
<script>
import lodash from "lodash-es";
import ScreenHead from "./components/screenHead.vue";
import leftSidebar from "./components/leftSidebar/index.vue";
import screenMain from "./components/screenMain/index.vue";
import rightSidebar from "./components/rightSidebar/index.vue";
import FooterMain from "./components/footerMain/index.vue";
import appDetail from "./components/screenMain/appDetail.vue";
import areaDetail from "./components/screenMain/areaDetail.vue";
import { formatDate } from  "/@/utils/old/index";
import { formatNumber } from '/@/utils/util.common';
import util from '/@/utils';
import { reqDict } from "/@/api/common";
import {
  reqAssetData,
  getAssetTrend,
  getAlarmTopList,
  getAllAlarm,
} from "/@/api/scp/szcScreen";
import { toggleFullScreen } from "/@/utils/util.web";
export default {
  name: "scp-command-szcScreenNew",
  components: {
    ScreenHead,
    leftSidebar,
    screenMain,
    rightSidebar,
    FooterMain,
    appDetail,
    areaDetail,
  },
  data() {
    return {
      util,
      topoChecked: true,
      timeIndex: 0,
      // 资产概览统计
      assetOverview: {
        assetTotal: 0,
        appAssetTotal: 0,
        unsafeAssetTotal: 0,
        unCreditedAssetTotal: 0,
        sickAssetRingRatio: 0,
      },
      timeId: null, //定时器
      alarmTypeData: [],
      // 漏洞概览统计参数
      loopSum: {
        all: 0,
        complete: 0,
        noComplete: 0,
        noCompleteHigh: 0,
        repair: 0,
        noPush: 0,
      },
      loopList: [], //漏洞概览列表
      // 告警概览统计参数
      alarmSum: {
        allCount: 0,
        doneCount: 0,
        undoneCount: 0,
      },
      alarmList: [], //告警概览列表
      alarmViewData: [], //告警流量趋势图
      systemList: [], //集权系统
      paramsJson: {},
      appDetailVisible: false,
      appDetailTitle: "",
      areaDetailTitle: "",
      areaDetailVisible: false,
      // 左侧加载
      loadingLeft: {
        loopSum: false,
        loopList: false,
      },
      // 右侧加载
      loadingRight: {
        system: false,
        loopSum: false,
        loopList: false,
      },
      // 底部
      loadingFooter: {
        loopSum: false,
        loopList: false,
      },
      dateStart: "",
      dateEnd: "",
    };
  },

  created() {
    this.handleRefresh(); //刷新页面
  },
  mounted() {
    this.init(); // 获取/更新数据
  },
  // 卸载定时器
  beforeDestroy() {
    clearInterval(this.timeId);
    this.timeId = null;
  },
  methods: {
    toggleFullScreen,
    changeTime() {
      if (this.timeIndex == 0) {
        this.dateStart = formatDate(new Date().getTime() - 24 * 3600 * 1000);
      } else if (this.timeIndex == 1) {
        this.dateStart = formatDate(
          new Date().getTime() - 7 * 24 * 3600 * 1000
        );
      } else {
        this.dateStart = formatDate(
          new Date().getTime() - 30 * 24 * 3600 * 1000
        );
      }
      this.dateEnd = formatDate(new Date());
    },
    /** 打开应用详情 */
    openAppDetail(id, title) {
      this.appDetailVisible = true;
      this.appDetailTitle = title;
      this.$refs.appDetail.init(id, this.dateStart, this.dateEnd);
    },
    /** 打开区域详情 */
    openAreaDetail(id, title) {
      this.areaDetailVisible = true;
      this.areaDetailTitle = title;
      this.$refs.areaDetail.getAreaTree(id, this.dateStart, this.dateEnd);
    },
    // 刷新页面
    handleRefresh() {
      reqDict("soc_screen_refresh_rate").then(( data = [] ) => {
        const minutes =
          data.length && data[0].dictValue ? Number(data[0].dictValue) : 5;
        this.timeId = setInterval(() => {
          this.init();
        }, minutes * 60 * 1000);
      });
    },
    // 获取/更新数据
    init() {
      this.changeTime();
      // 漏洞概览
      this.paramsJson = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      };
      this.getLoopSum();
      this.getLoopList();
      // 资产概览
      this.getAssetOverview();
      // 告警类型top5
      this.getAlarmTop5();
      // 告警流量趋势图
      this.getAlarmView();
      // 告警概览
      this.getAlarmSum();
      this.getAlarmList();
      // 集权系统被攻击情况_近5条
      this.getSystemList();
      this.$refs.screenMain.$refs.topology.getTopologyData(this.paramsJson)
    },
    // 切换时间范围:0代表24小时,1代表7天,2代表30天
    handleTime(index) {
      this.timeIndex = index;
      this.init();
    },
    // 获取资产概览信息
    getAssetOverview() {
      const param = { id: "202306121118023440001" };
      reqAssetData(param).then(({ data: { resultData } }) => {
        if (Array.isArray(resultData) && resultData.length > 0) {
          for (const k in this.assetOverview)
            k in resultData[0] && (this.assetOverview[k] = resultData[0][k]);
        }
      });
      getAssetTrend(this.timeIndex + 1).then(({ data = {} }) => {
        if (Object.keys(data) && Object.keys(data).length) {
          for (let key in data) {
            this.assetOverview[key]= data[key];
          }
        }
      });
    },
    //  告警概览_数量统计
    getAlarmSum() {
      this.loadingFooter.loopSum = true;
      const paramJson = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      };
      const params = {
        id: "20230612112027160003",
        paramJson: JSON.stringify(paramJson),
      };
      reqAssetData(params)
        .then(({ data = {} }) => {
          const { resultData = [] } = data;
          for (let key in resultData[0]) {
            this.alarmSum[key] = resultData[0][key]
              ? formatNumber(resultData[0][key], 0, ".", ",", false)
              : 0;
          }
        })
        .finally(() => {
          this.loadingFooter.loopSum = false;
        });
    },
    // 告警概览_未完成高风险告警工单
    getAlarmList() {
      this.loadingFooter.loopList = true;
      const paramJson = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        pageStart: 0,
        pageSize: 20,
      };
      const params = {
        id: "202306121120344450004",
        paramJson: JSON.stringify(paramJson),
      };
      reqAssetData(params)
        .then(({ data = {} }) => {
          const { resultData = [] } = data;
          resultData.forEach((item) => {
            for (let key in item) {
              item[key] = item[key] || "-";
            }
          });
          console.log("resultData", resultData);
          this.alarmList = resultData;
        })
        .finally(() => {
          this.loadingFooter.loopList = false;
        });
    },
    // 集权系统被攻击情况_近5条
    getSystemList() {
      this.loadingRight.system = true;
      const paramJson = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      };
      const params = {
        id: "20230620142147550008",
        paramJson: JSON.stringify(paramJson),
      };
      reqAssetData(params)
        .then(({ data = {} }) => {
          const { resultData = [] } = data;
          resultData.forEach((item) => {
            for (let key in item) {
              item[key] = item[key] || "-";
            }
          });
          console.log("resultData2323", resultData);
          this.systemList = resultData;
        })
        .finally(() => {
          this.loadingRight.system = false;
        });
    },
    //  漏洞概览_数量统计
    getLoopSum() {
      const paramJson = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      };
      const params = {
        id: "202306121122011700008",
        paramJson: JSON.stringify(paramJson),
      };
      this.loadingRight.loopSum = true;
      reqAssetData(params)
        .then(({ data = {} }) => {
          const { resultData = [] } = data;
          for (let key in this.loopSum) {
            const flag = resultData.find((item) => item.TYPE == key);
            if (flag) {
              this.loopSum[key] = flag.total || 0;
            }
          }
          let repair = (this.loopSum.repair * 100) / this.loopSum.all || 0;
          if (repair > 0 && repair < 0.01) {
            this.loopSum.repair = "<0.01%";
          } else if (repair > 99.99 && this.loopSum.repair < 100) {
            this.loopSum.repair = "99.99%";
          } else {
            this.loopSum.repair = Math.round(repair * 100) / 100 + "%";
          }
          for (let key in this.loopSum) {
            if (key !== "repair") {
              this.loopSum[key] = formatNumber(
                this.loopSum[key],
                0,
                ".",
                ",",
                false
              );
            }
          }
        })
        .finally(() => {
          this.loadingRight.loopSum = false;
        });
    },
    // 漏洞概览_未修复中高风险漏洞
    getLoopList() {
      this.loadingRight.loopList = true;
      const paramJson = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        pageStart: 0,
        pageSize: 20,
      };
      const params = {
        id: "202306121122139410009",
        paramJson: JSON.stringify(paramJson),
      };
      reqAssetData(params)
        .then(({ data = {} }) => {
          const { resultData = [] } = data;
          resultData.forEach((item) => {
            for (let key in item) {
              item[key] = item[key] || "-";
            }
          });
          this.loopList = resultData;
        })
        .finally(() => {
          this.loadingRight.loopList = false;
        });
    },
    // 告警概览top5
    getAlarmTop5() {
      getAlarmTopList(this.timeIndex + 1).then(({ data = [] }) => {
        this.alarmTypeData = data;
      });
    },
    // 告警流量趋势图
    getAlarmView() {
      const paramJson = {
        startDate: this.dateStart,
        endDate: this.dateEnd,
      };
      getAllAlarm(paramJson).then(({ data = [] }) => {
        data.forEach((item) => {
          for (let key in item) {
            if (key === "count") {
              item[key] = item[key] || 0;
            } else {
              item[key] = item[key] || "-";
            }
          }
        });
        this.alarmViewData = data;
      });
    },
  },
};
</script>
<style scoped lang="less">
.screen_content {
  background: url("/@/assets/images/szc_screen/szc_screen.png") center
    center no-repeat;
  background-size: 100% 100%;
  height: calc(100vh - 48px);
  padding: 0;
  padding-bottom: 10px;
  overflow-y: auto;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
  .screen_left_img {
    position: absolute;
    left: 10px;
    bottom: 0;
    height: calc(100vh - 108px);
    width: 6px;
  }
  .screen_right_img {
    position: absolute;
    right: 10px;
    bottom: 0;
    height: calc(100vh - 108px);
    width: 6px;
  }
  .container {
    padding: 0 15px;
    margin-top: -90px;
  }
}

</style>
<style lang="less">
.szc_screen_pagination {
  border: none !important;
  background-color: #163452 !important;
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: rgba(128, 255, 255, 0.2);
    color: #00ffff;
  }
  .el-select-dropdown__item {
    color: #ffffff;
    &.selected {
      color: #00ffff;
    }
  }
  .popper__arrow {
    border-top-color: #163452 !important;
    &::after {
      bottom: 1px;
      margin-left: -6px;
      border-top-color: #163452 !important;
      border-bottom-width: 0;
    }
  }
}
.szcScreen_new_dialog_common {
  background: transparent !important;
  color: #fff;
  position: relative;
  .el-dialog__header {
    height: 52px;
    background: url("/@/assets/images/szc_screen/dialog_title.png")
      center center no-repeat;
    background-size: 100% 100%;
  }
  .close_btn {
    width: 24px;
    height: 24px;
    position: absolute;
    top: -5px;
    right: -5px;
  }
  .dialog_title {
    margin-left: 20px;
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
  }
  .flex-box {
    position: absolute;
    bottom: 5px;
    height: 20px;
    width: 20px;
    background: url("/@/assets/images/szc_screen/dialog_bottom_icon.png")
      center center no-repeat;
    background-size: 100% 100%;
    &.bottom-left {
      left: 5px;
    }
    &.bottom-right {
      right: 5px;
      transform: rotate(270deg);
    }
  }
  .el-dialog__body {
    background: url("/@/assets/images/szc_screen/dialog_wrap.png")
      center center no-repeat;
    background-size: 100% 100%;
    padding: 10px;
  }
  .dialog-wrap-content {
    padding: 16px;
    background: url("/@/assets/images/szc_screen/dialog_content.png")
      center center no-repeat;
    background-size: 100% 100%;
    height: 672px;
  }
}
</style>
