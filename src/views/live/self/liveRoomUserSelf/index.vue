<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import Delete from "~icons/ep/delete";
import { BaseLiveRoomDO } from "@/api/http/base/BaseLiveRoomController";
import {
  baseLiveRoomUserSelfDeleteByIdSet,
  baseLiveRoomUserSelfPage,
  BaseLiveRoomUserSelfPageDTO,
  BaseLiveRoomUserSelfPageVO
} from "@/api/http/base/BaseLiveRoomUserSelfController";
import { useWebSocketStoreHook } from "@/store/modules/webSocket";
import { BaseLiveRoomDataAddDataRequest } from "@/api/socket/WebSocket";
import PathConstant from "@/model/constant/PathConstant";
import { useRouter } from "vue-router";
import { BaseLiveRoomDataAddDataDTO } from "@/views/live/self/liveRoomSelf/types";
import { useLiveRoomStoreHook } from "@/store/modules/liveRoom";
import { GetServerTimestamp } from "@/utils/DateUtil";
import CommonConstant from "@/model/constant/CommonConstant";
import {
  BASE_LIVE_ROOM_JOIN_ON_OTHER_DEVICE,
  BASE_LIVE_ROOM_NEW_DATA,
  BASE_LIVE_ROOM_NEW_USER
} from "@/model/constant/websocket/WebSocketReceivePath";
import { BASE_LIVE_ROOM_USER_ADD_USER } from "@/model/constant/websocket/WebSocketAllPath";
import { storeToRefs } from "pinia";

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

const { roomId } = storeToRefs(useLiveRoomStoreHook());

let mediaRecorder = ref<MediaRecorder | undefined>();

let stream = ref<MediaStream | undefined>();

let getUserMedia = ref<boolean>(false);

onMounted(() => {
  if (!roomId.value) {
    return;
  }
  onSearch(false);
});

onUnmounted(() => {
  stopRecorder();
});

function stopRecorder() {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
  }

  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  }
}

const mimeType = "video/webm; codecs=vp9,opus";

const socketRefUserId = useWebSocketStoreHook().socketRefUserId;

/**
 * 初始化录制对象
 */
function initMediaRecorder() {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
  }

  mediaRecorder.value = new window.MediaRecorder(stream.value, {
    videoBitsPerSecond: 1000000,
    audioBitsPerSecond: 64000,
    mimeType: mimeType
  });

  mediaRecorder.value.ondataavailable = e => {
    BaseLiveRoomDataAddDataRequest({
      roomId: roomId.value,
      createTs: GetServerTimestamp(),
      mediaType: mediaRecorder.value.mimeType,
      data: e.data
    });
  };

  mediaRecorder.value.start(200);
}

function startCameraAndStream() {
  if (getUserMedia.value) {
    return;
  }

  getUserMedia.value = true;

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { frameRate: 30 }
    })
    .then(
      streamTemp => {
        stream.value = streamTemp;

        const ele = document.getElementById(
          socketRefUserId
        ) as HTMLVideoElement | null;

        if (!ele) {
          return;
        }

        ele.srcObject = stream.value;

        ele.play();

        initMediaRecorder();
      },
      () => {
        ToastError("出错，请确保已允许浏览器获取音视频权限");
      }
    );
}

function onSearch(initMediaRecorderFlag: boolean) {
  baseLiveRoomUserSelfPage({
    ...search.value,
    roomId: roomId.value,
    current: currentPage.value as any,
    pageSize: pageSize.value as any
  }).then(res => {
    dataList.value = res.data.records;
    total.value = res.data.total;

    startCameraAndStream();

    if (initMediaRecorderFlag) {
      initMediaRecorder();
    }
  });
}

function resetSearch() {
  searchRef.value.resetFields();
  onSearch(false);
}

