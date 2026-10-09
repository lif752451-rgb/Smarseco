<!--编辑-->
<template>
  <el-drawer
      title="编辑常用功能"
      :model-value="openFlag"
      direction="rtl"
      size="700px"
      :before-close="cancel"
      :close-on-click-modal="false"
  >
    <el-scrollbar>
      <div class="tree-box"  v-loading="loading">
        <el-tree
            v-if="treeData && treeData.length"
            :data="treeData"
            show-checkbox
            node-key="id"
            ref="tree"
            :default-checked-keys="checkedMenuIds"
            :default-expand-all="true"
            :props="defaultProps">
        </el-tree>
      </div>
      <div class="fs-form-footer-btns">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>
<script>
import { getTree ,saveCommon } from '/@/api/sbp/homepage.js';
import {  ElMessage } from "element-plus";
export default {
  name: "addCommon",

  props: {
    openFlag:{
        type: Boolean,
    } ,

  },
  data() {
    return {
        loading: true,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeData:''
    };
  },
  watch: {
    config(curVal, oldVal) { },
  },
  computed: {
  },
  created() {
       getTree().then(res=>{
            if(res.code==200) {
                this.checkedMenuIds = res.data.checkedMenuIds
                this.treeData = res.data.tree
                this.changeTreeValue(this.treeData)
                this.loading = false
            }
      }).catch((err) => {
            this.loading = false;
        });
  },
  mounted() {
  },
  methods: {
    changeTreeValue(treeData) {
        for(let i = 0; i < treeData.length; i++){
            if(treeData[i].type == 'M'){
              treeData[i].disabled = false
            }
            if(treeData[i].children && treeData[i].children.length) {
                this.changeTreeValue(treeData[i].children);
            }
        }
    },
    submitForm() {
        let params = this.$refs.tree.getCheckedKeys();
        console.log("params", params)
        saveCommon(params).then(res=>{
            if(res.code == 200) {
              ElMessage({ message: "编辑成功", type: "success" });
              this.refrash();
            }
        })
    },
    refrash() {
      this.refashTable();
      this.cancel();
    },
    //关闭弹窗
    cancel() {
      this.$emit("closeView");
    },
    //刷新表格
    refashTable() {
      this.$emit("commonList");
    }
},
};
</script>
<style lang="less" scoped>
.tree-box {
  :deep(.is-leaf + .el-checkbox .el-checkbox__inner) {
    display: inline-block;
  }
  :deep(.el-checkbox .el-checkbox__inner) {
    display: none;
  }
}

 </style>


