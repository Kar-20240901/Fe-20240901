<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { Message, User } from "@element-plus/icons-vue";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { RecycleScroller } from "vue-virtual-scroller";
import {
  BaseImSessionRefUserPageVO,
  baseImSessionRefUserScroll,
  baseImSessionRefUserUpdateAvatarAndNickname
} from "@/api/http/base/BaseImSessionRefUserController";
import {
  ISession,
  IShowInfoMap,
  TSearchPageType
} from "@/views/im/imIndex/types";
import {
  baseImSearchBase,
  BaseImSearchBaseContentVO,
  BaseImSearchBaseDTO,
  BaseImSearchBaseGroupVO,
  baseImSearchHistoryDelete,
  baseImSearchHistoryDeleteAll,
  baseImSearchHistoryPage,
  BaseImSearchHistoryVO
} from "@/api/http/base/BaseImSearchController";
import { debounce } from "@pureadmin/utils";
import { ToastSuccess } from "@/utils/ToastUtil";
import {
  baseImFriendPage,
  BaseImFriendPageVO
} from "@/api/http/base/BaseImFriendController";
import {
  BaseImSessionContentRefUserPageVO,
  baseImSessionContentRefUserScroll
} from "@/api/http/base/BaseImSessionContentRefUserController";
import { useUserStoreHook } from "@/store/modules/user";
import { storeToRefs } from "pinia";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import { baseImGroupRefUserPage } from "@/api/http/base/BaseImGroupRefUserController";
import { BaseImLeftSegmentedEnum } from "@/model/enum/im/BaseImLeftSegmentedEnum";
import { BaseImContactTabEnum } from "@/model/enum/im/BaseImContactTabEnum";
import {
  baseImGroupPage,
  BaseImGroupPageVO
} from "@/api/http/base/BaseImGroupController";

defineOptions({
  name: "ImIndex"
});

const SegmentedOptionArr = [
  {
    label: BaseImLeftSegmentedEnum.SESSION.name,
    value: BaseImLeftSegmentedEnum.SESSION.code,
    icon: Message
  },
  {
    label: BaseImLeftSegmentedEnum.CONTACT.name,
    value: BaseImLeftSegmentedEnum.CONTACT.code,
    icon: User
  }
];

const segmentedValue = ref<string>(SegmentedOptionArr[0].value);

const search = ref<BaseImSearchBaseDTO>({});

const loading = ref<boolean>(false);
const dataList = ref<BaseImSessionRefUserPageVO[]>([]);

const showSearch = ref<boolean>(false);

const searchPageType = ref<TSearchPageType>(101);

const searchHistoryList = ref<BaseImSearchHistoryVO[]>([]);

const searchFriendList = ref<BaseImFriendPageVO[]>([]);

const searchGroupList = ref<BaseImSearchBaseGroupVO[]>([]);

const searchContentList = ref<BaseImSearchBaseContentVO[]>([]);

const searchContentInfoList = ref<BaseImSessionContentRefUserPageVO[]>([]);

const searchContentInfoLoading = ref<boolean>(false);

const pageSize = "20";

const searchHistoryCloseFlag = ref<boolean>(false);

const searchContentInfo = ref<BaseImSearchBaseContentVO>({});

const session = ref<ISession>({});

const sessionContentList = ref<BaseImSessionContentRefUserPageVO[]>([]);

const sessionContentLoading = ref<boolean>(false);

const { id: userId, nickname, avatar } = storeToRefs(useUserStoreHook());

// key：user主键 id
const sessionUserMap = ref<Record<string, IShowInfoMap>>({});

const sessionContentRecycleScrollerRef = ref();

const contactTabValue = ref<string>(BaseImContactTabEnum.FRIEND.code);

const contactTabLoading = ref<boolean>(false);

const friendList = ref<BaseImFriendPageVO[]>([]);

const groupList = ref<BaseImGroupPageVO[]>([]);

