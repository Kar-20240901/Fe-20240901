<script setup lang="ts">
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { nextTick, ref } from "vue";
import { IImContentProps } from "@/views/im/imIndex/types";
import {
  BaseImSessionContentRefUserPageVO,
  baseImSessionContentRefUserScroll,
  ScrollListDTO
} from "@/api/http/base/BaseImSessionContentRefUserController";

const props = defineProps<IImContentProps>();

const sessionContentLoading = ref<boolean>(false);

const sessionContentList = ref<BaseImSessionContentRefUserPageVO[]>([]);

const sessionContentRecycleScrollerRef = ref();

function doSearch(form: ScrollListDTO) {
  sessionContentLoading.value = true;

  baseImSessionContentRefUserScroll({
    refId: props.session.sessionId,
    id: form.id
  })
    .then(res => {
      sessionContentList.value = res.data;

      if (form.id) {
        nextTick(() => {
          sessionContentRecycleScrollerRef.value.scrollToItem(form.id);
        });
      }
    })
    .finally(() => {
      sessionContentLoading.value = false;
    });
}

defineExpose({ doSearch });
</script>

<template>
  <div class="flex flex-col">
    <div>{{ props.session.sessionName }}</div>
    <div class="flex-1">
      <el-scrollbar
        v-loading="sessionContentLoading"
        height="650px"
        view-class="flex flex-col h-full"
      >
        <RecycleScroller
          v-if="sessionContentList.length"
          ref="sessionContentRecycleScrollerRef"
          :items="sessionContentList"
          :min-item-size="90"
          key-field="contentId"
        >
          <template #default="{ item }">
            <div class="flex">
              <div>
                <el-image
                  :src="props.sessionUserMap[item.createId].avatarUrl"
                  fit="cover"
                  class="w-[45px] h-[45px] mb-[5px]"
                >
                  <template #error>
                    <IconifyIconOnline width="50" :icon="'ri:file-2-line'" />
                  </template>
                </el-image>
              </div>
              <div class="flex flex-col">
                <div class="flex justify-around">
                  <div>{{ props.sessionUserMap[item.createId].showName }}</div>
                  <div>
                    {{ FormatDateTimeForCurrentDay(new Date(item.createTs)) }}
                  </div>
                </div>
                <div class="flex h-[90px]">
                  <div>{{ item.content }}</div>
                </div>
              </div>
            </div>
          </template>
        </RecycleScroller>
        <div v-else class="text-[15px] flex w-full justify-center">
          暂无消息。
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
