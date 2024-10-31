<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";
import { deviceDetection } from "@pureadmin/utils";

defineOptions({
  name: "AccountManagement"
});

const passwordIndex = 0;
const emailIndex = 1;

const list = ref([
  {
    title: "账户密码",
    button: "修改"
  },
  {
    title: "绑定邮箱",
    illustrate: "",
    button: ""
  }
]);

function onClick(item) {
  message("请根据具体业务自行实现", { type: "success" });
}
</script>

<template>
  <div
    :class="[
      'min-w-[180px]',
      deviceDetection() ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">账户管理</h3>
    <div v-for="(item, index) in list" :key="index">
      <div class="flex items-center">
        <div class="flex-1">
          <p>{{ item.title }}</p>
          <el-text v-if="item.illustrate" class="mx-1" type="info"
            >{{ item.illustrate }}
          </el-text>
        </div>
        <el-button
          v-if="item.button"
          type="primary"
          text
          @click="onClick(index)"
        >
          {{ item.button }}
        </el-button>
      </div>
      <el-divider />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  border-top: 0.1px var(--el-border-color) var(--el-border-style);
}
</style>
