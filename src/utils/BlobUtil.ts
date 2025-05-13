import type { IWebSocketMessage } from "@/utils/webSocket/WebSocketHelper";

/**
 * 数组，格式：json长度 + json + byte数组，返回 {data:Object, blob:Blob}
 */
export function ToDataAndByteArr(data: ArrayBuffer): IWebSocketMessage<any> {
  let res: IWebSocketMessage<any> = {};

  if (data === null || data.byteLength <= 0) {
    return res;
  }

  // 将接收到的二进制数据转换为Uint8Array
  const uint8Array = new Uint8Array(data);

  // 提取前4个字节并转换为整数
  const intValue = new DataView(uint8Array.buffer, 0, 4).getInt32(0, true);

  // 提取UTF-8字符串部分
  const utf8Bytes = uint8Array.slice(4, intValue);
  const decoder = new TextDecoder("utf-8");
  const utf8String = decoder.decode(utf8Bytes);

  // 提取剩余二进制数据
  const binaryArray = uint8Array.slice(4 + intValue);

  res = JSON.parse(utf8String);

  res.arrayBuffer = binaryArray.buffer;

  return res;
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
    reader.readAsDataURL(blob);
    reader.onload = e => {
      resolve(e.target.result as string);
    };
    reader.onerror = () => {
      reject(new Error("读取 Blob 时出错"));
    };
  });
}

/**
 * base64转 blob
 */
export function Base64ToBlob(base64, contentType = "") {
  const sliceSize = 512;
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
