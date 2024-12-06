<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import ReCol from "@/components/ReCol";
import {
  doConfirmClick,
  doOpen,
  IDialogFormProps
} from "@/model/types/IDialogFormProps";
import {
  signEmailUpdateEmail,
  SignEmailUpdateEmailDTO,
  signEmailUpdateEmailSendCodeNew,
  signEmailUpdateEmailSendCodeOld
} from "@/api/http/base/SignEmailController";
import { useVerifyCode } from "@/utils/verifyCode";
import { ToastSuccess } from "@/utils/ToastUtil";
import { useUserStoreHook } from "@/store/modules/user";
import { Validate } from "@/utils/ValidatorUtil";
import { useVerifyCode2 } from "@/utils/verifyCode2";

const form = ref<SignEmailUpdateEmailDTO>({});
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
const { isDisabled2, text2 } = useVerifyCode2();

function confirmFun() {
  return signEmailUpdateEmail(form.value);
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
  useVerifyCode2().end();
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
            label="新邮箱"
            prop="newEmail"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                asyncValidator: Validate.email.validator
              }
            ]"
          >
            <el-input
              v-model="form.newEmail"
              clearable
              placeholder="请输入新邮箱"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item
            prop="newEmailCode"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                asyncValidator: Validate.code.validator
              }
            ]"
            label="新邮箱验证码"
          >
            <div class="w-full flex justify-between">
              <el-input
                v-model="form.newEmailCode"
                clearable
                placeholder="新邮箱验证码"
              />
              <el-button
                :disabled="isDisabled"
                class="ml-2"
                @click="
                  useVerifyCode().start(formRef, 'newEmail', () => {
                    return signEmailUpdateEmailSendCodeNew({
                      email: form.newEmail
                    });
                  })
                "
              >
                {{ text.length > 0 ? text + "秒后重新获取" : "获取验证码" }}
              </el-button>
            </div>
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item
            prop="oldEmailCode"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                asyncValidator: Validate.code.validator
              }
            ]"
            label="旧邮箱验证码"
          >
            <div class="w-full flex justify-between">
              <el-input
                v-model="form.oldEmailCode"
                clearable
                placeholder="旧邮箱验证码"
              />
              <el-button
                :disabled="isDisabled2"
                class="ml-2"
                @click="
                  useVerifyCode2().start(formRef, '', () => {
                    return signEmailUpdateEmailSendCodeOld();
                  })
                "
              >
                {{ text2.length > 0 ? text2 + "秒后重新获取" : "获取验证码" }}
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
