const ICONIZE_ID = 'obsidian-icon-folder';
const FILE_ICON_CLASS = 'lucide-file';

module.exports = class PinnedIconSyncPlugin extends require('obsidian').Plugin {
	onload() {
		this.pendingFrame = 0;
		this.observer = new MutationObserver(() => this.scheduleSync());
		this.onIconsLoaded = () => this.scheduleSync();

		const startObserving = () => {
			const emitter = this.app.plugins.plugins[ICONIZE_ID]?.api?.getEventEmitter?.();
			if (emitter && emitter !== this.iconizeEmitter) {
				this.iconizeEmitter?.off('allIconsLoaded', this.onIconsLoaded);
				this.iconizeEmitter = emitter;
				emitter.on('allIconsLoaded', this.onIconsLoaded);
			}

			const root = this.app.workspace.containerEl;
			if (root && !this.observerRoot) {
				this.observerRoot = root;
				this.observer.observe(root, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: ['class'],
				});
			}
			this.scheduleSync();
		};

		this.registerEvent(this.app.workspace.on('layout-change', startObserving));
		this.registerEvent(this.app.workspace.on('active-leaf-change', startObserving));
		startObserving();
	}

	onunload() {
		this.observer?.disconnect();
		this.iconizeEmitter?.off('allIconsLoaded', this.onIconsLoaded);
		if (this.pendingFrame) window.cancelAnimationFrame(this.pendingFrame);
	}

	scheduleSync() {
		if (this.pendingFrame) return;
		this.pendingFrame = window.requestAnimationFrame(() => {
			this.pendingFrame = 0;
			this.syncIcons();
		});
	}

	syncIcons() {
		const iconize = this.app.plugins.plugins[ICONIZE_ID];
		const data = iconize?.getData?.();
		const api = iconize?.api;
		if (!data || !api?.setIconForNode) return;

		for (const leaf of this.app.workspace.getLeavesOfType('markdown')) {
			const path = leaf.view.file?.path ?? leaf.getViewState().state?.file;
			const container = leaf.tabHeaderInnerIconEl;
			if (typeof path !== 'string' || !container) continue;

			const value = data[path];
			const iconName = typeof value === 'string' ? value : value?.iconName;
			if (typeof iconName !== 'string' || !iconName) continue;

			const hasDefaultPlaceholder = container.querySelector(`.${FILE_ICON_CLASS}`);
			if (container.getAttribute('title') !== iconName || hasDefaultPlaceholder) {
				const color = typeof value === 'object' ? value.iconColor : undefined;
				api.setIconForNode(iconName, container, color);
			}
		}
	}
};
