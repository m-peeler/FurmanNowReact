import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function notEmpty(data) {
  return data !== undefined && (!Array.isArray(data) || data.length !== 0)
  && (!(typeof data === 'object' && !Array.isArray(data) && data !== null) || Object.keys(data).length !== 0);
}

export default function useDataLoadFetchCache(
  fetchFrom,
  cacheTo,
  processFetch = (data) => data,
  discardCache = () => false,
) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [exists, setExists] = useState(false);

  const storeCache = (resp) => {
    AsyncStorage.setItem(cacheTo, JSON.stringify(resp))
      .catch((e) => console.log(e));
  };

  const processedFetch = async () => {
    try {
      const resp = await fetch(fetchFrom);
      const jsonResp = await resp.json();
      if (jsonResp === null) return;
      const fetched = processFetch(jsonResp);
      if (notEmpty(fetched)) {
        setData(fetched);
        setFetching(false);
        storeCache(jsonResp);
      }
    } catch (error) { console.log('1', error); }
  };

  const processedLoad = async () => {
    try {
      const cache = await AsyncStorage.getItem(cacheTo);
      const parsed = await JSON.parse(cache);
      const processed = processFetch(parsed);
      if (processed && discardCache(processed)) {
        AsyncStorage.removeItem(cacheTo)
          .catch((e) => console.log(e));
      } else if (notEmpty(processed)) {
        setData(processed);
        setLoading(false);
      }
    } catch (e) {
      console.log('2', e);
    }
  };

  useEffect(() => {
    async function loadFetch() {
      await processedLoad();
      await processedFetch();
    }
    loadFetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setExists(!loading || !fetching);
  }, [loading, fetching]);

  return [data, loading, fetching, exists, () => processedFetch()];
}
