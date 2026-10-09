<template>
<div>
  <div v-if="!personnelData">
    <div class="info-tags" v-if="detailData.length"  >
      <sm-tag-tooltip :model-value="detailData" />
    </div>
    <span v-else>暂无数据</span>
  </div>
  <div class="info-top-form" v-if="personnelData">
    <el-form label-position="left" label-width="120px">
      <el-form-item label="总指挥:">
        <p>{{personnelData.leadCommander || '-'}}</p>
      </el-form-item>
      <el-form-item label="白班总指挥:">
        <p>{{personnelData.dayShiftLeadCommander || '-'}}</p>
      </el-form-item>
      <el-form-item label="夜班总指挥:">
        <p>{{personnelData.nightShiftLeadCommander || '-'}}</p>
      </el-form-item>
      <el-form-item label="其他重点人员:">
        <p>{{personnelData.otherPerson || '-'}}</p>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
import { SmTagTooltip } from "/@/components/Tooltip";

export default {
  props:{
    detailData:{
      type:Array,
      default:()=>[]
    },
    personnelData:{
      type:Object,
      default:null
    }
  },
  mounted(){
  },
  components:{
    SmTagTooltip
  }
}
</script>
<style lang="less" scoped>
.info-tags{
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  :deep(.el-tag){
    border-color: rgba(128, 255, 255, 1);
    background-color: rgba(128, 255, 255, 0.0980392156862745);
    box-sizing: border-box;
    font-weight: 400;
    font-style: normal;
    color: #00FFFF;
    padding: 0px 8px 0px 8px;
    font-size: 13px;
  }
}
.info-top-form{
  box-sizing: border-box;
  :deep(.el-form-item){
    line-height: 32px;
    margin-bottom:0px;
    .el-form-item__label{
      font-weight: 400;
      font-style: normal;
      color: #00FFFF;
      font-size: 14px;
    }
    .el-form-item__content{
      color: #F2F2F2;
    }
  }
}
</style>
