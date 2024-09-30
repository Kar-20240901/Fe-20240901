/**
 * 针对本系统
 */
export interface Page<T> {
  total: number; // 总数
  size: number; // 每页显示条数，默认 10
  current: number; // 当前页
  records: T[]; // 查询数据列表
}
