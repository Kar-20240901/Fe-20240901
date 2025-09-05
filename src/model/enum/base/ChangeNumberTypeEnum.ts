import type { IEnum } from "@/model/enum/base/CommonEnum";

export interface IChangeNumberTypeEnum {
  ADD: IEnum<number>;

  DEDUCT: IEnum<number>;
}

// 操作数字时的类型，枚举类
export const ChangeNumberTypeEnum: IChangeNumberTypeEnum = {
  ADD: {
    code: 101,
    name: "增加"
  },

  DEDUCT: {
    code: 201,
    name: "扣除"
  }
};

export const ChangeNumberTypeMap = new Map<number, string>();

Object.keys(ChangeNumberTypeEnum).forEach(key => {
  const item = ChangeNumberTypeEnum[key] as IEnum<number>;

  ChangeNumberTypeMap.set(item.code, item.name);
});
