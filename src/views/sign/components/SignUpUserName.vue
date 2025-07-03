<script setup lang="ts">
import { ref } from "vue";
import Motion from "../utils/motion";
import type { FormInstance } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "~icons/ri/lock-fill";
import User from "~icons/ri/user-3-fill";
import {
  signUserNameSignUp,
  SignUserNameSignUpDTO
} from "@/api/http/base/SignUserNameController";
import { PasswordRSAEncrypt, RSAEncrypt } from "@/utils/RsaUtil";
import { ToastSuccess } from "@/utils/ToastUtil";
import { Validate } from "@/utils/ValidatorUtil";

const loading = ref(false);
const ruleForm = ref<SignUserNameSignUpDTO>({});
const ruleFormRef = ref<FormInstance>();

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
    signUserNameSignUp(formValue)
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
            asyncValidator: Validate.username.validator
          }
        ]"
        prop="username"
      >
        <el-input
          v-model="ruleForm.username"
          clearable
          placeholder="用户名"
          :prefix-icon="useRenderIcon(User)"
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

    <Motion :delay="200">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          返回
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
