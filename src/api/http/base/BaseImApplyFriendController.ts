import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImApplyFriendSendDTO {
  applyContent?: string; // 申请内容
  id?: string; // 主键 id，required：true，format：int64
}

// 发送好友申请
export function baseImApplyFriendSend(
  form: BaseImApplyFriendSendDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyFriend/send"),
    form,
    config
  );
}
