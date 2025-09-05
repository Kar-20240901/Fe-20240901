import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImSearchHistoryPageDTO {
  current?: string; // 第几页，格式：int64
  pageSize?: string; // 每页显示条数，格式：int64
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
  searchKey?: string; // 搜索内容，是否必传：true
}

export interface BaseImSearchBaseGroupVO {
  groupName?: string; // 显示的名称
  avatarUrl?: string; // 头像地址
  groupId?: string; // 群组主键 id，格式：int64
  sessionId?: string; // 会话主键 id，格式：int64
}

export interface BaseImSearchBaseFriendVO {
  friendName?: string; // 好友显示名称
  friendId?: string; // 好友主键 id，格式：int64
  avatarUrl?: string; // 好友头像
  sessionId?: string; // 会话主键 id，格式：int64
}

export interface BaseImSearchBaseContentVO {
  showName?: string; // 显示名称
  targetId?: string; // 来源 id，格式：int64
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

// 搜索历史-删除所有
export function baseImSearchHistoryDeleteAll(config?: PureHttpRequestConfig) {
  return http.request<string>(
    "post",
    baseApi("/base/imSearch/history/deleteAll"),
    undefined,
    config
  );
}
