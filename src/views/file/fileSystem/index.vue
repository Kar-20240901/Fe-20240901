<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { nextTick, onMounted, ref, useTemplateRef } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import {
  baseFileCopySelf,
  baseFileCreateFolderSelf,
  BaseFileDO,
  baseFileGetExpireUrl,
  baseFileMoveSelf,
  BaseFilePageSelfDTO,
  baseFilePageTreeSelf,
  baseFileRemoveByFileIdSet,
  baseFileScrollSelf,
  baseFileUpdateSelf
} from "@/api/http/base/BaseFileController";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import { enableFlagOptions } from "@/model/enum/base/enableFlagEnum";
import ReSegmented from "@/components/ReSegmented/src";
import { BaseFileTypeEnum } from "@/model/enum/file/BaseFileTypeEnum";
import Delete from "~icons/ep/delete";
import CommonConstant from "@/model/constant/CommonConstant";
import {
  BaseFilePrivateDownload,
  CheckGetExpireUrl,
  GetFileSizeStr,
  GetOriginImage,
  GetThumbnailImage,
  ImagePreviewTypeSet
} from "@/utils/FileUtil";
import { IDataList } from "@/views/file/fileSystem/types";
import CreateFolderFormEdit from "@/views/file/fileSystem/createFolderFormEdit.vue";
import FileTree from "@/views/file/fileSystem/fileTree.vue";
import RenameFormEdit from "@/views/file/fileSystem/renameFormEdit.vue";
import UploadDialog from "@/views/file/fileSystem/uploadDialog.vue";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import { getToken } from "@/utils/auth";
import RiFile2Line from "~icons/ri/file-2-line";
import RiFolderOpenFill from "~icons/ri/folder-open-fill";
import EpUpload from "~icons/ep/upload";

import RiArrowGoBackFill from "~icons/ri/arrow-go-back-fill";
import EpCheck from "~icons/ep/check";
import RiFolderAddFill from "~icons/ri/folder-add-fill";
import EpCopyDocument from "~icons/ep/copy-document";
import RiDragMove2Fill from "~icons/ri/drag-move-2-fill";
import RiFontColor from "~icons/ri/font-color";
import EpDownload from "~icons/ep/download";
import { getContentHeight, getMainContentWidth } from "@/utils/MyLayoutUtil";
import { throttle } from "@pureadmin/utils";
import { IDialogFormDefineExpose } from "@/model/types/IDialogFormProps";

defineOptions({
  name: "BaseFileSystem"
});

const search = ref<BaseFilePageSelfDTO>({ pid: CommonConstant.TOP_PID_STR });
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<IDataList[]>([]);
let dataCalcList: BaseFileDO[] = [];
const total = ref<number>(0);
const pageSize = 100;

const title = ref<string>("");

const totalSize = ref<number>(0);

const selectIdSet = ref<Set<string>>(new Set<string>());

const jwt = getToken()!.jwt;

onMounted(() => {
  setRowMax();

  onSearch(undefined, true);
});

const pidList = ref<string[]>([CommonConstant.TOP_PID_STR]); // 例如：[0,1,2]
const pathList = ref<string[]>([CommonConstant.TOP_FOLDER_NAME]); // 例如：/根目录/测试1

const rowMax = ref<number>(0);

function setRowMax() {
  const mainContentEleWidth = getMainContentWidth();

  const itemWidth = 110;

  let rowMaxTemp = Math.floor((mainContentEleWidth - 40) / itemWidth);

  const marginNumber = rowMaxTemp * 12;

  rowMaxTemp = rowMaxTemp - Math.ceil(marginNumber / itemWidth);

  if (rowMaxTemp <= 0) {
    rowMaxTemp = 1;
  }

  rowMax.value = rowMaxTemp;
}

// key：file主键id，value：在 imagePreviewSrcList中的下标
const previewImageMap = new Map<string, number>();

