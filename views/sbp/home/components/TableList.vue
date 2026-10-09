<template>
  <el-table
      border
      :data="tableData"
      empty-text="无数据"
      @filter-change="handleFilterChange"
      @selection-change="handleSelectionChange"
      @sort-change='handleSortChange'
      ref="tableRef"
  >
    <el-table-column  v-if="config.selection" type="selection" width="40" align="center" fixed class="tableSelection" />
    <el-table-column v-if="config.index" type="index" width="80" label="序号" class="tableIndex" :index="indexMethod" />
    <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        :prop="column.key"
        :label="column.label"
        :align="column.align ? column.align : 'left'"
        :width="column.width"
        :fixed="column.fixed"
        :sortable="column.sortable"
        show-overflow-tooltip
    >
      <template v-if="column.slot === 'workStatus'" #default="{ row }">
        <span :style="{'background': getStatusColor(row.workStatus)}" class="point"></span>
        <span class="font-14 ml-5">{{ row.workStatus }}</span>
      </template>
      <template v-if="column.slot === 'title'" #default="{ row, index }">
        <el-link @click="handleClickLink(row)" type="primary">{{ row.title }}</el-link>
      </template>
      <template v-if="column.slot === 'levelLabel'" #default="{ row, index }">
        <span :class="['alarm-normalcy', 'dot-icon', 'dot-alarm-level' + (row.level ? row.level : '')]">{{row.levelLabel}}</span>
      </template>
      <template v-if="column.slot === 'attackResultLabel'" #default="{ row }">
        <span :class="['alarm-normalcy', 'dot-icon', 'dot-attack-result' + (row.attackResult ? row.attackResult : '')]">{{row.attackResultLabel}}</span>
      </template>
    </el-table-column>
    <!-- 操作 -->
    <el-table-column v-if="isShowHandler" label="操作" :width="handleConfig.handleWidth" :fixed="handleConfig.fixed">
      <template #default="scope">
        <el-button  v-if="handleConfig.hasView" type="primary" text link @click="handleView(scope.row)">查看</el-button>
        <el-button  v-if="handleConfig.hasEdit" type="primary" text link @click="handleUpdate(scope.row)">修改</el-button>
        <el-button  v-if="handleConfig.hasDelete" type="primary" text link @click="handleDelete(scope.row)">删除</el-button>
        <el-button  v-if="handleConfig.hasOther" type="primary" text link @click="handleOther(scope.row)">{{handleConfig.otherName}}</el-button>
      </template>
    </el-table-column>
    <div slot="empty">
      <i class="table-empty-default" v-if="config.defaultImg" />
      {{config.noDataMsg}}
    </div>
  </el-table>
