// Benzinga

export interface BenzingaGetNewsParams {
  page?: number;
  pageSize?: number;
  displayOutput?: 'headline' | 'abstract' | 'full';
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  updatedSince?: number;
  publishedSince?: number;
  sort?:
    | 'id:asc'
    | 'id:desc'
    | 'created:asc'
    | 'created:desc'
    | 'updated:asc'
    | 'updated:desc';
  isin?: string;
  cusip?: string;
  tickers?: string;
  channels?: string;
  topics?: string;
  authors?: string;
  content_types?: string;
}

export interface BenzingaNewsItem {
  id: number;
  author: string;
  created: string;
  updated: string;
  title: string;
  teaser: string;
  body: string;
  url: string;
  image: Array<{
    size: string;
    url: string;
  }>;
  channels: Array<{
    name: string;
  }>;
  stocks: Array<{
    name: string;
  }>;
  tags: Array<{
    name: string;
  }>;
}
