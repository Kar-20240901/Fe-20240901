<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import FormEdit from "@/views/base/userDeleteLog/formEdit.vue";
import {
  baseUserDeleteLogDeleteByIdSet,
  BaseUserDeleteLogDO,
  baseUserDeleteLogInfoById,
  baseUserDeleteLogPage,
  BaseUserDeleteLogPageDTO
} from "@/api/http/base/BaseUserDeleteLogController";
import Delete from "@iconify-icons/ep/delete";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";

defineOptions({
  name: "BaseUserDeleteLog"
});

const search = ref<BaseUserDeleteLogPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseUserDeleteLogDO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const tableRef = ref();

const selectIdArr = ref<string[]>([]);

onMounted(() => {
  onSearch();
});

function onSearch() {
  loading.value = true;
  baseUserDeleteLogPage({
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

function onSelectChange(rowArr?: BaseUserDeleteLogDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

const formRef = ref();
const title = ref<string>("");

function viewClick(row: BaseUserDeleteLogDO) {
  title.value = "查看用户注销详情";
  formRef.value.editOpen(baseUserDeleteLogInfoById({ id: row.id }));
}

function deleteClick(row: BaseUserDeleteLogDO) {
  ExecConfirm(
    async () => {
      await baseUserDeleteLogDeleteByIdSet({ idSet: [row.id] }).then(res => {
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
      await baseUserDeleteLogDeleteByIdSet({ idSet: selectIdArr.value }).then(
        res => {
          ToastSuccess(res.msg);
          onSearch();
        }
      );
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}
</script>

<template>
  <div class="flex flex-col">
    <div class="search-form bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="用户名：" prop="username">
          <el-input
            v-model="search.username"
            placeholder="请输入用户名"
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column
          #default="scope"
          prop="userCreateTime"
          label="创建时间"
        >
          {{ FormatDateTimeForCurrentDay(new Date(scope.row.userCreateTime)) }}
        </el-table-column>
        <el-table-column #default="scope" prop="createTime" label="删除时间">
          {{ FormatDateTimeForCurrentDay(new Date(scope.row.createTime)) }}
        </el-table-column>
        <el-table-column #default="scope" label="操作">
          <el-button
            link
            type="primary"
            :icon="useRenderIcon('ep:view')"
            @click="viewClick(scope.row)"
          >
            查看
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

    <form-edit ref="formRef" :title="title" />
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
