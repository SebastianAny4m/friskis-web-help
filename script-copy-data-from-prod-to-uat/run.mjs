import { sendPostRequestAsync } from './util/dql-post-request.js';
import { constants } from './constants.js';

const copyCollections = async () => {
  const collectionsToCopy = [{
    SKIP: true,
    name: 'ChatGroup',
    copyMetadata: false,
    copyAttachments: false,
    deleteOldUATData: false
  },
  {
    SKIP: true,
    name: 'ChatMessage',
    copyMetadata: false,
    copyAttachments: false,
    deleteOldUATData: false
  },
    {
    SKIP: true,
    name: 'CommunicationGroup',
    copyMetadata: false,
    copyAttachments: false,
    deleteOldUATData: false
  },
    {
    SKIP: true,
    name: 'CommunicationGroupContent',
    copyMetadata: false,
    copyAttachments: false,
    deleteOldUATData: false
  },
    {
    SKIP: true,
    name: 'Comment',
    copyMetadata: false,
    copyAttachments: false,
    deleteOldUATData: false
  },
  {
    SKIP: true,
    name: 'Notification',
    copyMetadata: false,
    copyAttachments: false,
    deleteOldUATData: false
  }
]

  const tasks = collectionsToCopy.map(async (collection) => {
    if (collection.SKIP) {
      console.log(`Skipping collection ${collection.name}`);
      return;
    }
    try {
      const data = await getCollection(collection, constants.API_KEY_PROD)

      if (!data || data.length < 6) {
        console.warn("Stopping - fetched data is too small, something is wrong");
        process.exit(1);
      }
      if (!collection.copyMetadata) {
        data.forEach(d => {
          delete d['@Metadata'];
        });
      }
      if (!collection.copyAttachments) {
        data.forEach(d => {
          delete d['@Attachments'];
        });
      }
      // console.log(JSON.stringify(data, null, 2));

      mutateCollection(collection, constants.API_KEY_UAT, data)
      console.log(`Collection ${collection.name} copied, items: ${data.length}`);

    } catch (err) {
      console.error(err);
    }
  });
}

const getCollection = async (collection, apiKey) => {
  const body = {
    query: {
      [collection.name]: {}
    }
  }
  const res = await sendPostRequestAsync({ bodyData: body, API_KEY: apiKey, returnResponse: true });

  if (res.data) {
    return res.data
  } else {
    throw new Error(`Error when trying to get collection "${collection}"`)
  }
}

const mutateCollection = async (collection, apiKey, data) => {
  const body = {
    mutate: {
      [collection.name]: data
    }
  }
  const res = await sendPostRequestAsync({ bodyData: body, API_KEY: apiKey, returnResponse: true });

  if (res.data) {
    return res.data
  } else {
    throw new Error(`Error when trying to get collection "${collection}"`)
  }
}

const deleteCollection = async (collection, apiKey) => {
  const body = {
    delete: {
      [collection.name]: {
        filter: {
          dwadawfesfs: {
            "$exists": false
          }
        }
      }
    }
  }
  const res = await sendPostRequestAsync({ bodyData: body, API_KEY: apiKey, returnResponse: true });

  if (res.data) {
    return res.data
  } else {
    throw new Error(`Error when trying to delete collection "${collection}"`)
  }
}

await copyCollections();