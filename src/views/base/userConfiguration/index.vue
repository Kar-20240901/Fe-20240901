<script setup lang="ts">
import { onMounted, ref } from "vue";
import { enableFlagOptions } from "@/model/enum/base/enableFlagEnum";
import {
  baseUserConfigurationInfoById,
  baseUserConfigurationInsertOrUpdate,
  BaseUserConfigurationInsertOrUpdateDTO
} from "@/api/http/base/BaseUserConfigurationController";
import ReCol from "@/components/ReCol";
import ReSegmented from "@/components/ReSegmented/src";
import { ToastSuccess } from "@/utils/ToastUtil";

defineOptions({
  name: "BaseUserConfiguration"
});

const formRef = ref();
const form = ref<BaseUserConfigurationInsertOrUpdateDTO>({});
const loading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);

onMounted(() => {
  infoById();
});

function infoById() {
  loading.value = true;
  baseUserConfigurationInfoById()
    .then(res => {
      form.value = res.data;
      formRef.value?.clearValidate();
    })
    .finally(() => {
      loading.value = false;
    });
}

function confirmClick() {
  formRef.value.validate().then(valid => {
    if (!valid) {
      return;
    }

    confirmLoading.value = true;

    baseUserConfigurationInsertOrUpdate(form.value)
      .then(res => {
        ToastSuccess(res.msg);
        infoById();
      })
      .finally(() => {
        confirmLoading.value = false;
      });
  });
}
</script>

<template>
  <el-form
    ref="formRef"
    v-loading="loading"
    :model="form"
    label-width="auto"
    class="bg-bg_color px-8 pt-[12px]"
  >
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="用户名注册" prop="userNameSignUpEnable">
          <re-segmented
            :modelValue="form.userNameSignUpEnable ? 0 : 1"
            :options="enableFlagOptions"
            @change="
              ({ option: { value } }) => {
                form.userNameSignUpEnable = value;
              }
            "
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="邮箱注册" prop="emailSignUpEnable">
          <re-segmented
            :modelValue="form.emailSignUpEnable ? 0 : 1"
            :options="enableFlagOptions"
            @change="
              ({ option: { value } }) => {
                form.emailSignUpEnable = value;
              }
            "
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="手机号注册" prop="phoneSignUpEnable">
          <re-segmented
            :modelValue="form.phoneSignUpEnable ? 0 : 1"
            :options="enableFlagOptions"
            @change="
              ({ option: { value } }) => {
                form.phoneSignUpEnable = value;
              }
            "
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item>
          <el-button
            :loading="confirmLoading"
            type="primary"
            @click="confirmClick"
          >
            确定
          </el-button>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
