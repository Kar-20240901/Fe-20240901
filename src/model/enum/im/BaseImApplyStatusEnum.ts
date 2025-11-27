import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseImApplyStatusEnum {
  APPLYING: IEnum<number>;

  PASSED: IEnum<number>;

  REJECTED: IEnum<number>;
}

// 申请状态，枚举类
export const BaseImApplyStatusEnum: IBaseImApplyStatusEnum = {
  APPLYING: {
    code: 101,
    name: "好友"
  },

  PASSED: {
    code: 201,
    name: "群聊"
  },

  REJECTED: {
    code: 301,
    name: "群聊"
  }
};

export const BaseImApplyStatusEnumOptions: Array<OptionsType> = [];

export const BaseImApplyStatusEnumMap = new Map<number, string>();

Object.keys(BaseImApplyStatusEnum).forEach(key => {
  const item = BaseImApplyStatusEnum[key] as IEnum<number>;

  BaseImApplyStatusEnumOptions.push({ label: item.name, value: item.code });

  BaseImApplyStatusEnumMap.set(item.code, item.name);
});
