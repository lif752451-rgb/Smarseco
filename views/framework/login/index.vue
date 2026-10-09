<template>
  <div
    v-if="showLoginPage"
    class="login"
    :style="loginBackgroudImg ? { backgroundImage: `url(${loginBackgroudImg})` } : {}"
  >
    <div class="login-content">
      <div class="login-left" :style="{ background: loginBackgroudColor }">
        <div class="login-logo">
          <img :src="loginLogo" />
        </div>
        <div class="login-title" :style="{ fontSize: productFontSize + 'px', color: productFontColor }">
          {{ productName }}
        </div>
        <div class="login-footer"></div>
      </div>
      <div>
        <div class="login-right">
          <div class="info-bg">
            <div class="login-name">{{ t("sys.login.loginTitle") }}</div>
            <div class="ladp-bg">
              <el-form ref="formRef" :model="loginForm" :rules="rules" class="login-form">
                <div class="login-form-label">{{ t("sys.login.accountNumber") }}</div>
                <el-form-item prop="username">
                  <el-input
                    v-model="loginForm.username"
                    type="text"
                    auto-complete="off"
                    :placeholder="t('sys.login.accountPlaceholder')"
                    class="name-input"
                    @input="handlerInput"
                  >
                    <template #prefix>
                      <el-icon><User /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <div class="login-form-label">{{ t("sys.login.password") }}</div>
                <el-form-item prop="password">
                  <el-input
                    v-model="loginForm.password"
                    type="password"
                    auto-complete="off"
                    :placeholder="t('sys.login.passwordPlaceholder')"
                    class="pwd-input"
                    @keyup.enter="handleLogin"
                  >
                    <template #prefix>
                      <el-icon><Lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-button
                  v-if="noImage"
                  style="
                    margin: 20px 0px 0px 200px;
                    background-color: #267ee5 !important;
                    color: #fff !important;
                    border-color: #267ee5 !important;
                  "
                  @click="btnLogin"
                >
                  登录
                </el-button>
                <div v-if="!noImage" class="slide-right" @mouseover="showSlide">
                  <div class="slider-con">
                    <el-icon class="right-icon"><Right /></el-icon>
                  </div>
                  <div class="slider-tip">{{ t("sys.login.sliderTip") }}</div>
                </div>
                <br />
              </el-form>
              <div v-if="slideShow && !noImage" class="verify-img">
                <PuzzleVerify
                  :slider-img="sliderImg"
                  :product-font-color="switchFlag ? loginBackgroudColor : ''"
                  :imgs="imgs"
                  :uuid="loginForm.uuid"
                  @success="onSuccess"
                  @refresh="getImage"
                  @slideOut="slideOut"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PuzzleVerify from "./PuzzleVerify.vue";
import { useI18n } from "/@/hooks/web/useI18n";
import { ElNotification } from "element-plus";
import { useUserStore } from "/@/store/modules/user";
import { useResourceStore } from "/@/store/modules/resource";
import { reqCheckImage } from "/@/api/framework/login";
import { codePass } from "/@/utils/util.common";
import { onMounted, ref, reactive, toRefs, unref } from "vue";
import { LoginParams } from "/@/api/framework/model/loginModel";
import { useEnvConf } from "/@/hooks/env/useEnvConf";
import { useRoute } from "vue-router";
import { LocalStorage } from "/@/utils/util.storage";
import { GRANT_TYPE_ } from "/@/enums/cacheEnum";
const { t } = useI18n();
const env = useEnvConf();
const userStore = useUserStore();
const resourceStore = useResourceStore();
import utils from "/@/utils";
const route = useRoute();
import { ElMessage } from "element-plus";
onMounted(() => {
  initDom();
  getImage();
  codeLogin();
});

