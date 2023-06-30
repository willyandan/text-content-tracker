import { sendCopyOrigin, sendFullBody } from '../context/background';
import { Context } from '../context/context';
import { LoggerMessage, LoggerMutation, LoggerState } from '../context/logger';
import { simpleHash } from '../utils';

const context: Context<LoggerState, LoggerMutation> = {
  props: {
    tabId: 0,
    isTabActive: false,
    lastBodyHash: '',
    isFileTab: false,
  },
  mutation: {
    SETUP_CONTENT: (payload, props) => {
      const { tabId, isTabActive, isFileTab } = payload;
      const body = document.body.innerText;
      main(payload);

      return {
        ...props,
        tabId,
        isTabActive,
        lastBodyHash: simpleHash(body),
        isFileTab,
      };
    },
    UPDATE_LAST_BODY_HASH(payload, props, port) {
      const { lastBodyHash } = payload;
      return { ...props, lastBodyHash };
    },
  },
};

const mutateContext = (message: LoggerMessage) => {
  context.props = context.mutation[message.action](
    message.payload,
    context.props,
    port
  );
};

const port = chrome.runtime.connect({ name: 'logger' });
port.onMessage.addListener(message => {
  const msg = message as LoggerMessage;
  if (context.mutation[msg.action]) {
    console.log(msg.action);
    mutateContext(msg);
  } else {
    throw new Error('Action not found');
  }
});

const handleCopy = () => {
  sendCopyOrigin({ copyOrigin: document.URL }, port);
};

const handlePaste = () => {
  if (context.props.isFileTab) {
    const body = document.body.innerText;
    const actualHash = simpleHash(body);
    sendFullBody({ body, pasteEvent: true }, port);
    mutateContext({
      action: 'UPDATE_LAST_BODY_HASH',
      payload: { lastBodyHash: actualHash },
    });
  }
};

const main = (props: LoggerState) => {
  let interval: NodeJS.Timer;
  if (props.isFileTab) {
    document.addEventListener('paste', handlePaste);
    setInterval(() => {
      if (context.props.isTabActive) {
        const body = document.body.innerText;
        const actualHash = simpleHash(body);
        if (actualHash !== context.props.lastBodyHash) {
          sendFullBody({ body, pasteEvent: false }, port);
          mutateContext({
            action: 'UPDATE_LAST_BODY_HASH',
            payload: { lastBodyHash: actualHash },
          });
        }
      }
    }, 500);
  }

  document.addEventListener('copy', handleCopy);
  document.addEventListener('cut', handleCopy);

  port.onDisconnect.addListener(() => {
    document.removeEventListener('copy', handleCopy);
    document.removeEventListener('cut', handleCopy);
    if (context.props.isFileTab) {
      clearInterval(interval);
      document.removeEventListener('paste', handlePaste);
    }
  });
};
