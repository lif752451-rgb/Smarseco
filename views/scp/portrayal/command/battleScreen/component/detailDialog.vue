<template>
  <div>
    <el-dialog
      class="detail-dialog" :model-value="dialogVisible"
      :close-on-click-modal="false" :close-on-press-escape="false"
      :modal-append-to-body="false"
      :before-close="() => this.$emit('close')"
      :destroy-on-close = "true"
      width="800px">
      <template #title>
        <div class="el-dialog__title">
          <sm-text-tooltip :content="dialogTile" />
        </div>
      </template>
      <el-image :src="util.getAssetsImages('battle-screen/table-dialog-left.png')"></el-image>
      <div class="body-asset">
        <slot></slot>
      </div>
      <el-image :src="util.getAssetsImages('battle-screen/table-dialog-right.png')"></el-image>
    </el-dialog>
  </div>
</template>
<script>
import SmTextTooltip from "/@/components/Tooltip";
import util from '/@/utils';

export default {
  components: { SmTextTooltip },
  props:{
    dialogTile:String,
    dialogVisible:Boolean,
  },
  data () {
    return {
      util
    }
  }
}
</script>
<style scoped lang="less">
:deep(.el-dialog){
  background: transparent;
  .el-dialog__header {
    background: transparent;
    background: url("/@/assets/images/battle-screen/asset-table-head.png") left bottom no-repeat;
    background-size: contain;
    margin-top: 18vh !important;
    padding: 35px 40px 15px;
    height: 70px;

    .el-dialog__title{
      position: relative;
      bottom: -34px;
      left: 20px;
      color: #fff;
      font-size: 14px;
      width: calc(100% - 50px);
      display: inline-block;
    }
    .el-dialog__headerbtn {
      top: -8px; right: 4px;
      .el-dialog__close {
        color: transparent;
        background: url("/@/assets/images/battle-screen/table-dialog-close.png") center center no-repeat;
        background-size: contain;
        width: 24px;
        height: 24px;
      }
    }
    .el-icon { color: #FFFFFF }
  }
  .el-dialog__body {
    max-height: none !important;
    background-color: rgba(0, 12, 44, 1);
    box-sizing: border-box;
    border: 1px solid rgba(6, 203, 255, 1);
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    padding: 10px;
    .el-image {
      width: 20px;
      height: 20px;
      position: absolute;
      bottom: 5px;
      &:first-child{
        left: 5px;
      }
      &:last-child{
        right: 5px;
      }
    }
    .body-asset{
      border: 1px solid rgba(6, 203, 255, 1);
      padding: 10px;
    }
  }
}
</style>
