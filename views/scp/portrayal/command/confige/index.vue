<template>
  <div class="fs-page padding">
    <div class="fs-crud-container">
      <div class="select-box">
        <span class="tab-title">作战周期</span>
        <el-select v-model="combatPeriod" placeholder="请选择"  class="tab-period" @change="getList">
          <el-option
            v-for="item in combatPeriodList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue">
          </el-option>
        </el-select>
      </div>
      <div class="confige-card-list" v-if="permsList.length">
        <div class="card-item" v-for="item in permsList" :key="item.menuId" @click="handleOpen(item)">
          <div class="title-box">
            <img class="icon-img" :src="util.getAssetsImages(`confige/card_${item.type}.png`)">
            <div class="title-box-content">
              <div class="title-box-content-title">{{item.title}}</div>
              <div class="title-box-content-time mt-6">更新时间：{{item.updateTime?item.updateTime: '-'}}</div>
            </div>
          </div>
          <div class="card-remark-box">
            {{ item.remark }}
          </div>
        </div>
      </div>
    </div>
    <!-- 状态 -->
    <safeStatusForm
      v-if="statusFlag"
      :visible="statusFlag"
      :type="type"
      :dialogTitle="dialogTitle"
      :combatFightPeriod="combatPeriod"
      @closeView="statusFlag= false"
      @refresh="statusRefresh"
    />
    <!-- 得分 -->
    <gradeForm
      v-if="gradeFlag"
      :open="gradeFlag"
      :dialogTitle="dialogTitle"
      :combatFightPeriod="combatPeriod"
      @closeView="gradeFlag= false"
      @refresh="getGradeDataFun"
    />
    <!-- 失陷资产/疑似失陷资产 -->
    <fallForm
      v-if="fallFlag"
      :open="fallFlag"
      :type="type"
      :dialogTitle="dialogTitle"
      :combatFightPeriod="combatPeriod"
      @closeView="fallFlag= false"
      @refresh="fallRefresh"
    />
    <!-- 资源统筹 -->
    <planForm
      v-if="planFlag"
      :open="planFlag"
      :type="type"
      :dialogTitle="dialogTitle"
      :combatFightPeriod="combatPeriod"
      @closeView="planFlag= false"
      @refresh="getPlanDataFun"
    />
  </div>
