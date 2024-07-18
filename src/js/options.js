// MIT License
// Copyright (c) 2021 denkiwakame <denkivvakame@gmail.com>

import '../scss/theme.scss';
import UIKit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import Mustache from 'mustache';
import NotionClient from './notion.js';

UIKit.use(Icons);

class TokenManager {
  constructor() {
    this.storageKey = 'botId';
    this.setupInput();
    this.setupSaveButton();
    this.client = new NotionClient();
  }
  toggleVisible() {
    if (this.input.type == 'password') {
      this.input.type = 'text';
      this.visibleButton.setAttribute('uk-icon', 'unlock');
    } else {
      this.input.type = 'password';
      this.visibleButton.setAttribute('uk-icon', 'lock');
    }
  }
  setupSaveButton() {
    this.saveButton = document.getElementById('js-save-btn');
    this.saveButton.addEventListener('click', () => {
      this.saveIntegrationId();
    });
    this.visibleButton = document.getElementById('js-visible-btn');
    this.visibleButton.addEventListener('click', () => {
      this.toggleVisible();
    });
  }
  setupInput() {
    this.input = document.getElementById('js-token-input');
    if (!chrome.storage) return;
    chrome.storage.local.get(this.storageKey, (d) => {
      if (!d) return;
      this.input.value = d.botId;
    });
  }
  async saveIntegrationId() {
    const botId = this.input.value;
    if (!botId.trim().length || botId.length != 36) {
      console.log('invalid!');
      this.renderMessage('danger', 'Invalid integration ID (36 char).');
      return;
    }
    console.log(botId);
    await chrome.storage.local.set({
      botId: botId,
    });
    chrome.storage.local.get(this.storageKey, (d) => {
      console.log('chrome storage', d);
      this.renderMessage('success', 'integration ID is successfully saved.');
      this.connectionTest();
    });
  }
  async connectionTest() {
    chrome.storage.local.get(this.storageKey, (d) => {
      const botId = d.botId;
      const data = this.client.requestToken(botId);
      console.log(data);
      if (data.name == 'UnauthorizedError') {
        this.renderMessage('danger', 'You are not logged in notion.so.');
      } else {
        this.renderMessage('success', 'Successfully connected with notion.so.');
      }
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

new TokenManager();
