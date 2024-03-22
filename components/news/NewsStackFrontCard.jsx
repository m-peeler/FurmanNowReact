import React, { useEffect, useState } from 'react';
import {
  View, Text,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import NewsCardWrapper from './NewsCardWrapper';
import ARROW from '../assets/icon/creatype-arrow.png';
import { Article } from '../../utilities/ArticleFunctions';

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
    }, 15000);
    return () => { clearInterval(interval); };
  }, [haveLinks]);

  const { colors, fonts } = useTheme();
  const [pressed, setPressed] = useState(false);
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
          style={{ height: '100%', width: '100%', borderRadius: 10 }}
          source={{ uri: frontArticle ? frontArticle.article.imagelink : '' }}
          transition={{ duration: 500, effect: 'cross-dissolve' }}
        />
        <View style={{
          height: '100%', width: '100%', position: 'absolute', justifyContent: 'flex-end',
        }}
        >
          <View style={{
            margin: 10, padding: 5, borderRadius: 4, backgroundColor: `${pressed ? colors.notification : colors.card}88`,
          }}
          >
            <Text style={{
              fontFamily: fonts.italic, color: pressed ? colors.notificationText : colors.text,
            }}
            >
              {`${frontArticle ? `"${frontArticle.article.title}", by ${frontArticle.article.author}` : ''}`}
            </Text>
          </View>
        </View>
        <View style={{
          width: '40%', position: 'absolute', left: 0, borderTopLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: pressed ? colors.notification : colors.card,
        }}
        >
          <Text style={{
            fontFamily: fonts.bold, color: colors.text, fontSize: 18, textAlign: 'center', padding: 5,
          }}
          >
            {`There are new posts from ${publisher.name}!`}
          </Text>
          <Text style={{
            fontFamily: fonts.regular, color: colors.text, padding: 5, textAlign: 'center',
          }}
          >
            Swipe to see more, or hold down to share.
          </Text>
          <Image
            source={ARROW}
            style={{
              transform: [{ rotate: '-90deg' }], marginLeft: 60, marginVertical: -20, width: 30, height: 100, tintColor: colors.text,
            }}
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
