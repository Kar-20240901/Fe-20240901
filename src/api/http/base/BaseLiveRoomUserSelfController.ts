import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

export interface BaseLiveRoomUserSelfInfoByIdVO {
  socketRefUserId?: string; // 套接字关联用户主键 id，格式：int64
  firstBlobStr?: string; // 第一个 blob，用于播放时，需要先传递该 blob
  createTime?: string; // 创建时间，格式：date-time
  avatarUrl?: string; // 用户头像 url
  nickname?: string; // 用户昵称
  id?: string; // 主键 id，格式：int64
  userId?: string; // 用户主键 id，格式：int64
}

// 通过主键id，查看详情
export function baseLiveRoomUserSelfInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseLiveRoomUserSelfInfoByIdVO>(
    "post",
    baseApi("/base/liveRoomUserSelf/infoById"),
    form,
    config
  );
}

export interface BaseLiveRoomUserSelfPageDTO {
  current?: string; // 第几页，格式：int64
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  searchKey?: string; // 搜索关键字
  userId?: string; // 用户主键id，格式：int64
  roomId?: string; // 房间主键 id，是否必传：true，格式：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseLiveRoomUserSelfPageVO {
  socketRefUserId?: string; // 套接字关联用户主键 id，格式：int64
  firstBlobStr?: string; // 第一个 blob，用于播放时，需要先传递该 blob
  createTime?: string; // 创建时间，格式：date-time
  avatarUrl?: string; // 用户头像 url
  nickname?: string; // 用户昵称
  id?: string; // 主键 id，格式：int64
  userId?: string; // 用户主键 id，格式：int64
}

// 分页排序查询
export function baseLiveRoomUserSelfPage(
  form: BaseLiveRoomUserSelfPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseLiveRoomUserSelfPageVO>>(
    "post",
    baseApi("/base/liveRoomUserSelf/page"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量删除
export function baseLiveRoomUserSelfDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/liveRoomUserSelf/deleteByIdSet"),
    form,
    config
  );
}
