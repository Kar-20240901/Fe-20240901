import type { OptionsType } from "@/components/ReSegmented";

export const yesOrNoOptions: Array<OptionsType> = [
  {
    label: "是",
    value: true
  },
  {
    label: "否",
    value: false
  }
];

export const yesOrNoMap = new Map<boolean, string>();

yesOrNoOptions.forEach(item => {
  yesOrNoMap.set(item.value, item.label as string);
});
