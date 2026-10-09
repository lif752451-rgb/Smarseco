<template>
  <el-row class="screen-sec-body">
    <left-side  ref="leftSide" />
    <centerMain ref="centerMain" />
    <right-side ref="rightSide" />
  </el-row>
</template>

<script>
import LeftSide from "./leftSide.vue";
import rightSide from "./rightSide.vue";
import centerMain from "./centerMain.vue";
export default {
  components: {
    LeftSide,
    rightSide,
    centerMain
  }
}
</script>

<style scoped lang="less">
.screen-sec-body {
  transform: translateY(-100px);
}
:deep(.card-box){
  .card-head {
    height: 64px;
    background: url("/@/assets/images/screen-sec/small-title-bg.png") no-repeat;
    .el-image {
      margin-left: 60px;
    }
  }
  .card-body {
    padding: 60px 0;
  }
}
</style>
