<script setup lang="ts">
import { ref } from "vue";
import { deviceDetection } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";
import { BaseUserSelfInfoVO } from "@/api/http/base/BaseUserController";
import SetUserNameByEmail from "@/views/account-settings/components/email/SetUserNameByEmail.vue";

defineOptions({
  name: "AccountManagement"
});

const usernameIndex = 0;
const passwordIndex = 1;
const emailIndex = 2;
const signDeleteIndex = 3;

const list = ref([
  {
    title: "账号用户名",
    illustrate: "",
    button: ""
  },
  {
    title: "账号密码",
    button: ""
  },
  {
    title: "绑定邮箱",
    illustrate: "",
    button: ""
  },
  {
    title: "账号注销",
    illustrate: "",
    button: "注销"
  }
]);

const userInfo = ref<BaseUserSelfInfoVO>({});

useUserStoreHook().$subscribe((mutation, state) => {
  userInfo.value = { ...state };

  if (state.username) {
    list[usernameIndex].illustrate = state.username;
    list[usernameIndex].button = "修改";
  } else {
    list[emailIndex].illustrate = "";
    list[usernameIndex].button = "设置";
  }

  if (state.passwordFlag) {
    list[passwordIndex].button = "修改";
  } else {
    list[passwordIndex].button = "设置";
  }

  if (state.email) {
    list[emailIndex].illustrate = state.email;
    list[emailIndex].button = "修改";
  } else {
    list[emailIndex].illustrate = "";
    list[emailIndex].button = "设置";
  }

  if (state.createTime) {
    list[signDeleteIndex].illustrate = state.createTime;
  } else {
    list[signDeleteIndex].illustrate = "";
  }
});

const setUserNameByEmailRef = ref();

function onClick(index, item) {
  if (index === usernameIndex) {
    if (item.button === "设置") {
      if (userInfo.value.email) {
        setUserNameByEmailRef.value.open();
      }
    } else if (item.button === "修改") {
      if (userInfo.value.email) {
      } else if (userInfo.value.username) {
      }
    }
  } else if (index === passwordIndex) {
    if (item.button === "设置") {
      if (userInfo.value.email) {
      }
    } else if (item.button === "修改") {
      if (userInfo.value.email) {
      } else if (userInfo.value.username) {
      }
    }
  } else if (index === emailIndex) {
    if (item.button === "设置") {
      if (userInfo.value.username) {
      }
    } else if (item.button === "修改") {
      if (userInfo.value.email) {
      }
    }
  } else if (index === signDeleteIndex) {
    if (userInfo.value.email) {
    } else if (userInfo.value.username) {
    }
  }
}
</script>

<template>
  <div
    :class="[
      'min-w-[180px]',
      deviceDetection() ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">账户管理</h3>
    <div v-for="(item, index) in list" :key="index">
      <div class="flex items-center">
        <div class="flex-1">
          <p>{{ item.title }}</p>
          <el-text v-if="item.illustrate" class="mx-1" type="info"
            >{{ item.illustrate }}
          </el-text>
        </div>
        <el-button
          v-if="item.button"
          type="primary"
          text
          @click="onClick(index, item)"
        >
          {{ item.button }}
        </el-button>
      </div>
      <el-divider />
    </div>

    <SetUserNameByEmail ref="setUserNameByEmailRef" title="设置用户名" />
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  border-top: 0.1px var(--el-border-color) var(--el-border-style);
}
</style>
