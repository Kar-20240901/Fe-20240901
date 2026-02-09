<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref } from "vue";
import Avatar from "@/assets/user.png";
import RiSearchLine from "~icons/ri/search-line";
import AddFill from "~icons/ri/add-circle-line";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import {
  baseImGroupDeleteByIdSet,
  baseImGroupPage,
  BaseImGroupPageDTO,
  BaseImGroupPageVO
} from "@/api/http/base/BaseImGroupController";
import Delete from "~icons/ep/delete";

const search = ref<BaseImGroupPageDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImGroupPageVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);

const tableRef = ref();

function onSearch() {
  loading.value = true;
  baseImGroupPage({
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

function onSelectChange(rowArr?: BaseImGroupPageVO[]) {
  selectIdArr.value = rowArr.map(it => it.groupId);
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

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImGroupDeleteByIdSet({
        idSet: [...selectIdArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定解散勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function deleteClick(item?: BaseImGroupPageVO) {
  if (!item?.groupId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImGroupDeleteByIdSet({
        idSet: [item.groupId]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定解散【${item.groupShowName}】吗？`
  );
}

function addClick() {}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between gap-3">
      <div class="flex flex-wrap flex-1 gap-x-2 gap-y-3 mb-3">
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="addClick"
        >
          新增群组
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(Delete)"
          @click="deleteBySelectIdArr"
        >
          批量解散
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
              placeholder="请输入群组名称、群组编码"
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
      <el-table-column #default="scope" label="群组" width="180">
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
            {{ scope.row?.groupShowName }}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="groupShowId" label="群组编码" width="270" />
      <el-table-column prop="bio" label="群组简介" width="220" />
      <el-table-column
        #default="scope"
        prop="groupCreateTime"
        label="创建时间"
        width="160"
      >
        {{ FormatDateTimeForCurrentDay(new Date(scope.row.groupCreateTime)) }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="normalMuteFlag"
        label="普通成员禁言"
        width="100"
      >
        {{ scope.row.normalMuteFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="manageMuteFlag"
        label="管理员禁言"
        width="100"
      >
        {{ scope.row.manageMuteFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column #default="scope" label="操作" fixed="right" width="200">
        <el-button link type="primary" @click="deleteClick(scope.row)">
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
      :page-sizes="[10, 50, 100]"
      @change="onSearch"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
