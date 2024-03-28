import React from 'react';
import {
  Dimensions, Text, View, StyleSheet,
} from 'react-native';
import Animated, {
  FadeIn, FadeOut, SlideInRight, SlideOutRight,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';

export default function CreditsTab() {
  const { fonts, colors } = useTheme();

  const styles = {
    furmanNow: {
      fontFamily: fonts.heading,
      fontSize: 18,
      color: colors.text,
    },
    italic: {
      fontFamily: fonts.italic,
      fontSize: 14,
      color: colors.text,
    },
    regular: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.text,
    },
    bold: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  };
  return (
    <View style={{
      position: 'absolute',
      ...StyleSheet.absoluteFill,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    }}
    >
      <Animated.View
        style={{
          backgroundColor: '#000000bb',
          position: 'absolute',
          ...StyleSheet.absoluteFill,
        }}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      />
      <Animated.View
        entering={SlideInRight.duration(400)}
        exiting={SlideOutRight.duration(400)}
        style={{
          backgroundColor: colors.card,
          width: Dimensions.get('screen').width * (3 / 5),
          height: Dimensions.get('screen').height,
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          padding: 10,
        }}
      >
        <Text style={styles.furmanNow}>
          Furman Now!
        </Text>
        <Text style={styles.regular}>
          Version 2.0.0
        </Text>
        <Text />
        <Text style={styles.bold}>
          {'Made by Michael Peeler, \'24'}
        </Text>
        <Text style={styles.italic}>
          Furman University Department of Computer Science
        </Text>
        <Text />
        <Text style={styles.bold}>
          {'Completed for Dr. Fahad Sultan\'s Senior Seminar, Spring 2024'}
        </Text>
        <Text />
        <Text style={styles.bold}>
          {'Email \'FurmanNowApp@gmail.com\' with issues or suggestions.'}
        </Text>
        <Text />
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.regular}>
            {'Based on the original '}
            <Text style={{ ...styles.furmanNow, fontSize: styles.regular.fontSize }}>
              Furman Now!
            </Text>
            {' created for iPhone in 2020 by ___ and for Android in 2021 by __, under Prof. Bryan Catron.'}
          </Text>
        </View>
        <Text />
        <Text style={styles.regular}>
          Icons used with permission from MonstrIcon and FreePik.
        </Text>
        <Text />
        <Text style={styles.regular}>
          {'Typography:\n'
            + '  Abril Fatface Italic\n'
            + '  Barlow Semi-Condensed\n'
            + '  Linotype Didot Italic\n'
            + '  Yardley'}
        </Text>
      </Animated.View>
    </View>
  );
}
