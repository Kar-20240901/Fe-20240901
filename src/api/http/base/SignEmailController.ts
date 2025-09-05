import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface SignEmailUpdateEmailSendCodeNewDTO {
  email?: string; // 邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，是否必传：true
}

// 修改邮箱：0发送新邮箱验证码
export function signEmailUpdateEmailSendCodeNew(
  form: SignEmailUpdateEmailSendCodeNewDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/updateEmail/sendCode/new"),
    form,
    config
  );
}

// 修改邮箱：发送旧邮箱验证码
export function signEmailUpdateEmailSendCodeOld(
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/updateEmail/sendCode/old"),
    undefined,
    config
  );
}

export interface EmailNotBlankDTO {
  email?: string; // 邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，是否必传：true
}

// 注册：发送验证码
export function signEmailSignUpSendCode(
  form: EmailNotBlankDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/signUp/sendCode"),
    form,
    config
  );
}

export interface SignEmailSetPasswordDTO {
  password?: string; // 前端加密之后的密码，是否必传：true
  code?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
  originPassword?: string; // 前端加密之后的原始密码，是否必传：true
}

// 设置密码
export function signEmailSetPassword(
  form: SignEmailSetPasswordDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/setPassword"),
    form,
    config
  );
}

// 邮箱验证码登录：发送验证码
export function signEmailSignInSendCode(
  form: EmailNotBlankDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/signIn/sendCode"),
    form,
    config
  );
}

// 修改密码：发送验证码
export function signEmailUpdatePasswordSendCode(
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/updatePassword/sendCode"),
    undefined,
    config
  );
}

export interface SignEmailSetPhoneSendCodePhoneDTO {
  phone?: string; // 手机号码，正则表达式：^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$，是否必传：true
}

// 设置手机：发送手机验证码
export function signEmailSetPhoneSendCodePhone(
  form: SignEmailSetPhoneSendCodePhoneDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/setPhone/sendCode/phone"),
    form,
    config
  );
}

export interface GetQrCodeVO {
  expireTs?: string; // 二维码过期时间戳，格式：int64
  qrCodeId?: string; // 二维码 id，格式：int64
  qrCodeUrl?: string; // 二维码的 url地址
}

// 设置微信：获取二维码地址
export function signEmailSetWxGetQrCodeUrl(config?: PureHttpRequestConfig) {
  return http.request<GetQrCodeVO>(
    "post",
    baseApi("/sign/email/setWx/getQrCodeUrl"),
    undefined,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

export interface BaseQrCodeSceneBindVO {
  sceneFlag?: boolean; // 是否：已经扫码
  errorMsg?: string; // 错误信息
}

// 设置微信：获取二维码是否已经被扫描
export function signEmailSetWxGetQrCodeSceneFlag(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseQrCodeSceneBindVO>(
    "post",
    baseApi("/sign/email/setWx/getQrCodeSceneFlag"),
    form,
    config
  );
}

// 设置微信：发送验证码
export function signEmailSetWxSendCode(config?: PureHttpRequestConfig) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/setWx/sendCode"),
    undefined,
    config
  );
}

export interface SignEmailUpdatePasswordDTO {
  originNewPassword?: string; // 前端加密之后的原始新密码，是否必传：true
  code?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
  newPassword?: string; // 前端加密之后的新密码，是否必传：true
}

// 修改密码
export function signEmailUpdatePassword(
  form: SignEmailUpdatePasswordDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/updatePassword"),
    form,
    config
  );
}

export interface SignEmailUpdateUserNameSendCodeDTO {
  username?: string; // 用户名，正则表达式：^[\u4E00-\u9FA5A-Za-z0-9_-]{2,20}$，是否必传：true
}

// 修改用户名：发送验证码
export function signEmailUpdateUserNameSendCode(
  form: SignEmailUpdateUserNameSendCodeDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/updateUserName/sendCode"),
    form,
    config
  );
}

// 设置手机：发送邮箱验证码
export function signEmailSetPhoneSendCodeEmail(config?: PureHttpRequestConfig) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/setPhone/sendCode/email"),
    undefined,
    config
  );
}

export interface SignEmailSetPhoneDTO {
  emailCode?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
  phone?: string; // 手机号码，正则表达式：^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$，是否必传：true
  phoneCode?: string; // 手机验证码，正则表达式：^[0-9]{6}$，是否必传：true
}

// 设置手机
export function signEmailSetPhone(
  form: SignEmailSetPhoneDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/setPhone"),
    form,
    config
  );
}

