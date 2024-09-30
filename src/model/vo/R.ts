/**
 * 针对本系统
 */
export interface R<T = string> {
  code: number;
  receive: boolean;
  msg: string;
  data: T;
  service: string;
}
