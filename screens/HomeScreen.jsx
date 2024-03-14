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
  const {
    route: { params: { pages } },
    navigation: { navigate },
  } = props;

  const { colors, fonts } = useTheme();

  function buttonColor(pressed) {
    return pressed ? colors.notification : colors.card;
  }
  function buttonTextColor(pressed) {
    return pressed ? colors.notificationText : colors.text;
  }
  const headerHeight = useHeaderHeight();
  const { bottom: bottomHeight } = useSafeAreaInsets();
  const useableHeight = Dimensions.get('window').height - headerHeight - bottomHeight;

  const weatherHeight = (useableHeight / 7) * 2;
  const buttonPanelHeight = (useableHeight / 7) * 4;
  const newsHeight = (useableHeight / 7) * 1;

  const buttonCols = 2;
  // Allocates  a spare row for text display etc
  const buttonSize = (buttonPanelHeight / (buttonCols + 1)) * 0.8;

  const buttonStyles = StyleSheet.create({
    label: {
      flex: 1,
      color: colors.text,
      textAlign: 'center',
      fontFamily: fonts.bold,
      fontSize: 18,
      paddingTop: 5,
      paddingBottom: 15,
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
          tintColor: buttonTextColor(pressed),
        },
      },
    }),
  });

  const newsStyles = (pressed) => StyleSheet.create({
    front: {
      label: {
        textAlign: 'center',
        top: newsHeight / 3,
        fontFamily: fonts.heading,
        fontSize: 40,
        color: buttonTextColor(pressed),
      },
    },
    button: {
      height: (useableHeight / 7),
      margin: 10,
      backgroundColor: buttonColor(pressed),
      color: buttonTextColor(pressed),
      borderRadius: 20,
    },
    cells: {
      paddingHorizontal: 10,
      marginBottom: 10,
    },
  });

  return (
    <SafeAreaView>
      <Weather height={weatherHeight} width="100%" />
      <View style={{
        height: buttonPanelHeight,
        width: '100%',
        position: 'absolute',
        flex: 1,
        top: weatherHeight + (buttonPanelHeight / ((buttonCols + 1) * 4)),
      }}
      >
        <FlashList
          extraData={colors}
          estimatedItemSize={100}
          scrollEnabled={false}
          data={pages}
          numColumns={buttonCols}
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
      <View style={{
        position: 'absolute',
        top: weatherHeight + buttonPanelHeight,
        height: newsHeight,
        width: '100%',
      }}
      >
        <Button
          accessibilityLabel="News Feed"
          accessibilityHint="Press to travel to the news feed"
          front={renderResponsiveLabel('NEWS FEED')}
          frontResponsive
          styles={newsStyles}
          onPress={() => navigate('Feed')}
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