</template>
<script>
import lodash from 'lodash-es';
import { reqDict, getMenuPermsByPerm} from "/@/api/common";
import safeStatusForm from './components/safeStatusForm.vue'
import gradeForm from './components/gradeForm.vue'
import fallForm from './components/fallForm.vue'
import planForm  from './components/planForm.vue'
import {getConfigDate, getGroupDate, getConfigFallDate, getConfirmFallUpdatetime } from '/@/api/scp/command/confige';
import util from '/@/utils';
import SmPagination from "/@/components/Pagination";
export default {
  name: 'scp-command-confige',
  components: { safeStatusForm, gradeForm, fallForm, planForm, SmPagination },
  data() {
    return {
      util,
      combatPeriodList: [],
      combatPeriod: '',
      permsList: [],
      loading: true,
      dataList: [],
      statusFlag: false,
      type: '',
      gradeFlag: false,
      fallFlag: false,
      planFlag: false,
      dialogTitle: ''
    }
  },
  created(){
    reqDict('combat_fight_period').then(data=> {
      this.combatPeriodList = data;
      if(this.combatPeriodList){
        this.combatPeriod =  this.combatPeriodList[0].dictValue;
      }
    });

    getMenuPermsByPerm({perms: 'cmd:confige'}).then((data)=>{
      if( data && data.length ){
        let permsList  =  data;
        reqDict('cmd_confige_item_explain').then(data=> {
          const configeDictList = data;
          permsList.forEach((item) =>{
            item.title = item.meta && item.meta.title;
            item.type = item.perms && item.perms.replace('cmd:confige:','') || '';
            configeDictList.forEach((item2) => {
              if(item.perms  == item2.dictValue){
                item.remark = item2.remark;
              }
            })
          })
          this.permsList = permsList;
          this.getList();
        });

      }
    })


  },
  methods: {
    getList(){
      this.getTargetDataFun();
      this.getRelatedDataFun();
      this.getGradeDataFun();
      this.getFallDataFun();
      this.getSeemFallDataFun();
      this.getPlanDataFun();
    },
    // 靶标资产安全状态数据
    getTargetDataFun(){
      let params = {
        combatFightPeriod: this.combatPeriod,
        cmdConfigeItemExplain: "cmd:confige:target"
      }
      getConfigDate(params).then( res =>{
        if(res && res.data && res.data.updateTime){
          const index = this.permsList.findIndex(item => {
            return item.type === 'target'
          })
          if(index > -1){
            this.permsList[index]['updateTime']= res.data.updateTime;
          }
        }
      })
    },
    // 靶标相关资产安全状态
    getRelatedDataFun(){
      let params = {
        combatFightPeriod: this.combatPeriod,
        cmdConfigeItemExplain: "cmd:confige:targetrelated"
      }
      getConfigDate(params).then( res =>{
        if(res && res.data && res.data.updateTime){
          const index = this.permsList.findIndex(item => {
            return item.type === 'targetrelated'
          })
          if(index > -1){
            this.permsList[index]['updateTime']= res.data.updateTime;
          }
        }
      })
    },
    // 得失分概览
    getGradeDataFun(){
      let params = {
        combatFightPeriod: this.combatPeriod,
        cmdConfigeItemExplain: "cmd:confige:grade"
      }
      getConfigDate(params).then( res =>{
        if(res && res.data && res.data.updateTime){
          const index = this.permsList.findIndex(item => {
            return item.type === 'grade'
          })
          if(index > -1){
            this.permsList[index]['updateTime']= res.data.updateTime;
          }
        }
      })
    },
    // 确认失陷资产
    getFallDataFun(){
      let params = {
        combatFightPeriod: this.combatPeriod,
        cmdConfigeItemExplain: "cmd:confige:confirmfall"
      }
      getConfirmFallUpdatetime(params).then( res =>{
        if(res && res.data  && res.data.updateTime){
          const index = this.permsList.findIndex(item => {
            return item.type === 'confirmfall'
          })
          if(index > -1){
            this.permsList[index]['updateTime']=  res.data.updateTime;
          }
        }
      })
    },
    // 疑似失陷资产
    getSeemFallDataFun(){
      let params = {
        combatFightPeriod: this.combatPeriod,
        cmdConfigeItemExplain: "cmd:confige:seemfall"
      }
      getConfirmFallUpdatetime(params).then( res =>{
        if(res && res.data  && res.data.updateTime){
          const index = this.permsList.findIndex(item => {
            return item.type === 'seemfall'
          })
          if(index > -1){
            this.permsList[index]['updateTime']= res.data.updateTime;
          }
        }
      })
    },
    // 资源统筹
    getPlanDataFun(){
      getGroupDate(this.combatPeriod).then( res =>{
        if(res && res.data && res.data.updateTime){
          const index = this.permsList.findIndex(item => {
            return item.type === 'plan'
          })
          if(index > -1){
            this.permsList[index]['updateTime']= res.data.updateTime;
          }
        }
      })
    },
    // 打开详情页
    handleOpen(row){
      this.type = row.type;
      this.dialogTitle = row.title;
      if(row.type == 'target' || row.type == 'targetrelated' ){
        // 打开弹出窗
        this.statusFlag = true;
      }else if(row.type == 'grade'){
        this.gradeFlag = true;
      }else if(row.type == 'confirmfall' || row.type == 'seemfall' ){
        this.fallFlag = true;
      }else{
        this.planFlag = true;
      }
    },
    statusRefresh(type){
      type == 'target'? this.getTargetDataFun() : this.getRelatedDataFun();
    },
    fallRefresh(type){
      type == 'confirmfall'? this.getFallDataFun() : this.getSeemFallDataFun();
    }
  }
}
</script>
<style lang="less" scoped>
.select-box{
  border-bottom: 1px solid #dfdfdf;
  padding: 10px;
  background-color: var(--el-fill-color-blank);
  .tab-title{
    margin-right: 10px;
  }
  .tab-period{
    width: 400px !important;
    display: inline-block;
  }
}
.confige-card-list{
  display: flex;
	flex-wrap: wrap;
  .card-item{
    width: 300px;
    margin: 20px 20px 0 0;
    border-radius: 2px;
    cursor: pointer;
    .title-box{
      height: 80px;
      padding: 16px;
      background-image: linear-gradient(to right, #6177EE, #4BB5F0);
      display: flex;
      color: #FFFFFF;
      .icon-img {
        width: 40px;
        height: 40px;
      }
      .title-box-content{
        margin-left: 16px;
        flex: 1;
        .title-box-content-title{
          font-size: 18px;
          font-weight: 500;
          background-image: linear-gradient(to right, #82c9f3, transparent);
        }
        .title-box-content-time{
          font-size: 12px;
        }
      }
    }
    .card-remark-box{
      width: 300px;
      color: var(--el-text-color-primary);
      font-size: 13px;
      padding: 12px 16px;
      border: 1px solid #dfdfdf;
      background-color: var(--el-fill-color-blank);
    }
  }
}
</style>
