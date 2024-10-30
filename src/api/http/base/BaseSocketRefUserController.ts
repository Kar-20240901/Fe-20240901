import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量：开关控制台
export function baseSocketRefUserChangeConsoleFlagByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/socketRefUser/changeConsoleFlagByIdSet"),
    form,
    config
  );
}

export interface BaseSocketRefUserPageDTO {
  scheme?: string; // 协议
  ip?: string; // ip
  pageSize?: string; // 每页显示条数，format：int64
  remark?: string; // 备注
  type?: string; // socket类型
  userId?: string; // 用户主键 id，format：int64
  socketId?: string; // socket主键 id，format：int64
  current?: string; // 第几页，format：int64
  onlineType?: string; // socket 在线状态
  port?: number; // 端口，format：int32
  host?: string; // 主机
  id?: string; // 主键 id，format：int64
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
  order?: MyOrderDTO; // 排序字段
}

export interface BaseSocketRefUserDO {
  scheme?: string; // 冗余字段，协议
  ip?: string; // ip
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  type?: string; // 冗余字段，socket类型
  userId?: string; // 用户主键 id，format：int64
  socketId?: string; // socket主键 id，format：int64
  updateId?: string; // 修改人id，format：int64
  path?: string; // 冗余字段，路径
  macAddress?: string; // 冗余字段，mac地址
  onlineType?: string; // socket 在线状态
  createTime?: string; // 创建时间，format：date-time
  port?: number; // 冗余字段，端口，format：int32
  createId?: string; // 创建人id，format：int64
  nickname?: string; // 冗余字段，用户昵称
  host?: string; // 冗余字段，主机
  id?: string; // 主键 id，format：int64
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
  category?: string; // 请求类别
  enableFlag?: boolean; // 是否启用
}

// 分页排序查询
export function baseSocketRefUserPage(
  form: BaseSocketRefUserPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseSocketRefUserDO>>(
    "post",
    baseApi("/base/socketRefUser/page"),
    form,
    config
  );
}

// 批量：下线用户
export function baseSocketRefUserOfflineByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/socketRefUser/offlineByIdSet"),
    form,
    config
  );
}
