<script setup lang="ts">
import { onMounted, ref } from "vue";
import { deviceDetection } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";
import SetUserNameByEmail from "@/views/account-settings/components/email/SetUserNameByEmail.vue";
import UpdateUserNameByEmail from "@/views/account-settings/components/email/UpdateUserNameByEmail.vue";
import UpdateUserNameByUserName from "@/views/account-settings/components/username/UpdateUserNameByUserName.vue";
import SetPasswordByEmail from "@/views/account-settings/components/email/SetPasswordByEmail.vue";
import UpdatePasswordByEmail from "@/views/account-settings/components/email/UpdatePasswordByEmail.vue";
import SetEmailByUserName from "@/views/account-settings/components/username/SetEmailByUserName.vue";
import UpdateEmailByEmail from "@/views/account-settings/components/email/UpdateEmailByEmail.vue";
import SignDeleteByEmail from "@/views/account-settings/components/email/SignDeleteByEmail.vue";
import SignDeleteByUserName from "@/views/account-settings/components/username/SignDeleteByUserName.vue";
import UpdatePasswordByUserName from "@/views/account-settings/components/username/UpdatePasswordByUserName.vue";

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

const userInfo = useUserStoreHook();

useUserStoreHook().$subscribe((mutation, state) => {
  handleUserInfo();
});

function handleUserInfo() {
  if (userInfo.username) {
    list.value[usernameIndex].illustrate = userInfo.username;
    list.value[usernameIndex].button = "修改";
  } else {
    list.value[emailIndex].illustrate = "";
    list.value[usernameIndex].button = "设置";
  }

  if (userInfo.passwordFlag) {
    list.value[passwordIndex].button = "修改";
  } else {
    list.value[passwordIndex].button = "设置";
  }

  if (userInfo.email) {
    list.value[emailIndex].illustrate = userInfo.email;
    list.value[emailIndex].button = "修改";
  } else {
    list.value[emailIndex].illustrate = "";
    list.value[emailIndex].button = "设置";
  }

  if (userInfo.createTime) {
    list.value[signDeleteIndex].illustrate = userInfo.createTime;
  } else {
    list.value[signDeleteIndex].illustrate = "";
  }
}

onMounted(() => {
  handleUserInfo();
});

const setUserNameByEmailRef = ref();
const updateUserNameByEmailRef = ref();
const updateUserNameByUserNameRef = ref();

const setPasswordByEmailRef = ref();
const updatePasswordByEmailRef = ref();
const updatePasswordByUserNameRef = ref();

const setEmailByUserNameRef = ref();
const updateEmailByEmailRef = ref();

const signDeleteByEmailRef = ref();
const signDeleteByUserNameRef = ref();

function onClick(index, item) {
  if (index === usernameIndex) {
    if (item.button === "设置") {
      if (userInfo.email) {
        setUserNameByEmailRef.value.open();
      }
    } else if (item.button === "修改") {
      if (userInfo.email) {
        updateUserNameByEmailRef.value.open();
      } else if (userInfo.username) {
        updateUserNameByUserNameRef.value.open();
      }
    }
  } else if (index === passwordIndex) {
    if (item.button === "设置") {
      if (userInfo.email) {
        setPasswordByEmailRef.value.open();
      }
    } else if (item.button === "修改") {
      if (userInfo.email) {
        updatePasswordByEmailRef.value.open();
      } else if (userInfo.username) {
        updatePasswordByUserNameRef.value.open();
      }
    }
  } else if (index === emailIndex) {
    if (item.button === "设置") {
      if (userInfo.username) {
        setEmailByUserNameRef.value.open();
      }
    } else if (item.button === "修改") {
      if (userInfo.email) {
        updateEmailByEmailRef.value.open();
      }
    }
  } else if (index === signDeleteIndex) {
    if (userInfo.email) {
      signDeleteByEmailRef.value.open();
    } else if (userInfo.username) {
      signDeleteByUserNameRef.value.open();
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
    <UpdateUserNameByEmail ref="updateUserNameByEmailRef" title="修改用户名" />
    <UpdateUserNameByUserName
      ref="updateUserNameByUserNameRef"
      title="修改用户名"
    />

    <SetPasswordByEmail ref="setPasswordByEmailRef" title="设置密码" />
    <UpdatePasswordByUserName
      ref="updatePasswordByUserNameRef"
      title="修改密码"
    />
    <UpdatePasswordByEmail ref="updatePasswordByEmailRef" title="修改密码" />

    <SetEmailByUserName ref="setEmailByUserNameRef" title="设置邮箱" />
    <UpdateEmailByEmail ref="updateEmailByEmailRef" title="修改邮箱" />

    <SignDeleteByEmail ref="signDeleteByEmailRef" title="账号注销" />
    <SignDeleteByUserName ref="signDeleteByUserNameRef" title="账号注销" />
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  border-top: 0.1px var(--el-border-color) var(--el-border-style);
}
</style>
