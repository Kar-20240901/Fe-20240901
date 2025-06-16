<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import { BaseLiveRoomDO } from "@/api/http/base/BaseLiveRoomController";
import {
  baseLiveRoomUserSelfDeleteByIdSet,
  baseLiveRoomUserSelfPage,
  BaseLiveRoomUserSelfPageDTO,
  BaseLiveRoomUserSelfPageVO
} from "@/api/http/base/BaseLiveRoomUserSelfController";
import { BaseUserSelfInfoVO } from "@/api/http/base/BaseUserController";
import { useUserStoreHook } from "@/store/modules/user";
import { useWebSocketStoreHook } from "@/store/modules/webSocket";
import { BaseLiveRoomDataAddDataRequest } from "@/api/socket/WebSocket";
import PathConstant from "@/model/constant/PathConstant";
import { useRouter } from "vue-router";
import { BaseLiveRoomDataAddDataDTO } from "@/views/live/self/liveRoomSelf/types";
import { useLiveRoomStoreHook } from "@/store/modules/liveRoom";
import { GetServerTimestamp } from "@/utils/DateUtil";
import CommonConstant from "@/model/constant/CommonConstant";
import { Base64ToUint8Array } from "@/utils/BlobUtil";
import {
  BASE_LIVE_ROOM_JOIN_ON_OTHER_DEVICE,
  BASE_LIVE_ROOM_NEW_DATA,
  BASE_LIVE_ROOM_NEW_USER
} from "@/model/constant/websocket/WebSocketReceivePath";
import { BASE_LIVE_ROOM_USER_ADD_USER } from "@/model/constant/websocket/WebSocketAllPath";

defineOptions({
  name: "BaseLiveRoomUserSelf"
});

const search = ref<BaseLiveRoomUserSelfPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseLiveRoomUserSelfPageVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const tableRef = ref();

const selectIdArr = ref<string[]>([]);

const roomId = ref<string>(useLiveRoomStoreHook().$state.roomId);

useLiveRoomStoreHook().$subscribe((mutation, state) => {
  roomId.value = state.roomId;
});

let mediaRecorder: MediaRecorder;

let stream;

onMounted(() => {
  if (!roomId.value) {
    return;
  }
  onSearch();
});

onUnmounted(() => {
  stopRecorder();
});

function stopRecorder() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

function startCameraAndStream() {
  if (stream) {
    return;
  }

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { frameRate: 30 }
    })
    .then(
      streamTemp => {
        stream = streamTemp;

        const ele = document.getElementById(
          userInfo.value.id
        ) as HTMLVideoElement | null;

        if (ele) {
          ele.srcObject = stream;

          ele.play();
        }

        mediaRecorder = new window.MediaRecorder(stream, {
          videoBitsPerSecond: 1000000,
          audioBitsPerSecond: 64000,
          mimeType: "video/webm; codecs=vp9,opus"
        });

        let count = 0;

        let firstBlob: Blob | null = null;

        mediaRecorder.ondataavailable = function (e) {
          let blobData = e.data;

          if (count < 3) {
            count = count + 1;

            if (count === 1) {
              firstBlob = e.data;
              return;
            }

            if (count === 2 && firstBlob && firstBlob.size) {
              blobData = new Blob([firstBlob, blobData], {
                type: mediaRecorder.mimeType
              });
              firstBlob = null;
            }
          }

          BaseLiveRoomDataAddDataRequest({
            roomId: roomId.value,
            createTs: GetServerTimestamp(),
            mediaType: mediaRecorder.mimeType,
            data: blobData,
            firstBlobFlag: count === 2
          });
        };

        mediaRecorder.start(100);
      },
      () => {
        ToastError("出错，请确保已允许浏览器获取音视频权限");
      }
    );
}

function onSearch() {
  baseLiveRoomUserSelfPage({
    ...search.value,
    roomId: roomId.value,
    current: currentPage.value as any,
    pageSize: pageSize.value as any
  }).then(res => {
    dataList.value = res.data.records;
    total.value = res.data.total;

    startCameraAndStream();
  });
}

function resetSearch() {
  searchRef.value.resetFields();
  onSearch();
}

