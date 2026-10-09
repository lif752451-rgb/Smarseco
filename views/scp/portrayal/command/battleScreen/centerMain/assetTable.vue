<template>
  <div class="asset-table">
    <el-table 
      v-loading="assetLoading"
      :class="assetLoading?'empty-loading':''"
      element-loading-background="transparent"
      :data="tableData" 
      stripe
      :max-height="isDialog?600:300"
      style="width: 100%;">
      <el-table-column
        prop="internalIp"
        label="资产IP"
        align="center"
        width="130">
        <template #default=" { row } ">
          <span :class="row.isNewAdd ? 'yellowFont' : ''">{{ row.internalIp }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ownership"
        label="资产归属"
        align="center"
       >
       <template #default=" { row } ">
          <span :class="row.isNewAdd ? 'yellowFont' : ''">{{ formatterOwner(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="explain"
        width="100"
        align="center"
        label="说明">
        <template #default=" { row } ">
          <span :class="row.isNewAdd ? 'yellowFont' : ''">{{ formatterExplain(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        align="center"
        label="关联工单">
        <template #default=" { row } ">
          <el-tag @click="$emit('open',{...row,assetType})" class="order">{{ row.total}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props:{
    isDialog:Boolean,
    tableData:Array,
    assetLoading:{
      type:Boolean,
      default:false
    },
    open:Function,
    assetType:String,
  },
  computed:{
  },
  created(){
  },
  updated(){
  },
  data() {
    return {
    }
  },
  methods:{
    formatterExplain(item){
      return item.explain || '-'
    },
    formatterOwner(item){
      let ret = []
      if(item.affiliation)ret.push(item.affiliation)
      if(item.area)ret.push(item.area)
      return ret.length?ret.join(';'):'-'
    },
    formatterOwner(item){
      let ret = []
      if(item.affiliation)ret.push(item.affiliation)
      if(item.instance)ret.push(item.instance)
      if(item.area)ret.push(item.area)
      if(item.assetUser)ret.push(item.assetUser)
      return ret.length?ret.join(';'):'-'
    }
  }
}

</script>
<style lang="less" scoped>
.asset-table{
  background-color: transparent;
  :deep(.el-table) {
    background-color: transparent;
    &::before{
      height: 0px;
    }
    .el-table__inner-wrapper::before{
      height: 0px;
    }
    .el-table__header-wrapper {
      background-color: transparent;
      border-bottom: 1px solid rgba(128,255,255,.4);
      .el-table__header {
        background-color: transparent;
        thead {
          background-color: transparent;
          tr {
            background-color: transparent;
            th {
              font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
              font-weight: 400;
              font-style: normal;
              color: #fff;
              padding: 0;
              height: 32px;
              font-size: 13px;
              line-height: 32px;
              background-color: transparent!important;
              border:none
            }
          }
        }
      }
    }
    .el-table__body-wrapper {
      background-color: transparent;
      min-height: 267px;
      .el-scrollbar__thumb{
        background-color: rgba(128, 255, 255, 1);
        border-radius: 3px;
      }
      tr{
        background-color: transparent;
        &:nth-child(2n+1){
          background-color: rgba(128, 255, 255, 0.09)!important;
        }
        
        td{
          background-color: transparent;
          border: none;
          font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
          font-weight: 400;
          font-style: normal;
          color: #00FFFF;
          padding: 0;
          height: 40px;
          font-size: 13px;
          line-height: 40px;
          .order {
            cursor: pointer;
            border-radius: 22px !important;
            margin-left: auto;
            color: #f8d45b;
            background: rgba(248, 208, 91, 0.2);
            border: none;
          }

        }
      }
    }
    &.empty-loading{
      .el-table__empty-block{
        display: none;
      }
      .el-loading-spinner .path {
        stroke: #57f4fd;
      }
    }
  }
}
.yellowFont {
  color: #F8D45B;
}
</style>