import { DevFlag } from "@/utils/SysUtil";

export const baseApi = (url: string) => {
  if (DevFlag()) {
    return `/baseApi${url}`;
  } else {
    return `${window.apiUrl}${url}`;
  }
};