function deleteClick(row: BaseLiveRoomUserSelfPageVO) {
  ExecConfirm(
    async () => {
      await baseLiveRoomUserSelfDeleteByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch(false);
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
        onSearch(false);
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseLiveRoomDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

const router = useRouter();

const dataMap = ref<Record<string, SourceBuffer>>({});
const dataArrMap = ref<Record<string, Uint8Array[]>>({});
const dataAppendMap = ref<Record<string, boolean>>({});
const dataInitMap = ref<Record<string, boolean>>({});
const dataInitExecFlagMap = ref<Record<string, boolean>>({});

function appendBufferToSource(
  buffer: Uint8Array,
  id: string,
  shiftFlag: boolean
) {
  if (!buffer || buffer.length === 0) {
    return;
  }

  if (dataAppendMap.value[id]) {
    if (dataArrMap.value[id]) {
      if (shiftFlag) {
        dataArrMap.value[id].unshift(buffer);
      } else {
        dataArrMap.value[id].push(buffer);
      }
    } else {
      dataArrMap.value[id] = [buffer];
    }

    return;
  }

  dataAppendMap.value[id] = true;

  // dataMap.value[id].appendBuffer(buffer);
}

useWebSocketStoreHook().$subscribe((mutation, state) => {
  if (state.webSocketMessage.uri === BASE_LIVE_ROOM_NEW_DATA) {
    if (state.webSocketMessage.code !== CommonConstant.API_OK_CODE) {
      ToastError(state.webSocketMessage.msg);

      return;
    }

    if (
      !state.webSocketMessage.arrayBuffer ||
      state.webSocketMessage.arrayBuffer.byteLength <= 0
    ) {
      console.log("收到无效数据：数据长度为 0");

      return;
    }

    const data = state.webSocketMessage.data as BaseLiveRoomDataAddDataDTO;

    if (data.socketRefUserId === socketRefUserId) {
      console.log("收到无效数据：", socketRefUserId);

      return;
    }

    let eleId = data.socketRefUserId;

    const ele = document.getElementById(eleId) as HTMLVideoElement | null;

    if (!ele) {
      console.log("未找到元素：", eleId);

      return;
    }

    if (dataInitMap.value[eleId]) {
      appendBufferToSource(state.webSocketMessage.arrayBuffer, eleId, false);
    } else {
      if (dataInitExecFlagMap.value[eleId]) {
        appendBufferToSource(state.webSocketMessage.arrayBuffer, eleId, false);

        return;
      }

      dataInitExecFlagMap.value[eleId] = true;

      // 创建 MediaSource 对象
      const mediaSource = new MediaSource();
      ele.src = URL.createObjectURL(mediaSource);

      let sourceBuffer = null;

      mediaSource.onsourceopen = () => {
        sourceBuffer = mediaSource.addSourceBuffer(mimeType);

        dataMap.value[eleId] = sourceBuffer;

        sourceBuffer.onupdateend = () => {
          dataAppendMap.value[eleId] = false;

          if (dataArrMap.value[eleId] && dataArrMap.value[eleId].length) {
            const nextBuffer = dataArrMap.value[eleId].shift();

            appendBufferToSource(nextBuffer, eleId, true);
          }
        };

        dataInitMap.value[eleId] = true;

        appendBufferToSource(state.webSocketMessage.arrayBuffer, eleId, false);
      };
    }
  } else if (state.webSocketMessage.uri === BASE_LIVE_ROOM_NEW_USER) {
    console.log("有新用户加入");

    onSearch(true);
  } else if (state.webSocketMessage.uri === BASE_LIVE_ROOM_USER_ADD_USER) {
    console.log("加入房间的响应");

    if (state.webSocketMessage.code !== CommonConstant.API_OK_CODE) {
      ToastError(state.webSocketMessage.msg);
    }
  } else if (
    state.webSocketMessage.uri === BASE_LIVE_ROOM_JOIN_ON_OTHER_DEVICE
  ) {
    ToastError("您已经在其他设备上加入此房间");

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
      <div class="bg-bg_color px-8 pt-[12px] mb-3">
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
              @click="() => onSearch(false)"
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
              :id="scope.row.socketRefUserId"
              class="w-[30px] h-[30px]"
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
          @change="() => onSearch(false)"
        />
      </div>
    </div>
  </div>
</template>
