import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface Channel {
  registered?: boolean; // null
  active?: boolean; // null
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

// 用户加入房间
export function baseLiveRoomUserAddUser(
  form: ChannelDataBO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/liveRoomUser/addUser"),
    form,
    config
  );
}
