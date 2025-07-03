<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import {
  baseRequestAllAvgPro,
  BaseRequestAllAvgVO,
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
import FormEdit from "@/views/base/request/formEdit.vue";
import { baseRequestInfoInfoById } from "@/api/http/base/BaseRequestInfoController";

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

const avgVo = ref<BaseRequestAllAvgVO>({});

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

  baseRequestAllAvgPro({ ...search.value }).then(res => {
    avgVo.value = res.data;
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

const formRef = ref();
const title = ref<string>("");

function viewClick(row: BaseRequestDO) {
  title.value = "查看请求";
  formRef.value.editOpen(baseRequestInfoInfoById({ id: row.id }));
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
            class="!w-[180px]"
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
        <div>
          耗时 {{ avgVo.avgMs || 0 }} 毫秒 | 总数 {{ avgVo.count || 0 }} 条
        </div>

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
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="uri" label="路径" />
        <el-table-column prop="ip" label="ip" />
        <el-table-column prop="region" label="地点" />
        <el-table-column #default="scope" prop="type" label="终端">
          {{
            TempRequestCategoryMap.get(scope.row.type) ||
            TempRequestCategoryEnum.PC_BROWSER_WINDOWS.name
          }}
        </el-table-column>
        <el-table-column
          #default="scope"
          prop="successFlag"
          label="成功"
          width="100"
        >
          {{ scope.row.successFlag ? "是" : "否" }}
        </el-table-column>
        <el-table-column #default="scope" prop="createTime" label="创建时间">
          {{ FormatDateTimeForCurrentDay(new Date(scope.row.createTime)) }}
        </el-table-column>
        <el-table-column prop="costMs" label="耗时" />
        <el-table-column #default="scope" label="操作" width="100">
          <el-button
            link
            type="primary"
            :icon="useRenderIcon('ep:view')"
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

    <form-edit ref="formRef" :title="title" :user-dict-list="userDictList" />
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
