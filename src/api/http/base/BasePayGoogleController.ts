import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BasePayGooglePaySuccessDTO {
  id?: string; // 主键 id，是否必传：true，格式：int64
  basePayConfigurationId?: string; // 支付配置主键 id，是否必传：true，格式：int64
  token?: string; // 购买成功后 Purchase对象的 getPurchaseToken()，是否必传：true
}

// 支付成功的回调，备注：由客户端调用
export function basePayGooglePaySuccess(
  form: BasePayGooglePaySuccessDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<boolean>(
    "post",
    baseApi("/base/payGoogle/paySuccess"),
    form,
    config
  );
}

export interface BasePayGooglePayConsumeDTO {
  id?: string; // 主键 id，是否必传：true，格式：int64
  basePayConfigurationId?: string; // 支付配置主键 id，是否必传：true，格式：int64
}

// 支付核销的回调，备注：由客户端调用
export function basePayGooglePayConsume(
  form: BasePayGooglePayConsumeDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<boolean>(
    "post",
    baseApi("/base/payGoogle/payConsume"),
    form,
    config
  );
}
