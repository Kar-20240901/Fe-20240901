<script setup lang="ts">
import { ref } from "vue";
import {
  BaseImSessionContentRefUserPageVO,
  baseImSessionContentRefUserScroll
} from "@/api/http/base/BaseImSessionContentRefUserController";
import { IImSearchContentInfoProps } from "@/views/im/imIndex/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import RiFile2Line from "~icons/ri/file-2-line";

const searchContentInfoList = ref<BaseImSessionContentRefUserPageVO[]>([]);

const searchContentInfoLoading = ref<boolean>(false);

const props = defineProps<IImSearchContentInfoProps>();

const emit = defineEmits<{
  (e: "searchContentInfoClick", item: BaseImSessionContentRefUserPageVO): void;
}>();

function searchContentInfoClick(item: BaseImSessionContentRefUserPageVO) {
  emit("searchContentInfoClick", item);
}

function doSearch() {
  baseImSessionContentRefUserScroll({
    refId: props.searchBaseContentVO.sessionId,
    searchKey: props.searchKey
  })
    .then(res => {
      searchContentInfoList.value = res.data;
    })
    .finally(() => {
      searchContentInfoLoading.value = false;
    });
}

defineExpose({
  doSearch
});
</script>

<template>
  <div v-loading="searchContentInfoLoading" class="flex flex-col">
    <template v-for="item in searchContentInfoList" :key="item.contentId">
      <div class="flex" @click="searchContentInfoClick(item)">
        <div>
          <el-image
            :src="props.sessionUserMap[searchBaseContentVO.targetId].avatarUrl"
            fit="cover"
            class="w-[45px] h-[45px] mb-[5px]"
          >
            <template #error>
              <component
                :is="
                  useRenderIcon(RiFile2Line, {
                    width: '50px',
                    height: '50px'
                  })
                "
              />
            </template>
          </el-image>
        </div>
        <div class="flex flex-col">
          <div>
            {{ props.sessionUserMap[searchBaseContentVO.targetId].showName }}
          </div>
          <div class="flex h-[90px]">
            <div>{{ item.content }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
