import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import {
  View, Pressable, Image, Text, Linking, StyleSheet,
} from 'react-native';
import NewsCardWrapper from './NewsCardWrapper';
import { getDateSuffix } from '../../utilities/DateTimeFunctions';

function dateFormat(date) {
  return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${getDateSuffix(date)}, ${date.getFullYear()}`;
}

export default function NewsLinkCard({
  height, width, title, description, author, date, section,
  link, imageLink, publisher, publisherLink, publisherImageLink,
  onPress, touchState,
}) {
  const { colors, fonts } = useTheme();
  const [pressed, setPressed] = useState(false);

  const textColor = pressed ? colors.notificationText : colors.text;
  const cardColor = pressed ? colors.notification : colors.card;
  const titleFont = fonts.bold;
  const sourceFont = fonts.italic;
  const providenceFont = fonts.italic;
  const bodyFont = fonts.regular;
  useEffect(() => {
    if (touchState) touchState.setter(pressed);
  }, [pressed, touchState]);
  const styles = StyleSheet.create({
    image: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      width: '100%',
      height: '72%',
    },
    title: {
      paddingHorizontal: 5,
      fontFamily: titleFont,
      fontSize: 20,
      color: textColor,
    },
    titleBox: {
      position: 'absolute',
      bottom: '42%',
      backgroundColor: `${cardColor}aa`,
      paddingVertical: 5,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },
    publisher: {
      fontFamily: sourceFont,
      fontSize: 16,
      color: textColor,
    },
    publisherBox: {
      bottom: '27%',
      paddingHorizontal: 10,
      paddingVertical: 5,
      right: 0,
      position: 'absolute',
      backgroundColor: cardColor,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    description: {
      fontFamily: bodyFont,
      fontSize: 14,
      color: textColor,
    },
    providence: {
      fontFamily: providenceFont,
      fontSize: 18,
      color: textColor,
      flex: 1,
    },
  });
  return (
    <Pressable
      onTouchCancel={() => setPressed(false)}
      onTouchEnd={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onPress={() => (onPress ? onPress() : Linking.openURL(link))}
    >
      <NewsCardWrapper
        color={cardColor}
        height={height}
        width={width}
        headline={title}
        link={link}
        publisher={publisher}
        publisherLink={publisherLink}
      >
        <Image
          style={styles.image}
          source={imageLink && imageLink !== '' ? { uri: imageLink } : { uri: publisherImageLink }}
        />
        <View style={styles.titleBox}>
          <Text style={styles.title}>
            {title}
          </Text>
        </View>
        <View style={{ ...styles.publisherBox, flexDirection: 'row' }}>
          {section
              && section !== ''
              && (
              <Text style={{ ...styles.publisher, fontFamily: titleFont, paddingRight: 10 }}>
                {`${section}\t|`}
              </Text>
              )}
          <Text style={styles.publisher}>
            {publisher}
          </Text>
        </View>
        <View style={{ padding: 5, width: '100%' }}>
          <View style={{ flexDirection: 'row', alignContent: 'space-beween' }}>
            <Text numberOfLines={1} style={styles.providence}>
              {author}
            </Text>
            <Text numberOfLines={1} style={{ ...styles.providence, flex: 0 }}>
              {dateFormat(date)}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={styles.description}
          >
            {description}
          </Text>
        </View>
      </NewsCardWrapper>
    </Pressable>
  );
}
NewsLinkCard.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  publisher: PropTypes.string.isRequired,
  publisherLink: PropTypes.string.isRequired,
  publisherImageLink: PropTypes.string,
  description: PropTypes.string,
  section: PropTypes.string,
  author: PropTypes.string,
  imageLink: PropTypes.string,
  onPress: PropTypes.func,
  touchState: PropTypes.exact({
    state: PropTypes.bool,
    setter: PropTypes.func,
  }),
};
NewsLinkCard.defaultProps = {
  publisherImageLink: undefined,
  description: undefined,
  author: undefined,
  imageLink: undefined,
  section: undefined,
  onPress: undefined,
  touchState: undefined,
};
