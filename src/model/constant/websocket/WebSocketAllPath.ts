// 心跳检测
export const NETTY_WEB_SOCKET_HEART_BEAT = "/netty/webSocket/heartBeat";

export interface SocketHeartBeatVO {
  socketId?: string; // 套接字主键 id
  socketRefUserId?: string; // 套接字关联用户的关联 id
}

// 实时房间 ↓

// 实时房间，用户加入房间
export const BASE_LIVE_ROOM_USER_ADD_USER = "/base/liveRoomUser/addUser";

// 实时房间，新增数据
export const BASE_LIVE_ROOM_DATA_ADD_DATA = "/base/liveRoomData/addData";

// 实时房间 ↑
