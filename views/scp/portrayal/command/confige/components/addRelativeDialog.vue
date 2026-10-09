<template>
  <el-dialog
    v-if="relatedFlag"
    title="添加关联工单"
    :modelValue="relatedFlag"
      width="960px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancel"
    class="related-dialog"
  >
    <div class="related-content">
      <el-row class="sm-search-wrapper">
        <el-form :model="searchForm" inline label-width="80" ref="searchForm" @submit.prevent>
          <el-form-item prop="searchValue" label="关键字检索">
            <el-input
                v-model="searchForm.searchValue"
                placeholder="模糊搜索：告警ID、标题、攻击IP、受害IP/URL"
                clearable
                @keyup.enter="search"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button @click="search" type="primary">
            <el-icon><Search /></el-icon><span class="ml-5">搜索</span>
          </el-button>
          <el-button @click="resetsearchForm('searchForm')">
            <el-icon><Refresh /></el-icon><span class="ml-5">重置</span>
          </el-button>
        </el-row>
      </el-row>
      <div class="table-title">
        您已选中 <span style="color: var(--el-color-primary);">{{ ids.length }}</span> 个目标
      </div>
      <!-- 表格 -->
        <el-table
          ref="selection"  border
          :data="manageList"
          :height="tableHeight"
          :class="{'mb-10': total > 0}"
          v-loading="loading"
          empty-text="暂无数据"
          @selection-change="handleSelectionChange"
        >
          <el-table-column  type="selection" width="60" align="center" fixed="left" />
          <el-table-column
            v-for="item in headList" :key="item.key"
            :label="item.title" :prop="item.key" :show-overflow-tooltip="item.tooltip"
            :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
          >
          </el-table-column>
        </el-table>
        <!-- 表格分页 -->
       <sm-pagination
          :pager-count="5"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @paging-change="getList"
        />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
          <el-button
            type="primary"
            class="submit"
            v-preventReClick
            @click="submitForm"
            :disabled="!ids.length"
            :class="!ids.length? 'disable-button':''"
          >确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {getFallRelativeAlarmList } from '/@/api/scp/command/confige';
import SmPagination from "/@/components/Pagination";
import { ElMessage } from "element-plus";
import { setTableDefault } from '/@/utils/util.data';
export default {
  name: "dialogForm",
  components: { SmPagination },
  props: {
    relatedFlag: {
      type: Boolean,
      default: false,
    },
    relatedIds: {
      type: Array,
      default: () => [],
    },
    rowData: {
      type: Object,
      default: () =>{}
    }
  },
  data() {
    return {
      searchForm:{},
      ids:[],
      loading: false,
      total: 0,
      manageList: [
      ],
      headList: [
        {title: "告警ID", tooltip: true, key: "alarmId", width: 140},
        { title: "标题", tooltip: true, key: "title", minWidth: 100},
        { title: "攻击IP", tooltip: true, key: "attackIp", width: 130 },
        { title: "受害IP/URL", tooltip: true, key: "victimizedIp", width: 130 },
        { title: "告警来源", tooltip: true, key: "alarmSourceLabel", width: 100},
        { title: "告警时间", tooltip: true, key: "alarmTime", width: 170}
      ],
      // 表格分页参数
      queryParams: {
          pageNum: 1,
          pageSize: 20,
      },
      tableHeight: 348,
    };
  },
  watch: {
  },
  created() {
  },
  methods: {
    //提交表单
    submitForm() {
      let relatedIds = [];
      relatedIds =  this.ids.map((item) => {
        return {
          relationId: item.id,
          alarmId: item.alarmId
        }
      });
      this.cancel();
      ElMessage({ message: `去除重复项后成功添加 ${this.ids.length} 条关联工单`, type: 'success' });
      this.$emit("submitForm",relatedIds);
    },
    //关闭弹窗
    cancel() {
      // 重置
      this.refreshForm();
      this.$emit("closeView");
    },
    // 重置
    refreshForm(){
      this.searchForm.searchValue = "";
      this.$refs["searchForm"].resetFields();
    },
    search(){
      this.queryParams.pageNum = 1;
      this.getList();
    },
    //查询重置
    resetsearchForm(formName) {
      this.$refs[formName].resetFields();
      this.queryParams.pageNum = 1;
      this.getList();
    },
    //刷新表格
    refashTable() {
      this.$emit("refashTable");
    },
    // 查询列表
    getList(){
      this.loading = true;
      this.ids = [];
      let params = {
        ...this.queryParams,
        ...this.rowData,
        searchValue: this.searchForm.searchValue?this.searchForm.searchValue.trim():"",
        list : this.relatedIds
      };
      getFallRelativeAlarmList(params).then((response) => {
          const { data = {}} = response;
          const { list = []} = data;
          this.manageList = setTableDefault(list, this.headList);
          this.total = response.data.total;
          this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
    },

  },
  mounted() {
    this.getList();
  }
};
</script>
<style lang="less" scoped>
.mb-10{
  margin-bottom: 10px;
}
.text-blue{
  color: var(--el-color-primary);
}
:deep(.el-dialog__body){
    padding: 0px 20px 10px 20px;
}
:deep(.el-dialog__footer){
  padding: 10px 20px;
  .el-button{
    border-radius: 0;
    font-size: 14px;
    &.submit{
      background: var(--el-color-primary);
      color: #fff;
    }
    &.disable-button {
      background: #f2f2f2;
      color: #7f7f7f;
      border: 1px solid #ccc;
      cursor: not-allowed;
    }
  }
}
.query-content{
  margin-bottom: 0;
  .el-input__inner,.el-button{
    border-radius: 0;
  }
  .search-item.search {
    width: calc(100% - 180px) !important;
    :deep(.el-form-item__content){
      width: calc(100% - 92px);
      display: inline-block;
    }
    :deep(.el-input__inner){
      border-radius: 0;
    }
  }
}
.table-title{
  height: 40px;
  line-height: 40px;
}
.btn-group {
    width: 172px !important;
    text-align: right;
}
</style>

