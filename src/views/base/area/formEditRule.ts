import type { FormRules } from "element-plus";

export const formEditRule: FormRules = {
  name: [{ required: true, message: "区域名称为必填项", trigger: "blur" }]
};
