<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import { BaseFileStorageConfigurationInsertOrUpdateDTO } from "@/api/http/base/BaseFileStorageConfigurationController";
import { IFileStorageConfigurationDialogFormProps } from "@/views/file/fileStorageConfiguration/types";
import { yesOrNoOptions } from "@/model/enum/yesOrNoEnum";
import { BaseFileStorageTypeOptions } from "@/model/enum/BaseFileStorageTypeEnum";

const form = ref<BaseFileStorageConfigurationInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BaseFileStorageConfigurationInsertOrUpdateDTO) {
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

const props = defineProps<IFileStorageConfigurationDialogFormProps>();

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
            label="文件存储名称"
            prop="name"
            :rules="[
              {
                required: true,
                message: '文件存储名称为必填项',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.name"
              clearable
              placeholder="请输入文件存储名称"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" class="w-full" disabled>
              <el-option
                v-for="(item, index) in BaseFileStorageTypeOptions"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="钥匙" prop="accessKey">
            <el-input
              v-model="form.accessKey"
              clearable
              placeholder="请输入钥匙"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="秘钥" prop="secretKey">
            <el-input
              v-model="form.secretKey"
              clearable
              placeholder="请输入秘钥"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="上传端点" prop="uploadEndpoint">
            <el-input
              v-model="form.uploadEndpoint"
              clearable
              placeholder="请输入上传端点"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="公开下载端点" prop="publicDownloadEndpoint">
            <el-input
              v-model="form.publicDownloadEndpoint"
              clearable
              placeholder="请输入公开下载端点"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="公开桶" prop="bucketPublicName">
            <el-input
              v-model="form.bucketPublicName"
              clearable
              placeholder="请输入公开桶"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="私有桶" prop="bucketPrivateName">
            <el-input
              v-model="form.bucketPrivateName"
              clearable
              placeholder="请输入私有桶"
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
