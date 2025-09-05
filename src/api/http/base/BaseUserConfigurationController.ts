import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseUserConfigurationDO {
  emailSignUpEnable?: boolean; // 是否启用：邮箱注册功能，默认启用
  userNameSignUpEnable?: boolean; // 是否启用：用户名注册功能，默认启用
  id?: string; // 主键 id，格式：int64
  phoneSignUpEnable?: boolean; // 是否启用：手机号码注册功能，默认启用
}

// 通过主键id，查看详情
export function baseUserConfigurationInfoById(config?: PureHttpRequestConfig) {
  return http.request<BaseUserConfigurationDO>(
    "post",
    baseApi("/base/userConfiguration/infoById"),
    undefined,
    config
  );
}

export interface BaseUserConfigurationInsertOrUpdateDTO {
  emailSignUpEnable?: boolean; // 是否启用：邮箱注册功能
  userNameSignUpEnable?: boolean; // 是否启用：用户名注册功能
  phoneSignUpEnable?: boolean; // 是否启用：手机号码注册功能
}

// 新增/修改
export function baseUserConfigurationInsertOrUpdate(
  form: BaseUserConfigurationInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userConfiguration/insertOrUpdate"),
    form,
    config
  );
}
