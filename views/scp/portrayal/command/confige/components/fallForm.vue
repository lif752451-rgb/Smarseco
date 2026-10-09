<template>
  <div>
    <el-drawer
      :title="dialogTitle"
      size="1080px"
      :before-close="handleClose"
      :modelValue="open"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      ref="drawer"
    >
      <el-scrollbar class="content-warp-box">
        <el-form ref="form" :rules="rules" :model="form" :border="false" @submit.prevent label-position="top">
          <el-table :empty-text="emptyText"  ref="portTable" :max-height="maxHeight"  :data="form.formList"  style="width: 100%">
            <template #empty>
              <p>{{emptyText}}</p>
            </template>
            <el-table-column label="资产IP" align="left" :width="300">
              <template #header>
                <span class="tableHeader">资产IP </span>
              </template>
              <template #default="scope">
                <el-form-item>
                  <el-input v-model="scope.row.internalIp" maxlength="128" show-word-limit  @blur="validIPList(false)"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="说明" align="left" class="ml-10">
              <template #default="scope">
                <el-form-item>
                  <el-input v-model="scope.row.explain" maxlength="200" show-word-limit></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="" align="left" :width="type == 'seemfall'?238:188">
              <template #default="scope">
                <el-form-item>
                  <i @click="handleInsert(form.formList)"  class="icon el-icon-circle-plus"><el-icon><CirclePlus /></el-icon></i>
                  <i @click="handleRemove(form.formList, scope.$index)" v-if="form.formList.length > 1" class="icon el-icon-remove"><el-icon><Remove /></el-icon></i>
                  <span class="btn" v-if="type == 'seemfall'" @click="handleComfim(scope.row)">确认失陷</span>
                  <span class="btn ml-10"  @click="handleRelative(scope.row, scope.$index)">关联工单({{ scope.row.total?scope.row.total: 0}})</span>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div class="fs-form-footer-btns">
          <el-button @click="handleClose">取消</el-button>
          <el-button v-preventReClick type="primary" @click="submit">确定</el-button>
        </div>
      </el-scrollbar>
    </el-drawer>
    <relativeDialog
      v-if="relativeShow"
      :visible="relativeShow"
      :rowData="rowData"
      @closeView="relativeShow = false"
      @refresh="refreshRow"
    />
  </div>
