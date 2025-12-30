const escapeRegExp = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export type HighlightFragment = {
  text: string;
  highlightedFlag: boolean;
};

export function safeHighlight(
  originStr: string,
  keywords: string | string[]
): HighlightFragment[] {
  if (!originStr) return [{ text: "", highlightedFlag: false }];
  const keywordList = Array.isArray(keywords) ? keywords : [keywords];
  const validKeywords = keywordList.filter(k => !!k).map(k => escapeRegExp(k));

  if (validKeywords.length === 0) {
    return [{ text: originStr, highlightedFlag: false }];
  }

  const regStr = validKeywords.join("|");
  const reg = new RegExp(`(${regStr})`, "gi");

  const parts = originStr.split(reg);

  return parts.reduce((result, part) => {
    if (!part) return result;
    const matchReg = new RegExp(`^(${regStr})$`, "i");
    const isMatch = matchReg.test(part);
    result.push({ text: part, highlightedFlag: isMatch });
    return result;
  }, [] as HighlightFragment[]);
}
