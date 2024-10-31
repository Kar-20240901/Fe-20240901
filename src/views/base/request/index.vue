<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import {
  BaseRequestDO,
  baseRequestPage,
  BaseRequestPageDTO
} from "@/api/http/base/BaseRequestController";
import { DictVO } from "@/api/http/base/BaseRoleController";
import { baseUserDictList } from "@/api/http/base/BaseUserController";
import {
  TempRequestCategoryEnum,
  TempRequestCategoryMap
} from "@/model/enum/TempRequestCategoryEnum";

defineOptions({
  name: "BaseRequest"
});

const search = ref<BaseRequestPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseRequestDO[]>([]);
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
  baseRequestPage({
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

function onSelectChange(rowArr?: BaseRequestDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

const userDictList = ref<DictVO[]>([]);

onMounted(() => {
  initUserDictList();
});

function initUserDictList() {
  baseUserDictList().then(res => {
    userDictList.value = res.data.records;
  });
}
</script>

<template>
  <div class="flex flex-col">
    <div class="search-form bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="用户：" prop="createId">
          <el-select
            v-model="search.createId"
            placeholder="请选择"
            class="w-full"
            clearable
            filterable
          >
            <el-option
              v-for="item in userDictList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
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
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="ip" label="ip" width="100" />
        <el-table-column prop="region" label="地点" width="100" />
        <el-table-column #default="scope" prop="type" label="终端" width="100">
          {{
            TempRequestCategoryMap.get(scope.row.type) ||
            TempRequestCategoryEnum.PC_BROWSER_WINDOWS.name
          }}
        </el-table-column>
        <el-table-column
          #default="scope"
          prop="createTime"
          label="创建时间"
          width="100"
        >
          {{ FormatDateTimeForCurrentDay(scope.row.createTime) }}
        </el-table-column>
        <el-table-column #default="scope" label="操作">
          <el-button
            link
            type="primary"
            :icon="useRenderIcon('ep:circle-check')"
            @click="viewClick(scope.row)"
          >
            查看
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