</template>
<script>
import {getConfigFallDate,saveConfigFallDate, ConfirmFall} from '/@/api/scp/command/confige';
import relativeDialog from './relativeDialog.vue';
import { ElMessageBox,ElMessage } from "element-plus";
export default {
  components: { relativeDialog },
  props: {
    open: {
      type: Boolean,
      default: false
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
      emptyText:"",
      form: {
        formList : []
      },
      rules: {
				internalIp: [{ required: true, message: "资产IP不能为空", trigger: "change" }]
      },
      maxHeight: 100,
      errorShow: false,
      id: null,
      rowData: {},
      rowIndex: null,
      relativeShow: false
    }
  },
  created(){
    this.maxHeight = window.innerHeight - 150;
    let params = {
      combatFightPeriod: this.combatFightPeriod,
      cmdConfigeItemExplain: this.type =='confirmfall'?"cmd:confige:confirmfall": "cmd:confige:seemfall"
    }
    getConfigFallDate(params).then( res =>{
      if(res && res.data){
        this.id = res.data.id;
        const formList = res.data && res.data.length && res.data ||[];
        if(formList && formList.length){
          this.form.formList = formList;
        }else{
          this.form.formList = [ {internalIp: '' ,explain: '',
            combatFightPeriod: this.combatFightPeriod,
            cmdConfigeItemExplain: this.type =='confirmfall'?"cmd:confige:confirmfall": "cmd:confige:seemfall"
          }]
        }
      }
    })
  },
  methods: {
    handleComfim(row){
      let params = {
        internalIp: row && row.internalIp?row.internalIp.trim(): '',
        explain: row && row.explain?row.explain.trim(): '',
        combatFightPeriod: this.combatFightPeriod
      }
      if(params.internalIp){
        ElMessageBox.confirm(`此操作将转移 可能失陷资产： <span style="color:var(--el-color-primary);">${row.internalIp}</span> 到 确认失陷资产 数据中，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString:true,
          type: 'warning'
        }).then(_ => {
          ConfirmFall(params).then(res =>{
            if(res && res.code == 200){
              ElMessage({ message: '转移成功', type: 'success' });
              this.handleClose();
              this.$emit('refresh',this.type);
            }
          })
        }).catch(_ => {})
      }else{
        this.errorShow = true;
      }
    },
    /** 插入配置项 */
    handleInsert(formList) {
      const row = { internalIp: '', explain: '',
        total: 0,
        combatFightPeriod: this.combatFightPeriod,
        cmdConfigeItemExplain: this.type =='confirmfall'?"cmd:confige:confirmfall": "cmd:confige:seemfall"
      };
      formList.push(row)
    },
    /** 移除配置项 */
    handleRemove(formList, index) {
      formList.splice(index, 1)
    },
    handleClose() {
      this.$emit('closeView');
    },
    validIPList(falg){
      if(falg){
        this.form.formList.forEach((item,idnex) =>{
          item.internalIp =  item.internalIp?item.internalIp.trim(): '';
          item.explain =  item.explain?item.explain.trim():'';
        });
      }
      let allOrgan = this.form.formList.every(item=>{
        return item.internalIp
      })
      if(!allOrgan){
        this.errorShow = true;
      }else{
        this.errorShow = false;
      }
    },
    submit(){
      // 成功
      // this.validIPList(true)
      const list =  [];
      this.form.formList.forEach((item,idnex) =>{
        item.internalIp =  item.internalIp?item.internalIp.trim(): '';
        item.explain =  item.explain?item.explain.trim():'';
        item.total =  item.total? item.total: 0;
        if(item.internalIp && item.internalIp.trim()){
          list.push(item);
        }
      })
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let params = {
            id: this.id,
            combatFightPeriod: this.combatFightPeriod,
            cmdConfigeItemExplain: this.type =='confirmfall'?"cmd:confige:confirmfall": "cmd:confige:seemfall",
            list: list
          }
          saveConfigFallDate(params).then( res =>{
            if(res && res.code == 200){
              ElMessage({ message: '保存成功', type: 'success' });
              this.handleClose();
              this.$emit('refresh',this.type);
            }
          })
        }else {
          ElMessage.warning("请完善必填字段");
        }
      })
    },
    // 关联工单
    handleRelative(row,index){
      this.rowIndex = index;
      let params = {
        internalIp: row && row.internalIp?row.internalIp.trim(): '',
        combatFightPeriod: this.combatFightPeriod,
        cmdConfigeItemExplain: this.type =='confirmfall'?"cmd:confige:confirmfall": "cmd:confige:seemfall"
      }
      if(params.internalIp){
        this.rowData = params;
        this.relativeShow = true;
      }
    },
    refreshRow(list){
      const alarmListLength = list && list.length || 0;
      this.form.formList[this.rowIndex]['total'] = alarmListLength;
    }
  }
}
</script>
<style lang="less" scoped>
.content-warp-box{
  background-color: var(--el-fill-color-blank);
  :deep(.el-table--border), :deep(.el-table th), :deep(.el-table td),:deep(.el-table)  {
	  border: none !important;
  }
  :deep(.el-table th) {
    background-color: var(--el-fill-color-blank) !important;
    font-size: 14px;
    font-weight: normal;
    padding: 0 0;
    height: 32px;
  }
  :deep(.el-table td) {
    padding: 0;
  }
  :deep(.el-table--group::after), :deep(.el-table--border::after ){
    width: 0 ;
  }
  :deep(.text-right) {
    padding-top: 8px;
  }
  :deep(.el-table .cell) {
    padding: 0 10px 0 0 !important;
  }
  :deep(.el-table::before) {
    height: 0 ;
  }
  :deep(.el-table__inner-wrapper::before ){
    height: 0 ;
  }
}

.icon {
	font-size: 18px;
	margin-left: 10px;
	cursor: pointer;
}
.btn{
  font-size: 14px;
	margin-left: 10px;
	cursor: pointer;
  color: var(--el-color-primary);
}
.el-icon-circle-plus {
  color: var(--el-color-primary);
}
.el-icon-remove {
  color: #999999;
}
:deep(.el-form-item){
  margin-right: 0px !important;
  margin-bottom: 10px !important;
  &.el-input-number-box,.el-input-number--small{
    width: 140px !important;
  }
  &.explain-box{
    width:  calc(100% - 600px) !important;
  }
}
.error-text{
  color: #FF4158;
  position: absolute;
  left: 207px;
  z-index: 1;
  top: 65px;
  font-size: 13px;
}
</style>
