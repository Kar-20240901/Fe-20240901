import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除
export function baseFileStorageConfigurationDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/fileStorageConfiguration/deleteByIdSet"),
    form,
    config
  );
}

export interface BaseFileStorageConfigurationPageDTO {
  defaultFlag?: boolean; // 是否是默认存储，备注：只会有一个默认存储
  pageSize?: string; // 每页显示条数，format：int64
  remark?: string; // 备注
  type?: number; // 文件存储类型，format：int32
  uploadEndpoint?: string; // 上传的端点
  bucketPublicName?: string; // 公开类型的桶名
  current?: string; // 第几页，format：int64
  accessKey?: string; // 钥匙
  name?: string; // 文件存储配置名
  enableFlag?: boolean; // 是否启用
  bucketPrivateName?: string; // 私有类型的桶名
  order?: MyOrderDTO; // 排序字段
  publicDownloadEndpoint?: string; // 公开下载的端点
}

export interface BaseFileStorageConfigurationDO {
  defaultFlag?: boolean; // 是否是默认存储，备注：只会有一个默认存储
  secretKey?: string; // 秘钥
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  type?: number; // 文件存储类型，format：int32
  uploadEndpoint?: string; // 上传的端点
  bucketPublicName?: string; // 公开类型的桶名
  updateId?: string; // 修改人id，format：int64
  createTime?: string; // 创建时间，format：date-time
  accessKey?: string; // 钥匙
  createId?: string; // 创建人id，format：int64
  name?: string; // 文件存储配置名
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
  bucketPrivateName?: string; // 私有类型的桶名
  publicDownloadEndpoint?: string; // 公开下载的端点
}

// 分页排序查询
export function baseFileStorageConfigurationPage(
  form: BaseFileStorageConfigurationPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseFileStorageConfigurationDO>>(
    "post",
    baseApi("/base/fileStorageConfiguration/page"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 通过主键id，查看详情
export function baseFileStorageConfigurationInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseFileStorageConfigurationDO>(
    "post",
    baseApi("/base/fileStorageConfiguration/infoById"),
    form,
    config
  );
}

export interface BaseFileStorageConfigurationInsertOrUpdateDTO {
  defaultFlag?: boolean; // 是否是默认存储，备注：只会有一个默认存储
  secretKey?: string; // 秘钥，required：true
  accessKey?: string; // 钥匙，required：true
  name?: string; // 文件存储配置名，required：true
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  type?: number; // 文件存储类型，required：true，format：int32
  uploadEndpoint?: string; // 上传的端点，required：true
  enableFlag?: boolean; // 是否启用
  bucketPrivateName?: string; // 私有类型的桶名，required：true
  publicDownloadEndpoint?: string; // 公开下载的端点，required：true
  bucketPublicName?: string; // 公开类型的桶名，required：true
}

// 新增/修改
export function baseFileStorageConfigurationInsertOrUpdate(
  form: BaseFileStorageConfigurationInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/fileStorageConfiguration/insertOrUpdate"),
    form,
    config
  );
}
