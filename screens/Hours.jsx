import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import {
  SafeAreaView, StyleSheet, Text, View,
  Pressable,
} from 'react-native';
import PropTypes from 'prop-types';
import ButtonList from '../components/ButtonList';
import useBuildingHours from '../hooks/useBuildingHours';
import { Schedule } from '../utilities/Scheduling.ts';

export default function Hours() {
  const styles = (colors, fonts) => (pressed) => StyleSheet.create({
    locationText: {
      title: {
        fontFamily: fonts.bold,
        color: pressed ? colors.notificationText : colors.text,
        fontSize: 24,
        flex: 2,
        flexGrow: 1,
      },
      openIndicator: (opened) => {
        let background;
        if (pressed) {
          background = colors.notificationText;
        } else if (opened) {
          background = colors.positive;
        } else {
          background = colors.negative;
        }
        return {
          alignSelf: 'center',
          borderRadius: 10,
          height: 20,
          width: 20,
          margin: 5,
          backgroundColor: background,
        };
      },
      dayText: {
        fontFamily: fonts.regular,
        color: pressed ? colors.notificationText : colors.text,
        fontSize: 18,
        paddingLeft: 10,
        paddingVertical: 0,
        flex: 1,
      },
      hoursText: {
        fontFamily: fonts.thin,
        color: pressed ? colors.notificationText : colors.text,
        fontSize: 18,
        paddingRight: 10,
        paddingVertical: 0,
        flex: 2,
        textAlign: 'right',
      },
    },
    button: {
      backgroundColor: pressed ? colors.notification : colors.card,
    },
  });

  const { colors, fonts } = useTheme();
  const [data, dataExists] = useBuildingHours();

  const [buttonEngaged, setButtonEngaged] = useState(-1);

  const normalStyle = {
    alignSelf: 'center',
    height: '97%',
    width: '95%',
    borderRadius: 10,
    backgroundColor: colors.card,
    marginVertical: '2.5%',
    padding: 5,
  };

  return (
    <SafeAreaView style={{ height: '100%', width: '100%' }}>
      {data && dataExists
        && (
        <ButtonList
          extraData={buttonEngaged}
          estimatedItemSize={200}
          style={normalStyle}
          sorter={((vals) => vals.sort(([k1], [k2]) => k1.localeCompare(k2)))}
          data={data}
          renderItem={({ item, index }) => (
            <HoursButton
              item={item}
              index={index}
              styles={styles(colors, fonts, buttonEngaged)}
              onPress={() => {
                setButtonEngaged(buttonEngaged === index ? -1 : index);
              }}
              buttonEngaged={buttonEngaged}
            />
          )}
          keyExtractor={([key]) => key}
        />
        )}
    </SafeAreaView>
  );
}

function HoursButton({
  item, index, onPress, styles, buttonEngaged,
}) {
  const [pressed, setPressed] = useState(false);
  const sty = styles(pressed);
  const [key, value] = item;
  return (
    <Pressable
      style={sty.button}
      onPress={onPress}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      accessible={false}
    >
      <View style={{ flexDirection: 'column' }}>
        <HoursTitleBar styles={sty.locationText} name={key} information={value} />
        <View style={{ flexDirection: 'column' }}>
          {value.schedule.dailySchedules(buttonEngaged !== index).map(
            ([day, hours]) => (
              <View
                key={day}
                accessible
                accessibilityLabel={`${key}, opened ${day} from ${hours}`}
                style={{ flexDirection: 'row', alignContent: 'space-between' }}
              >
                <Text style={sty.dayText}>{day}</Text>
                <Text style={sty.hoursText} id={day}>{`${hours}`}</Text>
              </View>
            ),
          )}
        </View>
      </View>
    </Pressable>
  );
}
HoursButton.propTypes = {
  item: PropTypes.arrayOf([
    PropTypes.string.isRequired,
    PropTypes.shape({
      schedule: PropTypes.instanceOf(Schedule).isRequired,
    }).isRequired,
  ]).isRequired,
  index: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  styles: PropTypes.shape({
    locationText: PropTypes.shape.isRequired,
    dayText: PropTypes.shape.isRequired,
    hoursText: PropTypes.shape.isRequired,
  }).isRequired,
  buttonEngaged: PropTypes.string.isRequired,
};

function HoursTitleBar({ styles, name, information }) {
  const { fonts } = useTheme();
  const opened = information.schedule.isOpened(new Date(Date.now()));
  const openedString = `${name} is currently ${opened ? 'opened' : 'closed'}.`;
  return (
    <View
      accessible
      accessibilityLabel={openedString}
      style={{ flexDirection: 'row', justifyContent: 'space-between' }}
    >
      <Text style={styles.title}>{`${name.trim()}`}</Text>
      <View style={{
        justifyContent: 'center', flexDirection: 'row', flex: 0.5, alignContent: 'center',
      }}
      >
        <View
          style={{ padding: 3, justifyContent: 'center' }}
        >
          <Text style={{ color: styles.title.color, fontFamily: fonts.bold }}>
            {opened ? 'OPEN' : 'CLOSED'}
          </Text>
        </View>
        <View style={styles.openIndicator(opened)} />
      </View>
    </View>
  );
}

HoursTitleBar.propTypes = {
  information: PropTypes.shape({
    schedule: PropTypes.instanceOf(Schedule),
  }).isRequired,
  name: PropTypes.string.isRequired,
  styles: PropTypes.shape({
    title: PropTypes.shape({
      color: PropTypes.string.isRequired,
    }).isRequired,
    // Style to create open indication circle
    openIndicator: PropTypes.func.isRequired,
  }).isRequired,
};
