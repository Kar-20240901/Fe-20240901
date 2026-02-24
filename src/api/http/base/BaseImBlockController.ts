import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImApplyGroupItemDTO {
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
  userId?: string; // 用户主键 id，是否必传：true，格式：int64
}

export interface BaseImBlockGroupAddUserDTO {
  list?: BaseImApplyGroupItemDTO[]; // 群聊信息集合
}

// 取消群组拉黑用户
export function baseImBlockGroupCancelUser(
  form: BaseImBlockGroupAddUserDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imBlock/groupCancelUser"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 取消拉黑好友
export function baseImBlockCancelFriend(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imBlock/cancelFriend"),
    form,
    config
  );
}

// 拉黑好友
export function baseImBlockAddFriend(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imBlock/addFriend"),
    form,
    config
  );
}

// 群组拉黑用户
export function baseImBlockGroupAddUser(
  form: BaseImBlockGroupAddUserDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imBlock/groupAddUser"),
    form,
    config
  );
}
