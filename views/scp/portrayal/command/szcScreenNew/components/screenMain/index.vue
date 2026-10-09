<template>
  <div class="screen-main">
    <topology ref="topology" v-bind="$attrs"/>
  </div>
</template>
<script>
import topology from './topology.vue';
export default {
  name: 'szcMain',
  components: {
    topology,
  },
}
</script>
<style lang="less">
.screen-main {
  margin-top: 5px;
}
</style>
