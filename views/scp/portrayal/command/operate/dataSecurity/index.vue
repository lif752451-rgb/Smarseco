<template>
  <div class="fs-page padding">
    <el-scrollbar class="panel-name-content-scrollbar" :class="'panel-name'">
      <div
        class="count_main el-scrollbar"
        :class="'access_main'"
      >
        <div>
          <statisticsCard
            :countList="countList"
            v-loading="loading">
          </statisticsCard>
          <panel-content
            :panelId="panelId">
          </panel-content>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import statisticsCard from './components/statisticsCard.vue';
import PanelContent from '/@/components/old/Visual/panelContent.vue'
import { getChartDataParam } from '/@/api/stp/visual/visual';
export default {
  name: "scp-risk-view",
  components: {
    statisticsCard,
    PanelContent,
  },
  data() {
    return {
      panelId: '202409251722124840002',
      loading: false,
      paramsList: [
        { id: "202409181747206140032", name: "业务系统"},
        { id: "20240918140737580017", name: "文件资产"},
        { id: "202409181408115190018", name: "数据库资产"},
        { id: "202409181408339290019", name: "敏感数据资产"},
        { id: "202409181409006720020", name: "数据安全告警总数"},
        { id: "202409181409356580021", name: "数据安全风险总数"},
        // { id: "202409181410505170022", name: "数据资产来源"},
        // { id: "202409181411529650023", name: "敏感数据分布"},
        // { id: "202310121626011940001", name: "风险资产TOP5"}, // 
        // { id: "202409181414229410025", name: "数据安全告警闭环情况"},
        // { id: "20231012162621970003", name: "数据安全风险闭环情况"}, // 
        // { id: "202409181415308000027", name: "数据安全风险类型占比"},
        // { id: "202409181416282310028", name: "数据安全告警趋势"},
        // { id: "20240918141754460030", name: "最新数据安全风险列表"},
        // { id: "202409181417167180029", name: "最新数据安全威胁列表"},
      ],
      // 所有数据
      dataList: [],
      countList: [
        { name: '业务系统', count: 0 },
        { name: '文件资产', count: 0 },
        { name: '数据库资产', count: 0 },
        { name: '敏感数据资产', count: 0 },
        { name: '数据安全告警总数', count: 0 },
        { name: '数据安全风险总数', count: 0 },
      ],
      tableData1: [],
      timer: null,
    };
  },
  created() {
    this.getInfo();
    this.dataRefreh();
  },
  methods: {
    dataRefreh() {
      this.timer = setInterval(() => {
        this.getInfo();
      }, 60 * 5 * 1000);
    },
    async getInfo() {
      this.loading = true;
      for (const [key, val] of this.paramsList.entries()) {
        let params = { id: val.id };
        let data = await this.reqInfo(params) || {};
        this.countList[key].count = data.resultData[0] && data.resultData[0].COUNT;
      }
      this.loading = false;
    },
    /** 请求资产信息 */
    reqInfo(params) {
      return new Promise((resolve) => {
        getChartDataParam(params).then(({ data }) => {
          resolve(data);
        });
      });
    },
  },
  beforeDestroy() {
    this.timer = null;
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
:deep(.el-col) {
  height: 100%;
}
.dark .fs-page {
  background: #f8f9fe;
}
.fs-page {
  .preview-title {
    margin-top: 2px;
    height: 48px;
    font-weight: 500;
    font-style: normal;
    font-size: 14px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    border-bottom: 1px solid #e0e6ed;
    background: #fff;
    .header-left {
      height: 100%;
      display: flex;
      align-content: center;
      .search-box {
        margin-right: 30px;
      }
    }
    .header-right {
      height: 100%;
      line-height: 48px;
      color: var(--el-color-primary);;
      cursor: pointer;
      width: 50px !important;
      flex: none !important;
      display: flex;
      align-content: center;
    }
  }
  .count_main {
    padding: 10px 0 0;
    height: calc(100% - 103px);
    &.access_main {
      padding: 0;
      height: calc(100% - 18px);
      width: 100%;
      background: #fff;
      .no_access {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .access-img {
          width: 200px;
          height: 200px;
        }
        span {
          font-size: 14px;
          color: #7f7f7f;
        }
      }
    }
  }
}
.is-active {
  background: rgb(232, 240, 252);
}
.panel-name-content-scrollbar {
  :deep(.el-scrollbar__thumb) {
    display: none;
  }
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
:deep(.panel-name .el-scrollbar__view) {
  height: 100% !important;
}
</style>
