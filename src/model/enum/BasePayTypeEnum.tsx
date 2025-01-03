import { ToastInfo, ToastSuccess } from "@/utils/ToastUtil";
import type { IEnum } from "@/model/enum/CommonEnum";
import type { BuyVO } from "@/api/http/base/BaseUserWalletController";
import { GetBrowserCategory } from "@/utils/BrowserCategoryUtil";
import { TempRequestCategoryEnum } from "@/model/enum/TempRequestCategoryEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBasePayTypeItemEnum extends IEnum<number> {
  openPay?: (
    buyVO: BuyVO,
    ScanTheCodeToPay: () => void,
    callBack?: () => void,
    hiddenMsg?: boolean
  ) => void; // 打开支付，备注：默认是扫码付款
}

export interface IBasePayTypeEnum {
  ALI_QR_CODE: IBasePayTypeItemEnum;
  ALI_APP: IBasePayTypeItemEnum;
  ALI_WEB_PC: IBasePayTypeItemEnum;
  ALI_WEB_APP: IBasePayTypeItemEnum;

  WX_NATIVE: IBasePayTypeItemEnum;
  WX_JSAPI: IBasePayTypeItemEnum;
  WX_H5: IBasePayTypeItemEnum;

  UNION: IBasePayTypeItemEnum;
  GOOGLE: IBasePayTypeItemEnum;
  APPLY: IBasePayTypeItemEnum;
}

// 支付方式类型枚举类
export const BasePayTypeEnum: IBasePayTypeEnum = {
  ALI_QR_CODE: {
    code: 101,
    name: "支付宝-扫码付款"
  },

  ALI_APP: {
    code: 102,
    name: "支付宝-手机支付"
  },

  ALI_WEB_PC: {
    code: 103,
    name: "支付宝-电脑网站支付"
  },

  ALI_WEB_APP: {
    code: 104,
    name: "支付宝-手机网站支付"
  },

  WX_NATIVE: {
    code: 201,
    name: "微信-native",

    openPay: (buyVO, ScanTheCodeToPay) => {
      if (window.WeixinJSBridge) {
        const browserCategory = GetBrowserCategory();

        if (
          browserCategory === TempRequestCategoryEnum.ANDROID_BROWSER_WX.code ||
          browserCategory === TempRequestCategoryEnum.IOS_BROWSER_WX.code
        ) {
          ToastInfo(
            <div className={"flex flex-col"}>
              <el-text className={"my-[10px]"} type="info">
                请复制下面的链接，然后发送给任意联系人，然后点击发送之后的消息，即可打开微信支付
              </el-text>

              <el-text>{buyVO.payReturnValue}</el-text>

              <el-text className={"mt-[10px]"} type="info">
                或者扫码支付
              </el-text>

              <div className={"w-full flex justify-center items-center"}>
                {/*<QRCode*/}
                {/*  value={buyVO.payReturnValue!}*/}
                {/*  size={CommonConstant.QR_CODE_WIDTH}*/}
                {/*  bordered={false}*/}
                {/*/>*/}
              </div>
            </div>,
            60 * 60 * 24
          );
        } else {
          ScanTheCodeToPay(); // 扫码付款
        }
      } else {
        ScanTheCodeToPay(); // 扫码付款
      }
    }
  },

  WX_JSAPI: {
    code: 202,
    name: "微信-jsApi",

    openPay: (buyVO, ScanTheCodeToPay, callBack, hiddenMsg) => {
      window.WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        JSON.parse(buyVO.payReturnValue!),

        function (res: { err_msg: string }) {
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            if (!hiddenMsg) {
              ToastSuccess("购买成功");
            }

            if (callBack) {
              callBack();
            }
          }
        }
      );
    }
  },

  WX_H5: {
    code: 203,
    name: "微信-h5支付"
  },

  UNION: {
    code: 301,
    name: "云闪付"
  },

  GOOGLE: {
    code: 401,
    name: "谷歌"
  },

  APPLY: {
    code: 501,
    name: "苹果"
  }
};

export const BasePayTypeOptions: Array<OptionsType> = [];

export const BasePayTypeMap = new Map<number, string>();

export const BasePayTypeItemMap = new Map<number, IBasePayTypeItemEnum>();

Object.keys(BasePayTypeEnum).forEach(key => {
  const item = BasePayTypeEnum[key] as IBasePayTypeItemEnum;

  BasePayTypeOptions.push({ label: item.name, value: item.code });

  BasePayTypeMap.set(item.code, item.name);

  BasePayTypeItemMap.set(item.code, item);
});

/**
 * 获取：支付名称的前缀
 */
export function GetBasePayTypeNamePre(name?: string) {
  if (!name) {
    return "";
  }

  return name!.split("-")[0];
}
