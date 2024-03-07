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
        width: (windowHeight / 7) * 0.8,
        height: (windowHeight / 7) * 0.8,
        backgroundColor: buttonColor(pressed),
        color: buttonTextColor(pressed),
        borderRadius: 10,
      },
      cells: {
        flex: 1,
        width: '33.333%',
        alignItems: 'center',
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

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      alignItems: 'center',
    },
    headings: {
      fontSize: 18,
      textAlign: 'center',
      color: colors.text,
      alignContent: 'center',
      justifyContent: 'center',
    },
    weather: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      alignSelf: 'flex-start',
      alignContent: 'center',
      justifyContent: 'center',
      borderBottomRightRadius: 15,
      borderBottomLeftRadius: 15,
      top: -10,
      width: '100%',
      height: (displayableHeight / 7) * 2,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
      <View style={styles.weather}>
        <Text style={{
          alignSelf: 'flex-end',
          fontFamily: fonts.bold,
          paddingBottom: 10,
          fontSize: 20,
          color: buttonTextColor(false),
        }}
        >
          WEATHER
        </Text>
      </View>
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
