<template>
  <el-dialog
      :model-value="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      width="800px"
      :show-close="false"
      custom-class="szcScreen_new_dialog_common">
    <template v-slot:title>
      <div class="dialog_title">{{ title }}</div>
    </template>
    <el-image
        class="close_btn"
        @click="handleClose"
        :src="util.getAssetsImages('szc_screen/dialog_close.png')"
    />
    <div class="dialog-wrap">
      <el-tabs v-model="activeTab" class="drawer-tabs">
        <el-tab-pane label="威胁告警" name="alarm">
          <el-table :data="tableData" height="340" stripe v-loading="loading"
                    element-loading-background="rgba(128, 255, 255, 0.1)"
                    @row-click="openAlarmMan">
            <el-table-column label="告警ID" prop="alarmId" width="120" show-overflow-tooltip/>
            <el-table-column label="告警标题" prop="title" width="200" show-overflow-tooltip/>
            <el-table-column label="攻击IP" prop="attackIp" width="130" show-overflow-tooltip/>
            <el-table-column label="受害IP/URL" prop="victimizedIp" width="130" show-overflow-tooltip/>
            <el-table-column label="告警级别" width="90">
              <template #default="{ row }">
                <el-tag :class="`level${ row.level }`">{{ row.levelLabel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="攻击结果" width="100">
              <template #default="{ row }">
                <el-tag :class="`attackResult${ row.attackResult }`">{{ row.attackResultLabel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="攻击手段" prop="attackMeansLabel" width="130" show-overflow-tooltip/>
            <el-table-column label="提交时间" prop="createTime" width="160"/>
            <el-table-column label="工单状态" prop="orderStatus" width="80"/>
          </el-table>
          <sm-pagination
              popperClass="alarm-table-paging"
              :total="total"
              v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize"
              @paging-change="getAlarmList"
          />
        </el-tab-pane>
        <el-tab-pane label="关联信息" name="info">
          <div class="relevance-wrap">
            <div class="relevance-item" v-for="(data, key) in relateData" :key="key">
              <h6>{{ convertTitle(key) }}</h6>
              <sm-tag-tooltip v-if="data && data.length" :model-value="data"/>
              <span class="tip" v-else>暂未添加{{ convertTitle(key) }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="flex-box bottom-left"></div>
    <div class="flex-box bottom-right"></div>
  </el-dialog>
</template>

<script>
import { isJurisdictionOrder, reqRelatesInfo, reqTopAlarmList } from '/@/api/scp/szcScreen'
import { setTableDefault } from  '/@/utils/util.data';
import { SmTagTooltip } from "/@/components/Tooltip";
import SmPagination from "/@/components/Pagination";
import {  ElMessage } from "element-plus";
import util from '/@/utils';
export default {
  name: 'appDetail',
  props: ['visible', 'title',],
  data () {
    return {
      util,
      tableData: [],
      total: 0,
      activeTab: 'alarm',
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        topId: '',
        endTime: '',
        startTime: ''
      },
      relateData: {
        relateAppSys: [],
        relateSegment: [],
        relateAsset: [],
      },
    }
  },
  components: {
    SmTagTooltip,
    SmPagination
  },
  computed: {
    convertTitle() {
      const titleMap = new Map([
        ['relateAsset', '关联资产'],
        ['relateSegment', '关联网段'],
        ['relateAppSys', '关联应用系统']
      ])
      return (title) => titleMap.get(title)
    },
  },
  methods: {
    init(id, dateStart, dateEnd) {
      this.queryParams.topId = id
      this.queryParams.startTime = dateStart
      this.queryParams.endTime = dateEnd
      this.getRelatesInfo()
      this.getAlarmList()
    },
    /** 获取关联信息 */
    async getRelatesInfo() {
      const { data } = await reqRelatesInfo(this.queryParams.topId);
      for (const key in this.relateData) {
        if (Object.hasOwn(data, key)) {
          this.relateData[key] = (data[key] && data[key].split(',')) || []
        }
      }
    },
    /** 获取威胁告警列表 */
    async getAlarmList() {
      const params = { ...this.queryParams };
      this.loading = true
      const { data: { list, total } } = await reqTopAlarmList(params)
      const keys = ['attackMeansLabel', 'title', 'attackIp', 'victimizedIp']
      this.tableData = setTableDefault(list, ...keys)
      this.total = total
      this.loading = false
    },
    openAlarmMan({ id, businessKey }) {
      isJurisdictionOrder(businessKey).then((res) => {
        if (res.code === 200) {
          const routerPath = "/stp/menaceManege";
          let params = { id };
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
    changesUrl(obj) {
      var arr = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p)) {
          arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return arr.join("&");
    },
    handleClose() {
      this.activeTab = 'alarm'
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 20
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@color: rgb(128, 255, 255);
@bgc: rgba(128, 255, 255, 0.1);
:deep(.el-dialog){
  margin-top: 10vh!important;
}
.dialog-wrap {
  height: 460px; padding: 10px;
  background-color: rgb(4, 35, 68);
  border: solid 1px @color;
}
:deep(.drawer-tabs) {
  .el-tabs__item {
    color: #FFFFFF;
  }
  .el-tabs__item.is-active {
    color: @color;
  }
  .el-tabs__active-bar {
    background-color: transparent;
    background-image: linear-gradient(to left, rgba(128, 255, 255, 0), rgba(128, 255, 255, 1), rgba(128, 255, 255, 0));
  }
  .el-tabs__nav-wrap::after {
    background: @bgc;
    height: 1px;
  }
}
:deep(.el-table) {
  background: transparent;
  height: 330px;
  .el-table__inner-wrapper::before{
    height: 0px;
  }
  .el-table__header-wrapper {
    background-color: transparent;
    border-bottom: 1px solid rgba(128,255,255,.4)
  }
  th, td { border-bottom-color: @bgc }
  th, tr { background: transparent!important; color: @color }
  td { color: #BDDBFF }
  .el-table__header { th { font-weight: normal; border:none } }
  .el-table__row:hover > td { background-color: @bgc !important; }
  .el-table__row--striped > td { background-color: rgb(7, 55, 86)!important; }
  .el-tag {
    line-height: 18px !important;
    padding: 2px 8px;
    border-radius: 12px !important;
    color: #f2f2f2;
  }
  .level4 {
    border: 1px solid rgba(161, 213, 242, 0.8);
    background: rgba(161, 213, 242, 0.2);
  }
  .level3 {
    border: 1px solid rgba(194, 128, 255, 0.8);
    background: rgba(194, 128, 255, 0.2);
  }
  .level2 {
    border: 1px solid rgba(255, 200, 54, 0.8);
    background: rgba(255, 200, 54, 0.2);
  }
  .level1 {
    border: 1px solid rgba(207, 19, 34, 0.8);
    background: rgba(207, 19, 34, 0.2);
  }
  .attackResult0 {
    border: 1px solid rgba(194, 128, 255, 0.8);
    background: rgba(194, 128, 255, 0.2);
  }
  .attackResult1 {
    border: 1px solid rgba(255, 200, 54, 0.8);
    background: rgba(255, 200, 54, 0.2);
  }
  .attackResult2 {
    border: 1px solid rgba(237, 64, 20, 0.8);
    background: rgba(237, 64, 20, 0.2);
  }
  .attackResult3 {
    border: 1px solid rgba(161, 213, 242, 0.8);
    background: rgba(161, 213, 242, 0.2);
  }
  .attackResult4 {
    border: 1px solid rgba(207, 19, 34, 0.8);
    background: rgba(207, 19, 34, 0.2);
  }
  .attackResult5 {
    border: 1px solid rgba(255, 99, 71, 0.8);
    background: rgba(255, 99, 71, 0.2);
  }
  .el-table__body-wrapper {
    background-color: transparent;
    min-height: 267px;
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(128, 255, 255, 1);
      border-radius: 3px;
    }
  }
  &::-webkit-scrollbar {
    height: 10px; width: 1px; background: @bgc;
  }
  &::before { background-color: transparent }
}
:deep(.pagination-container-wrap){
  background-color: transparent !important;
  .el-pagination{
    background-color: transparent;
    justify-content: flex-end;
    &.is-background{
      .el-pager li:not(.disabled):hover{
        color: #80ffff;
      }
      .el-pager li:not(.disabled).active{
        background-color: rgba(128, 255, 255, 0.21)!important;
        color: #80ffff;
      }
    }
    .el-pagination__total,.el-pagination__jump{
      color: #fff;
    }
    .el-pager li{
      background-color: rgba(128, 255, 255, 0.09);
      color: #fff;
    }
    .btn-prev,.btn-next{
      background-color: rgba(128, 255, 255, 0.09);
    }
    .el-input__inner,.el-input__wrapper{
      background-color: rgba(128, 255, 255, 0.09)!important;
      color: #fff;
      border-color: #80ffff !important;
    }
    .el-input__suffix{
      background-color: rgba(128, 255, 255, 0.09)!important;
    }
    .el-input__wrapper{
      padding: 0;
    }
    .el-select__caret,.el-icon{
      color: #80ffff;
    }
    .el-input__suffix-inner>:first-child{
      margin: 0 8px;
    }
  }

  }
  .relevance-wrap {
    overflow-y: auto; height: 380px;
    .relevance-item {
      padding: 0 0 0 14px; position: relative; color: #FFFFFF;
      margin-bottom: 20px;
      &:before {
        content: '';
        width: 4px; height: 15px;
        background: #FFFFFF;
        position: absolute;
        left: 0; top: 3px;
      }
      h6 { font-size: 14px; margin-bottom: 10px }
      .sm-tag-wrap {
        :deep(.el-tag) {
          background-color: transparent !important;
          border: solid 1px @color !important;;
          color: @color !important;;
        }
      }
      .tip { color: @color }
    }
    &::-webkit-scrollbar {
      height: 10px; width: 1px; background: @bgc;
    }
  }

</style>
<style lang="less">
.alarm-table-paging {
  border: none;
  background: rgba(11, 32, 65, 1) !important;
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: transparent;
  }
  .el-select-dropdown__item {
    color: #EEEEEE;
  }
  .el-select-dropdown__item.selected {
    color: rgba(128, 255, 255, 0.8);
  }
}
</style>
