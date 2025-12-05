import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
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
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  remark?: string; // 备注
  type?: number; // 文件存储类型，格式：int32
  uploadEndpoint?: string; // 上传的端点
  bucketPublicName?: string; // 公开类型的桶名
  current?: string; // 第几页，格式：int64
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
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  type?: number; // 文件存储类型，格式：int32
  uploadEndpoint?: string; // 上传的端点
  bucketPublicName?: string; // 公开类型的桶名
  updateId?: string; // 修改人id，格式：int64
  createTime?: string; // 创建时间，格式：date-time
  accessKey?: string; // 钥匙
  createId?: string; // 创建人id，格式：int64
  name?: string; // 文件存储配置名
  id?: string; // 主键 id，格式：int64
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
  id?: string; // 主键 id，是否必传：true，格式：int64
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
  secretKey?: string; // 秘钥，是否必传：true
  accessKey?: string; // 钥匙，是否必传：true
  name?: string; // 文件存储配置名，是否必传：true
  remark?: string; // 备注
  id?: string; // 主键 id，格式：int64
  type?: number; // 文件存储类型，是否必传：true，格式：int32
  uploadEndpoint?: string; // 上传的端点，是否必传：true
  enableFlag?: boolean; // 是否启用
  bucketPrivateName?: string; // 私有类型的桶名，是否必传：true
  publicDownloadEndpoint?: string; // 公开下载的端点，是否必传：true
  bucketPublicName?: string; // 公开类型的桶名，是否必传：true
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
