import React, { useEffect, forwardRef } from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';

// Uses the Google Maps JSON configs to disable various
// points of interest from being shown on the map;
// Effectively doubles up on the 'showPointsOfInterest'
// being false.
const removePOIs = [
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

const FUNowMapView = forwardRef((props, ref) => {
  const { colors } = useTheme();
  const { children, onPress, onRegionChange } = props;
  let { zoom } = props;

  if (zoom !== undefined && zoom !== 0) {
    zoom = 1 / zoom;
  } else {
    zoom = 1;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItem: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 12,
      margin: 6,
    },
    bounding: {
      paddingHorizontal: 6,
      paddingVertical: 4,
      flex: 1,
      backgroundColor: colors.card,
      justifyContent: 'flex-end',
      margin: 10,
      borderRadius: 16,
    },
  });

  useEffect(() => {
    const getLocation = async () => {
      Location.requestForegroundPermissionsAsync();
    };

    getLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bounding}>
        <MapView
          ref={ref}
          onRegionChange={onRegionChange}
          showsUserLocation
          style={styles.map}
          maxZoomLevel={18}
          initialRegion={{
            latitude: 34.925,
            longitude: -82.440,
            latitudeDelta: zoom * 0.0012,
            longitudeDelta: zoom * 0.006,
          }}
          showsPointsOfInterest={false}
          customMapStyle={removePOIs}
          onPress={onPress}
        >

          {children}
        </MapView>
      </View>
    </SafeAreaView>
  );
})
FUNowMapView.propTypes = {
  zoom: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onPress: PropTypes.func,
  ref: PropTypes.shape({}),
};
FUNowMapView.defaultProps = {
  zoom: 1,
  children: null,
  onPress: undefined,
  ref: undefined,
};

export default FUNowMapView;
