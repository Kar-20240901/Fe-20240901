import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 通过主键id，查看支付状态-本平台
export function basePayPayTradeStatusById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/pay/payTradeStatusById"),
    form,
    config
  );
}

// 通过主键id，查看支付状态-第三方支付平台
export function basePayPayTradeStatusByIdOther(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/pay/payTradeStatusById/other"),
    form,
    config
  );
}
