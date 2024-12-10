<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import { yesOrNoOptions } from "@/model/enum/yesOrNoEnum";
import { BaseSmsConfigurationInsertOrUpdateDTO } from "@/api/http/base/BaseSmsConfigurationController";
import { ISmsConfigurationDialogFormProps } from "@/views/base/smsConfiguration/types";
import { BaseSmsTypeOptions } from "@/model/enum/BaseSmsTypeEnum";

const form = ref<BaseSmsConfigurationInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BaseSmsConfigurationInsertOrUpdateDTO) {
  doOpen(
    formRef,
    form,
    visible,
    confirmLoading,
    {
      enableFlag: true,
      ...formTemp
    },
    dialogLoading
  );
}

function editOpen(fun: Promise<R<any>>) {
  dialogLoading.value = true;
  confirmLoading.value = false;
  visible.value = true;
  form.value = {};
  formRef.value?.clearValidate();
  fun.then(res => {
    form.value = res.data;
    dialogLoading.value = false;
  });
}

defineExpose({
  getForm,
  addOpen,
  editOpen
});

const props = defineProps<ISmsConfigurationDialogFormProps>();

function confirmClick() {
  doConfirmClick(formRef, props, visible, confirmLoading);
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
    <el-form
      ref="formRef"
      v-loading="dialogLoading"
      :model="form"
      label-width="auto"
    >
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="名称"
            prop="name"
            :rules="[
              {
                required: true,
                message: '名称为必填项',
                trigger: 'blur'
              }
            ]"
          >
            <el-input v-model="form.name" clearable placeholder="请输入名称" />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="类型"
            prop="type"
            :rules="[
              {
                required: true,
                message: '类型为必填项',
                trigger: 'blur'
              }
            ]"
          >
            <el-select v-model="form.type" class="w-full" clearable>
              <el-option
                v-for="(item, index) in BaseSmsTypeOptions"
                :key="index"
                :value="item.value"
                :label="item.label as string"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="钥匙" prop="secretId">
            <el-input
              v-model="form.secretId"
              clearable
              placeholder="请输入钥匙"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 5 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="秘钥" prop="secretKey">
            <el-input
              v-model="form.secretKey"
              clearable
              placeholder="请输入秘钥"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 5 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="短信应用id" prop="sdkAppId">
            <el-input
              v-model="form.sdkAppId"
              clearable
              placeholder="请输入短信应用id"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 5 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="签名内容" prop="signName">
            <el-input
              v-model="form.signName"
              clearable
              placeholder="请输入签名内容"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 5 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="通用短信" prop="sendCommon">
            <el-input
              v-model="form.sendCommon"
              clearable
              placeholder="请输入通用短信"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="注册短信" prop="sendSignUp">
            <el-input
              v-model="form.sendSignUp"
              clearable
              placeholder="请输入注册短信"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="登录短信" prop="sendSignIn">
            <el-input
              v-model="form.sendSignIn"
              clearable
              placeholder="请输入登录短信"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="设置密码" prop="sendSetPassword">
            <el-input
              v-model="form.sendSetPassword"
              clearable
              placeholder="请输入设置密码"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="修改密码" prop="sendUpdatePassword">
            <el-input
              v-model="form.sendUpdatePassword"
              clearable
              placeholder="请输入修改密码"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="设置登录名" prop="sendSetUserName">
            <el-input
              v-model="form.sendSetUserName"
              clearable
              placeholder="请输入设置登录名"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="修改登录名" prop="sendUpdateUserName">
            <el-input
              v-model="form.sendUpdateUserName"
              clearable
              placeholder="请输入修改登录名"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="设置邮箱" prop="sendSetEmail">
            <el-input
              v-model="form.sendSetEmail"
              clearable
              placeholder="请输入设置邮箱"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="修改邮箱" prop="sendUpdateEmail">
            <el-input
              v-model="form.sendUpdateEmail"
              clearable
              placeholder="请输入修改邮箱"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="设置微信" prop="sendSetWx">
            <el-input
              v-model="form.sendSetWx"
              clearable
              placeholder="请输入设置微信"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="修改微信" prop="sendUpdateWx">
            <el-input
              v-model="form.sendUpdateWx"
              clearable
              placeholder="请输入修改微信"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="设置手机" prop="sendSetPhone">
            <el-input
              v-model="form.sendSetPhone"
              clearable
              placeholder="请输入设置手机"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="修改手机" prop="sendUpdatePhone">
            <el-input
              v-model="form.sendUpdatePhone"
              clearable
              placeholder="请输入修改手机"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="忘记密码" prop="sendForgetPassword">
            <el-input
              v-model="form.sendForgetPassword"
              clearable
              placeholder="请输入忘记密码"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="账号注销" prop="sendSignDelete">
            <el-input
              v-model="form.sendSignDelete"
              clearable
              placeholder="请输入账号注销"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="默认" prop="defaultFlag">
            <re-segmented
              :modelValue="form.defaultFlag ? 0 : 1"
              :options="yesOrNoOptions"
              @change="
                ({ option: { value } }) => {
                  form.defaultFlag = value;
                }
              "
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="启用" prop="enableFlag">
            <re-segmented
              :modelValue="form.enableFlag ? 0 : 1"
              :options="enableFlagOptions"
              @change="
                ({ option: { value } }) => {
                  form.enableFlag = value;
                }
              "
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
