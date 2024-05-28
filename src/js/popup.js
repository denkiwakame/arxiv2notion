// MIT License
// Copyright (c) 2021 denkiwakame <denkivvakame@gmail.com>

import '../scss/theme.scss';
import UIKit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import Mustache from 'mustache';
import NotionClient from './notion.js';
import thenChrome from 'then-chrome';
import urlParser from './parsers.js';

UIKit.use(Icons);

const TEST_URL = 'https://arxiv.org/abs/2308.04079';
// const TEST_URL = 'https://aclanthology.org/2023.ijcnlp-main.1/';

class UI {
  constructor() {
    this.setupProgressBar();
    this.setupSaveButton();
    this.client = new NotionClient();
    this.connectionTest();
    this.getCurrentTabUrl();
    this.setupMsgHandler();
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

  setupMsgHandler() {
    document.addEventListener('msg', (evt) => {
      console.error(evt);
      this.renderMessage(evt.detail.type, evt.detail.msg);
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
    return url?.startsWith('chrome-extension://') || false;
  }
  isArxivUrl(url) {
    return url?.startsWith('https://arxiv.org') || false;
  }
  isOpenReviewUrl(url) {
    return url?.startsWith('https://openreview.net/') || false;
  }
  isPDF(url) {
    return url && url.split('.').pop() === 'pdf';
  }
  async getPaperInfo(url) {
    this.showProgressBar();
    const data = await urlParser.parse(url);
    this.setFormContents(data.title, data.abst, data.comment, data.authors);
    return data;
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
