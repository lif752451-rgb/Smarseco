<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="1">
      <template #title>
        <el-row class="title-box" justify="space-between">
          <span class="title">常用功能</span>
          <span class="flex-center">
            <el-input class="search-input" v-model="searchModuleName" @click.stop @keyup.enter="searchCommonUse">
              <template #suffix>
                <el-icon @click.stop="searchCommonUse"><Search /></el-icon>
              </template>
            </el-input>
            <el-button class="ml-5" type="primary" plain @click.stop="openCommon" icon="Plus"></el-button>
          </span>
        </el-row>
      </template>
      <el-scrollbar>
        <div v-if="listData.length" class="content">
          <div class="item" v-for="(item, index) in listData" :key="index" @click="openModule(item.modulePath)">
            <CrcIcon v-if="isUpperCase(item.icon.charAt(0)) || item.icon.indexOf(':') > -1" :icon="item.icon" />
            <img v-else class="icon" :src="getAssetsImages('sbp/table_nodata.png')" alt="" />
            <span>{{ item.moduleName }}</span>
          </div>
        </div>
        <div v-else class="tips">
          <img :src="getAssetsImages('sbp/table_nodata.png')" alt="" />
          <span>暂未添加常用功能，请点击右上角“+”添加</span>
        </div>
      </el-scrollbar>
    </el-collapse-item>
  </el-collapse>
  <addCommon v-if="openFlag" :openFlag="openFlag" @closeView="closeView" @commonList="commonList" />
</template>
<script>
import { getCommon } from "/@/api/sbp/homepage.js";
import addCommon from "./addCommon.vue";
import { COMMON_ICON, COMMON_FONT, COMMON_FONT_ICON } from "../constants/index.js";
import { getAssetsImages } from "/@/utils/util.url";
import { useAccount } from "/@/hooks/account/useAccount";
const { getUserName } = useAccount();

export default {
  name: "operate",
  components: {
    addCommon,
  },
  data() {
    return {
      openFlag: false,
      listData: [],
      searchModuleName: "",
      commonIcon: COMMON_ICON,
      commonFont: COMMON_FONT,
      commonFontIcon: COMMON_FONT_ICON,
      activeNames: "1",
      //defaultImg: 'this.src="' + require('@/assets/image/sbp/table_nodata.png') + '"'
    };
  },
  created() {
    this.commonList();
  },
  computed: {
    username() {
      return this.$store.state.user.name;
    },
    iconFontName() {
      return (name) => {
        const index = this.commonFont.indexOf(name);
        return this.commonFontIcon[index];
      };
    },
  },
  methods: {
    getAssetsImages,
    isUpperCase(char) {
      // 使用正则表达式匹配大写字母
      const regex = /^[A-Z]$/;
      return regex.test(char);
    },
    commonList() {
      getCommon().then((res) => {
        if (res.code == 200) {
          this.listData = res.data;
          this.originData = res.data;
        }
      });
    },
    openCommon() {
      this.openFlag = true;
    },
    openModule(path) {
      this.$router.push(path);
    },
    closeView() {
      this.openFlag = false;
    },
    searchCommonUse() {
      this.activeNames = "1";
      if (this.originData && this.originData.length) {
        this.listData = this.originData.filter((item) => {
          return item.moduleName.indexOf(this.searchModuleName) !== -1;
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.el-collapse {
  margin: 10px 10px 0;
  background-color: var(--el-fill-color-blank);
  border-radius: 5px;
  overflow: hidden;
  :deep .el-collapse-item__content {
    padding-bottom: 10px;
  }
  .title-box {
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    .title {
      line-height: 35px;
    }
    .search-input {
      width: 400px;
    }
    .flex-center {
      display: flex;
      align-items: center;
    }
  }

  .el-scrollbar {
    :deep(.el-scrollbar__wrap) {
      max-height: 210px;
    }
    .content {
      padding: 10px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      min-height: 95px;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 20px 20px 20px;
        width: 120px;
        cursor: pointer;
        img.icon {
          width: 40px;
          height: 40px;
          display: inline-block;
          margin-bottom: 15px;
        }
        .fs-icon {
          font-size: 32px;
          color: var(--el-color-primary);
        }
        span {
          text-align: center;
        }
      }
    }
    .tips {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 150px;
        height: auto;
      }
      span {
        color: #ccc;
        padding: 20px;
        display: inline-block;
      }
    }
  }
}
</style>
