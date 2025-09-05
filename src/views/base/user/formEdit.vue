<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { BaseUserInsertOrUpdateDTO } from "@/api/http/base/BaseUserController";
import { IUserDialogFormProps } from "@/views/base/user/types";
import { yesOrNoOptions } from "@/model/enum/base/yesOrNoEnum";
import { enableFlagOptions } from "@/views/base/user/enums";
import { Validate } from "@/utils/ValidatorUtil";

const form = ref<BaseUserInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BaseUserInsertOrUpdateDTO) {
  doOpen(
    formRef,
    form,
    visible,
    confirmLoading,
    {
      enableFlag: true,
      manageSignInFlag: true,
      ...formTemp
    },
    dialogLoading
  );
}

function editOpen(fun: Promise<R<any>>, formTemp: BaseUserInsertOrUpdateDTO) {
  dialogLoading.value = true;
  confirmLoading.value = false;
  visible.value = true;
  form.value = formTemp || {};
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

const props = defineProps<IUserDialogFormProps>();

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
            label="昵称"
            prop="nickname"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                asyncValidator: Validate.nickname.validator
              }
            ]"
          >
            <el-input
              v-model="form.nickname"
              clearable
              placeholder="请输入昵称"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="用户名"
            prop="username"
            :rules="[
              {
                trigger: 'blur',
                asyncValidator: Validate.username.canNullValidator
              }
            ]"
          >
            <el-input
              v-model="form.username"
              clearable
              placeholder="请输入用户名"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="邮箱"
            prop="email"
            :rules="[
              {
                trigger: 'blur',
                asyncValidator: Validate.email.canNullValidator
              }
            ]"
          >
            <el-input v-model="form.email" clearable placeholder="请输入邮箱" />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="手机号"
            prop="phone"
            :rules="[
              {
                trigger: 'blur',
                asyncValidator: Validate.phone.canNullValidator
              }
            ]"
          >
            <el-input
              v-model="form.phone"
              clearable
              placeholder="请输入手机号"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="微信appId" prop="wxAppId">
            <el-input
              v-model="form.wxAppId"
              clearable
              placeholder="请输入微信appId"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="微信unionId" prop="wxUnionId">
            <el-input
              v-model="form.wxUnionId"
              clearable
              placeholder="请输入微信unionId"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="微信openId" prop="wxOpenId">
            <el-input
              v-model="form.wxOpenId"
              clearable
              placeholder="请输入微信openId"
            />
          </el-form-item>
        </re-col>

        <re-col v-if="!form.id" :value="12" :xs="24" :sm="24">
          <el-form-item
            label="密码"
            prop="password"
            :rules="[
              {
                trigger: 'blur',
                asyncValidator: Validate.password.canNullValidator
              }
            ]"
          >
            <el-input
              v-model="form.password"
              clearable
              placeholder="请输入密码"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="后台登录" prop="manageSignInFlag">
            <re-segmented
              :modelValue="form.manageSignInFlag ? 0 : 1"
              :options="yesOrNoOptions"
              @change="
                ({ option: { value } }) => {
                  form.manageSignInFlag = value;
                }
              "
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="状态" prop="enableFlag">
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

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="个人简介" prop="bio">
            <el-input
              v-model="form.bio"
              clearable
              placeholder="请输入个人简介"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
            />
          </el-form-item>
        </re-col>

        <re-col>
          <el-form-item label="关联角色" prop="roleIdSet">
            <el-select
              v-model="form.roleIdSet"
              placeholder="请选择"
              class="w-full"
              clearable
              multiple
              filterable
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="item in props.roleDictList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
                {{ item.name }}
              </el-option>
            </el-select>
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
