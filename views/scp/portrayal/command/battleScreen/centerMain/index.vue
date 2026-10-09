<template>
  <div class="center-main">
    <div class="target-asset">
      <el-row class="target-image">
        <div :class="'target-'+getStatus(mainData.targetStatus)"></div>
        <div :class="'target-related-'+getStatus(mainData.relatedStatus)"></div>
      </el-row>
      <el-row class="fall-asset">
        <div class="confirm-asset" @click="$emit('open', 'fallAsset')">
          <el-image :src="util.getAssetsImages('battle-screen/confirm-fall-asset-img.png')"></el-image>
          <div class="asset-count">
            <el-image :src="util.getAssetsImages('battle-screen/confirm-fall-asset-title.png')"></el-image>
            <div>
              <span>{{mainData.confirmData.length}}</span>
              <span class="newAddFont">+{{ mainData.newAddFallDataCount ? mainData.newAddFallDataCount : 0 }}</span>
              <span style="color: #D7D7D7; font-size: 12px;">(近30m新增)</span>
            </div>
          </div>
        </div>
        <div class="seem-asset" @click="$emit('open', 'seemFallAsset')">
          <el-image :src="util.getAssetsImages('battle-screen/seem-fall-asset-img.png')"></el-image>
          <div class="asset-count">
            <el-image :src="util.getAssetsImages('battle-screen/seem-fall-asset-title.png')"></el-image>
            <div style="width: 100%;" align="left">
              <span>{{mainData.seemData.length}}</span>
              <span class="newAddFont">+{{ mainData.newAddSeemFallDataCount ? mainData.newAddSeemFallDataCount : 0 }}</span>
              <span style="color: #D7D7D7; font-size: 12px;">(近30m新增)</span>
            </div>
          </div>
        </div>
      </el-row>
    </div>
    <div>
      <div class="fall-asset-title">
        <el-tabs v-model="tab_asset" class="drawer-tabs"  @tab-click="handleChangeTab">
          <el-tab-pane :label="fallAssetTitle" name="fallAsset"></el-tab-pane>
          <el-tab-pane :label="seemFallAssetTitle" name="seemFallAsset"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="fall-asset-table">
        <asset-table :tableData="tableData" :assetLoading = "assetLoading" 
        @open="openOrder" :assetType="tab_asset"/>
      </div>
      <score-chart :charData="mainData.gradeData"/>
    </div>
  </div>
</template>
<script>
import assetTable from './assetTable.vue'
import scoreChart from './scoreChart.vue'
import util from '/@/utils';
let status = {
  '安全':'safe',
  '风险':'risk',
  '失陷':'fall'
}
export default {
  name:'centerMain',
  props:{
    mainData:Object,
    openOrder:Function,
  },
  components:{
    assetTable,
    scoreChart
  },
  computed:{
    fallAssetTitle(){
      let count = this.mainData.confirmData.length || 0;
      return `确认失陷资产 ( ${count} ) `
    },
    seemFallAssetTitle(){
      let count = this.mainData.seemData.length || 0;
      return `可能失陷资产 ( ${count} ) `
    },
    tableData(){
      if(this.tab_asset=="fallAsset"){
        return  this.mainData.confirmData;
      }else{
        return this.mainData.seemData
      }
    },
    assetLoading(){
      if(this.tab_asset=="fallAsset"){
        return  this.mainData.confirmLoading;
      }else{
        return this.mainData.seemLoading;
      }
    }
  },
  data(){
    return {
      util,
      tab_asset:'fallAsset',
    }
  },
  methods:{
    getStatus(key){
      return status[key]
    },
    handleChangeTab(tab){
      this.tab_asset = tab.paneName;
    }
  },

}

</script>
<style lang="less" scoped>
.center-main {
  .target-asset {
    padding:0 0 15px;
    .el-row {
      width: 100%;
      display: flex;
      justify-content: space-between;;
      &::before{
        content:none;
      }
      &::after{
        content:none;
      }
      &.target-image {
        height: 67px; line-height: 67px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain; text-align: center;
        font-size: 24px; font-weight: normal; color: #FFFFFF;
        margin: 0 auto;
        >div{
          height: 100%;
          width: 47%;
          &.target-safe{
            background: url("/@/assets/images/battle-screen/target-safe.png") center center no-repeat;
            background-size: contain;
          }
          &.target-risk{
            background: url("/@/assets/images/battle-screen/target-risk.png") center center no-repeat;
            background-size: contain;
          }
          &.target-fall{
            background: url("/@/assets/images/battle-screen/target-fall.png") center center no-repeat;
            background-size: contain;
          }
          &.target-related-safe{
            background: url("/@/assets/images/battle-screen/target-related-safe.png") center center no-repeat;
            background-size: contain;

          }
          &.target-related-risk{
            background: url("/@/assets/images/battle-screen/target-related-risk.png") center center no-repeat;
            background-size: contain;
          }
          &.target-related-fall{
            background: url("/@/assets/images/battle-screen/target-related-fall.png") center center no-repeat;
            background-size: contain;
          }
        }
      }
      
      &.fall-asset {
        margin-top: 20px;
        > div {
          background-position: center center;
          background-repeat: no-repeat;
          background-size: contain;
          text-align: center;
          font-size: 24px;
          font-weight: normal;
          color: #FFFFFF;
          display: flex;
          height: 100px;
          width: 47%;
          &.confirm-asset {
            justify-content: flex-start;
            .asset-count{
              padding-left: 12px;
            }
          }
          &.seem-asset {
            flex-direction: row-reverse;
            .asset-count{
              padding-right: 12px;
              text-align: end;
              align-items: flex-end;
            }
          }
          
          :deep(.el-image){
            border-width: 0px;
            display: flex;
            width: 40%;
            img{
              object-fit: contain;
            }
          }
          .asset-count{
            text-align: start;
            font-size: 32px;
            line-height: 1.5;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100px;
            .el-image{
              width: 100%;
              height: 16px;
            }
            .newAddFont {
              color: #F8D05B;
              font-size: 16px;
              font-weight: 500;
            }
          }
        }
        
      }
    }
  }

  .fall-asset-title{
    :deep(.el-tabs){
      .el-tabs__header{
        margin: 0 0 5px;
      }
      .el-tabs__nav-wrap::after{
        height: 1px;
      }
      .el-tabs__nav{
        width: 100%;
        .el-tabs__item{
          width: 50%;
          text-align: center;
          font-weight: 400;
          font-style: normal;
          color: #fff;
          padding: 0;
          height: 32px;
          font-size: 15px;
          line-height: 32px;
          background-color: transparent;
          &.is-active{
            color: #57f4fd;;
          }
        }
        .el-tabs__active-bar{
          background-color: #57f4fd;
        }
      }
    }  
  }
  .fall-asset-table{
    margin-bottom: 20px;
  }
}
</style>