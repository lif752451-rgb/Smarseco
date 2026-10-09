<template>
  <div class="right_comtain">
    <!-- 集权系统 -->
    <div class="system">
      <div class="system_title" @click="centralizeDetail = true">
        集权系统被攻击情况<span class="system_text">(近5条)</span>
      </div>

      <div class="system_content" v-loading="loading.system">
        <el-carousel
          :interval="5000"
          direction="vertical"
          arrow="never"
          height="140px"
          indicator-position="none"
          v-if="systemList.length"
          v-loading="loading.system"
        >
          <el-carousel-item
            v-for="systemPageItem in systemPageList"
            :key="systemPageItem"
          >
            <div
              class="system_list"
              v-for="(item, index) in systemList.slice(
                systemPageSize * (systemPageItem - 1),
                systemPageSize * systemPageItem
              )"
              :key="index"
              @click="handerAlarm(item)"
            >
              <div class="list_box">
                <div class="system_name name">{{ item.title }}</div>
                <div class="system_btn">
                  <span :class="`attackResult${item.attackResult}`">{{
                    item.attackResultLabel
                  }}</span
                  ><span :class="`level${item.level}`">{{
                    item.levelLabel
                  }}</span>
                </div>
              </div>
              <div class="list_box list_bottom">
                <div class="ip_name name">
                  {{ item.internalIp
                  }}{{ item.instance != "-" ? ` [${item.instance}]` : "" }}
                </div>
                <div class="ip_content">{{ item.attackMeans }}</div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="without-data system_data" v-else v-loading="loading.system">
          <span>暂无数据</span>
        </div>
      </div>
    </div>
    <!-- 漏洞概览 -->
    <div class="loop">
      <div class="loop_title" @click="vulnDetail = true">漏洞概览</div>
      <div class="loop_sum">
        <div class="loop_total">
          <div class="loop_total_box">
            <div class="loop_total_text">工单总数</div>
            <div class="loop_total_total" v-loading="loading.loopSum">
              {{ loopSum.all }}
            </div>
          </div>
        </div>
        <div class="repair">
          <div class="loop_num loop_done" @click="handerLoop('complete')">
            <div class="loop_total_box">
              <div class="loop_total_text">已修复</div>
              <div class="loop_total_total" v-loading="loading.loopSum">
                {{ loopSum.complete }}
              </div>
            </div>
          </div>
          <div class="loop_num loop_wait" @click="handerLoop('noComplete')">
            <div class="loop_total_box">
              <div class="loop_total_text">未修复</div>
              <div class="loop_total_total" v-loading="loading.loopSum">
                {{ loopSum.noComplete }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="loop_risk">
        <div class="risk_total" @click="handerLoop('noCompleteHigh')">
          <div class="risk_total_total" v-loading="loading.loopSum">
            {{ loopSum.noCompleteHigh }}
          </div>
          <div class="risk_total_text">未修复中高风险</div>
        </div>
        <div class="risk_tool">
          <div class="risk_box">
            <div class="half half_text">逾期修复率</div>
            <div class="half half_total" v-loading="loading.loopSum">
              {{ loopSum.repair }}
            </div>
          </div>
          <div
            class="risk_box"
            style="cursor: pointer"
            @click="handerLoop('noPush')"
          >
            <div class="half half_text">待推送</div>
            <div class="half half_total" v-loading="loading.loopSum">
              {{ loopSum.noPush }}
            </div>
          </div>
        </div>
      </div>
      <div class="table_title">
        <div class="table_img table_left_img"></div>
        <div class="table_title_text">未修复中高风险漏洞</div>
        <div class="table_img table_right_img"></div>
      </div>
      <div class="table_box">
        <div class="header table_header">
          <div class="loop_name">漏洞名称</div>
          <div class="loop_rank">漏洞等级</div>
          <div class="loop_status">工单状态</div>
        </div>
        <el-carousel
          :interval="5000"
          direction="vertical"
          arrow="never"
          height="90px"
          indicator-position="none"
          v-if="loopList.length"
          v-loading="loading.loopList"
        >
          <el-carousel-item v-for="pageItem in pageList" :key="pageItem">
            <div
              class="header page_item"
              v-for="(item, index) in loopList.slice(
                pageSize * (pageItem - 1),
                pageSize * pageItem
              )"
              :key="index"
              @click="handerLoopList(item)"
            >
              <div class="loop_name vuln_name">{{ item.vuln_name }}</div>
              <div class="loop_rank">
                <span class="level_label" :class="`level${item.level}`">{{
                  item.level_label
                }}</span>
              </div>
              <div class="loop_status state_label">
                {{ item.work_order_state_label }}
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="without-data loop_data" v-else v-loading="loading.loopList">
          <span>暂无数据</span>
        </div>
      </div>
    </div>
    <!-- 集权详情 -->
    <centralizeDialog
      v-if="centralizeDetail"
      :open="centralizeDetail"
      :paramsJson="paramsJson"
      @closeDetail="centralizeDetail = false"
      @rowClick="handerAlarm"
    />
    <!-- 漏洞详情 -->
    <vulnDetailDialog
      v-if="vulnDetail"
      :open="vulnDetail"
      :loopSum="loopSum"
      :paramsJson="paramsJson"
      @closeDetail="vulnDetail = false"
      @rowClick="handerLoopList"
      @handleToPath="handerLoop"
    />
  </div>
