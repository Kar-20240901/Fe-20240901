import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImApplyGroupHiddenGroupDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
}

// 隐藏-群组
export function baseImApplyGroupHiddenGroup(
  form: BaseImApplyGroupHiddenGroupDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyGroup/hiddenGroup"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 隐藏-自我
export function baseImApplyGroupHiddenSelf(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyGroup/hiddenSelf"),
    form,
    config
  );
}

export interface BaseImApplyGroupSendDTO {
  applyContent?: string; // 申请内容
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 发送入群申请
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

export interface BaseImApplyGroupPageSelfDTO {
  current?: string; // 第几页，格式：int64
  groupName?: string; // 群组名
  applyContent?: string; // 申请内容
  pageSize?: string; // 每页显示条数，格式：int64
  searchKey?: string; // 搜索关键字
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImApplyGroupPageSelfVO {
  groupName?: string; // 目标群组名
  avatarUrl?: string; // 目标群组头像
  avatarFileId?: string; // 目标群组头像文件 id，格式：int64
  applyContent?: string; // 申请内容
  id?: string; // 主键 id，格式：int64
  applyTime?: string; // 申请时间，格式：date-time
  status?: string; // 状态：101 申请中 201 已通过 301 已拒绝，枚举值：101;201;301;401
}

// 分页排序查询-我的入群申请
export function baseImApplyGroupPageSelf(
  form: BaseImApplyGroupPageSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImApplyGroupPageSelfVO>>(
    "post",
    baseApi("/base/imApplyGroup/pageSelf"),
    form,
    config
  );
}

export interface BaseImApplyFriendSearchApplyGroupDTO {
  groupShowId?: string; // 群组展示的id，格式：int64
  current?: string; // 第几页，格式：int64
  name?: string; // 群组名称
  pageSize?: string; // 每页显示条数，格式：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImApplyFriendSearchApplyGroupVO {
  avatarUrl?: string; // 头像地址
  groupId?: string; // 群组主键 id，格式：int64
  name?: string; // 群组名称
}

// 搜索要添加的群组
export function baseImApplyGroupSearchApplyGroup(
  form: BaseImApplyFriendSearchApplyGroupDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImApplyFriendSearchApplyGroupVO>>(
    "post",
    baseApi("/base/imApplyGroup/searchApplyGroup"),
    form,
    config
  );
}

export interface BaseImApplyGroupRejectDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  rejectReason?: string; // 拒绝理由
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
}

// 拒绝
export function baseImApplyGroupReject(
  form: BaseImApplyGroupRejectDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyGroup/reject"),
    form,
    config
  );
}

export interface BaseImApplyGroupAgreeDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
}

// 同意
export function baseImApplyGroupAgree(
  form: BaseImApplyGroupAgreeDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imApplyGroup/agree"),
    form,
    config
  );
}

export interface BaseImApplyGroupPageGroupDTO {
  current?: string; // 第几页，格式：int64
  groupId?: string; // 群组主键 id，格式：int64
  pageSize?: string; // 每页显示条数，格式：int64
  searchKey?: string; // 搜索关键字
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImApplyGroupPageGroupVO {
  avatarUrl?: string; // 目标用户头像
  avatarFileId?: string; // 目标用户头像文件 id，格式：int64
  applyContent?: string; // 申请内容
  nickname?: string; // 目标用户昵称
  id?: string; // 主键 id，格式：int64
  applyTime?: string; // 申请时间，格式：date-time
  status?: string; // 状态：101 申请中 201 已通过 301 已拒绝，枚举值：101;201;301;401
}

// 分页排序查询-群组的入群申请
export function baseImApplyGroupPageGroup(
  form: BaseImApplyGroupPageGroupDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImApplyGroupPageGroupVO>>(
    "post",
    baseApi("/base/imApplyGroup/pageGroup"),
    form,
    config
  );
}
