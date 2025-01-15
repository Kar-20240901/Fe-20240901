<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import {
  baseFileCopySelf,
  baseFileCreateFolderSelf,
  BaseFileDO,
  baseFileMoveSelf,
  baseFilePageSelf,
  BaseFilePageSelfDTO,
  baseFilePageTreeSelf,
  baseFileRemoveByFileIdSet,
  baseFileUpdateSelf
} from "@/api/http/base/BaseFileController";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import ReSegmented from "@/components/ReSegmented/src";
import { BaseFileTypeEnum } from "@/model/enum/BaseFileTypeEnum";
import Delete from "@iconify-icons/ep/delete";
import CommonConstant from "@/model/constant/CommonConstant";
import { BaseFilePrivateDownload, GetFileSizeStr } from "@/utils/FileUtil";
import { IDataList } from "@/views/file/fileSystem/types";
import CreateFolderFormEdit from "@/views/file/fileSystem/createFolderFormEdit.vue";
import FileTree from "@/views/file/fileSystem/fileTree.vue";
import RenameFormEdit from "@/views/file/fileSystem/renameFormEdit.vue";
import UploadDialog from "@/views/file/fileSystem/uploadDialog.vue";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { RecycleScroller } from "vue-virtual-scroller";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";

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

const totalSize = ref<number>(0);

const selectIdArr = ref<Set<string>>(new Set<string>());

onMounted(() => {
  onSearch();
});

const pidList = ref<string[]>([CommonConstant.TOP_PID_STR]); // 例如：[0,1,2]
const pathList = ref<string[]>([CommonConstant.TOP_FOLDER_NAME]); // 例如：/根目录/测试1

