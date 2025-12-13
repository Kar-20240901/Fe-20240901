import type { VNode } from "vue";
import { ElMessage, ElMessageBox, type MessageType } from "element-plus";

export function ToastSuccess(msg: string | VNode, duration: number = 5000) {
  if (!msg) {
    return;
  }

  ElMessage.success({
    message: msg,
    duration
  });
}

export function Toast(
  type: MessageType,
  msg: string | VNode,
  duration: number = 5000,
  plain: boolean = false,
  showClose: boolean = false
) {
  if (!msg) {
    return;
  }

  ElMessage({
    type,
    message: msg,
    duration,
    plain,
    showClose
  });
}

export function ToastInfo(
  msg: string | VNode,
  duration: number = 5000,
  plain: boolean = false,
  showClose: boolean = false
) {
  if (!msg) {
    return;
  }

  ElMessage.info({
    message: msg,
    duration,
    plain,
    showClose
  });
}

export function ToastWarning(msg: string | VNode, duration: number = 5000) {
  if (!msg) {
    return;
  }

  ElMessage.warning({
    message: msg,
    duration
  });
}

export function ToastError(msg: string | VNode, duration: number = 8000) {
  if (!msg) {
    return;
  }

  ElMessage.error({
    message: msg,
    duration
  });
}

// 注意：【confirmFun】和【cancelFun】，如果是 http请求，则需要 return http 请求，如果不是 Promise，则在方法前面加 async，即可
export function ExecConfirm(
  confirmFun: () => Promise<any>,
  cancelFun?: () => Promise<any>,
  msg?: string | VNode,
  resolve?: (value?: any) => void,
  reject?: (reason?: any) => void
) {
  ElMessageBox({
    title: "提示",
    message: msg,
    showCancelButton: true,
    type: "warning",
    boxType: "confirm",
    showClose: false,
    closeOnPressEscape: false,
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        instance.confirmButtonDisabled = true;

        if (confirmFun) {
          confirmFun()
            .then(() => {
              done(); // 关闭
              if (resolve) {
                resolve();
              }
            })
            .catch(() => {
              done(); // 关闭
              if (reject) {
                reject();
              }
            });
        } else {
          done(); // 关闭
          if (resolve) {
            resolve();
          }
        }
      } else {
        if (cancelFun) {
          cancelFun()
            .then(() => {
              done(); // 关闭
              if (reject) {
                reject();
              }
            })
            .catch(() => {
              done(); // 关闭
              if (reject) {
                reject();
              }
            });
        } else {
          done(); // 关闭
          if (reject) {
            reject();
          }
        }
      }
    }
  });
}

// 注意：【confirmFun】和【cancelFun】，如果是 http请求，则需要 return http 请求，如果不是 Promise，则在方法前面加 async，即可
export function ExecConfirmPromise(
  confirmFun: () => Promise<void>,
  cancelFun?: () => Promise<void>,
  msg?: VNode
) {
  return new Promise<any>((resolve, reject) => {
    ExecConfirm(confirmFun, cancelFun, msg, resolve, reject);
  });
}
