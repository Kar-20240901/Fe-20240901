import dayjs from "dayjs";

/**
 * 格式化时间
 */
export function FormatDateTime(date: Date = new Date()): string {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * 格式化时间
 */
export function FormatDateTimeFull(date: Date = new Date()): string {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS");
}

/**
 * 获取：是否是：1970-01-01 08:00:00，或者小于该时间
 */
export function getEpochFlag(date: Date) {
  return date.getTime() <= 0;
}

/**
 * 格式化时间戳，如果是今天，则不显示年月日
 */
export function FormatStringForCurrentDay(
  dateTimeStr?: string,
  showFullFLag: boolean = true,
  checkEpochFlag: boolean = true
): string {
  if (!dateTimeStr) {
    return "";
  }

  const date = new Date(dateTimeStr);

  if (date.toString() === "Invalid Date") {
    return "无效时间";
  }

  return FormatDateTimeForCurrentDay(date, showFullFLag, checkEpochFlag);
}

/**
 * 格式化时间戳，如果是今天，则不显示年月日
 */
export function FormatTsForCurrentDay(
  ts?: string,
  showFullFLag: boolean = true,
  checkEpochFlag: boolean = true
): string {
  if (!ts) {
    return "";
  }

  const date = new Date(Number(ts));

  if (date.toString() === "Invalid Date") {
    return "无效时间";
  }

  return FormatDateTimeForCurrentDay(date, showFullFLag, checkEpochFlag);
}

/**
 * 格式化时间，如果是今天，则不显示年月日
 */
export function FormatDateTimeForCurrentDay(
  date: Date = new Date(),
  showFullFlag: boolean = true,
  checkEpochFlag: boolean = true
): string {
  if (checkEpochFlag && getEpochFlag(date)) {
    return "-";
  }

  if (date.toString() === "Invalid Date") {
    return "无效时间";
  }

  if (showFullFlag) {
    return FormatDateTime(date);
  }

  const currentDay = Math.trunc(GetServerTimestamp() / 86400000);

  const checkDay = Math.trunc(date.getTime() / 86400000);

  if (currentDay === checkDay) {
    return dayjs(date).format("HH:mm:ss");
  }

  return FormatDateTime(date);
}

/**
 * 获取：服务器的时间戳，目的：防止不同地区的时间差，保证和服务器的时间一致
 */
export function GetServerTimestamp(
  date: Date = new Date(),
  timezone: number = 8
): number {
  const offsetGmt = date.getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟

  const nowDate = date.getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数

  return nowDate + offsetGmt * 60 * 1000 + timezone * 60 * 60 * 1000;
}

/**
 * 目标时间和当前时间的相差时间
 * type === 1：当前时间 - 目标时间
 * type === 2：目标时间 - 当前时间
 */
export function FormatTimeDiff(targetDateStr: string, type: 1 | 2 = 1) {
  const nowTimestamp = GetServerTimestamp();

  const targetDate = new Date(targetDateStr + "+08:00");
  const targetTimestamp = targetDate.getTime();

  let diffMs: number;

  if (type === 1) {
    diffMs = nowTimestamp - targetTimestamp;
  } else {
    diffMs = targetTimestamp - nowTimestamp;
  }

  if (diffMs <= 0) {
    return "-";
  }

  // 4. 换算单位
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  const year = 365 * day;

  const years = Math.floor(diffMs / year);
  diffMs %= year;

  const days = Math.floor(diffMs / day);
  diffMs %= day;

  const hours = Math.floor(diffMs / hour);

  const parts = [];

  if (years > 0) parts.push(`${years} 年`);

  if (days > 0) parts.push(`${days} 天`);

  if (hours > 0) parts.push(`${hours} 小时`);

  if (parts.length === 0) return "不足1小时";

  return parts.join(" ");
}
