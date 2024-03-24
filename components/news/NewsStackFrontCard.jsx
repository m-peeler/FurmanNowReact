import React, { useEffect, useState } from 'react';
import {
  View, Text,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import NewsCardWrapper from './NewsCardWrapper';
import ARROW from '../../assets/icon/creatype-arrow.png';
import { Article } from '../../utilities/ArticleFunctions.ts';

export default function NewsStackFrontCard({
  cardWidth, cardHeight, articles, publisher, onPress,
}) {
  const haveLinks = articles
    .map((item, index) => ({ article: item, index }))
    .filter(({ article }) => 'imagelink' in article && article.imagelink);
  const index = Math.floor(Math.random() * haveLinks.length);
  const [frontArticle, setFrontArticle] = useState(
    index < haveLinks.length ? haveLinks[index] : undefined,
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setFrontArticle(haveLinks[Math.floor(Math.random() * haveLinks.length)]);
    }, 5_000);
    return () => { clearInterval(interval); };
  }, [haveLinks]);

  const { colors, fonts } = useTheme();
  const [pressed, setPressed] = useState(false);
  const textColor = pressed ? colors.notificationText : colors.text;
  const backColor = pressed ? colors.notification : colors.card;
  const styles = {
    image: {
      height: '100%',
      width: '100%',
      borderRadius: 10,
    },
    background: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      justifyContent: 'flex-end',
    },
    descriptionBounding: {
      margin: 10,
      padding: 5,
      borderRadius: 4,
      backgroundColor: `${backColor}88`,
    },
    description: {
      fontFamily: fonts.italic,
      color: textColor,
    },
    titleBounding: {
      width: '40%',
      position: 'absolute',
      left: 0,
      borderTopLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: `${backColor}88`,
    },
    title: {
      fontFamily: fonts.bold,
      color: textColor,
      fontSize: 18,
      textAlign: 'center',
      padding: 5,
    },
    explainer: {
      fontFamily: fonts.regular,
      color: textColor,
      padding: 5,
      textAlign: 'center',
    },
    arrow: {
      transform: [{ rotate: '-90deg' }],
      marginLeft: 60,
      marginVertical: -20,
      width: 30,
      height: 100,
      tintColor: textColor,
    },
  };
  return (
    <NewsCardWrapper
      height={cardHeight}
      width={cardWidth}
      publisher={publisher.name}
      publisherLink={publisher.link}
      color={colors.card}
      headline={frontArticle.article.title}
      link={frontArticle.article.link}
    >
      <Pressable
        onPress={() => onPress(frontArticle.index)}
        onTouchStart={() => setPressed(true)}
        onTouchCancel={() => setPressed(false)}
        onTouchEnd={() => setPressed(false)}
      >
        <Image
          style={styles.image}
          source={{ uri: frontArticle ? frontArticle.article.imagelink : '' }}
          transition={{ duration: 500, effect: 'cross-dissolve' }}
        />
        <View style={styles.background}>
          <View style={styles.descriptionBounding}>
            <Text style={styles.description}>
              {`${frontArticle ? `"${frontArticle.article.title}", by ${frontArticle.article.author}` : ''}`}
            </Text>
          </View>
        </View>
        <View style={styles.titleBounding}>
          <Text style={styles.title}>
            {`There are new posts from ${publisher.name}!`}
          </Text>
          <Text style={styles.explainer}>
            Swipe to see more, click to jump to article, or hold down to share.
          </Text>
          <Image
            source={ARROW}
            style={styles.arrow}
          />
        </View>
      </Pressable>
    </NewsCardWrapper>
  );
}
NewsStackFrontCard.propTypes = {
  cardWidth: PropTypes.number.isRequired,
  cardHeight: PropTypes.number.isRequired,
  articles: PropTypes.arrayOf(PropTypes.instanceOf(Article)).isRequired,
  publisher: PropTypes.shape({
    name: PropTypes.string,
    link: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func,
};
NewsStackFrontCard.defaultProps = {
  onPress: undefined,
};