</template>
<script>
export default {
  name: "TableList",
  components: {},
  props: {
    formType: '',
    customClass: {
      type: String,
      default: '',
    },
    tableData: {
      type: Array,
      default: () => ([]),
    },
    columns: {
      type: Array,
      default: () => ([]),
    },
    config: {
      type: Object,
      default: () => {
        return {
          index: false,                 //排序
          defaultImg: false,
          fixedTableHeight: 'auto',
          tableHeight: 'auto',          //最大高度
          border: true,                 //边框显示
          // center: 'left',               //对其方式
          selection: false,             //可选显示
          noDataMsg: '暂无数据',         //无数据显示文字
          selectionChange: () => {},    //表格选择函数
          filtersChange: () => {},      //表格筛选属性
          sortChange:() => {},
        }
      }
    },
    handleConfig: {
      type: Object,
      default: () => {
        return {
          handleWidth: 'auto',        //操作列显示时列宽
          handleShow: false,          //操作列显示
          hasView: false,             //操作列查看按钮
          hasEdit: false,             //操作列修改按钮
          hasDelete: false,           //操作列删除按钮
          hasOther: false,            //其他按钮
          otherName:'',               //其他按钮名称
          otherIcon:'',               //其他按钮图标
          fixed: false,               //操作列浮动 {left, right}
          handleOther: () => {},      //其他操作函数
          handleView: () => {},       //操作列查看函数
          handleUpdate: () => {},     //操作列修改函数
          handleDelete: () => {},     //操作列删除函数
        }
      }
    },
    //当前页数
    pageNum: {
      type: Number,
      default: 1,
    },
    //分页数量
    pageSize: {
      type: Number,
      default: 20,
    },
  },
  computed: {
    isShowHandler() {
      const { handleShow, hasView, hasEdit, hasDelete, hasOther } = this.handleConfig
      return handleShow && ( hasView || hasEdit || hasDelete || hasOther)
    }
  },
  watch: {
    handleConfig(curVal, oldVal) {
      this.handleConfig = curVal
    }
  },
  methods: {
    switchChange($event, row){
      this.$emit('getRadioStatus',$event, row)
    },
    //工单状态加小圆点
    getStatusColor(status){
      const map = new Map([
        ["研判", "orange"], ["处置", "#267ee5"], ["审核", "#8074ff"],["归档", "#19be6b"],["无需处置", "#808695"],
        ["待审核", "#8074ff"],["待处置", "#267EE5"],["待分配", "#808695"], ["复查中", "#267ee5"],["已归档", "#19be6b"], ["待归档", "#19be6b"],
        ["残余风险", "#FF6347"], ["整改验证", "#8074FF"], ["部门审核", "#FFA500"], ["已关闭", "#19BE6B"], ["已审核", "#31ab50"], ["未响应", "#808695"],
        ["待提交", "#267EE5"],  ["待反馈", "#808695"], ["已完成", "#19BE6B"],["审核通过", "#19BE6B"],["待复核", "#FF854F"]
      ]);
      return  map.get(status) ;
    },
    //表格查看
    handleView (row){
      if(!this.handleConfig.handleView){
        console.warn('[CommonTable] 未定义函数-handleView: function(){}');
      }else{
        this.handleConfig.handleView(row);
      }
    },
    //表格修改
    handleUpdate (row){
      if(!this.handleConfig.handleUpdate){
        console.warn('[CommonTable] 未定义函数-handleUpdate: function (){}');
      }else{
        this.handleConfig.handleUpdate(row);
      }
    },
    //表格删除
    handleDelete (row){
      if(!this.handleConfig.handleDelete){
        console.warn('[CommonTable] 未定义函数-handleDelete: function (){}');
      }else{
        this.handleConfig.handleDelete(row);
      }
    },
    handleOther (row){
      if(!this.handleConfig.handleOther){
        console.warn('[CommonTable] 未定义函数-handleOther: function (){}');
      }else{
        this.handleConfig.handleOther(row);
      }
    },

    // 多选框选中数据
    handleSelectionChange(selections) {
      if(this.config.selectionChange){
        this.config.selectionChange(selections);
      }else{
        console.warn('[CommonTable] 未定义函数-selectionChange: function (){}');
      }
    },
    //排序问题
     handleSortChange(column){
        if(this.config.sortChange){
            this.config.sortChange(column);
        }else{
            console.warn('[CommonTable] 未定义函数-selectionChange: function (){}');
        }
    },
    //列表序号
    indexMethod(index) {
      return (this.pageNum - 1) * this.pageSize + index + 1;
    },
    // 表格单属性刷选
    handleFilterChange(filter) {
      if(this.config.filtersChange){
        this.config.filtersChange(filter);
      }else{
        console.warn('[CommonTable] 未定义函数-filtersChange: function (){}');
      }
    },
    //表格 筛选
    filterTag(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //标题的跳转
    handleClickLink(row) {
      this.$emit('linkToPage', row)
    },
    // 更新表头值
    refreshColumns() {
      this.$nextTick(()=>{
        this.$refs.tableRef.doLayout()
      })
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../../../style/alarm-normalcy.less";

.point {
  border-radius: 50%;
  display: inline-block;
  bottom: 2px;
  right: 3px;
  position: relative;
  width: 6px;
  height: 6px;
}
</style>
