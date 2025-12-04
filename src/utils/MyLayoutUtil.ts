import CommonConstant from "@/model/constant/CommonConstant";

/**
 * 获取操作内容高度，会减去 footer的高度
 */
export function getContentHeight() {
  const growEle: HTMLElement = document.querySelector(".kar-grow-content");

  const contentEle: HTMLElement = document.querySelector(".main-content");

  const contentComputedStyle = window.getComputedStyle(contentEle);

  const contentMargin = parseFloat(contentComputedStyle?.margin) || 0;

  const footEle: HTMLElement = document.querySelector(".layout-footer");

  return growEle?.offsetHeight - footEle?.offsetHeight - contentMargin;
}

/**
 * 获取操作内容宽度
 */
export function getMainContentWidth() {
  const mainContentEle: HTMLElement = document.querySelector(".main-content");

  return mainContentEle?.offsetWidth;
}

/**
 * 获取操作内容宽度
 */
export function getKarGrowContentWidth() {
  const growEle: HTMLElement = document.querySelector(".kar-grow-content");

  return growEle?.offsetWidth;
}

/**
 * 获取是否是移动端
 */
export function getMobileFlag() {
  return getKarGrowContentWidth() < CommonConstant.PAD_WIDTH;
}

export function getDialogWidth() {
  if (getMobileFlag()) {
    return CommonConstant.DIALOG_WIDTH_80;
  } else {
    return CommonConstant.DIALOG_WIDTH_45;
  }
}
