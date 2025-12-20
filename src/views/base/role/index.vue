<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import Delete from "~icons/ep/delete";
import {
  baseRoleDeleteByIdSet,
  BaseRoleDO,
  baseRoleInfoById,
  baseRoleInsertOrUpdate,
  baseRolePage,
  BaseRolePageDTO,
  DictVO
} from "@/api/http/base/BaseRoleController";
import FormEdit from "@/views/base/role/formEdit.vue";
import { baseAuthDictList } from "@/api/http/base/BaseAuthController";
import {
  baseMenuDictTreeList,
  BaseMenuDO
} from "@/api/http/base/BaseMenuController";
import { baseUserDictList } from "@/api/http/base/BaseUserController";
import { R } from "@/model/vo/R";
import RiSearchLine from "~icons/ri/search-line";

defineOptions({
  name: "BaseRole"
});

const search = ref<BaseRolePageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseRoleDO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const formRef = ref();
const title = ref<string>("");
const userDictList = ref<DictVO[]>([]);
const authDictList = ref<DictVO[]>([]);
const menuDictList = ref<BaseMenuDO[]>([]);

const tableRef = ref();

const selectIdArr = ref<string[]>([]);

onMounted(() => {
  onSearch();
  initAuthDictList();
  initMenuDictList();
  initUserDictList();
});

function initUserDictList() {
  baseUserDictList().then(res => {
    userDictList.value = res.data.records;
  });
}

function initAuthDictList() {
  baseAuthDictList().then(res => {
    authDictList.value = res.data.records;
  });
}

function initMenuDictList() {
  baseMenuDictTreeList().then(res => {
    menuDictList.value = res.data;
  });
}

function onSearch() {
  loading.value = true;
  baseRolePage({
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

function editClick(row: BaseRoleDO) {
  title.value = "修改角色";
  formRef.value.editOpen(baseRoleInfoById({ id: row.id }));
}

function addClick(row: BaseRoleDO) {
  title.value = "新增角色";
  formRef.value.addOpen(row);
}

function confirmFun() {
  return baseRoleInsertOrUpdate(formRef.value.getForm().value);
}

function confirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function deleteClick(row: BaseRoleDO) {
  ExecConfirm(
    async () => {
      await baseRoleDeleteByIdSet({ idSet: [row.id] }).then(res => {
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
      await baseRoleDeleteByIdSet({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseRoleDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="角色名称：" prop="name">
          <el-input
            v-model="search.name"
            placeholder="请输入角色名称"
            clearable
            class="!w-[180px]"
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
            新增角色
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
        <el-table-column #default="scope" prop="name" label="角色名称">
          <span class="flex items-center">
            {{ scope.row.name }}
            <span v-if="scope.row.defaultFlag"> （默认） </span>
          </span>
        </el-table-column>
        <el-table-column prop="uuid" label="唯一标识" />
        <el-table-column #default="scope" prop="enableFlag" label="禁用">
          {{ scope.row.enableFlag ? "否" : "是" }}
        </el-table-column>
        <el-table-column #default="scope" label="操作" width="150">
          <el-button link type="primary" @click="editClick(scope.row)">
            修改
          </el-button>
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
        :page-sizes="[15, 50, 100]"
        @change="onSearch"
      />
    </div>

    <form-edit
      ref="formRef"
      :title="title"
      :confirm-fun="confirmFun"
      :confirm-after-fun="confirmAfterFun"
      :auth-dict-list="authDictList"
      :menu-dict-list="menuDictList"
      :user-dict-list="userDictList"
    />
  </div>
</template>
