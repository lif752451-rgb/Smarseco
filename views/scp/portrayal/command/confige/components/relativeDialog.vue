<template>
  <div>
    <el-dialog
      v-if="visible"
      title="关联工单"
      :modelValue="visible"
      width="610px"
      top="18vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeView"
    >
      <div class="retative-content">
        <div class="title">已添加关联工单</div>
        <div class="tags-box  mt-10 mb-10 p-10">
          <div v-if="alarmTags && alarmTags.length>0">
            <el-tag
              v-for="(tag,index) in alarmTags"
                :key="index"
                closable
                @close="handleClose(index,'alarmTags')"
              >
              {{tag.alarmId}}
            </el-tag>
          </div>
          <div v-else class="no-data">暂无数据</div>
        </div>
        <div  class="text-blue flex-between">
          <div @click="addRelativeAlarm" class="cursor-pointer">+ 添加关联工单</div>
          <div class="text-gray-black">已添加 <span class="text-blue">{{alarmTags.length}}</span> 条</div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeView">取消</el-button>
          <el-button v-preventReClick type="primary"  @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
     <!-- 添加关联工单弹窗 （告警） -->
     <addRelativeDialog
      v-if="relatedFlag"
      :relatedFlag="relatedFlag"
      :relatedIds="relatedIds"
      :rowData="rowData"
      @closeView="relatedFlag = false"
      @submitForm="submitRelatedForm"
    />
  </div>
</template>
<script>
import addRelativeDialog from './addRelativeDialog.vue';
import {getFallRelativeAlarmId , saveFallRelativeAlarm} from '/@/api/scp/command/confige';
import lodash from 'lodash-es';
export default {
  components: { addRelativeDialog },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    rowData: {
      type: Object,
      default: () =>{}
    }
  },
  data() {
    return {
      alarmTags: [],
      relatedIds: [],
      relatedFlag: false
    }
  },
  created(){
    this.init();
  },
  methods: {
    init(){
      let params = {...this.rowData};
      getFallRelativeAlarmId(params).then(( { data = []}) =>{
        this.alarmTags = data;
      })
    },
    handleClose(index) {
      this.alarmTags.splice(index, 1)
    },
    closeView(){
      this.$emit("closeView");
    },
    submitForm(){
      let list  = this.alarmTags.map((item) =>{
        return {
          relationId: item.relationId,
          alarmId: item.alarmId
        }
      }) || [];
      let params = {
        ...this.rowData,
        list: list
      }
      saveFallRelativeAlarm(params).then((res) =>{
        if(res && res.code == 200){
          this.$emit("closeView");
          this.$emit("refresh",this.alarmTags);
        }
      })
    },
    addRelativeAlarm(){
      this.relatedIds = this.alarmTags.map((item) =>{
        return { relationId: item.relationId }
      }) || []
      this.relatedFlag = true;
    },
    submitRelatedForm(arr){
      this.alarmTags=[...this.alarmTags,...arr];
    }
  }
}
</script>
<style lang="less" scoped>
.retative-content{
  
  .text-blue{
    color: var(--el-color-primary);
  }
  .text-gray-black{
    color: var(--el-text-color-primary);
  }
  .title{
    color: var(--el-text-color-primary);
  }
  .tags-box{
    border: 1px solid #e0e6ed;
    min-height: 32px;
    max-height: 200px;
    overflow-y: auto;
    padding:4px  4px 0 4px;
    .el-tag{
      margin:0 4px 4px 0;
    }
  }
  .no-data{
    text-align: center;
    color: #838898;
  }
  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>