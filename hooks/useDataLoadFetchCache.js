import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    const processedLoad = async () => {
      try {
        const cache = await AsyncStorage.getItem(cacheTo);
        const parsed = processFetch(JSON.parse(cache));
        if (parsed && discardCache(parsed)) {
          AsyncStorage.removeItem(cacheTo)
            .catch((e) => console.log(e));
        } else if (fetching && parsed.length !== 0) {
          setData(parsed);
          setLoading(false);
        }
      } catch (e) {
        console.log('2', e);
      }
    };

    const storeCache = (resp) => {
      AsyncStorage.setItem(cacheTo, JSON.stringify(resp))
        .catch((e) => console.log(e));
    };

    const processedFetch = async () => {
      try {
        const resp = await fetch(fetchFrom);
        const jsonResp = await resp.json();
        const fetched = processFetch(jsonResp);
        if (fetched != null
            && (!Array.isArray(fetched) || fetched.length !== 0)
            && (Object.keys(fetched).length !== 0)) {
          setData(fetched);
          setFetching(false);
          storeCache(jsonResp);
        }
      } catch (error) { console.log('1', error); }
    };

    async function loadFetch() {
      await processedLoad();
      await processedFetch();
    }
    loadFetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setExists(true);
  }, [loading, fetching]);

  return [data, loading, fetching, exists];
}
