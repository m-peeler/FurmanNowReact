import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useDataLoadFetchCache(
        fetchFrom, 
        cacheTo, 
        processFetch = async (data) => await data.json(), 
        discardCache = (cache) => false) 
{
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(true);
    const [exists, setExists] = useState(false);
    
    const processedLoad = async () => {
        try {
            const cache = await AsyncStorage.getItem(cacheTo)
            const parsed = processFetch(JSON.parse(cache))
            if (parsed && discardCache(parsed)) {
                AsyncStorage.removeItem(cacheTo)
                    .catch(e => console.log(e))
            } else if (fetching && parsed.length != 0) {
                setData(parsed);
                console.log("cached:", parsed);
                setLoading(false);
            }
        } catch (e) {
            console.log("2", e);
        }
    }

    const processedFetch = async () => {
        try {
            const resp = await fetch(fetchFrom);
            const jsonResp = await resp.json();
            const fetched = processFetch(jsonResp);
            if (fetched != null && fetched != [] && fetched != {}) {
                await setData(fetched);
                setFetching(false);
                storeCache(jsonResp);
            }
        } catch (error) {console.log("1", error)}
    }

    const storeCache = (resp) => {
        AsyncStorage.setItem(cacheTo, JSON.stringify(resp))
                    .catch(e => console.log(e))
    }

    useEffect(() => {
        async function loadFetch() {
            await processedLoad();
            await processedFetch();   
        }
        loadFetch();
    }, []);

    useEffect(() => {
        setExists(true);
    }, [loading, fetching])

    return [data, loading, fetching, exists];
}