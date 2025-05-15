import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImGroupRefUserPageDTO {
  current?: string; // 第几页，format：int64
  groupId?: string; // 群组主键 id，format：int64
  nickname?: string; // 用户昵称
  pageSize?: string; // 每页显示条数，format：int64
  userId?: string; // 用户主键 id，format：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImGroupRefUserPageVO {
  avatarUrl?: string; // 头像地址
  nickname?: string; // 用户昵称
  userId?: string; // 用户主键 id，format：int64
}

// 群组分页排序查询禁言用户
export function baseImGroupRefUserPageMute(
  form: BaseImGroupRefUserPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImGroupRefUserPageVO>>(
    "post",
    baseApi("/base/imGroupRefUser/pageMute"),
    form,
    config
  );
}

export interface BaseImGroupRefUserMutePageDTO {
  current?: string; // 第几页，format：int64
  groupId?: string; // 群组主键 id，required：true，format：int64
  nickname?: string; // 用户昵称
  pageSize?: string; // 每页显示条数，format：int64
  userId?: string; // 用户主键 id，format：int64
  order?: MyOrderDTO; // 排序字段
}

// 群组分页排序查询群员
export function baseImGroupRefUserPage(
  form: BaseImGroupRefUserMutePageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImGroupRefUserPageVO>>(
    "post",
    baseApi("/base/imGroupRefUser/page"),
    form,
    config
  );
}

export interface BaseImGroupRefUserAddMuteDTO {
  groupId?: string; // 群组主键 id，required：true，format：int64
  userId?: string; // 需要禁言的人员主键 id，format：int64
}

// 新增禁言
export function baseImGroupRefUserAddMute(
  form: BaseImGroupRefUserAddMuteDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroupRefUser/addMute"),
    form,
    config
  );
}

export interface BaseImGroupRefUserDeleteMuteDTO {
  groupId?: string; // 群组主键 id，required：true，format：int64
  userId?: string; // 需要解除禁言的人员主键 id，format：int64
}

// 解除禁言
export function baseImGroupRefUserDeleteMute(
  form: BaseImGroupRefUserDeleteMuteDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroupRefUser/deleteMute"),
    form,
    config
  );
}
