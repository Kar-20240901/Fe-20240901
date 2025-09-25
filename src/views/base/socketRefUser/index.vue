<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import Delete from "~icons/ep/delete";
import RiComputerLine from "~icons/ri/computer-line";
import {
  baseSocketRefUserChangeConsoleFlagByIdSet,
  BaseSocketRefUserDO,
  baseSocketRefUserOfflineByIdSet,
  baseSocketRefUserPage,
  BaseSocketRefUserPageDTO
} from "@/api/http/base/BaseSocketRefUserController";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import { BaseSocketOnlineTypeMap } from "@/model/enum/socket/BaseSocketOnlineTypeEnum";
import {
  TempRequestCategoryEnum,
  TempRequestCategoryMap
} from "@/model/enum/base/TempRequestCategoryEnum";
import { BaseSocketTypeMap } from "@/model/enum/socket/BaseSocketTypeEnum";

defineOptions({
  name: "BaseSocketRefUser"
});

const search = ref<BaseSocketRefUserPageDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseSocketRefUserDO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const tableRef = ref();

const selectIdArr = ref<string[]>([]);

onMounted(() => {
  onSearch();
});

function onSearch() {
  loading.value = true;
  baseSocketRefUserPage({
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

function offlineClick(row: BaseSocketRefUserDO) {
  ExecConfirm(
    async () => {
      await baseSocketRefUserOfflineByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定下线【${row.id}】吗？`
  );
}

function consoleClick(row: BaseSocketRefUserDO) {
  ExecConfirm(
    async () => {
      await baseSocketRefUserChangeConsoleFlagByIdSet({ idSet: [row.id] }).then(
        res => {
          ToastSuccess(res.msg);
          onSearch();
        }
      );
    },
    undefined,
    `确定开闭控制台【${row.id}】吗？`
  );
}

function consoleBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseSocketRefUserChangeConsoleFlagByIdSet({
        idSet: selectIdArr.value
      }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定开闭控制台勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function offlineBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseSocketRefUserOfflineByIdSet({ idSet: selectIdArr.value }).then(
        res => {
          ToastSuccess(res.msg);
          onSearch();
        }
      );
    },
    undefined,
    `确定下线勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseSocketRefUserDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="id：" prop="id">
          <el-input
            v-model="search.id"
            placeholder="请输入id"
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
            :icon="useRenderIcon(Delete)"
            @click="offlineBySelectIdArr"
          >
            批量下线
          </el-button>

          <el-button
            type="primary"
            :icon="useRenderIcon(RiComputerLine)"
            @click="offlineBySelectIdArr"
          >
            批量控制台
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="socketId" label="socketId" />
        <el-table-column prop="nickname" label="用户" />
        <el-table-column #default="scope" prop="onlineType" label="状态">
          {{ BaseSocketOnlineTypeMap.get(scope.row.onlineType) || "" }}
        </el-table-column>
        <el-table-column prop="ip" label="ip" />
        <el-table-column prop="region" label="地点" />
        <el-table-column #default="scope" prop="type" label="终端">
          {{
            TempRequestCategoryMap.get(scope.row.type) ||
            TempRequestCategoryEnum.PC_BROWSER_WINDOWS.name
          }}
        </el-table-column>
        <el-table-column #default="scope" prop="type" label="类型">
          {{ BaseSocketTypeMap.get(scope.row.type) || "" }}
        </el-table-column>
        <el-table-column #default="scope" prop="createTime" label="创建时间">
          {{ FormatDateTimeForCurrentDay(new Date(scope.row.createTime)) }}
        </el-table-column>
        <el-table-column #default="scope" label="操作">
          <el-button
            link
            type="primary"
            :icon="useRenderIcon(Delete)"
            @click="offlineClick(scope.row)"
          >
            下线
          </el-button>
          <el-button
            link
            type="primary"
            :icon="useRenderIcon(RiComputerLine)"
            @click="consoleClick(scope.row)"
          >
            控制台
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
  </div>
</template>
