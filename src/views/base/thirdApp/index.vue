<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import FormEdit from "./formEdit.vue";
import {
  baseThirdAppDeleteByIdSet,
  BaseThirdAppDO,
  baseThirdAppInfoById,
  baseThirdAppInsertOrUpdate,
  baseThirdAppPage,
  BaseThirdAppPageDTO
} from "@/api/http/base/BaseThirdAppController";
import { BaseThirdAppTypeMap } from "@/model/enum/BaseThirdAppTypeEnum";

defineOptions({
  name: "BaseThirdApp"
});

const search = ref<BaseThirdAppPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseThirdAppDO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const formRef = ref();
const title = ref<string>("");

const tableRef = ref();

const selectIdArr = ref<string[]>([]);

onMounted(() => {
  onSearch();
});

function onSearch() {
  loading.value = true;
  baseThirdAppPage({
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

function editClick(row: BaseThirdAppDO) {
  title.value = "修改三方应用";
  formRef.value.editOpen(baseThirdAppInfoById({ id: row.id }));
}

function addClick(row: BaseThirdAppDO) {
  title.value = "新增三方应用";
  formRef.value.addOpen(row);
}

function confirmFun() {
  return baseThirdAppInsertOrUpdate(formRef.value.getForm().value);
}

function confirmAfterFun(res, done) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function deleteClick(row: BaseThirdAppDO) {
  ExecConfirm(
    async () => {
      await baseThirdAppDeleteByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除【${row.name}】吗？`
  );
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseThirdAppDeleteByIdSet({
        idSet: selectIdArr.value
      }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseThirdAppDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="search-form bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="名称：" prop="name">
          <el-input
            v-model="search.name"
            placeholder="请输入名称"
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
            :icon="useRenderIcon(AddFill)"
            @click="addClick({})"
          >
            新增三方应用
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
        <el-table-column prop="name" label="名称" />
        <el-table-column #default="scope" prop="type" label="类型">
          {{ BaseThirdAppTypeMap.get(scope.row.type) || "" }}
        </el-table-column>
        <el-table-column #default="scope" prop="defaultFlag" label="默认">
          {{ scope.row.defaultFlag ? "是" : "否" }}
        </el-table-column>
        <el-table-column #default="scope" prop="enableFlag" label="禁用">
          {{ scope.row.enableFlag ? "否" : "是" }}
        </el-table-column>
        <el-table-column #default="scope" label="操作">
          <el-button
            link
            type="primary"
            :icon="useRenderIcon(EditPen)"
            @click="editClick(scope.row)"
          >
            修改
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

    <form-edit
      ref="formRef"
      :title="title"
      :confirm-fun="confirmFun"
      :confirm-after-fun="confirmAfterFun"
    />
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