function onSearch(sufFun?: () => void) {
  loading.value = true;
  baseFilePageSelf({
    ...search.value,
    current: currentPage.value as any,
    pageSize: pageSize.value as any
  })
    .then(res => {
      selectIdArr.value = new Set<string>();
      totalSize.value = 0;

      if (search.value.backUpFlag && res.data.backUpPid) {
        search.value.pid = res.data.backUpPid;
      }

      if (res.data.pidList.length) {
        pidList.value = res.data.pidList;
        pathList.value = res.data.pathList;
      } else {
        pidList.value = [CommonConstant.TOP_FOLDER_NAME];
        pathList.value = [CommonConstant.TOP_PID_STR];
      }

      let dataListTemp: IDataList[] = [];

      let dataListItemList = [];

      let totalSizeTemp = 0;

      res.data.records.forEach((item, index) => {
        if (index % 13 === 0 && index !== 0) {
          dataListTemp.push({ id: dataListTemp.length, l: dataListItemList });

          dataListItemList = [];
        }

        dataListItemList.push(item);

        if ((item.type as any) === BaseFileTypeEnum.FILE.code) {
          totalSizeTemp = totalSizeTemp + Number(item.fileSize);
        } else {
          totalSizeTemp = totalSizeTemp + Number(item.folderSize);
        }
      });

      if (dataListItemList.length > 0) {
        dataListTemp.push({ id: dataListTemp.length, l: dataListItemList });
      }

      dataList.value = dataListTemp;
      total.value = res.data.records.length;
      totalSize.value = totalSizeTemp;
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

const fileTreeRef = ref();

const copyTitle = "复制文件";
const moveTitle = "移动文件";

function copyClick() {
  if (!selectIdArr.value.size) {
    ToastError("请勾选数据");
    return;
  }
  title.value = copyTitle;
  fileTreeRef.value.open();
}

function moveClick() {
  if (!selectIdArr.value.size) {
    ToastError("请勾选数据");
    return;
  }
  title.value = moveTitle;
  fileTreeRef.value.open();
}

function fileTreeConfirmFun() {
  const pid = fileTreeRef.value.getForm().value.pid;

  if (title.value === copyTitle) {
    return baseFileCopySelf({ pid, idSet: [...selectIdArr.value] });
  } else if (title.value === moveTitle) {
    return baseFileMoveSelf({ pid, idSet: [...selectIdArr.value] });
  } else {
    ToastError("类型异常");
    throw new Error("类型异常");
  }
}

function fileTreeConfirmAfterFun(res, done) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function deleteBySelectIdArr() {
  if (!selectIdArr.value.size) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseFileRemoveByFileIdSet({
        idSet: [...selectIdArr.value]
      }).then(res => {
        selectIdArr.value = new Set<string>();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.size}】项数据吗？`
  );
}

function backUpClick() {
  search.value.backUpFlag = true;
  onSearch(() => {
    search.value.backUpFlag = false;
  });
}

function itemDblClick(row: BaseFileDO) {
  if ((row.type as any) === BaseFileTypeEnum.FOLDER.code) {
    search.value.pid = row.id;
    onSearch();
  }
}

function itemClick(row: BaseFileDO) {
  if (row.uploadFlag) {
    ToastError("文件传输中，请稍后再试");
    return;
  }
  if (selectIdArr.value.has(row.id)) {
    selectIdArr.value.delete(row.id);
  } else {
    selectIdArr.value.add(row.id);
  }
}

function downClick() {
  if (!selectIdArr.value.size) {
    ToastError("请勾选数据");
    return;
  }

  selectIdArr.value.forEach(item => {
    BaseFilePrivateDownload({ id: item });
  });
}

function uploadClick() {
  uploadDialogRef.value.open();
}

function selectAllClick() {
  if (selectIdArr.value.size === total.value) {
    // 取消全部勾选
    selectIdArr.value = new Set<string>();
  } else {
    // 勾选全部
    const selectIdArrTemp = new Set<string>();
    dataList.value.forEach(item => {
      item.l.forEach(subItem => {
        if (row.uploadFlag) {
          return;
        }
        selectIdArrTemp.add(subItem.id);
      });
    });
    selectIdArr.value = selectIdArrTemp;
  }
}

const tree = ref<BaseFileDO[]>([]);

function treeSelfData() {
  baseFilePageTreeSelf({
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
  return baseFileCreateFolderSelf({
    ...createFolderFormEditRef.value.getForm().value,
    pid: search.value.pid
  });
}

const renameRef = ref();

function renameClick() {
  if (!selectIdArr.value.size) {
    ToastError("请勾选数据");
    return;
  }
  renameRef.value.open();
}

function renameConfirmFun() {
  return baseFileUpdateSelf({
    ...renameRef.value.getForm().value,
    idSet: selectIdArr.value
  });
}

function breadcrumbClick(index) {
  const pidTemp = pidList.value[index];
  if (!pidTemp) {
    return;
  }
  search.value.pid = pidTemp;
  onSearch();
}

const uploadDialogRef = ref();
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
            @click="copyClick"
          >
            复制
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:drag-move-2-fill')"
            @click="moveClick"
          >
            移动
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:font-color')"
            @click="renameClick"
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
          <el-button
            type="primary"
            :icon="useRenderIcon(Refresh)"
            @click="onSearch()"
          >
            刷新
          </el-button>
        </div>

        <div class="flex">
          <el-button
            type="primary"
            :icon="useRenderIcon('ep:upload')"
            @click="uploadClick"
          >
            上传
          </el-button>

          <el-button
            type="primary"
            :icon="useRenderIcon('ep:download')"
            @click="downClick"
          >
            下载
          </el-button>
        </div>
      </div>

      <div v-loading="loading">
        <div class="py-[17px]">
          <el-breadcrumb separator="/">
            <template v-for="(item, index) in pathList" :key="index">
              <el-breadcrumb-item>
                <a @click="breadcrumbClick(index)">{{ item }}</a>
              </el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>

        <el-scrollbar height="650px" view-class="flex flex-col h-full">
          <RecycleScroller
            v-if="dataList.length"
            :items="dataList"
            :min-item-size="90"
          >
            <template #default="{ item }">
              <div class="flex h-[90px]">
                <template v-for="subItem in item.l" :key="subItem.id">
                  <el-tooltip placement="top" :show-after="800">
                    <template #content>
                      <div class="flex flex-col">
                        <div>名称：{{ subItem.showFileName }}</div>
                        <div v-if="subItem.type === BaseFileTypeEnum.FILE.code">
                          大小：{{ GetFileSizeStr(subItem.fileSize) }}
                        </div>
                        <div
                          v-else-if="
                            subItem.type === BaseFileTypeEnum.FOLDER.code
                          "
                        >
                          大小：{{ GetFileSizeStr(subItem.folderSize) }}
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
                    <el-button
                      text
                      :type="
                        selectIdArr.has(subItem.id) ? 'primary' : undefined
                      "
                      class="!h-[78px]"
                      @dblclick="itemDblClick(subItem)"
                      @click="itemClick(subItem)"
                    >
                      <div class="flex flex-col items-center">
                        <IconifyIconOnline
                          :icon="
                            subItem.type === BaseFileTypeEnum.FOLDER.code
                              ? 'ri:folder-open-fill'
                              : 'ri:file-2-line'
                          "
                          width="50"
                        />
                        <el-text
                          class="text-[13px] w-[80px] h-[18px] text-center"
                          truncated
                          :type="
                            selectIdArr.has(subItem.id) ? 'primary' : undefined
                          "
                          >{{ subItem.uploadFlag ? "(传输中)" : ""
                          }}{{ subItem.showFileName }}
                        </el-text>
                      </div>
                    </el-button>
                  </el-tooltip>
                </template>
              </div>
            </template>
          </RecycleScroller>

          <div v-else class="text-[15px] flex w-full justify-center">
            此文件夹为空。
          </div>
        </el-scrollbar>
      </div>

      <div class="pt-3 flex justify-between text-[13px]">
        <div />

        <div>
          {{ total }} 个项目 | 总大小 {{ GetFileSizeStr(totalSize) }}
          {{ selectIdArr.size ? ` | 已选择 ${selectIdArr.size} 个项目` : "" }}
        </div>
      </div>
    </div>

    <createFolderFormEdit
      ref="createFolderFormEditRef"
      title="创建文件夹"
      :confirm-after-fun="fileTreeConfirmAfterFun"
      :confirm-fun="createFolderConfirmAfterFun"
    />

    <fileTree
      ref="fileTreeRef"
      :title="title"
      :tree="tree"
      :confirm-fun="fileTreeConfirmFun"
      :confirm-after-fun="fileTreeConfirmAfterFun"
    />

    <renameFormEdit
      ref="renameRef"
      title="修改文件名称"
      :confirm-fun="renameConfirmFun"
      :confirm-after-fun="fileTreeConfirmAfterFun"
    />

    <uploadDialog ref="uploadDialogRef" title="上传" :table-search="onSearch" />
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

.custom-button {
  box-sizing: border-box;
  display: inline-block;
  padding: 12px 20px;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  color: #606266;
  text-align: center;
  white-space: nowrap;
  appearance: none;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  transition: 0.1s;
}

.custom-button:hover {
  color: #409eff;
  background-color: #ecf5ff;
  border-color: #c6e2ff;
}
</style>
