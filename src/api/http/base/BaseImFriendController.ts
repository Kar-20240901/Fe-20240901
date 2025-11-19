import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface ScrollListDTO {
  backwardFlag?: boolean; // 是否向后查询，默认：false 根据 id，往前查询 true 根据 id，往后查询
  pageSize?: string; // 本次查询的长度，默认：20，格式：int64
  id?: string; // 主键 id，如果为 null，则根据 backwardFlag，来查询最大 id或者最小 id，注意：不会查询该 id的数据，格式：int64
  searchKey?: string; // 搜索内容
  refId?: string; // 关联其他主键 id，格式：int64
  containsCurrentIdFlag?: boolean; // 是否包含当前主键 id，默认：false
  queryMoreFlag?: boolean; // 是否多查询一些数据，backwardFlag 为 true时，往前多查询几条数据，为 false时，往后多查询几条数据，如果不足 pageSize，会补齐并且会额外多查询几条数据
}

export interface BaseImFriendPageVO {
  avatarUrl?: string; // 好友头像
  friendShowId?: string; // 好友显示的 id
  friendUserId?: string; // 好友用户主键 id
  friendShowName?: string; // 好友显示名称
  sessionId?: string; // 会话主键 id，格式：int64
}

// 滚动加载
export function baseImFriendScroll(
  form: ScrollListDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseImFriendPageVO[]>(
    "post",
    baseApi("/base/imFriend/scroll"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 删除好友
export function baseImFriendRemoveFriend(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imFriend/removeFriend"),
    form,
    config
  );
}

export interface BaseImFriendPageDTO {
  current?: string; // 第几页，格式：int64
  pageSize?: string; // 每页显示条数，格式：int64
  friendUserId?: string; // 好友用户主键 id，格式：int64
  searchKey?: string; // 搜索关键字
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询
export function baseImFriendPage(
  form: BaseImFriendPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImFriendPageVO>>(
    "post",
    baseApi("/base/imFriend/page"),
    form,
    config
  );
}
