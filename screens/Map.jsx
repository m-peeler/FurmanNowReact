import React, { useEffect, useRef, useState } from 'react';
import {
  View, Switch, Text, Dimensions,
  Keyboard,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements';
import FUNowMapView from '../components/CustomMapView';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import BuildingMarker from '../components/BuildingMarker';

function CustomSwitch({
  name, color, state, onValueChange,
}) {
  const { colors, fonts } = useTheme();
  return (
    <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
      <Switch
        trackColor={{ true: '#ffffff', false: '#000000' }}
        thumbColor={state ? color : '#3f3f3f'}
        onValueChange={onValueChange}
        value={state}
      />
      <Text style={{ paddingLeft: 5, fontFamily: fonts.bold, color: colors.text }}>
        Show
        {name}
      </Text>
    </View>
  );
}
CustomSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  state: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default function Map() {
  const { colors, fonts } = useTheme();
  const [buildings] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/buildingGet.php',
    'DATA:Building-Map-Info-Cache',
    (d) => {
      if (!d || !d.results) return undefined;
      return d.results.map((
        { latitude, longitude, ...rest },
      ) => (
        {
          coordinate: {
            latitude: parseFloat(latitude), longitude: parseFloat(longitude),
          },
          ...rest,
        }));
    },
  );

  const [displaying, setDisplaying] = useState();
  // If we use useState here, the setTimeout will
  // use a stale value when determining if an undefined
  // state should erase the current one.
  const recentlyChanged = useRef(false);

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

  const [search, setSearch] = useState('');

  const updateSearch = (newSearch) => {
    setSearch(newSearch);
  };

  const displayingBuildings = buildings ? buildings.filter((building) => (
    (building.name && building.name.toLowerCase().includes(search.toLowerCase()))
      || (building.nickname && building.nickname.toLowerCase().includes(search.toLowerCase()))
      || (building.description
        && building.description.toLowerCase().includes(search.toLowerCase()))))
    : undefined;

  const mapRef = useRef();
  useEffect(() => {
    if (displayingBuildings && displayingBuildings.length === 1) {
      Keyboard.dismiss();
      mapRef.current.animateToRegion({
        ...displayingBuildings[0].coordinate,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015,
      });
      setQualifiedDisplaying(displayingBuildings[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayingBuildings]);

  return (
    <View style={{ flex: 1 }}>
      <FUNowMapView
        ref={mapRef}
        onPress={() => {
          setQualifiedDisplaying(undefined);
          Keyboard.dismiss();
        }}
      >
        {displayingBuildings !== undefined
        && displayingBuildings
          .map((building) => (
            <BuildingMarker
              key={building.name}
              coordinate={building.coordinate}
              name={building.name}
              locationText={building.location}
              category={building.category}
              hasHours={building.hasHours === '1'}
              nickname={building.nickname}
              buildingID={parseInt(building.buildingID, 10)}
              polyline={building.polyline}
              onPress={() => setQualifiedDisplaying(building)}
            />
          ))}
        <SearchBar
          placeholder="Search..."
          onChangeText={updateSearch}
          value={search}
          containerStyle={{
            backgroundColor: colors.card,
            borderWidth: 0,
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            alignSelf: 'center',
          }}
          inputContainerStyle={{
            backgroundColor: colors.background,
            borderWidth: 0,
            borderRadius: 10,
            alignSelf: 'center',
            alignContent: 'center',
          }}
          searchIcon={false}
          clear
          inputStyle={{ fontFamily: fonts.regular, padding: 10 }}
        />
      </FUNowMapView>
      {displaying
          && (
          <View style={{
            position: 'absolute',
            padding: 10,
            width: Dimensions.get('window').width - 20,
            bottom: 35,
            right: 0,
            margin: 10,
            borderRadius: 16,
            backgroundColor: colors.card,
          }}
          >
            <Text style={{
              color: colors.text,
              fontFamily: fonts.bold,
              fontSize: 24,
            }}
            >
              {displaying.name}
            </Text>
            {displaying.description
            && (
            <Text style={{
              color: colors.text,
              fontFamily: fonts.regular,
              fontSize: 14,
            }}
            >
              {displaying.description}
            </Text>
            )}
          </View>
          )}
    </View>
  );
}
