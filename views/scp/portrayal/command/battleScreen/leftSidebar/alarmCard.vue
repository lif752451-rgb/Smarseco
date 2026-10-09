<template>
  <div>
    <div class="card-wrap">
      <div class="card-top">
        <el-image
          class="card-top-head"
          :src="
            util.getAssetsImages('battle-screen/card-top-head.svg')
          "
        ></el-image>
        <div class="card-top-title">
          <p>重点关注告警</p>
        </div>
      </div>
    </div>
    <div class="alarm-box">
      <el-tabs tab-position="left" v-model="tabStatus">
        <el-tab-pane name="5">
          <template #label>
            <div class="alarm-title">
              <el-image v-for="o in 5" :key="o+'_five_img'" class="card-top-head" :src="util.getAssetsImages('battle-screen/star-five.svg')"></el-image>
              <p>确认失陷({{alarmInfo['5']}})</p>
            </div>
          </template>
          <div class="alarm-content">
            <div v-for="(item,key) in alarmData.attentionLevel5List" :key="key">
              <el-tag class="alarm-id" @click="open_detail(item)">{{item.alarmId}}</el-tag>
              <div class="alarm-explain">
                <sm-text-tooltip :content="item.attentionExplain" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="4">
          <template #label>
            <div class="alarm-title">
              <el-image v-for="o in 4" :key="o+'_four_img1'" class="card-top-head" :src="util.getAssetsImages('battle-screen/star-four.svg')"></el-image>
              <el-image  class="card-top-head" :src="util.getAssetsImages('battle-screen/star-null.svg')"></el-image>
              <p>可能失陷({{alarmInfo['4']}})</p>
            </div>
          </template>
          <div class="alarm-content">
            <div v-for="(item,key) in alarmData.attentionLevel4List" :key="key">
              <el-tag class="alarm-id" @click="open_detail(item)">{{item.alarmId}}</el-tag>
              <div class="alarm-explain" >
                <sm-text-tooltip :content="item.attentionExplain" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="3">
          <template #label>
            <div class="alarm-title">
              <el-image v-for="o in 3" :key="o+'_three_img1'" class="card-top-head" :src="util.getAssetsImages('battle-screen/star-three.svg')"></el-image>
              <el-image v-for="o in 2" :key="o+'_three_img2'" class="card-top-head" :src="util.getAssetsImages('battle-screen/star-null.svg')"></el-image>
              <p>重点关注({{alarmInfo['3']}})</p>
            </div>
          </template>
          <div class="alarm-content">
            <div v-for="(item,key) in alarmData.attentionLevel3List" :key="key">
              <el-tag class="alarm-id" @click="open_detail(item)">{{item.alarmId}}</el-tag>
              <div class="alarm-explain" >
                <sm-text-tooltip :content="item.attentionExplain" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane  name="2">
          <template #label>
            <div class="alarm-title">
              <el-image v-for="o in 2" :key="o+'_tow_img1'" class="card-top-head" :src="util.getAssetsImages('battle-screen/star-two.svg')"></el-image>
              <el-image v-for="o in 3" :key="o+'_two_img2'" class="card-top-head" :src="util.getAssetsImages('battle-screen/star-null.svg')"></el-image>
              <p>排查阶段({{alarmInfo['2']}})</p>
            </div>
          </template>
          <div class="alarm-content">
            <div v-for="(item,key) in alarmData.attentionLevel2List" :key="key">
              <el-tag class="alarm-id" @click="open_detail(item)">{{item.alarmId}}</el-tag>
              <div class="alarm-explain" >
                <sm-text-tooltip :content="item.attentionExplain" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="1">
          <template #label>
            <div class="alarm-title">
              <el-image lass="card-top-head" :src="util.getAssetsImages('battle-screen/star-one.svg')"></el-image>
              <el-image v-for="o in 4" :key="o+'_one'" class="card-top-head" :src="util.getAssetsImages('battle-screen/star-null.svg')"></el-image>
              <p>典型案例({{alarmInfo['1']}})</p>
            </div>
          </template>
          <div class="alarm-content">
            <div v-for="(item,key) in alarmData.attentionLevel1List" :key="key">
              <el-tag class="alarm-id" @click="open_detail(item)">{{item.alarmId}}</el-tag>
              <div class="alarm-explain" >
                <sm-text-tooltip :content="item.attentionExplain" />
              </div>
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>
<script>
import SmTextTooltip from "/@/components/Tooltip";
import {  getmenuByPerms } from "/@/api/common";
import util from '/@/utils';

export default {
  name:'alarmCard',
  props:{
    alarmData:Object
  },
  components:{
    SmTextTooltip
  },
  data(){
    return {
      util,
      tabStatus: '5'
    }
  },
  computed:{
    alarmInfo(){
      this.tabStatus = '5';
      let obj = {}
      this.alarmData.attentionLevelCountList && this.alarmData.attentionLevelCountList.map(item=>{
        let {count,dictLabel} = item
        obj[dictLabel] = count
      })
      return obj
    }
  },
  methods:{
    open_detail(row){
      getmenuByPerms({ perms: 'defend:alarm:response' }).then((rel) => {
        if (rel && rel.code == 200) {
          let newUrl = this.$router.resolve({
            path:'/scp/defend/alarm',
            query: {
              id: row.id,
              alarmType: 'combat'
            },
          });
          window.open(newUrl.href, "_blank");
        }
      })
    },
  },
  watch:{}
}

</script>
<style lang="less" scoped>
.alarm-box{
  padding-bottom: 10px;
  .el-image{
      width: 18px;
      height: 18px;
      padding: 3px;
      box-sizing: border-box;
  }
  .alarm-title{
    display: flex;
    align-items: center;
    p{
      margin-left: 10px;
      color: #00FFFF;
    }
  }
  :deep(.el-tabs){
    height: 300px;
    .el-tabs__header{
      margin: 0 0 5px;
    }
    .el-tabs__nav-wrap::after{
      background-color: #4d8391;
      width: 3px;
    }
    .el-tabs__content,.el-tab-pane{
      height: 100%;
    }
    .el-tabs__nav{
      width: 100%;
      .el-tabs__item{
        background-color: transparent;
        &.is-active{
          color: #57f4fd;
          background: rgba(128, 255, 255, 0.2);
        }
      }
      .el-tabs__active-bar{
        width: 3px;
        background-color: #00FFFF;
      }
    }

  }
  .alarm-content{
    height: 100%;
    overflow-x:hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding:0 10px;
    >div{
      display: inline-flex;
      .alarm-id{
        cursor: pointer;
        font-size: 13px;
        padding: 0px 8px 0px 8px;
        border-radius: 20px!important;
        font-weight: 400;
        color: #00FFFF;
        height: 24px;
        line-height: 24px!important;
        background-color: rgba(128, 255, 255, 0.2);
        border-width: 0;
      }
      .alarm-explain{
        font-weight: 400;
        font-style: normal;
        color: #F2F2F2;
        font-size: 14px;
        padding-left: 10px;
        // max-width: 44%;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &::-webkit-scrollbar {
      width: 4px; // 横向滚动条
      height: 4px; // 纵向滚动条 必写
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(128, 255, 255, 1);
      border-radius: 3px;
    }
  }

}
</style>
