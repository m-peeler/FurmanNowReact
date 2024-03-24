import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-native-reanimated-carousel';
import { Article } from '../../utilities/ArticleFunctions.ts';
import NewsItemCard from './NewsItemCard';
import NewsStackFrontCard from './NewsStackFrontCard';

export default function NewsCardStack({
  cardWidth, cardHeight, articles, sources,
}) {
  const carouselRef = useRef();

  const artCards = articles.map((entry) => (
    <NewsItemCard
      height={cardHeight}
      width={cardWidth}
      article={entry}
      publisher={sources[entry.publisherID].name}
      publisherLink={sources[entry.publisherID].link}
      publisherImageLink={sources[entry.publisherID].image}
    />
  ));
  artCards.unshift(
    <NewsStackFrontCard
      onPress={(index) => {
        carouselRef.current.scrollTo({ index: 1 + index, animated: true });
      }}
      cardWidth={cardWidth}
      cardHeight={cardHeight}
      articles={articles}
      publisher={sources[articles[0].publisherID]}
    />,
  );

  return (
    <Carousel
      ref={carouselRef}
      loop={false}
      snapEnabled
      {...{
        mode: 'vertical-stack',
        modeConfig: {
          showLength: 3,
          stackInterval: cardHeight * 0.1,
          scaleInterval: 0.04,
          rotateZDeg: 60,
          snapDirection: 'left',
        },
      }}
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
    PropTypes.instanceOf(Article),
  ).isRequired,
};
