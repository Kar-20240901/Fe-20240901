<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import {
  baseFileCopySelf,
  baseFileCreateFolderSelf,
  BaseFileDO,
  baseFilePageSelf,
  BaseFilePageSelfDTO,
  baseFilePageTreeSelf,
  baseFileRemoveByFileIdSet
} from "@/api/http/base/BaseFileController";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import ReSegmented from "@/components/ReSegmented/src";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import { BaseFileTypeEnum } from "@/model/enum/BaseFileTypeEnum";
import Delete from "@iconify-icons/ep/delete";
import CommonConstant from "@/model/constant/CommonConstant";
import {
  BaseFilePrivateDownload,
  BaseFileUpload,
  GetFileSizeStr
} from "@/utils/FileUtil";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import { UploadFile, UploadFiles } from "element-plus";
import { R } from "@/model/vo/R";
import { IDataList } from "@/views/file/fileSystem/types";
import { debounce } from "@pureadmin/utils";
import CreateFolderFormEdit from "@/views/file/fileSystem/createFolderFormEdit.vue";

defineOptions({
  name: "BaseFileSystem"
});

const search = ref<BaseFilePageSelfDTO>({ pid: CommonConstant.TOP_PID_STR });
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<IDataList[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(-1);

const title = ref<string>("");

const selectIdArr = ref<string[]>([]);

onMounted(() => {
  onSearch();
});

function onSearch(sufFun?: () => void) {
  loading.value = true;
  baseFilePageSelf({
    ...search.value,
    current: currentPage.value as any,
    pageSize: pageSize.value as any
  })
    .then(res => {
      if (search.value.backUpFlag && res.data.records.length) {
        search.value.pid = res.data.records[0].pid;
      }

      let dataListTemp: IDataList[] = [];

      let dataListItemList = [];

      res.data.records.forEach((item, index) => {
        if (index % 10 === 0 && index !== 0) {
          dataListTemp.push({ id: dataListTemp.length, l: dataListItemList });

          dataListItemList = [];
        }

        dataListItemList.push(item);
      });

      if (dataListItemList.length > 0) {
        dataListTemp.push({ id: dataListTemp.length, l: dataListItemList });
      }

      dataList.value = dataListTemp;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;

      if (sufFun) {
        sufFun();
      }
    });

  treeSelfData();
}

function resetSearch() {
  searchRef.value.resetFields();
  onSearch();
}

function copyClick() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  title.value = "复制文件";
}

function fileConfirmFun() {
  if (title.value === "复制文件") {
    baseFileCopySelf({});
  }
}

