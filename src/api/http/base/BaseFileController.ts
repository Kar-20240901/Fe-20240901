import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseFilePageSelfDTO {
  originFileName?: string; // 文件原始名（包含文件类型）
  globalFlag?: boolean; // 全局搜索
  publicFlag?: boolean; // 是否公开访问
  pageSize?: string; // 每页显示条数，format：int64
  pid?: string; // 父节点id（顶级则为0），format：int64
  remark?: string; // 备注
  type?: string; // 类型
  current?: string; // 第几页，format：int64
  uploadType?: number; // 文件上传类型，format：int32
  storageType?: number; // 存放文件的服务器类型，format：int32
  showFileName?: string; // 展示用的文件名，默认为：原始文件名（包含文件类型）
  refId?: string; // 关联的 id，format：int64
  backUpFlag?: boolean; // 返回上级
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BaseFileDO {
  bucketName?: string; // 桶名，例如：be-bucket
  originFileName?: string; // 文件原始名（包含文件类型）
  publicFlag?: boolean; // 是否公开访问
  remark?: string; // 备注
  pid?: string; // 上级文件夹的文件主键 id，默认为 0，format：int64
  type?: string; // 类型
  oldUri?: string; // 旧的文件完整路径，用于：文件复制时使用
  updateId?: string; // 修改人id，format：int64
  children?: BaseFileDO[]; // 子节点
  uploadType?: number; // 文件上传类型，format：int32
  belongId?: string; // 归属者用户主键 id（拥有全部权限），format：int64
  showFileName?: string; // 展示用的文件名，默认为：原始文件名（包含文件类型）
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
  oldBucketName?: string; // 旧的桶名，用于：文件复制时使用
  orderNo?: number; // 排序号（值越大越前面，默认为 0），format：int32
  storageConfigurationId?: string; // 存储文件配置主键 id，format：int64
  newFileName?: string; // 新的文件名（包含文件类型），例如：uuid.xxx
  updateTime?: string; // 修改时间，format：date-time
  uri?: string; // 文件完整路径（包含文件类型，不包含请求端点），例如：avatar/uuid.xxx
  createTime?: string; // 创建时间，format：date-time
  fileSize?: string; // 文件大小，单位：byte，format：int64
  createId?: string; // 创建人id，format：int64
  storageType?: number; // 存放文件的服务器类型，format：int32
  extraJson?: string; // 额外信息（json格式）
  refId?: string; // 关联的 id，format：int64
  fileExtName?: string; // 文件类型（不含点），备注：这个是读取文件流的头部信息获得文件类型
}

// 分页排序查询-自我
export function baseFilePageSelf(
  form: BaseFilePageSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseFileDO>>(
    "post",
    baseApi("/base/file/page/self"),
    form,
    config
  );
}

export interface BaseFileCreateFolderSelfSelfDTO {
  pid?: string; // 父节点id（顶级则为0），format：int64
  folderName?: string; // 文件夹名，required：true
}

// 创建：文件夹-自我
export function baseFileCreateFolderSelf(
  form: BaseFileCreateFolderSelfSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/file/createFolder/self"),
    form,
    config
  );
}

export interface BaseFileUpdateSelfDTO {
  fileName?: string; // 文件名
  id?: string; // 主键 id，required：true，format：int64
}

// 修改：文件和文件夹-自我
export function baseFileUpdateSelf(
  form: BaseFileUpdateSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/file/update/self"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 下载文件：私有
export function baseFilePrivateDownload(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<undefined>(
    "post",
    baseApi("/base/file/privateDownload"),
    form,
    config
  );
}

export interface BaseFilePageDTO {
  originFileName?: string; // 文件原始名（包含文件类型）
  globalFlag?: boolean; // 全局搜索
  publicFlag?: boolean; // 是否公开访问
  pageSize?: string; // 每页显示条数，format：int64
  pid?: string; // 父节点id（顶级则为0），format：int64
  remark?: string; // 备注
  type?: string; // 类型
  current?: string; // 第几页，format：int64
  uploadType?: number; // 文件上传类型，format：int32
  storageType?: number; // 存放文件的服务器类型，format：int32
  showFileName?: string; // 展示用的文件名，默认为：原始文件名（包含文件类型）
  belongId?: string; // 归属者用户主键 id（拥有全部权限），format：int64
  refId?: string; // 关联的 id，format：int64
  backUpFlag?: boolean; // 返回上级
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

// 查询：树结构
export function baseFilePageTree(
  form: BaseFilePageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseFileDO[]>(
    "post",
    baseApi("/base/file/page/tree"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除文件：公有和私有，文件和文件夹
export function baseFileRemoveByFileIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/file/removeByFileIdSet"),
    form,
    config
  );
}

export interface LongObjectMapVOString {
  map?: object; // map对象
}

// 批量获取：公开文件的 url
export function baseFileGetPublicUrl(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<LongObjectMapVOString>(
    "post",
    baseApi("/base/file/getPublicUrl"),
    form,
    config
  );
}

export interface BaseFileCopySelfDTO {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
  pid?: string; // 父节点id（顶级则为0），required：true，format：int64
}

// 复制：文件和文件夹-自我
export function baseFileCopySelf(
  form: BaseFileCopySelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/file/copy/self"),
    form,
    config
  );
}

// 查询：树结构-自我
export function baseFilePageTreeSelf(
  form: BaseFilePageSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseFileDO[]>(
    "post",
    baseApi("/base/file/page/tree/self"),
    form,
    config
  );
}

// 分页排序查询
export function baseFilePage(
  form: BaseFilePageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseFileDO>>(
    "post",
    baseApi("/base/file/page"),
    form,
    config
  );
}

export interface BaseFileMoveSelfDTO {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
  pid?: string; // 父节点id（顶级则为0），required：true，format：int64
}

// 移动：文件和文件夹-自我
export function baseFileMoveSelf(
  form: BaseFileMoveSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/file/move/self"),
    form,
    config
  );
}
