import type { IEnum } from "@/model/enum/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseSocketTypeEnum {
  TCP_PROTOBUF: IEnum<number>;

  WEB_SOCKET: IEnum<number>;
}

// socket类型，枚举类
export const BaseSocketTypeEnum: IBaseSocketTypeEnum = {
  TCP_PROTOBUF: {
    code: 101,
    name: "tcp_protobuf"
  },

  WEB_SOCKET: {
    code: 201,
    name: "web_socket"
  }
};

export const BaseSocketTypeOptions: Array<OptionsType> = [];

export const BaseSocketTypeMap = new Map<number, string>();

Object.keys(BaseSocketTypeEnum).forEach(key => {
  const item = BaseSocketTypeEnum[key] as IEnum<number>;

  BaseSocketTypeOptions.push({ label: item.name, value: item.code });

  BaseSocketTypeMap.set(item.code!, item.name);
});
