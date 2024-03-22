import React from 'react';
import PropTypes from 'prop-types';
import NewsYoutubeCard from './NewsYoutubeCard';
import NewsLinkCard from './NewsLinkCard';
import { Article } from '../../utilities/ArticleFunctions';

export default function NewsItemCard({
  height, width, article, publisher, publisherLink, publisherImageLink,
}) {
  switch (article.media) {
    case 'video':
      return (
        <NewsYoutubeCard
          height={height}
          width={width}
          article={article}
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
          article={article}
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
  article: PropTypes.instanceOf(Article).isRequired,
  publisher: PropTypes.string.isRequired,
  publisherLink: PropTypes.string.isRequired,
  publisherImageLink: PropTypes.string,
};
NewsItemCard.defaultProps = {
  publisherImageLink: undefined,
};
