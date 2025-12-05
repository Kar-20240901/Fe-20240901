import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
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
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  remark?: string; // 备注
  type?: string; // socket类型，枚举值：101;201
  userId?: string; // 用户主键 id，格式：int64
  socketId?: string; // socket主键 id，格式：int64
  current?: string; // 第几页，格式：int64
  onlineType?: string; // socket 在线状态，枚举值：101;201;100001
  port?: number; // 端口，格式：int32
  host?: string; // 主机
  id?: string; // 主键 id，格式：int64
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
  order?: MyOrderDTO; // 排序字段
}

export interface BaseSocketRefUserDO {
  scheme?: string; // 冗余字段，协议
  ip?: string; // ip
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  type?: string; // 冗余字段，socket类型，枚举值：101;201
  userId?: string; // 用户主键 id，格式：int64
  socketId?: string; // socket主键 id，格式：int64
  updateId?: string; // 修改人id，格式：int64
  path?: string; // 冗余字段，路径
  macAddress?: string; // 冗余字段，mac地址
  onlineType?: string; // socket 在线状态，枚举值：101;201;100001
  createTime?: string; // 创建时间，格式：date-time
  port?: number; // 冗余字段，端口，格式：int32
  createId?: string; // 创建人id，格式：int64
  nickname?: string; // 冗余字段，用户昵称
  host?: string; // 冗余字段，主机
  id?: string; // 主键 id，格式：int64
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
  category?: string; // 请求类别，枚举值：101;102;103;104;105;106;201;202;203;301;302;303;401;402;403;501;502;601;701
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
