<script setup lang="ts">
import { useRouter } from "vue-router";
import { onBeforeMount, onMounted, ref } from "vue";
import { ReText } from "@/components/ReText";
import Profile from "./components/Profile.vue";
import { deviceDetection, useGlobal } from "@pureadmin/utils";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import LaySidebarTopCollapse from "@/layout/components/lay-sidebar/components/SidebarTopCollapse.vue";

import leftLine from "@iconify-icons/ri/arrow-left-s-line";
import ProfileIcon from "@iconify-icons/ri/user-3-line";
import {
  baseUserSelfInfo,
  BaseUserSelfInfoVO
} from "@/api/http/base/BaseUserController";
import { handleAvatarFileId } from "@/utils/UserUtil";

defineOptions({
  name: "AccountSettings"
});

const router = useRouter();
const isOpen = ref(deviceDetection() ? false : true);
const { $storage } = useGlobal<GlobalPropertiesApi>();
onBeforeMount(() => {
  useDataThemeChange().dataThemeChange($storage.layout?.overallStyle);
});

const userInfo = ref<BaseUserSelfInfoVO>({});

const userAvatarUrl = ref("");

onMounted(() => {
  baseUserSelfInfo().then(res => {
    userInfo.value = res.data;
    const avatarFileId = res.data.avatarFileId!;
    handleAvatarFileId(avatarFileId, url => (userAvatarUrl.value = url));
  });
});

const panes = [
  {
    key: "profile",
    label: "个人信息",
    icon: ProfileIcon,
    component: Profile
  }
  // {
  //   key: "securityLog",
  //   label: "安全日志",
  //   icon: SecurityLogIcon,
  //   component: SecurityLog
  // },
  // {
  //   key: "accountManagement",
  //   label: "账户管理",
  //   icon: AccountManagementIcon,
  //   component: AccountManagement
  // }
];
const witchPane = ref("profile");
</script>

<template>
  <el-container class="h-full">
    <el-aside
      v-if="isOpen"
      class="pure-account-settings overflow-hidden px-2 dark:!bg-[var(--el-bg-color)] border-r-[1px] border-[var(--pure-border-color)]"
      :width="deviceDetection() ? '180px' : '240px'"
    >
      <el-menu :default-active="witchPane" class="pure-account-settings-menu">
        <el-menu-item
          class="hover:!transition-all hover:!duration-200 hover:!text-base !h-[50px]"
          @click="router.go(-1)"
        >
          <div class="flex items-center">
            <IconifyIconOffline :icon="leftLine" />
            <span class="ml-2">返回</span>
          </div>
        </el-menu-item>
        <div class="flex items-center ml-8 mt-4 mb-4">
          <el-avatar :size="48" :src="userAvatarUrl" />
          <div class="ml-4 flex flex-col max-w-[130px]">
            <ReText class="font-bold !self-baseline">
              {{ userInfo.nickname }}
            </ReText>
            <ReText class="!self-baseline" type="info">
              {{ userInfo.username }}
            </ReText>
          </div>
        </div>
        <el-menu-item
          v-for="item in panes"
          :key="item.key"
          :index="item.key"
          @click="
            () => {
              witchPane = item.key;
              if (deviceDetection()) {
                isOpen = !isOpen;
              }
            }
          "
        >
          <div class="flex items-center z-10">
            <el-icon>
              <IconifyIconOffline :icon="item.icon" />
            </el-icon>
            <span>{{ item.label }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <LaySidebarTopCollapse
        v-if="deviceDetection()"
        class="px-0"
        :is-active="isOpen"
        @toggleClick="isOpen = !isOpen"
      />
      <component
        :is="panes.find(item => item.key === witchPane).component"
        :class="[!deviceDetection() && 'ml-[120px]']"
      />
    </el-main>
  </el-container>
</template>

<style lang="scss">
.pure-account-settings {
  background: $menuBg;
}

.pure-account-settings-menu {
  background-color: transparent;
  border: none;

  .el-menu-item {
    height: 48px !important;
    color: $menuText;
    background-color: transparent !important;
    transition: color 0.2s;

    &:hover {
      color: $menuTitleHover !important;
    }

    &.is-active {
      color: #fff !important;

      &:hover {
        color: #fff !important;
      }

      &::before {
        position: absolute;
        inset: 0 8px;
        margin: 4px 0;
        clear: both;
        content: "";
        background: var(--el-color-primary);
        border-radius: 3px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
body[layout] {
  .el-menu--vertical .is-active {
    color: #fff !important;
    transition: color 0.2s;

    &:hover {
      color: #fff !important;
    }
  }
}
</style>
