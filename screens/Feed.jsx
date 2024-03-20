import React, { useEffect, useState } from 'react';
import {
  View, FlatList,
  Dimensions,
  Image, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-reanimated-carousel';
import { useTheme } from '@react-navigation/native';
import Page from '../utilities/Page';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import { parseDatetime } from '../utilities/DateTimeFunctions';
import NewsYoutubeCard from '../components/news/NewsYoutubeCard';
import NewsLinkCard from '../components/news/NewsLinkCard';
import NewsCardWrapper from '../components/news/NewsCardWrapper';
import ARROW from '../assets/icon/creatype-arrow.png';

function datesAreWithin(first, second, milliseconds) {
  return Math.abs(first.getTime() - second.getTime()) < milliseconds;
}

function NewsItemCard({
  height, width, title, description, author, date, mediaType, section,
  link, imageLink, publisher, publisherLink, publisherImageLink,
}) {
  switch (mediaType) {
    case 'video':
      return (

        <NewsYoutubeCard
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
function NewsStackFrontCard({
  cardWidth, cardHeight, articles, publisher,
}) {
  const haveLinks = articles
    .filter((entry) => 'imagelink' in entry && entry.imagelink);
  const index = Math.floor(Math.random() * haveLinks.length);
  const [frontArticle, setFrontArticle] = useState(
    index < haveLinks.length ? haveLinks[index] : undefined,
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setFrontArticle(haveLinks[Math.floor(Math.random() * haveLinks.length)]);
    }, 15_000);
    return () => { clearInterval(interval); };
  }, [haveLinks]);

  const { colors, fonts } = useTheme();
  return (
    <NewsCardWrapper
      height={cardHeight}
      width={cardWidth}
      publisher={publisher.name}
      publisherLink={publisher.link}
      color={colors.card}
    >
      <Image style={{ height: '100%', width: '100%', borderRadius: 10 }} source={{ uri: frontArticle ? frontArticle.imagelink : '' }} />
      <View style={{
        height: '100%', width: '100%', position: 'absolute', justifyContent: 'flex-end',
      }}
      >
        <View style={{
          margin: 10, padding: 5, borderRadius: 4, backgroundColor: `${colors.card}88`,
        }}
        >
          <Text style={{ fontFamily: fonts.italic, color: colors.text }}>
            {`${frontArticle ? `"${frontArticle.title}", by ${frontArticle.author}` : ''}`}
          </Text>
        </View>
      </View>
      <View style={{
        width: '40%', position: 'absolute', left: 0, borderTopLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: colors.card,
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
    </NewsCardWrapper>
  );
}
NewsStackFrontCard.propTypes = {
  cardWidth: PropTypes.number.isRequired,
  cardHeight: PropTypes.number.isRequired,
  articles: PropTypes.arrayOf(PropTypes.shape({
    imagelink: PropTypes.string,
  })).isRequired,
  publisher: PropTypes.shape({
    name: PropTypes.string,
    link: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

function NewsCardStack({
  cardWidth, cardHeight, articles, sources,
}) {
  const artCards = articles.map((entry) => (
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
  ));
  artCards.unshift(
    <NewsStackFrontCard
      cardWidth={cardWidth}
      cardHeight={cardHeight}
      articles={articles}
      publisher={sources[articles[0].publisherID]}
    />,
  );
  return (
    <Carousel
      loop={false}
      snapEnabled
      {...{
        mode: 'vertical-stack',
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
      data={artCards}
      height={cardHeight * 1.2}
      renderItem={({ item: entry }) => (
        entry
      )}
      panGestureHandlerProps={{
        activeOffsetX: [-10, 10],
      }}
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
      current.unshift(entry);
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
