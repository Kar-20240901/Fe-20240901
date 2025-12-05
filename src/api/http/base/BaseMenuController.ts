import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量删除
export function baseMenuDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/menu/deleteByIdSet"),
    form,
    config
  );
}

export interface BaseMenuPageDTO {
  redirect?: string; // 重定向，优先级最高
  path?: string; // 页面的 path，备注：不能重复
  linkFlag?: boolean; // 是否外链，即，打开页面会在一个新的窗口打开
  current?: string; // 第几页，格式：int64
  router?: string; // 路由
  name?: string; // 菜单名
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  pid?: string; // 父节点id（顶级则为0），格式：int64
  enableFlag?: boolean; // 是否启用
  showFlag?: boolean; // 是否显示在 左侧的菜单栏里面，如果为 false，也可以通过 $router.push()访问到
  order?: MyOrderDTO; // 排序字段
}

export interface BaseMenuDO {
  redirect?: string; // 重定向，优先级最高
  linkFlag?: boolean; // 是否外链，即，打开页面会在一个新的窗口打开，可以配合 router
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  icon?: string; // 图标
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  pid?: string; // 父节点id（顶级则为0），格式：int64
  uuid?: string; // 该菜单的 uuid，备注：不能重复
  showFlag?: boolean; // 是否显示在 左侧的菜单栏里面，如果为 false，也可以通过 $router.push()访问到
  updateId?: string; // 修改人id，格式：int64
  path?: string; // 页面的 path，备注：不能重复
  router?: string; // 路由
  createTime?: string; // 创建时间，格式：date-time
  children?: BaseMenuDO[]; // 子节点
  createId?: string; // 创建人id，格式：int64
  name?: string; // 菜单名
  id?: string; // 主键 id，格式：int64
  enableFlag?: boolean; // 是否启用
}

// 分页排序查询
export function baseMenuPage(
  form: BaseMenuPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseMenuDO>>(
    "post",
    baseApi("/base/menu/page"),
    form,
    config
  );
}

export interface ChangeNumberDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  number?: string; // 需要改变的数值，是否必传：true，格式：int64
}

// 通过主键 idSet，加减排序号
export function baseMenuAddOrderNo(
  form: ChangeNumberDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/menu/addOrderNo"),
    form,
    config
  );
}

// 获取：当前用户绑定的菜单
export function baseMenuUserSelfMenuList(config?: PureHttpRequestConfig) {
  return http.request<BaseMenuDO[]>(
    "post",
    baseApi("/base/menu/userSelfMenuList"),
    undefined,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

export interface BaseMenuInfoByIdVO {
  redirect?: string; // 重定向，优先级最高
  linkFlag?: boolean; // 是否外链，即，打开页面会在一个新的窗口打开，可以配合 router
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  icon?: string; // 图标
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  pid?: string; // 父节点id（顶级则为0），格式：int64
  uuid?: string; // 该菜单的 uuid，备注：不能重复
  showFlag?: boolean; // 是否显示在 左侧的菜单栏里面，如果为 false，也可以通过 $router.push()访问到
  updateId?: string; // 修改人id，格式：int64
  path?: string; // 页面的 path，备注：不能重复
  router?: string; // 路由
  createTime?: string; // 创建时间，格式：date-time
  children?: BaseMenuDO[]; // 子节点
  createId?: string; // 创建人id，格式：int64
  name?: string; // 菜单名
  roleIdSet?: string[]; // 角色idSet，格式：int64
  id?: string; // 主键 id，格式：int64
  enableFlag?: boolean; // 是否启用
}

// 通过主键id，查看详情
export function baseMenuInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseMenuInfoByIdVO>(
    "post",
    baseApi("/base/menu/infoById"),
    form,
    config
  );
}

// 下拉树形列表
export function baseMenuDictTreeList(config?: PureHttpRequestConfig) {
  return http.request<BaseMenuDO[]>(
    "post",
    baseApi("/base/menu/dictTreeList"),
    undefined,
    config
  );
}

// 查询：树结构
export function baseMenuTree(
  form: BaseMenuPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseMenuDO[]>(
    "post",
    baseApi("/base/menu/tree"),
    form,
    config
  );
}

// 通过主键 idSet，修改排序号
export function baseMenuUpdateOrderNo(
  form: ChangeNumberDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/menu/updateOrderNo"),
    form,
    config
  );
}

export interface BaseMenuInsertOrUpdateDTO {
  redirect?: string; // 重定向，优先级最高
  linkFlag?: boolean; // 是否外链，即，打开页面会在一个新的窗口打开
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  icon?: string; // 图标
  pid?: string; // 父节点id（顶级则为0），格式：int64
  remark?: string; // 备注
  uuid?: string; // 该菜单的 uuid，备注：不能重复
  showFlag?: boolean; // 是否显示在 左侧的菜单栏里面，如果为 false，也可以通过 $router.push()访问到
  path?: string; // 页面的 path，备注：不能重复
  router?: string; // 路由
  name?: string; // 菜单名，是否必传：true
  roleIdSet?: string[]; // 角色 idSet，格式：int64
  id?: string; // 主键 id，格式：int64
  enableFlag?: boolean; // 是否启用
}

// 新增/修改
export function baseMenuInsertOrUpdate(
  form: BaseMenuInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/menu/insertOrUpdate"),
    form,
    config
  );
}
