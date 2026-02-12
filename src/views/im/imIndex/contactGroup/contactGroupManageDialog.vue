<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref } from "vue";
import Avatar from "@/assets/user.png";
import RiSearchLine from "~icons/ri/search-line";
import AddFill from "~icons/ri/add-circle-line";
import RiLogoutBoxRLine from "~icons/ri/logout-box-r-line";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { FormatStringForCurrentDay } from "@/utils/DateUtil";
import {
  baseImGroupDeleteByIdSet,
  baseImGroupInfoById,
  baseImGroupInsertOrUpdate,
  BaseImGroupInsertOrUpdateDTO,
  baseImGroupPage,
  BaseImGroupPageDTO,
  BaseImGroupPageVO
} from "@/api/http/base/BaseImGroupController";
import Delete from "~icons/ep/delete";
import { enableFlagOptions } from "@/model/enum/base/enableFlagEnum";
import ReCol from "@/components/ReCol";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { R } from "@/model/vo/R";
import { baseImGroupRefUserLeaveSelf } from "@/api/http/base/BaseImGroupRefUserController";
import { getMinDialogWidth } from "@/utils/MyLayoutUtil";

const search = ref<BaseImGroupPageDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImGroupPageVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);

const tableRef = ref();

function onSearch() {
  loading.value = true;
  baseImGroupPage({
    ...search.value,
    current: currentPage.value as any,
    pageSize: pageSize.value as any,
    manageQueryFlag: true
  })
    .then(res => {
      dataList.value = res.data.records;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

defineExpose({
  onSearch
});

function onSelectChange(rowArr?: BaseImGroupPageVO[]) {
  selectIdArr.value = rowArr.map(it => it.groupId);
}

onMounted(() => {
  onSearch();
});

function handleSearchInputKeydown(e: KeyboardEvent) {
  const isEnter = e.key === "Enter" || e.key === "NumpadEnter";

  if (isEnter) {
    e.preventDefault();
    onSearch();
  }
}

function resetSelectIdArr() {
  selectIdArr.value = [];
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImGroupDeleteByIdSet({
        idSet: [...selectIdArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定解散勾选的【${selectIdArr.value.length}】项群聊吗？`
  );
}

function leaveSelfBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImGroupRefUserLeaveSelf({
        idSet: [...selectIdArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定离开勾选的【${selectIdArr.value.length}】项群聊吗？`
  );
}

function deleteClick(item?: BaseImGroupPageVO) {
  if (!item?.groupId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImGroupDeleteByIdSet({
        idSet: [item.groupId]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定解散群聊【${item.groupShowName}】吗？`
  );
}

function leaveSelfClick(item?: BaseImGroupPageVO) {
  if (!item?.groupId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImGroupRefUserLeaveSelf({
        idSet: [item.groupId]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定离开群聊【${item.groupShowName}】吗？`
  );
}

function editClick(row: BaseImGroupPageVO) {
  title.value = "修改群组";
  editOpen(baseImGroupInfoById({ id: row.groupId }));
}

function addClick() {
  title.value = "新增群组";
  addOpen();
}

function addOpen(formTemp?: BaseImGroupInsertOrUpdateDTO) {
  doOpen(
    formRef,
    form,
    visible,
    confirmLoading,
    {
      ...formTemp
    },
    dialogLoading
  );
}

function editOpen(fun: Promise<R<any>>) {
  dialogLoading.value = true;
  confirmLoading.value = false;
  visible.value = true;
  form.value = {};
  formRef.value?.clearValidate();
  fun.then(res => {
    form.value = res.data;
    dialogLoading.value = false;
  });
}

const form = ref<BaseImGroupInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);
const title = ref<string>("");

function confirmFun() {
  return baseImGroupInsertOrUpdate(form.value);
}

function confirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function confirmClick() {
  doConfirmClick(
    formRef,
    { confirmFun, confirmAfterFun },
    visible,
    confirmLoading
  );
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between gap-3">
      <div class="flex flex-wrap flex-1 gap-x-2 gap-y-3 mb-3">
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="addClick"
        >
          新增群组
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(RiLogoutBoxRLine)"
          @click="leaveSelfBySelectIdArr"
        >
          批量离开
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(Delete)"
          @click="deleteBySelectIdArr"
        >
          批量解散
        </el-button>
      </div>

      <div>
        <el-form
          ref="searchRef"
          class="last-not-margin-right-form"
          :inline="true"
          :model="search"
        >
          <el-form-item prop="searchKey">
            <el-input
              v-model="search.searchKey"
              placeholder="请输入群组名称、群组编码"
              clearable
              class="!w-[220px]"
              @keydown="handleSearchInputKeydown"
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
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="dataList"
      row-key="groupId"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
      show-overflow-tooltip
      stripe
      highlight-current-row
      height="45vh"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" />
      <el-table-column #default="scope" label="群组" width="180">
        <div class="flex items-center">
          <el-image
            :src="scope.row?.avatarUrl"
            fit="cover"
            class="w-10 h-10 rounded-full"
          >
            <template #error>
              <el-image
                :src="Avatar"
                fit="cover"
                class="w-10 h-10 rounded-full"
              />
            </template>
          </el-image>
          <div class="text-sm ml-2">
            {{ scope.row?.groupShowName }}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="groupShowId" label="群组编码" width="270" />
      <el-table-column prop="bio" label="群组简介" width="220" />
      <el-table-column
        #default="scope"
        prop="groupCreateTime"
        label="创建时间"
        width="160"
      >
        {{ FormatStringForCurrentDay(scope.row.groupCreateTime) }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="muteFlag"
        label="被禁言"
        width="150"
      >
        {{ scope.row.muteFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="notDisturbFlag"
        label="免打扰"
        width="150"
      >
        {{ scope.row.notDisturbFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="normalMuteFlag"
        label="普通成员禁言"
        width="150"
      >
        {{ scope.row.normalMuteFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="manageMuteFlag"
        label="管理员禁言"
        width="100"
      >
        {{ scope.row.manageMuteFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column #default="scope" label="操作" fixed="right" width="200">
        <el-button
          v-if="scope.row.belongFlag || scope.row.manageFlag"
          link
          type="primary"
          @click="editClick(scope.row)"
        >
          编辑
        </el-button>
        <el-button
          v-if="scope.row.belongFlag"
          link
          type="primary"
          @click="deleteClick(scope.row)"
        >
          解散
        </el-button>
        <el-button
          v-else
          link
          type="primary"
          @click="leaveSelfClick(scope.row)"
        >
          退出
        </el-button>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      class="mt-3"
      layout="->, prev, pager, next, jumper, sizes, total"
      :total="total"
      :page-sizes="[10, 50, 100]"
      @change="onSearch"
    />

    <el-dialog
      v-model="visible"
      :title="title"
      draggable
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="getMinDialogWidth()"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        v-loading="dialogLoading"
        :model="form"
        label-width="auto"
      >
        <el-row :gutter="30">
          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item
              label="群组名称"
              prop="name"
              :rules="[
                {
                  required: true,
                  message: '群组名称为必填项',
                  trigger: 'blur'
                }
              ]"
            >
              <el-input
                v-model="form.name"
                clearable
                placeholder="请输入群组名称"
              />
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="群组简介" prop="bio">
              <el-input
                v-model="form.bio"
                type="textarea"
                clearable
                :autosize="{ minRows: 2, maxRows: 2 }"
                placeholder="请输入群组简介"
              />
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="普通成员禁言" prop="normalMuteFlag">
              <re-segmented
                :modelValue="form.normalMuteFlag ? 0 : 1"
                :options="enableFlagOptions"
                @change="
                  ({ option: { value } }) => {
                    form.normalMuteFlag = value;
                  }
                "
              />
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="管理员禁言" prop="manageMuteFlag">
              <re-segmented
                :modelValue="form.manageMuteFlag ? 0 : 1"
                :options="enableFlagOptions"
                @change="
                  ({ option: { value } }) => {
                    form.manageMuteFlag = value;
                  }
                "
              />
            </el-form-item>
          </re-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="original-el-button">
          <el-button @click="visible = false">取消</el-button>
          <el-button
            :loading="confirmLoading"
            type="primary"
            @click="confirmClick"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.original-el-button .el-button + .el-button {
  margin-left: 12px;
}

:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
