<script setup lang="ts">
import { ref } from "vue";
import Motion from "../utils/motion";
import type { FormInstance } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useVerifyCode } from "@/utils/verifyCode";
import {
  signEmailSignInCode,
  SignEmailSignInCodeDTO
} from "@/api/http/base/SignEmailController";
import { ToastSuccess } from "@/utils/ToastUtil";
import { Validate } from "@/utils/ValidatorUtil";
import { getTopMenu, initRouter } from "@/router/utils";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const ruleForm = ref<SignEmailSignInCodeDTO>({});
const ruleFormRef = ref<FormInstance>();
const { isDisabled, text } = useVerifyCode();

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (!valid) {
      return;
    }
    loading.value = true;
    signEmailSignInCode(ruleForm.value)
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

function onBack() {
  useVerifyCode().end();
  useUserStoreHook().SET_CURRENTPAGE(0);
}
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" size="large">
    <Motion>
      <el-form-item
        prop="email"
        :rules="[
          {
            required: true,
            trigger: 'blur',
            asyncValidator: Validate.email.validator
          }
        ]"
      >
        <el-input
          v-model="ruleForm.email"
          clearable
          placeholder="邮箱"
          :prefix-icon="useRenderIcon('ri:mail-fill')"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="100">
      <el-form-item
        prop="code"
        :rules="[
          {
            required: true,
            trigger: 'blur',
            asyncValidator: Validate.code.validator
          }
        ]"
      >
        <div class="w-full flex justify-between">
          <el-input
            v-model="ruleForm.code"
            clearable
            placeholder="邮箱验证码"
            :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
          />
          <el-button
            :disabled="isDisabled"
            class="ml-2"
            @click="
              useVerifyCode().start(
                ruleFormRef,
                'email',
                signEmailSignInCode({ email: ruleForm.email })
              )
            "
          >
            {{ text.length > 0 ? text + "秒后重新获取" : "获取验证码" }}
          </el-button>
        </div>
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="onLogin(ruleFormRef)"
        >
          登录
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="200">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          返回
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
