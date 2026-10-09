<template>
  <el-row :gutter="10" style="padding: 5px 10px 0 10px;">
    <el-col :span="4" v-for="(item, index) in dataList" :key="index"
      ><div class="card">
        <el-row :gutter="10">
          <el-col :span="14">
            <div class="card_left">
              {{ item.name }}
              <div class="card_count">{{ item.count }}</div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="card_right">
              <img
                class="icon-img"
                :src="util.getAssetsImages(`operate/dataSecurity${index}.svg`)"
              />
            </div>
          </el-col>
        </el-row>
      </div></el-col
    >
  </el-row>
</template>
<script>
import { formatNumber } from "/@/utils/util.common";
import util from "/@/utils";
export default {
  props: {
    countList: {
      type: Array,
    },
  },
  data() {
    return {
      util,
      dataList: [],
    };
  },
  computed: {
    dataRange() {
      const { countList } = this;
      countList.forEach((item) => {
        item.count = formatNumber(item.count, 0, ".", ",", false);
      });
      return { countList };
    },
  },
  watch: {
    dataRange: {
      handler() {
        this.dataList = this.countList;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
  },
};
</script>
<style lang="less" scoped>
.card {
  width: 100%;
  height: 100px;
  background: #fff;
  box-shadow: 0px 0px 4px rgba(224, 230, 237, 1);
  margin-bottom: 10px;
  border:1px solid #e0e6ed;
  cursor: pointer;
  .card_left {
    position: relative;
    // height: 40px;
    line-height: 40px;
    padding-left: 20px;
    font-weight: 500;
    font-size: 16px;
    // color: #fff;
    // &.risk0 {
    //   background-image: linear-gradient(to right, #1e71d2, #daf0ff);
    // }
    // &.risk1 {
    //   background-image: linear-gradient(to right, #1e9b66, #ccffe9);
    // }
    // &.risk2 {
    //   background-image: linear-gradient(to right, #aa49f6, #ecd7fd);
    // }
    // &.risk3 {
    //   background-image: linear-gradient(to right, #ff7e00, #f7dca6);
    // }

    .card_count {
      // height: calc(100% - 40px);
      line-height: 60px;
      padding-left: 20px;
      font-size: 24px;
      color: #333;
    }
  }
  .card_right {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
