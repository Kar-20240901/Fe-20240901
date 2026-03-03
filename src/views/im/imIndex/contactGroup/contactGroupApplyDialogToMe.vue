<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import CircleCheck from "~icons/ep/circle-check";
import CircleClose from "~icons/ep/circle-close";
import Hide from "~icons/ep/hide";
import RiUserForbidFill from "~icons/ri/user-forbid-fill";
import RiUserFollowFill from "~icons/ri/user-follow-fill";
import { onMounted, ref, useTemplateRef } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import {
  BaseImApplyStatusEnum,
  BaseImApplyStatusEnumMap
} from "@/model/enum/im/BaseImApplyStatusEnum";
import {
  BaseImApplyGroupItemDTO,
  baseImBlockGroupAddUser,
  baseImBlockGroupCancelUser
} from "@/api/http/base/BaseImBlockController";
import KarOneInputTextarea from "@/components/KarOneInputTextarea/index.vue";
import { FormatStringForCurrentDay } from "@/utils/DateUtil";
import Avatar from "@/assets/user.png";
import type { R } from "@/model/vo/R";
import {
  IDialogFormOneInputDTO,
  IOneInputDialogFormDefineExpose
} from "@/model/types/IDialogFormProps";
import {
  baseImApplyGroupAgree,
  baseImApplyGroupHiddenGroup,
  baseImApplyGroupPageGroup,
  BaseImApplyGroupPageGroupDTO,
  BaseImApplyGroupPageGroupVO,
  baseImApplyGroupReject
} from "@/api/http/base/BaseImApplyGroupController";
import { DictVO } from "@/api/http/base/BaseRoleController";
import { baseImGroupDictList } from "@/api/http/base/BaseImGroupController";
import { debounce } from "@/store/utils";

const search = ref<BaseImApplyGroupPageGroupDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImApplyGroupPageGroupVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);

const selectListArr = ref<BaseImApplyGroupItemDTO[]>([]);

function resetSelectIdArr() {
  selectIdArr.value = [];

  selectListArr.value = [];
}

