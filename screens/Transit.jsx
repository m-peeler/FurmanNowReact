import React, { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { parseDatetime } from '../utilities/DateTimeFunctions';
import FUNowMapView from '../components/CustomMapView';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import BusRoute from '../components/BusRoute';
import BusMarker from '../components/transit/BusMarker';

export default function Transit() {
  const [vehicles, , , , refresh] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/shuttleGet.php?v=all',
    'DATA:Vehicle-Locations',
    (d) => {
      const cleaned = d.results
        .filter((v) => Date.now() - parseDatetime(v.updated) < (3 * 60 * 1000))
        .map(
          ({
            latitude, longitude, direction, ...rest
          }) => ({
            ...rest,
            heading: parseInt(direction, 10),
            coordinate: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
          }),
        );
      return cleaned.length > 0 ? cleaned : undefined;
    },
    (vehics) => vehics.length > 0,
  );

  const [pulledRoutes] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/vehicleNamesGet.php',
    'DATA:Vehicle-Routes',
    (resp) => resp.results,
  );

  const [liveStops, , , , refreshLiveStops] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/stopsGet.php',
    'DATA:Stops',
    (resp) => {
      if (resp && resp.results) {
        const par = resp.results.map(
          (stop) => ({
            lineID: stop.lineID,
            stopOrderID: parseInt(stop.stopOrderID, 10),
            coordinate: {
              latitude: parseFloat(stop.latitude),
              longitude: parseFloat(stop.longitude),
            },
            distFromStart: parseFloat(stop.distFromStart),
            name: stop.stopName,
            distFromVehicle: stop.distFromVehicle !== undefined
              ? parseFloat(stop.distFromVehicle)
              : undefined,
            updated: stop.updated !== undefined ? parseDatetime(stop.updated) : undefined,
            vehicleStopsUntil:
              stop.vehicleStopsUntil !== undefined
                ? parseInt(stop.vehicleStopsUntil, 10)
                : undefined,
          }),
        );
        return par;
      } return undefined;
    },
  );

  useEffect(() => {
    if (vehicles === undefined) return undefined;
    const interval = setInterval(() => {
      refresh();
    }, 5_000);
    return () => clearInterval(interval);
  }, [vehicles, refresh]);

  useEffect(() => {
    if (liveStops === undefined) return undefined;
    const interval = setInterval(() => {
      refreshLiveStops();
    }, 5_000);
    return () => clearInterval(interval);
  }, [liveStops, refreshLiveStops]);

  // Hacky solution to the fact that iOS doesn't do 'flat' markers.
  // Get rotation from map when region changes & subtract that from vehicle heading.
  const [curMapHeading, setCurMapHeading] = useState(0);
  const mapRef = useRef();

  return (
    <View style={{ flex: 1 }}>
      <FUNowMapView
        ref={mapRef}
        onRegionChange={
          () => mapRef.current.getCamera().then((info) => setCurMapHeading(info.heading))
        }
      >
        {pulledRoutes !== undefined
          && pulledRoutes.map(({
            color, routePolyline, name, vehicleIndex, website, averageSpeed,
          }) => (
            <BusRoute
              key={name}
              vehicleName={name}
              website={website}
              color={color}
              route={routePolyline}
              averageSpeed={parseFloat(averageSpeed)}
              stops={liveStops ? liveStops.filter(({ lineID }) => lineID === vehicleIndex) : []}
            />
          ))}
        {vehicles
            && vehicles.map(
              ({
                coordinate, vehicle, id, heading,
              }) => {
                if (coordinate.latitude && coordinate.longitude) {
                  return (
                    <BusMarker
                      key={vehicle}
                      name={vehicle}
                      color={pulledRoutes
                        ? pulledRoutes.filter(
                          ({ vehicleIndex }) => id === vehicleIndex,
                        ).map(({ color }) => color)[0]
                        : undefined}
                      coordinate={coordinate}
                      rotation={Platform.OS === 'ios' ? heading - curMapHeading : heading}
                    />
                  );
                }
                return undefined;
              },
            )}
      </FUNowMapView>
    </View>
  );
}
