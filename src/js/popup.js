// MIT License
// Copyright (c) 2022 denkiwakame <denkivvakame@gmail.com>

import '../scss/theme.scss';
import UIKit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import Mustache from 'mustache';
import NotionClient from './notion.js';
import thenChrome from 'then-chrome';

UIKit.use(Icons);

const TEST_URL = 'https://arxiv.org/abs/2308.04079';
const ARXIV_API = 'http://export.arxiv.org/api/query/search_query';

class UI {
  constructor() {
    this.setupProgressBar();
    this.setupSaveButton();
    this.client = new NotionClient();
    this.connectionTest();
    this.getCurrentTabUrl();
  }

  getCurrentTabUrl() {
    document.addEventListener('DOMContentLoaded', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        this.data = this.isDebugUrl(url)
          ? this.getPaperInfo(TEST_URL)
          : this.getPaperInfo(url);
      });
    });
  }

  async connectionTest() {
    chrome.storage.local.get('botId', async (d) => {
      if (!this.client.token) {
        const botId = d.botId;
        const data = await this.client.requestToken(botId);
        if (data.name == 'UnauthorizedError') {
          this.renderMessage('danger', 'You are not logged in notion.so.');
        } else {
          this.client.token = data.token;
        }
      }
      this.client.retrieveDatabase();
    });
  }

  setupSaveButton() {
    document.getElementById('js-save').addEventListener('click', async () => {
      this.showProgressBar();
      const data = await this.client.createPage(this.data);
      if (data.status && data.status == 400) {
        this.renderMessage('danger', `[${data.code}] ${data.message}`);
        return;
      } else {
        thenChrome.tabs.create({
          url: `https://notion.so/${data.id.replaceAll('-', '')}`,
        });
      }
    });
  }

  setupProgressBar() {
    this.progressBar = document.getElementById('js-progressbar');
  }

  showProgressBar() {
    clearInterval(this._animate);
    this.progressBar.value = 0;
    this._animate = setInterval(() => {
      this.progressBar.value += 20;
      if (this.progressBar.value >= this.progressBar.max) {
        clearInterval(this._animate);
      }
    }, 200);
  }
  isDebugUrl(url) {
    return url && url.indexOf('chrome-extension://') === 0;
  }
  isArxivUrl(url) {
    return url && url.indexOf('https://arxiv.org') === 0;
  }
  isPDF(url) {
    return url && url.split('.').pop() === 'pdf';
  }
  async getPaperInfo(url) {
    if (this.isArxivUrl(url)) return this.getArXivInfo(url);
    //     if (this.isPDF(url)) return this.getPDFInfo(url); // TODO
  }
  parseArXivId(str) {
    const paperId = str.match(/\d+.\d+/);
    return paperId;
  }

  setFormContents(paperTitle, abst, comment, authors) {
    document.getElementById('js-title').value = paperTitle;
    document.getElementById('js-abst').value = abst;
    //     document.getElementById('js-published').value = published;
    document.getElementById('js-comment').value = comment;
    authors.forEach((author) => {
      const template = `<span class="uk-badge uk-margin-small-right uk-margin-small-top">{{ text }}</span>`;
      const rendered = Mustache.render(template, { text: author });
      document
        .getElementById('js-chip-container')
        .insertAdjacentHTML('beforeend', rendered);
    });
  }

  async getArXivInfo(url) {
    this.showProgressBar();
    const paperId = this.parseArXivId(url);

    const res = await fetch(ARXIV_API + '?id_list=' + paperId.toString());
    if (res.status != 200) {
      console.log('[ERR] arXiv API request failed');
      return;
    }
    const data = await res.text(); // TODO: error handling
    console.log(res.status);
    const xmlData = new window.DOMParser().parseFromString(data, 'text/xml');
    console.log(xmlData);

    const entry = xmlData.querySelector('entry');
    const paperTitle = entry.querySelector('title').textContent;
    const abst = entry.querySelector('summary').textContent;
    const authors = Array.from(entry.querySelectorAll('author')).map(
      (author) => {
        return author.textContent.trim();
      }
    );
    const published = entry.querySelector('published').textContent;
    const comment_query = entry.querySelector('comment');
    const comment = !comment_query ? 'none' : comment_query.textContent;
    this.setFormContents(paperTitle, abst, comment, authors);
    return {
      title: paperTitle,
      abst: abst,
      authors: authors,
      url: url,
      published: published,
      comment: comment,
    };
  }

  renderMessage(type, message, overwrite = false) {
    // type: warning, danger, success, primary
    const template = `<div class="uk-alert-{{type}}" uk-alert><a class="uk-alert-close" uk-close></a><p>{{message}}</p></div>`;
    const rendered = Mustache.render(template, {
      type: type,
      message: message,
    });
    if (overwrite) {
      document.getElementById('js-message-container').innerHTML = rendered;
    } else {
      document
        .getElementById('js-message-container')
        .insertAdjacentHTML('beforeend', rendered);
    }
  }
}

new UI();
