import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseFilePageSelfDTO {
  originFileName?: string; // 文件原始名（包含文件类型）
  globalFlag?: boolean; // 全局搜索
  publicFlag?: boolean; // 是否公开访问
  pageSize?: string; // 每页显示条数，格式：int64
  pid?: string; // 父节点id（顶级则为0），格式：int64
  remark?: string; // 备注
  type?: string; // 类型，枚举值：101;201
  current?: string; // 第几页，格式：int64
  uploadType?: number; // 文件上传类型，格式：int32
  storageType?: number; // 存放文件的服务器类型，格式：int32
  showFileName?: string; // 展示用的文件名，默认为：原始文件名（包含文件类型）
  refId?: string; // 关联的 id，格式：int64
  backUpFlag?: boolean; // 返回上级
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BaseFileDO {
  bucketName?: string; // 桶名，例如：be-bucket
  originFileName?: string; // 文件原始名（包含文件类型）
  publicFlag?: boolean; // 是否公开访问
  remark?: string; // 备注
  pid?: string; // 上级文件夹的文件主键 id，默认为 0，格式：int64
  type?: string; // 类型，枚举值：101;201
  oldUri?: string; // 旧的文件完整路径，用于：文件复制时使用
  updateId?: string; // 修改人id，格式：int64
  children?: BaseFileDO[]; // 子节点
  uploadType?: number; // 文件上传类型，格式：int32
  belongId?: string; // 归属者用户主键 id，只用于删除操作，格式：int64
  showFileName?: string; // 展示用的文件名，默认为：原始文件名（包含文件类型）
  id?: string; // 主键 id，格式：int64
  enableFlag?: boolean; // 是否启用
  oldBucketName?: string; // 旧的桶名，用于：文件复制时使用
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  storageConfigurationId?: string; // 存储文件配置主键 id，格式：int64
  newFileName?: string; // 新的文件名（包含文件类型），例如：uuid.xxx
  updateTime?: string; // 修改时间，格式：date-time
  folderSize?: string; // 文件夹大小，格式：int64
  uri?: string; // 文件完整路径（包含文件类型，不包含请求端点），例如：avatar/uuid.xxx
  uploadFlag?: boolean; // 是否还在上传中，目的：无法操作
  createTime?: string; // 创建时间，格式：date-time
  pidPathStr?: string; // 父id组合，例如：|0||1||2|，备注：不包含本级，但是包含顶级：0
  fileSize?: string; // 文件大小，单位：byte，格式：int64
  createId?: string; // 创建人id，格式：int64
  storageType?: number; // 存放文件的服务器类型，格式：int32
  extraJson?: string; // 额外信息（json格式）
  refId?: string; // 关联的 id，格式：int64
  fileExtName?: string; // 文件类型（不含点），备注：这个是读取文件流的头部信息获得文件类型
}

export interface BaseFilePageSelfVO {
  records?: BaseFileDO[]; // 数据
  pidList?: string[]; // 父id组合集合，例如：[0,1,2]，备注：包含本级，并且包含顶级：0，并且和 pathList一一对应，格式：int64
  pathList?: string[]; // 路径字符串集合，例如：/根目录/测试1/测试1-1，备注：包含本级，并且包含顶级：根目录，并且和 pidList一一对应
  backUpPid?: string; // 返回上一级的 pid，格式：int64
}

// 分页排序查询-自我
export function baseFilePageSelf(
  form: BaseFilePageSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseFilePageSelfVO>(
    "post",
    baseApi("/base/file/page/self"),
    form,
    config
  );
}

export interface BaseFileCreateFolderSelfSelfDTO {
  pid?: string; // 父节点id（顶级则为0），格式：int64
  folderName?: string; // 文件夹名，是否必传：true
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

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
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

export interface BaseFileUploadFileSystemDTO {
  file?: string; // null，格式：binary
  transferId?: string; // 传输id，格式：int64
}

// 文件系统上传文件：公有和私有
export function baseFileUploadFileSystem(
  form: BaseFileUploadFileSystemDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/file/upload/fileSystem"),
    form,
    config
  );
}

export interface BaseFileUploadFileSystemPreDTO {
  fileName?: string; // 文件名，是否必传：true
  file?: string; // null，格式：binary
  fileSize?: string; // 文件总大小，是否必传：true，格式：int64
  uploadType?: string; // 文件上传的类型，是否必传：true，枚举值：101;102;201;301;401;501;601;701;801
  remark?: string; // 备注
  extraJson?: string; // 额外信息（json格式）
  pid?: string; // 父节点id（顶级则为0），格式：int64
  refId?: string; // 关联的 id，格式：int64
}

export interface BaseFileUploadFileSystemPreVO {
  transferId?: string; // 传输id，格式：int64
  fileId?: string; // 文件主键id，格式：int64
}

// 文件系统上传文件-准备工作：公有和私有
export function baseFileUploadFileSystemPre(
  form: BaseFileUploadFileSystemPreDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseFileUploadFileSystemPreVO>(
    "post",
    baseApi("/base/file/upload/fileSystem/pre"),
    form,
    config
  );
}

export interface BaseFileUploadFileSystemChunkComposeDTO {
  transferId?: string; // 传输id，格式：int64
}

// 文件系统上传分片文件-合并：公有和私有
export function baseFileUploadFileSystemChunkCompose(
  form: BaseFileUploadFileSystemChunkComposeDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/file/upload/fileSystem/chunk/compose"),
    form,
    config
  );
}

