# arxiv2notion
[![build](https://github.com/denkiwakame/arxiv2notion/actions/workflows/build.yaml/badge.svg)](https://github.com/denkiwakame/arxiv2notion/actions/workflows/build.yaml) [![lint](https://github.com/denkiwakame/arxiv2notion/actions/workflows/lint.yaml/badge.svg)](https://github.com/denkiwakame/arxiv2notion/actions/workflows/lint.yaml)

Easy-to-use arXiv clipper for [Notion](https://www.notion.so) based on [Notion API](https://developers.notion.com/)

![demo](doc/arxiv2notion.gif)
![notion](doc/nerf_example2.png)

## ⬇️ Installation
- download extension package from https://github.com/denkiwakame/arxiv2notion/releases
- for Chrome, navigate to `chrome://extension`
  - drag and drop the extension from your file manager anywhere onto the extensions page
  - or unzip the extension and `load unpacked` in developer mode

## ⚙️ Setup

### :one: Add arxiv2notion integration
- follow the instruction of [Notion API](https://developers.notion.com/docs/getting-started)
  - navigate to [My Integrations](https://www.notion.so/my-integrations)
  - `+ New integration`
  - **associated workspace:** select your workspace where you save arXiv articles

<img src="doc/my_integration.png" height="200">

### :two: Configure the extension
- right-click on the extension icon > `Options`
  - copy **integration id (not the secret token!)** (see figures below) from `https://hwww.notion.so/my-integrations/internal/${integration-id}`
  - paste the `integration id` and click on `+` button.
  - if your entered id is valid, you can see the following callback messages.

```
In order to avoid storing Notion API key directoly onto chrome local storage,
arxiv2notion requests API token on-demand via integration ID when you are logged in.
Note that you must be logged in to notion.so when you use this extension.
```

<img src="doc/integration_id.png" height="250"><img src="doc/option.png" height="250">

### :three: Create databases in Notion
#### from template (recommended)
- clone the public template [here](https://denkiwakame.notion.site/597cdd58bded4375b1cbe073b2ed6f5d?v=63fcbfda57824b239b66e52dde841cdf) to your own notion workspace
- add connection to target databases via `...` > `+ Add connections` > `arxiv2notion`

![invite_integration](doc/connection.png)

- you can switch multiple DBs by adding the connection to these pages, respectively.

<img src="doc/multiple_db.png" height="200">


#### or manually
- alternatively, you can follow the following steps to create database from scratch in notion
- login to [notion.so](https://www.notion.so) by admin user
- create databases where you save arXiv articles
  - **follow this instruction** https://www.notion.so/guides/creating-a-database , do **NOT** create a new database by `/database` !
  - **add properties listed below.**
  - note that you should create **extactly the same properties with listed names.**

|property|type|
|-----|-----|
|Title|Title|
|URL|URL|
|Authors|Multi-Select|
|Abstract|Text|
|Published|Date|
|Comments|URL|
|Publisher|Select|

### :bulb: Working with Notion AI Property (optional)
- [Notion AI Property](https://www.notion.so/ja-jp/help/guides/5-ai-prompts-to-surface-fresh-insights-from-your-databases) allows you to add **custom autofill property** to each DB record.
- Add column to your Notion DB and select `AI custom autofill`
- Set any prompt you like (e.g. summarization, extracting key ideas ...)
  <img src="https://github.com/denkiwakame/arxiv2notion/assets/1871262/b1a6149a-cf55-41f8-9e83-4578a64530e6" height="200"><img src="https://github.com/denkiwakame/arxiv2notion/assets/1871262/8b30bd04-ffc3-4525-b684-90f8b62dda92" height="200">
- Save an article via `arxiv2notion` ,and then the preset `AI property` will be automatically generated.
  ![image](https://github.com/denkiwakame/arxiv2notion/assets/1871262/ad698cf0-dce0-4b29-8511-47f4c796a694)

## :technologist: Build locally (for Developers)
- See also [CONTRIBUTING.md](CONTRIBUTING.md)

```bash
$ git clone https://github.com/denkiwakame/arxiv2notion.git
$ npm install
$ npm run build
$ npm run watch # debug locally
$ npm run pack  # packaging to zip
```

## Contributors
- Maintainers: @denkiwakame, @wangjksjtu
<a href="https://github.com/denkiwakame/arxiv2notion/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=denkiwakame/arxiv2notion" />
</a>
