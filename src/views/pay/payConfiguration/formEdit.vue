<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import { yesOrNoOptions } from "@/model/enum/yesOrNoEnum";
import { BasePayConfigurationInsertOrUpdateDTO } from "@/api/http/base/BasePayConfigurationController";
import { IPayConfigurationDialogFormProps } from "@/views/pay/payConfiguration/types";
import { BasePayTypeOptions } from "@/model/enum/BasePayTypeEnum";
import Info from "@iconify-icons/ri/information-line";
import { Validate } from "@/utils/ValidatorUtil";

const form = ref<BasePayConfigurationInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BasePayConfigurationInsertOrUpdateDTO) {
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

const props = defineProps<IPayConfigurationDialogFormProps>();

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
                v-for="(item, index) in BasePayTypeOptions"
                :key="index"
                :value="item.value"
                :label="item.label as string"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            prop="serverUrl"
            :rules="[
              {
                trigger: 'blur',
                asyncValidator: Validate.url.canNullValidator
              }
            ]"
          >
            <template #label>
              <div class="flex items-center">
                <span>网关地址</span>
                <IconifyIconOffline
                  v-tippy="{
                    content: '例如：https://openapi.alipay.com/gateway.do',
                    placement: 'top'
                  }"
                  :icon="Info"
                  class="ml-1"
                />
              </div>
            </template>
            <el-input
              v-model="form.serverUrl"
              clearable
              placeholder="请输入网关地址"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="应用id" prop="appId">
            <el-input
              v-model="form.appId"
              clearable
              placeholder="请输入appId"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="私钥" prop="privateKey">
            <el-input
              v-model="form.privateKey"
              clearable
              placeholder="请输入私钥"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="平台公钥" prop="platformPublicKey">
            <el-input
              v-model="form.platformPublicKey"
              clearable
              placeholder="请输入平台公钥"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="异步通知地址"
            prop="notifyUrl"
            :rules="[
              {
                trigger: 'blur',
                asyncValidator: Validate.url.canNullValidator
              }
            ]"
          >
            <el-input
              v-model="form.notifyUrl"
              clearable
              placeholder="请输入异步通知地址"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="商户号" prop="merchantId">
            <el-input
              v-model="form.merchantId"
              clearable
              placeholder="请输入商户号"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="证书序列" prop="merchantSerialNumber">
            <el-input
              v-model="form.merchantSerialNumber"
              clearable
              placeholder="请输入商户证书序列号"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="apiV3Key" prop="apiV3Key">
            <el-input
              v-model="form.apiV3Key"
              clearable
              placeholder="请输入apiV3Key"
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
