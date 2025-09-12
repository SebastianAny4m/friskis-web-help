import { sendPostRequestAsync } from './util/dql-post-request.js';
import { constants } from './constants.js';

const copyCollections = async () => {
  const collectionsToCopy = [
    {
      SKIP: true,
      name: 'user'
    },
    {
      SKIP: false,
      name: 'ChatGroup'
    },
    {
      SKIP: true,
      name: 'ChatMessage'
    },
    {
      SKIP: false,
      name: 'CommunicationGroup'
    },
    {
      SKIP: false,
      name: 'CommunicationGroupContent'
    },
    {
      SKIP: true,
      name: 'Comment'
    },
    {
      SKIP: true,
      name: 'Notification'
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

      data.forEach(d => {
        delete d['@Metadata'];
        delete d['@Attachments'];
      });

      if (collection.name === 'ChatGroup') {
        data.forEach(d => {
          if (d.customName && d.customName != null) {
            d.customName = '[UAT] ' + d.customName;
          }
        });
      }

      if (collection.name === 'CommunicationGroup' || collection.name === 'CommunicationGroupContent') {
        data.forEach(d => {
          if (d.title && d.title != null) {
            d.title = '[UAT] ' + d.title;
          }
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
      [collection.name]: {
        sort: {
          field: "@Created",
          order: "desc"
        },
        paging: {
          skip: 0,
          take: 5000
        }
      }
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

// const deleteCollection = async (collection, apiKey) => {
//   const body = {
//     delete: {
//       [collection.name]: {
//         filter: {
//           dwadawfesfs: {
//             "$exists": false
//           }
//         }
//       }
//     }
//   }
//   const res = await sendPostRequestAsync({ bodyData: body, API_KEY: apiKey, returnResponse: true });

//   if (res.data) {
//     return res.data
//   } else {
//     throw new Error(`Error when trying to delete collection "${collection}"`)
//   }
// }

await copyCollections();