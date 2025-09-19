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
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import RiFile2Line from "~icons/ri/file-2-line";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import FaSearch from "~icons/fa/search";
import FaPhone from "~icons/fa/phone";
import FaVideoCamera from "~icons/fa/video-camera";
import FaEllipsisV from "~icons/fa/ellipsis-v";

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
  <div class="flex flex-col bg-gray-50">
    <div
      class="bg-white p-4 border-b border-gray-200 flex items-center justify-between"
    >
      <div class="flex items-center">
        <div class="ml-3">
          <div class="text-sm font-semibold">{{ props.session.showName }}</div>
          <!--          <div class="text-xs text-gray-400">正在输入...</div>-->
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <component
          :is="
            useRenderIcon(FaSearch, {
              class:
                'text-gray-400 hover:text-primary transition-colors w-[16px] h-[16px] cursor-pointer'
            })
          "
        />
        <component
          :is="
            useRenderIcon(FaPhone, {
              class:
                'text-gray-400 hover:text-primary transition-colors w-[16px] h-[16px] cursor-pointer'
            })
          "
        />
        <component
          :is="
            useRenderIcon(FaVideoCamera, {
              class:
                'text-gray-400 hover:text-primary transition-colors w-[16px] h-[16px] cursor-pointer'
            })
          "
        />
        <component
          :is="
            useRenderIcon(FaEllipsisV, {
              class:
                'text-gray-400 hover:text-primary transition-colors w-[16px] h-[16px] cursor-pointer'
            })
          "
        />
      </div>
    </div>

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
        <div
          v-else
          class="text-[15px] flex w-full h-full justify-center items-center"
        >
          暂无消息。
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
