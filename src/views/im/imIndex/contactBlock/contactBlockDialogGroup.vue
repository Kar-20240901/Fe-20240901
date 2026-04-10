<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref } from "vue";
import Avatar from "@/assets/user.png";
import RiUserForbidFill from "~icons/ri/user-forbid-fill";
import RiUserFollowFill from "~icons/ri/user-follow-fill";
import { FormatStringForCurrentDay } from "@/utils/DateUtil";
import { baseImGroupDictList } from "@/api/http/base/BaseImGroupController";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import {
  baseImGroupRefUserPage,
  BaseImGroupRefUserPageDTO,
  BaseImGroupRefUserPageVO
} from "@/api/http/base/BaseImGroupRefUserController";
import {
  BaseImApplyGroupItemDTO,
  baseImBlockGroupAddUser,
  baseImBlockGroupCancelUser
} from "@/api/http/base/BaseImBlockController";
import { DictVO } from "@/api/http/base/BaseRoleController";
import { debounce } from "@/store/utils";

const search = ref<BaseImGroupRefUserPageDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImGroupRefUserPageVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);

const tableRef = ref();

const searchGroupDictVO = ref<DictVO>({});

function onSearch() {
  if (!search.value.groupId) {
    return;
  }

  loading.value = true;
  baseImGroupRefUserPage({
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

function handleChangeGroupId(groupId?: string) {
  if (!groupId) {
    return;
  }

  const index = groupIdMap.value.get(groupId);

  if (index === undefined) {
    return;
  }

  search.value.groupId = groupId;

  searchGroupDictVO.value = groupDictList.value[index];

  onSearch();
}

defineExpose({
  onSearch,
  initGroupDictList
});

function onSelectChange(rowArr?: BaseImGroupRefUserPageVO[]) {
  selectIdArr.value = rowArr.map(it => it.userId);
}

onMounted(() => {
  onSearch();

  initGroupDictList();
});

function onSearchKeyClear() {
  onSearchKeyChangeDebounce();
}

function onSearchKeyKeydown() {
  onSearchKeyChangeDebounce();
}

function onSearchKeyChange() {
  onSearchKeyChangeDebounce();
}

const onSearchKeyChangeDebounce: () => void = debounce(onSearch, 500);

function resetSelectIdArr() {
  selectIdArr.value = [];
}

function blockBySelectIdArr() {
  if (!search.value.groupId) {
    ToastError("请选择群聊");
    return;
  }

  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockGroupAddUser({
        list: getList([...selectIdArr.value])
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定拉黑勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function getList(idArr?: string[]) {
  const list: BaseImApplyGroupItemDTO[] = [];

  for (let item of idArr) {
    list.push({ groupId: search.value.groupId, userId: item });
  }

  return list;
}

function cancelBlockBySelectIdArr() {
  if (!search.value.groupId) {
    ToastError("请选择群聊");
    return;
  }

  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockGroupCancelUser({
        list: getList([...selectIdArr.value])
      }).then(res => {
        resetSelectIdArr();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定取消拉黑勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function blockClick(item?: BaseImGroupRefUserPageVO) {
  if (!search.value.groupId || !item?.userId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockGroupAddUser({
        list: getList([item.userId])
      }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定拉黑【${item.nickname}】吗？`
  );
}

function cancelBlockClick(item?: BaseImGroupRefUserPageVO) {
  if (!search.value.groupId || !item?.userId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImBlockGroupCancelUser({
        list: getList([item.userId])
      }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定取消拉黑【${item.nickname}】吗？`
  );
}

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

    if (groupDictList.value.length) {
      handleChangeGroupId(groupDictList.value[0].id);
    }
  });
}

function groupIdChange(groupId?: string) {
  handleChangeGroupId(groupId);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between gap-3">
      <div class="flex flex-wrap flex-1 gap-x-2 gap-y-3 mb-3 content-start">
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
          :inline="true"
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
              :fit-input-width="false"
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
              @keydown.enter="onSearchKeyKeydown"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="dataList"
      row-key="friendUserId"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
      show-overflow-tooltip
      stripe
      highlight-current-row
      height="42vh"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" />
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
      <el-table-column prop="bio" label="个人简介" width="200" />
      <el-table-column
        #default="scope"
        prop="createTime"
        label="入群时间"
        width="170"
      >
        {{ FormatStringForCurrentDay(scope.row.createTime) }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="muteFlag"
        label="禁言"
        width="100"
      >
        {{ scope.row.muteFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="manageFlag"
        label="管理员"
        width="100"
      >
        {{ scope.row.belongFlag ? "-" : scope.row.manageFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="belongFlag"
        label="群主"
        width="130"
      >
        {{ scope.row.belongFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column
        #default="scope"
        prop="blockFlag"
        label="是否拉黑"
        width="100"
      >
        {{ scope.row.blockFlag ? "是" : "否" }}
      </el-table-column>
      <el-table-column #default="scope" label="操作" fixed="right" width="120">
        <el-button
          v-if="
            !scope.row.blockFlag &&
            !scope.row.belongFlag &&
            (searchGroupDictVO.b1 ||
              (searchGroupDictVO.b2 &&
                !scope.row.belongFlag &&
                !scope.row.manageFlag))
          "
          link
          type="primary"
          @click="blockClick(scope.row)"
        >
          拉黑
        </el-button>
        <el-button
          v-if="
            scope.row.blockFlag &&
            (searchGroupDictVO.b1 ||
              (searchGroupDictVO.b2 &&
                !scope.row.belongFlag &&
                !scope.row.manageFlag))
          "
          link
          type="primary"
          @click="cancelBlockClick(scope.row)"
        >
          取消拉黑
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
  </div>
</template>

<style scoped lang="scss">
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
