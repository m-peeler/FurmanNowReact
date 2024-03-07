import arrayPartition from '../utilities/ArrayFunctions';
import useDataLoadFetchCache from './useDataLoadFetchCache';

const processContactsResponse = (resp) => {
  if (!('results' in resp)) return null;
  const partitioned = arrayPartition(resp.results, ((item) => item.priorityLevel >= 99));
  const contacts = [{
    key: true,
    value: partitioned.true,
  },
  {
    key: false,
    value: partitioned.false,
  }];
  return contacts;
};

export default function useContacts() {
  return useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/contactsGet.php',
    'DATA:Contacts-Cache',
    processContactsResponse,
  );
}