</template>
<script>
import lodash from "lodash-es";
import vulnDetailDialog from "./vulnDetailDialog.vue";
import centralizeDialog from "./centralizeDialog.vue";
import { getLoopPerms, isJurisdictionOrder } from "/@/api/scp/szcScreen";
import { hasMenuPerms } from "/@/api/common";
import {  ElMessage } from "element-plus";
export default {
  components: { vulnDetailDialog, centralizeDialog },
  props: {
    loopSum: {
      type: Object,
      default: () => {},
    },
    systemList: {
      type: Array,
      default: () => [],
    },
    loopList: {
      type: Array,
      default: () => [],
    },
    paramsJson: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      systemPageSize: 2,
      pageSize: 3,
      vulnDetail: false,
      centralizeDetail: false,
    };
  },
  computed: {
    pageList() {
      return Math.ceil(this.loopList.length / this.pageSize);
    },
    systemPageList() {
      return Math.ceil(this.systemList.length / this.systemPageSize);
    },
  },
  methods: {
    // 集权列表跳转
    handerAlarm(row) {
      const perms = "alarm:closed";
      isJurisdictionOrder(row.businessKey).then((res) => {
        if (res.code == 200) {
          const routerPath = "/stp/menaceManege";
          let params = {
            id: row.id,
          };
          const routeUrl = this.$router.resolve({
            path: routerPath,
            query: params,
          });
          window.open(routeUrl.href)
        } else {
          ElMessage({ message: "暂无权限", type: "warning" });
        }
      });
    },
    // 漏洞概览跳转
    handerLoop(value, boolean) {
      const perms = value === "noPush" ? "vuln:discover" : "vuln:loop";
      hasMenuPerms({ perms }).then(({ data }) => {
        if (data) {
          let params = {};
          let routerPath = "/stp/vuln/loop";
          if (boolean) {
            params["id"]= value;
          } else {
            params = {
              pushTime: [this.paramsJson.dateStart, this.paramsJson.dateEnd],
            };
            if (value === "complete") {
              params = {
                ...params,
                workOrderStateList: ["3"],
                deptPath: 100,
              };
            } else if (value === "noComplete") {
              params = {
                ...params,
                workOrderStateList: ["1", "2", "4"],
                deptPath: 100,
              };
            } else if (value === "noCompleteHigh") {
              params = {
                ...params,
                workOrderStateList: ["1", "2", "4"],
                levels: ["3", "2", "1"],
                deptPath: 100,
              };
            } else if (value === "noPush") {
              params = {
                ...params,
                status: '0',
                deptPath: 100,
              }
              routerPath = "/stp/vuln/all";
            }
          }
          const routeUrl = this.$router.resolve({
            path: routerPath,
            query: params,
          });
          window.open(routeUrl.href)
        } else {
          ElMessage({ message: "暂无权限", type: "warning" });
        }
      });
    },
    handerLoopList(row) {
      getLoopPerms(row.code).then((res) => {
        if (res.code == 200) {
          const closepermsList = [
            {
              name: "host",
              perms: "vuln:loop:host",
              category: "1",
              path: "/stp/vuln/loop",
            },
            {
              name: "web",
              perms: "vuln:loop:web",
              category: "2",
              path: "/stp/vuln/loop",
            },
            {
              name: "code",
              perms: "vuln:loop:code",
              category: "3",
              path: "/stp/vuln/loop",
            },
          ];
          let routerPath = "/stp/vuln/loop";
          let code =
            lodash
              .find(closepermsList, { category: row.category })
              .name.toUpperCase() || "";
          let params = { id: row.id, code: code };
          const routeUrl = this.$router.resolve({
            path: routerPath,
            query: params,
          });
          window.open(routeUrl.href)
        } else {
          ElMessage({ message: "暂无权限", type: "warning" });
        }
      });
    },
    // 将实参转化为URL
    changesUrl(obj) {
      var arr = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p)) {
          arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return arr.join("&");
    },
  },
};
</script>
<style lang="less" scoped>
.right_comtain {
  padding-right: 10px;
  :deep(.el-carousel__container){
    z-index: 0;
  }
  .card-top {
    height: 60px;
    width: 100%;
    background: url("/@/assets/images/szc_screen/card-top-bg.png")
      center center no-repeat;
    background-size: 100% 100%;
    padding: 0 20px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .card-top-title {
      color: #fff;
      font-size: 16px;
      font-weight: 500;
    }
    img {
      width: 16px;
      height: 16px;
    }
  }
  .system_title {
    cursor: pointer;
    width: 100%;
    height: 35px;
    background: url("/@/assets/images/szc_screen/alarm_title.png") left
      center no-repeat;
    background-size: 100% 100%;
    margin-bottom: 7px;
    font-size: 18px;
    color: #fff;
    font-weight: 500;
    text-indent: 40px;
    .system_text {
      margin-left: 10px;
      font-size: 12px;
      color: #fff;
      font-weight: 500;
      line-height: 30px;
    }
  }
  .page_item {
    cursor: pointer;
    &:nth-child(2n-1) {
      background: rgba(1, 16, 44, 1);
    }
    &:nth-child(2n) {
      background: rgba(1, 6, 16, 1);
    }
  }

  .system_list {
    cursor: pointer;
    height: 60px;
    padding: 8px 10px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 10px;
    background: url("/@/assets/images/szc_screen/dialog_wrap.png")
      center center no-repeat;
    background-size: 100% 100%;
    border-left: 3px solid #0055ff;
    box-sizing: border-box;
    background-image: linear-gradient(
      to right,
      rgba(0, 38, 111, 1),
      rgba(2, 8, 21, 0.2)
    );
    .list_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.list_bottom {
        color: #bddbff;
        .ip_name {
          width: 50%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .ip_content {
          max-width: 35%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .name {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.system_name {
          color: #fff;
        }
      }
      .system_btn {
        span {
          display: inline-block;
          margin-left: 10px;
          line-height: 18px;
          padding: 2px 8px;
          border-radius: 12px;
          color: #f2f2f2;
          &.level4 {
            border: 1px solid rgba(161, 213, 242, 0.8);
            background: rgba(161, 213, 242, 0.2);
          }
          &.level3 {
            border: 1px solid rgba(194, 128, 255, 0.8);
            background: rgba(194, 128, 255, 0.2);
          }
          &.level2 {
            border: 1px solid rgba(255, 200, 54, 0.8);
            background: rgba(255, 200, 54, 0.2);
          }
          &.level1 {
            border: 1px solid rgba(207, 19, 34, 0.8);
            background: rgba(207, 19, 34, 0.2);
          }
          &.attackResult0 {
            border: 1px solid rgba(194, 128, 255, 0.8);
            background: rgba(194, 128, 255, 0.2);
          }
          &.attackResult1 {
            border: 1px solid rgba(255, 200, 54, 0.8);
            background: rgba(255, 200, 54, 0.2);
          }
          &.attackResult2 {
            border: 1px solid rgba(237, 64, 20, 0.8);
            background: rgba(237, 64, 20, 0.2);
          }
          &.attackResult3 {
            border: 1px solid rgba(161, 213, 242, 0.8);
            background: rgba(161, 213, 242, 0.2);
          }
          &.attackResult4 {
            border: 1px solid rgba(207, 19, 34, 0.8);
            background: rgba(207, 19, 34, 0.2);
          }
          &.attackResult5 {
            border: 1px solid rgba(255, 99, 71, 0.8);
            background: rgba(255, 99, 71, 0.2);
          }
        }
      }
    }
  }
  .loop {
    .loop_title {
      cursor: pointer;
      width: 100%;
      height: 35px;
      background: url("/@/assets/images/szc_screen/alarm_title.png")
        left center no-repeat;
      background-size: 100% 100%;
      margin-bottom: 7px;
      font-size: 18px;
      color: #fff;
      font-weight: 500;
      text-indent: 40px;
    }
    .loop_sum {
      width: 100%;
      height: 90px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      font-weight: 500;
      font-size: 14px;
      color: #fff;
      .loop_total {
        height: 100%;
        width: 55%;
        background: url("/@/assets/images/szc_screen/loop_total.png")
          left center no-repeat;
        background-size: 100% 100%;
        .loop_total_box {
          margin-left: 38%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          .loop_total_total {
            margin-top: 10px;
            font-size: 18px;
          }
        }
      }
      .repair {
        height: 100%;
        width: calc(45% - 10px);
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .loop_num {
          width: 100%;
          height: calc(50% - 5px);
          display: flex;
          justify-content: space-around;
          font-weight: 500;
          font-size: 12px;
          color: #fff;
          cursor: pointer;
          &.loop_done {
            background: url("/@/assets/images/szc_screen/loop_done.png")
              left center no-repeat;
            background-size: 100% 100%;
          }
          &.loop_wait {
            background: url("/@/assets/images/szc_screen/loop_wait.png")
              left center no-repeat;
            background-size: 100% 100%;
          }
          .loop_total_box {
            margin-left: 38%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            .loop_total_total {
              font-size: 16px;
              line-height: 16px;
            }
          }
        }
      }
    }
    .loop_risk {
      width: 100%;
      height: 120px;
      background: url("/@/assets/images/szc_screen/loop_sum.png") left
        center no-repeat;
      background-size: 100% 100%;
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      font-weight: 500;
      font-size: 12px;
      color: #fff;
      .risk_total {
        cursor: pointer;
        width: 36%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding-top: 30px;
        box-sizing: border-box;
        .risk_total_total {
          font-size: 16px;
        }
      }
      .risk_tool {
        width: 55%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .risk_box {
          width: 100%;
          display: flex;
          height: 50%;
          .half {
            width: 50%;
            display: flex;
            align-items: center;
            padding-top: 20px;
            &.half_total {
              font-size: 16px;
            }
          }
        }
      }
    }
    .table_title {
      width: 100%;
      height: 18px;
      display: flex;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      line-height: 18px;
      .table_img {
        flex: 1;
        height: 100%;
        background: url("/@/assets/images/szc_screen/table_right_img.png")
          center center no-repeat;
        background-size: 100% 100% !important;
        &.table_left_img {
          transform: scaleX(-1);
        }
      }
      .table_title_text {
        margin: 0 5px;
      }
    }
  }

  .without-data {
    width: 100%;
    height: 60px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #dddddd;
    &.system_data {
      height: 140px;
    }
    &.loop_data {
      height: 90px;
    }
  }
  .table_box {
    .header {
      display: flex;
      font-size: 12px;
      height: 30px;
      align-items: center;
      &.table_header {
        font-size: 13px;
        font-weight: 500px;
        color: #fff;
        line-height: 30px;
        box-sizing: border-box;
      }
      .loop_name {
        flex: 1;
        padding: 0 10px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.vuln_name {
          color: #bddbff;
        }
      }
      .loop_rank {
        width: 60px;
        margin: 0 10px;
        display: flex;
        .level_label {
          line-height: 18px;
          padding: 2px 8px;
          border-radius: 12px;
          color: #f2f2f2;
          &.level3 {
            border: 1px solid rgba(207, 19, 34, 0.8);
            background: rgba(207, 19, 34, 0.2);
          }
          &.level2 {
            border: 1px solid rgba(255, 200, 54, 0.8);
            background: rgba(255, 200, 54, 0.2);
          }
          &.level1 {
            border: 1px solid rgba(194, 128, 255, 0.8);
            background: rgba(194, 128, 255, 0.2);
          }
          &.level0 {
            border: 1px solid rgba(0, 235, 125, 0.8);
            background: rgba(0, 235, 125, 0.2);
          }
        }
      }
      .loop_status {
        width: 60px;
        &.state_label {
          color: #bddbff;
        }
      }
    }
  }
  // 加载样式
  :deep(.el-loading-mask) {
    background-color: hsla(0, 0%, 100%, 0);
  }
  :deep(.el-loading-spinner .path) {
    stroke: #57f4fd;
  }
}
</style>
