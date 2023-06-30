export const connectDb = async (dbName: string): Promise<IDBDatabase> => {
  const request = indexedDB.open(dbName, 1);
  return new Promise((resolve, reject) => {
    request.onupgradeneeded = event => {
      const db = request.result;
      switch (event.oldVersion) {
        case 0:
          db.createObjectStore('blocks', { keyPath: 'lastBlockHash' });
          db.createObjectStore('files', { keyPath: 'url' });
          break;
      }
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const insertOnDB = <T>(db: IDBDatabase, tableName: string, item: T) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(tableName, 'readwrite');
    const blocks = transaction.objectStore(tableName);
    const request = blocks.add(item);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const updateOnDb = <T>(db: IDBDatabase, tableName: string, item: T) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(tableName, 'readwrite');
    const blocks = transaction.objectStore(tableName);
    const request = blocks.put(item);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const getAll = async <T>(
  db: IDBDatabase,
  tableName: string
): Promise<Array<T>> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(tableName, 'readonly');
    const blocks = transaction.objectStore(tableName);
    const request = blocks.getAll();
    request.onsuccess = () => {
      resolve(request.result as Array<T>);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};
