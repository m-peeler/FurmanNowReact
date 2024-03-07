import React from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';

export default function Dates() {
  const { colors, fonts } = useTheme();
  const [data, loading, fetching] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/importantDateGet.php',
    'DATA:Dates-Cache',
  );

  const style = StyleSheet.create({
    fontFamily: fonts.bold,
    color: colors.text,
  });

  return (
    <SafeAreaView>
      {(!loading || !fetching)
        && <Text style={style}>{data.results.map((item) => `${item.title} \t ${item.date}\n`)}</Text>}
    </SafeAreaView>
  );
}
