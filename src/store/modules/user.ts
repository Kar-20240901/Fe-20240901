import { defineStore } from "pinia";
import {
  resetRouter,
  router,
  routerArrays,
  storageLocal,
  store,
  type userType
} from "../utils";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, removeToken, setToken, userKey } from "@/utils/auth";
import { signPath } from "@/router";
import {
  type SignInVO,
  signUserNameJwtRefreshToken,
  signUserNameSignInPassword
} from "@/api/http/base/SignUserNameController";
import { CloseWebSocket } from "@/utils/webSocket/WebSocketUtil";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions: storageLocal().getItem<DataInfo>(userKey)?.permissions ?? [],
    // 按钮级别权限
    passwordFlag:
      storageLocal().getItem<DataInfo>(userKey)?.passwordFlag ?? false,
    // 按钮级别权限
    createTime: storageLocal().getItem<DataInfo>(userKey)?.createTime ?? "",
    // 按钮级别权限
    email: storageLocal().getItem<DataInfo>(userKey)?.email ?? "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：邮箱登录、2：邮箱注册、3：用户名注册、4：忘记密码）
    currentPage: 0,
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储邮箱 */
    SET_EMAIL(email: string) {
      this.email = email;
    },
    /** 存储是否有密码 */
    SET_PASSWORD_FLAG(passwordFlag: boolean) {
      this.passwordFlag = passwordFlag;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<SignInVO>((resolve, reject) => {
        signUserNameSignInPassword(data)
          .then(data => {
            if (data?.data) setToken(data.data);
            resolve(data.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.avatar = "";
      this.username = "";
      this.nickname = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push(signPath);
      CloseWebSocket(); // 关闭 webSocket
    },
    /** 刷新`token` */
    async handRefreshToken(body) {
      return new Promise<SignInVO>((resolve, reject) => {
        signUserNameJwtRefreshToken(body)
          .then(data => {
            if (data?.data) {
              setToken(data.data);
              resolve(data.data);
            } else {
              reject(new Error("刷新token异常"));
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
