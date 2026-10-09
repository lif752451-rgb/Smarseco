<template>
  <div class="google-auth-content">
    <template v-if="authType === 'google'">
      <div class="auth-title">
        <img :src="getAssetsImages('login/google_auth_logo.png')" />
      </div>
      <div class="auth-content">
        <div class="center-content">
          <div class="title">绑定 MFA</div>
          <div class="user-msg">
            安全令牌验证 账户 <span class="user">{{ userName }}</span> 请按照以下步骤完成绑定操作
          </div>
          <div class="down-msg">使用手机 Google Authenticator 应用扫描以下二维码，获取6位验证码</div>
          <canvas id="qrCode" ref="qrCodeRef" class="qr-code"></canvas>
          <div class="down-input">
            <el-form ref="formRef" :model="form" @submit.prevent>
              <el-form-item prop="secretCode" :rules="[{ required: true, trigger: 'blur', message: '验证码不能为空' }]">
                <el-input v-model="form.secretCode" style="margin: 0 auto" maxlength="6" placeholder="6位数字" @input="handleOninput" @keyup.enter="nextOpen" />
              </el-form-item>
            </el-form>
          </div>
          <div class="next-button"><el-button v-preventReClick @click="nextOpen">下一步</el-button></div>
        </div>
      </div>
    </template>
    <template v-else-if="authType === 'crc'">
      <div class="auth-title">
        <img :src="getAssetsImages('login/google_auth_logo.png')" />
      </div>
      <div class="auth-content">
        <div class="center-content">
          <div class="title">动态令牌绑定</div>
          <div class="user-msg">
            安全令牌验证 账户 <span class="user">{{ userName }}</span> 请按照以下步骤完成绑定操作
          </div>
          <div class="down-msg">
            使用微信小程序“OTP动态令牌”扫码添加 或 <br />
            使用慧盾UES小貔貅识别以下二维码进行绑定，获取6位动态验证码
          </div>
          <canvas id="qrCode" ref="qrCodeRef" class="qr-code"></canvas>
          <div class="down-input">
            <el-form ref="formRef" :model="form" @submit.prevent>
              <el-form-item prop="secretCode" :rules="[{ required: true, trigger: 'blur', message: '验证码不能为空' }]">
                <el-input v-model="form.secretCode" style="margin: 0 auto" maxlength="6" placeholder="6位数字" @input="handleOninput" @keyup.enter="nextOpen" />
              </el-form-item>
            </el-form>
          </div>
          <div class="next-button"><el-button v-preventReClick @click="nextOpen">下一步</el-button></div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed, reactive, ref, unref } from "vue";
import { reqBindGoogle, reqGoogleSecret } from "/@/api/framework/google";
import * as QRCode from "qrcode";
import { getAssetsImages } from "/@/utils/util.url";
import { useAuth } from "/@/hooks/account/useAuth";
import router from "/@/router";
import { useUserStore } from "/@/store/modules/user";
import { LocalStorage } from "/src/utils/util.storage";

const authType = computed(() => {
  return LocalStorage.get("googleAuthType") || "google";
});
const { getGoogleUsername: userName } = useAuth();

onMounted(() => {
  !unref(userName) && router.push("/login");
  generateGoogleSecret();
});

let secret: string;
const qrCodeRef = ref();
async function generateGoogleSecret() {
  const data = await reqGoogleSecret(unref(userName));
  secret = data.secret;
  await QRCode.toCanvas(qrCodeRef.value, data.secretQrCode, {
    width: 172,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
}

const form = reactive({
  secretCode: "",
});
const formRef = ref();
function nextOpen() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    const params = { userName: unref(userName), code: form.secretCode, secret };
    await reqBindGoogle(params);
    const userStore = useUserStore();
    await userStore.logout(true);
  });
}

function handleOninput(value) {
  form.secretCode = value.replace(/[^\d]/g, "");
}
</script>
<style lang="less" scoped>
.google-auth-content {
  .auth-title {
    background: #fff9f2;
    height: 100px;
    img {
      width: 257px;
      height: 65px;
      margin: 17px 20px;
    }
  }
  .auth-content {
    height: calc(100vh - 100px);
    display: flex;
    justify-content: center;
    align-items: center;
    .center-content {
      width: 590px;
      text-align: center;
      .title {
        font-weight: 500;
        font-size: 36px;
        color: #000000;
        margin: 0 0 20px 0;
      }
      .user-msg {
        font-weight: 400;
        font-size: 18px;
        color: #7f7f7f;
        padding: 0 0 20px 0;
        border-bottom: 1px solid #dcdcdc;
        .user {
          color: #ff4158;
        }
      }
      .down-msg {
        margin: 20px 0 0 0;
        font-weight: 500;
        font-size: 18px;
        color: #000000;
      }
      .qr-code {
        margin: 20px 0;
        width: 172px;
        height: 172px;
        display: inline-block;
      }
      .down-secret {
        margin: 20px 0;
        font-weight: 400;
        font-size: 18px;
        color: #7f7f7f;
      }
      .down-input {
        .el-input {
          width: 300px;
          height: 40px;
        }
        :deep(.el-input--small) .el-input__inner {
          height: 40px !important;
          line-height: 40px !important;
          font-size: 16px;
        }
        :deep(.el-form-item__error) {
          right: 145px !important;
        }
      }
      .next-button {
        margin: 20px 0 0 0;
        .el-button {
          font-weight: 650;
          font-style: normal;
          font-size: 18px;
          color: #ffffff;
          background: rgba(255, 158, 0, 1);
          width: 300px;
          height: 48px;
          line-height: 32px;
          border-radius: 4px;
          border: 0;
        }
      }
    }
  }
}
</style>
