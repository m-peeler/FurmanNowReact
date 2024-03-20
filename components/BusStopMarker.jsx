import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import {
  Text, View, Image, Dimensions, Pressable, Linking,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import BUSSTOP from '../assets/icon/bus-stop-freepik.png';

export default function BusStopMarker(props) {
  const {
    title, eta, color, coordinate, website, vehicleName,
  } = props;
  const { colors, fonts } = useTheme();
  return (
    <Marker
      coordinate={coordinate}
      title={title}
    >
      <View style={{
        shadowColor: colors.shadow,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
        paddingBottom: Platform.OS === 'ios' ? 50 : undefined,
      }}
      >
        <Image
          source={BUSSTOP}
          style={{
            height: 50,
            width: 50,
            margin: 10,
            padding: 10,
            tintColor: color,
          }}
        />
      </View>
      <Callout tooltip>
        <View style={{ width: Dimensions.get('window').width * (2 / 3) }}>
          <View style={{
            borderColor: '#ffffff', borderWidth: 5, borderRadius: 5, backgroundColor: '#ffffff',
          }}
          >
            <Text style={{
              flex: 1, textAlign: 'center', fontFamily: fonts.bold, fontSize: 20,
            }}
            >
              {title}
            </Text>
            {eta
              && (
              <Text style={{ fontFamily: fonts.regular, fontSize: 15, paddingBottom: 4 }}>
                {eta}
              </Text>
              )}
            {website && (
            <Pressable
              style={{
                backgroundColor: colors.notification,
                color: colors.notificationContrast,
                padding: 5,
              }}
              onPress={() => Linking.openURL(website)}
            >
              <Text style={{ fontFamily: fonts.italic, fontSize: 14, textAlign: 'center' }}>
                {`Check the ${vehicleName}'s site directly.`}
              </Text>
            </Pressable>
            )}
          </View>
        </View>
      </Callout>
    </Marker>
  );
}
BusStopMarker.propTypes = {
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  color: PropTypes.string,
  title: PropTypes.string,
  eta: PropTypes.string,
  website: PropTypes.string,
  vehicleName: PropTypes.string,
};
BusStopMarker.defaultProps = {
  color: '#000000',
  title: '',
  eta: undefined,
  website: undefined,
  vehicleName: 'source',
};