function deleteClick(row: BaseLiveRoomUserSelfPageVO) {
  ExecConfirm(
    async () => {
      await baseLiveRoomUserSelfDeleteByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除【${row.nickname}】吗？`
  );
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseLiveRoomUserSelfDeleteByIdSet({
        idSet: selectIdArr.value
      }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseLiveRoomDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

const userInfo = ref<BaseUserSelfInfoVO>({ ...useUserStoreHook().$state });

const router = useRouter();

const dataMap: Record<string, SourceBuffer> = {};
const dataArrMap: Record<string, Uint8Array[]> = {};
const dataAppendMap: Record<string, boolean> = {};
const dataInitMap: Record<string, boolean> = {};

function appendBufferToSource(buffer: Uint8Array, id: string, shiftFlag) {
  if (dataAppendMap[id]) {
    if (dataArrMap[id]) {
      if (shiftFlag) {
        dataArrMap[id].unshift(buffer);
      } else {
        dataArrMap[id].push(buffer);
      }
    } else {
      dataArrMap[id] = [buffer];
    }
    return;
  }

  dataAppendMap[id] = true;
  try {
    dataMap[id].appendBuffer(buffer);
  } catch (error) {
    console.error("Error appending buffer:", error);
    dataAppendMap[id] = false;
  }
}

useWebSocketStoreHook().$subscribe((mutation, state) => {
  if (state.webSocketMessage.uri === BASE_LIVE_ROOM_NEW_DATA) {
    if (
      !state.webSocketMessage.arrayBuffer ||
      state.webSocketMessage.arrayBuffer.byteLength <= 0
    ) {
      return;
    }

    const data = state.webSocketMessage.data as BaseLiveRoomDataAddDataDTO;

    if (data.userId === userInfo.value.id) {
      return;
    }

    let eleId = data.socketRefUserId;

    const ele = document.getElementById(eleId) as HTMLVideoElement | null;

    if (!ele) {
      return;
    }

    if (dataInitMap[eleId] && ele.src && dataMap[eleId]) {
      appendBufferToSource(state.webSocketMessage.arrayBuffer, eleId, false);
    } else {
      // 创建 MediaSource 对象
      const mediaSource = new MediaSource();
      ele.src = URL.createObjectURL(mediaSource);

      let sourceBuffer = null;

      mediaSource.onsourceopen = () => {
        const mimeType = "video/webm; codecs=vp9,opus";
        sourceBuffer = mediaSource.addSourceBuffer(mimeType);

        dataMap[eleId] = sourceBuffer;

        let roomUserData: BaseLiveRoomUserSelfPageVO;

        for (let i = 0; i < dataList.value.length; i++) {
          if (dataList.value[i].socketRefUserId === data.socketRefUserId) {
            roomUserData = dataList.value[i];
            break;
          }
        }

        sourceBuffer.onupdateend = () => {
          dataAppendMap[eleId] = false;

          if (dataArrMap[eleId] && dataArrMap[eleId].length) {
            const nextBuffer = dataArrMap[eleId].shift();
            appendBufferToSource(nextBuffer, eleId, true);
          }
        };

        const firstBlob = Base64ToUint8Array(roomUserData.firstBlobStr);

        appendBufferToSource(firstBlob, eleId, false);

        dataInitMap[eleId] = true;

        appendBufferToSource(state.webSocketMessage.arrayBuffer, eleId, false);
      };
    }
  } else if (state.webSocketMessage.uri === BASE_LIVE_ROOM_NEW_USER) {
    onSearch();
  } else if (state.webSocketMessage.uri === BASE_LIVE_ROOM_USER_ADD_USER) {
    if (state.webSocketMessage.code !== CommonConstant.API_OK_CODE) {
      ToastError(state.webSocketMessage.msg);
    }
  } else if (
    state.webSocketMessage.uri === BASE_LIVE_ROOM_JOIN_ON_OTHER_DEVICE
  ) {
    router.push(PathConstant.BaseLiveRoomSelf);
  }
});

function chooseRoomClick() {
  router.push(PathConstant.BaseLiveRoomSelf);
}
</script>

<template>
  <div>
    <div v-if="!roomId" class="flex w-full justify-center items-center">
      <a @click="chooseRoomClick">请选择要加入的房间</a>
    </div>

    <div v-else class="flex flex-col">
      <div class="search-form bg-bg_color px-8 pt-[12px] mb-3">
        <el-form ref="searchRef" :inline="true" :model="search">
          <el-form-item label="名称：" prop="searchKey">
            <el-input
              v-model="search.searchKey"
              placeholder="请输入名称"
              clearable
              class="!w-[180px]"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :icon="useRenderIcon('ri:search-line')"
              :loading="loading"
              @click="onSearch"
            >
              搜索
            </el-button>
            <el-button :icon="useRenderIcon(Refresh)" @click="resetSearch()">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="flex flex-col px-5 py-3 bg-bg_color">
        <div class="pb-3 flex justify-between">
          <div />

          <div>
            <el-button
              type="primary"
              :icon="useRenderIcon(Delete)"
              @click="deleteBySelectIdArr"
            >
              批量删除
            </el-button>
          </div>
        </div>

        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="dataList"
          row-key="id"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          show-overflow-tooltip
          stripe
          highlight-current-row
          @selection-change="onSelectChange"
        >
          <el-table-column type="selection" />
          <el-table-column prop="nickname" label="用户昵称" />
          <el-table-column #default="scope" label="用户展示">
            <video
              :id="
                scope.row.userId === userInfo.id
                  ? scope.row.userId
                  : scope.row.socketRefUserId
              "
              controls
              autoplay
            />
          </el-table-column>
          <el-table-column #default="scope" label="操作">
            <el-button
              link
              type="primary"
              :icon="useRenderIcon(Delete)"
              @click="deleteClick(scope.row)"
            >
              删除
            </el-button>
          </el-table-column>
        </el-table>

        <el-pagination
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          class="mt-3"
          layout="->, prev, pager, next, jumper, sizes, total"
          :total="total"
          :page-sizes="[15, 50, 100]"
          @change="onSearch"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

:deep(td.el-table__cell > div) {
  display: flex;
  align-items: center;
}
</style>
