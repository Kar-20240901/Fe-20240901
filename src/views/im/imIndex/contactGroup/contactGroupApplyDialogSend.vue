<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref, useTemplateRef } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import Avatar from "@/assets/user.png";
import AddFill from "~icons/ri/add-circle-line";
import RiSearchLine from "~icons/ri/search-line";
import KarOneInputTextarea from "@/components/KarOneInputTextarea/index.vue";
import type { R } from "@/model/vo/R";
import {
  IDialogFormOneInputDTO,
  IOneInputDialogFormDefineExpose
} from "@/model/types/IDialogFormProps";
import {
  baseImApplyGroupSearchApplyGroup,
  BaseImApplyGroupSearchApplyGroupDTO,
  BaseImApplyGroupSearchApplyGroupVO,
  baseImApplyGroupSend
} from "@/api/http/base/BaseImApplyGroupController";

const search = ref<BaseImApplyGroupSearchApplyGroupDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImApplyGroupSearchApplyGroupVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);
const tableRef = ref();

function onSearch() {
  loading.value = true;
  baseImApplyGroupSearchApplyGroup({
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

function onSelectChange(rowArr?: BaseImApplyGroupSearchApplyGroupVO[]) {
  selectIdArr.value = rowArr.map(it => it.groupId);
}

onMounted(() => {
  onSearch();
});

function sendBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  sendDialogTitle.value = `批量发起【${selectIdArr.value.length}】个群聊申请`;

  sendBatchFlag = true;

  sendIdArr = [...selectIdArr.value];

  sendDialogRef.value?.open();
}

const sendDialogTitle = ref<string>();

function applyClick(row: BaseImApplyGroupSearchApplyGroupVO) {
  if (!row?.groupId) {
    return;
  }

  sendDialogTitle.value = `发起对【${row.name}】的群聊申请`;

  sendBatchFlag = false;

  sendIdArr = [row.groupId];

  sendDialogRef.value?.open();
}

function handleSearchInputKeydown(e: KeyboardEvent) {
  const isEnter = e.key === "Enter" || e.key === "NumpadEnter";

  if (isEnter) {
    e.preventDefault();
    onSearch();
  }
}

let sendIdArr: string[] = [];
let sendBatchFlag: boolean = false;

const sendDialogRef =
  useTemplateRef<IOneInputDialogFormDefineExpose<IDialogFormOneInputDTO>>(
    "sendDialogRef"
  );

function sendConfirmFun() {
  const inputValue = sendDialogRef.value.getForm().value.inputValue;

  if (sendBatchFlag) {
    return new Promise<R<any>>((resolve, reject) => {
      ExecConfirm(
        async () => {
          await baseImApplyGroupSend({
            idSet: sendIdArr,
            applyContent: inputValue
          }).then(res => {
            resolve(res);
          });
        },
        async () => {
          reject();
        },
        `确定发起【${sendIdArr.length}】个群聊申请吗？`
      );
    });
  } else {
    return baseImApplyGroupSend({
      idSet: sendIdArr,
      applyContent: inputValue
    });
  }
}

function sendConfirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
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
        <el-form
          ref="searchRef"
          class="last-not-margin-right-form"
          :inline="true"
          :model="search"
        >
          <el-form-item prop="searchKey">
            <el-input
              v-model="search.searchKey"
              placeholder="请输入群聊名称、群聊编码"
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
      row-key="groupId"
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
      <el-table-column #default="scope" label="群聊" width="180">
        <div class="flex items-center">
          <el-image
            :src="scope.row?.avatarUrl"
            fit="cover"
            class="w-10 h-10 rounded-full"
            :preview-src-list="
              scope.row?.avatarUrl ? [scope.row?.avatarUrl] : []
            "
            preview-teleported
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
            {{ scope.row?.name }}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="uuid" label="群聊编码" width="270" />
      <el-table-column prop="bio" label="群聊简介" />
      <el-table-column #default="scope" label="操作" width="80">
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
      @change="onSearch()"
    />

    <kar-one-input-textarea
      ref="sendDialogRef"
      :title="sendDialogTitle"
      label="申请理由"
      :confirm-fun="sendConfirmFun"
      :confirm-after-fun="sendConfirmAfterFun"
      :non-required-flag="true"
    />
  </div>
</template>
