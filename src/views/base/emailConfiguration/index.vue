<script setup lang="ts">
import { onMounted, ref } from "vue";
import ReCol from "@/components/ReCol";
import {
  BaseEmailConfigurationDO,
  baseEmailConfigurationInfoById
} from "@/api/http/base/BaseEmailConfigurationController";
import { Validate } from "@/utils/ValidatorUtil";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import ReSegmented from "@/components/ReSegmented/src";
import Info from "@iconify-icons/ri/information-line";

defineOptions({
  name: "BaseEmailConfiguration"
});

const formRef = ref();
const form = ref<BaseEmailConfigurationDO>({});
const loading = ref<boolean>(false);

onMounted(() => {
  loading.value = true;
  baseEmailConfigurationInfoById()
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
  <el-form ref="formRef" v-loading="loading" :model="form" label-width="auto">
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="正文前缀" prop="contentPre">
          <el-input
            v-model="form.contentPre"
            clearable
            placeholder="请输入正文前缀"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item
          label="端口"
          prop="port"
          :rules="[
            { required: true, message: '端口为必填项', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.port" clearable placeholder="请输入端口" />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item
          label="发送人邮箱"
          prop="port"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              asyncValidator: Validate.email.validator
            }
          ]"
        >
          <el-input
            v-model="form.port"
            clearable
            placeholder="请输入发送人邮箱"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="form.id" :value="24" :xs="24" :sm="24">
        <el-form-item prop="pass">
          <template #label>
            <span>发送人密码</span>
            <IconifyIconOffline
              v-tippy="{
                content: '不设值则不会修改密码，设值则会修改密码',
                placement: 'top'
              }"
              :icon="Info"
              class="ml-1"
            />
          </template>
          <el-input
            v-model="form.pass"
            clearable
            placeholder="请输入发送人密码"
          />
        </el-form-item>
      </re-col>

      <re-col v-else :value="24" :xs="24" :sm="24">
        <el-form-item
          prop="pass"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '发送人密码为必填项'
            }
          ]"
        >
          <template #label>
            <span>发送人密码</span>
          </template>
          <el-input
            v-model="form.pass"
            clearable
            placeholder="请输入发送人密码"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="使用SSL" prop="sslFlag">
          <re-segmented
            :modelValue="form.sslFlag ? 0 : 1"
            :options="enableFlagOptions"
            @change="
              ({ option: { value } }) => {
                form.sslFlag = value;
              }
            "
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
