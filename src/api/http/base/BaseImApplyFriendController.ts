import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImApplyFriendPageDTO {
  current?: string; // 第几页，format：int64
  applyContent?: string; // 申请内容
  nickname?: string; // 用户昵称
  pageSize?: string; // 每页显示条数，format：int64
  searchKey?: string; // 搜索关键字
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImApplyFriendPageVO {
  avatarUrl?: string; // 目标用户头像
  avatarFileId?: string; // 目标用户头像文件 id，format：int64
  applyContent?: string; // 申请内容
  nickname?: string; // 目标用户昵称
  id?: string; // 主键 id，format：int64
  applyTime?: string; // 申请时间，format：date-time
  status?: string; // 状态：101 申请中 201 已通过 301 已拒绝
}

// 分页排序查询
export function baseImApplyFriendPage(
  form: BaseImApplyFriendPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImApplyFriendPageVO>>(
    "post",
    baseApi("/base/imApplyFriend/page"),
    form,
    config
  );
}

export interface BaseImApplyFriendSearchApplyFriendDTO {
  current?: string; // 第几页，format：int64
  nickname?: string; // 用户昵称
  pageSize?: string; // 每页显示条数，format：int64
  userId?: string; // 用户主键 id，format：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImApplyFriendSearchApplyFriendVO {
  avatarUrl?: string; // 头像地址
  nickname?: string; // 用户昵称
  userId?: string; // 用户主键 id，format：int64
}

// 搜索要添加的好友
export function baseImApplyFriendSearchApplyFriend(
  form: BaseImApplyFriendSearchApplyFriendDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImApplyFriendSearchApplyFriendVO>>(
    "post",
    baseApi("/base/imApplyFriend/searchApplyFriend"),
    form,
    config
  );
}

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

export interface BaseImApplyFriendRejectDTO {
  rejectReason?: string; // 拒绝理由
  id?: string; // 主键 id，required：true，format：int64
}

// 拒绝
export function baseImApplyFriendReject(
  form: BaseImApplyFriendRejectDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyFriend/reject"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 隐藏
export function baseImApplyFriendHidden(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyFriend/hidden"),
    form,
    config
  );
}

// 同意
export function baseImApplyFriendAgree(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyFriend/agree"),
    form,
    config
  );
}
