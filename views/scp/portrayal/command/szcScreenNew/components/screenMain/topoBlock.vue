<template>
  <el-popover
      popper-class="topology-popover"
      placement="bottom-start"
      width="200"
      :teleported="false"
      :show-arrow="false"
      trigger="hover">
    <div ref="popContent" class="popper-content">
      <div class="alarm-cont">
        <p>{{ item.fullPath }}</p>
        <p>关联告警数：{{ item.alarmCount }}</p>
      </div>
      <div :class="`risk-box ${ setSvgIcon(item.color) }`">
        <img width="16" :src="util.getAssetsImages(`szc_screen_new/${ setSvgIcon(item.color) }.png`)"/>
        {{ item.levelLabel }}
      </div>
    </div>
    <template #reference>
      <div ref="topoImgRef" class="image-wrap" :style="styles">
        <el-tooltip
            :visible="checked"
            popper-class="topology-tooltip"
            effect="light"
            :append-to="$refs.topoImgRef"
            :teleported="false"
            :content="item.name"
            :show-arrow="false"
            :offset="0"
            placement="top">
          <el-image
              ref="image"
              :src="item.iconUrl"
              :key="item.id"
              @click="$emit('openAppDetail', item.id, item.fullPath)"
          />
        </el-tooltip>
      </div>
    </template>
  </el-popover>
</template>

<script>
import util from '/@/utils';
export default {
  name: 'topoBlock',
  props: ['item', 'styles', 'checked'],
  computed: {
    setSvgIcon() {
      const iconMap = new Map([
        ['4', 'risk-safe'],
        ['3', 'risk-low'],
        ['2', 'risk-medium'],
        ['1', 'risk-high']
      ])
      return (level) => iconMap.get(level)
    },
  },
  data() {
    return {
      util
    }
  }
}
</script>

<style scoped lang="less">
.image-wrap {
  width: 48px;
  position: absolute;
}
</style>
<style lang="less">
.topology-tooltip {
  background-color: rgba(16, 6, 123, 0.6) !important;
  border: solid 1px rgba(2, 167, 240, 0.4);
  padding: 5px !important;
  z-index: 999 !important;
  white-space: nowrap;
  color: #ffffff;
  span:first-child {
    min-height: 0;
    font-size: 11px;
    bottom: 10px;
  }
}
.topology-popover {
  min-width: 300px !important;
  color: #FFFFFF !important;
  padding: 12px 0;
  position: relative;
  background: rgb(1, 5, 23) !important;
  border-image: linear-gradient(to top, rgba(128, 255, 255, 0.1), rgba(128, 255, 255, 0.5)) 1;
  .el-popover__title {
    color: #FFFFFF;
  }
  .popper-content {
    text-indent: 10px;
    .alarm-cont {
      p {
        width: calc(100% - 60px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow:ellipsis;
      }
      p:first-child {
        font-size: 14px;
        color: #F2F2F2;
      }
      p:last-child {
        margin-top: 6px;
        font-size: 12px;
        color: #D7D7D7;
      }
    }
    .risk-box {
      border-right: solid 1px rgb(0, 255, 255);
      text-align: right;
      position: absolute;
      line-height: 34px;
      top: 10px;
      width: calc(100% - 12px);
      padding-right: 5px;
      img { transform: translate(-2px, 3px) }
    }
    .risk-safe {
      color: rgb(0, 255, 255);
      background-image: linear-gradient(to right, rgba(0, 255, 255, 0), rgba(0, 255, 255, 0.3));
    }
    .risk-low {
      color: rgb(255, 255, 0);
      background-image: linear-gradient(to right, rgba(255, 255, 0, 0), rgba(255, 255, 0, 0.3));
    }
    .risk-medium {
      color: #FFA500;
      background-image: linear-gradient(to right, rgba(255, 165, 0, 0), rgba(255, 165, 0, 0.3));
    }
    .risk-high {
      color: #FE0000;
      background-image: linear-gradient(to right, rgba(254, 0, 0, 0), rgba(254, 0, 0, 0.3));
    }
  }
}
</style>
