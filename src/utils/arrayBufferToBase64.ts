export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  const binary = bytes.reduce((binary, byte) => {
    return binary + String.fromCharCode(byte);
  }, '');
  return window.btoa(binary);
};