export interface BaseFilePageDTO {
  originFileName?: string; // 文件原始名（包含文件类型）
  globalFlag?: boolean; // 全局搜索
  publicFlag?: boolean; // 是否公开访问
  pageSize?: string; // 每页显示条数，格式：int64
  pid?: string; // 父节点id（顶级则为0），格式：int64
  remark?: string; // 备注
  type?: string; // 类型，枚举值：101;201
  current?: string; // 第几页，格式：int64
  uploadType?: number; // 文件上传类型，格式：int32
  storageType?: number; // 存放文件的服务器类型，格式：int32
  showFileName?: string; // 展示用的文件名，默认为：原始文件名（包含文件类型）
  belongId?: string; // 归属者用户主键 id，只用于删除操作，格式：int64
  refId?: string; // 关联的 id，格式：int64
  backUpFlag?: boolean; // 返回上级
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询
export function baseFilePage(
  form: BaseFilePageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseFilePageSelfVO>(
    "post",
    baseApi("/base/file/page"),
    form,
    config
  );
}

export interface BaseFileMoveSelfDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  pid?: string; // 父节点id（顶级则为0），是否必传：true，格式：int64
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

export interface BaseFileUploadFileSystemChunkPreDTO {
  fileSign?: string; // 文件签名，用于校验文件是否完整，一般采用 md5的方式，是否必传：true
  fileName?: string; // 文件名，是否必传：true
  file?: string; // null，格式：binary
  fileSize?: string; // 文件总大小，是否必传：true，格式：int64
  uploadType?: string; // 文件上传的类型，是否必传：true，枚举值：101;102;201;301;401;501;601;701;801
  remark?: string; // 备注
  extraJson?: string; // 额外信息（json格式）
  pid?: string; // 父节点id（顶级则为0），格式：int64
  refId?: string; // 关联的 id，格式：int64
}

export interface BaseFileUploadFileSystemChunkPreVO {
  chunkTotal?: number; // 总分片个数，格式：int32
  chunkSize?: number; // 每个分片的大小，格式：int32
  transferId?: string; // 传输id，格式：int64
  fileId?: string; // 文件主键id，格式：int64
}

// 文件系统上传分片文件-准备工作：公有和私有
export function baseFileUploadFileSystemChunkPre(
  form: BaseFileUploadFileSystemChunkPreDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseFileUploadFileSystemChunkPreVO>(
    "post",
    baseApi("/base/file/upload/fileSystem/chunk/pre"),
    form,
    config
  );
}

export interface BaseFileUpdateSelfDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  fileName?: string; // 文件名
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

export interface BaseFileUploadDTO {
  file?: string; // null，格式：binary
  uploadType?: string; // 文件上传的类型，是否必传：true，枚举值：101;102;201;301;401;501;601;701;801
  remark?: string; // 备注
  extraJson?: string; // 额外信息（json格式）
  pid?: string; // 父节点id（顶级则为0），格式：int64
  refId?: string; // 关联的 id，格式：int64
}

// 上传文件：公有和私有
export function baseFileUpload(
  form: BaseFileUploadDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/file/upload"),
    form,
    config
  );
}

export interface BaseFileUploadFileSystemChunkDTO {
  file?: string; // null，格式：binary
  uploadType?: string; // 文件上传的类型，是否必传：true，枚举值：101;102;201;301;401;501;601;701;801
  remark?: string; // 备注
  extraJson?: string; // 额外信息（json格式）
  pid?: string; // 父节点id（顶级则为0），格式：int64
  chunkNum?: number; // 当前分片在整个文件中的顺序编号，每个分片都有一个唯一的编号（从1开始），是否必传：true，格式：int32
  refId?: string; // 关联的 id，格式：int64
  transferId?: string; // 传输id，是否必传：true，格式：int64
}

// 文件系统上传分片文件：公有和私有
export function baseFileUploadFileSystemChunk(
  form: BaseFileUploadFileSystemChunkDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/file/upload/fileSystem/chunk"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
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
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  pid?: string; // 父节点id（顶级则为0），是否必传：true，格式：int64
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

// 下载文件：私有
export function baseFilePrivateDownloadId(
  id: string,
  config?: PureHttpRequestConfig
) {
  return http.request<undefined>(
    "get",
    baseApi("/base/file/privateDownload/{id}"),
    id,
    config
  );
}
