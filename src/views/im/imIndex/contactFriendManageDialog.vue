<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref } from "vue";
import Avatar from "@/assets/user.png";
import RiSearchLine from "~icons/ri/search-line";
import {
  baseImFriendPage,
  BaseImFriendPageDTO,
  BaseImFriendPageVO
} from "@/api/http/base/BaseImFriendController";
import RiUserForbidFill from "~icons/ri/user-forbid-fill";
import RiUserFollowFill from "~icons/ri/user-follow-fill";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import {
  baseImBlockAddFriend,
  baseImBlockCancelFriend
} from "@/api/http/base/BaseImBlockController";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import {
  baseImSessionRefUserAddNotDisturb,
  baseImSessionRefUserDeleteNotDisturb
} from "@/api/http/base/BaseImSessionRefUserController";

const search = ref<BaseImFriendPageDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImFriendPageVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);

const tableRef = ref();

function onSearch() {
  loading.value = true;
  baseImFriendPage({
    ...search.value,
    current: currentPage.value as any,
    pageSize: pageSize.value as any,
    queryBlockFlag: true,
    manageQueryFlag: true
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

function onSelectChange(rowArr?: BaseImFriendPageVO[]) {
  selectIdArr.value = rowArr.map(it => it.friendUserId);
}

onMounted(() => {
  onSearch();
});

function handleSearchInputKeydown(e: KeyboardEvent) {
  const isEnter = e.key === "Enter" || e.key === "NumpadEnter";

  if (isEnter) {
    e.preventDefault();
    onSearch();
  }
}

function resetSelectIdArr() {
  selectIdArr.value = [];
}

function notDisturbBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImSessionRefUserAddNotDisturb({
        friendUserIdSet: [...selectIdArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定免打扰勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function blockBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockAddFriend({
        idSet: [...selectIdArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定拉黑勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function cancelBlockBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockCancelFriend({
        idSet: [...selectIdArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定取消拉黑勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function blockClick(item?: BaseImFriendPageVO) {
  if (!item?.friendUserId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockAddFriend({
        idSet: [item.friendUserId]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定拉黑【${item.friendShowName}】吗？`
  );
}

function cancelBlockClick(item?: BaseImFriendPageVO) {
  if (!item?.friendUserId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockCancelFriend({
        idSet: [item.friendUserId]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定取消拉黑【${item.friendShowName}】吗？`
  );
}

function notDisturbClick(item?: BaseImFriendPageVO) {
  if (!item?.friendUserId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImSessionRefUserAddNotDisturb({
        friendUserIdSet: [item.friendUserId]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定免打扰【${item.friendShowName}】吗？`
  );
}

function cancelNotDisturbClick(item?: BaseImFriendPageVO) {
  if (!item?.friendUserId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImSessionRefUserDeleteNotDisturb({
        friendUserIdSet: [item.friendUserId]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定取消免打扰【${item.friendShowName}】吗？`
  );
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between">
      <div class="flex">
        <el-button
          type="primary"
          :icon="useRenderIcon(RiUserForbidFill)"
          @click="blockBySelectIdArr"
        >
          批量拉黑
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(RiUserFollowFill)"
          @click="cancelBlockBySelectIdArr"
        >
          取消拉黑
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(RiUserForbidFill)"
          @click="notDisturbBySelectIdArr"
        >
          批量免打扰
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
      row-key="userId"
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
            {{ scope.row?.friendShowName }}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="friendShowId" label="用户编码" width="270" />
      <el-table-column prop="bio" label="个人简介" width="220" />
      <el-table-column
        #default="scope"
        prop="friendCreateTime"
        label="创建时间"
        width="160"
      >
        {{ FormatDateTimeForCurrentDay(new Date(scope.row.friendCreateTime)) }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="notDisturbFlag"
        label="免打扰"
        width="100"
      >
        {{ scope.row.notDisturbFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="blockFlag"
        label="是否拉黑"
        width="100"
      >
        {{ scope.row.blockFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column #default="scope" label="操作" fixed="right" width="200">
        <el-button
          v-if="!scope.row.notDisturbFlag"
          link
          type="primary"
          @click="notDisturbClick(scope.row)"
        >
          免打扰
        </el-button>
        <el-button
          v-if="scope.row.notDisturbFlag"
          link
          type="primary"
          @click="cancelNotDisturbClick(scope.row)"
        >
          取消免打扰
        </el-button>
        <el-button
          v-if="!scope.row.blockFlag"
          link
          type="primary"
          @click="blockClick(scope.row)"
        >
          拉黑
        </el-button>
        <el-button
          v-if="scope.row.blockFlag"
          link
          type="primary"
          @click="cancelBlockClick(scope.row)"
        >
          取消拉黑
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
