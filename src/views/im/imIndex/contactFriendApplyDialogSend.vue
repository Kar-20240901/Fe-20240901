<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref } from "vue";
import {
  baseImApplyFriendSearchApplyFriend,
  BaseImApplyFriendSearchApplyFriendDTO,
  BaseImApplyFriendSearchApplyFriendVO,
  baseImApplyFriendSend
} from "@/api/http/base/BaseImApplyFriendController";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import Avatar from "@/assets/user.png";
import AddFill from "~icons/ri/add-circle-line";
import RiSearchLine from "~icons/ri/search-line";

const search = ref<BaseImApplyFriendSearchApplyFriendDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImApplyFriendSearchApplyFriendVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);
const tableRef = ref();

function onSearch() {
  loading.value = true;
  baseImApplyFriendSearchApplyFriend({
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

defineExpose({
  onSearch
});

function onSelectChange(rowArr?: BaseImApplyFriendSearchApplyFriendVO[]) {
  selectIdArr.value = rowArr.map(it => it.userId);
}

onMounted(() => {
  onSearch();
});

function sendBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyFriendSend({
        idSet: selectIdArr.value
      }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定发起对勾选的【${selectIdArr.value.length}】个用户的好友申请吗？`
  );
}

function applyClick(row: BaseImApplyFriendSearchApplyFriendVO) {
  ExecConfirm(
    async () => {
      await baseImApplyFriendSend({
        idSet: [row.userId]
      }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定发起对【${row.nickname}（${row.uuid}）】的好友申请吗？`
  );
}

function handleSearchInputKeydown(e: KeyboardEvent) {
  const isEnter = e.key === "Enter" || e.key === "NumpadEnter";

  if (isEnter) {
    e.preventDefault();
    onSearch();
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between">
      <div class="flex">
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="sendBySelectIdArr"
        >
          批量申请
        </el-button>
      </div>

      <div>
        <el-form ref="searchRef" :inline="true" :model="search">
          <el-form-item prop="searchKey">
            <el-input
              v-model="search.searchKey"
              placeholder="请输入用户昵称、用户编码"
              clearable
              class="!w-[220px]"
              @keydown="handleSearchInputKeydown"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :icon="useRenderIcon(RiSearchLine)"
              :loading="loading"
              @click="onSearch"
            >
              搜索
            </el-button>
          </el-form-item>
        </el-form>
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
      height="45vh"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" />
      <el-table-column #default="scope" label="用户" width="180">
        <div class="flex items-center">
          <el-image
            :src="scope.row?.avatarUrl"
            fit="cover"
            class="w-10 h-10 rounded-full"
          >
            <template #error>
              <el-image
                :src="Avatar"
                fit="cover"
                class="w-10 h-10 rounded-full"
              />
            </template>
          </el-image>
          <div class="text-sm ml-2">
            {{ scope.row?.nickname }}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="uuid" label="用户编码" />
      <el-table-column prop="bio" label="个人简介" />
      <el-table-column #default="scope" label="操作" width="120">
        <el-button link type="primary" @click="applyClick(scope.row)">
          申请
        </el-button>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      class="mt-3"
      layout="->, prev, pager, next, jumper, sizes, total"
      :total="total"
      :page-sizes="[10, 50, 100]"
      @change="onSearch"
    />
  </div>
</template>
