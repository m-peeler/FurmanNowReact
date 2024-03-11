import React from 'react';
import {
  SafeAreaView, View, StyleSheet, Text, Dimensions,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import HomeScreenNavButton from '../components/HomeScreenNavButton';
import Button from '../components/Button';
import Page from '../utilities/Page';
import Weather from '../components/Weather';

function renderResponsiveLabel(text) {
  return function respLabCurried(style) {
    const { label } = style;
    return (<Text style={label}>{text}</Text>);
  };
}

export default function HomeScreen(props) {
  const { colors, fonts } = useTheme();
  const windowHeight = Dimensions.get('window').height;

  function buttonColor(pressed) {
    return pressed ? colors.notification : colors.card;
  }
  function buttonTextColor(pressed) {
    return pressed ? colors.notificationText : colors.text;
  }
  const buttonSize = (windowHeight / 7) * 0.8;

  const buttonStyles = StyleSheet.create({
    label: {
      flex: 1,
      color: colors.text,
      textAlign: 'center',
      fontFamily: fonts.bold,
      fontSize: 18,
      padding: 10,
    },
    buttonStyles: (pressed) => ({
      button: {
        width: buttonSize,
        height: buttonSize,
        backgroundColor: buttonColor(pressed),
        color: buttonTextColor(pressed),
        borderRadius: 10,
      },
      cells: {
        flex: 1,
        width: '33.333%',
        alignItems: 'center',
      },
      front: {
        icon: {
          width: (buttonSize * 2) / 3,
          height: (buttonSize * 2) / 3,
          top: buttonSize / 6,
          tintColor: pressed ? colors.notificationText : colors.text,
        },
      },
    }),
  });

  const newsStyles = (pressed) => StyleSheet.create({
    front: {
      label: {
        textAlign: 'center',
        fontFamily: fonts.heading,
        padding: 30,
        fontSize: 40,
        color: buttonTextColor(pressed),
      },
    },
    button: {
      backgroundColor: buttonColor(pressed),
      color: buttonTextColor(pressed),
      borderRadius: 20,
    },
    cells: {
      paddingHorizontal: 10,
      marginBottom: 10,
    },
  });

  const headerHeight = useHeaderHeight();
  const { bottom: bottomHeight } = useSafeAreaInsets();
  const displayableHeight = Dimensions.get('window').height - headerHeight - bottomHeight;
  const { route } = props;
  const { navigation } = props;
  const { navigate } = navigation;
  const { params } = route;
  const { pages } = params;

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
      <Weather height={(displayableHeight / 7) * 2} width="100%" />
      <View style={{ height: (displayableHeight / 7) * 4 }} />
      <View style={{ alignSelf: 'flex-end', height: displayableHeight / 7, width: '100%' }}>
        <Button
          accessibilityLabel="News Feed"
          accessibilityHint="Press to travel to the news feed"
          front={renderResponsiveLabel('NEWS FEED')}
          frontResponsive
          styles={newsStyles}
          onPress={() => navigate('Feed')}
        />
      </View>
      <View style={{
        // eslint-disable-next-line no-mixed-operators
        flex: 0, height: (displayableHeight / 7) * 4, width: '100%', position: 'absolute', top: (displayableHeight / 7) * 2,
      }}
      >
        <FlashList
          extraData={colors}
          estimatedItemSize={100}
          scrollEnabled={false}
          data={pages}
          numColumns={3}
          renderItem={
            ({ item: page }) => (
              <HomeScreenNavButton
                styles={buttonStyles}
                onPress={() => navigate(page.name)}
                toPage={page}
              />
            )
            }
        />
      </View>
    </SafeAreaView>
  );
}
HomeScreen.propTypes = {
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
