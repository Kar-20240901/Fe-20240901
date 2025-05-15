import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImSessionContentInsertTxtDTO {
  txt?: string; // 文字内容，required：true
  orderNo?: number; // 排序号（值越大越前面，默认为 0），format：int32
  createTs?: string; // 创建时间的时间戳，UTC+8，required：true，format：int64
  sessionId?: string; // 会话主键 id，required：true，format：int64
  refId?: string; // 引用的内容主键 id，不引用时为 -1，format：int64
}

// 新增文字消息
export function baseImSessionContentInsertTxt(
  form: BaseImSessionContentInsertTxtDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imSessionContent/insertTxt"),
    form,
    config
  );
}
