export type BackgroundState = {
  copyOrigin?: string;
};

export interface BackgroundMutation {
  SET_COPY_ORIGIN: (
    payload: { copyOrigin: string },
    props: BackgroundState,
    port: chrome.runtime.Port
  ) => BackgroundState;
  GET_FULL_BODY: (
    payload: { body: string; pasteEvent: boolean },
    props: BackgroundState,
    port: chrome.runtime.Port
  ) => Promise<BackgroundState>;
}

export interface BackgroundMessage {
  action: keyof BackgroundMutation;
  payload: any;
}

const sendMessageToBackground = (
  action: keyof BackgroundMutation,
  payload: any,
  port: chrome.runtime.Port
) => {
  return port.postMessage({ action, payload });
};

export const sendCopyOrigin = (
  payload: Parameters<BackgroundMutation['SET_COPY_ORIGIN']>[0],
  port: chrome.runtime.Port
) => {
  sendMessageToBackground('SET_COPY_ORIGIN', payload, port);
};

export const sendFullBody = (
  payload: Parameters<BackgroundMutation['GET_FULL_BODY']>[0],
  port: chrome.runtime.Port
) => {
  sendMessageToBackground('GET_FULL_BODY', payload, port);
};
