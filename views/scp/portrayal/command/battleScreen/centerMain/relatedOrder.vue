<template>
  <div>
    <div class="info-tags" v-if='detailData.length'>
      <el-tag v-for="(item,key) in detailData" :key="key" @click="open_detail(item)">{{item.alarmId}}</el-tag>
    </div>
    <div class="without-data" v-else>
      <span >暂无数据</span>
    </div>
  </div>
</template>
<script>
import {  getmenuByPerms } from "/@/api/common";
export default {
  name:'relatedOrder',
  props:{
    detailData:{
      type:Array,
      default:[]
    },
  },
  data() {
    return {
      hasPath: ''
    }
  },
  methods:{
    open_detail(item){
      getmenuByPerms({ perms: 'defend:alarm:response' }).then((rel) => {
        if (rel && rel.code == 200) {
          let newUrl = this.$router.resolve({
            path:'/scp/defend/alarm',
            query: {
              id: item.relationId,
              alarmType: 'combat'
            },
          });
          window.open(newUrl.href, "_blank");
        }
      })
    }
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
    cursor: pointer;
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
.without-data{
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dddddd;
}
</style>
