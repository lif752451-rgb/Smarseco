<template>
  <div id="left-asset-cont" class="left-comtain">
    <!-- 资产概览 -->
    <el-row
        class="total-box"
        type="flex"
        align="middle"
        @click="toPath('asset:serverip')"
    >
      <div class="left-box">
        <el-image :src="util.getAssetsImages('szc_screen_new/assets-total-icon.png')"/>
      </div>
      <div class="total">
        <p>资产总数</p>
        <span class="num">{{ getCount().assetTotal }} </span>
        <div class="bottom-bg">
          <div class="proportion">
            {{ assetOverview.assetChangeTrend && assetOverview.assetChangeTrend.replace('-','') }}
            <i
                :class="[
                'icon',
                assetOverview.assetChangeTrend &&
                assetOverview.assetChangeTrend.indexOf('-') == -1
                  ? 'blue-top'
                  : 'blue-bottom',
              ]"
            ></i>
          </div>
        </div>
      </div>
    </el-row>
    <el-row
        class="total-box"
        type="flex"
        align="middle"
        @click="toPath('asset:system')"
    >
      <div class="left-box">
        <el-image :src="util.getAssetsImages('szc_screen_new/business-total-icon.png')"/>
      </div>
      <div class="total">
        <p>业务系统总数</p>
        <span class="num">{{ getCount().appAssetTotal }}</span>
        <div class="bottom-bg">
          <div class="proportion">
            {{ assetOverview.appSystemChangeTrend&&assetOverview.appSystemChangeTrend.replace('-','') }}
            <i
                :class="[
                'icon',
                assetOverview.appSystemChangeTrend &&
                assetOverview.appSystemChangeTrend.indexOf('-') == -1
                ? 'blue-top': 'blue-bottom',
              ]"
            ></i>
          </div>
        </div>
      </div>
    </el-row>
    <el-row
        class="total-box"
        type="flex"
        align="middle"
        @click="toPath('asset:claim')"
    >
      <div class="left-box">
        <el-image :src="util.getAssetsImages('szc_screen_new/unCredited_asset_icon.png')"/>
      </div>
      <div class="total">
        <p>
          无主资产
          <el-popover
            popper-class="tool-tip-asset"
            placement="right"
            width="200"
            :teleported="false"
            :show-arrow="false"
            content="无主资产定义：资产状态为“在用”，且资产未被认领过，且所属组织或责任人任意一个为空。当资产被判断为无主资产时，需进行认领。"
            trigger="hover"
          >
            <template #reference>
              <img
                class="icon-img"
                :src="util.getAssetsImages('szc_screen/tooltip_icon.png')"
              />
            </template>
          </el-popover>
        </p>
        <span class="num"
        >{{ getCount().unCreditedAssetTotal }}
        </span>
        <div class="bottom-bg">
          <div>
            {{ assetOverview.unownedAssetChangeTrend && assetOverview.unownedAssetChangeTrend.replace('-','') }}
            <i
                :class="[
                'icon',
                assetOverview.unownedAssetChangeTrend &&
                assetOverview.unownedAssetChangeTrend.indexOf('-') == -1
                ? 'red-top'
                : 'blue-bottom',
              ]"
            ></i>
          </div>
          <el-progress class="el-bg-inner-running" :percentage="(assetOverview.unCreditedAssetTotal/assetOverview.assetTotal)*100|| 0" :show-text="false"></el-progress>
        </div>
      </div>
    </el-row>
    <el-row
        class="total-box"
        type="flex"
        align="middle"
        @click="toPath('asset:serverip', 'unsafeAsset')"
    >
      <div class="left-box">
        <el-image :src="util.getAssetsImages('szc_screen_new/unsafe_asset_icon.png')"/>
      </div>
      <div class="total">
        <p ref="safetyScoreOpen">
          带病资产
          <el-popover
              popper-class="tool-tip-asset"
              placement="right"
              width="200"
              :teleported="false"
              :show-arrow="false"
              content="带病资产定义：资产安全评分小于90分的资产。点击可查看安全评分计算规则。点击“?”提示图标，可弹窗查看安全评分计算规则。"
              trigger="hover"
          >
            <template #reference>
              <img
                style="cursor: pointer"
                @click.stop="safetyScoreOpen = true"
                class="icon-img"
                :src="util.getAssetsImages('szc_screen/tooltip_icon.png')"
              />
            </template>
          </el-popover>
        </p>
        <span class="num">{{ getCount().unsafeAssetTotal }} </span>
        <div class="bottom-bg">
          <div>
            {{ assetOverview.nosafeAssetChangeTrend  && assetOverview.nosafeAssetChangeTrend.replace('-','')}}
            <i
                :class="[
                'icon',
                assetOverview.nosafeAssetChangeTrend &&
                assetOverview.nosafeAssetChangeTrend.indexOf('-') == -1
                  ? 'red-top'
                  : 'blue-bottom',
              ]"
            ></i>
          </div>
          <el-progress class="el-bg-inner-running" :percentage="(assetOverview.unsafeAssetTotal/assetOverview.assetTotal)*100|| 0" :show-text="false"></el-progress>
        </div>
      </div>
    </el-row>
    <!-- 安全评分计算规则 -->
    <query-safety-score
        v-if="safetyScoreOpen"
        :detailOpen="safetyScoreOpen"
        @closeDetail="safetyScoreOpen = false"
    ></query-safety-score>
  </div>
