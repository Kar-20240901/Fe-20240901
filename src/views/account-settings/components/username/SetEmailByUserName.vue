<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import ReCol from "@/components/ReCol";
import {
  doConfirmClick,
  doOpen,
  IDialogFormProps
} from "@/model/types/IDialogFormProps";
import { useVerifyCode } from "@/utils/verifyCode";
import { ToastSuccess } from "@/utils/ToastUtil";
import { useUserStoreHook } from "@/store/modules/user";
import { PasswordRSAEncrypt } from "@/utils/RsaUtil";
import {
  signUserNameSetEmail,
  SignUserNameSetEmailDTO,
  signUserNameSetEmailSendCode
} from "@/api/http/base/SignUserNameController";
import { Validate } from "@/utils/ValidatorUtil";
import { R } from "@/model/vo/R";

const form = ref<SignUserNameSetEmailDTO>({});
const formRef = ref();
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function open() {
  doOpen(formRef, form, visible, confirmLoading, {});
}

defineExpose({
  getForm,
  open
});

const props = defineProps<IDialogFormProps>();

const verifyCode = useVerifyCode();

function confirmFun() {
  const formValue = { ...form.value };
  formValue.currentPassword = PasswordRSAEncrypt(formValue.currentPassword);
  return signUserNameSetEmail(formValue);
}

function confirmAfterFun(res: R<any>, done: () => void) {
  done();
  ToastSuccess(res.msg);
  useUserStoreHook().logOut(); // 退出登录
}

function confirmClick() {
  doConfirmClick(
    formRef,
    { confirmFun, confirmAfterFun },
    visible,
    confirmLoading
  );
}

onUnmounted(() => {
  verifyCode.end();
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="props.title"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="30%"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-row :gutter="30">
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item
            label="邮箱"
            prop="email"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                asyncValidator: Validate.email.validator
              }
            ]"
          >
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item
            prop="code"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                asyncValidator: Validate.code.validator
              }
            ]"
            label="邮箱验证码"
          >
            <div class="w-full flex justify-between">
              <el-input
                v-model="form.code"
                clearable
                placeholder="邮箱验证码"
              />
              <el-button
                :disabled="verifyCode.isDisabled.value"
                class="ml-2"
                @click="
                  verifyCode.start(formRef, 'email', () => {
                    return signUserNameSetEmailSendCode({ email: form.email });
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
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item
            label="当前密码"
            prop="currentPassword"
            :rules="[
              { required: true, message: '当前密码为必填项', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model="form.currentPassword"
              clearable
              placeholder="请输入当前密码"
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>

    <template #footer>
      <div>
        <el-button @click="visible = false">取消</el-button>
        <el-button
          :loading="confirmLoading"
          type="primary"
          @click="confirmClick"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
