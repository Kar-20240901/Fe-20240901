import { defineStore } from "pinia";
import { store, type webSocketType } from "../utils";
import type { IWebSocketMessage } from "@/utils/webSocket/WebSocketHelper";

export const useWebSocketStore = defineStore({
  id: "kar-webSocket",
  state: (): webSocketType => ({
    webSocketStatus: false, // webSocket连接状态
    webSocketMessage: {} as IWebSocketMessage<any> // webSocket消息
  }),
  actions: {
    // 设置：webSocket连接状态
    setWebSocketStatus(webSocketStatus: boolean) {
      this.webSocketStatus = webSocketStatus;
    },
    // 获取：webSocket连接状态
    getWebSocketStatus() {
      return this.webSocketStatus;
    },
    // 设置：webSocket消息
    setWebSocketMessage<T>(webSocketMessage: IWebSocketMessage<T>) {
      this.webSocketMessage = webSocketMessage;
    }
  }
});

export function useWebSocketStoreHook() {
  return useWebSocketStore(store);
}
