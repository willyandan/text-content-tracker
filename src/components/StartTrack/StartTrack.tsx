import { useCallback, useEffect, useState } from 'react';
import { getTabs } from '../../service';
import { initChain } from '../../service/blockChain';
import { initFile } from '../../service/file';

type Tab = {
  title: string;
  url: string;
  id: number;
};

export const StartTrack = () => {
  const [tabs, setTabs] = useState<Array<Tab>>([]);
  const [tab, setTab] = useState<Tab>();

  const getChromeTabs = useCallback(async () => {
    const chromeTabs = await getTabs();
    const tabs = chromeTabs.map(({ title, id, url }) => ({
      title: title || 'Aba sem nome',
      id: id || 0,
      url: url || '',
    }));
    setTabs(tabs);
    setTab(tabs[0]);
  }, []);

  useEffect(() => {
    getChromeTabs();
  }, [getChromeTabs]);

  const handleSubmit = async (prop: React.FormEvent<HTMLElement>) => {
    prop.preventDefault();
    if (tab) {
      const file = await initFile({
        title: tab?.title,
        date: new Date(),
        url: tab?.url,
      });
      const blockHash = await initChain(file);
      console.log(blockHash);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white">
          Vamos começar?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Para começar escolha a aba em que você vai redigir seu texto!
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 dark:text-white"
              >
                Abas
              </label>
            </div>
            <div className="mt-2">
              <select
                id="password"
                name="password"
                onChange={prop => {
                  setTab(tabs[Number(prop.target.value)]);
                }}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {tabs.map((tab, i) => (
                  <option key={i} value={i}>
                    {tab.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Começar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
