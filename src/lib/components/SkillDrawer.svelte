<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { X } from '@lucide/svelte';
	import { ui } from '../state/ui.svelte.js';
	import { accentHex } from '../data/portfolio';

	let panel = $state<HTMLElement>();
	let lastFocus: HTMLElement | null = null;

	$effect(() => {
		if (ui.activeSkill) {
			lastFocus = document.activeElement as HTMLElement;
			document.documentElement.style.overflow = 'hidden';
			queueMicrotask(() => panel?.focus());
			return () => {
				document.documentElement.style.overflow = '';
				lastFocus?.focus();
			};
		}
	});

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && ui.drawerOpen) ui.closeSkill();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if ui.activeSkill}
	{@const g = ui.activeSkill}
	{@const c = accentHex[g.accent]}
	<div class="fixed inset-0 z-[60]">
		<button
			type="button"
			class="absolute inset-0 bg-black/70 backdrop-blur-sm"
			aria-label="Close drawer"
			onclick={() => ui.closeSkill()}
			transition:fade={{ duration: 300 }}
		></button>

		<div
			bind:this={panel}
			tabindex="-1"
			role="dialog"
			aria-modal="true"
			aria-labelledby="drawer-title"
			class="absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-white/[0.08] bg-[#050505] outline-none"
			transition:fly={{ x: 420, duration: 500, easing: cubicOut, opacity: 1 }}
		>
			<div class="h-px w-full" style="background:linear-gradient(90deg,{c},transparent)"></div>
			<header class="flex items-start justify-between px-8 pt-10">
				<div>
					<p class="eyebrow" style="color:{c}">System Module</p>
					<h2 id="drawer-title" class="mt-4 text-3xl font-medium tracking-tight text-white">{g.label}</h2>
				</div>
				<button
					id="drawer-close"
					type="button"
					class="grid size-9 place-items-center rounded-full border border-white/10 text-fg-2 transition-colors hover:border-white/30 hover:text-white"
					onclick={() => ui.closeSkill()}
					aria-label="Close"
				>
					<X size={16} strokeWidth={1.5} />
				</button>
			</header>

			<div class="flex-1 overflow-y-auto px-8 pt-8 pb-12">
				<p class="text-[15px] leading-relaxed text-fg-2">{g.summary}</p>

				<h3 class="eyebrow mt-12 text-fg-3">Architecture Usage</h3>
				<ul class="mt-5 space-y-4">
					{#each g.usage as u (u)}
						<li class="flex gap-4 text-[14.5px] leading-relaxed text-white">
							<span class="mt-[0.7em] h-px w-4 shrink-0" style="background:{c}"></span>{u}
						</li>
					{/each}
				</ul>

				<h3 class="eyebrow mt-12 text-fg-3">Libraries & Tools</h3>
				<ul class="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
					{#each g.items as item, i (item)}
						<li class="flex items-center justify-between py-3.5">
							<span class="text-[14.5px] text-white">{item}</span>
							<span class="font-mono text-[10px] text-fg-3">{String(i + 1).padStart(2, '0')}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}
