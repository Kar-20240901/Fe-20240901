import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseServerWorkInfoVO {
  cpuUsage?: string; // CPU使用率（0-100）%
  memoryUsage?: string; // 内存使用率（0-100）%
  diskUsage?: string; // 磁盘使用率（0-100）%
}

// 服务器运行情况
export function baseServerWorkInfo(config?: PureHttpRequestConfig) {
  return http.request<BaseServerWorkInfoVO>(
    "post",
    baseApi("/base/server/workInfo"),
    undefined,
    config
  );
}
