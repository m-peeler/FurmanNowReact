import React from 'react';
import {
  View, StyleSheet, FlatList, Text,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import Page from '../utilities/Page';

export default function Feed(props) {
  const { colors, fonts } = useTheme();

  function buttonColor(pressed) {
    return pressed ? colors.notification : colors.card;
  }
  function buttonTextColor(pressed) {
    return pressed ? colors.notificationText : colors.text;
  }
  const { route, navigation } = props;
  const { params } = route;
  const { pages: news } = params;
  const { navigate } = navigation;
  const perRow = 2;

  const buttonStyles = StyleSheet.create({
    buttonLabel: {
      color: colors.text,
      textAlign: 'center',
      fontFamily: fonts.heading,
      fontSize: 18,
    },
    buttonDesign: {
      button: {
        width: '90%',
        height: '90%',
        backgroundColor: buttonColor,
        color: buttonTextColor,
        borderRadius: 10,
      },
      cells: {
        width: '50%',
        alignContent: 'center',
        justifyContent: 'center',
      },
    },
  });

  return (
    <View style={{
      flex: 1, height: '100%', alignContent: 'center', padding: 10,
    }}
    >
      <FlatList
        data={news}
        numColumns={perRow}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Button
            front={(
              <Text style={buttonStyles.buttonLabel}>
                {item.name}
              </Text>
)}
            styles={buttonStyles.buttonDesign}
            onPress={() => navigate(item.name)}
          />
        )}
      />
    </View>
  );
}
Feed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      pages: PropTypes.arrayOf(
        PropTypes.instanceOf(Page),
      ).isRequired,
    }).isRequired,
  }).isRequired,
};