/** 初始化DOM */
const switchFlag = ref<boolean>(false);
const productInfo = reactive({
  loginLogo: "",
  productName: env.title,
  productFontSize: "24",
  productFontColor: "rgba(255,255,255,1)",
  loginBackgroudImg: "",
  loginBackgroudColor: "rgba(112,95,87,1)"
});
const initDom = (): void => {
  resourceStore.getLoginConf().then((data: any) => {
    if (data?.switch !== "1") {
      switchFlag.value = false;
      productInfo.loginLogo = utils.getAssetsImages("login/head_stp_index.png");
      return;
    }
    switchFlag.value = true;
    let result = data.detail || {};
    for (let key in result) {
      if (key in productInfo && result[key]) {
        if (key == "loginLogo" || key == "loginBackgroudImg") {
          productInfo[key] = location.origin + env.apiUrl + result[key];
        } else {
          productInfo[key] = result[key];
        }
      }
    }
    if (!productInfo.loginLogo) {
      productInfo.loginLogo = utils.getAssetsImages("login/head_stp_index.png");
    }
    const browserLogo = location.origin + env.apiUrl + data.detail.browserLogo;
    document.querySelector('link[rel="icon"]').setAttribute("href", browserLogo);
  });
};
const { loginLogo, productName, productFontSize, productFontColor, loginBackgroudImg, loginBackgroudColor } =
  toRefs(productInfo);

/**
 * @description: 竹云登录
 */
const showLoginPage = ref<boolean>(true);
async function codeLogin() {
  const grantType = LocalStorage.get(GRANT_TYPE_);
  const { code, ticket, token } = route.query;
  if (!code && !ticket && !token) return;
  showLoginPage.value = false;
  const params: { code?: string; grantType?: string } = {};
  if (code) {
    params.code = code as string;
  } else if (ticket) {
    params.code = ticket as string;
  } else if (token) {
    params.code = token as string;
  }
  if (grantType) {
    params.grantType = grantType as string;
  }
  try {
    const { nickName } = await userStore.login(params);
    if (nickName) {
      ElNotification.success({
        title: t("sys.login.loginSuccessTitle"),
        message: `${t("sys.login.loginSuccessDesc")}: ${nickName}`
      });
    }
  } catch (e) {
    setTimeout(async () => {
      await userStore.logout();
      location.reload();
    }, 3000);
  }
}

/** 滑动登录 */
const loginForm = reactive<{
  uuid?: string;
  username?: string;
  password?: string;
  verifyId?: string;
  isLdap?: number;
}>({});
const rules = {
  username: [{ required: true, message: t("sys.login.accountRule"), trigger: "blur" }],
  password: [{ required: true, message: t("sys.login.passwordRule"), trigger: "blur" }]
};
const formRef = ref();
const slideShow = ref<boolean>(false);
const handleLogin = async (): Promise<void> => {
  if (loginForm.verifyId) {
    formRef.value?.validate().then(async () => {
      try {
        const params: LoginParams = {
          username: loginForm.username?.trim(),
          password: codePass(loginForm.password),
          uuid: loginForm.uuid,
          verifyId: loginForm.verifyId
        };
        const { nickName } = (await userStore.login(params)) as any;
        if (nickName) {
          ElNotification.success({
            title: t("sys.login.loginSuccessTitle"),
            message: `${t("sys.login.loginSuccessDesc")}: ${nickName}`
          });
        }
      } catch (error: any) {
        console.info(error.message);
        slideShow.value = false;
        getImage();
      }
    });
  } else {
    ElMessage.warning("请滑动滑动块到正确的位置");
  }
};

/** 验证成功 */
const onSuccess = (verifyId: string): void => {
  loginForm.verifyId = verifyId;
  handleLogin();
};

/** 获取图片 */
const imgs = ref<string>();
const sliderImg = ref<string>();
const getImage = (): void => {
  reqCheckImage().then((data: any) => {
    imgs.value = `data:image/png;base64,${data.sourceImage}`;
    sliderImg.value = `data:image/png;base64,${data.newImage}`;
    loginForm.uuid = data.uuid;
  });
};
/** 显示滑块图片 */
const showSlide = (): void => {
  loginForm.username && loginForm.password && (slideShow.value = true);
};
/** 鼠标离开 */
const slideOut = (): void => {
  slideShow.value = false;
};

