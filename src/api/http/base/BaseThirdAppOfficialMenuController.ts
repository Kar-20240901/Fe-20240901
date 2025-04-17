import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseThirdAppOfficialMenuPageDTO {
  current?: string; // 第几页，format：int64
  buttonType?: string; // 按钮类型
  thirdAppId?: string; // 所属的，第三方应用相关配置主键 id，format：int64
  name?: string; // 菜单名，备注：一级菜单最多4个汉字，二级菜单最多8个汉字，多出来的部分将会以 ... 代替
  pageSize?: string; // 每页显示条数，format：int64
  remark?: string; // 备注
  replyContent?: string; // 回复的内容，备注：一般是点击按钮之后，回复的内容
  type?: number; // 类型，format：int32
  value?: string; // 如果是按钮，则表示按钮的 key，如果是链接，则表示是 url
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BaseThirdAppOfficialMenuDO {
  orderNo?: number; // 排序号（值越大越前面，默认为 0），format：int32
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  pid?: string; // 父节点id（顶级则为0），format：int64
  type?: number; // 类型，format：int32
  pagePath?: string; // 小程序的页面路径
  updateId?: string; // 修改人id，format：int64
  buttonType?: string; // 按钮类型
  createTime?: string; // 创建时间，format：date-time
  children?: BaseThirdAppOfficialMenuDO[]; // 子节点
  createId?: string; // 创建人id，format：int64
  thirdAppId?: string; // 所属的，三方应用配置主键 id，format：int64
  name?: string; // 菜单名，备注：一级菜单最多4个汉字，二级菜单最多8个汉字，多出来的部分将会以 ... 代替
  id?: string; // 主键 id，format：int64
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
  idSet?: string[]; // 主键 idSet，required：true，format：int64
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
  buttonType?: string; // 按钮类型
  orderNo?: number; // 排序号（值越大越前面，默认为 0），format：int32
  thirdAppId?: string; // 所属的，第三方应用相关配置主键 id，format：int64
  name?: string; // 菜单名，备注：一级菜单最多4个汉字，二级菜单最多8个汉字，多出来的部分将会以 ... 代替，required：true
  pid?: string; // 父节点id（顶级则为0），format：int64
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  replyContent?: string; // 回复的内容，备注：一般是点击按钮之后，回复的内容
  pagePath?: string; // 小程序的页面路径
  value?: string; // 如果是按钮，则表示按钮的 key，如果是链接，则表示是 url，如果是小程序，则表示 appid，required：true
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
  idSet?: string[]; // 主键 idSet，required：true，format：int64
  number?: string; // 需要改变的数值，required：true，format：int64
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
  id?: string; // 主键 id，required：true，format：int64
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
