<template>
  <div class="google-auth-content">
    <div class="auth-content" v-if="authType === 'google'">
      <img width="140" :src="getAssetsImages('login/google_auth_logo.png')" />
      <el-form ref="formRef" :model="form" @submit.prevent>
        <el-select v-model="form.type" class="auth-select" style="width: 100%;">
          <el-option label="一次性密码" :value="1"></el-option>
        </el-select>
        <el-form-item prop="code" :rules="[{ required: true, trigger: 'blur', message: '验证码不能为空' }]">
          <el-input v-model="form.code" maxlength="6" class="auth-input" @input="handleOninput" @keyup.enter="nextOpen" />
        </el-form-item>
      </el-form>
      <div class="input-msg">请打开 Google Authenticator，输入6位动态码</div>
      <el-button v-preventReClick class="next-button" @click="nextOpen">下一步</el-button>
      <div class="question-msg">如果不能提供多因子认证验证码，请联系管理员！</div>
    </div>

    <div class="auth-content" v-else-if="authType === 'crc'">
      <img width="140" :src="getAssetsImages('login/google_auth_logo.png')" />
      <el-form ref="formRef" :model="form" @submit.prevent>
        <el-select v-model="form.type" class="auth-select" style="width: 100%;">
          <el-option label="动态验证码" :value="1"></el-option>
        </el-select>
        <el-form-item prop="code" :rules="[{ required: true, trigger: 'blur', message: '验证码不能为空' }]">
          <el-input v-model="form.code" maxlength="6" class="auth-input" @input="handleOninput" @keyup.enter="nextOpen" />
        </el-form-item>
      </el-form>
      <div class="input-msg">请打开微信小程序“OTP动态令牌”或慧盾UES小貔貅，输入6位动态码</div>
      <el-button v-preventReClick class="next-button" @click="nextOpen">下一步</el-button>
      <div class="question-msg">如果不能提供多因子认证验证码，请联系管理员！</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, unref, computed } from "vue";
import { getAssetsImages } from "/@/utils/util.url";
import router from "/@/router";
import { useAuth } from "/@/hooks/account/useAuth";
import { useUserStore } from "/@/store/modules/user";
import { LocalStorage } from "/src/utils/util.storage";
const { getGoogleUsername: userName } = useAuth();
const userStore = useUserStore();

const authType = computed(() => {
  return LocalStorage.get("googleAuthType") || "google";
});
onMounted(() => {
  !unref(userName) && router.push("/login");
});

const form = reactive({
  type: 1,
  code: ""
});
function handleOninput(value) {
  form.code = value.replace(/[^\d]/g, "");
}

const formRef = ref();
function nextOpen() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    const params = { userName: unref(userName), code: form.code };
    await userStore.googleLogin(params, unref(userName));
    await router.push("/sbp/index");
  });
}
</script>
<style lang="less" scoped>
.google-auth-content {
  width: 100%;
  height: 100%;
  background: rgba(243, 243, 243, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  .auth-content {
    width: 648px;
    height: 354px;
    background: #ffffff;
    text-align: left;
    padding: 20px 28px;
    .auth-logo {
      width: 188px;
      height: 47px;
    }
    .auth-select,
    .auth-input {
      // width: 600px;
      // height: 40px;
      width: 100%;
      margin: 20px 0 0 0;
    }
    :deep(.el-input--small) .el-input__inner {
      // height: 40px !important;
      line-height: 40px !important;
      font-size: 16px;
    }
    :deep(.el-form-item__error) {
      top: 2px !important;
    }
    .input-msg {
      margin: 20px 0 0 0;
      font-weight: 400;
      font-size: 14px;
      color: #7f7f7f;
    }
    .next-button {
      margin: 20px 0 0 0;
      font-weight: 650;
      font-style: normal;
      font-size: 18px;
      color: #ffffff;
      background: rgba(255, 158, 0, 1);
      // width: 600px;
      width: 100%;
      height: 48px;
      line-height: 32px;
      border-radius: 4px;
      border: 0;
    }
    .question-msg {
      margin: 8px 0 0 0;
      font-weight: 400;
      font-size: 14px;
      color: #7f7f7f;
    }
  }
}
</style>
