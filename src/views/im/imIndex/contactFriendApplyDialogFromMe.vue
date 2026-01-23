<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import CircleClose from "~icons/ep/circle-close";
import Hide from "~icons/ep/hide";
import { onMounted, ref } from "vue";
import {
  baseImApplyFriendCancel,
  baseImApplyFriendHidden,
  baseImApplyFriendPage,
  BaseImApplyFriendPageDTO,
  BaseImApplyFriendPageVO
} from "@/api/http/base/BaseImApplyFriendController";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import {
  BaseImApplyStatusEnum,
  BaseImApplyStatusEnumMap
} from "@/model/enum/im/BaseImApplyStatusEnum";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import Avatar from "@/assets/user.png";
import RiSearchLine from "~icons/ri/search-line";

const search = ref<BaseImApplyFriendPageDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImApplyFriendPageVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);
const tableRef = ref();

function onSearch() {
  loading.value = true;
  baseImApplyFriendPage({
    ...search.value,
    toMeFlag: false,
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

function cancelBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyFriendCancel({
        idSet: [...selectIdArr.value]
      }).then(res => {
        selectIdArr.value = [];
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定取消申请对勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseImApplyFriendPageVO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

function cancelClick(item?: BaseImApplyFriendPageVO) {
  if (!item?.id) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyFriendCancel({
        idSet: [item.id]
      }).then(res => {
        selectIdArr.value = [];
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定取消对【${item.nickname}】的好友申请吗？`
  );
}

onMounted(() => {
  onSearch();
});

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
        selectIdArr.value = [];
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定隐藏勾选的【${selectIdArr.value.length}】项数据吗？`
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
        selectIdArr.value = [];
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定隐藏对【${item.nickname}】的好友申请吗？`
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
          :icon="useRenderIcon(CircleClose)"
          @click="cancelBySelectIdArr"
        >
          批量取消
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(Hide)"
          @click="hiddenBySelectIdArr"
        >
          批量隐藏
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
      <el-table-column prop="applyContent" label="申请内容" width="220" />
      <el-table-column #default="scope" prop="status" label="状态" width="80">
        {{ BaseImApplyStatusEnumMap.get(scope.row.status) || "" }}
      </el-table-column>
      <el-table-column prop="rejectReason" label="拒绝原因" width="220" />
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
      <el-table-column #default="scope" label="操作" fixed="right" width="120">
        <el-button
          v-if="scope.row.status === BaseImApplyStatusEnum.APPLYING.code"
          link
          type="primary"
          @click="cancelClick(scope.row)"
        >
          取消
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
  </div>
</template>
