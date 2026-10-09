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
          <p>实时攻击分布</p>
        </div>
      </div>
      <attackDistribute from="battle"   ref="attackDistribute"/>
    </div>
  </div>
</template>
<script>
import attackDistribute from '/@/views/scp/securityOperations/components/overallSituation/attackDistribute.vue';
import util from '/@/utils';
export default {
  name:'bottomContent',
  components: {
    attackDistribute
  },
  data(){
    return {
      util
    }
  },
  mounted(){
  },
  methods:{
    refreshData(){
    },
  }
}

</script>
<style lang="less" scoped>
.card-wrap {
  :deep(.attack-distribute) {
    .content-title,.title-line {
      display: none;
    }
  }
}
</style>
