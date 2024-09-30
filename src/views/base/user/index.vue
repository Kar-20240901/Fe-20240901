<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { baseRoleDictList, DictVO } from "@/api/http/base/BaseRoleController";
import FormEdit from "@/views/base/user/formEdit.vue";
import {
  baseUserDeleteByIdSet,
  baseUserFreeze,
  baseUserInfoById,
  baseUserInsertOrUpdate,
  BaseUserInsertOrUpdateDTO,
  baseUserPage,
  BaseUserPageDTO,
  BaseUserPageVO,
  baseUserResetAvatar,
  baseUserThaw,
  baseUserUpdatePassword
} from "@/api/http/base/BaseUserController";
import { PasswordRSAEncrypt, RSAEncrypt } from "@/utils/RsaUtil";
import FormUpdatePassword from "@/views/base/user/formUpdatePassword.vue";
import { IFormUpdatePassword } from "@/views/base/user/types";
import {
  ElDefaultOrderDTO,
  ElOrderDTO,
  GetMyOrderDTO
} from "@/model/dto/MyOrderDTO";
import {
  TempRequestCategoryEnum,
  tempRequestCategoryEnumMap
} from "@/views/base/user/enums";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import CommonConstant from "@/model/constant/CommonConstant";

defineOptions({
  name: "BaseUser"
});

const search = ref<BaseUserPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseUserPageVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const defaultOrder: ElDefaultOrderDTO = {
  prop: "lastActiveTime",
  order: "descending"
};
const elOrder = ref<ElOrderDTO>({ ...defaultOrder });

const formRef = ref();
const title = ref<string>("");
const roleDictList = ref<DictVO[]>([]);

const tableRef = ref();

const selectIdArr = ref<string[]>([]);

const formUpdatePasswordRef = ref();

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
  baseUserPage({
    ...search.value,
    current: currentPage.value as any,
    pageSize: pageSize.value as any,
    order: GetMyOrderDTO(elOrder.value)
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
  tableRef.value.sort(defaultOrder.prop, defaultOrder.order);
  onSearch();
}

function editClick(row: BaseUserPageVO) {
  title.value = "修改用户";
  formRef.value.editOpen(baseUserInfoById({ id: row.id }), { id: row.id });
}

function addClick(row: BaseUserPageVO) {
  title.value = "新增用户";
  formRef.value.addOpen(row);
}

function confirmFun() {
  const formValue: BaseUserInsertOrUpdateDTO = {
    ...formRef.value.getForm().value
  };
  if (!formValue.id && formValue.password) {
    formValue.originPassword = RSAEncrypt(formValue.password);
    formValue.password = PasswordRSAEncrypt(formValue.password);
  }
  return baseUserInsertOrUpdate(formValue);
}

function confirmAfterFun(res, done) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function deleteClick(row: BaseUserPageVO) {
  ExecConfirm(
    async () => {
      await baseUserDeleteByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除【${row.nickname}】吗？`
  );
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseUserDeleteByIdSet({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseUserPageVO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

function onSortChange(data: ElOrderDTO) {
  elOrder.value = data;
  onSearch();
}

function updatePasswordClick() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  formUpdatePasswordRef.value.open();
}

function updatePasswordConfirmFun() {
  const formUpdatePasswordValue: IFormUpdatePassword = {
    ...formUpdatePasswordRef.value.getForm().value
  };
  formUpdatePasswordValue.newOriginPassword = RSAEncrypt(
    formUpdatePasswordValue.newPassword
  );
  formUpdatePasswordValue.newPassword = PasswordRSAEncrypt(
    formUpdatePasswordValue.newPassword
  );
  return baseUserUpdatePassword({
    idSet: selectIdArr.value,
    newOriginPassword: formUpdatePasswordValue.newOriginPassword,
    newPassword: formUpdatePasswordValue.newPassword
  });
}

function resetAvatarClick() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseUserResetAvatar({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定重置勾选的【${selectIdArr.value.length}】项头像吗？`
  );
}

function freezeClick() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseUserFreeze({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定冻结勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function thawClick() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseUserThaw({ idSet: selectIdArr.value }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定解冻勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}
</script>

<template>
  <div class="flex flex-col">
    <div class="search-form bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="用户昵称：" prop="nickname">
          <el-input
            v-model="search.nickname"
            placeholder="请输入用户昵称"
            clearable
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input
            v-model="search.username"
            placeholder="请输入用户名"
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
            新增用户
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:lock-password-line')"
            @click="updatePasswordClick"
          >
            批量修改密码
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:image-2-line')"
            @click="resetAvatarClick"
          >
            批量重置头像
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ep:lock')"
            @click="freezeClick"
          >
            批量冻结
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ep:unlock')"
            @click="thawClick"
          >
            批量解冻
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
        :default-sort="defaultOrder"
        show-overflow-tooltip
        stripe
        highlight-current-row
        @selection-change="onSelectChange"
        @sort-change="onSortChange"
      >
        <el-table-column
          :selectable="
            (row: BaseUserPageVO) => {
              return row.id !== CommonConstant.ADMIN_USER_ID_STR;
            }
          "
          type="selection"
        />
        <el-table-column prop="nickname" label="用户昵称" />
        <el-table-column
          #default="scope"
          prop="enableFlag"
          label="冻结"
          width="100"
        >
          {{ scope.row.enableFlag ? "否" : "是" }}
        </el-table-column>
        <el-table-column prop="region" label="ip位置" />
        <el-table-column
          #default="scope"
          prop="createTime"
          sortable
          label="创建时间"
        >
          <span>{{
            FormatDateTimeForCurrentDay(new Date(scope.row.createTime))
          }}</span>
        </el-table-column>
        <el-table-column #default="scope" label="注册终端">
          <span>{{
            tempRequestCategoryEnumMap.get(scope.row.signUpType) ||
            TempRequestCategoryEnum.PC_BROWSER_WINDOWS.name
          }}</span>
        </el-table-column>
        <el-table-column
          #default="scope"
          prop="lastActiveTime"
          label="最近活跃时间"
          sortable
        >
          <span>{{
            FormatDateTimeForCurrentDay(new Date(scope.row.lastActiveTime))
          }}</span>
        </el-table-column>
        <el-table-column #default="scope" label="操作">
          <el-button
            v-if="scope.row.id !== CommonConstant.ADMIN_USER_ID_STR"
            link
            type="primary"
            :icon="useRenderIcon(EditPen)"
            @click="editClick(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="scope.row.id !== CommonConstant.ADMIN_USER_ID_STR"
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

    <form-update-password
      ref="formUpdatePasswordRef"
      :confirm-fun="updatePasswordConfirmFun"
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
