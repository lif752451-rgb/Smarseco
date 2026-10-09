<template>
  <el-dialog
    v-if="detailOpen"
    :model-value="detailOpen"
    width="900px"
    custom-class="safe_content"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :modal-append-to-body="false"
  >
    <img
      class="close_btn"
      @click="handleClose"
      :src="util.getAssetsImages('szc_screen/dialog_close.png')"
    />
    <el-scrollbar class="safety-score-content">
      <div class="score-text">
        本模型参考了GB/T 20984-2007
        标准中，计算风险值所需的三个维度（即资产重要程度、资产风险、资产威胁），并结合实际安全建设经验，新增了资产安全防护维度进行评分。
      </div>
      <div class="score-text">本模型适用于服务器资产，暂不适用于终端资产。</div>
      <div class="formula-text">
        资产总评分 = 100 - {100 - [资产管理评分 + 风险管理评分 + 威胁管理评分 +
        安全防护评分 ] } * 资产重要程度系数。最高分为100分，最低分为0分。
      </div>
      <el-row class="formula">
        <el-col :span="6">90&lt;=X&lt;=100</el-col>
        <el-col :span="6">70&lt;=X&lt;90</el-col>
        <el-col :span="6">50&lt;=X&lt;70</el-col>
        <el-col :span="6">0&lt;=X&lt;50</el-col>
        <el-col :span="6">健康</el-col>
        <el-col :span="6">低风险</el-col>
        <el-col :span="6">中风险</el-col>
        <el-col :span="6">高风险</el-col>
      </el-row>
      <div class="title">
        <span class="line"></span>资产管理评分（总分20分）
      </div>
      <div class="score-text">
        该资产存在所属单位和所属责任人则得满分，缺一项扣10分，均不存在则得0分。
      </div>

      <div class="title">
        <span class="line"></span>风险管理评分（总分30分）
      </div>
      <div class="score-text">
        1.
        该资产存在未修复漏洞，按漏洞个数、漏洞等级扣分，多个漏洞重复扣分，低危扣分上限5分，中危扣分上限10分，高危/危急扣分无上限，扣完风险管理总分为止。
      </div>
      <el-table
        ref="selection"   class="common-ivu-table"
        :data="vulnLevelDataList"
        empty-text="暂无数据"
      >
        <el-table-column
          v-for="item in vulnLevelHeadList" :key="item.key"
          :label="item.title" :prop="item.key" :show-overflow-tooltip="item.tooltip"
          :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
        >
        </el-table-column>
      </el-table>
      <div class="score-text">
        2.
        该资产存在未闭环风险，按风险个数、风险等级扣分，多个风险重复扣分，扣完风险管理总分为止。
      </div>
      <el-table
        ref="selection"   class="common-ivu-table"
        :data="assetLevelDataList"
        empty-text="暂无数据"
      >
        <el-table-column
          v-for="item in assetLevelHeadList" :key="item.key"
          :label="item.title" :prop="item.key" :show-overflow-tooltip="item.tooltip"
          :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
        >
        </el-table-column>
      </el-table>
      <div class="title">
        <span class="line"></span>威胁管理评分（总分30分）
      </div>
      <div class="score-text">
        该资产存在处置中告警，按 告警等级系数 * 攻击结果系数
        扣分，多条告警取扣分最高值，扣完威胁管理评分为止。
      </div>
      <el-table
        ref="selection"   class="common-ivu-table"
        :data="alarmAttackResultDataList"
        empty-text="暂无数据"
      >
        <el-table-column
          v-for="item in alarmAttackResultHeadList" :key="item.key"
          :label="item.title" :prop="item.key" :show-overflow-tooltip="item.tooltip"
          :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
        >
        </el-table-column>
      </el-table>
      <el-table
        ref="selection"   class="common-ivu-table"
        :data="alarmLevelDataList"
        empty-text="暂无数据"
      >
        <el-table-column
          v-for="item in alarmLevelHeadList" :key="item.key"
          :label="item.title" :prop="item.key" :show-overflow-tooltip="item.tooltip"
          :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
        >
        </el-table-column>
      </el-table>
      <div class="title">
        <span class="line"></span>安全防护评分（总分20分）
      </div>
      <div class="score-text">
        该资产已安装主机防护软件则得满分，未安装则得0分。
      </div>

      <div class="title"><span class="line"></span>资产重要程度系数</div>
      <el-table
        ref="selection"   class="common-ivu-table"
        :data="assetImportantDataList"
        empty-text="暂无数据"
      >
        <el-table-column
          v-for="item in assetImportantHeadList" :key="item.key"
          :label="item.title" :prop="item.key" :show-overflow-tooltip="item.tooltip"
          :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
        >
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
import util from '/@/utils';
export default {
  props: {
    detailOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      util,
      vulnLevelHeadList: [
        {
          title: "漏洞等级",
          key: "field1",
        },
        {
          title: "低危",
          key: "field2",
        },
        {
          title: "中危",
          key: "field3",
        },
        {
          title: "高危",
          key: "field4",
        },
        {
          title: "危急",
          key: "field5",
        },
      ],
      vulnLevelDataList: [
        {
          field1: "漏洞分值",
          field2: 1,
          field3: 2,
          field4: 3,
          field5: 5,
        },
      ],

      assetLevelHeadList: [
        {
          title: "风险等级",
          key: "field1",
        },
        {
          title: "低风险",
          key: "field2",
        },
        {
          title: "中风险",
          key: "field3",
        },
        {
          title: "高风险",
          key: "field4",
        },
      ],
      assetLevelDataList: [
        {
          field1: "风险分值",
          field2: 5,
          field3: 10,
          field4: 15,
        },
      ],

      alarmAttackResultHeadList: [
        {
          title: "攻击结果",
          key: "field1",
        },
        {
          title: "已失陷",
          key: "field2",
        },
        {
          title: "疑似失陷",
          key: "field3",
        },
        {
          title: "攻击成功",
          key: "field4",
        },
        {
          title: "疑似成功",
          key: "field5",
        },
        {
          title: "企图",
          key: "field6",
        },
        {
          title: "失败",
          key: "field7",
        },
      ],
      alarmAttackResultDataList: [
        {
          field1: "扣分系数",
          field2: 2,
          field3: 2,
          field4: 2,
          field5: 2,
          field6: 1,
          field7: 0.5,
        },
      ],

      alarmLevelHeadList: [
        {
          title: "告警等级",
          key: "field1",
        },
        {
          title: "一级",
          key: "field2",
        },
        {
          title: "二级",
          key: "field3",
        },
        {
          title: "三级",
          key: "field4",
        },
        {
          title: "四级",
          key: "field5",
        },
      ],
      alarmLevelDataList: [
        {
          field1: "告警分值",
          field2: 20,
          field3: 10,
          field4: 7.5,
          field5: 5,
        },
      ],

      assetImportantHeadList: [
        {
          title: " ",
          key: "field1",
        },
        {
          title: "一般资产",
          key: "field2",
        },
        {
          title: "重要资产",
          key: "field3",
        },
        {
          title: "核心资产",
          key: "field4",
        },
      ],
      assetImportantDataList: [
        {
          field1: "非互联网资产",
          field2: 1,
          field3: 1.2,
          field4: 1.4,
        },
        {
          field1: "互联网资产",
          field2: 1.2,
          field3: 1.4,
          field4: 1.6,
        },
      ],
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  methods: {
    handleClose() {
      this.$emit("closeDetail");
    },
  },
};
</script>

<style lang="less" scoped>
.safety-score-content {
  height: 660px;
  font-size: 14px;
  color: #fff;
  :deep(.el-scrollbar__thumb) {
    display: none !important;
  }
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
  .score-text {
    line-height: 26px;
  }
  .formula-text {
    margin: 8px 0;
    padding: 8px 8px 8px 8px;
    width: 100%;
    height: 56px;
    font-size: 14px;
    color: #0ff;
    background-color: rgba(128, 255, 255, 0.0980392156862745);
    border-radius: 2px;
  }
  .formula {
    text-align: center;
    line-height: 30px;
  }
  .title {
    font-weight: 500;
    font-size: 16px;
    margin: 8px 0;
    color: #80ffff;
    .line {
      width: 4px;
      height: 12px;
      background-color: #80ffff;
      margin: 0 10px 0 0;
      display: inline-block;
    }
  }
}
.common-ivu-table{
  background: none;
  width: 100%;
  height: 100%;
  margin: 8px 0;
  :deep(.el-table__inner-wrapper::before){
    width: 0;
    height: 0;
  }
  :deep(.el-table__header){
    thead{
      th{
        background: none;
        padding: 2px 0;
        color: #fff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
      tr{
        background: none;
      }
    }
  }
  :deep(.el-table__body) {
    tr,td {
      color: #80ffff;
      background: rgba(128, 255, 255, 0.0980392156862745);
      border-bottom: none !important;
    }
  }
}
</style>
<style lang="less">
.safe_content{
  background: url("/@/assets/images/szc_screen/dialog.png") center
    center no-repeat;
  background-size: 100% 100%;
  color: #fff;
  position: relative;
  .close_btn {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
  .el-dialog__header{
    background: transparent;
    height: 80px;
  }
  .el-dialog__body{
    padding: 0 24px 16px;
  }
}
</style>