function confirmAfterFun(res, done) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseFileRemoveByFileIdSet({
        idSet: selectIdArr.value
      }).then(res => {
        selectIdArr.value = [];
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function backUpClick() {
  search.value.backUpFlag = true;
  onSearch(() => {
    search.value.backUpFlag = false;
  });
}

function itemClick(row: BaseFileDO) {
  if ((row.type as any) === BaseFileTypeEnum.FOLDER.code) {
    search.value.pid = row.id;
    onSearch();
  }
}

const fileLoading = ref<boolean>(false);

function downClick() {
  if (!selectIdArr.value.length) {
    ToastError("请勾选数据");
    return;
  }

  selectIdArr.value.forEach(item => {
    BaseFilePrivateDownload({ id: item });
  });
}

const uploadRef = ref();
const uploadFilesRef = ref<UploadFiles>();

const uploadToastDebounce = debounce(() => ToastSuccess("上传成功"));

function onChangeFun(uploadFile: UploadFile, uploadFiles: UploadFiles) {
  fileLoading.value = true;
  uploadFilesRef.value = uploadFiles;
  onChangeFunDebounce();
}

const onChangeFunDebounce = debounce(
  () => {
    const requestList: Promise<R>[] = [];

    uploadFilesRef.value.forEach(item => {
      requestList.push(
        BaseFileUpload(item.raw, "FILE_SYSTEM", formData => {
          formData.append("pid", search.value.pid);
        })
      );
    });

    Promise.all(requestList)
      .then(res => {
        if (res[0]) {
          uploadToastDebounce();
        }
      })
      .finally(() => {
        onSearch();
        fileLoading.value = false;
        uploadRef.value.clearFiles();
      });
  },
  1000,
  false
);

function selectAllClick() {
  if (selectIdArr.value.length === total.value) {
    // 取消全部勾选
    selectIdArr.value = [];
  } else {
    // 勾选全部
    const selectIdArrTemp = [];
    dataList.value.forEach(item => {
      item.l.forEach(subItem => {
        selectIdArrTemp.push(subItem.id);
      });
    });
    selectIdArr.value = selectIdArrTemp;
  }
}

const tree = ref<BaseFileDO[]>([]);

function treeSelfData() {
  baseFilePageTreeSelf({
    ...search.value,
    type: BaseFileTypeEnum.FOLDER.code as any
  }).then(res => {
    tree.value = res.data;
  });
}

const createFolderFormEditRef = ref();

function createFolderClick() {
  createFolderFormEditRef.value.open();
}

function createFolderConfirmAfterFun() {
  return baseFileCreateFolderSelf(
    createFolderFormEditRef.value.getForm().value
  );
}
</script>

<template>
  <div class="flex flex-col">
    <div class="search-form bg-bg_color px-8 pt-[12px] mb-3">
      <el-form ref="searchRef" :inline="true" :model="search">
        <el-form-item label="文件名称：" prop="showFileName">
          <el-input
            v-model="search.showFileName"
            placeholder="请输入文件名称"
            clearable
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item label="全局搜索" prop="globalFlag">
          <re-segmented
            :modelValue="search.globalFlag ? 0 : 1"
            :options="enableFlagOptions"
            @change="
              ({ option: { value } }) => {
                search.globalFlag = value;
              }
            "
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:search-line')"
            :loading="loading"
            @click="onSearch()"
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
          <el-button
            v-if="
              search.pid !== CommonConstant.TOP_PID_STR && !search.globalFlag
            "
            type="primary"
            :icon="useRenderIcon('ri:arrow-go-back-fill')"
            @click="backUpClick"
          >
            返回上一级
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ep:check')"
            @click="selectAllClick"
          >
            全选
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:folder-add-fill')"
            @click="createFolderClick"
          >
            创建文件夹
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ep:copy-document')"
            @click="deleteBySelectIdArr"
          >
            复制
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:drag-move-2-fill')"
            @click="deleteBySelectIdArr"
          >
            移动
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:font-color')"
            @click="deleteBySelectIdArr"
          >
            重命名
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(Delete)"
            @click="deleteBySelectIdArr"
          >
            删除
          </el-button>
        </div>

        <div class="flex">
          <el-upload
            ref="uploadRef"
            :show-file-list="false"
            :disabled="fileLoading"
            :auto-upload="false"
            multiple
            class="mr-[12px]"
            :on-change="onChangeFun"
            drag
          >
            <el-button
              type="primary"
              :icon="useRenderIcon('ep:upload')"
              :loading="fileLoading"
            >
              上传
            </el-button>
          </el-upload>

          <el-button
            type="primary"
            :icon="useRenderIcon('ep:download')"
            @click="downClick"
          >
            下载
          </el-button>
        </div>
      </div>

      <div class="mt-[30px]" />

      <div v-loading="loading">
        <el-checkbox-group v-model="selectIdArr">
          <DynamicScroller
            :items="dataList"
            :item-size="66"
            :min-item-size="66"
            direction="vertical"
          >
            <template #default="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :data-index="index"
                :data-active="active"
              >
                <div class="flex space-x-[20px]">
                  <template v-for="subItem in item.l" :key="subItem.id">
                    <el-checkbox :value="subItem.id">
                      <el-tooltip placement="top">
                        <template #content>
                          <div class="flex flex-col">
                            <div>名称：{{ subItem.showFileName }}</div>
                            <div
                              v-if="subItem.type === BaseFileTypeEnum.FILE.code"
                            >
                              大小：{{ GetFileSizeStr(subItem.fileSize) }}
                            </div>
                            <div>
                              创建时间：{{
                                FormatDateTimeForCurrentDay(
                                  new Date(subItem.createTime)
                                )
                              }}
                            </div>
                          </div>
                        </template>
                        <div
                          class="flex flex-col items-center"
                          @dblclick="itemClick(subItem)"
                        >
                          <IconifyIconOnline
                            :icon="
                              subItem.type === BaseFileTypeEnum.FOLDER.code
                                ? 'ri:folder-open-fill'
                                : 'ri:file-2-line'
                            "
                            width="50"
                          />
                          <el-text
                            class="text-[13px] w-[80px] h-[16px] text-center"
                            truncated
                            >{{ subItem.showFileName }}
                          </el-text>
                        </div>
                      </el-tooltip>
                    </el-checkbox>
                  </template>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </el-checkbox-group>
      </div>

      <div class="pb-3 flex justify-between text-[13px]">
        <div />

        <div>
          {{ total }} 个项目
          {{
            selectIdArr.length ? ` | 已选择 ${selectIdArr.length} 个项目` : ""
          }}
        </div>
      </div>
    </div>

    <createFolderFormEdit
      ref="createFolderFormEditRef"
      title="创建文件夹"
      :confirm-after-fun="confirmAfterFun"
      :confirm-fun="createFolderConfirmAfterFun"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-checkbox) {
  height: 66px;
  margin-right: 0;
}

:deep(.el-upload-dragger) {
  padding: 0;
  border: none;
}
</style>
