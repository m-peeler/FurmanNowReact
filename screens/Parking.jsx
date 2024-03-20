import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Polygon } from 'react-native-maps';
import { decode } from '@googlemaps/polyline-codec';
import FUNowMapView from '../components/CustomMapView';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';

class ParkingZone {
  constructor(
    name,
    boundryPolyline,
    yellow,
    green,
    blue,
    silver,
    orange,
    darkPurple,
    lightPurple,
    timeLimit,
    weekendsAllowed,
    eveningsAllowed,
  ) {
    this.name = name;
    this.boundry = decode(boundryPolyline).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
    this.yellow = yellow;
    this.green = green;
    this.blue = blue;
    this.silver = silver;
    this.orange = orange;
    this.darkPurple = darkPurple;
    this.lightPurple = lightPurple;
    this.timeLimit = timeLimit;
    this.weekendsAllowed = weekendsAllowed;
    this.eveningsAllowed = eveningsAllowed;
  }

  colors() {
    const cols = [];
    if (this.yellow) cols.push('#58582c');
    if (this.green) cols.push('#2c582c');
    if (this.blue) cols.push('#2c2c83');
    if (this.silver) cols.push('#838383');
    if (this.orange) cols.push('#dc832c');
    if (this.darkPurple) cols.push('#582c83');
    if (this.lightPurple) cols.push('8358dc');
    return cols.length > 0 ? cols : ['#58dc83'];
  }

  static parseZone(json) {
    return new ParkingZone(
      json.name,
      json.boundry,
      json.yellow === '1',
      json.green === '1',
      json.blue === '1',
      json.silver === '1',
      json.orange === '1',
      json.purple === '1',
      json.lightPurple === '1',
      parseInt(json.timeLimit, 10),
      json.allowedOnWeekends === '1',
      json.allowedAfter5 === '1',
    );
  }
}

export default function Parking() {
  const [parkingLots] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/parkingZonesGet.php',
    'DATA:Parking-Zones',
    (resp) => {
      const res = resp.results;
      if (res === undefined) return undefined;
      return res.map((zone) => ParkingZone.parseZone(zone));
    },
  );

  const [colorInd, setColorInd] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => { setColorInd(colorInd + 1); }, 5_000);
    return () => clearInterval(interval);
  }, [colorInd]);
  return (
    <View style={{ flex: 1 }}>
      <FUNowMapView>
        {parkingLots
          && parkingLots.map((zone) => <Polygon key={zone.name} coordinates={zone.boundry} strokeColor="#ffffff" fillColor={zone.colors()[colorInd % zone.colors().length]} />)}
      </FUNowMapView>
      <View style={{ flex: 1 }} />
    </View>

  );
}
