import { TempRequestCategoryEnum } from "@/views/base/user/enums";

let browserCategory: number | null = null;

export function GetBrowserCategory() {
  if (browserCategory === null) {
    browserCategory = DoGetBrowserCategory();
  }

  return browserCategory;
}

export function DoGetBrowserCategory(): number {
  // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.200'

  // 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36 Edg/115.0.1901.200'

  const userAgent = navigator.userAgent;

  if (/(MicroMessenger)/i.test(userAgent)) {
    if (/(Android)/i.test(userAgent)) {
      return TempRequestCategoryEnum.ANDROID_BROWSER_WX.code!; // 安卓-浏览器-微信
    } else if (/(iPhone|iPad|iPod|iOS)/i.test(userAgent)) {
      return TempRequestCategoryEnum.IOS_BROWSER_WX.code!; // 苹果-浏览器-微信
    } else if (/(Mac)/i.test(userAgent)) {
      return TempRequestCategoryEnum.PC_BROWSER_MAC_WX.code!; // mac-浏览器-微信
    } else if (/(Linux)/i.test(userAgent)) {
      return TempRequestCategoryEnum.PC_BROWSER_LINUX_WX.code!; // linux-浏览器-微信
    } else if (/(Windows)/i.test(userAgent)) {
      return TempRequestCategoryEnum.PC_BROWSER_WINDOWS_WX.code!; // windows-浏览器-微信
    }

    return TempRequestCategoryEnum.ANDROID_BROWSER_WX.code!; // 安卓-浏览器-微信
  } else if (/(Android)/i.test(userAgent)) {
    return TempRequestCategoryEnum.ANDROID_BROWSER.code!; // 安卓-浏览器
  } else if (/(iPhone|iPad|iPod|iOS)/i.test(userAgent)) {
    return TempRequestCategoryEnum.IOS_BROWSER.code!; // 苹果-浏览器
  } else if (/(Mac)/i.test(userAgent)) {
    return TempRequestCategoryEnum.PC_BROWSER_MAC.code!; // mac-浏览器
  } else if (/(Linux)/i.test(userAgent)) {
    return TempRequestCategoryEnum.PC_BROWSER_LINUX.code!; // linux-浏览器
  }

  return TempRequestCategoryEnum.PC_BROWSER_WINDOWS.code!; // windows-浏览器
}
