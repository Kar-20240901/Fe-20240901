<script setup lang="ts">
import { ref } from "vue";
import Motion from "../utils/motion";
import type { FormInstance } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "~icons/ri/lock-fill";
import {
  signEmailSignUp,
  SignEmailSignUpDTO,
  signEmailSignUpSendCode
} from "@/api/http/base/SignEmailController";
import { ToastSuccess } from "@/utils/ToastUtil";
import { Validate } from "@/utils/ValidatorUtil";
import { useVerifyCode } from "@/utils/verifyCode";
import { PasswordRSAEncrypt, RSAEncrypt } from "@/utils/RsaUtil";
import RiEmail from "~icons/ri/mail-fill";
import RiShieldKeyholeLine from "~icons/ri/shield-keyhole-line";

const loading = ref(false);
const ruleForm = ref<SignEmailSignUpDTO>({});
const ruleFormRef = ref<FormInstance>();
const verifyCode = useVerifyCode();

const onUpdate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (!valid) {
      return;
    }
    loading.value = true;
    const formValue = { ...ruleForm.value };
    formValue.originPassword = RSAEncrypt(formValue.password);
    formValue.password = PasswordRSAEncrypt(formValue.password);
    signEmailSignUp(formValue)
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
  verifyCode.end();
  useUserStoreHook().SET_CURRENTPAGE(0);
}
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" size="large">
    <Motion>
      <el-form-item
        :rules="[
          {
            required: true,
            trigger: 'blur',
            asyncValidator: Validate.email.validator
          }
        ]"
        prop="email"
      >
        <el-input
          v-model="ruleForm.email"
          clearable
          placeholder="邮箱"
          :prefix-icon="useRenderIcon(RiEmail)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="100">
      <el-form-item
        prop="password"
        :rules="[
          {
            required: true,
            trigger: 'blur',
            asyncValidator: Validate.password.validator
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

    <Motion :delay="150">
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
            :prefix-icon="useRenderIcon(RiShieldKeyholeLine)"
          />
          <el-button
            :disabled="verifyCode.isDisabled.value"
            class="ml-2"
            @click="
              verifyCode.start(ruleFormRef, 'email', () => {
                return signEmailSignUpSendCode({ email: ruleForm.email });
              })
            "
          >
            {{
              verifyCode.text.value.length > 0
                ? verifyCode.text.value + "秒后重新获取"
                : "获取验证码"
            }}
          </el-button>
        </div>
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
          注册
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
