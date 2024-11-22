<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import {
  doConfirmClick,
  doOpen,
  IDialogFormProps
} from "@/model/types/IDialogFormProps";
import { ToastSuccess } from "@/utils/ToastUtil";
import { useUserStoreHook } from "@/store/modules/user";
import {
  signUserNameSignDelete,
  SignUserNameSignDeleteDTO
} from "@/api/http/base/SignUserNameController";
import { Validate } from "@/utils/ValidatorUtil";
import { PasswordRSAEncrypt } from "@/utils/RsaUtil";

const form = ref<SignUserNameSignDeleteDTO>({});
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

function confirmFun() {
  const formValue = { ...form.value };
  formValue.currentPassword = PasswordRSAEncrypt(formValue.currentPassword);
  return signUserNameSignDelete(formValue);
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
            label="当前密码"
            prop="currentPassword"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                asyncValidator: Validate.password.validator
              }
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
