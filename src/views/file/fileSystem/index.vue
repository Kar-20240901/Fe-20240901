<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ExecConfirm, ToastError, ToastSuccess } from "@/utils/ToastUtil";
import {
  BaseFileDO,
  baseFilePageSelf,
  BaseFilePageSelfDTO,
  baseFileRemoveByFileIdSet
} from "@/api/http/base/BaseFileController";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import ReSegmented from "@/components/ReSegmented/src";

defineOptions({
  name: "BaseFileSystem"
});

const search = ref<BaseFilePageSelfDTO>({});
const searchRef = ref();

const loading = ref<boolean>(false);
const dataList = ref<BaseFileDO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(15);

const formRef = ref();
const title = ref<string>("");

const selectIdArr = ref<string[]>([]);

onMounted(() => {
  onSearch();
});

function onSearch() {
  loading.value = true;
  baseFilePageSelf({
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

function editClick(row: BaseFileDO) {
  title.value = "修改文件";
}

function addClick(row: BaseFileDO) {
  title.value = "新增文件";
}

function confirmFun() {}

function confirmAfterFun(res, done) {
  done();
  ToastSuccess(res.msg);
  onSearch();
}

function deleteClick(row: BaseFileDO) {
  ExecConfirm(
    async () => {
      await baseFileRemoveByFileIdSet({ idSet: [row.id] }).then(res => {
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除【${row.showFileName}】吗？`
  );
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
        ToastSuccess(res.msg);
        onSearch();
      });
    },
    undefined,
    `确定删除勾选的【${selectIdArr.value.length}】项数据吗？`
  );
}

function onSelectChange(rowArr?: BaseFileDO[]) {
  selectIdArr.value = rowArr.map(it => it.id);
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
  </div>
  <!--    <div class="w-full">-->
  <!--      <div class="dynamic-scroller-demo">-->
  <!--        <DynamicScroller-->
  <!--          :items="filteredItems"-->
  <!--          :min-item-size="54"-->
  <!--          direction="horizontal"-->
  <!--          class="scroller"-->
  <!--        >-->
  <!--          <template #default="{ item, index, active }">-->
  <!--            <DynamicScrollerItem-->
  <!--              :item="item"-->
  <!--              :active="active"-->
  <!--              :size-dependencies="[item.id]"-->
  <!--              :data-index="index"-->
  <!--              :data-active="active"-->
  <!--              :title="`Click to change message ${index}`"-->
  <!--              :style="{-->
  <!--                width: `${Math.max(130, Math.round((item.id?.length / 20) * 20))}px`-->
  <!--              }"-->
  <!--              class="message"-->
  <!--            >-->
  <!--              <div>-->
  <!--                <IconifyIconOnline-->
  <!--                  icon="openmoji:beaming-face-with-smiling-eyes"-->
  <!--                  width="40"-->
  <!--                />-->
  <!--                <p class="text-center">{{ item.id }}</p>-->
  <!--              </div>-->
  <!--            </DynamicScrollerItem>-->
  <!--          </template>-->
  <!--        </DynamicScroller>-->
  <!--      </div>-->
  <!--    </div>-->
</template>

<style scoped></style>
