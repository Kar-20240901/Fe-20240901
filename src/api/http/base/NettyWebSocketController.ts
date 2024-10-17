import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullIdAndIntegerValue {
  id?: string; // 主键 id，required：true，format：int64
  value?: number; // 值，required：true，format：int32
}

// 通过主键 id，获取：webSocket连接地址，格式：scheme://ip:port/path?code=xxx
export function nettyWebSocketGetWebSocketUrlById(
  form: NotNullIdAndIntegerValue,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/netty/webSocket/getWebSocketUrlById"),
    form,
    config
  );
}

// 获取：所有 webSocket连接地址，格式：scheme://ip:port/path?code=xxx
export function nettyWebSocketGetAllWebSocketUrl(
  config?: PureHttpRequestConfig
) {
  return http.request<string[]>(
    "post",
    baseApi("/netty/webSocket/getAllWebSocketUrl"),
    undefined,
    config
  );
}
