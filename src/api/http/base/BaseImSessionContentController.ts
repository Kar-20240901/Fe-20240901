import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImSessionContentUpdateTargetInputFlagDTO {
  sessionId?: string; // 会话主键 id，格式：int64
}

// 修改为输入中
export function baseImSessionContentUpdateTargetInputFlag(
  form: BaseImSessionContentUpdateTargetInputFlagDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imSessionContent/updateTargetInputFlag"),
    form,
    config
  );
}

export interface BaseImSessionContentInsertTxtDTO {
  txt?: string; // 文字内容，是否必传：true
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  createTs?: string; // 创建时间的时间戳，UTC+8，是否必传：true，格式：int64
  sessionId?: string; // 会话主键 id，是否必传：true，格式：int64
  refId?: string; // 引用的内容主键 id，不引用时为 -1，格式：int64
  type?: number; // 消息类型，是否必传：true，格式：int32
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
