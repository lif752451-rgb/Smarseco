<template>
  <div class="task-detail">
    <sm-desc-collapse title="任务信息" :data="baseInfo">
    </sm-desc-collapse>
    <sm-basic-collapse title="审批记录">
      <sm-timeline :model-value="codeRecords" />
    </sm-basic-collapse>
  </div>
</template>
<script>
import lodash from "lodash-es";
import { SmDescCollapse, SmBasicCollapse } from "/@/components/Collapse";
import SmTimeline from "/@/components/Timeline";
import { BASE_INFO, RECORD_INFO } from "./constant";
import { getDetail } from "/@/api/scp/battleScreen";
export default {
  components: {
    SmDescCollapse,
    SmBasicCollapse,
    SmTimeline,
  },
  props: {
    id: {
      type: [Number, String],
    },
  },
  data() {
    return {
      data: {},
      baseInfo: [],
      codeRecords: [], //审批记录
      taskLevelMap: new Map([["紧急", "5"], ["中", "2"],["高", "1"],["低", "4"]]),
      statusMap: new Map([["待反馈", "2"], ["待审核", "4"], ["已完成", "8"]]),
    };
  },
  created() {
    this.init();
  },
  methods: {
    //   查看任务审批记录
    generatorRecords(data) {
      if (data.length) {
        this.codeRecords = data.map((item) => {
          const infos = lodash.find(RECORD_INFO, {
            operationType: item.dealType,
          });
          const content = infos && this.generatorContent(infos.labels, item);
          return {
            id: item.id,
            name: item.dealType,
            time: item.createTime,
            user: item.dealUser,
            content: content,
          };
        });
      }
    },
    // label是content文件，data是data中item数据
    generatorContent(labels = [], data = {}) {
      return (
        labels.length &&
        labels.map((label) => {
          const content = {
            span: label.span || 3,
            label: label.name || "-",
            value: data[label.prop] || "-",
            slot: label.slot || "",
          };
          if (label.prop === "commonAttBusinessTypeList") {
            const fileJsonValue = data[label.prop] || [];
            content.value = JSON.stringify(fileJsonValue);
            content.annex = true;
          }
          if(label.prop === "commentEditor"){
            content.value = data['comment'] || "";
            content.html = true;
            content.border = true;
          }
          return content;
        })
      );
    },
    //   获取初始值
    init() {
      getDetail(this.id).then((res) => {
        const { data = {} } = res;
        const { detail = {}, process = [] } = data;
        this.data = detail;
        let tempBase = BASE_INFO;
        if(this.data.status !== 3){
          tempBase= [...BASE_INFO,{
            label: '当前处理人',
            value: 'handlePerson',
            name: 'handlePerson',
            span: 3,
          }];
        }
        this.baseInfo = this.infoDetails(tempBase);
        this.generatorRecords(process);
      });
    },
    infoDetails(arr) {
      const list = arr.map((item) => {
        item.value = this.data[item.name] || "-";
        if (item.name === 'taskLevelLabel') {
          item.dotClass = `dot${this.taskLevelMap.get(this.data[item.name])}`;
        } else if(item.name === 'statusLabel') {
          item.dotClass = `dot${this.statusMap.get(this.data[item.name])}`;
        }
        return item;
      });
      return list;
    },
  },
};
</script>
<style lang="less" scoped>
.status1 {
  color: #ffa500;
  background: #fff6ec;
  border: 1px solid #ffca8f;
}
.status2 {
  color: #267ee5;
  background: #e6f7ff;
  border: 1px solid #91c3ff;
}
.status3 {
  color: #19be6b;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}
.taskLevel1 {
  color: #8b0000;
  background: #ffe7ea;
  border: 1px solid #d06773;
}
.taskLevel2 {
  color: #ed4014;
  background: #fff1f0;
  border: 1px solid #ffa39e;
}
.taskLevel3 {
  color: #ffa500;
  background: #fff6ec;
  border: 1px solid #ffca8f;
}
.taskLevel4 {
  color: #267ee5;
  background: #e6f7ff;
  border: 1px solid #91c3ff;
}
.over-time {
  color: #267ee5;
  background: #e6f7ff;
  border: 1px solid #91c3ff;
}
.end-time {
  color: #ed4014;
  background: #fff1f0;
  border: 1px solid #ffa39e;
}

:deep(.flow-chart-step) {
  margin: 0 16px;
  width: 1048px !important;
}


:deep(.timeline-title) {
  color: #0ff !important;
}
:deep(.timeline-content) {
  // background: #1e3c58 !important;
  .label,
  .show-annex-info-name {
    color: #0ff !important;
  }
  .value,
  .text-normal,
  .content-data {
    color: #fff;
  }
  .wangeditor-content {
    border: none;
  }
}
:deep(.show-annex-info-name){
  color: #0ff !important;
}
</style>