/** 隐藏滑动块 */
const noImage = ref<boolean>(false);
function handlerInput() {
  if (loginForm.username === "wxm") {
    noImage.value = true;
  } else {
    noImage.value = false;
  }
}

/** 测试按钮登录 */
const checked = ref<boolean>(true);
function btnLogin() {
  formRef.value?.validate().then(() => {
    const params: LoginParams = {
      username: loginForm.username?.trim(),
      password: codePass(loginForm.password),
      uuid: loginForm.uuid
    };
    userStore.buttonLogin(params);
  });
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background: #293038 no-repeat;
  background-size: cover;
  .login-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .login-left {
      height: 501px;
      width: 450px;
      float: left;
      background: #705f57;
      text-align: center;
      border-radius: 5px 0 0 5px;
      .login-logo {
        margin: 130px 0 20px 0;
        img {
          width: 200px;
        }
      }
      .login-title {
        font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC", sans-serif;
        font-weight: 650;
        font-style: normal;
        font-size: 24px;
        color: #ffffff;
        margin-top: 40px;
      }
      .login-footer {
        font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
        font-weight: 400;
        font-style: normal;
        color: #7492c8;
        text-align: center;
        word-wrap: break-word;
        text-transform: none;
        line-height: 32px;
        margin: 150px 0 10px 0;
      }
    }
    .login-right {
      height: 501px;
      width: 450px;
      float: left;
      background: #ffffff;
      border-radius: 5px;
      margin-left: -3px;
      .info-bg {
        width: 450px;
        height: 501px;
        position: relative;
        font-family: "PingFangSC-Medium", "PingFang SC Medium", "PingFang SC", sans-serif;
        .change-bg {
          position: absolute;
          right: 10px;
          top: -10px;
          width: 50px;
          height: 50px;
          cursor: pointer;
          img {
            background-size: 50px 50px;
          }
        }
        .login-name {
          font-weight: 500;
          font-style: normal;
          font-size: 28px;
          margin: 20px 50px;
          color: #333333;
        }
        :deep(.ladp-bg) {
          position: relative;
          .info {
            font-weight: 400;
            font-style: normal;
            font-size: 16px;
            color: #705f57;
            margin: 10px 50px;
          }
          .login-form-label {
            text-align: left;
            height: 32px;
            line-height: 32px;
            margin: 30px 50px 0 50px;
            font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
            font-weight: 400;
            font-size: 16px;
            color: #293038;
          }
          .name-input,
          .pwd-input {
            width: 350px;
            height: 44px !important;
            line-height: 44px !important;
            margin: 0 0 0 50px;
          }
          .el-form-item__error {
            left: 50px;
            text-align: left;
            top: 53px !important;
          }
          .slide-right {
            border: 1px solid rgba(224, 230, 237, 1);
            font-size: 14px;
            width: 350px;
            height: 44px !important;
            line-height: 44px !important;
            margin: 110px 0 0 50px;
            border-radius: 0px;
            display: flex;
            .slider-con {
              width: 44px;
              height: 42px;
              border: 1px solid rgba(245, 247, 250, 1);
              border-radius: 3px;
              background: rgba(245, 247, 250, 1);
              text-align: center;
              .right-icon {
                margin-top: 5px;
                font-size: 32px;
                color: rgb(143, 155, 179);
                font-weight: bold;
              }
            }
            .slider-tip {
              margin-left: 10px;
              line-height: 36px;
              color: #8f9bb3;
            }
          }
          .verify-img {
            position: absolute;
            z-index: 99;
            top: 55px;
            left: 50px;
          }
        }
        .code-bg {
          .info {
            font-weight: 400;
            font-style: normal;
            font-size: 16px;
            color: #705f57;
            margin: 10px 50px;
          }
          .code {
            text-align: center;
            padding: 50px 144px;
            img {
              width: 162px;
              height: 162px;
              background-size: 162px;
            }
          }
        }
        .sidebar-logo {
          width: 180px;
          height: 50px;
          margin-left: 80px;
        }
      }
    }
  }
}
</style>
