<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import ReCol from "@/components/ReCol";
import {
  doConfirmClick,
  doOpen,
  IDialogFormProps
} from "@/model/types/IDialogFormProps";
import {
  signEmailSetPasswordSendCode,
  signEmailUpdatePassword,
  SignEmailUpdatePasswordDTO
} from "@/api/http/base/SignEmailController";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useVerifyCode } from "@/utils/verifyCode";
import { ToastSuccess } from "@/utils/ToastUtil";
import { useUserStoreHook } from "@/store/modules/user";
import { Validate } from "@/utils/ValidatorUtil";
import { PasswordRSAEncrypt, RSAEncrypt } from "@/utils/RsaUtil";

const form = ref<SignEmailUpdatePasswordDTO>({});
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

const { isDisabled, text } = useVerifyCode();

function confirmFun() {
  const formValue = { ...form.value };
  formValue.originNewPassword = RSAEncrypt(formValue.newPassword);
  formValue.newPassword = PasswordRSAEncrypt(formValue.newPassword);
  return signEmailUpdatePassword(formValue);
}

function confirmAfterFun(res, done) {
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
  useVerifyCode().end();
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="props.title"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="45%"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-row :gutter="30">
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item
            label="新密码"
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
              v-model="form.newPassword"
              clearable
              placeholder="请输入新密码"
            />
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
          >
            <div class="w-full flex justify-between">
              <el-input
                v-model="form.code"
                clearable
                placeholder="邮箱验证码"
                :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
              />
              <el-button
                :disabled="isDisabled"
                class="ml-2"
                @click="
                  useVerifyCode().start(formRef, 'newPassword', () => {
                    return signEmailSetPasswordSendCode();
                  })
                "
              >
                {{ text.length > 0 ? text + "秒后重新获取" : "获取验证码" }}
              </el-button>
            </div>
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
