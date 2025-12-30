<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import CircleCheck from "~icons/ep/circle-check";
import CircleClose from "~icons/ep/circle-close";
import Hide from "~icons/ep/hide";
import Refresh from "~icons/ep/refresh";
import { onMounted, ref, useTemplateRef } from "vue";
import {
  baseImApplyFriendAgree,
  baseImApplyFriendHidden,
  baseImApplyFriendPage,
  BaseImApplyFriendPageDTO,
  BaseImApplyFriendPageVO,
  baseImApplyFriendReject
} from "@/api/http/base/BaseImApplyFriendController";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import {
  BaseImApplyStatusEnum,
  BaseImApplyStatusEnumMap
} from "@/model/enum/im/BaseImApplyStatusEnum";
import { baseImBlockAddFriend } from "@/api/http/base/BaseImBlockController";
import KarOneInputTextarea from "@/components/KarOneInputTextarea/index.vue";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import Avatar from "@/assets/user.png";
import type { R } from "@/model/vo/R";
import {
  IDialogFormOneInputDTO,
  IOneInputDialogFormDefineExpose
} from "@/model/types/IDialogFormProps";

const search = ref<BaseImApplyFriendPageDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImApplyFriendPageVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);
const selectUserIdArr = ref<string[]>([]);

function resetSelectIdArr() {
  selectIdArr.value = [];
  selectUserIdArr.value = [];
}

function onSearch() {
  loading.value = true;
  baseImApplyFriendPage({
    ...search.value,
    toMeFlag: true,
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

function agreeBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyFriendAgree({
        idSet: [...selectIdArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定同意勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function rejectBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  rejectIdArr = [...selectIdArr.value];

  rejectBatchFlag = true;

  rejectDialogRef.value?.open();
}

function hiddenBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyFriendHidden({
        idSet: [...selectIdArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定隐藏勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function blockBySelectIdArr() {
  if (!selectUserIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockAddFriend({
        idSet: [...selectUserIdArr.value]
      }).then(res => {
        selectUserIdArr.value = [];
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定拉黑勾选的【${selectUserIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseImApplyFriendPageVO[]) {
  selectIdArr.value = rowArr.map(it => it.id);

  selectUserIdArr.value = rowArr.map(it => it.userId);
}

function agreeClick(item?: BaseImApplyFriendPageVO) {
  if (!item?.id) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyFriendAgree({
        idSet: [item.id]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定同意【${item.nickname}】的好友申请吗？`
  );
}

let rejectIdArr: string[] = [];
let rejectBatchFlag: boolean = false;

function rejectClick(item?: BaseImApplyFriendPageVO) {
  if (!item?.id) {
    return;
  }

  rejectBatchFlag = false;

  rejectIdArr = [item.id];

  rejectDialogRef.value?.open();
}

function blockClick(item?: BaseImApplyFriendPageVO) {
  if (!item?.userId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockAddFriend({
        idSet: [item.userId]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定拉黑【${item.nickname}】吗？`
  );
}

function hiddenClick(item?: BaseImApplyFriendPageVO) {
  if (!item?.id) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyFriendHidden({
        idSet: [item.id]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定隐藏【${item.nickname}】的好友申请吗？`
  );
}

const rejectDialogRef =
  useTemplateRef<IOneInputDialogFormDefineExpose<IDialogFormOneInputDTO>>(
    "rejectDialogRef"
  );

function rejectConfirmFun() {
  const inputValue = rejectDialogRef.value.getForm().value.inputValue;

  if (rejectBatchFlag) {
    return new Promise<R<any>>((resolve, reject) => {
      ExecConfirm(
        async () => {
          await baseImApplyFriendReject({
            idSet: rejectIdArr,
            rejectReason: inputValue
          }).then(res => {
            resolve(res);
          });
        },
        async () => {
          reject();
        },
        `确定拒绝勾选的【${rejectIdArr.length}】项数据吗？`
      );
    });
  } else {
    return baseImApplyFriendReject({
      idSet: rejectIdArr,
      rejectReason: inputValue
    });
  }
}

function rejectConfirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="flex flex-col">
    <div class="pb-3 flex justify-between">
      <div class="flex">
        <el-button
          type="primary"
          :icon="useRenderIcon(CircleCheck)"
          @click="agreeBySelectIdArr"
        >
          批量同意
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(CircleClose)"
          @click="rejectBySelectIdArr"
        >
          批量拒绝
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(Hide)"
          @click="hiddenBySelectIdArr"
        >
          批量隐藏
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(Hide)"
          @click="blockBySelectIdArr"
        >
          批量拉黑
        </el-button>
      </div>

      <div>
        <el-button
          type="primary"
          :icon="useRenderIcon(Refresh)"
          :loading="loading"
          @click="onSearch"
        >
          刷新
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
      <el-table-column prop="applyContent" label="申请内容" />
      <el-table-column #default="scope" prop="status" label="状态" width="70">
        {{ BaseImApplyStatusEnumMap.get(scope.row.status) || "" }}
      </el-table-column>
      <el-table-column prop="rejectReason" label="拒绝原因" />
      <el-table-column
        #default="scope"
        prop="updateTime"
        label="更新时间"
        width="160"
      >
        {{ FormatDateTimeForCurrentDay(new Date(scope.row.updateTime)) }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="applyTime"
        label="申请时间"
        width="160"
      >
        {{ FormatDateTimeForCurrentDay(new Date(scope.row.applyTime)) }}
      </el-table-column>
      <el-table-column #default="scope" label="操作" fixed="right" width="200">
        <el-button
          v-if="scope.row.status === BaseImApplyStatusEnum.APPLYING.code"
          link
          type="primary"
          @click="agreeClick(scope.row)"
        >
          同意
        </el-button>
        <el-button
          v-if="scope.row.status === BaseImApplyStatusEnum.APPLYING.code"
          link
          type="primary"
          @click="rejectClick(scope.row)"
        >
          拒绝
        </el-button>
        <el-button
          v-if="!scope.row.blockFlag"
          link
          type="primary"
          @click="blockClick(scope.row)"
        >
          拉黑
        </el-button>
        <el-button link type="primary" @click="hiddenClick(scope.row)">
          隐藏
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

    <kar-one-input-textarea
      ref="rejectDialogRef"
      title="拒绝原因"
      label="拒绝原因"
      :confirm-fun="rejectConfirmFun"
      :confirm-after-fun="rejectConfirmAfterFun"
    />
  </div>
</template>
