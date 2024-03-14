import React, { useState } from 'react';
import {
  View, FlatList, Text,
  Dimensions,
  Image,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-reanimated-carousel';
import Page from '../utilities/Page';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import { getDateSuffix, parseDatetime } from '../utilities/DateTimeFunctions';
import APRIL from '../assets/images/months/April.jpeg';

function dateFormat(date) {
  return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${getDateSuffix(date)}, ${date.getFullYear()}`;
}

function datesAreWithin(first, second, milliseconds) {
  return Math.abs(first.getTime() - second.getTime()) < milliseconds;
}

function NewsLinkCard({
  height, width, title, description, author, date, section,
  link, imageLink, publisher, publisherLink, publisherImageLink,
}) {
  const { colors, fonts } = useTheme();
  const [pressed, setPressed] = useState(false);
  const textColor = pressed ? colors.notificationText : colors.text;
  const cardColor = pressed ? colors.notification : colors.card;
  const titleFont = fonts.bold;
  const sourceFont = fonts.italic;
  const providenceFont = fonts.italic;
  const bodyFont = fonts.regular;
  const styles = {
    card: {
      borderRadius: 10,
      backgroundColor: cardColor,
      margin: 5,
      height: height - 2 * 5,
      width: width - 2 * 5,
    },
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
      flex: 1,
      fontFamily: providenceFont,
      fontSize: 18,
      color: textColor,
    },
  };
  return (
    <Pressable
      onTouchCancel={() => setPressed(false)}
      onTouchEnd={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onPress={() => Linking.openURL(link)}
    >
      <View style={styles.card}>
        <Image
          style={styles.image}
          source={imageLink && imageLink !== '' ? { uri: imageLink } : APRIL}
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
        <View style={{ padding: 5 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.providence}>
              {author}
            </Text>
            <Text style={{ ...styles.providence, textAlign: 'right' }}>
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
      </View>
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
};
NewsLinkCard.defaultProps = {
  publisherImageLink: undefined,
  description: undefined,
  author: undefined,
  imageLink: undefined,
  section: undefined,
};

function NewsItemCard({
  height, width, title, description, author, date, mediaType, section,
  link, imageLink, publisher, publisherLink, publisherImageLink,
}) {
  switch (mediaType) {
    case 'video':
    case 'link':
    default:
      return (
        <NewsLinkCard
          height={height}
          width={width}
          title={title}
          description={description}
          author={author}
          date={date}
          section={section}
          link={link}
          imageLink={imageLink}
          publisher={publisher}
          publisherLink={publisherLink}
          publisherImageLink={publisherImageLink}
        />
      );
  }
}
NewsItemCard.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  publisher: PropTypes.string.isRequired,
  publisherLink: PropTypes.string.isRequired,
  mediaType: PropTypes.oneOf(['link', 'video']).isRequired,
  publisherImageLink: PropTypes.string,
  description: PropTypes.string,
  section: PropTypes.string,
  author: PropTypes.string,
  imageLink: PropTypes.string,
};
NewsItemCard.defaultProps = {
  publisherImageLink: undefined,
  description: undefined,
  author: undefined,
  imageLink: undefined,
  section: undefined,
};

function NewsCardStack({
  cardWidth, cardHeight, articles, sources,
}) {
  const isAndroid = Platform.OS === 'android';
  return (
    <Carousel
      loop
      snapEnabled
      {...{
        mode: isAndroid ? 'vertical-stack' : 'vertical-stack',
        modeConfig: {
          showLength: 3,
          stackInterval: cardHeight * 0.1,
          scaleInterval: 0.04,
          rotateZDeg: 50,
          snapDirection: 'left',
        },
      }
      }
      width={cardWidth}
      data={articles}
      height={cardHeight * (isAndroid ? 1 : 1.2)}
      renderItem={({ item: entry }) => (
        <NewsItemCard
          height={cardHeight}
          width={cardWidth}
          title={entry.title}
          link={entry.linktocontent}
          date={entry.date}
          publisher={sources[entry.publisherID].name}
          publisherLink={sources[entry.publisherID].link}
          publisherImageLink={sources[entry.publisherID].image}
          mediaType={entry.media}
          author={entry.author}
          section={entry.section}
          imageLink={entry.imagelink}
          description={entry.description}
        />
      )}
    />
  );
}
NewsCardStack.propTypes = {
  cardHeight: PropTypes.number.isRequired,
  cardWidth: PropTypes.number.isRequired,
  sources: PropTypes.shape().isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      linktocontent: PropTypes.string,
      date: PropTypes.instanceOf(Date),
      publisherID: PropTypes.string,
      media: PropTypes.oneOf(['link', 'video']),
      author: PropTypes.string,
      section: PropTypes.string,
      imagelink: PropTypes.string,
      description: PropTypes.string,
    }),
  ).isRequired,
};

function collateSources(articles) {
  const collation = [];
  let current;
  articles.forEach((entry) => {
    if (current
      && current[0].publisherID === entry.publisherID
      && datesAreWithin(entry.date, current[0].date, 1000 * 60 * 3)) {
      current.push(entry);
    } else {
      if (current) collation.push(current.length > 1 ? current : current[0]);
      current = [entry];
    }
  });
  if (current) collation.push(current.length > 1 ? current : current[0]);
  return collation;
}

export default function Feed() {
  // const { navigation } = props;
  // const { navigate } = navigation;

  const [articles] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/newsContentGet.php',
    'DATA:Articles',
    (fetch) => {
      if (fetch.results === undefined) return undefined;
      const results = fetch.results.map(
        (entry) => ({ ...entry, date: parseDatetime(entry.publishdate) }),
      );
      return collateSources(results);
    },
  );

  const [sources] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/newsPublishersGet.php',
    'DATA:Publishers',
    (fetch) => {
      if (fetch.results === undefined) return undefined;
      return Object.fromEntries(
        fetch.results.map(({ publisherID, ...rest }) => [publisherID, rest]),
      );
    },
  );

  const cardWidth = Dimensions.get('window').width;
  const cardHeight = 270;

  return (
    <View style={{
      flex: 1, height: '100%', alignContent: 'center',
    }}
    >
      {articles
      && sources
      && (
      <FlatList
        data={articles}
        numColumns={1}
        renderItem={({ item }) => {
          if (Array.isArray(item)) {
            return (
              <NewsCardStack
                articles={item}
                sources={sources}
                cardHeight={cardHeight}
                cardWidth={cardWidth}
              />
            );
          }
          return (
            <NewsItemCard
              height={cardHeight}
              width={cardWidth}
              title={item.title}
              link={item.linktocontent}
              date={item.date}
              publisher={sources[item.publisherID].name}
              publisherLink={sources[item.publisherID].link}
              publisherImageLink={sources[item.publisherID].image}
              mediaType={item.media}
              author={item.author}
              section={item.section}
              imageLink={item.imagelink}
              description={item.description}
            />
          );
        }}
      />
      )}
    </View>
  );
}
Feed.propTypes = {
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
