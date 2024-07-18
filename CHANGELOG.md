# CHANGELOG
All notable changes to this repository will be documented in this file.

## [1.4.0] - 2024-07-18
### Fixed
- updates for the latest Notion dashboard @denkiwakame [PR#19](https://github.com/denkiwakame/arxiv2notion/pull/19)

## [1.3.0] - 2024-05-28
### Added
- 🚀 **New Feature:** ACL Anthology URL support (experimental) [PR#16](https://github.com/denkiwakame/arxiv2notion/pull/16)
- 🚀 **New Feature:** support for old arXiv identifier [PR#15](https://github.com/denkiwakame/arxiv2notion/pull/15) @aralsea

## [1.2.0] - 2024-01-17
### Added
- 🚀 **New Feature:** OpenReview URL support (experimental) [PR#11](https://github.com/denkiwakame/arxiv2notion/pull/11) [PR#12](https://github.com/denkiwakame/arxiv2notion/pull/12)
### Changed
- restrict host_permission [PR#10](https://github.com/denkiwakame/arxiv2notion/pull/10)

## [1.1.0] - 2024-01-10
### Added
- 🚀 **New Feature:** check duplicated entry [PR#9](https://github.com/wangjksjtu/arxiv2notionplus/issues/1)
### Changed
- Migration to Notion API version (2022-06-28) [PR#8](https://github.com/denkiwakame/arxiv2notion/pull/8)

## [1.0.0] - 2024-01-08
### Added
- integrates [arxiv2notionplus](https://github.com/wangjksjtu/arxiv2notionplus/issues/1) [PR#6](https://github.com/denkiwakame/arxiv2notion/pull/6)
  - add publication date for easier tracking @wangjksjtu
  - add comment parser for quick access to the potential project homepage or code link (if available) @wangjksjtu
- Refactor the above codes & fix bugs by @denkiwakame
- CONTRIBUTING.md @denkiwakame
- CHANGELOG.md @denkiwakame
- Linter / Formatter @denkiwakame

### Changed
- Replace the author field from `text` to `multi-select` to fully leverage the search/filter in notion @wangjksjtu
- Release a public notion database/table [here](https://denkiwakame.notion.site/597cdd58bded4375b1cbe073b2ed6f5d?v=63fcbfda57824b239b66e52dde841cdf) @denkiwakame
- Update UI to improve the navigation to the button @denkiwakame

### Fixed
- Migration to Manifest V3 @denkiwakame [PR#7](https://github.com/denkiwakame/arxiv2notion/pull/7)

## [0.0.1] - 2021-06-07
### Added
- initial release from @denkiwakame
