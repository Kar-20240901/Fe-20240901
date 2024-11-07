import type { FormInstance, FormItemProp } from "element-plus";
import { clone } from "@pureadmin/utils";
import { ref } from "vue";
import type { R } from "@/model/vo/R";

const isDisabled = ref(false);
const timer = ref(null);
const text = ref("");

export const useVerifyCode = () => {
  const start = async (
    formEl: FormInstance | undefined,
    props: FormItemProp,
    sendCodeFun: Promise<R<any>>,
    time = 60
  ) => {
    if (!formEl) return;
    const initTime = clone(time, true);
    await formEl.validateField(props, isValid => {
      if (!isValid) {
        return;
      }
      sendCodeFun.then(() => {
        clearInterval(timer.value);
        isDisabled.value = true;
        text.value = `${time}`;
        timer.value = setInterval(() => {
          if (time > 0) {
            time -= 1;
            text.value = `${time}`;
          } else {
            text.value = "";
            isDisabled.value = false;
            clearInterval(timer.value);
            time = initTime;
          }
        }, 1000);
      });
    });
  };

  const end = () => {
    text.value = "";
    isDisabled.value = false;
    clearInterval(timer.value);
  };

  return {
    isDisabled,
    timer,
    text,
    start,
    end
  };
};
