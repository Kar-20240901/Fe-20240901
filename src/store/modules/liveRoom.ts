import { defineStore } from "pinia";
import { store } from "../utils";
import type { liveRoomType } from "@/store/types";
import { storageLocal } from "@/store/utils";

export const liveRoomKey = "kar-liveRoom";

export const useLiveRoomStore = defineStore({
  id: liveRoomKey,
  state: (): liveRoomType => ({
    roomId: storageLocal().getItem<liveRoomType>(liveRoomKey)?.roomId || "" // 实时房间主键 id
  }),
  actions: {
    // 设置：实时房间主键 id
    setRoomId(roomId: string) {
      this.roomId = roomId;

      storageLocal().setItem(liveRoomKey, {
        ...(storageLocal().getItem(liveRoomKey) as liveRoomType),
        roomId: roomId
      });
    }
  }
});

export function useLiveRoomStoreHook() {
  return useLiveRoomStore(store);
}