function onSearch(
  sufFun?: () => void,
  loadingFlag?: boolean,
  scrollFlag?: boolean
) {
  if (loadingFlag) {
    loading.value = true;
  }

  let scrollId = undefined;

  if (scrollFlag) {
    scrollId = dataList.value.length
      ? dataList.value[dataList.value.length - 1].l[
          dataList.value[dataList.value.length - 1].l.length - 1
        ].id
      : undefined;
  }

  baseFileScrollSelf({
    id: scrollId,
    ...search.value,
    backwardFlag: false,
    queryTotalFlag: !scrollFlag,
    pageSize: String(pageSize)
  })
    .then(res => {
      selectIdSet.value.clear();

      hasMore = res.data.records.length >= pageSize;

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

      if (scrollFlag) {
        dataCalcList = dataCalcList.concat(res.data.records);
      } else {
        dataCalcList = res.data.records;
      }

      const dataListTemp: IDataList[] = [];

      let dataListItemList = [];

      const previewFileIdArr = [];

      dataCalcList.forEach((item, index) => {
        if (index % rowMax.value === 0 && index !== 0) {
          dataListTemp.push({ id: dataListTemp.length, l: dataListItemList });

          dataListItemList = [];
        }

        dataListItemList.push(item);

        if (ImagePreviewTypeSet.has(item.fileExtName)) {
          previewFileIdArr.push(item.id);
        }
      });

      doGetExpireUrl(previewFileIdArr);

      if (dataListItemList.length > 0) {
        dataListTemp.push({ id: dataListTemp.length, l: dataListItemList });
      }

      dataList.value = dataListTemp;

      if (!scrollFlag) {
        total.value = Number(res.data.fileTotal) || 0;
        totalSize.value = Number(res.data.fileTotalSize) || 0;
      }
    })
    .finally(() => {
      nextTick(() => {
        loading.value = false;
      });

      if (sufFun) {
        sufFun();
      }
    });

  if (!scrollFlag) {
    treeSelfData();
  }
}

const expireUrlMap = ref<Map<string, string>>(new Map());

function doGetExpireUrl(fileIdArr: string[]) {
  previewImageMap.clear();

  imagePreviewSrcList.value = [];

  if (!fileIdArr || !fileIdArr.length) {
    return;
  }

  if (!CheckGetExpireUrl()) {
    return;
  }

  baseFileGetExpireUrl({ idSet: fileIdArr }).then(res => {
    fileIdArr.forEach(item => {
      const url = res.data.map[item];

      if (!url) {
        return;
      }

      expireUrlMap.value.set(item, res.data.map[item]);

      imagePreviewSrcList.value.push(url);

      previewImageMap.set(item, imagePreviewSrcList.value.length - 1);
    });
  });
}

// 获取：缩略图
function getThumbnailImage(fileId?: string) {
  return GetThumbnailImage(fileId, expireUrlMap, jwt);
}

// 获取：原图
function getOriginImage(fileId?: string) {
  return GetOriginImage(fileId, expireUrlMap, jwt);
}

function resetSearch() {
  searchRef.value.resetFields();
  onSearch();
}

const fileTreeRef = ref();

const copyTitle = "复制文件";
const moveTitle = "移动文件";

function copyClick() {
  if (!selectIdSet.value.size) {
    ToastError("请勾选数据");
    return;
  }
  title.value = copyTitle;
  fileTreeRef.value.open();
}

function moveClick() {
  if (!selectIdSet.value.size) {
    ToastError("请勾选数据");
    return;
  }
  title.value = moveTitle;
  fileTreeRef.value.open();
}

