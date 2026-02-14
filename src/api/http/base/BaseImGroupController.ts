import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import type { Page } from "@/model/vo/Page";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

export interface BaseImGroupInfoByIdVO {
  avatarUrl?: string; // 群组头像地址
  bio?: string; // 群组简介
  updateTime?: string; // 修改时间，格式：date-time
  sessionId?: string; // 会话主键 id，格式：int64
  uuid?: string; // 群聊的 id
  normalMuteFlag?: boolean; // 普通成员是否禁言
  updateId?: string; // 修改人id，格式：int64
  createTime?: string; // 创建时间，格式：date-time
  manageFlag?: boolean; // 是否是管理员
  createId?: string; // 创建人id，格式：int64
  name?: string; // 群组名称
  belongId?: string; // 归属者主键 id，格式：int64
  manageMuteFlag?: boolean; // 管理员是否禁言，群主不会被禁言
  belongFlag?: boolean; // 是否是群主
  id?: string; // 主键 id，格式：int64
}

// 通过主键id，查看详情
export function baseImGroupInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseImGroupInfoByIdVO>(
    "post",
    baseApi("/base/imGroup/infoById"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 解散群组
export function baseImGroupDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroup/deleteByIdSet"),
    form,
    config
  );
}

export interface ScrollListDTO {
  backwardFlag?: boolean; // 是否向后查询，默认：false 根据 id，往前查询 true 根据 id，往后查询
  pageSize?: string; // 本次查询的长度，默认：20，格式：int64
  refIdSet?: string[]; // 关联的 id集合，格式：int64
  id?: string; // 主键 id，如果为 null，则根据 backwardFlag，来查询最大 id或者最小 id，注意：不会查询该 id的数据，格式：int64
  searchKey?: string; // 搜索内容
  refId?: string; // 关联其他主键 id，格式：int64
  boolean1?: boolean; // 布尔值1
  containsCurrentIdFlag?: boolean; // 是否包含当前主键 id，默认：false
  queryMoreFlag?: boolean; // 是否多查询一些数据，backwardFlag 为 true时，往前多查询几条数据，为 false时，往后多查询几条数据，如果不足 pageSize，会补齐并且会额外多查询几条数据
}

export interface BaseImGroupPageVO {
  groupShowName?: string; // 显示的名称
  avatarUrl?: string; // 群组头像地址
  groupUuid?: string; // 群组的 uuid
  groupId?: string; // 群组主键 id
  bio?: string; // 群组简介，备注：只有 dto的 manageQueryFlag生效时，才会返回该值
  sessionId?: string; // 会话主键 id，格式：int64
  normalMuteFlag?: boolean; // 普通成员是否禁言，备注：只有 dto的 manageQueryFlag生效时，才会返回该值
  notDisturbFlag?: boolean; // 是否免打扰，备注：只有 dto的 manageQueryFlag生效时，才会返回该值
  manageFlag?: boolean; // 是否是管理员，备注：只有 dto的 manageQueryFlag生效时，才会返回该值
  createTime?: string; // 创建时间，备注：只有 dto的 manageQueryFlag生效时，才会返回该值，格式：date-time
  muteFlag?: boolean; // 是否被禁言，备注：只有 dto的 manageQueryFlag生效时，才会返回该值
  manageMuteFlag?: boolean; // 管理员是否禁言，群主不会被禁言，备注：只有 dto的 manageQueryFlag生效时，才会返回该值
  belongFlag?: boolean; // 是否是群主，备注：只有 dto的 manageQueryFlag生效时，才会返回该值
}

// 滚动加载
export function baseImGroupScroll(
  form: ScrollListDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseImGroupPageVO[]>(
    "post",
    baseApi("/base/imGroup/scroll"),
    form,
    config
  );
}

export interface BaseImGroupInsertOrUpdateDTO {
  name?: string; // 群组名称，是否必传：true
  manageMuteFlag?: boolean; // 管理员是否禁言，群主不会被禁言
  bio?: string; // 群组简介
  id?: string; // 主键 id，格式：int64
  normalMuteFlag?: boolean; // 普通成员是否禁言
}

// 新增/修改
export function baseImGroupInsertOrUpdate(
  form: BaseImGroupInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroup/insertOrUpdate"),
    form,
    config
  );
}

export interface BaseImGroupRemoveUserDTO {
  userIdSet?: string[]; // 用户主键 id集合，是否必传：true，格式：int64
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
}

// 踢出群员
export function baseImGroupRemoveUser(
  form: BaseImGroupRemoveUserDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroup/removeUser"),
    form,
    config
  );
}

export interface DictVO {
  l1?: string; // Long-1，格式：int64
  str1?: string; // 字符串-1
  l2?: string; // Long-2，格式：int64
  str2?: string; // 字符串-2
  name?: string; // 显示用
  id?: string; // 传值用，格式：int64
}

// 下拉列表
export function baseImGroupDictList(config?: PureHttpRequestConfig) {
  return http.request<Page<DictVO>>(
    "post",
    baseApi("/base/imGroup/dictList"),
    undefined,
    config
  );
}

export interface BaseImGroupChangeBelongIdDTO {
  newBelongId?: string; // 新的群主用户主键 id，是否必传：true，格式：int64
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
}

// 修改群主
export function baseImGroupChangeBelongId(
  form: BaseImGroupChangeBelongIdDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroup/changeBelongId"),
    form,
    config
  );
}

export interface BaseImGroupPageDTO {
  current?: string; // 第几页，格式：int64
  groupId?: string; // 群组主键 id，格式：int64
  manageQueryFlag?: boolean; // 是否是群组管理查询
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  onlyQueryBelongFlag?: boolean; // 只查询我创建的群
  searchKey?: string; // 搜索关键字
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询
export function baseImGroupPage(
  form: BaseImGroupPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImGroupPageVO>>(
    "post",
    baseApi("/base/imGroup/page"),
    form,
    config
  );
}
