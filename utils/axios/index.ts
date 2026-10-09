// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project,
// just change the file, other files can be left unchanged

import VAxios from "./Axios";
import type { AxiosTransform } from "./axiosTransform";
import type { AxiosResponse } from "axios";
import { RequestOptions, Result } from "/#/axios";
import { ResultEnum, ContentTypeEnum } from "/@/enums/httpEnum";
import { isString, isDef } from "/@/utils/util.is";
import { RequestEnum, ConfigEnum } from "/@/enums/httpEnum";
import { setObjToUrlParams } from "/@/utils/util.common";
import { useEnvConf } from "/@/hooks/env/useEnvConf";
import { getToken } from "/@/utils/util.auth";
import { isWhiteApi } from "/@/settings/whiteSetting";
import { useErrorLogStoreWithOut } from "/@/store/modules/errorLog";
import { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "/@/store/modules/user";
import { useLocaleStore } from "/@/store/modules/locale";
import { checkStatus } from "./checkStatus";
import { useI18n } from "/@/hooks/web/useI18n";
const env = useEnvConf();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook(res: AxiosResponse<Result>, options?: RequestOptions, conf?: AxiosRequestConfig) {
    const {
      isTransformResponse = true,
      isReturnNativeResponse,
      isSuccessMsg,
      isNoCode = false,
      isFileDownLoad = false
    } = options ?? {};
    const { data } = res;
    if (isFileDownLoad) {
      // 处理文件下载
      // 如果有正常的文件流返回  直接return
      // 如果有code 返回 说明有问题
      if (/json/.test(res.headers["content-type"])) {
        const uint8Array = new Uint8Array(res.data);
        const decoder = new TextDecoder();
        const jsonObject = JSON.parse(decoder.decode(uint8Array));
        console.log("要退出登录", res, jsonObject);
        switch (jsonObject.code) {
          case ResultEnum.TIMEOUT:
            // 401 时直接退出登录
            const userStore = useUserStore();
            userStore.setToken(undefined);
            userStore.logout(true, window.location?.pathname);
            ElMessage.warning(jsonObject.msg);
            break;
          default:
            if (jsonObject.msg) {
              ElMessage.warning(jsonObject.msg);
            }
        }
        throw new Error();
      } else {
        // 直接返回文件流
        return res;
      }
    } else {
      const { code, msg, data: _data, rows, list, total } = data;
      const hasSuccess = data && Reflect.has(data, "code") && (code === ResultEnum.SUCCESS || code === 200);
      if (hasSuccess || isNoCode) {
        // 是否需要弹出msg消息提示
        if (isSuccessMsg) {
          ElMessage.success(msg);
        }
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        if (isReturnNativeResponse) {
          return res;
        }

        // 对请求结果不处理直接返回
        if (!isTransformResponse) {
          return res.data;
        } else {
          if (isDef(total)) return { data: _data || rows || list, total };
          else return _data || rows || list;
        }
      } else {
        let timeoutMsg = "";
        switch (code) {
          case ResultEnum.TIMEOUT:
            timeoutMsg = "sys.api.timeoutMessage";
            // 401 时直接退出登录
            const userStore = useUserStore();
            userStore.setToken(undefined);
            userStore.logout(true, window.location?.pathname);
            break;
          default:
            if (msg) {
              timeoutMsg = msg;
            }
        }

        if (options?.errorMessageMode === "modal") {
          // modal为重要错误提示 以对话框的形式
          // createErrorModal({ title: 'sys.api.errorTip', content: timeoutMsg });
        } else if (options?.errorMessageMode === "message") {
          ElMessage({
            message: msg,
            type: code === 500 ? "error" : "warning"
          });
        }

        // 请求失败时直接抛出异常阻塞后续代码执行
        throw new Error(`接口请求失败!错误URL:${conf.url}`);
      }
    }
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;
    // 接口前缀
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }
    // 代理别名
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    // formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, {} /*joinTimestamp(joinTime, false)*/);
      } else {
        // 兼容restful风格
        config.url = config.url + params /* + `${joinTimestamp(joinTime, true)}`*/;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        // formatDate && formatRequestDate(params);
        if (Reflect.has(config, "data") && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
        }
      } else {
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config: any, options) => {
    const token = getToken();
    if (
      token &&
      (config as any)?.requestOptions?.withToken !== false &&
      !isWhiteApi(config.url.replace(config.requestOptions.apiUrl, ""))
    ) {
      // jwt token
      const auth: string = options.authenticationScheme as string;
      config.headers[ConfigEnum.TOKEN] = auth ? `${auth} ${token}` : token;
      config.headers[ConfigEnum.CLI_TYPE] = "web";
      config.headers[ConfigEnum.SYS_TYPE] = "admin";
    }
    config.headers[ConfigEnum.SYS_NAME_TYPE] = "stp";
    const { getLanguage } = useLocaleStore();
    config.headers[ConfigEnum.CLI_LANG] = getLanguage;
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || "none";
    const msg: string = response?.data?.message ?? "";
    const err: string = error?.toString?.() ?? "";
    let errMessage = "";
    try {
      if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
        errMessage = t("sys.api.apiTimeoutMessage");
      }
      if (err?.includes("Network Error")) {
        errMessage = t("sys.api.networkExceptionMsg");
      }
      if (errMessage) {
        if (errorMessageMode === "modal") {
          // createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === "message") {
          ElMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as any);
    }
    checkStatus(error?.response?.status, msg, errorMessageMode);
    return Promise.reject(error);
  }
};

const defHttp = new VAxios({
  // 基础接口地址 已由apiUrl拼接完成 此处的配置可不需要
  // baseURL: globSetting.apiUrl || '/stage-api',
  timeout: 50000,
  authenticationScheme: "Bearer",
  headers: { "Content-Type": ContentTypeEnum.JSON },
  // 数据处理方式
  transform,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // 是否弹出成功的msg提示框
    isSuccessMsg: false,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 异常消息提示类型
    errorMessageMode: "message",
    // 成功消息提示类型
    successMessageMode: "success",
    // 接口地址
    apiUrl: env.apiUrl,
    // 接口拼接地址
    urlPrefix: env.urlPrefix,
    //  是否加入时间戳
    joinTime: true,
    // 忽略重复请求
    ignoreCancelToken: true,
    // 是否携带token
    withToken: true
  }
});

export default defHttp;
