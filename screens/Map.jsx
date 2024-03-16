import React, { useState } from 'react';
import {
  View, Switch, Text, Dimensions,
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
    (d) => d.results,
  );

  const [displaying, setDisplaying] = useState();

  const setQualifiedDisplaying = (set) => {
    console.log(set);
    if (!set) setDisplaying(undefined);
    else if (!displaying || !displaying.name || displaying.name !== set.name) {
      setDisplaying(set);
    }
  };

  const [search, setSearch] = useState('');

  const updateSearch = (newSearch) => {
    setSearch(newSearch);
  };

  return (
    <View style={{ flex: 1 }}>
      <FUNowMapView onPress={() => { console.log('bye', displaying); setQualifiedDisplaying(undefined); }}>
        {buildings !== undefined
        && buildings.filter((building) => (
          (building.name && building.name.toLowerCase().includes(search.toLowerCase()))
            || (building.nickname && building.nickname.toLowerCase().includes(search.toLowerCase()))
            || (building.description
              && building.description.toLowerCase().includes(search.toLowerCase()))
        ))
          .map((building) => (
            <BuildingMarker
              key={building.name}
              coordinate={{
                latitude: parseFloat(building.latitude),
                longitude: parseFloat(building.longitude),
              }}
              name={building.name}
              locationText={building.location}
              category={building.category}
              hasHours={building.hasHours === '1'}
              nickname={building.nickname}
              buildingID={parseInt(building.buildingID, 10)}
              polyline={building.polyline}
              onPress={() => setTimeout(() => { setQualifiedDisplaying(building); }, 5)}
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
          }}
          inputContainerStyle={{
            backgroundColor: 'transparent', borderWidth: 0, borderRadius: 0, borderTopRightRadius: 10,
          }}
          inputStyle={{ fontFamily: fonts.regular, padding: 10 }}
          leftIcon={null}
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
