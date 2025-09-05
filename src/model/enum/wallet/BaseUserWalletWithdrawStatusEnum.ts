import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseUserWalletWithdrawStatusEnum {
  COMMIT: IEnum<number>;
  ACCEPT: IEnum<number>;
  SUCCESS: IEnum<number>;
  REJECT: IEnum<number>;
  CANCEL: IEnum<number>;
}

// 用户提现状态枚举类
export const BaseUserWalletWithdrawStatusEnum: IBaseUserWalletWithdrawStatusEnum =
  {
    COMMIT: {
      code: 101,
      name: "待受理", // 待受理（可取消）
      status: "warning"
    },

    ACCEPT: {
      code: 201,
      name: "受理中", // 受理中（不可取消）
      status: "processing"
    },

    SUCCESS: {
      code: 301,
      name: "已成功", // 已成功
      status: "success"
    },

    REJECT: {
      code: 401,
      name: "已拒绝", // 已拒绝（需要填写拒绝理由）
      status: "error"
    },

    CANCEL: {
      code: 501,
      name: "已取消", // 已取消（用户在待受理的时候，可以取消）
      status: "default"
    }
  };

export const BaseUserWalletWithdrawStatusOptions: Array<OptionsType> = [];

export const BaseUserWalletWithdrawStatusMap = new Map<number, string>();

export const BaseUserWalletWithdrawStatusStatusMap = new Map<number, string>();

Object.keys(BaseUserWalletWithdrawStatusEnum).forEach(key => {
  const item = BaseUserWalletWithdrawStatusEnum[key] as IEnum<number>;

  BaseUserWalletWithdrawStatusOptions.push({
    label: item.name,
    value: item.code
  });

  BaseUserWalletWithdrawStatusMap.set(item.code, item.name);

  BaseUserWalletWithdrawStatusStatusMap.set(item.code, item.status);
});
