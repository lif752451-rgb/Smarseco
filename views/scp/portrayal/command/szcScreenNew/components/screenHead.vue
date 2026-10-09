<template>
  <el-row class="screen-head" type="flex">
    <div class="title_content">
      <el-col :span="8">
        <el-row class="left-date" type="flex">
          <p>{{ date }}</p>
        </el-row>
      </el-col>
      <el-col :span="8">
        <div class="center-title">
        </div>
      </el-col>
      <el-col :span="8">
        <div class="title_right">
          <div class="time_content">
            <el-checkbox @change="changeCheck" v-model="topoChecked">拓扑图例</el-checkbox>
            <p>
              <span class="title_cycle">统计周期：</span>
              <el-popover
                popper-class="popper_screen_box"
                trigger="hover"
                width="90"
                :teleported="false"
                :show-arrow="false"
              >
                <div class="time_list">
                  <p
                    v-for="(item, index) in timeList"
                    :key="index"
                    @click="handleTab(item, index)"
                    class="tab"
                    :class="timeStatus === item ? 'active' : ''"
                  >
                    {{ item }}
                  </p>
                </div>
                <template #reference>
                  <span class="title_status"
                    >{{ timeStatus }}<span class="block_border"></span
                  ></span>
                </template>
              </el-popover>
            </p>
          </div>
          <el-image
            @click="openFullScreen"
            class="right-icon"
            :src="util.getAssetsImages('szc_screen/open_full.png')"
          />
        </div>
      </el-col>
    </div>
  </el-row>
</template>
<script>
import { formatWeek } from "/@/utils/old/index";
import util from '/@/utils';
export default {
  data() {
    return {
      util,
      date: formatWeek(new Date()),
      timeStatus: "近24小时",
      timeList: ["近24小时", "近7天", "近30天"],
      timer: null,
      topoChecked: true
    };
  },
  created() {
    this.timer = setInterval(() => {
      this.date = formatWeek(new Date());
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    handleTab(value, index) {
      console.log("index", index);
      this.timeStatus = value;
      this.$emit("handleTime", index);
    },
    openFullScreen() {
      this.$emit("openFullScreen");
    },
    changeCheck(val) {
      this.$emit('emitChecked', val)
    }
  },
};
</script>
<style lang="less" scoped>
.screen-head {
  width: 100%;
  height: 160px;
  background: url("/@/assets/images/szc_screen/szc_screen_hander.png")
    center center no-repeat;
  background-size: 100% 100%;
  .title_content {
    width: 100%;
    height: 60px;
    margin: 0;
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
  .left-date {
    padding: 0 0 0 10px;
    display: flex;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
    p {
      font-size: 16px;
      color: #fff;
    }
  }
  .center-title {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 320px;
    }
  }
  .title_right {
    float: right;
    display: flex;
    justify-content: flex-end;
    .time_content {
      margin-right: 20px;
      display: flex;
      align-items: center;
      img {
        width: 16px;
        margin-right: 10px;
      }
      p {
        .title_cycle {
          color: #fff;
        }
        .title_status {
          cursor: pointer;
          color: #fff;
          display: inline-block;
          width: 75px;
        }
        .block_border {
          margin-left: 4px;
          margin-bottom: 2px;
          display: inline-block;
          border-top: 5px solid #fff;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
        }
      }
      .el-checkbox {
        margin-right: 10px;
      }
    }
    .right-icon {
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }
  }
}
:deep(.el-col.el-col-8) {
  position: relative;
}
</style>
<style lang="less">
.popper_screen_box {
  min-width: 90px !important;
  color: #d7d7d7 !important;
  background-color: #1b284a !important;
  border: 1px solid rgba(128, 255, 255, 0.4);
  font-size: 13px;
  line-height: 32px;
  padding: 3px 12px;
  z-index: 3000 !important;
  position: fixed !important;
  .tab {
    cursor: pointer;
    line-height: 32px;
    &.active {
      color: #06edff;
    }
  }
  .popper__arrow {
    border-bottom-color: rgba(128, 255, 255, 0.4) !important ;
  }
  .popper__arrow::after {
    border-bottom-color: #1b284a !important ;
  }
}
</style>
