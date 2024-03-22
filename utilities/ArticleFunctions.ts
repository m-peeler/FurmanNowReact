export enum MediaTypes {
  LINK = 'link',
  VIDOE = 'video',
}

export class Article {
  title: string;
  link: string;
  date: Date;
  publisherID: string;
  media: MediaTypes;
  author: string;
  section?: string;
  imagelink?: string;
  description?: string;

  constructor(title: string, link: string, date: Date, publisherID: string, media: MediaTypes, author: string,
      section?: string, imagelink?: string, description?: string
    ){
    this.title = title;
    this.link = link;
    this.date = date;
    this.publisherID = publisherID;
    this.media = media;
    this.author = author;
    this.section = section;
    this.imagelink = imagelink;
    this.description = description;
  }
}