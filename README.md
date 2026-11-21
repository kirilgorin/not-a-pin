# Not a Pin

Shrink pinned note tabs to icons, and keep Iconize icons visible when Obsidian rebuilds a tab header, such as after pinning or unpinning a note.

## Requirements

- Obsidian 1.5.0 or later
- [Iconize](https://github.com/FlorianWoelki/obsidian-iconize)

## Install

Install **Not a Pin** from Obsidian's Community plugins directory and enable it. The plugin includes the styles that shrink pinned tabs, so the separate `mini-pinned-tab.css` snippet is not required. Keep Iconize enabled and turn on **Toggle icon in tabs** in Iconize settings.

The plugin watches tab-header changes and reapplies the icon currently assigned to each note in Iconize. It does not change Iconize's saved icon data.

## Verify release files

GitHub publishes attestations for `main.js`, `manifest.json`, and `styles.css` for each release. With [GitHub CLI](https://cli.github.com/) installed, verify a downloaded release file with:

```sh
gh attestation verify main.js -R kirilgorin/not-a-pin
```

## License

MIT. See [LICENSE](LICENSE).
