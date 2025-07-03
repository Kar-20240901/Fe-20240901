import { defineStore } from "pinia";
import { store, type webSocketType } from "../utils";
import type { IWebSocketMessage } from "@/utils/webSocket/WebSocketHelper";

export const useWebSocketStore = defineStore("kar-webSocket", {
  state: (): webSocketType => ({
    webSocketStatus: false, // webSocket连接状态
    webSocketMessage: {} as IWebSocketMessage<any>, // webSocket消息
    socketRefUserId: "" // 套接字关联用户的关联 id
  }),
  actions: {
    // 设置：webSocket连接状态
    setWebSocketStatus(webSocketStatus: boolean) {
      this.webSocketStatus = webSocketStatus;
    },
    // 设置：webSocket消息
    setWebSocketMessage<T>(webSocketMessage: IWebSocketMessage<T>) {
      this.webSocketMessage = webSocketMessage;
    },
    // 设置：套接字关联用户的关联 id
    setSocketRefUserId(socketRefUserId: string) {
      this.socketRefUserId = socketRefUserId;
    }
  }
});

export function useWebSocketStoreHook() {
  return useWebSocketStore(store);
}
