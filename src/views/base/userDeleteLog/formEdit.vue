<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import { BaseUserDeleteLogDO } from "@/api/http/base/BaseUserDeleteLogController";
import { IUserDeleteLogDialogFormProps } from "@/views/base/userDeleteLog/types";
import { TempRequestCategoryOptions } from "@/model/enum/TempRequestCategoryEnum";

const form = ref<BaseUserDeleteLogDO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function editOpen(fun: Promise<R<any>>) {
  dialogLoading.value = true;
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
  editOpen
});

const props = defineProps<IUserDeleteLogDialogFormProps>();
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
          <el-form-item label="id" prop="id">
            <el-input v-model="form.id" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="微信openId" prop="wxOpenId">
            <el-input v-model="form.wxOpenId" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="微信appId" prop="wxAppId">
            <el-input v-model="form.wxAppId" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="注册终端" prop="signUpType">
            <el-select v-model="form.signUpType" class="w-full" disabled>
              <el-option
                v-for="(item, index) in TempRequestCategoryOptions"
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
          <el-form-item label="创建时间" prop="userCreateTime">
            <el-input v-model="form.userCreateTime" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="删除时间" prop="createTime">
            <el-input v-model="form.createTime" readonly />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
