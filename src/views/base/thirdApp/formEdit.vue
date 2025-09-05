<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { enableFlagOptions } from "@/model/enum/base/enableFlagEnum";
import { BaseThirdAppInsertOrUpdateDTO } from "@/api/http/base/BaseThirdAppController";
import { BaseThirdAppTypeOptions } from "@/model/enum/thirdApp/BaseThirdAppTypeEnum";
import Info from "~icons/ri/information-line";
import { IThirdAppConfigurationDialogFormProps } from "@/views/base/thirdApp/types";

const form = ref<BaseThirdAppInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BaseThirdAppInsertOrUpdateDTO) {
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

const props = defineProps<IThirdAppConfigurationDialogFormProps>();

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
                v-for="(item, index) in BaseThirdAppTypeOptions"
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
          <el-form-item label="appId" prop="appId">
            <el-input
              v-model="form.appId"
              clearable
              placeholder="请输入appId"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="secret" prop="secret">
            <el-input
              v-model="form.secret"
              clearable
              placeholder="请输入secret"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="关注回复" prop="subscribeReplyContent">
            <el-input
              v-model="form.subscribeReplyContent"
              clearable
              placeholder="请输入关注回复"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="文字回复" prop="textReplyContent">
            <el-input
              v-model="form.textReplyContent"
              clearable
              placeholder="请输入文字回复"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="图片回复" prop="imageReplyContent">
            <el-input
              v-model="form.imageReplyContent"
              clearable
              placeholder="请输入图片回复"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item prop="qrCode">
            <template #label>
              <div class="flex items-center">
                <span>二维码</span>
                <IconifyIconOffline
                  v-tippy="{
                    content:
                      '备注：不是二维码图片的地址，而是二维码解码之后的值',
                    placement: 'top'
                  }"
                  :icon="Info"
                  class="ml-1"
                />
              </div>
            </template>
            <el-input
              v-model="form.qrCode"
              clearable
              placeholder="请输入二维码"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item prop="openId">
            <template #label>
              <div class="flex items-center">
                <span>openId</span>
                <IconifyIconOffline
                  v-tippy="{
                    content:
                      '例如：接收微信公众号消息时的 ToUserName，不能重复',
                    placement: 'top'
                  }"
                  :icon="Info"
                  class="ml-1"
                />
              </div>
            </template>
            <el-input
              v-model="form.openId"
              clearable
              placeholder="请输入openId"
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
