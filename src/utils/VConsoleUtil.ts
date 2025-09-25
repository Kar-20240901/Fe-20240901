import VConsole from "vconsole";
import { storageLocal } from "@/store/utils";
import LocalStorageKey from "@/model/constant/LocalStorageKey";

let vConsole: VConsole | null = null;

export function OpenVConsole() {
  DestroyVConsole(); // 先销毁，再打开

  vConsole = new VConsole(); // 打开控制台
}

export function DestroyVConsole() {
  vConsole?.destroy(); // 销毁控制台
}

export function InitVConsole() {
  const consoleOpenFlag = storageLocal().getItem(
    LocalStorageKey.CONSOLE_OPEN_FLAG
  );

  if (consoleOpenFlag === "1") {
    OpenVConsole();
  }
}
