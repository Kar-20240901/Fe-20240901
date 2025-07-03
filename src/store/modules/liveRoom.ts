import { defineStore } from "pinia";
import { store } from "../utils";
import type { liveRoomType } from "@/store/types";

export const liveRoomKey = "kar-liveRoom";

export const useLiveRoomStore = defineStore(liveRoomKey, {
  state: (): liveRoomType => ({
    roomId: "" // 实时房间主键 id
  }),
  actions: {
    // 设置：实时房间主键 id
    setRoomId(roomId: string) {
      this.roomId = roomId;
    }
  }
});

export function useLiveRoomStoreHook() {
  return useLiveRoomStore(store);
}
