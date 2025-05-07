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
