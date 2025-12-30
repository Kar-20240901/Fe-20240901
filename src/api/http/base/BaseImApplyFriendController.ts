import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImApplyFriendPageDTO {
  current?: string; // 第几页，格式：int64
  applyContent?: string; // 申请内容
  nickname?: string; // 用户昵称
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  searchKey?: string; // 搜索关键字
  toMeFlag?: boolean; // true 查询对我的申请（默认），false 查询我发起的申请
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImApplyFriendPageVO {
  rejectReason?: string; // 拒绝理由
  blockFlag?: boolean; // 是否已经拉黑，备注：只有 dto的 toMeFlag生效时，才会返回该值
  avatarUrl?: string; // 目标用户头像
  applyContent?: string; // 申请内容
  nickname?: string; // 目标用户昵称
  updateTime?: string; // 修改时间，包含：申请时间、取消时间、通过时间、拒绝时间，格式：date-time
  id?: string; // 主键 id，格式：int64
  applyTime?: string; // 申请时间，格式：date-time
  userId?: string; // 目标用户主键 id，用于：拉黑功能，格式：int64
  status?: string; // 状态：101 申请中 201 已通过 301 已拒绝 401 已取消，枚举值：101;201;301;401
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
  current?: string; // 第几页，格式：int64
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  searchKey?: string; // 搜索关键字
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImApplyFriendSearchApplyFriendVO {
  avatarUrl?: string; // 头像地址
  nickname?: string; // 用户昵称
  bio?: string; // 个人简介
  userId?: string; // 用户主键 id，格式：int64
  uuid?: string; // 用户编码
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
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  applyContent?: string; // 申请内容
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

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 取消
export function baseImApplyFriendCancel(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyFriend/cancel"),
    form,
    config
  );
}

export interface BaseImApplyFriendRejectDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  rejectReason?: string; // 拒绝理由
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

// 隐藏
export function baseImApplyFriendHidden(
  form: NotEmptyIdSet,
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
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyFriend/agree"),
    form,
    config
  );
}
