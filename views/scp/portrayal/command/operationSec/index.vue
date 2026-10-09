<template>
  <div class="opet-scr" ref="screenRef">
    <ScreenHeader @screen-change="changeFullScreen"></ScreenHeader>
    <div class="opet-scr-cnt">
      <TopChart></TopChart>
      <CenterChart></CenterChart>
      <BotChart></BotChart>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { toggleFullScreen } from "/@/utils/util.web";
import ScreenHeader from "./cmpts/header.vue";
import TopChart from "./cmpts/topChart.vue";
import CenterChart from "./cmpts/centerChart.vue";
import BotChart from "./cmpts/botChart.vue";
let screenRef = ref(null);

const changeFullScreen = () => {
  toggleFullScreen(screenRef.value);
};
</script>

<style lang="less">
.opet-scr {
  width: 100%;
  background: url("/@/assets/images/szc_screen/scp_safe_bg.png") center center no-repeat;
  background-size: 100% 100%;
  color: #e8f8ff;
  display: flex;
  flex-direction: column;
  &-blk {
    background-color: rgba(3, 15, 64, 0.7);
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    width: 100%;
    &-tlt {
      font-weight: bold;
      font-size: 14px;
      border-bottom: solid 1px rgba(19, 61, 103, 1);
      padding-bottom: 6px;
      padding-left: 4px;
      margin-left: 26px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &::before {
        content: "◉";
        position: absolute;
        font-size: 18px;
        border-radius: 50%;
        color: rgb(12, 143, 190);
        left: -30px;
        top: -2px;
      }
      &::after {
        content: " ";
        position: absolute;
        background-color: rgba(19, 61, 103, 1);
        font-size: 18px;
        width: 20px;
        height: 1px;
        left: -18px;
        bottom: 5px;
        transform: rotate(40deg);
      }
    }
    &-chart {
      height: calc(100% - 27px);
    }
  }
  &-cnt {
    height: calc(100% - 60px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 16px;
    &-top {
      // height: 300px;
      height: 40%;
      margin-bottom: 12px;
    }
    &-center {
      height: 440px;
      margin-bottom: 12px;
    }
    &-bot {
      flex: 1;
      .opet-scr-blk-chart {
        height: 420px;
      }
    }
  }
}
</style>
