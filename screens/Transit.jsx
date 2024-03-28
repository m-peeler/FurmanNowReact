import React, { useEffect, useRef, useState } from 'react';
import {
  Platform, View, Text, Dimensions,
  Linking,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { parseDatetime } from '../utilities/DateTimeFunctions.ts';
import FUNowMapView from '../components/CustomMapView';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import BusRoute from '../components/transit/BusRoute';
import BusMarker from '../components/transit/BusMarker';
import Button from '../components/Button';

const renderFront = (text, style) => <Text style={style}>{text}</Text>;

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
    }, 3_000);
    return () => clearInterval(interval);
  }, [vehicles, refresh]);

  useEffect(() => {
    if (liveStops === undefined) return undefined;
    const interval = setInterval(() => {
      refreshLiveStops();
    }, 3_000);
    return () => clearInterval(interval);
  }, [liveStops, refreshLiveStops]);

  // Hacky solution to the fact that iOS doesn't do 'flat' markers.
  // Get rotation from map when region changes & subtract that from vehicle heading.
  const [curMapHeading, setCurMapHeading] = useState(0);
  const mapRef = useRef();

  const [displaying, setDisplaying] = useState();
  // If we use useState here, the setTimeout will
  // use a stale value when determining if an undefined
  // state should erase the current one.
  const recentlyChanged = useRef(false);

  const { colors, fonts } = useTheme();

  const setQualifiedDisplaying = (set) => {
    if (!set) {
      setTimeout(() => {
        if (!recentlyChanged.current) setDisplaying(undefined);
      }, 10);
    } else if (!displaying || !displaying.name || displaying.name !== set.name) {
      setDisplaying(set);
      recentlyChanged.current = true;
      // eslint-disable-next-line no-return-assign
      setTimeout(() => (recentlyChanged.current = false), 200);
    }
    return undefined;
  };

  const styles = {
    websiteButton: (pressed) => ({
      button: {
        backgroundColor: pressed ? colors.card : colors.notification,
        borderRadius: 8,
        padding: 6,
      },
      front: {
        color: pressed ? colors.text : colors.notificationText,
        fontFamily: fonts.italic,
        fontSize: 14,
        textAlign: 'center',
      },
    }),
  };

  return (
    <View style={{ flex: 1 }}>
      <FUNowMapView
        ref={mapRef}
        onRegionChange={
          () => mapRef.current.getCamera().then((info) => setCurMapHeading(info.heading))
        }
        onPress={() => setQualifiedDisplaying(undefined)}
      >
        {pulledRoutes !== undefined
          && pulledRoutes.map(({
            color, routePolyline, name, vehicleIndex,
            website, averageSpeed, averageStopSeconds, message,
          }) => (
            <BusRoute
              key={name}
              vehicleName={name}
              website={website}
              color={color}
              route={routePolyline}
              averageSpeed={parseFloat(averageSpeed)}
              averageStopSeconds={parseFloat(averageStopSeconds)}
              stops={liveStops ? liveStops.filter(({ lineID }) => lineID === vehicleIndex) : []}
              onPress={() => { setQualifiedDisplaying({ name, website, message }); }}
            />
          ))}
        {vehicles
            && vehicles.map(
              ({
                coordinate, vehicle, id, heading,
              }) => {
                if (coordinate.latitude && coordinate.longitude) {
                  const route = pulledRoutes
                    ? pulledRoutes.filter(
                      ({ vehicleIndex }) => id === vehicleIndex,
                    )[0]
                    : undefined;
                  const { message, name, website } = route;
                  return (
                    <BusMarker
                      key={vehicle}
                      name={vehicle}
                      color={route ? route.color : colors.text}
                      coordinate={coordinate}
                      rotation={Platform.OS === 'ios' ? heading - curMapHeading : heading}
                      onPress={() => setQualifiedDisplaying({ message, name, website })}
                    />
                  );
                }
                return undefined;
              },
            )}
      </FUNowMapView>
      {displaying && (
      <Animated.View
        key={displaying}
        style={{
          position: 'absolute',
          padding: 10,
          width: Dimensions.get('window').width - 20,
          bottom: 35,
          right: 0,
          margin: 10,
          borderRadius: 16,
          backgroundColor: colors.card,
        }}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        <Text style={{ fontFamily: fonts.bold, fontSize: 24, color: colors.text }}>
          {displaying.name}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 24, color: colors.text }}>
          {displaying.message}
        </Text>
        <Button
          onPress={() => Linking.openURL(displaying.website)}
          styles={styles.websiteButton}
          frontResponsive
          front={(style) => renderFront(`Visit the ${displaying.name} website.`, style)}
        />
      </Animated.View>
      )}
    </View>
  );
}
