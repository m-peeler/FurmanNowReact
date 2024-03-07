import React from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, Text } from 'react-native';

export default function Blank() {
  const { colors, fonts } = useTheme();
  return (
    <SafeAreaView>
      <Text style={{ fontFamily: fonts.bold, color: colors.text }}>Blank</Text>
    </SafeAreaView>
  );
}