function contactTabChange(code: string) {
  if (code === BaseImContactTabEnum.FRIEND.code) {
    doBaseImFriendPage();
  } else if (code === BaseImContactTabEnum.GROUP.code) {
    doBaseImGroupPage();
  }
}

function doBaseImFriendPage() {
  contactTabLoading.value = true;

  baseImFriendPage({ pageSize: "-1" })
    .then(res => {
      friendList.value = res.data.records;
    })
    .finally(() => {
      contactTabLoading.value = false;
    });
}

function doBaseImGroupPage() {
  contactTabLoading.value = true;

  baseImGroupPage({ pageSize: "-1" })
    .then(res => {
      groupList.value = res.data.records;
    })
    .finally(() => {
      contactTabLoading.value = false;
    });
}

onMounted(() => {
  onSearch();
});

function searchHistory() {
  searchHistoryList.value = [];
  baseImSearchHistoryPage({
    pageSize
  }).then(res => {
    searchHistoryList.value = res.data.records;
  });
}

function onSearch() {
  loading.value = true;

  baseImSessionRefUserScroll({
    id: dataList.value.length
      ? dataList.value[dataList.value.length - 1].sessionId
      : undefined,
    pageSize
  })
    .then(res => {
      dataList.value = res.data;

      if (!res.data.length) {
        return;
      }

      const sessionIdArr = [];

      res.data.forEach(item => {
        sessionIdArr.push(item.sessionId);

        const sessionUserMapItem: IShowInfoMap = {};
        sessionUserMapItem.targetId = item.targetId;
        sessionUserMapItem.avatarUrl = item.avatarUrl;
        sessionUserMapItem.showName = item.sessionName;

        if (item.targetType === BaseImTypeEnum.FRIEND.code) {
          sessionUserMap.value[sessionUserMapItem.targetId] =
            sessionUserMapItem;
        } else if (item.targetType === BaseImTypeEnum.GROUP.code) {
        }
      });

      doUpdateAvatarAndNickname(sessionIdArr);
    })
    .finally(() => {
      loading.value = false;
    });
}

function doBaseImSearchBase() {
  searchFriendList.value = [];
  searchGroupList.value = [];
  searchContentList.value = [];

  baseImSearchBase({ searchKey: search.value.searchKey }).then(res => {
    searchFriendList.value = res.data.friendList;
    searchGroupList.value = res.data.groupList;
    searchContentList.value = res.data.contentList;
  });
}

const immediateDebounce: any = debounce(doBaseImSearchBase, 1000, true);

function onSearchKeyChange(val: string) {
  search.value.searchKey = val;
  immediateDebounce();
}

function searchClick() {
  searchHistory(); // 查询：搜索历史

  searchPageType.value = 101;
  showSearch.value = true;
}

function searchHistoryDeleteAllClick() {
  baseImSearchHistoryDeleteAll().then(res => {
    searchHistory();
    ToastSuccess(res.msg);
  });
}

function searchHistoryDeleteClick(id?: string) {
  baseImSearchHistoryDelete({ id }).then(res => {
    searchHistory();
    ToastSuccess(res.msg);
  });
}

function doBaseImGroupRefUserPage(groupId: string) {
  baseImGroupRefUserPage({ groupId, pageSize: "-1" }).then(res => {
    res.data.records.forEach(item => {
      const sessionUserMapItem: IShowInfoMap = {};
      sessionUserMapItem.targetId = item.userId;
      sessionUserMapItem.avatarUrl = item.avatarUrl;
      sessionUserMapItem.showName = item.nickname;

      sessionUserMap.value[sessionUserMapItem.targetId] = sessionUserMapItem;
    });
  });
}

