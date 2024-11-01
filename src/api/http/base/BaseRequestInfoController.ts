import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

export interface BaseRequestInfoDO {
  costMs?: string; // 冗余字段：耗时（毫秒），format：int64
  responseValue?: string; // 请求返回的值
  id?: string; // 主键id，format：int64
  requestParam?: string; // 请求的参数
  uri?: string; // 冗余字段：请求的 uri
  successFlag?: boolean; // 冗余字段：请求是否成功
  errorMsg?: string; // 失败信息
}

// 通过主键id，查看详情
export function baseRequestInfoInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseRequestInfoDO>(
    "post",
    baseApi("/base/requestInfo/infoById"),
    form,
    config
  );
}
