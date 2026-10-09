<template>
  <div class="screen_content" ref="screen">
    <el-image
      @click="openFullScreen"
      class="right-icon-FullScreen"
      :src="util.getAssetsImages('szc_screen/open_full.png')"
    />
    <screen-head ref="screenHead" />
    <screen-body  ref="screenBody" />
  </div>
</template>
<script>
import ScreenHead from "./header/index.vue";
import ScreenBody from "./body/index.vue"
import util from '/@/utils';
import { reqDict } from "/@/api/common";
export default {
  components: {
    ScreenHead,
    ScreenBody
  },
  data() {
    return {
      util,
      timeId: null, //定时器
    }
  },
  created() {
    this.handleRefresh();
  },
  methods: {
    handleRefresh(){
      reqDict("soc_screen_refresh_rate").then(({ data = [] }) => {
        const minutes = data.length && data[0].dictValue ? Number(data[0].dictValue) : 5;
        this.timeId = setInterval(() => {
          this.init();
        }, minutes * 60 * 1000);
      });
    },
    init() {
      this.$nextTick(() =>{
        this.$refs.screenBody.$refs.leftSide.getVulnData();
        this.$refs.screenBody.$refs.leftSide.getAssetData();
        this.$refs.screenBody.$refs.leftSide.getKeyWords();
        this.$refs.screenBody.$refs.rightSide.getVulnerabilityFun();
        this.$refs.screenBody.$refs.rightSide.getThreatFun();
        this.$refs.screenBody.$refs.rightSide.getRightTopData();
        this.$refs.screenBody.$refs.centerMain.getAppSystemNameList();
        this.$refs.screenBody.$refs.centerMain.getDataSourceList();
        this.$refs.screenBody.$refs.centerMain.getAlarmTypeList();
        this.$refs.screenBody.$refs.centerMain.getVulnTypeList();
        this.$refs.screenBody.$refs.centerMain.getAccMonAttack();
        this.$refs.screenBody.$refs.centerMain.getAccFlugAttack();
        this.$refs.screenBody.$refs.centerMain.getRawData();
        this.$refs.screenBody.$refs.centerMain.getThreatOrder();
        this.$refs.screenBody.$refs.centerMain.getSafetyDays();
        this.$refs.screenBody.$refs.centerMain.get24TrendsData();
        this.$refs.screenBody.$refs.centerMain.getTrendsManagement();
      })
    },
    /** 打开全屏 */
    openFullScreen() {
      const isFullScreen = document.fullscreenElement;
      if (isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else {
        const element = this.$refs.screen;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
        }
      }
      this.screenCallBack && this.screenCallBack();
    },
  },
  // 卸载定时器
  beforeDestroy() {
    clearInterval(this.timeId);
    this.timeId = null;
  },
}
</script>
<style scoped lang="less">
.screen_content {
  background: url("/@/assets/images/screen-sec/screen-bg.png") center center
  no-repeat;
  background-size: 100% 100%;
  padding: 0;
  overflow: hidden;
  .right-icon-FullScreen {
    width: 50px;
    height: 50px;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    z-index: 2;
  }
}
</style>
