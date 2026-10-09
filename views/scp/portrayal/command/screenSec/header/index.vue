<template>
  <div class="screen-sec-head">
    <div class="title-wrap">
      <el-image :src="util.getAssetsImages('screen-sec/title.png')" />
    </div>
  </div>
</template>

<script>
import util from '/@/utils';
export default {
  data () {
    return {
      util
    }
  }
}
</script>

<style scoped lang="less">
.screen-sec-head {
  background: url("/@/assets/images/screen-sec/header-bg.png") center center
  no-repeat;
  background-size: 100% 100%;
  height: 250px;
  .title-wrap {
    text-align: center;
  }
}
</style>
