<template>
  <el-dialog
    v-if="visible"
    :title="dialogTitle"
    :modelValue="visible"
    width="600px"
    top="18vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancel"
  >
    <div>
      <el-radio-group v-model="status" :fill="'#ffffff'">
        <el-radio-button label="安全" class="saft"></el-radio-button>
        <el-radio-button label="风险" class="risk ml-10"></el-radio-button>
        <el-radio-button label="失陷" class="fall ml-10"></el-radio-button>
      </el-radio-group>
    </div>
    <template #footer>
      <div  class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button  v-preventReClick type="primary" class="submit"  @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {getConfigDate,saveConfigDate} from '/@/api/scp/command/confige';
import { ElMessageBox,ElMessage } from "element-plus";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: ''
    },
    combatFightPeriod: {
      type: [String , Number],
      default: ''
    },
    dialogTitle: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      status: '',
      id: null
    }
  },
  created() {
    let params = {
        combatFightPeriod: this.combatFightPeriod,
        cmdConfigeItemExplain: this.type =='target'?"cmd:confige:target": "cmd:confige:targetrelated"
      }
      getConfigDate(params).then( res =>{
        if(res && res.data){
          this.status = res.data.content || '安全';
          this.id = res.data.id;
        }
      })
  },
  methods: {
    //关闭弹窗
    cancel() {
      this.$emit("closeView");
    },
    submitForm(){
      let params = {
        id: this.id,
        combatFightPeriod: this.combatFightPeriod,
        cmdConfigeItemExplain: this.type =='target'?"cmd:confige:target": "cmd:confige:targetrelated",
        content: this.status
      }
      saveConfigDate(params).then( res =>{
        if(res && res.code == 200){
          ElMessage({ message: '保存成功', type: 'success' });
          this.cancel();
          this.$emit('refresh',this.type);
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
:deep(.el-radio-group){
  width: 100%;
  .el-radio-button__inner{
    width: 100% !important;
    color:#AAAAAA !important;
    border: 1px solid #E0E6ED !important;
    font-size: 28px;
    height: 60px;
    line-height: 40px;
  }
  .el-radio-button{
    width: calc((100% - 20px)/3);
    &.saft{
      &.is-active,&.is-focus{
        .el-radio-button__inner{
          color:#19BE6B !important;
          background: #F6FFED !important;
          border: 1px solid #B7EB8F !important;
          font-weight: 500;
        }
      }
    }
    &.risk{
      &.is-active,&.is-focus{
        .el-radio-button__inner{
          color:#FFA500 !important;
          background: #FFF6EC !important;
          border: 1px solid #FFCA8F !important;
          font-weight: 500;
        }
      }
    }
    &.fall{
      &.is-active,&.is-focus{
        .el-radio-button__inner{
          color:#FF6347 !important;
          background: #FFF3F2 !important;
          border: 1px solid #FFC5B8 !important;
          font-weight: 500;
        }
      }
    }
  }
}
</style>