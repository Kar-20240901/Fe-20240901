<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  baseDeptAddOrderNo,
  baseDeptDeleteByIdSet,
  BaseDeptDO,
  baseDeptInfoById,
  baseDeptInsertOrUpdate,
  BaseDeptPageDTO,
  baseDeptTree,
  baseDeptUpdateOrderNo
} from "@/api/http/base/BaseDeptController";
import formEdit from "@/views/base/dept/formEdit.vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import MenuAddFill from "~icons/ri/menu-add-fill";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import ExpandIcon from "@/assets/table-bar/expand.svg?component";
import {
  ICON_CLASS,
  RendTippyProps,
  ToggleRowExpansionAll
} from "@/utils/TableUtil";
import KarAddOrderNo from "@/components/KarAddOrderNo/index.vue";
import { DictVO } from "@/api/http/base/BaseRoleController";
import { CalcOrderNo } from "@/utils/TreeUtil";
import { baseUserDictList } from "@/api/http/base/BaseUserController";

defineOptions({
  name: "BaseDept"
});

const search = ref<BaseDeptPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseDeptDO[]>([]);

const formRef = ref();
const parentOptions = ref<BaseDeptDO[]>([]);
const title = ref<string>("");
const userDictList = ref<DictVO[]>([]);

const tableRef = ref();
const isExpandAll = ref<boolean>(true);

const selectIdArr = ref<string[]>([]);

const addOrderNoFormRef = ref();

onMounted(() => {
  onSearch();
  initUserDictList();
});

function initUserDictList() {
  baseUserDictList().then(res => {
    userDictList.value = res.data.records;
  });
}

function onSearch() {
  loading.value = true;
  baseDeptTree(search.value)
    .then(res => {
      dataList.value = res.data;
      if (Object.keys(search.value).length === 0) {
        parentOptions.value = res.data;
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

function resetSearch() {
  searchRef.value.resetFields();
  onSearch();
}

function editClick(row: BaseDeptDO) {
  title.value = "修改部门";
  formRef.value.editOpen(baseDeptInfoById({ id: row.id }));
}

function addClick(row: BaseDeptDO, record?: BaseDeptDO) {
  title.value = "新增部门";
  if (record) {
    CalcOrderNo(row, record);
  }
  formRef.value.addOpen(row);
}

function confirmFun() {
  return baseDeptInsertOrUpdate(formRef.value.getForm().value);
}

function confirmAfterFun(res, done) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function deleteClick(row: BaseDeptDO) {
  ExecConfirm(
    async () => {
      await baseDeptDeleteByIdSet({ idSet: [row.id] }).then(res => {
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
      await baseDeptDeleteByIdSet({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onExpand() {
  isExpandAll.value = !isExpandAll.value;
  ToggleRowExpansionAll(dataList.value, isExpandAll.value, tableRef.value);
}

function orderNoChange(row: BaseDeptDO) {
  baseDeptUpdateOrderNo({ idSet: [row.id], number: String(row.orderNo) }).then(
    res => {
      ToastSuccess(res.msg);
      onSearch();
    }
  );
}

function addOrderNoBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  addOrderNoFormRef.value.open();
}

function onSelectChange(rowArr?: BaseDeptDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

function addOrderNoConfirmFun() {
  return baseDeptAddOrderNo({
    idSet: selectIdArr.value,
    number: addOrderNoFormRef.value.getForm().value.number
  });
}

function addOrderNoConfirmAfterFun(res, done) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}
</script>

<template>
  <div class="flex flex-col">
    <div class="search-form bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="部门名称：" prop="name">
          <el-input
            v-model="search.name"
            placeholder="请输入部门名称"
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
        <div>
          <ExpandIcon
            v-tippy="RendTippyProps(isExpandAll ? '折叠' : '展开')"
            :class="['w-[16px]', ICON_CLASS]"
            :style="{
              transform: isExpandAll ? 'none' : 'rotate(-90deg)'
            }"
            @click="onExpand"
          />
        </div>

        <div>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="addClick({}, { children: dataList })"
          >
            新增部门
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(MenuAddFill)"
            @click="addOrderNoBySelectIdArr"
          >
            累加排序号
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
        :default-expand-all="isExpandAll"
        show-overflow-tooltip
        stripe
        highlight-current-row
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="name" label="部门名称" />
        <el-table-column #default="scope" prop="orderNo" label="排序">
          <el-input-number
            v-model="scope.row.orderNo"
            class="w-full"
            :step="100"
            controls-position="right"
            @change="orderNoChange(scope.row)"
          />
        </el-table-column>
        <el-table-column prop="uuid" label="唯一标识" />
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
            :icon="useRenderIcon(AddFill)"
            @click="addClick({ pid: scope.row.id }, scope.row)"
          >
            新增
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
    </div>

    <form-edit
      ref="formRef"
      :parent-options="parentOptions"
      :title="title"
      :confirm-fun="confirmFun"
      :confirm-after-fun="confirmAfterFun"
      :user-dict-list="userDictList"
    />

    <kar-add-order-no
      ref="addOrderNoFormRef"
      :confirm-fun="addOrderNoConfirmFun"
      :confirm-after-fun="addOrderNoConfirmAfterFun"
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