function onSearch() {
  loading.value = true;
  baseImApplyGroupPageGroup({
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

defineExpose({
  onSearch,
  initGroupDictList,
  handleChangeGroupId
});

function agreeBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyGroupAgree({
        list: [...selectListArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
        searchContactGroup();
      });
    },
    undefined,
    `确定同意勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function rejectBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  rejectIdArr = [...selectListArr.value];

  rejectBatchFlag = true;

  rejectDialogRef.value?.open();
}

function hiddenBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyGroupHiddenGroup({
        list: [...selectListArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定隐藏勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function blockBySelectIdArr() {
  if (!selectListArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockGroupAddUser({
        list: [...selectListArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定拉黑勾选的【${selectListArr.value.length}】项数据吗？`
  );
}

function cancelBlockBySelectIdArr() {
  if (!selectListArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockGroupCancelUser({
        list: [...selectListArr.value]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定取消拉黑勾选的【${selectListArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseImApplyGroupPageGroupVO[]) {
  selectIdArr.value = rowArr.map(it => it.id);

  selectListArr.value = rowArr.map(it => {
    return {
      groupId: it.groupId,
      userId: it.applyUserId
    };
  });
}

function agreeClick(item?: BaseImApplyGroupPageGroupVO) {
  if (!item?.groupId || !item?.applyUserId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyGroupAgree({
        list: [
          {
            groupId: item.groupId,
            userId: item.applyUserId
          }
        ]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
        searchContactGroup();
      });
    },
    undefined,
    `确定同意【${item.nickname}】的群聊申请吗？`
  );
}

let rejectIdArr: BaseImApplyGroupItemDTO[] = [];
let rejectBatchFlag: boolean = false;

function rejectClick(item?: BaseImApplyGroupPageGroupVO) {
  if (!item?.id) {
    return;
  }

  rejectBatchFlag = false;

  rejectIdArr = [
    {
      groupId: item.groupId,
      userId: item.applyUserId
    }
  ];

  rejectDialogRef.value?.open();
}

function blockClick(item?: BaseImApplyGroupPageGroupVO) {
  if (!item?.groupId || !item?.applyUserId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockGroupAddUser({
        list: [
          {
            groupId: item.groupId,
            userId: item.applyUserId
          }
        ]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定拉黑【${item.nickname}】吗？`
  );
}

function cancelBlockClick(item?: BaseImApplyGroupPageGroupVO) {
  if (!item?.groupId || !item?.applyUserId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockGroupCancelUser({
        list: [
          {
            groupId: item.groupId,
            userId: item.applyUserId
          }
        ]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定取消拉黑【${item.nickname}】吗？`
  );
}

function hiddenClick(item?: BaseImApplyGroupPageGroupVO) {
  if (!item?.groupId || !item?.applyUserId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImApplyGroupHiddenGroup({
        list: [
          {
            groupId: item.groupId,
            userId: item.applyUserId
          }
        ]
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定隐藏【${item.nickname}】的好友申请吗？`
  );
}

const rejectDialogRef =
  useTemplateRef<IOneInputDialogFormDefineExpose<IDialogFormOneInputDTO>>(
    "rejectDialogRef"
  );

function rejectConfirmFun() {
  const inputValue = rejectDialogRef.value.getForm().value.inputValue;

  if (rejectBatchFlag) {
    return new Promise<R<any>>((resolve, reject) => {
      ExecConfirm(
        async () => {
          await baseImApplyGroupReject({
            list: rejectIdArr,
            rejectReason: inputValue
          }).then(res => {
            resolve(res);
          });
        },
        async () => {
          reject();
        },
        `确定拒绝勾选的【${rejectIdArr.length}】项数据吗？`
      );
    });
  } else {
    return baseImApplyGroupReject({
      list: rejectIdArr,
      rejectReason: inputValue
    });
  }
}

function rejectConfirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

onMounted(() => {
  onSearch();

  initGroupDictList();
});

const emit = defineEmits<{
  (e: "searchContactGroup"): void;
}>();

function searchContactGroup() {
  emit("searchContactGroup");
}

function handleSearchInputKeydown(e: KeyboardEvent) {
  const isEnter = e.key === "Enter" || e.key === "NumpadEnter";

  if (isEnter) {
    e.preventDefault();
    onSearchKeyChangeDebounce();
  }
}

function onSearchKeyClear() {
  onSearchKeyChangeDebounce();
}

function onSearchKeyChange() {
  onSearchKeyChangeDebounce();
}

const onSearchKeyChangeDebounce: () => void = debounce(onSearch, 500);

const groupDictList = ref<DictVO[]>([]);

// key：groupId，value：数组下标
const groupIdMap = ref<Map<string, number>>(new Map<string, number>());

function initGroupDictList() {
  groupDictList.value = [];
  groupIdMap.value.clear();

  baseImGroupDictList().then(res => {
    (res.data.records || []).forEach((item, index) => {
      item.name = `${item.name}（${item.str1}）`;

      groupIdMap.value.set(item.id, index);
    });

    groupDictList.value = res.data.records || [];
  });
}

function groupIdChange(groupId?: string) {
  handleChangeGroupId(groupId, true);
}

function handleChangeGroupId(groupId?: string, nullSearchFlag?: boolean) {
  if (!groupId) {
    search.value.groupId = "";

    if (nullSearchFlag) {
      onSearch();
    }

    return;
  }

  const index = groupIdMap.value.get(groupId);

  if (index === undefined) {
    return;
  }

  search.value.groupId = groupId;

  onSearch();
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between gap-3">
      <div class="flex flex-wrap flex-1 gap-x-2 gap-y-3 mb-3">
        <el-button
          type="primary"
          :icon="useRenderIcon(CircleCheck)"
          @click="agreeBySelectIdArr"
        >
          批量同意
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(CircleClose)"
          @click="rejectBySelectIdArr"
        >
          批量拒绝
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(Hide)"
          @click="hiddenBySelectIdArr"
        >
          批量隐藏
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(RiUserForbidFill)"
          @click="blockBySelectIdArr"
        >
          批量拉黑
        </el-button>

        <el-button
          type="primary"
          :icon="useRenderIcon(RiUserFollowFill)"
          @click="cancelBlockBySelectIdArr"
        >
          取消拉黑
        </el-button>
      </div>

      <div>
        <el-form
          ref="searchRef"
          class="last-not-margin-right-form"
          :model="search"
        >
          <el-form-item prop="groupId">
            <el-select-v2
              v-model="search.groupId"
              placeholder="请选择群聊"
              class="!w-[220px]"
              clearable
              filterable
              :options="groupDictList"
              :props="{
                label: 'name',
                value: 'id'
              }"
              @change="groupIdChange"
            >
              <template #label="{ index }">
                <div class="w-full h-full flex items-center">
                  <el-image
                    :src="groupDictList[index]?.str2"
                    fit="cover"
                    class="w-6 h-6 rounded-full shrink-0"
                  >
                    <template #error>
                      <el-image
                        :src="Avatar"
                        fit="cover"
                        class="w-6 h-6 rounded-full shrink-0"
                      />
                    </template>
                  </el-image>
                  <div class="text-sm ml-2">
                    {{ groupDictList[index]?.name }}
                  </div>
                </div>
              </template>
              <template #default="{ item }">
                <div class="w-full h-full flex items-center">
                  <el-image
                    :src="item?.str2"
                    fit="cover"
                    class="w-6 h-6 rounded-full shrink-0"
                  >
                    <template #error>
                      <el-image
                        :src="Avatar"
                        fit="cover"
                        class="w-6 h-6 rounded-full shrink-0"
                      />
                    </template>
                  </el-image>
                  <div class="text-sm ml-2">
                    {{ item?.name }}
                  </div>
                </div>
              </template>
            </el-select-v2>
          </el-form-item>
          <el-form-item prop="searchKey">
            <el-input
              v-model="search.searchKey"
              placeholder="请输入用户昵称、用户编码"
              clearable
              class="!w-[220px]"
              @input="onSearchKeyChange"
              @clear="onSearchKeyClear"
              @keydown="handleSearchInputKeydown"
            />
          </el-form-item>
        </el-form>
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
      height="45vh"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" />
      <el-table-column
        v-if="!search.groupId"
        #default="scope"
        label="群聊"
        width="180"
      >
        <div class="flex items-center">
          <el-image
            :src="scope.row?.groupAvatarUrl"
            fit="cover"
            class="w-10 h-10 rounded-full"
            :preview-src-list="
              scope.row?.groupAvatarUrl ? [scope.row?.groupAvatarUrl] : []
            "
            preview-teleported
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
            {{ scope.row?.groupName }}（{{ scope.row?.groupUuid }}）
          </div>
        </div>
      </el-table-column>
      <el-table-column #default="scope" label="用户" width="180">
        <div class="flex items-center">
          <el-image
            :src="scope.row?.avatarUrl"
            fit="cover"
            class="w-10 h-10 rounded-full"
            :preview-src-list="
              scope.row?.avatarUrl ? [scope.row?.avatarUrl] : []
            "
            preview-teleported
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
            {{ scope.row?.nickname }}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="uuid" label="用户编码" width="270" />
      <el-table-column prop="applyContent" label="申请内容" width="220" />
      <el-table-column #default="scope" prop="status" label="状态" width="80">
        {{ BaseImApplyStatusEnumMap.get(scope.row.status) || "" }}
      </el-table-column>
      <el-table-column prop="rejectReason" label="拒绝原因" width="220" />
      <el-table-column
        #default="scope"
        prop="updateTime"
        label="更新时间"
        width="160"
      >
        {{ FormatStringForCurrentDay(scope.row.updateTime) }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="applyTime"
        label="申请时间"
        width="160"
      >
        {{ FormatStringForCurrentDay(scope.row.applyTime) }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="blockFlag"
        label="是否拉黑"
        width="100"
      >
        {{ scope.row.blockFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column #default="scope" label="操作" fixed="right" width="200">
        <el-button
          v-if="scope.row.status === BaseImApplyStatusEnum.APPLYING.code"
          link
          type="primary"
          @click="agreeClick(scope.row)"
        >
          同意
        </el-button>
        <el-button
          v-if="scope.row.status === BaseImApplyStatusEnum.APPLYING.code"
          link
          type="primary"
          @click="rejectClick(scope.row)"
        >
          拒绝
        </el-button>
        <el-button
          v-if="!scope.row.blockFlag"
          link
          type="primary"
          @click="blockClick(scope.row)"
        >
          拉黑
        </el-button>
        <el-button
          v-if="scope.row.blockFlag"
          link
          type="primary"
          @click="cancelBlockClick(scope.row)"
        >
          取消拉黑
        </el-button>
        <el-button link type="primary" @click="hiddenClick(scope.row)">
          隐藏
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
      @change="onSearch()"
    />

    <kar-one-input-textarea
      ref="rejectDialogRef"
      title="拒绝原因"
      label="拒绝原因"
      :nonRequiredFlag="true"
      :confirm-fun="rejectConfirmFun"
      :confirm-after-fun="rejectConfirmAfterFun"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
