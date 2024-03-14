import React, { useEffect, useState } from 'react';
import { View, Switch, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import FUNowMapView from '../components/CustomMapView';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import BuildingMarker from '../components/BuildingMarker';
import BusRoutePolyline from '../components/BusRoutePolyline';
import { parseDatetime } from '../utilities/DateTimeFunctions';
import BusStopMarker from '../components/BuildingMarker';

const secondLineEncoded = 'kretE`~cvNA??CAAACEEIEA?A?A@CDOVEFm@l@GHQVO\\GVANCR??@?\\FLDDDFFBH??hAY^Ih@O\\MFCVMJC`@UnBkApAu@^Sn@_@v@e@HE\\Wj@_@??l@`A@DP\\p@tAV|@DLHZDRF\\Nf@P\\FHBB@BTV^\\h@Z^Jj@H`@@??LA@?AO@NB?PEPM@AvD@BQHYN]LSRQRGXCVAPBb@R@GAFNHxAlAf@n@FJDJBJBP@d@@RAFABQ`@Sd@INGFKFk@P??FVDHIDHE\\hANd@??IJCDQZSZADCFEP?N?@@D@NFN?BBBBHFN@BDF?@h@`A\\b@v@j@B@\\LZND?b@@b@B`@EJAt@]FGv@w@Z[JS?Q?ICKIQACS]CEe@}@AASa@Uc@GM[XZYMUUa@??`AaAZ[Z[RSr@mA??P?PENGPMDMDDEEDKFc@?QEOGSKQOMOEWA??c@c@eCoCuB}Bq@k@?A?@s@k@}D}BgCyA??AO?MAKAGCGCGCIEGGGEGECEEECGCWGGAI?E?K@E@YJKFIJKNGP?DOENDCJCZ@X??aA[a@Ma@MKCy@SEAeBTOFIDUNGDWRKJ??EQDPYV]Xa@^WPKHk@^]VIDw@d@o@^_@RqAt@oBjAa@TKBWLGB]Li@N_@HiAX??CIGGEEME]GA???BS@OFWN]PJF@DAJEPOTSNUR]BI?C?A';

const routes = [{
  name: 'Furman Shuttle',
  color: '#582C83',
  route: secondLineEncoded,
  stops: [{
    name: 'Library Steps', eta: 5, latitude: 34.92437802079961, longitude: -82.43845380335945,
  }],
}];

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
  const { colors } = useTheme();
  const [buildings] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/buildingGet.php',
    'DATA:Building-Map-Info-Cache',
    (d) => d.results,
  );
  const [vehicles, , , , refresh] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/shuttleGet.php?v=all',
    'DATA:Vehicle-Locations',
    (d) => d.results
      .filter((v) => Date.now() - parseDatetime(v.updated) < (3 * 60 * 1000))
      .map(
        ({ latitude, longitude, ...rest }) => ({ ...rest, coordinate: { latitude, longitude } }),
      ),
    (vehics) => vehics.length > 0,
  );

  useEffect(() => {
    if (vehicles === undefined) return undefined;
    const interval = setInterval(() => {
      refresh();
    }, 5_000);
    return () => clearInterval(interval);
  }, [vehicles, refresh]);

  const [locsEnabled, setLocsEnabled] = useState(true);
  const toggleLocs = () => setLocsEnabled(!locsEnabled);

  const [routesEnabled, setRoutesEnabled] = useState(true);
  const toggleRoutes = () => setRoutesEnabled(!routesEnabled);

  const switchList = [
    <CustomSwitch state={locsEnabled} onValueChange={toggleLocs} name=" Buildings" color="#58cc4d" key="1" />,
    <CustomSwitch state={routesEnabled} onValueChange={toggleRoutes} name=" Transit" color="#55ccd3" key="2" />,
  ];

  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FUNowMapView>
        {routes !== undefined
          && routesEnabled
          && show
          && (
          <View>
            {routes.map(({
              color, route, stops, name,
            }) => <BusRoutePolyline key={name} color={color} route={route} stops={stops} />)}
          </View>
          )}
        {vehicles && routesEnabled
            && vehicles.map(
              ({ coordinate, vehicle }) => <BusStopMarker name={vehicle} coordinate={coordinate} />,
            )}
        {buildings !== undefined
        && locsEnabled
        && buildings.map((building) => (
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
          />
        ))}
      </FUNowMapView>
      <View style={{
        left: 20,
        bottom: 55,
        backgroundColor: colors.card,
        borderRadius: 8,
        padding: 8,
        width: 200,
        position: 'absolute',
      }}
      >
        {switchList}
      </View>
    </View>
  );
}
