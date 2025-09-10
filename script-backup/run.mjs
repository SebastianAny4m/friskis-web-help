import { sendPostRequestAsync } from './util/dql-post-request.js';
import fs from 'fs';
import path from 'path';

const runBackup = async () => {
  const collectionsToDownload = ['user', 'CommunicationGroup','Comment', 'ChatGroup', 'ChatMessage', 'NewsPostUmbraco']

  const backupDir = './script-backup/backups'
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)
  fs.mkdirSync(backupDir, { recursive: true });

  const tasks = collectionsToDownload.map(async (collection) => {
    try {
      const data = await getCollection(collection)
      const fileName = path.join(backupDir, `${timestamp}-${collection.charAt(0).toUpperCase() + collection.slice(1)}.json`)
      fs.writeFileSync(fileName, JSON.stringify(data, null, 2))

      console.log(`✅ Backup of ${collection} collection saved to ${fileName}`)
    } catch (err) {
      console.error(`Failed to back up ${collection}:`, err?.message ?? err)
    }
  });

  await Promise.allSettled(tasks);
}

const getCollection = async (collection) => {
  const body = {
    query: {
      [collection]: {}
    }
  }
  const res = await sendPostRequestAsync({ bodyData: body, returnResponse: true });

  if (res.data) {
    return res.data
  } else {
    throw new Error(`Error when trying to get collection "${collection}"`)
  }
}

await runBackup();