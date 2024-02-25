import { useEffect, useState } from "react";

export default function useDataLoadFetchCache(
        fetchFrom, 
        cacheTo, 
        processFetch = async (data) => await data.json(), 
        discardCache = (cache) => false) 
{
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(true)
    
    const fetchData = async () => {
        try {
            const resp = await fetch(fetchFrom);
            const fetched = await processFetch(resp);
            setData(fetched);
            setFetching(false);
        } catch (e) { console.log(e)}
        // Upon successful retrieval, stores data
        // locally so it can be used even when not connected
        // to internet.
    }

    const loadCache = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(cacheTo);
            const data = jsonValue != null ? JSON.parse(jsonValue) : null;
            if (data && discardCache(data)) {
                await AsyncStorage.removeItem(cacheTo);
            } else {
                setData(data);
                setLoading(false);
            }
        } catch (e) {}
    }

    const storeCache = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(cacheTo, jsonValue);
        } catch (e) {}
    }

    useEffect(() => {
        loadCache();
        fetchData();
        storeCache(data);
    }, []);

    return [data, loading, fetching];
}