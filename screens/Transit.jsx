import React from 'react';
// import { useTheme } from '@react-navigation/native';
// import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import FUNowMapView from '../components/CustomMapView';

export default function Transit() {
  // const [shuttleData, shuttleLoad, shuttleFetch] = useDataLoadFetchCache(
  //   'https://cs.furman.edu/~csdaemon/FUNow/shuttleGet.php',
  //   'DATA:Shuttle-Cache',
  //   (data) => data,
  // );

  // const [stopsData, stopsLoad, stopsFetch] = useDataLoadFetchCache(
  //   'https://cs.furman.edu/~csdaemon/FUNow/busStopsGet.php',
  //   'DATA:Bus-Stops-Cache',
  //   (data) => data,
  // );

  return (
    <FUNowMapView
      zoom={0.5}
    />
  );
}
