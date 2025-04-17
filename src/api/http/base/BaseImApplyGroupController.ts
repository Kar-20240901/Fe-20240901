import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImApplyGroupSendDTO {
  applyContent?: string; // 申请内容
  id?: string; // 主键 id，required：true，format：int64
}

// 发送群组申请
export function baseImApplyGroupSend(
  form: BaseImApplyGroupSendDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyGroup/send"),
    form,
    config
  );
}

export interface BaseImApplyGroupInsertOrUpdateDTO {
  name?: string; // 群组名称
  id?: string; // 主键 id，format：int64
}

// 新增/修改
export function baseImApplyGroupInsertOrUpdate(
  form: BaseImApplyGroupInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyGroup/insertOrUpdate"),
    form,
    config
  );
}
