import { sendPostRequestAsync } from './util/dql-post-request.js';
import fs from 'fs';
import path from 'path';

const runBackup = async () => {
  const collectionsToDownload = ['CommunicationGroupContent']

  const backupDir = './script-backup/backups'
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)
  fs.mkdirSync(backupDir, { recursive: true });

  const tasks = collectionsToDownload.map(async (collection) => {
    try {
      const data = await getCollection(collection)
      const CommunicationGroups = await getCollection('CommunicationGroup')

      const RecentContent = data.filter(content => {
        if (content.publish?.date) {
          const createdDate = new Date(content.publish?.date);
          return createdDate > new Date('2025-09-26');
        }
        return false;
      });

      RecentContent.forEach(content => {
        const group = CommunicationGroups.find(g => g.eid === content.groupEid);
        if (group) {
          content.groupTitle = group.title;
          content.groupMemberCount = group.members.length;
        }
      });

      const top = RecentContent.sort((a, b) => new Date(b.publish.date) - new Date(a.publish.date)).slice(0, 30);
      console.log(`\CommunicationGroupContent items since 2025-09-26:`);
      top.forEach(item => {
        const swedenDate = new Date(item.publish.date);
        const createdDateISO = swedenDate.toISOString().replace('T', ' ').slice(0, 16);
        const sizeEmoji = item.groupMemberCount > 100 ? '🔥' : '';
        console.log(`- Published Date: ${createdDateISO} - Title: ${item.title}`);
        console.log(`  Group Members: ${sizeEmoji + item.groupMemberCount || 0} - Group Title: ${item.groupTitle || 'N/A'}`);
        console.log('')
      });

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