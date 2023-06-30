import {
  BackgroundMessage,
  BackgroundMutation,
  BackgroundState,
} from '../context/background';
import { Context } from '../context/context';
import { sendSetupContent } from '../context/logger';
import { File } from '../model';
import { addBlock } from '../service/blockChain';
import { getFiles } from '../service/file';
import { sanitizeUrl } from '../utils';

const getFileByPort = async (
  port: chrome.runtime.Port
): Promise<File | undefined> => {
  const files = await getFiles();
  const url = port.sender?.tab?.url || '';
  const sanitizedUrl = sanitizeUrl(url);
  return files.find(file => file.url === sanitizedUrl);
};

const context: Context<BackgroundState, BackgroundMutation> = {
  props: {
    copyOrigin: '',
  },
  mutation: {
    SET_COPY_ORIGIN: (payload, props, port) => {
      return { ...props, copyOrigin: payload.copyOrigin };
    },
    GET_FULL_BODY: async (payload, props, port) => {
      //do a commit
      const { body, pasteEvent } = payload;
      const file = await getFileByPort(port);
      if (!file) {
        console.error('FILE NOT FOUND');
        return { ...props };
      }
      console.log({ body, pasteEvent });

      await addBlock(file, {
        content: body,
        date: new Date(),
        hasPasteContent: pasteEvent,
        pasteContentOrigin: pasteEvent ? props.copyOrigin : undefined,
      });

      return {
        ...props,
        copyOrigin: pasteEvent ? undefined : props.copyOrigin,
      };
    },
  },
};

const handleSetupContent = async (port: chrome.runtime.Port) => {
  const tab = port.sender?.tab;
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const isTabActive = tab?.id === activeTab.id;
  const file = await getFileByPort(port);
  sendSetupContent(
    {
      tabId: port.sender?.tab?.id || 0,
      isTabActive,
      lastBodyHash: undefined,
      isFileTab: !!file,
    },
    port
  );
};

const main = async () => {
  chrome.runtime.onConnect.addListener(async port => {
    console.log('connected');
    await handleSetupContent(port);
    port.onMessage.addListener(async message => {
      const msg = message as BackgroundMessage;
      console.log('message received', msg.action);
      if (context.mutation[msg.action]) {
        context.props = await context.mutation[msg.action](
          msg.payload,
          context.props,
          port
        );
      } else {
        throw new Error('Action not found');
      }
    });
  });
};
main();
