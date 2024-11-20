<script setup lang="ts">
import { ref } from "vue";
import Motion from "../utils/motion";
import type { FormInstance } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "@iconify-icons/ri/lock-fill";
import { useVerifyCode } from "@/utils/verifyCode";
import {
  signEmailForgetPassword,
  SignEmailForgetPasswordDTO,
  signEmailForgetPasswordSendCode
} from "@/api/http/base/SignEmailController";
import { ToastSuccess } from "@/utils/ToastUtil";
import { Validate } from "@/utils/ValidatorUtil";
import { PasswordRSAEncrypt, RSAEncrypt } from "@/utils/RsaUtil";

const loading = ref(false);
const ruleForm = ref<SignEmailForgetPasswordDTO>({});
const ruleFormRef = ref<FormInstance>();
const { isDisabled, text } = useVerifyCode();

const onUpdate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (!valid) {
      return;
    }
    loading.value = true;
    const formValue = { ...ruleForm.value };
    formValue.originNewPassword = RSAEncrypt(formValue.newPassword);
    formValue.newPassword = PasswordRSAEncrypt(formValue.newPassword);
    signEmailForgetPassword(formValue)
      .then(res => {
        ToastSuccess(res.msg);
        onBack();
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
                signEmailForgetPasswordSendCode({ email: ruleForm.email })
              )
            "
          >
            {{ text.length > 0 ? text + "秒后重新获取" : "获取验证码" }}
          </el-button>
        </div>
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item
        prop="newPassword"
        :rules="[
          {
            required: true,
            trigger: 'blur',
            asyncValidator: Validate.password.validator
          }
        ]"
      >
        <el-input
          v-model="ruleForm.newPassword"
          clearable
          show-password
          placeholder="新密码"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="200">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="onUpdate(ruleFormRef)"
        >
          确定
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="250">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          返回
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
