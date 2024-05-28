// MIT License
// Copyright (c) 2024 denkiwakame <denkivvakame@gmail.com>

class URLParser {
  constructor() {
    this.parsers = [];
  }

  addParser(domain, handler) {
    this.parsers.push({ domain, handler });
  }

  async parse(url) {
    for (let { domain, handler } of this.parsers) {
      if (url?.startsWith(domain)) return handler(url);
    }
    throw new Error('No perser found for the given URL');
  }
}

const arXivParser = async (url) => {
  const ARXIV_API = 'http://export.arxiv.org/api/query/search_query';
  // ref: https://info.arxiv.org/help/arxiv_identifier.html
  // e.g. (new id format: 2404.16782) | (old id format: hep-th/0702063)
  const parseArXivId = (str) => str.match(/(\d+\.\d+$)|((\w|-)+\/\d+$)/)?.[0];

  const paperId = parseArXivId(url);
  const res = await fetch(ARXIV_API + '?id_list=' + paperId.toString());
  if (res.status != 200) {
    console.error('arXiv API request failed');
    return;
  }
  const data = await res.text(); // TODO: error handling
  console.log(res.status);
  const xmlData = new window.DOMParser().parseFromString(data, 'text/xml');
  console.log(xmlData);

  const entry = xmlData.querySelector('entry');
  const id = parseArXivId(entry.querySelector('id')?.textContent);
  const paperTitle = entry.querySelector('title').textContent;
  const abst = entry.querySelector('summary').textContent;
  const authors = Array.from(entry.querySelectorAll('author')).map((author) => {
    return author.textContent.trim();
  });
  const published = entry.querySelector('published').textContent;
  const comment = entry.querySelector('comment')?.textContent ?? 'none';

  return {
    id: id,
    title: paperTitle,
    abst: abst,
    authors: authors,
    url: url,
    published: published,
    comment: comment,
    publisher: 'arXiv',
  };
};

const openReviewParser = async (url) => {
  const id = new URLSearchParams(new URL(url).search).get('id');
  const res = await fetch(url);
  const html = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(html, 'text/html');

  const authorsArray = Array.from(
    xml.querySelectorAll('meta[name="citation_author"]'),
    (author) => author.getAttribute('content')
  );
  const authors = authorsArray.length ? authorsArray : ['Anonymous'];

  const paperTitle = xml
    .querySelector('meta[name="citation_title"]')
    .getAttribute('content');

  const abst = xml
    .querySelector('meta[name="citation_abstract"]')
    .getAttribute('content');

  const date = xml
    .querySelector('meta[name="citation_online_date"]')
    .getAttribute('content');
  // -> ISO 8601 date string
  const published = new Date(date).toISOString().split('T')[0];
  const comment = 'none';

  return {
    id: id,
    title: paperTitle,
    abst: abst,
    authors: authors,
    url: url,
    published: published,
    comment: comment,
    publisher: 'OpenReview',
  };
};

const aclAnthologyParser = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(html, 'text/html');

  const id = xml
    .querySelector('meta[name="citation_doi"]')
    .getAttribute('content');
  const authors = Array.from(
    xml.querySelectorAll('meta[name="citation_author"]'),
    (author) => author.getAttribute('content')
  );

  const paperTitle = xml
    .querySelector('meta[name="citation_title"]')
    .getAttribute('content');

  const abst = 'none';
  const date = xml
    .querySelector('meta[name="citation_publication_date"]')
    .getAttribute('content');
  // -> ISO 8601 date string
  const published = new Date(date).toISOString().split('T')[0];
  const publisher = xml
    .querySelectorAll('.acl-paper-details dd')[6]
    .textContent.replaceAll('\n', '');
  const comment = xml
    .querySelector('meta[name="citation_pdf_url"]')
    .getAttribute('content');
  return {
    id: id,
    title: paperTitle,
    abst: abst,
    authors: authors,
    url: url,
    published: published,
    comment: comment,
    publisher: publisher,
  };
};

const urlParser = new URLParser();
urlParser.addParser('https://openreview.net/', openReviewParser);
urlParser.addParser('https://arxiv.org', arXivParser);
urlParser.addParser('https://aclanthology.org', aclAnthologyParser);

export default urlParser;
