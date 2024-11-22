import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface SignUserNameUpdateUserNameDTO {
  newUserName?: string; // 新用户名，正则表达式：^[\u4E00-\u9FA5A-Za-z0-9_-]{2,20}$，required：true
  currentPassword?: string; // 前端加密之后的密码，required：true
}

// 修改用户名
export function signUserNameUpdateUserName(
  form: SignUserNameUpdateUserNameDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/userName/updateUserName"),
    form,
    config
  );
}

export interface SignUserNameSignUpDTO {
  password?: string; // 前端加密之后的密码，required：true
  originPassword?: string; // 前端加密之后的原始密码，required：true
  username?: string; // 用户名，正则表达式：^[\u4E00-\u9FA5A-Za-z0-9_-]{2,20}$，required：true
}

// 注册
export function signUserNameSignUp(
  form: SignUserNameSignUpDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/userName/signUp"),
    form,
    config
  );
}

export interface SignUserNameSignDeleteDTO {
  currentPassword?: string; // 前端加密之后的密码，required：true
}

// 账号注销
export function signUserNameSignDelete(
  form: SignUserNameSignDeleteDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/userName/signDelete"),
    form,
    config
  );
}

export interface SignUserNameSetEmailSendCodeDTO {
  email?: string; // 邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，required：true
}

// 设置邮箱：发送验证码
export function signUserNameSetEmailSendCode(
  form: SignUserNameSetEmailSendCodeDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/userName/setEmail/sendCode"),
    form,
    config
  );
}

export interface SignUserNameSetEmailDTO {
  code?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，required：true
  email?: string; // 邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，required：true
  currentPassword?: string; // 前端加密之后的密码，required：true
}

// 设置邮箱
export function signUserNameSetEmail(
  form: SignUserNameSetEmailDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/userName/setEmail"),
    form,
    config
  );
}

export interface SignUserNameSignInPasswordDTO {
  password?: string; // 前端加密之后的密码，required：true
  username?: string; // 用户名，正则表达式：^[\u4E00-\u9FA5A-Za-z0-9_-]{2,20}$，required：true
}

export interface SignInVO {
  jwtExpireTs?: string; // jwt过期时间戳，format：int64
  jwt?: string; // jwt
  jwtRefreshToken?: string; // jwtRefreshToken
}

// 账号密码登录
export function signUserNameSignInPassword(
  form: SignUserNameSignInPasswordDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<SignInVO>(
    "post",
    baseApi("/sign/userName/signIn/password"),
    form,
    config
  );
}

export interface SignUserNameJwtRefreshTokenDTO {
  jwtRefreshToken?: string; // jwtRefreshToken，required：true
}

// 刷新token
export function signUserNameJwtRefreshToken(
  form: SignUserNameJwtRefreshTokenDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<SignInVO>(
    "post",
    baseApi("/sign/userName/jwtRefreshToken"),
    form,
    config
  );
}

export interface SignUserNameUpdatePasswordDTO {
  originNewPassword?: string; // 前端加密之后的原始新密码，required：true
  oldPassword?: string; // 前端加密之后的旧密码，required：true
  newPassword?: string; // 前端加密之后的新密码，required：true
}

// 修改密码
export function signUserNameUpdatePassword(
  form: SignUserNameUpdatePasswordDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/userName/updatePassword"),
    form,
    config
  );
}
