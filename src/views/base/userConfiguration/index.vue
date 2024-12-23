<script setup lang="ts">
import { onMounted, ref } from "vue";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import {
  baseUserConfigurationInfoById,
  BaseUserConfigurationInsertOrUpdateDTO
} from "@/api/http/base/BaseUserConfigurationController";
import ReCol from "@/components/ReCol";
import ReSegmented from "@/components/ReSegmented/src";

defineOptions({
  name: "BaseUserConfiguration"
});

const formRef = ref();
const form = ref<BaseUserConfigurationInsertOrUpdateDTO>({});
const loading = ref<boolean>(false);

onMounted(() => {
  loading.value = true;
  baseUserConfigurationInfoById()
    .then(res => {
      form.value = res.data;
      formRef.value?.clearValidate();
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>

<template>
  <el-form
    ref="formRef"
    v-loading="loading"
    :model="form"
    label-width="auto"
    class="bg-bg_color"
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
    </el-row>
  </el-form>
</template>
