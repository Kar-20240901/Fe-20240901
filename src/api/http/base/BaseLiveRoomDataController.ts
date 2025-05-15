import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface ChannelDataBO {
  socketRefUserId?: string; // 套接字关联用户的关联 id，format：int64
  ip?: string; // 用户 ip
  byteArr?: string[]; // 二进制数据，即：blob格式数据，format：byte
  category?: string; // 请求类别
  userId?: string; // 用户主键 id，format：int64
}

// 新增数据
export function baseLiveRoomDataAddData(
  form: ChannelDataBO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/liveRoomData/addData"),
    form,
    config
  );
}
