<script setup lang="ts">
import dayjs from "dayjs";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import FaCheckCircle from "~icons/fa/check-circle";

defineOptions({
  name: "Welcome"
});

const today = dayjs();
</script>

<template>
  <div class="flex flex-col fade-in">
    <div class="mb-8">
      <div class="text-[clamp(1.5rem,3vw,2rem)] font-bold">仪表盘</div>
      <div class="text-gray-600 mt-1">
        欢迎回来，今天是 {{ today.year() }}年{{ today.month() + 1 }}月{{
          today.date()
        }}日，{{ today.format("dddd") }}
      </div>
    </div>

    <div
      class="bg-light-card rounded-xl p-6 shadow-soft card-hover gradient-bg"
    >
      <div class="flex items-center justify-between mb-6">
        <div class="text-lg font-semibold">服务器状态</div>
        <div
          class="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium"
        >
          <component :is="useRenderIcon(FaCheckCircle)" class="mr-1" />
          运行中
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm text-gray-600">CPU 使用率</div>
            <div class="text-sm font-medium">28%</div>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-cpu rounded-full" style="width: 28%" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm text-gray-600">内存使用率</div>
            <div class="text-sm font-medium">64%</div>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-mem rounded-full" style="width: 64%" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm text-gray-600">磁盘使用率</div>
            <div class="text-sm font-medium">42%</div>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-disk rounded-full" style="width: 42%" />
          </div>
        </div>

        <div class="pt-4 flex items-center justify-between">
          <div class="text-sm text-gray-600">正常运行时间</div>
          <div class="text-sm font-medium">16 天 8 小时</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gradient-bg {
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-translate-x: 0;

  background-image: linear-gradient(
    to bottom right,
    rgb(79 70 229 / 5%),
    rgb(16 185 129 / 5%)
  );
}

.card-hover {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 400ms;
  transition-property: all;
}

.shadow-soft {
  --tw-shadow: 0 4px 20px rgb(0 0 0 / 5%);
  --tw-shadow-colored: 0 4px 20px var(--tw-shadow-color);

  box-shadow:
    var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
}

.bg-light-card {
  --tw-bg-opacity: 1;

  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}

.card-hover:hover {
  --tw-translate-y: -0.25rem;
  --tw-shadow: 0 8px 30px rgb(0 0 0 / 12%);
  --tw-shadow-colored: 0 8px 30px var(--tw-shadow-color);

  box-shadow:
    var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.bg-mem {
  --tw-bg-opacity: 1;

  background-color: rgb(245 158 11 / var(--tw-bg-opacity, 1));
}

.bg-disk {
  --tw-bg-opacity: 1;

  background-color: rgb(16 185 129 / var(--tw-bg-opacity, 1));
}

.bg-cpu {
  --tw-bg-opacity: 1;

  background-color: rgb(79 70 229 / var(--tw-bg-opacity, 1));
}
</style>
