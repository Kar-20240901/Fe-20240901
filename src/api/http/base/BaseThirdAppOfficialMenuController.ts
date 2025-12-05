import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseThirdAppOfficialMenuPageDTO {
  current?: string; // 第几页，格式：int64
  buttonType?: string; // 按钮类型，枚举值：101;201;301
  thirdAppId?: string; // 所属的，第三方应用相关配置主键 id，格式：int64
  name?: string; // 菜单名，备注：一级菜单最多4个汉字，二级菜单最多8个汉字，多出来的部分将会以 ... 代替
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  remark?: string; // 备注
  replyContent?: string; // 回复的内容，备注：一般是点击按钮之后，回复的内容
  type?: number; // 类型，格式：int32
  value?: string; // 如果是按钮，则表示按钮的 key，如果是链接，则表示是 url
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BaseThirdAppOfficialMenuDO {
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  pid?: string; // 父节点id（顶级则为0），格式：int64
  type?: number; // 类型，格式：int32
  pagePath?: string; // 小程序的页面路径
  updateId?: string; // 修改人id，格式：int64
  buttonType?: string; // 按钮类型，枚举值：101;201;301
  createTime?: string; // 创建时间，格式：date-time
  children?: BaseThirdAppOfficialMenuDO[]; // 子节点
  createId?: string; // 创建人id，格式：int64
  thirdAppId?: string; // 所属的，三方应用配置主键 id，格式：int64
  name?: string; // 菜单名，备注：一级菜单最多4个汉字，二级菜单最多8个汉字，多出来的部分将会以 ... 代替
  id?: string; // 主键 id，格式：int64
  replyContent?: string; // 回复的内容，备注：一般是点击按钮之后，回复的内容
  enableFlag?: boolean; // 是否启用
  value?: string; // 如果是按钮，则表示按钮的 key，如果是链接，则表示是 url，如果是小程序，则表示 appid
}

// 查询：树结构
export function baseThirdAppOfficialMenuTree(
  form: BaseThirdAppOfficialMenuPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseThirdAppOfficialMenuDO[]>(
    "post",
    baseApi("/base/thirdAppOfficialMenu/tree"),
    form,
    config
  );
}

// 分页排序查询
export function baseThirdAppOfficialMenuPage(
  form: BaseThirdAppOfficialMenuPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseThirdAppOfficialMenuDO>>(
    "post",
    baseApi("/base/thirdAppOfficialMenu/page"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量删除
export function baseThirdAppOfficialMenuDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/thirdAppOfficialMenu/deleteByIdSet"),
    form,
    config
  );
}

export interface BaseThirdAppOfficialMenuInsertOrUpdateDTO {
  buttonType?: string; // 按钮类型，枚举值：101;201;301
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  thirdAppId?: string; // 所属的，第三方应用相关配置主键 id，格式：int64
  name?: string; // 菜单名，备注：一级菜单最多4个汉字，二级菜单最多8个汉字，多出来的部分将会以 ... 代替，是否必传：true
  pid?: string; // 父节点id（顶级则为0），格式：int64
  remark?: string; // 备注
  id?: string; // 主键 id，格式：int64
  replyContent?: string; // 回复的内容，备注：一般是点击按钮之后，回复的内容
  pagePath?: string; // 小程序的页面路径
  value?: string; // 如果是按钮，则表示按钮的 key，如果是链接，则表示是 url，如果是小程序，则表示 appid，是否必传：true
  enableFlag?: boolean; // 是否启用
}

// 新增/修改
export function baseThirdAppOfficialMenuInsertOrUpdate(
  form: BaseThirdAppOfficialMenuInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/thirdAppOfficialMenu/insertOrUpdate"),
    form,
    config
  );
}

export interface ChangeNumberDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  number?: string; // 需要改变的数值，是否必传：true，格式：int64
}

// 通过主键 idSet，加减排序号
export function baseThirdAppOfficialMenuAddOrderNo(
  form: ChangeNumberDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/thirdAppOfficialMenu/addOrderNo"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 通过主键id，查看详情
export function baseThirdAppOfficialMenuInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseThirdAppOfficialMenuDO>(
    "post",
    baseApi("/base/thirdAppOfficialMenu/infoById"),
    form,
    config
  );
}
