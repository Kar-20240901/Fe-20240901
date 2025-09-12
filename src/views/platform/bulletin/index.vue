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
  baseBulletinDeleteByIdSet,
  BaseBulletinDO,
  baseBulletinInfoById,
  baseBulletinInsertOrUpdate,
  baseBulletinPage,
  BaseBulletinPageDTO,
  baseBulletinPublish,
  baseBulletinRevoke
} from "@/api/http/base/BaseBulletinController";
import {
  BaseBulletinStatusEnumMap,
  BaseFileStorageTypeEnum
} from "@/model/enum/bulletin/BaseBulletinStatusEnum";

defineOptions({
  name: "PlatformBulletin"
});

const search = ref<BaseBulletinPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseBulletinDO[]>([]);
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
  baseBulletinPage({
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

function editClick(row: BaseBulletinDO) {
  title.value = "修改公告";
  formRef.value.editOpen(baseBulletinInfoById({ id: row.id }));
}

function addClick(row: BaseBulletinDO) {
  title.value = "新增公告";
  formRef.value.addOpen(row);
}

function confirmFun() {
  return baseBulletinInsertOrUpdate(formRef.value.getForm().value);
}

function confirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function deleteClick(row: BaseBulletinDO) {
  ExecConfirm(
    async () => {
      await baseBulletinDeleteByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除【${row.title}】吗？`
  );
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseBulletinDeleteByIdSet({ idSet: selectIdArr.value }).then(
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

function onSelectChange(rowArr?: BaseBulletinDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

function operateClick(row: BaseBulletinDO) {
  const status = row.status as any as number;

  if (BaseFileStorageTypeEnum.DRAFT.code === status) {
    baseBulletinPublish({ id: row.id }).then(res => {
      ToastSuccess(res.msg);
      onSearch();
    });
  } else if (BaseFileStorageTypeEnum.PUBLICITY.code === status) {
    baseBulletinRevoke({ id: row.id }).then(res => {
      ToastSuccess(res.msg);
      onSearch();
    });
  }
}

function getOperateIcon(row: BaseBulletinDO) {
  const status = row.status as any as number;

  if (BaseFileStorageTypeEnum.DRAFT.code === status) {
    return "ri:send-plane-fill";
  } else if (BaseFileStorageTypeEnum.PUBLICITY.code === status) {
    return "fa-solid:undo";
  }
  return "";
}

function getOperateName(row: BaseBulletinDO) {
  const status = row.status as any as number;

  if (BaseFileStorageTypeEnum.DRAFT.code === status) {
    return "发布";
  } else if (BaseFileStorageTypeEnum.PUBLICITY.code === status) {
    return "撤回";
  }
  return "";
}
</script>

<template>
  <div class="flex flex-col">
    <div class="bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="公告标题：" prop="name">
          <el-input
            v-model="search.title"
            placeholder="请输入公告标题"
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
            新增公告
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
        <el-table-column prop="title" label="公告标题" />
        <el-table-column #default="scope" prop="status" label="状态">
          {{ BaseBulletinStatusEnumMap.get(scope.row.status) || "" }}
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" />
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
            :icon="useRenderIcon(getOperateIcon(scope.row))"
            @click="operateClick(scope.row)"
          >
            {{ getOperateName(scope.row) }}
          </el-button>
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
