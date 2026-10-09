<template>
  <el-drawer :title="dialogTitle" size="1080px" :before-close="handleClose" :model-value="open" :close-on-press-escape="false" :close-on-click-modal="false" ref="drawer">
    <div class="sm-form-header-tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="作战团队名单" name="group"></el-tab-pane>
        <el-tab-pane label="人员排班" name="person"></el-tab-pane>
      </el-tabs>
    </div>
    <el-scrollbar>
      <sm-basic-collapse :title="'作战团队名单'" v-if="activeName == 'group'">
        <div class="content-box">
          <el-form ref="form" :model="groupForm" :rules="rules" @submit.prevent>
            <div class="item" v-for="(item, index) in groupForm.groupList" :key="index">
              <div class="item-title flex-between">{{ item.groupName }}</div>
              <div class="tag-box">
                <sm-tag-tooltip v-model="item.groupPerson" :dynamic="true" tagName="成员" />
              </div>
            </div>
          </el-form>
        </div>
      </sm-basic-collapse>
      <sm-basic-collapse :title="'人员排班'" v-if="activeName == 'person'">
        <div class="btn-box mb-16">
          <span class="btn" @click="handleClickALLFlag(false)">全部展开</span>
          <span class="btn" @click="handleClickALLFlag(true)">全部收起</span>
        </div>
        <div class="content-box">
          <el-form ref="form" :model="form" :rules="rules" label-position="top" @submit.prevent>
            <div class="item" :class="item.isCollapse ? 'mb-10' : ''" v-for="(item, index) in form.commandScreenTeamSortConfigList" :key="index">
              <div class="item-title flex-between">
                <span>{{ item.currentTime }}</span>
                <span class="card-more-icon" @click="handleClickMore(item)">
                  <el-icon class="icon_img">
                    <ArrowUp v-if="!item.isCollapse" />
                    <ArrowDown v-else />
                  </el-icon>
                </span>
              </div>
              <div v-show="!item.isCollapse">
                <el-form-item label="总指挥" prop="instance" class="command-box">
                  <el-input v-model="item.leadCommander" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="白班总指挥" prop="instance" class="command-box ml-10">
                  <el-input v-model="item.dayShiftLeadCommander" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="夜班总指挥" prop="instance" class="command-box ml-10">
                  <el-input v-model="item.nightShiftLeadCommander" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="其它重点人员" prop="otherPerson" class="otherPerson-box ml-10">
                  <el-input v-model="item.otherPerson" maxlength="200" show-word-limit></el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </sm-basic-collapse>
      <div class="fs-form-footer-btns">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-preventReClick type="primary" @click="submit">确定</el-button>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>
<script>
import lodash from "lodash-es";
import { getGroupDate, saveGroupDate } from "/@/api/scp/command/confige";
import SmBasicCollapse from "/@/components/Collapse";
import { SmTagTooltip } from "/@/components/Tooltip";
import { ElMessageBox, ElMessage } from "element-plus";
export default {
  components: { SmBasicCollapse, SmTagTooltip },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "",
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
        commandScreenTeamSortConfigList: [],
      },
      rules: {},
      activeName: "group",
      groupForm: {
        groupList: [],
      },
    };
  },
  created() {
    getGroupDate(this.combatFightPeriod).then((res) => {
      if (res && res.data) {
        const commandScreenTeamSortConfigList = res.data.commandScreenTeamSortConfigList || [];
        if (commandScreenTeamSortConfigList && commandScreenTeamSortConfigList.length) {
          commandScreenTeamSortConfigList.forEach((item, index) => {
            if (item.leadCommander || item.dayShiftLeadCommander || item.nightShiftLeadCommander || item.otherPerson) {
              item.isCollapse = false;
              // 五个输入框都有值就全部展开(不折叠)
            } else {
              item.isCollapse = true;
            }
          });

          this.form.commandScreenTeamSortConfigList = commandScreenTeamSortConfigList;
        }
        const groupList = res.data.commandScreenTeamListConfig || [];
        if (groupList && groupList.length) {
          groupList.forEach((item, index) => {
            item.groupPerson = item.groupPerson ? item.groupPerson.split(",") : [];
          });
          this.groupForm.groupList = groupList;
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
        combatFightPeriod: this.combatFightPeriod,
        commandScreenTeamSortConfigList: this.form.commandScreenTeamSortConfigList,
      };
      const commandScreenTeamListConfig = JSON.parse(JSON.stringify(this.groupForm.groupList));
      params.commandScreenTeamListConfig = commandScreenTeamListConfig.map((item, index) => {
        item.groupPerson = item.groupPerson ? item.groupPerson.join(",") : "";
        return item;
      });
      saveGroupDate(params).then((res) => {
        if (res && res.code == 200) {
          // 成功
          ElMessage({ message: "保存成功", type: "success" });
          this.handleClose();
          this.$emit("refresh", this.type);
        }
      });
    },
    handleClickMore(item) {
      item["isCollapse"] = !item.isCollapse;
    },
    // 全部展开 / 全部收起
    handleClickALLFlag(falg) {
      this.form.commandScreenTeamSortConfigList.forEach((item, index) => {
        this.form.commandScreenTeamSortConfigList[index]["isCollapse"] = falg;
      });
    },
    setTaskTags(tags, item) {
      item["groupPerson"] = tags;
    },
  },
};
</script>
<style lang="less" scoped>
.mt-8 {
  margin-top: 8px;
}
.mb-16 {
  margin-bottom: 16px;
}
.btn-box {
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
      background: var(--el-color-primary-light-9);
      border-left: 2px solid var(--el-color-primary);
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #333333;
      font-weight: 500;
      padding: 0 16px;
    }
  }
}
:deep(.el-form-item) {
  margin-right: 0px !important;
  margin-bottom: 10px !important;
  &.command-box {
    width: 160px !important;
    display: inline-block;
  }
  &.otherPerson-box {
    width: calc(100% - 510px) !important;
    display: inline-block;
  }
}
.tag-box {
  padding: 8px 0;
}
</style>
