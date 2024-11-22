<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import {
  TempRequestCategoryEnum,
  TempRequestCategoryMap
} from "@/model/enum/TempRequestCategoryEnum";
import {
  BaseRequestDO,
  baseRequestSelfLoginRecord,
  BaseRequestSelfLoginRecordPageDTO
} from "@/api/http/base/BaseRequestController";
import { deviceDetection } from "@pureadmin/utils";

defineOptions({
  name: "SecurityLog"
});

const search = ref<BaseRequestSelfLoginRecordPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseRequestDO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const tableRef = ref();

onMounted(() => {
  onSearch();
});

function onSearch() {
  loading.value = true;
  baseRequestSelfLoginRecord({
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
</script>

<template>
  <div
    :class="[
      'min-w-[180px]',
      deviceDetection() ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">安全日志</h3>

    <div class="flex flex-col">
      <div class="search-form bg-bg_color px-8 pt-[12px] mb-3">
        <el-form ref="searchRef" :inline="true" :model="search">
          <el-form-item label="ip：" prop="ip">
            <el-input
              v-model="search.ip"
              placeholder="请输入ip"
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
          <div />
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
        >
          <el-table-column prop="name" label="详情" />
          <el-table-column prop="ip" label="ip" />
          <el-table-column prop="region" label="地点" />
          <el-table-column #default="scope" prop="category" label="终端">
            {{
              TempRequestCategoryMap.get(scope.row.category) ||
              TempRequestCategoryEnum.PC_BROWSER_WINDOWS.name
            }}
          </el-table-column>
          <el-table-column #default="scope" prop="createTime" label="创建时间">
            {{ FormatDateTimeForCurrentDay(new Date(scope.row.createTime)) }}
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
