<template>
  <div>
    <el-dialog
        :model-value="visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        :show-close="false"
        custom-class="szcScreen_new_dialog_common"
        width="800px">
      <template #title>
        <div class="dialog_title">{{ title }}</div>
      </template>
      <el-image
        class="close_btn"
        @click="handleClose"
        :src="util.getAssetsImages('szc_screen/dialog_close.png')"
      />
      <div class="dialog-wrap">
        <el-row class="describe" type="flex">
          <p>风险概况：<span :class="setRiskClass(color)">{{ levelLabel }}</span></p>
          <p>威胁告警总数：<span :class="setRiskClass(color)">{{ alarmCount }}</span></p>
        </el-row>
        <el-tree
            v-loading="loading"
            element-loading-background="rgba(128, 255, 255, 0.1)"
            node-key="id"
            :data="treeList"
            :props="defaultProps"
            @node-click="handleNodeClick">
          <template #default="{ node, data }">
            <el-row class="node-wrap" type="flex" justify="space-between">
              <span>
                <el-tag :class="`tag-bg${ data.type }`">{{ convertType(data.type) }}</el-tag>
                {{ data.name }}
              </span>
              <span :class="setRiskClass(data.level)">
                <img width="12" style="transform: translate(-2px, 1px)" :src="util.getAssetsImages(`szc_screen_new/${ setRiskClass(data.color) }.png`)"/>
                {{ data.levelLabel }}
              </span>
            </el-row>
          </template>
        </el-tree>
      </div>
      <div class="flex-box bottom-left"></div>
      <div class="flex-box bottom-right"></div>
    </el-dialog>
  </div>
</template>

<script>
import { reqAreaTree } from '/@/api/scp/szcScreen';
import util from '/@/utils';
export default {
  name: 'areaDetail',
  props: ['visible', 'title'],
  data() {
    return {
      util,
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      alarmCount: '',
      levelLabel: '',
      color: '',
      loading: false
    }
  },
  computed: {
    convertType() {
      const typeMap = new Map([
          ['0', '区域'], ['1', '应用']
      ])
      return (type) => typeMap.get(type)
    },
    setRiskClass() {
      const iconMap = new Map([
        ['4', 'risk-safe'],
        ['3', 'risk-low'],
        ['2', 'risk-medium'],
        ['1', 'risk-high']
      ])
      return (color) => iconMap.get(color)
    }
  },
  methods: {
    async getAreaTree(topId, startTime, endTime) {
      const params = {
        topId, startTime, endTime,
        pageSize: 99999, pageNum: 1
      };
      this.loading = true
      try {
        const {
          data: {
            alarmCount,
            levelLabel,
            color,
            treeList
          }
        } = await reqAreaTree(params);
        this.alarmCount = alarmCount
        this.levelLabel = levelLabel
        this.color = color
        this.treeList = treeList
        this.loading = false
      } catch (e) {
        console.warn('错误信息:' + e)
      }
    },
    handleNodeClick(data) {
      this.$emit('openAppDetail', data.id, data.fullPath)
    },
    handleClose() {
      this.alarmCount = ''
      this.levelLabel = ''
      this.treeList = []
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@color: rgb(0, 255, 255);
span.risk-safe { color: @color }
span.risk-low { color: rgb(255, 255, 0) }
span.risk-medium { color: rgb(255, 165, 0) }
span.risk-high { color: rgb(254, 0, 0) }
:deep(.el-dialog){
  .dialog-wrap {
    height: 460px; border: solid 1px @color;
    padding: 10px; background-color: rgb(4, 35, 68);
    .describe {
      font-size: 14px; color: #FFFFFF;
      p {
        margin-right: 40px;
        span { font-size: 18px }
      }
    }
    .el-tree {
      margin-top: 20px;
      background-color: transparent;
      overflow-y: auto;
      height: 400px;
      .el-tree-node__content {
        height: 40px;
        line-height: 40px;
        background-color: transparent;
      }
      .node-wrap {
        width: 100%;
        color: #FFFFFF;
        .el-tag {
          margin-right: 6px;
          border: none;
          padding: 0 10px;
          border-radius: 50px!important;
        }
        .tag-bg0 {
          color: #FFC836;
          background-color: rgba(255, 200, 54, 0.3);
        }
        .tag-bg1 {
          color: @color;
          background-color: rgba(128, 255, 255, 0.3);
        }
      }
      .el-tree-node__content:hover {
        background-color: rgba(128, 255, 255, 0.1);
      }
    }
    ::-webkit-scrollbar {
      height: 10px;
      width: 1px;
      background-color: rgba(128, 255, 255, 0.1);
    }
  }
}
</style>
