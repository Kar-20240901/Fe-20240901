import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImSearchHistoryPageDTO {
  current?: string; // 第几页，格式：int64
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImSearchHistoryVO {
  id?: string; // null，格式：int64
  searchHistory?: string; // 搜索的内容
}

// 搜索历史-分页排序查询
export function baseImSearchHistoryPage(
  form: BaseImSearchHistoryPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImSearchHistoryVO>>(
    "post",
    baseApi("/base/imSearch/history/page"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 搜索历史-删除
export function baseImSearchHistoryDelete(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imSearch/history/delete"),
    form,
    config
  );
}

export interface BaseImSearchBaseDTO {
  searchGroupFlag?: boolean; // 是否搜索群组，默认：true
  searchContentFlag?: boolean; // 是否搜索聊天记录，默认：true
  searchKey?: string; // 搜索内容，是否必传：true
  searchFriendFlag?: boolean; // 是否搜索好友，默认：true
}

export interface BaseImSearchBaseGroupVO {
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

export interface BaseImSearchBaseFriendVO {
  notDisturbFlag?: boolean; // 是否免打扰，备注：只有 dto的 manageQueryFlag生效时，才会返回该值
  friendCreateTime?: string; // 好友创建时间，备注：只有 dto的 manageQueryFlag生效时，才会返回该值，格式：date-time
  blockFlag?: boolean; // 是否已经拉黑，备注：只有 dto的 queryBlockFlag生效时，才会返回该值
  avatarUrl?: string; // 好友头像
  imFriendId?: string; // im好友主键 id，格式：int64
  friendShowId?: string; // 好友显示的 id
  bio?: string; // 个人简介，备注：只有 dto的 manageQueryFlag生效时，才会返回该值
  friendUserId?: string; // 好友用户主键 id，格式：int64
  friendShowName?: string; // 好友显示名称
  sessionId?: string; // 会话主键 id，格式：int64
}

export interface BaseImSearchBaseContentVO {
  showName?: string; // 显示名称
  targetId?: string; // 来源 id，格式：int64
  maxContentCreateTs?: string; // 最大的消息创建时间戳，备注：排序用，格式：int64
  avatarUrl?: string; // 头像地址
  searchCount?: string; // 搜索的消息内容总数，格式：int64
  targetType?: number; // 来源类型，格式：int32
  sessionId?: string; // 会话主键 id，格式：int64
}

export interface BaseImSearchBaseVO {
  groupList?: BaseImSearchBaseGroupVO[]; // 群聊
  friendList?: BaseImSearchBaseFriendVO[]; // 联系人
  contentList?: BaseImSearchBaseContentVO[]; // 聊天记录
}

// 搜索：联系人，群聊，聊天记录
export function baseImSearchBase(
  form: BaseImSearchBaseDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseImSearchBaseVO>(
    "post",
    baseApi("/base/imSearch/base"),
    form,
    config
  );
}

export interface ScrollListDTO {
  backwardFlag?: boolean; // 是否向后查询，默认：false 根据 id，往前查询 true 根据 id，往后查询
  long1?: string; // long值1，格式：int64
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  pageSize?: string; // 本次查询的长度，默认：20，格式：int64
  refIdSet?: string[]; // 关联的 id集合，格式：int64
  id?: string; // 主键 id，如果为 null，则根据 backwardFlag，来查询最大 id或者最小 id，注意：不会查询该 id的数据，格式：int64
  searchKey?: string; // 搜索内容
  refId?: string; // 关联其他主键 id，格式：int64
  boolean1?: boolean; // 布尔值1
  containsCurrentIdFlag?: boolean; // 是否包含当前主键 id，默认：false
  queryMoreFlag?: boolean; // 是否多查询一些数据，backwardFlag 为 true时，往前多查询几条数据，为 false时，往后多查询几条数据，如果不足 pageSize，会补齐并且会额外多查询几条数据
}

// 滚动加载聊天记录
export function baseImSearchBaseContentScroll(
  form: ScrollListDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseImSearchBaseContentVO[]>(
    "post",
    baseApi("/base/imSearch/baseContentScroll"),
    form,
    config
  );
}

// 搜索历史-删除所有
export function baseImSearchHistoryDeleteAll(config?: PureHttpRequestConfig) {
  return http.request<string>(
    "post",
    baseApi("/base/imSearch/history/deleteAll"),
    undefined,
    config
  );
}
