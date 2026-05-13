import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseImSessionContentTypeEnum {
  NONE: IEnum<number>;

  // > 100 && < 1000 会统计未读数量 ↓

  TEXT: IEnum<number>;

  TEXT_FRIEND_APPLY_FINISH: IEnum<number>;

  TEXT_GROUP_CREATE_FINISH: IEnum<number>;

  TEXT_GROUP_APPLY_FINISH: IEnum<number>;

  IMAGE: IEnum<number>;

  FILE: IEnum<number>;

  // > 100 && < 1000 会统计未读数量 ↑
}

// 会话内容类型，枚举类
export const BaseImSessionContentTypeEnum: IBaseImSessionContentTypeEnum = {
  NONE: {
    code: -1,
    name: "无"
  },

  TEXT: {
    code: 101,
    name: "文字"
  },

  TEXT_FRIEND_APPLY_FINISH: {
    code: 102,
    name: "添加好友成功"
  },

  TEXT_GROUP_CREATE_FINISH: {
    code: 103,
    name: "创建群组成功"
  },

  TEXT_GROUP_APPLY_FINISH: {
    code: 104,
    name: "加入群组成功"
  },

  IMAGE: {
    code: 201,
    name: "图片"
  },

  FILE: {
    code: 301,
    name: "文件"
  }
};

export const BaseImSessionContentTypeEnumOptions: Array<OptionsType> = [];

export const BaseImSessionContentTypeEnumMap = new Map<number, string>();

Object.keys(BaseImSessionContentTypeEnum).forEach(key => {
  const item = BaseImSessionContentTypeEnum[key] as IEnum<number>;

  BaseImSessionContentTypeEnumOptions.push({
    label: item.name,
    value: item.code
  });

  BaseImSessionContentTypeEnumMap.set(item.code, item.name);
});