</template>
<script>
import { formatNumber } from '/@/utils/util.common';
import querySafetyScore from "./querySafetyScore.vue";
import { getmenuByPerms} from "/@/api/common";
import util from '/@/utils';
export default {
  name: "index",
  components: {  querySafetyScore },
  props: {
    assetOverview: Object,
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
      safetyScoreOpen: false, //安全评分规则
      hasPath: "",
    };
  },
  watch: {
    assetOverview: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
      // immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {

      this.getCount();
    },
    getCount() {
      return {
        assetTotal:
          (formatNumber &&
            formatNumber(this.assetOverview.assetTotal, 0, ".", ",", false)) ||
          0,
        appAssetTotal:
          (formatNumber &&
            formatNumber(
              this.assetOverview.appAssetTotal,
              0,
              ".",
              ",",
              false
            )) ||
          0,
        unCreditedAssetTotal:
          (formatNumber &&
            formatNumber(
              this.assetOverview.unCreditedAssetTotal,
              0,
              ".",
              ",",
              false
            )) ||
          0,
        unsafeAssetTotal:
          (formatNumber &&
            formatNumber(
              this.assetOverview.unsafeAssetTotal,
              0,
              ".",
              ",",
              false
            )) ||
          0,
      };
    },
    toPath(perms, trigger) {
      getmenuByPerms({ perms: perms }).then((rel) => {
        if (rel && rel.code == 200) { 
          let path = '';
          let query = {};
          if(perms === 'asset:serverip'){
            path= '/stp/asset/assist/info'
          }else if(perms === 'asset:system'){
            path= '/stp/asset/system/info'
          }else if(perms === 'asset:claim'){
            path= '/stp/asset/assist/apply'
          }
          if (trigger && trigger == "unsafeAsset") {
            query ={
              key: 'safetyScores',
              value:['high_risk','medium_risk','low_risk'],
              deptPath: '100'
            }
          }
          const routeUrl = this.$router.resolve({
            path: path,
            query: query,
          });
          window.open(routeUrl.href);
        }
      })
    },
  },
};
</script>
<style lang="less" scoped>
.left-comtain{
  width: 180px;
  position: absolute;
  z-index: 999;
  .total-box {
    padding: 20px 0 20px 20px;
    .left-box{
      width: 70px;
      height: 86px;
      background: url("/@/assets/images/szc_screen_new/asset_common_bg.png") center center no-repeat;
      background-size: 100% 100%;
    }
    .el-image {
      width: 54px;
      margin:16px 0  0 8px;
    }
    .total {
      p {
        font-size: 13px;
        color: #c2e0ff;
        font-weight: 400;
      }
      span {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #fff;
        font-weight: 500;
      }
      .icon{
        margin-left:4px;
        width: 7px;
        height: 8px;
        display:inline-block;
        &.blue-top{
          background: url("/@/assets/images/szc_screen_new/arrow_up_blue.png") center center no-repeat;
          background-size: 100% 100%;
        }
        &.blue-bottom{
          background: url("/@/assets/images/szc_screen_new/arrow_down_blue.png") center center no-repeat;
          background-size: 100% 100%;
        }
        &.red-top{
          background: url("/@/assets/images/szc_screen_new/arrow_up_red.png") center center no-repeat;
          background-size: 100% 100%;
        }
        &.red-bottom{
          background: url("/@/assets/images/szc_screen_new/arrow_down_red.png") center center no-repeat;
          background-size: 100% 100%;
        }
      }
      div {
        font-size: 12px;
        color: #d55e64;
        width: 100%;
        &.proportion{
          color: #68e4ff;
        }
      }
      .bottom-bg{
        background: url("/@/assets/images/szc_screen_new/bottom_bg.png") center center no-repeat;
        background-size: 100% 100%;
      }
    }
    :deep(.el-bg-inner-running) {
      .el-progress-bar__inner{
        background-color: unset;
        background-image: linear-gradient(to right, #fefbfb , #f13b3b);
      }
      .el-progress-bar__outer{
        background: transparent;
        border: 1px solid #f13b3b;
      }
    }
  }
  .el-icon-caret-top {
    color: #06ffa7;
    display: inline;
  }
  .el-icon-caret-bottom {
    color: #ff4259;
    display: inline;
  }
}

:deep(.icon-img) {
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
}
</style>
<style  lang="less">
.tool-tip-asset {
  min-width: 200px;
  max-width: 300px !important;
  z-index: 3000 !important;
  position: fixed !important;
  color: #FFFFFF !important;
  padding: 12px 12px;
  background: rgb(1, 5, 23) !important;
  border-image: linear-gradient(to top, rgba(128, 255, 255, 0.1), rgba(128, 255, 255, 0.5)) 1;
}
</style>
