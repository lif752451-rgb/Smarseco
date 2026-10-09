<template>
  <div class="google-auth-content">
    <template v-if="authType === 'google'">
      <div class="auth-title">
        <img :src="getAssetsImages('login/google_auth_logo.png')" />
      </div>
      <div class="auth-content">
        <div class="center-content">
          <div class="title">安装应用</div>
          <div class="user-msg">
            安全令牌验证 账户 <span class="user">{{ userName }}</span> 请按照以下步骤完成绑定操作
          </div>
          <div class="down-msg">请在手机端下载并安装 Google Authenticator 应用</div>
          <div class="down-code">
            <span class="down-code-li">
              <img :src="getAssetsImages('login/google_auth_android.png')" />
              <div class="down-txt">Android手机下载</div>
            </span>
            <span class="down-code-li">
              <img :src="getAssetsImages('login/google_auth_iphone.png')" />
              <div class="down-txt">iPhone手机下载</div>
            </span>
          </div>
          <div class="next-msg">安装完成后点击下一步进入绑定页面（如已安装，直接进入下一步）</div>
          <div class="next-button"><el-button v-preventReClick @click="nextOpen">下一步</el-button></div>
        </div>
      </div>
    </template>

    <template v-else-if="authType === 'crc'">
      <div class="auth-title">
        <img :src="getAssetsImages('login/google_auth_logo.png')" />
      </div>
      <div class="auth-content">
        <div class="center-content" style="width: 660px">
          <div class="title">动态令牌绑定</div>
          <div class="user-msg">
            安全令牌验证 账户 <span class="user">{{ userName }}</span> 请按照以下步骤完成绑定操作
          </div>
          <div class="down-msg">请用微信扫一扫如下二维码（建议收藏为“我的小程序”）或下载慧盾UES小貔貅</div>
          <div class="down-code">
            <span class="down-code-li">
              <img :src="getAssetsImages('login/google_auth_crc.png')" />
              <div class="down-txt">OTP动态令牌</div>
            </span>
          </div>
          <div class="next-msg">完成后点击下一步进入绑定页面</div>
          <div class="next-button"><el-button v-preventReClick @click="nextOpen">下一步</el-button></div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed, unref } from "vue";
import { getAssetsImages } from "/@/utils/util.url";
import { useAuth } from "/@/hooks/account/useAuth";
import router from "/@/router";
import { LocalStorage } from "/src/utils/util.storage";

const authType = computed(() => {
  return LocalStorage.get("googleAuthType") || "google";
});
const { getGoogleUsername: userName } = useAuth();

onMounted(() => {
  !unref(userName) && router.push("/login");
});

function nextOpen() {
  router.push("/googleBindCode");
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
      .down-code {
        margin: 20px 0 0 0;
        .down-code-li {
          display: inline-block;
          margin: 0 20px;
        }
        img {
          width: 172px;
          height: 172px;
        }
        .down-txt {
          font-weight: 400;
          font-size: 18px;
          color: #7f7f7f;
        }
      }
      .next-msg {
        margin: 10px 0 0 0;
        font-weight: 500;
        font-size: 18px;
        color: #000000;
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
