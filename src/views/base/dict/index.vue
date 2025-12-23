<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  baseDictAddOrderNo,
  baseDictDeleteByIdSet,
  BaseDictDO,
  baseDictInfoById,
  baseDictInsertOrUpdate,
  BaseDictPageDTO,
  baseDictTree,
  baseDictUpdateOrderNo
} from "@/api/http/base/BaseDictController";
import formEdit from "@/views/base/dict/formEdit.vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import MenuAddFill from "~icons/ri/menu-add-fill";
import Delete from "~icons/ep/delete";
import ExpandIcon from "@/assets/table-bar/expand.svg?component";
import {
  ICON_CLASS,
  RendTippyProps,
  ToggleRowExpansionAll
} from "@/utils/TableUtil";
import KarAddOrderNo from "@/components/KarAddOrderNo/index.vue";
import { CalcOrderNo } from "@/utils/TreeUtil";
import { dictTypeOptions } from "@/views/base/dict/enums";
import { R } from "@/model/vo/R";
import RiSearchLine from "~icons/ri/search-line";

defineOptions({
  name: "BaseDict"
});

const search = ref<BaseDictPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseDictDO[]>([]);

const formRef = ref();
const title = ref<string>("");

const tableRef = ref();
const isExpandAll = ref<boolean>(true);

const selectIdArr = ref<string[]>([]);

const addOrderNoFormRef = ref();

onMounted(() => {
  onSearch();
});

function onSearch() {
  loading.value = true;
  baseDictTree(search.value)
    .then(res => {
      dataList.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
}

function resetSearch() {
  searchRef.value.resetFields();
  onSearch();
}

function editClick(row: BaseDictDO) {
  if (dictTypeOptions[0].value === row.type) {
    title.value = "修改字典";
  } else {
    title.value = "修改字典项";
  }
  formRef.value.editOpen(baseDictInfoById({ id: row.id }));
}

function addClick(row: BaseDictDO, record?: BaseDictDO) {
  if (row.dictKey) {
    row.type = dictTypeOptions[1].value;
    title.value = "新增字典项";
  } else {
    row.type = dictTypeOptions[0].value;
    title.value = "新增字典";
  }
  if (record) {
    CalcOrderNo(row, record);
  }
  formRef.value.addOpen(row);
}

function confirmFun() {
  return baseDictInsertOrUpdate(formRef.value.getForm().value);
}

function confirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function deleteClick(row: BaseDictDO) {
  ExecConfirm(
    async () => {
      await baseDictDeleteByIdSet({ idSet: [row.id] }).then(res => {
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
      await baseDictDeleteByIdSet({ idSet: selectIdArr.value }).then(res => {
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

function orderNoChange(row: BaseDictDO) {
  baseDictUpdateOrderNo({ idSet: [row.id], number: String(row.orderNo) }).then(
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

function onSelectChange(rowArr?: BaseDictDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

function addOrderNoConfirmFun() {
  return baseDictAddOrderNo({
    idSet: selectIdArr.value,
    number: addOrderNoFormRef.value.getForm().value.number
  });
}

function addOrderNoConfirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}
</script>

<template>
  <div class="flex flex-col">
    <div class="bg-bg_color px-8 pt-[12px] mb-3">
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
            新增字典
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
        <el-table-column #default="scope" prop="name" label="名称">
          <el-tag
            v-if="scope.row.type === dictTypeOptions[0].value"
            type="success"
          >
            {{ scope.row.name }}
          </el-tag>
          <span v-else>{{ scope.row.name }}</span>
        </el-table-column>
        <el-table-column
          #default="scope"
          prop="name"
          label="字典key/字典项value"
        >
          <span>{{
            scope.row.type === dictTypeOptions[0].value
              ? scope.row.dictKey
              : scope.row.value
          }}</span>
        </el-table-column>
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
        <el-table-column #default="scope" label="操作" width="170">
          <el-button link type="primary" @click="editClick(scope.row)">
            修改
          </el-button>
          <el-button
            v-if="scope.row.type === dictTypeOptions[0].value"
            link
            type="primary"
            @click="addClick({ dictKey: scope.row.dictKey }, scope.row)"
          >
            新增
          </el-button>
          <el-button link type="primary" @click="deleteClick(scope.row)">
            删除
          </el-button>
        </el-table-column>
      </el-table>
    </div>

    <form-edit
      ref="formRef"
      :title="title"
      :confirm-fun="confirmFun"
      :confirm-after-fun="confirmAfterFun"
    />

    <kar-add-order-no
      ref="addOrderNoFormRef"
      :confirm-fun="addOrderNoConfirmFun"
      :confirm-after-fun="addOrderNoConfirmAfterFun"
    />
  </div>
</template>
