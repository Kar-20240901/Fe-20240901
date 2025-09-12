<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import FormEdit from "./formEdit.vue";
import {
  baseLiveRoomSelfDeleteByIdSet,
  baseLiveRoomSelfInsertOrUpdate,
  baseLiveRoomSelfPage,
  BaseLiveRoomSelfPageDTO
} from "@/api/http/base/BaseLiveRoomSelfController";
import { BaseLiveRoomDO } from "@/api/http/base/BaseLiveRoomController";
import { BaseLiveRoomUserAddUserRequest } from "@/api/socket/WebSocket";
import { BaseLiveRoomUserAddUserDTO } from "./types";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import JoinFormEdit from "./joinFormEdit.vue";
import { R } from "@/model/vo/R";
import { useRouter } from "vue-router";
import PathConstant from "@/model/constant/PathConstant";
import { useWebSocketStoreHook } from "@/store/modules/webSocket";
import { useLiveRoomStoreHook } from "@/store/modules/liveRoom";
import { BASE_LIVE_ROOM_USER_ADD_USER } from "@/model/constant/websocket/WebSocketAllPath";
import CommonConstant from "@/model/constant/CommonConstant";

defineOptions({
  name: "BaseLiveRoomSelf"
});

const search = ref<BaseLiveRoomSelfPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseLiveRoomDO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const formRef = ref();
const title = ref<string>("");

const tableRef = ref();

const selectIdArr = ref<string[]>([]);

const joinFormRef = ref();

const router = useRouter();

onMounted(() => {
  onSearch();
});

function onSearch() {
  loading.value = true;
  baseLiveRoomSelfPage({
    ...search.value,
    current: currentPage.value as any,
    pageSize: pageSize.value as any
  })
    .then(res => {
      dataList.value = res.data.records;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

function resetSearch() {
  searchRef.value.resetFields();
  onSearch();
}

function addClick(row: BaseLiveRoomDO) {
  title.value = "新增房间";
  formRef.value.addOpen(row);
}

function confirmFun() {
  return baseLiveRoomSelfInsertOrUpdate(formRef.value.getForm().value);
}

function confirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function joinClick(row: BaseLiveRoomDO) {
  joinFormRef.value.open(row);
}

function joinConfirmFun() {
  return new Promise<R<any>>(() => {
    doJoinRoom(joinFormRef.value.getForm().value);
  });
}

function doJoinRoom(dto: BaseLiveRoomUserAddUserDTO) {
  BaseLiveRoomUserAddUserRequest(dto);
}

useWebSocketStoreHook().$subscribe((mutation, state) => {
  if (state.webSocketMessage.uri === BASE_LIVE_ROOM_USER_ADD_USER) {
    if (state.webSocketMessage.code !== CommonConstant.API_OK_CODE) {
      ToastError(state.webSocketMessage.msg);

      return;
    }

    const roomId = state.webSocketMessage.data as string;

    if (!roomId) {
      return;
    }

    useLiveRoomStoreHook().setRoomId(roomId);

    router.push(PathConstant.BaseLiveRoomUserSelf);
  }
});

function deleteClick(row: BaseLiveRoomDO) {
  ExecConfirm(
    async () => {
      await baseLiveRoomSelfDeleteByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除【${row.name}】吗？`
  );
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseLiveRoomSelfDeleteByIdSet({
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
</script>

<template>
  <div class="flex flex-col">
    <div class="bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="名称：" prop="name">
          <el-input
            v-model="search.name"
            placeholder="请输入名称"
            clearable
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri/search-line')"
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
            :icon="useRenderIcon(AddFill)"
            @click="addClick({})"
          >
            新增房间
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="joinClick({})"
          >
            加入房间
          </el-button>
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
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column #default="scope" prop="code" label="验证码">
          {{ scope.row.code || "不需要" }}
        </el-table-column>
        <el-table-column #default="scope" prop="createTime" label="创建时间">
          {{ FormatDateTimeForCurrentDay(new Date(scope.row.createTime)) }}
        </el-table-column>
        <el-table-column #default="scope" label="操作">
          <el-button
            link
            type="primary"
            :icon="useRenderIcon(EditPen)"
            @click="doJoinRoom(scope.row)"
          >
            进入
          </el-button>
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

    <form-edit
      ref="formRef"
      :title="title"
      :confirm-fun="confirmFun"
      :confirm-after-fun="confirmAfterFun"
    />

    <join-form-edit ref="joinFormRef" :confirm-fun="joinConfirmFun" />
  </div>
</template>
