import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseLiveRoomSelfInsertOrUpdateDTO {
  codeFlag?: boolean; // 是否有房间验证码，默认：true，备注：只有在新增的时候才有用
  name?: string; // 实时房间名，是否必传：true
  id?: string; // 主键 id，格式：int64
}

// 新增/修改
export function baseLiveRoomSelfInsertOrUpdate(
  form: BaseLiveRoomSelfInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/liveRoomSelf/insertOrUpdate"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 刷新验证码
export function baseLiveRoomSelfRefreshCode(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/liveRoomSelf/refreshCode"),
    form,
    config
  );
}

export interface BaseLiveRoomSelfPageDTO {
  current?: string; // 第几页，格式：int64
  name?: string; // 房间名
  pageSize?: string; // 每页显示条数，格式：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseLiveRoomDO {
  belongNickname?: string; // 归属用户昵称，格式：date-time
  code?: string; // 房间验证码
  createTime?: string; // 创建时间，格式：date-time
  name?: string; // 实时房间名
  belongId?: string; // 归属用户主键 id，格式：int64
  id?: string; // 房间主键 id，格式：int64
}

// 分页排序查询
export function baseLiveRoomSelfPage(
  form: BaseLiveRoomSelfPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseLiveRoomDO>>(
    "post",
    baseApi("/base/liveRoomSelf/page"),
    form,
    config
  );
}

// 通过主键id，查看详情
export function baseLiveRoomSelfInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseLiveRoomDO>(
    "post",
    baseApi("/base/liveRoomSelf/infoById"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量删除
export function baseLiveRoomSelfDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/liveRoomSelf/deleteByIdSet"),
    form,
    config
  );
}
