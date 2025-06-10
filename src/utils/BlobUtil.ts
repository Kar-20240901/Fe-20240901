import type { IWebSocketMessage } from "@/utils/webSocket/WebSocketHelper";

/**
 * 处理：二进制数据
 */
function handleArrayBuffer(data: ArrayBuffer, res: IWebSocketMessage<any>) {
  // 将接收到的二进制数据转换为Uint8Array
  const uint8Array = new Uint8Array(data);

  // 提取前4个字节并转换为整数
  const intValue = new DataView(uint8Array.buffer, 0, 4).getInt32(0, true);

  // 提取UTF-8字符串部分
  const utf8Bytes = uint8Array.slice(4, intValue + 4);
  const decoder = new TextDecoder("utf-8");
  const utf8String = decoder.decode(utf8Bytes);

  // 提取剩余二进制数据
  const binaryArray = uint8Array.slice(4 + intValue);

  try {
    res = JSON.parse(utf8String);
    // console.log("res", res);

    res.arrayBuffer = binaryArray.buffer;
  } catch (e) {
    console.error("utf8String", utf8String);
  }

  return res;
}

/**
 * 数组，格式：json长度 + json + byte数组，返回 {data:Object, blob:Blob}
 */
export function ToDataAndByteArrForArrayBuffer(
  data: ArrayBuffer
): IWebSocketMessage<any> {
  let res: IWebSocketMessage<any> = {};

  if (data === null || data.byteLength <= 0) {
    return res;
  }

  handleArrayBuffer(data, res);

  return res;
}

/**
 * 数组，格式：json长度 + json + byte数组，返回 {data:Object, blob:Blob}
 */
export function ToDataAndByteArrForBlob(
  data: Blob
): Promise<IWebSocketMessage<any>> {
  return new Promise<IWebSocketMessage<any>>((resolve, reject) => {
    let res: IWebSocketMessage<any> = {};

    if (data === null || data.size <= 0) {
      return resolve(res);
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("读取 Blob 时出错"));
    };

    reader.onload = e => {
      res = handleArrayBuffer(e.target.result as ArrayBuffer, res);

      resolve(res);
    };

    reader.readAsArrayBuffer(data);
  });
}

/**
 * json和byte数组，组合为新数组，格式：json长度 + json + byte数组
 */
export function JsonAddByteArr(json: Object, data: Blob) {
  const jsonStr = JSON.stringify(json);

  const lengthBlob = IntToBlob(jsonStr.length);

  const jsonBlob = new Blob([jsonStr]);

  return new Blob([lengthBlob, jsonBlob, data]);
}

/**
 * int转 blob格式
 */
export function IntToBlob(num) {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setInt32(0, num, true);
  return new Blob([buffer], { type: "application/octet-stream" });
}

/**
 * blob转 base64
 */
export function BlobToBase64(blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      resolve((e.target.result as string).replace(/^data:.*?;base64,/, ""));
    };
    reader.onerror = () => {
      reject(new Error("读取 Blob 时出错"));
    };
    reader.readAsDataURL(blob);
  });
}

/**
 * base64转 blob
 */
export function Base64ToBlob(base64, contentType = "") {
  const uint8Array = Base64ToUint8Array(base64);

  return new Blob([uint8Array], { type: contentType });
}

/**
 * base64转 uint8Array
 */
export function Base64ToUint8Array(base64) {
  // 移除 Base64 字符串的前缀（如果存在）
  const pureBase64 = base64.replace(/^data:.*?;base64,/, "");
  // 解码 Base64 字符串
  const binaryString = atob(pureBase64);
  // 创建 Uint8Array 数组
  const uint8Array = new Uint8Array(binaryString.length);
  // 填充数组
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array;
}
