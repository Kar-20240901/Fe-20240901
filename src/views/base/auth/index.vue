<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import { baseRoleDictList, DictVO } from "@/api/http/base/BaseRoleController";
import {
  baseAuthDeleteByIdSet,
  BaseAuthDO,
  baseAuthInfoById,
  baseAuthInsertOrUpdate,
  baseAuthPage,
  BaseAuthPageDTO
} from "@/api/http/base/BaseAuthController";
import FormEdit from "@/views/base/auth/formEdit.vue";
import FormBatch from "@/views/base/auth/formBatch.vue";
import { IFormBatch } from "@/views/base/auth/types";
import type { R } from "@/model/vo/R";
import MenuAddFill from "~icons/ri/menu-add-fill";

defineOptions({
  name: "BaseAuth"
});

const search = ref<BaseAuthPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseAuthDO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const formRef = ref();
const title = ref<string>("");
const roleDictList = ref<DictVO[]>([]);

const tableRef = ref();

const selectIdArr = ref<string[]>([]);

const formBatchRef = ref();

onMounted(() => {
  onSearch();
  initRoleDictList();
});

function initRoleDictList() {
  baseRoleDictList().then(res => {
    roleDictList.value = res.data.records;
  });
}

function onSearch() {
  loading.value = true;
  baseAuthPage({
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

function editClick(row: BaseAuthDO) {
  title.value = "修改权限";
  formRef.value.editOpen(baseAuthInfoById({ id: row.id }));
}

function addClick(row: BaseAuthDO) {
  title.value = "新增权限";
  formRef.value.addOpen(row);
}

function confirmFun() {
  return baseAuthInsertOrUpdate(formRef.value.getForm().value);
}

function confirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function batchAddClick() {
  formBatchRef.value.open();
}

function batchConfirmFun() {
  const formBatch: IFormBatch = formBatchRef.value.getForm().value;

  return new Promise<R<any>>(resolve => {
    baseAuthInsertOrUpdate({
      name: formBatch.namePre + ":新增修改",
      auth: formBatch.authPre + ":insertOrUpdate",
      enableFlag: true
    }).then(() => {
      baseAuthInsertOrUpdate({
        name: formBatch.namePre + ":列表查询",
        auth: formBatch.authPre + ":page",
        enableFlag: true
      }).then(() => {
        baseAuthInsertOrUpdate({
          name: formBatch.namePre + ":删除",
          auth: formBatch.authPre + ":deleteByIdSet",
          enableFlag: true
        }).then(() => {
          baseAuthInsertOrUpdate({
            name: formBatch.namePre + ":查看详情",
            auth: formBatch.authPre + ":infoById",
            enableFlag: true
          }).then(() => {
            baseAuthInsertOrUpdate({
              name: formBatch.namePre + ":下拉列表",
              auth: formBatch.authPre + ":dictList",
              enableFlag: true
            }).then(res => {
              resolve(res);
            });
          });
        });
      });
    });
  });
}

function deleteClick(row: BaseAuthDO) {
  ExecConfirm(
    async () => {
      await baseAuthDeleteByIdSet({ idSet: [row.id] }).then(res => {
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
      await baseAuthDeleteByIdSet({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseAuthDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="权限名称：" prop="name">
          <el-input
            v-model="search.name"
            placeholder="请输入权限名称"
            clearable
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri/search-line')"
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
            新增权限
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(MenuAddFill)"
            @click="batchAddClick()"
          >
            批量新增
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
        <el-table-column prop="name" label="权限名称" />
        <el-table-column prop="auth" label="权限值" />
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
      :role-dict-list="roleDictList"
    />

    <form-batch
      ref="formBatchRef"
      :confirm-fun="batchConfirmFun"
      :confirm-after-fun="confirmAfterFun"
    />
  </div>
</template>