function fileTreeConfirmFun() {
  const pid = fileTreeRef.value.getForm().value.pid;

  if (title.value === copyTitle) {
    return baseFileCopySelf({ pid, idSet: [...selectIdSet.value] });
  } else if (title.value === moveTitle) {
    return baseFileMoveSelf({ pid, idSet: [...selectIdSet.value] });
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
  if (!selectIdSet.value.size) {
    ToastError("请勾选数据");
    return;
  }
  ExecConfirm(
    async () => {
      await baseFileRemoveByFileIdSet({
        idSet: [...selectIdSet.value]
      }).then(res => {
        selectIdSet.value.clear();
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdSet.value.size}】项数据吗？`
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
    search.value.globalFlag = false;
    onSearch();
  } else if ((row.type as any) === BaseFileTypeEnum.FILE.code) {
    if (ImagePreviewTypeSet.has(row.fileExtName)) {
      const index = previewImageMap.get(row.id);

      if (index !== undefined) {
        imagePreviewInitialIndex.value = index;
        showImagePreview.value = true;
      }
    }
  }
}

function itemClick(row: BaseFileDO) {
  if (row.uploadFlag) {
    ToastError("文件传输中，请稍后再试");
    return;
  }
  if (selectIdSet.value.has(row.id)) {
    selectIdSet.value.delete(row.id);
  } else {
    selectIdSet.value.add(row.id);
  }
}

function downClick() {
  if (!selectIdSet.value.size) {
    ToastError("请勾选数据");
    return;
  }

  selectIdSet.value.forEach(item => {
    BaseFilePrivateDownload({ id: item });
  });
}

function uploadClick() {
  uploadDialogRef.value.open();
}

function selectAllClick() {
  if (selectIdSet.value.size) {
    // 取消全部勾选
    selectIdSet.value.clear();
  } else {
    // 勾选全部
    const selectIdArrTemp = new Set<string>();
    dataList.value.forEach(item => {
      item.l.forEach(subItem => {
        if (subItem.uploadFlag) {
          return;
        }
        selectIdArrTemp.add(subItem.id);
      });
    });
    selectIdSet.value = selectIdArrTemp;
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
  if (!selectIdSet.value.size) {
    ToastError("请勾选数据");
    return;
  }
  renameRef.value.open();
}

function renameConfirmFun() {
  return baseFileUpdateSelf({
    ...renameRef.value.getForm().value,
    idSet: [...selectIdSet.value]
  });
}

function breadcrumbClick(index: number) {
  const pidTemp = pidList.value[index];
  if (!pidTemp) {
    return;
  }
  search.value.pid = pidTemp;
  onSearch();
}

const uploadDialogRef =
  useTemplateRef<IDialogFormDefineExpose>("uploadDialogRef");

const scrollbarParentDiv = ref();

const scrollbarHeight = ref<number>(0);

const parentHeight = ref<number>(0);

const fileSystemRecycleScrollerRef = ref();

const scrollbarClass = ref<string>("");

onMounted(() => {
  parentHeight.value = getContentHeight();

  nextTick(() => {
    setTimeout(() => {
      scrollbarHeight.value = scrollbarParentDiv.value.offsetHeight;

      setTimeout(() => {
        scrollbarHeight.value = scrollbarParentDiv.value.offsetHeight;

        nextTick(() => {
          if (
            fileSystemRecycleScrollerRef.value.offsetHeight >
            fileSystemRecycleScrollerRef.value.clientHeight
          ) {
            scrollbarClass.value = "scrollbar-hide";
          }
        });
      }, CommonConstant.MEDIUM_DELAY);
    }, CommonConstant.MEDIUM_DELAY);
  });
});

let hasMore: boolean = true;

const doSearchThrottle = throttle(
  (sufFun?: () => void, loadingFlag?: boolean, scrollFlag?: boolean) => {
    onSearch(sufFun, loadingFlag, scrollFlag);
  },
  300
) as (sufFun?: () => void, loadingFlag?: boolean, scrollFlag?: boolean) => void;

function handleScroll(event: Event) {
  const scrollerEl = event.target as HTMLElement;

  if (!scrollerEl) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollerEl;

  const distanceToBottom = scrollHeight - clientHeight - scrollTop;

  if (distanceToBottom <= 80 && !loading.value && hasMore) {
    doSearchThrottle(undefined, false, true);
  }
}

const showImagePreview = ref<boolean>(false);
const imagePreviewSrcList = ref<string[]>([]);
const imagePreviewInitialIndex = ref<number>(0);
</script>

<template>
  <div class="flex flex-col" :style="`height: ${parentHeight}px`">
    <div class="bg-bg_color px-8 pt-[12px] mb-3 shrink-0">
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
            :icon="useRenderIcon('ri/search-line')"
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

    <div class="flex flex-col px-5 py-3 bg-bg_color flex-1">
      <div class="pb-3 flex justify-between shrink-0">
        <div>
          <el-button
            v-if="
              search.pid !== CommonConstant.TOP_PID_STR && !search.globalFlag
            "
            type="primary"
            :icon="useRenderIcon(RiArrowGoBackFill)"
            @click="backUpClick"
          >
            返回上一级
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(EpCheck)"
            @click="selectAllClick"
          >
            全选
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(RiFolderAddFill)"
            @click="createFolderClick"
          >
            创建文件夹
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(EpCopyDocument)"
            @click="copyClick"
          >
            复制
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(RiDragMove2Fill)"
            @click="moveClick"
          >
            移动
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(RiFontColor)"
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
            :icon="useRenderIcon(EpUpload)"
            @click="uploadClick"
          >
            上传
          </el-button>

          <el-button
            type="primary"
            :icon="useRenderIcon(EpDownload)"
            @click="downClick"
          >
            下载
          </el-button>
        </div>
      </div>

      <div v-loading="loading" class="flex flex-col flex-1">
        <div class="py-[17px] shrink-0">
          <el-breadcrumb separator="/">
            <template v-for="(item, index) in pathList" :key="index">
              <el-breadcrumb-item>
                <a @click="breadcrumbClick(index)">{{ item }}</a>
              </el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>

        <div ref="scrollbarParentDiv" class="flex-1 h-full">
          <DynamicScroller
            v-show="dataList.length"
            ref="fileSystemRecycleScrollerRef"
            :items="dataList"
            :min-item-size="90"
            key-field="id"
            :style="`height: ${scrollbarHeight}px`"
            :class="`${scrollbarClass}`"
            @scroll="handleScroll"
          >
            <template #default="{ item, index, active }">
              <DynamicScrollerItem :item="item" :active="active" :index="index">
                <div class="flex h-[90px]">
                  <template v-for="subItem in item.l" :key="subItem.id">
                    <el-tooltip placement="top" :show-after="800">
                      <template #content>
                        <div class="flex flex-col">
                          <div>名称：{{ subItem.showFileName }}</div>
                          <div
                            v-if="subItem.type === BaseFileTypeEnum.FILE.code"
                          >
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
                          selectIdSet.has(subItem.id) ? 'primary' : undefined
                        "
                        class="!h-[78px]"
                        @dblclick="itemDblClick(subItem)"
                        @click="itemClick(subItem)"
                      >
                        <div class="flex flex-col items-center">
                          <el-image
                            v-if="subItem.type === BaseFileTypeEnum.FILE.code"
                            :src="getThumbnailImage(subItem.id)"
                            fit="cover"
                            class="w-[45px] h-[45px] mb-[5px]"
                          >
                            <template #error>
                              <component
                                :is="
                                  useRenderIcon(RiFile2Line, {
                                    width: '45px',
                                    height: '45px'
                                  })
                                "
                              />
                            </template>
                          </el-image>
                          <component
                            :is="
                              useRenderIcon(RiFolderOpenFill, {
                                width: '45px',
                                height: '45px'
                              })
                            "
                            v-else
                          />
                          <el-text
                            class="text-[13px] w-[80px] h-[18px] text-center"
                            truncated
                            :type="
                              selectIdSet.has(subItem.id)
                                ? 'primary'
                                : undefined
                            "
                            >{{ subItem.uploadFlag ? "(传输中)" : ""
                            }}{{ subItem.showFileName }}
                          </el-text>
                        </div>
                      </el-button>
                    </el-tooltip>
                  </template>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>

          <div
            v-if="!dataList.length && !loading"
            class="text-[15px] flex w-full justify-center"
          >
            此文件夹为空。
          </div>
        </div>
      </div>

      <div class="pt-3 flex justify-between text-[13px] shrink-0">
        <div />

        <div>
          {{ total }} 个项目 | 总大小 {{ GetFileSizeStr(totalSize) }}
          {{ selectIdSet.size ? ` | 已选择 ${selectIdSet.size} 个项目` : "" }}
        </div>
      </div>
    </div>

    <CreateFolderFormEdit
      ref="createFolderFormEditRef"
      title="创建文件夹"
      :confirm-after-fun="fileTreeConfirmAfterFun"
      :confirm-fun="createFolderConfirmAfterFun"
    />

    <FileTree
      ref="fileTreeRef"
      :title="title"
      :tree="tree"
      :confirm-fun="fileTreeConfirmFun"
      :confirm-after-fun="fileTreeConfirmAfterFun"
    />

    <RenameFormEdit
      ref="renameRef"
      title="修改文件名称"
      :confirm-fun="() => renameConfirmFun()"
      :confirm-after-fun="fileTreeConfirmAfterFun"
    />

    <UploadDialog
      ref="uploadDialogRef"
      title="上传"
      :table-search="onSearch"
      :pid="search.pid"
    />

    <el-image-viewer
      v-if="showImagePreview"
      :url-list="imagePreviewSrcList"
      :initial-index="imagePreviewInitialIndex"
      show-progress
      @close="showImagePreview = false"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-upload-dragger) {
  padding: 0;
  border: none;
}
</style>
