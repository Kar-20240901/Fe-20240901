import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImBlockGroupAddUserDTO {
  groupId?: string; // 群组主键 id，required：true，format：int64
  userId?: string; // 用户主键 id，required：true，format：int64
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

export interface BaseImBlockGroupPageDTO {
  current?: string; // 第几页，format：int64
  groupId?: string; // 群组主键 id，format：int64
  pageSize?: string; // 每页显示条数，format：int64
  userId?: string; // 用户主键 id，format：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImBlockGroupPageVO {
  createTime?: string; // 拉黑时间，format：date-time
  avatarUrl?: string; // 头像地址
  nickname?: string; // 用户昵称
  userId?: string; // 用户主键 id，format：int64
}

// 群组分页排序查询拉黑用户
export function baseImBlockGroupPage(
  form: BaseImBlockGroupPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImBlockGroupPageVO>>(
    "post",
    baseApi("/base/imBlock/groupPage"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 取消拉黑好友
export function baseImBlockCancelFriend(
  form: NotNullId,
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
  form: NotNullId,
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
