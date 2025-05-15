import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
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
  current?: string; // 第几页，format：int64
  pageSize?: string; // 每页显示条数，format：int64
  searchKey?: string; // 搜索关键字
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImFriendPageVO {
  friendName?: string; // 好友显示名称
  friendId?: string; // 好友主键 id，format：int64
  avatarUrl?: string; // 好友头像
  sessionId?: string; // 会话主键 id，format：int64
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
