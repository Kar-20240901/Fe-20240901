/**
 * 枚举类的 interface
 * T 一般为：number类型
 */
export interface IEnum<T = number | string> {
  code?: T;

  name?: string;

  status?: string;

  [x: string]: any;
}
