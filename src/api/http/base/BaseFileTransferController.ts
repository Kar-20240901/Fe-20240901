import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseFileTransferPageDTO {
  current?: string; // 第几页，format：int64
  pageSize?: string; // 每页显示条数，format：int64
  showFileName?: string; // 冗余字段：展示用的文件名，默认为：原始文件名（包含文件类型）
  type?: string; // 类型：101 上传 201 下载
  order?: MyOrderDTO; // 排序字段
}

export interface BaseFileTransferDO {
  bucketName?: string; // 冗余字段：桶名，例如：be-bucket
  chunkTotal?: number; // 总分片个数，format：int32
  storageConfigurationId?: string; // 冗余字段：存储文件配置主键 id，format：int64
  chunkSize?: string; // 每个分片的大小，format：int64
  newFileName?: string; // 冗余字段：新的文件名（包含文件类型），例如：uuid.xxx
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  type?: string; // 类型：101 上传 201 下载
  userId?: string; // 用户主键 id，format：int64
  uri?: string; // 冗余字段：文件完整路径（包含文件类型，不包含请求端点），例如：avatar/uuid.xxx
  updateId?: string; // 修改人id，format：int64
  fileSign?: string; // 文件签名，用于校验文件是否完整，一般采用 md5的方式
  createTime?: string; // 创建时间，format：date-time
  fileSize?: string; // 冗余字段：文件大小，format：int64
  createId?: string; // 创建人id，format：int64
  showFileName?: string; // 冗余字段：展示用的文件名，默认为：原始文件名（包含文件类型）
  storageType?: number; // 冗余字段：存放文件的服务器类型：101 阿里云oss 201 minio，format：int32
  id?: string; // 主键id，format：int64
  enableFlag?: boolean; // 是否启用
  fileId?: string; // 文件主键 id，format：int64
  status?: string; // 状态：101 传输中 201 传输暂停 301 传输完成 401 传输取消 501 合并中 601 合并完成
}

// 分页排序查询
export function baseFileTransferPage(
  form: BaseFileTransferPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseFileTransferDO>>(
    "post",
    baseApi("/base/fileTransfer/page"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 通过主键id，查看详情
export function baseFileTransferInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseFileTransferDO>(
    "post",
    baseApi("/base/fileTransfer/infoById"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除
export function baseFileTransferDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/fileTransfer/deleteByIdSet"),
    form,
    config
  );
}
