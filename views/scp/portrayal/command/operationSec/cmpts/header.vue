<template>
  <div class="opet-scr-header">
    <div class="opet-scr-header-timer" v-loading="timeLoading">
      <p>{{ timerObj.time }}</p>
      <p>{{ timerObj.date }} <br />{{ timerObj.week }}</p>
    </div>
    <div class="opet-scr-header-title">网络安全运营大屏</div>
    <div class="opet-scr-header-fullscreen">
      <el-tooltip :content="isFullScreen ? '退出全屏' : '进入全屏'" placement="top">
        <el-icon @click="changeFullScreen()"><FullScreen /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
const emits = defineEmits(["screenChange"]);
let timeLoading = ref(true);
let isFullScreen = ref(false); // 是否全屏
let timerObj = ref({
  time: "00:00",
  date: "2024-01-01",
  week: "星期一",
});
let timer = ref(null); // 时间定时器
let changeFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
  emits("screenChange");
};
let nowDateTimerFunc = () => {
  let date = new Date();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  timerObj.value.time = `${hours}:${minutes}`;
};
let formattedDateFunc = () => {
  let date = new Date();
  const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  timerObj.value.week = weekDays[date.getDay()];
  timerObj.value.date = date.toLocaleDateString().replaceAll("/", "-");
};
onMounted(async () => {
  formattedDateFunc();
  timer.value = setInterval(nowDateTimerFunc, 1000);
  timeLoading.value = false;
});
onUnmounted(() => {
  timer.value = null;
});

watchEffect(() => {
  // 监听isFullScreen 为true时隐藏头部
  let headerDom = document.querySelector("#sys-header");
  // console.log(headerDom);
  if (isFullScreen.value) {
    headerDom.style.height = 0;
  } else {
    headerDom.style.height = "55px";
  }
});
</script>

<style lang="less">
.opet-scr-header {
  height: 60px;
  background: url("/@/assets/images/szc_screen/scp_safe_hd.png") center center no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  > div {
    flex: 1;
  }
  &-timer {
    display: flex;
    padding-bottom: 12px;
    align-items: center;
    color: #bfc5c7;
    > p:first-child {
      font-size: 26px;
      font-weight: bold;
    }
    > p:last-child {
      font-size: 12px;
      margin-left: 8px;
    }
  }
  &-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 2px;
  }
  &-fullscreen {
    text-align: right;
    padding-bottom: 12px;
    cursor: pointer;
  }
}
</style>
