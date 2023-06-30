export type LoggerState = {
  tabId: number;
  isTabActive: boolean;
  lastBodyHash?: string;
  isFileTab: boolean;
};

export interface LoggerMutation {
  SETUP_CONTENT: (
    payload: LoggerState,
    props: LoggerState,
    port: chrome.runtime.Port
  ) => LoggerState;
  UPDATE_LAST_BODY_HASH: (
    payload: { lastBodyHash: string },
    props: LoggerState,
    port: chrome.runtime.Port
  ) => LoggerState;
}

export interface LoggerMessage {
  action: keyof LoggerMutation;
  payload: any;
}

const sendMessageToLogger = (
  action: keyof LoggerMutation,
  payload: any,
  port: chrome.runtime.Port
) => {
  return port.postMessage({ action, payload });
};

export const sendSetupContent = (
  payload: Parameters<LoggerMutation['SETUP_CONTENT']>[0],
  port: chrome.runtime.Port
) => {
  sendMessageToLogger('SETUP_CONTENT', payload, port);
};
