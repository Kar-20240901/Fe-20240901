<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import {
  baseSocketDeleteByIdSet,
  baseSocketDisableByIdSet,
  BaseSocketDO,
  baseSocketEnableByIdSet,
  baseSocketPage,
  BaseSocketPageDTO
} from "@/api/http/base/BaseSocketController";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import { BaseSocketTypeMap } from "@/model/enum/BaseSocketTypeEnum";

defineOptions({
  name: "BaseSocket"
});

const search = ref<BaseSocketPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseSocketDO[]>([]);
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
  baseSocketPage({
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

function enableClick(row: BaseSocketDO) {
  ExecConfirm(
    async () => {
      await baseSocketEnableByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定启用【${row.id}】吗？`
  );
}

function disableClick(row: BaseSocketDO) {
  ExecConfirm(
    async () => {
      await baseSocketDisableByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定禁用【${row.id}】吗？`
  );
}

function deleteClick(row: BaseSocketDO) {
  ExecConfirm(
    async () => {
      await baseSocketDeleteByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除【${row.id}】吗？`
  );
}

function enableBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseSocketEnableByIdSet({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定启用勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function disableBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseSocketDisableByIdSet({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定禁用勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseSocketDeleteByIdSet({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseSocketDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="search-form bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="id：" prop="id">
          <el-input
            v-model="search.id"
            placeholder="请输入id"
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
            :icon="useRenderIcon('ep:circle-check')"
            @click="enableBySelectIdArr"
          >
            批量启用
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ep:circle-close')"
            @click="disableBySelectIdArr"
          >
            批量禁用
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
        <el-table-column prop="id" label="id" />
        <el-table-column #default="scope" prop="type" label="类型" width="100">
          {{ BaseSocketTypeMap.get(scope.row.type) || "" }}
        </el-table-column>
        <el-table-column #default="scope" label="地址" width="100">
          {{
            scope.row.scheme + scope.row.host + scope.row.port + scope.row.path
          }}
        </el-table-column>
        <el-table-column
          #default="scope"
          prop="createTime"
          label="创建时间"
          width="100"
        >
          {{ FormatDateTimeForCurrentDay(new Date(scope.row.createTime)) }}
        </el-table-column>
        <el-table-column
          #default="scope"
          prop="enableFlag"
          label="禁用"
          width="100"
        >
          {{ scope.row.enableFlag ? "否" : "是" }}
        </el-table-column>
        <el-table-column #default="scope" label="操作">
          <el-button
            link
            type="primary"
            :icon="useRenderIcon('ep:circle-check')"
            @click="enableClick(scope.row)"
          >
            启用
          </el-button>
          <el-button
            link
            type="primary"
            :icon="useRenderIcon('ep:circle-close')"
            @click="disableClick(scope.row)"
          >
            禁用
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
