import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseEmailConfigurationInsertOrUpdateDTO {
  port?: number; // 端口，required：true，format：int32
  pass?: string; // 发送人密码，备注：如果为 null，则表示不修改，但是新增的时候，必须有值
  sslFlag?: boolean; //  是否使用：SSL，required：true
  contentPre?: string; // 正文前缀
  fromEmail?: string; // 发送人邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，required：true
}

// 新增/修改
export function baseEmailConfigurationInsertOrUpdate(
  form: BaseEmailConfigurationInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/emailConfiguration/insertOrUpdate"),
    form,
    config
  );
}

export interface BaseEmailConfigurationDO {
  port?: number; // 端口，format：int32
  pass?: string; // 发送人密码
  sslFlag?: boolean; //  是否使用：SSL
  id?: string; // 主键 id，format：int64
  contentPre?: string; // 正文前缀
  fromEmail?: string; // 发送人邮箱
}

// 通过主键id，查看详情
export function baseEmailConfigurationInfoById(config?: PureHttpRequestConfig) {
  return http.request<BaseEmailConfigurationDO>(
    "post",
    baseApi("/base/emailConfiguration/infoById"),
    undefined,
    config
  );
}
