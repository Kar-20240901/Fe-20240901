import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface ScrollListDTO {
  backwardFlag?: boolean; // 是否向后查询，默认：false 根据 id，往前查询 true 根据 id，往后查询
  pageSize?: string; // 本次查询的长度，默认：20，格式：int64
  id?: string; // 主键 id，如果为 null，则根据 backwardFlag，来查询最大 id或者最小 id，注意：不会查询该 id的数据，格式：int64
  searchKey?: string; // 搜索内容
  refId?: string; // 关联其他主键 id，格式：int64
  containsCurrentIdFlag?: boolean; // 是否包含当前主键 id，默认：false
  queryMoreFlag?: boolean; // 是否多查询一些数据，backwardFlag 为 true时，往后多查询几条数据，为 false时，往前多查询几条数据，如果不足 pageSize，会补齐并且会额外多查询几条数据
}

export interface BaseImSessionContentRefUserPageVO {
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  createId?: string; // 创建人id，格式：int64
  contentId?: string; // 主键 id，格式：int64
  createTs?: string; // 创建时间的时间戳，UTC+8，格式：int64
  refId?: string; // 引用的内容主键 id，不引用时为 -1，格式：int64
  sessionId?: string; // 会话主键 id，格式：int64
  type?: number; // 内容类型，格式：int32
  content?: string; // 会话内容
}

// 滚动加载
export function baseImSessionContentRefUserScroll(
  form: ScrollListDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseImSessionContentRefUserPageVO[]>(
    "post",
    baseApi("/base/imSessionContentRefUser/scroll"),
    form,
    config
  );
}

export interface BaseImSessionContentRefUserPageDTO {
  current?: string; // 第几页，格式：int64
  contentId?: string; // 消息内容主键 id，格式：int64
  pageSize?: string; // 每页显示条数，格式：int64
  sessionId?: string; // 会话主键 id，是否必传：true，格式：int64
  content?: string; // 消息内容
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询
export function baseImSessionContentRefUserMyPage(
  form: BaseImSessionContentRefUserPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImSessionContentRefUserPageVO>>(
    "post",
    baseApi("/base/imSessionContentRefUser/myPage"),
    form,
    config
  );
}
