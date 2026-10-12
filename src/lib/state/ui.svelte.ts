import type { SkillGroup } from '../data/portfolio';

// Shared, runes-based UI state. Import `ui` anywhere; reads are reactive.
class UIState {
	loaderDone = $state(false);
	activeSkill = $state<SkillGroup | null>(null);
	introKey = $state(0);

	drawerOpen = $derived(this.activeSkill !== null);

	openSkill(group: SkillGroup) {
		this.activeSkill = group;
	}

	closeSkill() {
		this.activeSkill = null;
	}

	replayIntro() {
		this.loaderDone = false;
		this.introKey += 1;
	}
}

export const ui = new UIState();
