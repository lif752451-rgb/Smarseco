import type { ErrorMessageMode } from "/#/axios";
import { useMessage } from "/@/hooks/web/useMessage";
import { useUserStore } from "/@/store/modules/user";
import { useI18n } from "/@/hooks/web/useI18n";

const { createMessage } = useMessage();

export function checkStatus(status: number, msg: string, errorMessageMode: ErrorMessageMode = "message"): void {
  const userStore = useUserStore();
  let errMessage = "";
  const { t } = useI18n();
  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    case 401:
      errMessage = msg || t("sys.api.errMsg401");
      userStore.logout(true);
      break;
    case 403:
      errMessage = t("sys.api.errMsg403");
      break;
    // 404请求不存在
    case 404:
      errMessage = t("sys.api.errMsg404");
      break;
    case 405:
      errMessage = t("sys.api.errMsg405");
      break;
    case 408:
      errMessage = t("sys.api.errMsg408");
      break;
    case 500:
      errMessage = t("sys.api.errMsg500");
      break;
    case 501:
      errMessage = t("sys.api.errMsg501");
      break;
    case 502:
      errMessage = t("sys.api.errMsg502");
      break;
    case 503:
      errMessage = t("sys.api.errMsg503");
      break;
    case 504:
      errMessage = t("sys.api.errMsg504");
      break;
    case 505:
      errMessage = t("sys.api.errMsg505");
      break;
    default:
  }
  if (errMessage) {
    if (errorMessageMode === "modal") {
    } else if (errorMessageMode === "message") {
      createMessage.error(errMessage);
    }
  }
}
