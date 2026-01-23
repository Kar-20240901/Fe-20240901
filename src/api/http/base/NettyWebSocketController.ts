import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullIdAndIntegerValue {
  id?: string; // 主键 id，是否必传：true，格式：int64
  value?: number; // 值，是否必传：true，格式：int32
}

// 通过主键 id，获取：webSocket连接地址，格式：scheme://ip:port/path?code=xxx
export function nettyWebSocketGetWebSocketUrlById(
  form: NotNullIdAndIntegerValue,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/netty/webSocket/getWebSocketUrlById"),
    form,
    config
  );
}

// 获取：所有 webSocket连接地址，格式：scheme://ip:port/path?code=xxx
export function nettyWebSocketGetAllWebSocketUrl(
  config?: PureHttpRequestConfig
) {
  return http.request<string[]>(
    "post",
    baseApi("/netty/webSocket/getAllWebSocketUrl"),
    undefined,
    config
  );
}

export interface Channel {
  active?: boolean; // null
  registered?: boolean; // null
  open?: boolean; // null
  writable?: boolean; // null
}

export interface ChannelDataBO {
  socketRefUserId?: string; // 套接字关联用户的关联 id，格式：int64
  ip?: string; // 用户 ip
  byteArr?: string[]; // 二进制数据，即：blob格式数据，格式：byte
  channel?: Channel; // null
  category?: string; // 请求类别，枚举值：101;102;103;104;105;106;201;202;203;301;302;303;401;402;403;501;502;601;701
  userId?: string; // 用户主键 id，格式：int64
}

export interface SocketHeartBeatVO {
  socketId?: string; // 套接字主键 id，格式：int64
  socketRefUserId?: string; // 套接字关联用户的关联 id，格式：int64
}

// 心跳检测
export function nettyWebSocketHeartBeat(
  form: ChannelDataBO,
  config?: PureHttpRequestConfig
) {
  return http.request<SocketHeartBeatVO>(
    "post",
    baseApi("/netty/webSocket/heartBeat"),
    form,
    config
  );
}