// 设置密码：发送验证码
export function signEmailSetPasswordSendCode(config?: PureHttpRequestConfig) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/setPassword/sendCode"),
    undefined,
    config
  );
}

export interface SignEmailSignInCodeDTO {
  code?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
  email?: string; // 邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，是否必传：true
}

export interface SignInVO {
  jwtExpireTs?: string; // jwt过期时间戳，格式：int64
  jwt?: string; // jwt
  jwtRefreshToken?: string; // jwtRefreshToken
}

// 邮箱验证码登录
export function signEmailSignInCode(
  form: SignEmailSignInCodeDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<SignInVO>(
    "post",
    baseApi("/sign/email/signIn/code"),
    form,
    config
  );
}

export interface SignEmailSignInPasswordDTO {
  password?: string; // 密码，是否必传：true
  email?: string; // 邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，是否必传：true
}

// 邮箱：账号密码登录
export function signEmailSignInPassword(
  form: SignEmailSignInPasswordDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<SignInVO>(
    "post",
    baseApi("/sign/email/signIn/password"),
    form,
    config
  );
}

export interface SignEmailUpdateUserNameDTO {
  code?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
  username?: string; // 用户名，正则表达式：^[\u4E00-\u9FA5A-Za-z0-9_-]{2,20}$，是否必传：true
}

// 修改用户名
export function signEmailUpdateUserName(
  form: SignEmailUpdateUserNameDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/updateUserName"),
    form,
    config
  );
}

export interface SignEmailForgetPasswordDTO {
  originNewPassword?: string; // 前端加密之后的原始新密码，是否必传：true
  code?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
  newPassword?: string; // 前端加密之后的新密码，是否必传：true
  email?: string; // 邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，是否必传：true
}

// 忘记密码
export function signEmailForgetPassword(
  form: SignEmailForgetPasswordDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/forgetPassword"),
    form,
    config
  );
}

// 忘记密码：发送验证码
export function signEmailForgetPasswordSendCode(
  form: EmailNotBlankDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/forgetPassword/sendCode"),
    form,
    config
  );
}

export interface SignEmailSignUpDTO {
  password?: string; // 前端加密之后的密码，是否必传：true
  code?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
  email?: string; // 邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，是否必传：true
  originPassword?: string; // 前端加密之后的原始密码，是否必传：true
}

// 注册
export function signEmailSignUp(
  form: SignEmailSignUpDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/signUp"),
    form,
    config
  );
}

// 账号注销：发送验证码
export function signEmailSignDeleteSendCode(config?: PureHttpRequestConfig) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/signDelete/sendCode"),
    undefined,
    config
  );
}

export interface SignEmailSetWxDTO {
  qrCodeId?: string; // 二维码 id，是否必传：true，格式：int64
  emailCode?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
}

// 设置微信
export function signEmailSetWx(
  form: SignEmailSetWxDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseQrCodeSceneBindVO>(
    "post",
    baseApi("/sign/email/setWx"),
    form,
    config
  );
}

export interface SignEmailSetUserNameDTO {
  code?: string; // 邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
  username?: string; // 用户名，正则表达式：^[\u4E00-\u9FA5A-Za-z0-9_-]{2,20}$，是否必传：true
}

// 设置用户名
export function signEmailSetUserName(
  form: SignEmailSetUserNameDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/setUserName"),
    form,
    config
  );
}

export interface SignEmailSetUserNameSendCodeDTO {
  username?: string; // 用户名，正则表达式：^[\u4E00-\u9FA5A-Za-z0-9_-]{2,20}$，是否必传：true
}

// 设置用户名：发送验证码
export function signEmailSetUserNameSendCode(
  form: SignEmailSetUserNameSendCodeDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/setUserName/sendCode"),
    form,
    config
  );
}

export interface SignEmailUpdateEmailDTO {
  newEmailCode?: string; // 新邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
  newEmail?: string; // 新邮箱，正则表达式：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$，是否必传：true
  oldEmailCode?: string; // 旧邮箱验证码，正则表达式：^[0-9]{6}$，是否必传：true
}

// 修改邮箱
export function signEmailUpdateEmail(
  form: SignEmailUpdateEmailDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/updateEmail"),
    form,
    config
  );
}

export interface NotBlankCodeDTO {
  code?: string; // 验证码，正则表达式：^[0-9]{6}$，是否必传：true
}

// 账号注销
export function signEmailSignDelete(
  form: NotBlankCodeDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/sign/email/signDelete"),
    form,
    config
  );
}
