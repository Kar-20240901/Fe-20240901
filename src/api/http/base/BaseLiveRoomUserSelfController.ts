import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

export interface BaseLiveRoomUserSelfInfoByIdVO {
  socketRefUserId?: string; // 套接字关联用户主键 id，format：int64
  createTime?: string; // 创建时间，format：date-time
  avatarUrl?: string; // 用户头像 url
  nickname?: string; // 用户昵称
  id?: string; // 主键 id，format：int64
  userId?: string; // 用户主键 id，format：int64
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
  current?: string; // 第几页，format：int64
  pageSize?: string; // 每页显示条数，format：int64
  searchKey?: string; // 搜索关键字
  userId?: string; // 用户主键id，format：int64
  roomId?: string; // 房间主键 id，required：true，format：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseLiveRoomUserSelfPageVO {
  socketRefUserId?: string; // 套接字关联用户主键 id，format：int64
  createTime?: string; // 创建时间，format：date-time
  avatarUrl?: string; // 用户头像 url
  nickname?: string; // 用户昵称
  id?: string; // 主键 id，format：int64
  userId?: string; // 用户主键 id，format：int64
  firstBlobStr?: string; //
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
  idSet?: string[]; // 主键 idSet，required：true，format：int64
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
