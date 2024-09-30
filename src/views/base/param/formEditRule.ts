import type { FormRules } from "element-plus";

export const formEditRule: FormRules = {
  name: [{ required: true, message: "参数名称为必填项", trigger: "blur" }],
  value: [{ required: true, message: "参数值为必填项", trigger: "blur" }]
};
