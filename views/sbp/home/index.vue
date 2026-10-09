<template>
  <div>
    <operate v-if="active === 1" />
    <todo v-if="active === 2" />
    <done v-if="active === 3" />
  </div>
</template>

<script>
import operate from "./operate.vue";
import todo from "./todo.vue";
import done from "./done.vue";

export default {
  name: "sbp-home-index",
  components: {
    operate,
    todo,
    done
  },
  data() {
    return {
      active: 1
    };
  },
  created() {
    // const routePaths = ['/sbp/home/index','/sbp/home/todo','/sbp/home/done']
    // this.active = routePaths.indexOf(this.$route.path) + 1;
    // if(this.active == 0) {
    //   this.active = 1;
    // }
  }
};
</script>
<style lang="less" scoped>
:deep(.el-tabs__nav-wrap::after ) {
  height: 1px;
}
:deep(.app-main) {
  background: transparent;
}
</style>
