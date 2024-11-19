<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { getTopMenu, initRouter } from "@/router/utils";
import { avatar, bg, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { computed, onBeforeUnmount, onMounted, ref, toRaw } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import { ToastSuccess } from "@/utils/ToastUtil";
import { CloseWebSocket } from "@/utils/webSocket/WebSocketUtil";
import { operates } from "@/views/sign/utils/enums";
import SignInEmail from "@/views/sign/components/SignInEmail.vue";
import SignUpEmail from "@/views/sign/components/SignUpEmail.vue";
import SignUpUserName from "@/views/sign/components/SignUpUserName.vue";
import ForgetPassword from "@/views/sign/components/ForgetPassword.vue";
import { SignUserNameSignInPasswordDTO } from "@/api/http/base/SignUserNameController";

defineOptions({
  name: "Sign"
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = ref<SignUserNameSignInPasswordDTO>({});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (!valid) {
      return;
    }
    loading.value = true;
    useUserStoreHook()
      .loginByUsername({
        username: ruleForm.value.username,
        password: ruleForm.value.password
      })
      .then(() => {
        // 获取后端路由
        return initRouter()
          .then(() => {
            router.push(getTopMenu(true).path).then(() => {
              ToastSuccess("欢迎回来 ~");
            });
          })
          .finally(() => {
            loading.value = false;
          });
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
  CloseWebSocket(); // 关闭 webSocket
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});

const currentPage = computed(() => {
  return useUserStoreHook().currentPage;
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form ref="ruleFormRef" :model="ruleForm" size="large">
            <Motion :delay="100">
              <el-form-item
                prop="username"
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item
                prop="password"
                :rules="[
                  {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <div class="w-full h-[20px] flex justify-between items-center">
                <div />
                <el-button
                  link
                  type="primary"
                  @click="useUserStoreHook().SET_CURRENTPAGE(4)"
                >
                  忘记密码?
                </el-button>
              </div>
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登 录
              </el-button>
            </Motion>

            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-button
                    v-for="(item, index) in operates"
                    :key="index"
                    class="w-full mt-4"
                    size="default"
                    @click="useUserStoreHook().SET_CURRENTPAGE(index + 1)"
                  >
                    {{ item.title }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion>
          </el-form>

          <!-- 邮箱登录 -->
          <SignInEmail v-if="currentPage === 1" />
          <!-- 邮箱注册 -->
          <SignUpEmail v-if="currentPage === 2" />
          <!-- 用户名注册 -->
          <SignUpUserName v-if="currentPage === 3" />
          <!-- 忘记密码 -->
          <ForgetPassword v-if="currentPage === 4" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
