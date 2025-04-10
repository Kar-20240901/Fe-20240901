import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

export interface BaseBulletinDO {
  updateId?: string; // 修改人id，format：int64
  publishTime?: string; // 发布时间，format：date-time
  createTime?: string; // 创建时间，format：date-time
  createId?: string; // 创建人id，format：int64
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  title?: string; // 标题
  enableFlag?: boolean; // 是否启用
  content?: string; // 公告内容（富文本）
  status?: string; // 公告状态：101 草稿 201 公示
}

// 通过主键id，查看详情
export function baseBulletinInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseBulletinDO>(
    "post",
    baseApi("/base/bulletin/infoById"),
    form,
    config
  );
}

// 当前用户查看公告详情
export function baseBulletinUserSelfInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseBulletinDO>(
    "post",
    baseApi("/base/bulletin/userSelfInfoById"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 撤回
export function baseBulletinRevoke(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/bulletin/revoke"),
    form,
    config
  );
}

export interface BaseBulletinInsertOrUpdateDTO {
  publishTime?: string; // 发布时间，required：true，format：date-time
  id?: string; // 主键 id，format：int64
  title?: string; // 标题，required：true
  enableFlag?: boolean; // 是否启用
  content?: string; // 公告内容（富文本），required：true
}

// 新增/修改
export function baseBulletinInsertOrUpdate(
  form: BaseBulletinInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/bulletin/insertOrUpdate"),
    form,
    config
  );
}

// 当前用户更新公告最近查看时间
export function baseBulletinUserSelfUpdateReadTime(
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/bulletin/userSelfUpdateReadTime"),
    undefined,
    config
  );
}

// 批量删除
export function baseBulletinDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/bulletin/deleteByIdSet"),
    form,
    config
  );
}

export interface BaseBulletinPageDTO {
  ptEndTime?: string; // 发布时间范围查询：结束时间，format：date-time
  current?: string; // 第几页，format：int64
  userSelfFlag?: boolean; // 是否是用户自我查询，默认：false
  ptBeginTime?: string; // 发布时间范围查询：起始时间，format：date-time
  pageSize?: string; // 每页显示条数，format：int64
  title?: string; // 标题
  enableFlag?: boolean; // 是否启用
  content?: string; // 公告内容（富文本）
  order?: MyOrderDTO; // 排序字段
  status?: string; // 公告状态：101 草稿 201 公示
}

// 分页排序查询
export function baseBulletinPage(
  form: BaseBulletinPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseBulletinDO>>(
    "post",
    baseApi("/base/bulletin/page"),
    form,
    config
  );
}

export interface BaseBulletinUserSelfPageDTO {
  ptEndTime?: string; // 发布时间范围查询：结束时间，format：date-time
  current?: string; // 第几页，format：int64
  ptBeginTime?: string; // 发布时间范围查询：起始时间，format：date-time
  pageSize?: string; // 每页显示条数，format：int64
  title?: string; // 标题
  content?: string; // 公告内容（富文本）
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询：当前用户可以查看的公告
export function baseBulletinUserSelfPage(
  form: BaseBulletinUserSelfPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseBulletinDO>>(
    "post",
    baseApi("/base/bulletin/userSelfPage"),
    form,
    config
  );
}

// 当前用户可以查看的公告总数
export function baseBulletinUserSelfCount(config?: PureHttpRequestConfig) {
  return http.request<string>(
    "post",
    baseApi("/base/bulletin/userSelfCount"),
    undefined,
    config
  );
}

// 发布
export function baseBulletinPublish(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/bulletin/publish"),
    form,
    config
  );
}