function searchContentClick(item: BaseImSearchBaseContentVO) {
  searchContentInfoLoading.value = true;

  searchContentInfoList.value = [];
  searchContentInfo.value = item;
  searchPageType.value = 301;

  if (item.targetType === BaseImTypeEnum.FRIEND.code) {
    const sessionUserMapItem: IShowInfoMap = {};
    sessionUserMapItem.targetId = item.targetId;
    sessionUserMapItem.avatarUrl = item.avatarUrl;
    sessionUserMapItem.showName = item.showName;

    sessionUserMap.value[sessionUserMapItem.targetId] = sessionUserMapItem;
  } else if (item.targetType === BaseImTypeEnum.GROUP.code) {
    doBaseImGroupRefUserPage(item.targetId);
  }

  baseImSessionContentRefUserScroll({
    refId: searchContentInfo.value.sessionId,
    searchKey: search.value.searchKey
  })
    .then(res => {
      searchContentInfoList.value = res.data;
    })
    .finally(() => {
      searchContentInfoLoading.value = false;
    });
}

function searchContentInfoClick(item: BaseImSessionContentRefUserPageVO) {
  sessionContentLoading.value = true;

  baseImSessionContentRefUserScroll({
    refId: searchContentInfo.value.sessionId,
    id: item.contentId
  })
    .then(res => {
      sessionContentList.value = res.data;
      nextTick(() => {
        sessionContentRecycleScrollerRef.value.scrollToItem(item.contentId);
      });
    })
    .finally(() => {
      sessionContentLoading.value = false;
    });
}

watch(
  searchContentInfo,
  newVal => {
    doUpdateAvatarAndNickname([newVal.sessionId]);
  },
  { deep: true }
);

function doUpdateAvatarAndNickname(idSet?: string[]) {
  if (!idSet || !idSet.length) {
    return;
  }

  baseImSessionRefUserUpdateAvatarAndNickname({ idSet }).then(res => {
    res.data.forEach(item => {
      const sessionUserMapItem: IShowInfoMap = {};
      sessionUserMapItem.targetId = item.targetId;
      sessionUserMapItem.avatarUrl = item.avatarUrl;
      sessionUserMapItem.showName = item.showName;

      if (item.targetType === BaseImTypeEnum.FRIEND.code) {
        sessionUserMap.value[sessionUserMapItem.targetId] = sessionUserMapItem;
      } else if (item.targetType === BaseImTypeEnum.GROUP.code) {
      }
    });
  });
}

function sessionClick(item: BaseImSessionRefUserPageVO) {
  doUpdateAvatarAndNickname([item.sessionId]);

  if (item.targetType === BaseImTypeEnum.FRIEND.code) {
    const sessionUserMapItem: IShowInfoMap = {};
    sessionUserMapItem.targetId = item.targetId;
    sessionUserMapItem.avatarUrl = item.avatarUrl;
    sessionUserMapItem.showName = item.sessionName;

    sessionUserMap.value[sessionUserMapItem.targetId] = sessionUserMapItem;
  } else if (item.targetType === BaseImTypeEnum.GROUP.code) {
    doBaseImGroupRefUserPage(item.targetId);
  }

  sessionContentLoading.value = true;

  baseImSessionContentRefUserScroll({
    refId: searchContentInfo.value.sessionId
  })
    .then(res => {
      sessionContentList.value = res.data;
    })
    .finally(() => {
      sessionContentLoading.value = false;
    });
}

function friendClick(item: BaseImFriendPageVO) {
  sessionClick({
    sessionId: item.sessionId,
    targetType: BaseImTypeEnum.FRIEND.code,
    targetId: item.friendId,
    sessionName: item.friendName
  });
}

function groupClick(item: BaseImGroupPageVO) {
  sessionClick({
    sessionId: item.sessionId,
    targetType: BaseImTypeEnum.GROUP.code,
    targetId: item.groupId,
    sessionName: item.groupName
  });
}
</script>

