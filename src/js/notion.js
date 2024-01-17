// MIT License
// Copyright (c) 2021 denkiwakame <denkivvakame@gmail.com>

export default class Notion {
  constructor() {
    this.token = null;
    this.apiBase = 'https://api.notion.com/v1/';
  }

  torkenizedHeaders() {
    return {
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
      Authorization: `Bearer ${this.token}`,
    };
  }

  async requestToken(botId) {
    const url = 'https://www.notion.so/api/v3/getBotToken';
    const body = { botId: botId };
    const headers = {
      Accept: 'application/json, */*',
      'Content-type': 'application/json',
    };
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  }

  async retrievePage(pageId) {
    try {
      const url = this.apiBase + `pages/${pageId}`;
      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: this.torkenizedHeaders(),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async checkDuplicateEntry(paperId, databaseId) {
    const entries = await this.retrieveEntry(paperId, databaseId);
    if (entries.length != 0) {
      document.dispatchEvent(
        new CustomEvent('msg', {
          detail: {
            type: 'warning',
            msg: 'This item is already bookmarked. Opening existing entry...',
          },
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return entries;
  }

  async retrieveEntry(paperId, databaseId) {
    const filter = {
      property: 'URL',
      rich_text: {
        contains: `${paperId}`,
      },
    };

    try {
      const url = this.apiBase + `databases/${databaseId}/query`;
      const body = {
        filter: filter,
      };
      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: this.torkenizedHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return data.results;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createPage(_data) {
    const data = await _data;
    const databaseId = document.getElementById('js-select-database').value;

    // XXX check if the entry has already been bookmarked
    const duplicateEntries = await this.checkDuplicateEntry(
      data.id,
      databaseId
    );
    if (duplicateEntries.length != 0) return duplicateEntries[0];

    const title = data.title;
    const abst = data.abst;
    const paperUrl = data.url;
    const authorsFormatted = data.authors.join(', ');
    const published = data.published;
    const publisher = data.publisher;
    const comment = data.comment;
    const authors = authorsFormatted.split(', ');
    const authorsMultiSelect = authors.map((author) => {
      return { name: author };
    });

    try {
      const url = this.apiBase + 'pages';
      const parent = {
        type: 'database_id',
        database_id: databaseId,
      };
      const properties = {
        Title: {
          id: 'title',
          type: 'title',
          title: [{ text: { content: title } }],
        },
        Publisher: {
          id: 'conference',
          type: 'select',
          select: { name: publisher },
        },
        URL: {
          id: 'url',
          type: 'url',
          url: paperUrl,
        },
        Abstract: {
          id: 'abstract',
          type: 'rich_text',
          rich_text: [
            {
              type: 'text',
              text: { content: abst, link: null },
              annotations: {
                bold: false,
                italic: true,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: abst,
              href: null,
            },
          ],
        },
        Authors: {
          id: 'authors',
          type: 'multi_select',
          multi_select: authorsMultiSelect,
        },
        Published: {
          id: 'published',
          type: 'date',
          date: { start: published, end: null },
        },
        Comments: {
          id: 'comment',
          type: 'url',
          url: comment,
        },
      };

      const body = {
        parent: parent,
        properties: properties,
      };
      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: this.torkenizedHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async retrieveDatabase() {
    try {
      // /v1/databases is deprecated since Notion API version: 2022-06-28
      // https://developers.notion.com/reference/get-databases
      // https://developers.notion.com/reference/post-search
      const url = this.apiBase + 'search';
      const headers = this.torkenizedHeaders();
      const body = { filter: { value: 'database', property: 'object' } };
      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      data.results?.forEach((result) => {
        const option = `<option value=${result.id}>${result.title[0].text.content}</option>`;
        document
          .getElementById('js-select-database')
          .insertAdjacentHTML('beforeend', option);
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
