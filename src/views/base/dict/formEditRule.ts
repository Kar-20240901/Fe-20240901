import type { FormRules } from "element-plus";

export const formEditRuleDict: FormRules = {
  name: [{ required: true, message: "字典名称为必填项", trigger: "blur" }],
  dictKey: [{ required: true, message: "字典key为必填项", trigger: "blur" }]
};

export const formEditRuleDictItem: FormRules = {
  name: [{ required: true, message: "字典项名称为必填项", trigger: "blur" }],
  value: [{ required: true, message: "字典项value为必填项", trigger: "blur" }]
};
