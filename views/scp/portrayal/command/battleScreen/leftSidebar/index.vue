<template>
  <div>
    <div class="card-wrap" style="height: 640px">
      <div class="card-top">
        <el-image
          class="card-top-head"
          :src="
            util.getAssetsImages('battle-screen/card-top-head.svg')
          "
        ></el-image>
        <div class="card-top-title">
          <p>任务跟进情况</p>
        </div>
      </div>
      <div class="card-count-score">
        <div
          class="score-box"
          :class="status === 'all' ? 'active' : ''"
          @click="handleCount('all')"
        >
          <p class="score-count">{{countData.taskTotal}}</p>
          <p class="score-name">任务总数</p>
        </div>
        <div
          class="score-box"
          :class="status === 'not' ? 'active' : ''"
          @click="handleCount('not')"
        >
          <p class="score-count">{{countData.noFreebackTotal}}</p>
          <p class="score-name">未反馈</p>
        </div>
        <div
          class="score-box"
          :class="status === 'already' ? 'active' : ''"
          @click="handleCount('already')"
        >
          <p class="score-count">{{countData.freebackTotal}}</p>
          <p class="score-name">已反馈</p>
        </div>
      </div>
      <div class="card-count-score">
        <div
          class="score-box"
          :class="status === 'issue' ? 'active' : ''"
          @click="handleCount('issue')"
        >
          <p class="score-count">{{countData.todayIssueTaskTotal}}</p>
          <p class="score-name">今日下发</p>
        </div>
        <div
          class="score-box"
          :class="status === 'cutoff' ? 'active' : ''"
          @click="handleCount('cutoff')"
        >
          <p class="score-count">{{countData.todayDeadLineTaskTotal}}</p>
          <p class="score-name">今日截止</p>
        </div>
        <div
          class="score-box"
          :class="status === 'timeout' ? 'active' : ''"
          @click="handleCount('timeout')"
        >
          <p class="score-count">{{countData.overtimeFreeback}}</p>
          <p class="score-name">超时反馈</p>
        </div>
      </div>
      <div class="cart-count">
        <div>
          <div
            class="count-item"
            @click="handelOpen(item)"
            v-for="(item, index) in taskFollowList"
            :key="item.id"
          >
            <div class="line-1">
              <div class="item-index">{{ index + 1 }}</div>
              <el-tag class="item-task-type">{{ item.taskType }}</el-tag>
              <div class="item-title">
                <sm-text-tooltip :content="item.taskName" :teleported="true"/>
              </div>
              <el-tag
                :class="item.status == 1 ? 'item-status-1' : 'item-status-2'"
                >{{ item.status == 1 ? "未反馈" : "已反馈" }}</el-tag
              >
            </div>
            <div style="display: flex">
              <div>
                <span style="color: #f2f2f2">跟进人：</span>
                <span style="color: #f2f2f2">{{
                  item.taskFollowPersonName
                }}</span>
              </div>
              <div style="margin-left: auto">
                <span style="color: #f2f2f2">截止时间：</span>
                <span style="color: #f2f2f2">{{ item.deadlineTime }}</span>
                <span v-if="item.type == 0" style="color: #f6152b">[超时]</span>
                <span v-else style="color: #f2f2f2">[未超时]</span>
              </div>
            </div>
            <div>
              <img :src="util.getAssetsImages('battle-screen/under-line.svg')" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <alarm-card :alarmData="leftData.alarmData" />
    <!-- 任务跟进详情 -->
    <detail-dialog
      v-if="taskVisible"
      :dialogVisible="taskVisible"
      :dialogTile="taskTitle"
      @close="() => (this.taskVisible = false)"
    >
      <task-detail :id="id" />
    </detail-dialog>
  </div>
</template>
<script>
import alarmCard from "./alarmCard.vue";
import taskDetail from "./taskDetail.vue";
import detailDialog from "../component/detailDialog.vue";
import SmTextTooltip from "/@/components/Tooltip";
import util from '/@/utils';
export default {
  components: { alarmCard, taskDetail, detailDialog, SmTextTooltip },
  name: "leftSidebar",
  props: {
    taskFollowList: Array,
    leftData: Object,
    countData:Object,
  },
  data() {
    return {
      util,
      taskVisible: false,
      taskTitle: "",
      id: "",
      status: "all",
    };
  },
  methods: {
    handelOpen(item) {
      this.taskTitle = item.taskName;
      this.id = item.id;
      this.taskVisible = true;
    },
    handleCount(type) {
      this.status = type;
      this.$emit("handleCount",type)
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped>
.card-top{
  margin-bottom: 10px;
}
.card-count-score {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .score-box {
    width: 153px;
    height: 62px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url("/@/assets/images/battle-screen/score-bg.svg")
      center center no-repeat;
    &.active {
      background: rgba(128, 255, 255, 0.2);
      border: 1px solid #80ffff;
      box-sizing: border-box;
    }
    .score-count {
      font-weight: 500;
      font-size: 18px;
      color: #00ffff;
    }
    .score-name {
      font-weight: 400;
      color: #f2f2f2;
      font-size: 14px;
    }
  }
}
.cart-count {
  > div {
    background-size: 100% 100%;
    padding: 14px;
    height: 446px;
    box-sizing: border-box;
    overflow-y: scroll;
    .count-item {
      cursor: pointer;
      margin-bottom: 8px;
      .line-1 {
        display: flex;
        margin-bottom: 5px;
        .item-index {
          min-width: 24px;
          display: inline-block;
          height: 24px;
          background: rgba(128, 255, 255, 0.2);
          font-size: 13px;
          text-align: center;
          color: #57f4fd;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .item-task-type {
          border-radius: 22px !important;
          margin-left: 8px;
          color: #57f4fd;
          background: rgba(128, 255, 255, 0.2);
          border-color: rgba(128, 255, 255, 0.2);
        }
        .item-status-1 {
          border-radius: 22px !important;
          margin-left: auto;
          color: #f8d45b;
          background: rgba(248, 208, 91, 0.2);
          border: none;
        }
        .item-status-2 {
          border-radius: 22px !important;
          margin-left: auto;
          color: #19be6b;
          background: rgba(25, 190, 107, 0.2);
          border: none;
        }
        .item-title {
          padding-left: 5px;
          text-align: left;
          font-size: 14px;
          line-height: 24px;
          color: #f2f2f2;
          word-wrap: break-word;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        &.recent {
          .item-index {
            color: #f8d45b;
            background: rgba(248, 212, 91, 0.2);
          }
          .item-title {
            color: #f8d45b;
          }
        }
      }
    }
  }
}
:deep(.el-dialog) {
  width: 1000px !important;
}
</style>
