import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 群员退出-自我
export function baseImGroupRefUserLeaveSelf(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroupRefUser/leaveSelf"),
    form,
    config
  );
}

export interface BaseImGroupRefUserPageDTO {
  current?: string; // 第几页，格式：int64
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  searchKey?: string; // 用户昵称、用户编码
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImGroupRefUserPageVO {
  blockFlag?: boolean; // 是否拉黑
  avatarUrl?: string; // 头像地址
  manageFlag?: boolean; // 是否管理员：可以：审批入群，修改群名称，群头像，踢出群员，禁言群员，不能：赋权另外一个管理员，群组创建人不用该字段，并且群组创建人该字段为 false
  createTime?: string; // 入群时间，格式：date-time
  nickname?: string; // 用户昵称
  bio?: string; // 个人简介
  muteFlag?: boolean; // 是否禁言
  belongFlag?: boolean; // 是否群组创建人
  userId?: string; // 用户主键 id，格式：int64
  uuid?: string; // 用户编码
}

// 群组分页排序查询群员
export function baseImGroupRefUserPage(
  form: BaseImGroupRefUserPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImGroupRefUserPageVO>>(
    "post",
    baseApi("/base/imGroupRefUser/page"),
    form,
    config
  );
}

export interface BaseImGroupRefUserDeleteMuteDTO {
  userIdSet?: string[]; // 需要解除禁言的用户主键 id集合，格式：int64
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
}

// 解除管理员
export function baseImGroupRefUserDeleteManage(
  form: BaseImGroupRefUserDeleteMuteDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroupRefUser/deleteManage"),
    form,
    config
  );
}

export interface BaseImGroupRefUserAddMuteDTO {
  userIdSet?: string[]; // 需要禁言的用户主键 id集合，格式：int64
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
}

// 新增管理员
export function baseImGroupRefUserAddManage(
  form: BaseImGroupRefUserAddMuteDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroupRefUser/addManage"),
    form,
    config
  );
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
