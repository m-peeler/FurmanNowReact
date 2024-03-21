import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import arrayPartition from '../utilities/ArrayFunctions';
import { EventsDisplay } from '../components/EventsDisplay';

export default function Events() {
  const [data] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/clpGet.php',
    'DATA:Events-Cache',
    (dt) => Object.entries(arrayPartition(dt.results, ({ eventType }) => {
      switch (eventType) {
        case 'CLP':
          return 'CLPs';
        case 'syncDIN':
          return 'Other Events';
        default:
          return 'Other Events';
      }
    })).sort((a, b) => {
      // Puts the CLPs page first.
      if (a[0] === 'CLPs' && b[0] === 'CLPs') return 0;
      if (a[0] === 'CLPs') return -1;
      if (b[0] === 'CLPs') return 1;
      return a[0].localeCompare(b[0]);
    }),
  );
  const [delayed, setDelayed] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDelayed(true);
    }, 450);
    return () => clearInterval(interval);
  }, []);
  const { height, width } = Dimensions.get('window');
  return (
    <SafeAreaView style={{ margin: 8 }}>
      {(data)
        && (
        <Carousel
          loop={false}
          snapEnabled
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxAdjacentItemScale: 0.9,
            parallaxScrollingOffset: 100,
          }}
          data={delayed ? data : [data[0]]}
          renderItem={({ item }) => <EventsDisplay name={item[0]} events={item[1]} />}
          width={width}
          height={height}
          style={{ alignSelf: 'center', width, height }}
          panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
        />
        )}
    </SafeAreaView>
  );
}
