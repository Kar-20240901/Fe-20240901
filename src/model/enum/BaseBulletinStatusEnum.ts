import type { IEnum } from "@/model/enum/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseBulletinStatusEnum {
  DRAFT: IEnum<number>;

  PUBLICITY: IEnum<number>;
}

// 公告状态，枚举类
export const BaseFileStorageTypeEnum: IBaseBulletinStatusEnum = {
  DRAFT: {
    code: 101,
    name: "草稿"
  },

  PUBLICITY: {
    code: 201,
    name: "公示"
  }
};

export const BaseBulletinStatusEnumOptions: Array<OptionsType> = [];

export const BaseBulletinStatusEnumMap = new Map<number, string>();

Object.keys(BaseFileStorageTypeEnum).forEach(key => {
  const item = BaseFileStorageTypeEnum[key] as IEnum<number>;

  BaseBulletinStatusEnumOptions.push({ label: item.name, value: item.code });

  BaseBulletinStatusEnumMap.set(item.code, item.name);
});
