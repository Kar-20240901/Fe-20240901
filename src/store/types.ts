import type { RouteRecordName } from "vue-router";
import type { IWebSocketMessage } from "@/utils/webSocket/WebSocketHelper";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
  viewportSize: { width: number; height: number };
};

export type multiType = {
  path: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  avatar?: string;
  username?: string;
  nickname?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
  passwordFlag?: boolean; // 是否有密码，用于前端显示，修改密码/设置密码
  createTime?: string; // 账号注册时间，format：date-time
  email?: string; // 邮箱，会脱敏
  id?: string; // 用户主键 id
  currentPage?: number;
  isRemembered?: boolean;
  loginDay?: number;
};

export type webSocketType = {
  webSocketStatus: boolean;
  webSocketMessage: IWebSocketMessage<any>;
  socketRefUserId: string; // 套接字关联用户的关联 id
};

export type liveRoomType = {
  roomId?: string;
};
