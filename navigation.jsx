import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@react-navigation/native';
import Feed from './screens/Feed';
import HomeScreen from './screens/HomeScreen';
import Blank from './screens/Blank';
import Contacts from './screens/Contacts';
import Events from './screens/Events';
import Dates from './screens/Dates';
import Athletics from './screens/Athletics';
import Hours from './screens/Hours';
import Health from './screens/Health';
import Map from './screens/Map';
import Dining from './screens/Dining';
import Page from './utilities/Page';
import SMARTPHONE from './assets/icon/icon-phone.png';
import CLOCK from './assets/icon/icon-clock.png';
import BASKETBALL from './assets/icon/icon-basketball.png';
import EVENTS from './assets/icon/icon-events.png';
import MAP from './assets/icon/icon-map.png';
import DATES from './assets/icon/icon-dates.png';
import CADUCEUS from './assets/icon/icon-health.png';
import FOOD from './assets/icon/icon-food.png';

const Stack = createNativeStackNavigator();

const catHome = 'Home Screen';
const catNews = 'News Sources';
const pages = [
  [new Page(1, 'Contact', { category: catHome, icon: SMARTPHONE }), Contacts],
  [new Page(2, 'Athletics', { category: catHome, icon: BASKETBALL }), Athletics],
  [new Page(21, 'Athletics-More-Info', { showName: false }), Blank],
  [new Page(3, 'Hours', { category: catHome, icon: CLOCK }), Hours],
  [new Page(31, 'Hours-More-Info', { showName: false }), Blank],
  [new Page(4, 'Dining', { category: catHome, icon: FOOD }), Dining],
  [new Page(41, 'Dining-More-Info', { showName: false }), Blank],
  [new Page(5, 'Events', { category: catHome, icon: EVENTS }), Events],
  [new Page(6, 'Map', { category: catHome, icon: MAP }), Map],
  [new Page(7, 'Health', { category: catHome, icon: CADUCEUS }), Health],
  [new Page(8, 'Dates', { category: catHome, icon: DATES }), Dates],
  [new Page(9, 'Hi', { category: catHome, icon: DATES }), Dates],
  [new Page(10, 'There', { category: catHome, icon: DATES }), Dates],
  [new Page(11, 'Gen', { category: catHome, icon: DATES }), Dates],
  [new Page(12, 'Keno', { category: catHome, icon: DATES }), Dates],
  [new Page(13, 'Bi', { category: catHome, icon: DATES }), Dates],

  [new Page(101, 'The Paladin', { category: catNews }), Blank],
  [new Page(102, 'FUNC', { category: catNews }), Blank],
  [new Page(103, 'The Echo', { category: catNews }), Blank],
  [new Page(104, 'Christo et Doctrinae', { category: catNews }), Blank],
  [new Page(105, "President's Page", { category: catNews }), Blank],
  [new Page(106, 'In the News', { category: catNews }), Blank],
];

export default function Navigation() {
  const { colors, fonts } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Home"
    >
      <Stack.Group
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30,
            fontFamily: fonts.heading,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{
            pages:
                        pages.filter(([page]) => page.category === catHome)
                          .map(([page]) => page),
          }}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Feed"
          component={Feed}
          initialParams={{
            pages:
                        pages.filter(([page]) => page.category === catNews)
                          .map(([page]) => page),
          }}
          options={{ title: 'News' }}
        />
        {pages.map((page) => (
          <Stack.Screen
            name={page[0].name}
            component={page[1]}
            key={page[0].id}
            options={{
              title: page[0].showName ? page[0].name : '',
            }}
          />
        ))}
      </Stack.Group>
    </Stack.Navigator>
  );
}
