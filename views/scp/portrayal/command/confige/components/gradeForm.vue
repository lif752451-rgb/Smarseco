<template>
  <el-drawer :title="dialogTitle" size="1080px" :before-close="handleClose" :modelValue="open" :close-on-press-escape="false" :close-on-click-modal="false" ref="drawer">
    <div class="sm-form-header-tabs">
      <div class="btn-box">
        <span class="btn" @click="handleClickALLFlag(false)">全部展开</span>
        <span class="btn" @click="handleClickALLFlag(true)">全部收起</span>
      </div>
    </div>
    <el-scrollbar>
      <div class="content-box">
        <el-form ref="form" :model="form" :rules="rules" @submit.prevent label-position="top">
          <div class="item" :class="item.isCollapse ? 'mb-10' : ''" v-for="(item, index) in form.formList" :key="index">
            <div class="item-title flex-between">
              <span>{{ item.date }}</span>
              <span class="card-more-icon" @click="handleClickMore(item)">
                <el-icon class="icon_img">
                  <ArrowUp v-if="!item.isCollapse" />
                  <ArrowDown v-else />
                </el-icon>
                <i :class="`${!item.isCollapse ? 'el-icon-arrow-up' : 'el-icon-arrow-down'}`"
              /></span>
            </div>
            <div v-show="!item.isCollapse">
              <el-form-item label="得分" prop="goal" class="el-input-number-box">
                <el-input-number controls-position="right" v-model="item.goal" :min="0" :max="100000" :step="1" :precision="0"></el-input-number>
              </el-form-item>
              <el-form-item label="失分" prop="pointsAgainst" class="el-input-number-box ml-10">
                <el-input-number controls-position="right" v-model="item.pointsAgainst" :min="0" :max="100000" :step="1" :precision="0"></el-input-number>
              </el-form-item>
              <el-form-item label="预估得分" prop="estimateGoal" class="el-input-number-box ml-10">
                <el-input-number controls-position="right" v-model="item.estimateGoal" :min="0" :max="100000" :step="1" :precision="0"></el-input-number>
              </el-form-item>
              <el-form-item label="预估失分" prop="estimatePointsAgainst" class="el-input-number-box ml-10">
                <el-input-number controls-position="right" v-model="item.estimatePointsAgainst" :min="0" :max="100000" :step="1" :precision="0"></el-input-number>
              </el-form-item>
              <el-form-item label="说明" prop="instance" class="explain-box ml-10">
                <el-input v-model="item.explain" maxlength="200" show-word-limit></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="fs-form-footer-btns">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-preventReClick type="primary" @click="submit">确定</el-button>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>
<script>
import lodash from "lodash-es";
import { getConfigDate, saveConfigDate } from "/@/api/scp/command/confige";
import { ElMessageBox, ElMessage } from "element-plus";
export default {
  components: {},
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    combatFightPeriod: {
      type: [String, Number],
      default: "",
    },
    dialogTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        formList: [],
      },
      rules: {},
      id: null,
    };
  },
  created() {
    let params = {
      combatFightPeriod: this.combatFightPeriod,
      cmdConfigeItemExplain: "cmd:confige:grade",
    };
    getConfigDate(params).then((res) => {
      if (res && res.data) {
        this.id = res.data.id;
        const formList = res.data.content ? JSON.parse(res.data.content) : [];
        if (formList && formList.length) {
          formList.forEach((item, index) => {
            if (item.goal || item.goal === 0 || item.pointsAgainst || item.pointsAgainst === 0 || item.estimateGoal || item.estimateGoal === 0 || item.estimatePointsAgainst || item.estimatePointsAgainst === 0 || item.explain) {
              item.isCollapse = false;
              // 五个输入框都有值就全部展开(不折叠)
            } else {
              item.isCollapse = true;
            }
            item.goal = item.goal || item.goal === 0 ? item.goal : undefined;
            item.pointsAgainst = item.pointsAgainst || item.pointsAgainst === 0 ? item.pointsAgainst : undefined;
            item.estimateGoal = item.estimateGoal || item.estimateGoal === 0 ? item.estimateGoal : undefined;
            item.estimatePointsAgainst = item.estimatePointsAgainst || item.estimatePointsAgainst === 0 ? item.estimatePointsAgainst : undefined;
          });
          this.form.formList = formList;
        }
      }
    });
  },
  methods: {
    handleClose() {
      this.$emit("closeView");
    },
    submit() {
      let params = {
        id: this.id,
        combatFightPeriod: this.combatFightPeriod,
        cmdConfigeItemExplain: "cmd:confige:grade",
        content: JSON.stringify(this.form.formList),
      };
      saveConfigDate(params).then((res) => {
        if (res && res.code == 200) {
          // 成功
          ElMessage({ message: "保存成功", type: "success" });
          this.handleClose();
          this.$emit("refresh");
        }
      });
    },
    handleClickMore(item) {
      item["isCollapse"] = !item.isCollapse;
    },
    // 全部展开 / 全部收起
    handleClickALLFlag(falg) {
      this.form.formList.forEach((item, index) => {
        this.form.formList[index]["isCollapse"] = falg;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.btn-box {
  padding: 10px 16px 10px 16px;
  .btn {
    cursor: pointer;
    color: var(--el-color-primary);
    margin-right: 20px;
  }
}
.content-box {
  .card-more-icon {
    cursor: pointer;
    color: var(--el-color-primary);
  }
  .item {
    .flex-between {
      border-left: 2px solid var(--el-color-primary);
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      line-height: 32px;
      background: var(--el-color-primary-light-9);
      color: #333333;
      font-size: 14px;
      font-weight: 500;
      padding: 0 16px;
    }
  }
}
:deep(.el-form-item) {
  margin-right: 0px !important;
  margin-bottom: 10px !important;
  &.el-input-number-box,
  .el-input-number--small {
    width: 140px !important;
    display: inline-block;
  }
  &.explain-box {
    width: calc(100% - 600px) !important;
    display: inline-block;
  }
}
</style>
