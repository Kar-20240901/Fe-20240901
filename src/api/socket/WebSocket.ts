import { GetMyWebSocket } from "@/utils/webSocket/WebSocketUtil";
import { WebSocketSend } from "@/utils/webSocket/WebSocketHelper";
import { JsonAddByteArr } from "@/utils/BlobUtil";
import type {
  BaseLiveRoomDataAddDataDTO,
  BaseLiveRoomUserAddUserDTO
} from "@/views/live/self/liveRoomSelf/types";
import {
  BASE_LIVE_ROOM_DATA_ADD_DATA,
  BASE_LIVE_ROOM_USER_ADD_USER,
  NETTY_WEB_SOCKET_HEART_BEAT
} from "@/model/constant/websocket/WebSocketAllPath";

/**
 * 心跳检测，请求
 */
export function HeartBeatRequest(
  webSocket: WebSocket | null = GetMyWebSocket()
) {
  return WebSocketSend(webSocket, { uri: NETTY_WEB_SOCKET_HEART_BEAT });
}

/**
 * 实时房间，用户加入房间，请求
 */
export function BaseLiveRoomUserAddUserRequest(
  dto: BaseLiveRoomUserAddUserDTO,
  webSocket: WebSocket | null = GetMyWebSocket()
) {
  return WebSocketSend(webSocket, {
    uri: BASE_LIVE_ROOM_USER_ADD_USER,
    data: { ...dto }
  });
}

/**
 * 实时房间，新增数据，请求
 */
export function BaseLiveRoomDataAddDataRequest(
  dto: BaseLiveRoomDataAddDataDTO,
  webSocket: WebSocket | null = GetMyWebSocket()
) {
  const json = {
    uri: BASE_LIVE_ROOM_DATA_ADD_DATA,
    data: {
      roomId: dto.roomId,
      createTs: dto.createTs,
      mediaType: dto.mediaType
    }
  };

  const blob = JsonAddByteArr(json, dto.data);

  WebSocketSend(webSocket, blob, true);
}
