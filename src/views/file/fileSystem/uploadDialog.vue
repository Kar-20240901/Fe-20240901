<script setup lang="ts">
import { ref } from "vue";
import {
  baseFileTransferDeleteByIdSet,
  BaseFileTransferDO,
  baseFileTransferPage,
  BaseFileTransferPageDTO
} from "@/api/http/base/BaseFileTransferController";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import { UploadFile, UploadFiles } from "element-plus";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import { BaseFileTransferStatusMap } from "@/model/enum/BaseFileTransferStatusEnum";
import { FileUpload } from "@/utils/FileUtil";
import { baseFileUploadFileSystemPre } from "@/api/http/base/BaseFileController";
import { baseApi } from "@/api/http/utils";
import { BaseFileUploadTypeEnumEnum } from "@/model/enum/BaseFileUploadTypeEnum";
import Refresh from "@iconify-icons/ep/refresh";
import { IUploadDialogFormProps } from "@/views/file/fileSystem/types";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";

const search = ref<BaseFileTransferPageDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseFileTransferDO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const selectIdArr = ref<string[]>([]);
const tableRef = ref();

const visible = ref<boolean>(false);

function open() {
  total.value = 0;
  currentPage.value = 1;
  pageSize.value = 10;
  dataList.value = [];
  visible.value = true;
  onSearch();
}

function onSearch() {
  loading.value = true;
  baseFileTransferPage({
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
  open
});

const props = defineProps<IUploadDialogFormProps>();

const uploadRef = ref();
const uploadFilesRef = ref<UploadFiles>([]);

function onBeforeUpload() {
  return true;
}

function onChangeFun(uploadFile: UploadFile, uploadFiles: UploadFiles) {
  uploadFilesRef.value = uploadFiles;

  baseFileUploadFileSystemPre({
    fileName: uploadFile.name,
    fileSize: uploadFile.size as any,
    uploadType: BaseFileUploadTypeEnumEnum.FILE_SYSTEM.code as any,
    pid: props.pid
  }).then(res => {
    onSearch();

    const formData = new FormData();

    formData.append("file", uploadFile.raw);

    formData.append("transferId", res.data.transferId);

    FileUpload(formData, baseApi("/base/file/upload/fileSystem")).then(() => {
      onSearch();

      if (props.tableSearch) {
        props.tableSearch();
      }
    });
  });
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseFileTransferDeleteByIdSet({
        idSet: selectIdArr.value
      }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseFileTransferDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
}

function deleteClick(row: BaseFileTransferDO) {
  ExecConfirm(
    async () => {
      await baseFileTransferDeleteByIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除【${row.showFileName}】吗？`
  );
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="props.title"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="45%"
    destroy-on-close
  >
    <div class="flex flex-col px-5 py-3 bg-bg_color">
      <div class="pb-3 flex justify-between">
        <div class="flex">
          <el-upload
            ref="uploadRef"
            :show-file-list="false"
            :auto-upload="false"
            multiple
            class="mr-[12px]"
            :on-change="onChangeFun"
            :before-upload="onBeforeUpload"
            :file-list="uploadFilesRef"
            drag
          >
            <el-button type="primary" :icon="useRenderIcon('ep:upload')">
              上传
            </el-button>
          </el-upload>
          <el-button
            type="primary"
            :icon="useRenderIcon(Delete)"
            @click="deleteBySelectIdArr"
          >
            批量删除
          </el-button>
        </div>

        <div>
          <el-button
            type="primary"
            :icon="useRenderIcon(Refresh)"
            :loading="loading"
            @click="onSearch"
          >
            刷新
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
        max-height="600px"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="showFileName" label="文件名" />
        <el-table-column
          #default="scope"
          prop="status"
          label="状态"
          width="100"
        >
          {{ BaseFileTransferStatusMap.get(scope.row.status) || "" }}
        </el-table-column>
        <el-table-column
          #default="scope"
          prop="createTime"
          label="创建时间"
          width="200"
        >
          {{ FormatDateTimeForCurrentDay(new Date(scope.row.createTime)) }}
        </el-table-column>
        <el-table-column #default="scope" label="操作" width="120">
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
        :page-sizes="[10, 50, 100]"
        @change="onSearch"
      />
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(td.el-table__cell > div) {
  display: flex;
  align-items: center;
}

:deep(.el-upload-dragger) {
  padding: 0;
  border: none;
}
</style>
