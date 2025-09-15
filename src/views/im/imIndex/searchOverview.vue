<script setup lang="ts">
import { ref } from "vue";
import {
  baseImSearchBase,
  BaseImSearchBaseContentVO,
  BaseImSearchBaseFriendVO,
  BaseImSearchBaseGroupVO
} from "@/api/http/base/BaseImSearchController";
import { IImSearchOverviewProps } from "@/views/im/imIndex/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import RiFile2Line from "~icons/ri/file-2-line";

const searchFriendList = ref<BaseImSearchBaseFriendVO[]>([]);

const searchGroupList = ref<BaseImSearchBaseGroupVO[]>([]);

const searchContentList = ref<BaseImSearchBaseContentVO[]>([]);

const props = defineProps<IImSearchOverviewProps>();

function doBaseImSearchBase() {
  searchFriendList.value = [];
  searchGroupList.value = [];
  searchContentList.value = [];

  baseImSearchBase({ searchKey: props.searchKey }).then(res => {
    searchFriendList.value = res.data.friendList;
    searchGroupList.value = res.data.groupList;
    searchContentList.value = res.data.contentList;
  });
}

defineExpose({
  doBaseImSearchBase
});

const emit = defineEmits<{
  (e: "searchFriendClick", item: BaseImSearchBaseFriendVO): void;
  (e: "searchGroupClick", item: BaseImSearchBaseGroupVO): void;
  (e: "searchContentClick", item: BaseImSearchBaseContentVO): void;
}>();

function searchContentClick(item: BaseImSearchBaseContentVO) {
  emit("searchContentClick", item);
}

function searchFriendClick(item: BaseImSearchBaseFriendVO) {
  emit("searchFriendClick", item);
}

function searchGroupClick(item: BaseImSearchBaseGroupVO) {
  emit("searchGroupClick", item);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col">
      <div>联系人</div>
      <template v-for="item in searchFriendList" :key="item.sessionId">
        <div class="flex" @click="searchFriendClick(item)">
          <el-image
            :src="item.avatarUrl"
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
          <div>{{ item.friendName }}</div>
        </div>
      </template>
    </div>
    <div class="flex flex-col">
      <div>群聊</div>
      <template v-for="item in searchGroupList" :key="item.sessionId">
        <div class="flex" @click="searchGroupClick(item)">
          <el-image
            :src="item.avatarUrl"
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
          <div>{{ item.groupName }}</div>
        </div>
      </template>
    </div>
    <div class="flex flex-col">
      <div>聊天记录</div>
      <template v-for="item in searchContentList" :key="item.sessionId">
        <div class="flex" @click="searchContentClick(item)">
          <el-image
            :src="item.avatarUrl"
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
          <div class="flex flex-col">
            <div>{{ item.showName }}</div>
            <div class="flex">
              <div>{{ item.searchCount }}</div>
              <div>条相关聊天记录</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
