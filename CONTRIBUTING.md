<!-- omit in toc -->
# Contributing to arxiv2notion

First off, thanks for taking the time to contribute! :rainbow:

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - <s>Tweet</s>X about it
> - Refer this project in your project's readme

<!-- omit in toc -->
## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [How to Develop arxiv2notion](#how-to-develop-arxiv2notion)
- [Suggesting Enhancements](#suggesting-enhancements)

## I Have a Question

Before you ask a question, it is best to search for existing [Issues](https://github.com/denkiwakame/arxiv2notion/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/denkiwakame/arxiv2notion/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute
### How to Develop arxiv2notion

#### How to build your extension locally

```bash
$ git clone https://github.com/denkiwakame/arxiv2notion.md
$ npm install
$ npm run build
$ npm run watch # debug locally
$ npm run pack  # pack to .zip extension
```

#### How to debug your extension
- `$ npm run build` build the extension locally
- navigate to `chrome://extension`
  - turn on `developer mode`
  - select `load unpacked` and open `arxiv2notion/dist`
  - you can see the extension ID like `aedplelmaaaldilfkeobdapccljxxxxx` in the loaded extension description
  - open `chrome-extension://aedplelmaaaldilfkeobdapccljxxxxx/popup.html`
- open chrome developer tools in your browser (`Ctrl + Shift + i` w/Linux)
  - you can see debugging outputs (\eg `console.log()`) in the devtools.
- once you `load unpacked` , the extension is automatically synced whenever you run `npm run build` and reload  `chrome-extension://${your-extension-id}/popup.html`
- you will be able to know more about how everything is working.

![image](https://user-images.githubusercontent.com/1871262/141605730-98917f70-f3cc-4d60-9068-29416474a086.png)

#### Change Notion database scheme
- If you attempt to add a new column like `published date` , you need to add it in your notion.so manually https://github.com/denkiwakame/arxiv2notion#getting-started or via Notion API https://developers.notion.com/reference/update-a-database

#### Get arXiv published date
- To retrieve arXiv paper information, this extension utilizes arXiv public API.
- You can see properties available in the current API https://arxiv.org/help/api/basics
- For example, if you need `published` , you can add some code to obtain the target property.
  - https://github.com/denkiwakame/arxiv2notion/blob/main/src/js/popup.js#L112-L124
  - `const published = entry.querySelector("published").textContent;`
- The retrieved contents will be posted by this line https://github.com/denkiwakame/arxiv2notion/blob/main/src/js/popup.js#L49
  - Thus you need to add properties to https://github.com/denkiwakame/arxiv2notion/blob/main/src/js/popup.js#L127

#### Post to notion.so
- Add property to https://github.com/denkiwakame/arxiv2notion/blob/main/src/js/notion.js#L62-L118
- You may need to follow the Notion API date format.　https://developers.notion.com/reference/page#date-property-values

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for arxiv2notion, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->
#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation]() carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/denkiwakame/arxiv2notion/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

<!-- omit in toc -->
#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/denkiwakame/arxiv2notion/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
- **Explain why this enhancement would be useful** to most arxiv2notion users. You may also want to point out the other projects that solved it better and which could serve as inspiration.
