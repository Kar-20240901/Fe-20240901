export default interface MyOrderDTO {
  name?: string; // 排序的字段名

  value?: "ascend" | "descend"; // ascend（升序，默认） descend（降序）
}

export interface ElDefaultOrderDTO {
  prop: string;

  order: "ascending" | "descending";
}

export interface ElOrderDTO extends ElDefaultOrderDTO {
  order: null | "ascending" | "descending";
}

export function GetMyOrderDTO(data: ElOrderDTO): MyOrderDTO {
  if (!data.order || !data.prop) {
    return {};
  }
  return {
    name: data.prop,
    value: data.order === "ascending" ? "ascend" : "descend"
  };
}
