import type { IEnum } from "@/model/enum/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface ITempRequestCategoryEnum {
  PC_BROWSER_WINDOWS: IEnum<number>;
  PC_BROWSER_MAC: IEnum<number>;
  PC_BROWSER_LINUX: IEnum<number>;

  PC_BROWSER_WINDOWS_WX: IEnum<number>;
  PC_BROWSER_MAC_WX: IEnum<number>;
  PC_BROWSER_LINUX_WX: IEnum<number>;

  PC_CLIENT_WINDOWS: IEnum<number>;
  PC_CLIENT_MAC: IEnum<number>;
  PC_CLIENT_LINUX: IEnum<number>;

  ANDROID: IEnum<number>;
  ANDROID_BROWSER: IEnum<number>;
  ANDROID_BROWSER_WX: IEnum<number>;

  IOS: IEnum<number>;
  IOS_BROWSER: IEnum<number>;
  IOS_BROWSER_WX: IEnum<number>;

  MINI_PROGRAM_WE_CHAT_ANDROID: IEnum<number>;
  MINI_PROGRAM_WE_CHAT_IOS: IEnum<number>;

  WX_OFFICIAL_ACCOUNT: IEnum<number>;

  WX_WORK: IEnum<number>;
}

// 请求类别，枚举类
export const TempRequestCategoryEnum: ITempRequestCategoryEnum = {
  PC_BROWSER_WINDOWS: {
    code: 101,
    name: "windows-浏览器",
    browserFlag: true
  },
  PC_BROWSER_MAC: {
    code: 102,
    name: "mac-浏览器",
    browserFlag: true
  },
  PC_BROWSER_LINUX: {
    code: 103,
    name: "linux-浏览器",
    browserFlag: true
  },

  PC_BROWSER_WINDOWS_WX: {
    code: 104,
    name: "windows-浏览器-微信",
    browserFlag: true
  },
  PC_BROWSER_MAC_WX: {
    code: 105,
    name: "mac-浏览器-微信",
    browserFlag: true
  },
  PC_BROWSER_LINUX_WX: {
    code: 106,
    name: "linux-浏览器-微信",
    browserFlag: true
  },

  PC_CLIENT_WINDOWS: {
    code: 201,
    name: "windows-客户端"
  },
  PC_CLIENT_MAC: {
    code: 202,
    name: "mac-客户端"
  },
  PC_CLIENT_LINUX: {
    code: 203,
    name: "linux-客户端"
  },

  ANDROID: {
    code: 301,
    name: "安卓端"
  },
  ANDROID_BROWSER: {
    code: 302,
    name: "安卓-浏览器",
    browserFlag: true
  },
  ANDROID_BROWSER_WX: {
    code: 303,
    name: "安卓-浏览器-微信",
    browserFlag: true
  },

  IOS: {
    code: 401,
    name: "苹果端"
  },
  IOS_BROWSER: {
    code: 402,
    name: "苹果-浏览器",
    browserFlag: true
  },
  IOS_BROWSER_WX: {
    code: 403,
    name: "苹果-浏览器-微信",
    browserFlag: true
  },

  MINI_PROGRAM_WE_CHAT_ANDROID: {
    code: 501,
    name: "小程序-微信-安卓"
  },
  MINI_PROGRAM_WE_CHAT_IOS: {
    code: 502,
    name: "小程序-微信-苹果"
  },

  WX_OFFICIAL_ACCOUNT: {
    code: 601,
    name: "微信公众号"
  },

  WX_WORK: {
    code: 701,
    name: "企业微信"
  }
};

export const TempRequestCategoryOptions: Array<OptionsType> = [];
export const TempRequestCategoryMap = new Map<number, string>();

Object.keys(TempRequestCategoryEnum).forEach(key => {
  const item = TempRequestCategoryEnum[key] as IEnum<number>;

  TempRequestCategoryMap.set(item.code, item.name);
  TempRequestCategoryOptions.push({ label: item.name, value: item.code });
});
