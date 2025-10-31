export interface IProcessText {
  text: string;
  highlightedFlag: boolean;
}

// 处理文本，拆分出需要高亮的部分
export const processText = (
  text?: string,
  highlight?: string
): IProcessText[] => {
  // 如果没有高亮文本或为空，则直接返回整个文本
  if (!highlight || !highlight.trim()) {
    return [{ text, highlightedFlag: false }];
  }

  const partArr = [];
  let currentIndex = 0;
  const highlightLength = highlight.length;

  // 循环查找所有匹配的文本并拆分
  while (currentIndex < text.length) {
    // 查找高亮文本的位置
    const index = text.indexOf(highlight, currentIndex);

    // 如果没有找到，添加剩余文本并退出循环
    if (index === -1) {
      partArr.push({
        text: text.substring(currentIndex),
        highlightedFlag: false
      });
      break;
    }

    // 添加匹配前的文本
    if (index > currentIndex) {
      partArr.push({
        text: text.substring(currentIndex, index),
        highlightedFlag: false
      });
    }

    // 添加高亮文本
    partArr.push({
      text: text.substring(index, index + highlightLength),
      highlightedFlag: true
    });

    // 更新当前索引
    currentIndex = index + highlightLength;
  }

  return partArr;
};
