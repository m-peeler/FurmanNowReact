import React from 'react';
import { useTheme } from '@react-navigation/native';
import {
  SafeAreaView, StyleSheet, Text,
} from 'react-native';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';

export default function Dining() {
  const { colors, fonts } = useTheme();
  const [data] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/dhMenuGet.php',
    'DATA:DH-Dining-Cache',
  );

  const style = StyleSheet.create({
    fontFamily: fonts.bold,
    color: colors.text,
  });

  return (
    <SafeAreaView>
      {data && data.results
                && <Text style={style}>{data.results.map((item) => `${item.meal} \t ${item.station} \t ${item.itemName}\n`)}</Text>}
    </SafeAreaView>
  );
}