<template>
  <el-splitter>
    <el-splitter-panel :min="200">
      <div v-if="!showSearch" class="flex flex-col">
        <div class="bg-bg_color rounded flex align-center" @click="searchClick">
          <Search />
          <div>搜索</div>
        </div>
        <div
          v-if="segmentedValue === BaseImLeftSegmentedEnum.SESSION.code"
          class="flex-1"
        >
          <el-scrollbar
            v-loading="loading"
            height="650px"
            view-class="flex flex-col h-full"
          >
            <RecycleScroller
              v-if="dataList.length"
              :items="dataList"
              :min-item-size="90"
              key-field="sessionId"
            >
              <template #default="{ item }">
                <div class="flex" @click="sessionClick(item)">
                  <div>
                    <el-badge :value="item.unReadCount" :max="99">
                      <el-image
                        :src="item.avatarUrl"
                        fit="cover"
                        class="w-[45px] h-[45px] mb-[5px]"
                      >
                        <template #error>
                          <IconifyIconOnline
                            width="50"
                            :icon="'ri:file-2-line'"
                          />
                        </template>
                      </el-image>
                    </el-badge>
                  </div>
                  <div class="flex flex-col">
                    <div class="flex justify-around">
                      <div>{{ item.sessionName }}</div>
                      <div>
                        {{
                          FormatDateTimeForCurrentDay(
                            new Date(item.lastContentCreateTime)
                          )
                        }}
                      </div>
                    </div>
                    <div class="flex h-[90px]">
                      <div>{{ item.lastContent }}</div>
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
        <div v-if="segmentedValue === BaseImLeftSegmentedEnum.CONTACT.code">
          <el-tabs v-model="contactTabValue" @tab-change="contactTabChange">
            <el-tab-pane
              v-loading="contactTabLoading"
              :label="BaseImContactTabEnum.FRIEND.name"
              :name="BaseImContactTabEnum.GROUP.code"
            >
              <el-scrollbar height="650px" view-class="flex flex-col h-full">
                <RecycleScroller
                  v-if="friendList.length"
                  :items="friendList"
                  :min-item-size="90"
                  key-field="friendId"
                >
                  <template #default="{ item }">
                    <div class="flex" @click="friendClick(item)">
                      <div>
                        <el-image
                          :src="item.avatarUrl"
                          fit="cover"
                          class="w-[45px] h-[45px] mb-[5px]"
                        >
                          <template #error>
                            <IconifyIconOnline
                              width="50"
                              :icon="'ri:file-2-line'"
                            />
                          </template>
                        </el-image>
                      </div>
                      <div>{{ item.friendName }}</div>
                    </div>
                  </template>
                </RecycleScroller>
                <div v-else class="text-[15px] flex w-full justify-center">
                  暂无好友。
                </div>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane
              v-loading="contactTabLoading"
              :label="BaseImContactTabEnum.GROUP.name"
              :name="BaseImContactTabEnum.GROUP.code"
            >
              <el-scrollbar height="650px" view-class="flex flex-col h-full">
                <RecycleScroller
                  v-if="groupList.length"
                  :items="groupList"
                  :min-item-size="90"
                  key-field="groupId"
                >
                  <template #default="{ item }">
                    <div class="flex" @click="groupClick(item)">
                      <div>
                        <el-image
                          :src="item.avatarUrl"
                          fit="cover"
                          class="w-[45px] h-[45px] mb-[5px]"
                        >
                          <template #error>
                            <IconifyIconOnline
                              width="50"
                              :icon="'ri:file-2-line'"
                            />
                          </template>
                        </el-image>
                      </div>
                      <div>{{ item.groupName }}</div>
                    </div>
                  </template>
                </RecycleScroller>
                <div v-else class="text-[15px] flex w-full justify-center">
                  暂无群聊。
                </div>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <el-segmented
            v-model="segmentedValue"
            :options="SegmentedOptionArr"
            direction="horizontal"
            size="default"
          >
            <template #default="scope">
              <div :class="['flex', 'items-center', 'flex-col', 'p-2']">
                <el-icon size="20">
                  <component :is="scope.item['icon']" />
                </el-icon>
                <div>{{ scope.item["label"] }}</div>
              </div>
            </template>
          </el-segmented>
        </div>
      </div>
      <div v-if="showSearch" class="flex flex-col">
        <div v-if="searchPageType === 101">
          <div>
            <el-input
              v-model="search.searchKey"
              placeholder="请输入搜索内容"
              clearable
              class="w-full"
              @change="onSearchKeyChange"
            />
          </div>
          <div class="flex justify-between">
            <div>最近搜索</div>
            <div>
              <div
                v-if="!searchHistoryCloseFlag"
                @click="searchHistoryCloseFlag = true"
              >
                删除
              </div>
              <div v-else>
                <div @click="searchHistoryDeleteAllClick()">清空</div>
                <div @click="searchHistoryCloseFlag = false">完成</div>
              </div>
            </div>
          </div>
          <div>
            <template v-for="item in searchHistoryList" :key="item.id">
              <el-tag
                class="w-[50%]"
                :closable="searchHistoryCloseFlag"
                @close="searchHistoryDeleteClick(item.id)"
                @click="
                  () => {
                    searchPageType = 201;
                    search.searchKey = item.searchHistory;
                    immediateDebounce();
                  }
                "
                >{{ item.searchHistory }}
              </el-tag>
            </template>
          </div>
        </div>
        <div v-else-if="searchPageType === 201">
          <div class="flex flex-col">
            <div class="flex flex-col">
              <div>联系人</div>
              <template v-for="item in searchFriendList" :key="item.sessionId">
                <div class="flex">
                  <el-image
                    :src="item.avatarUrl"
                    fit="cover"
                    class="w-[45px] h-[45px] mb-[5px]"
                  >
                    <template #error>
                      <IconifyIconOnline width="50" :icon="'ri:file-2-line'" />
                    </template>
                  </el-image>
                  <div>{{ item.friendName }}</div>
                </div>
              </template>
            </div>
            <div class="flex flex-col">
              <div>群聊</div>
              <template v-for="item in searchGroupList" :key="item.sessionId">
                <div class="flex">
                  <el-image
                    :src="item.avatarUrl"
                    fit="cover"
                    class="w-[45px] h-[45px] mb-[5px]"
                  >
                    <template #error>
                      <IconifyIconOnline width="50" :icon="'ri:file-2-line'" />
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
                      <IconifyIconOnline width="50" :icon="'ri:file-2-line'" />
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
        </div>
        <div v-else-if="searchPageType === 301">
          <div v-loading="searchContentInfoLoading" class="flex flex-col">
            <template
              v-for="item in searchContentInfoList"
              :key="item.contentId"
            >
              <div class="flex" @click="searchContentInfoClick(item)">
                <div>
                  <el-image
                    :src="sessionUserMap[searchContentInfo.targetId].avatarUrl"
                    fit="cover"
                    class="w-[45px] h-[45px] mb-[5px]"
                  >
                    <template #error>
                      <IconifyIconOnline width="50" :icon="'ri:file-2-line'" />
                    </template>
                  </el-image>
                </div>
                <div class="flex flex-col">
                  <div>
                    {{ sessionUserMap[searchContentInfo.targetId].showName }}
                  </div>
                  <div class="flex h-[90px]">
                    <div>{{ item.content }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-splitter-panel>
    <el-splitter-panel>
      <div class="flex flex-col">
        <div>{{ session.showName }}</div>
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
                      :src="sessionUserMap[item.createId].avatarUrl"
                      fit="cover"
                      class="w-[45px] h-[45px] mb-[5px]"
                    >
                      <template #error>
                        <IconifyIconOnline
                          width="50"
                          :icon="'ri:file-2-line'"
                        />
                      </template>
                    </el-image>
                  </div>
                  <div class="flex flex-col">
                    <div class="flex justify-around">
                      <div>{{ sessionUserMap[item.createId].showName }}</div>
                      <div>
                        {{
                          FormatDateTimeForCurrentDay(new Date(item.createTs))
                        }}
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
    </el-splitter-panel>
  </el-splitter>
</template>
