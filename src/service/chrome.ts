export const getTabs = () => {
  return chrome.tabs.query({});
};

export const getLocalStorage = async <T>(key: string): Promise<T> => {
  const value = await chrome.storage.local.get(key);
  return value as T;
};

export const setLocalStorage = async <T>(
  key: string,
  value: T
): Promise<void> => {
  return chrome.storage.local.set({ [key]: JSON.stringify(value) });
};

export const getSessionStorage = async <T>(key: string): Promise<T> => {
  const value = await chrome.storage.session.get(key);
  return value as T;
};
