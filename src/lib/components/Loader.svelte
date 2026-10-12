<script lang="ts">
	import { onMount } from 'svelte';
	import { ui } from '../state/ui.svelte.js';

	const STORAGE_KEY = 'jc:intro-seen';
	const DURATION = 2600; // full sequence incl. fade-out
	const SAFETY = 3000; // hard fallback

	let mounted = $state(true);

	const signals = [
		{ label: 'Interface', color: '#1687FF', d: 'M-170 0 H-46', lx: -170, ly: -12, anchor: 'start', from: 'translate(-60px,0)' },
		{ label: 'Data', color: '#24D7FF', d: 'M0 -170 V-46', lx: 10, ly: -160, anchor: 'start', from: 'translate(0,-60px)' },
		{ label: 'Logic', color: '#EAB66A', d: 'M170 0 H46', lx: 170, ly: 22, anchor: 'end', from: 'translate(60px,0)' },
		{ label: 'Intelligence', color: '#EAB66A', d: 'M0 170 V46', lx: -10, ly: 166, anchor: 'end', from: 'translate(0,60px)' }
	] as const;

	function finish() {
		if (!mounted) return;
		mounted = false;
		ui.loaderDone = true;
		document.documentElement.style.overflow = '';
	}

	onMount(() => {
		const root = document.documentElement;
		if (root.hasAttribute('data-intro-seen')) {
			finish();
			return;
		}
		try {
			sessionStorage.setItem(STORAGE_KEY, '1');
		} catch {}
		root.style.overflow = 'hidden';

		const t1 = setTimeout(finish, DURATION);
		const t2 = setTimeout(finish, SAFETY);
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && finish();
		addEventListener('keydown', onKey);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			removeEventListener('keydown', onKey);
			root.style.overflow = '';
		};
	});
</script>

{#if mounted}
	<div
		class="signal-loader fixed inset-0 z-[100] grid place-items-center bg-black"
		role="presentation"
		aria-hidden="true"
		onclick={finish}
	>
		<svg viewBox="-200 -200 400 400" class="h-[min(78vmin,560px)] w-[min(78vmin,560px)] overflow-visible">
			<defs>
				<radialGradient id="ld-pulse">
					<stop offset="0%" stop-color="#EAB66A" stop-opacity="0.55" />
					<stop offset="60%" stop-color="#EAB66A" stop-opacity="0.08" />
					<stop offset="100%" stop-color="#EAB66A" stop-opacity="0" />
				</radialGradient>
			</defs>

			<!-- Phase 1–2: four signals glide in, then retract into the node -->
			{#each signals as s, i (s.label)}
				<g class="ld-signal" style="--from:{s.from}; --i:{i}">
					<path
						class="ld-line"
						d={s.d}
						stroke={s.color}
						stroke-width="1.2"
						stroke-linecap="round"
						pathLength="1"
						fill="none"
					/>
					<text
						x={s.lx}
						y={s.ly}
						text-anchor={s.anchor}
						fill={s.color}
						class="ld-label"
						font-family="JetBrains Mono, monospace"
						font-size="9"
						letter-spacing="2.4">{s.label.toUpperCase()}</text
					>
				</g>
			{/each}

			<!-- Phase 3: warm gold pulse -->
			<circle class="ld-pulse" r="90" fill="url(#ld-pulse)" />
			<circle class="ld-ring" r="34" fill="none" stroke="#EAB66A" stroke-width="0.8" />

			<!-- Phase 4: trajectory ellipse expands outward -->
			<ellipse class="ld-orbit" rx="70" ry="28" fill="none" stroke="#EAB66A" stroke-width="0.8" transform="rotate(-18)" />
			<ellipse class="ld-orbit ld-orbit-b" rx="70" ry="28" fill="none" stroke="#1687FF" stroke-width="0.8" transform="rotate(24)" />

			<!-- Phase 2: JC monogram -->
			<g class="ld-mono">
				<g transform="translate(-32 -32)">
					<path class="ld-mono-path" d="M28 12 V38 A10 10 0 0 1 8 38" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" pathLength="1" />
					<path class="ld-mono-path ld-mono-late" d="M56 20 A17 17 0 1 0 56 44" stroke="#EAB66A" stroke-width="2" stroke-linecap="round" fill="none" pathLength="1" />
					<circle class="ld-node" cx="56" cy="20" r="2" fill="#EAB66A" />
				</g>
			</g>
		</svg>

		<p class="ld-caption eyebrow absolute bottom-10 left-1/2 -translate-x-1/2 text-fg-3">
			From signal to system
		</p>
	</div>
{/if}

<style>
	.signal-loader {
		animation: ld-out 0.4s 2.2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
		cursor: pointer;
	}
	@keyframes ld-out {
		to {
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
		}
	}

	/* Phase 1 (0–0.8s): glide in. Phase 2 (0.8–1.3s): retract toward center */
	.ld-signal {
		opacity: 0;
		animation: ld-glide 0.8s calc(var(--i) * 0.06s) cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	@keyframes ld-glide {
		from {
			opacity: 0;
			transform: var(--from);
		}
		to {
			opacity: 1;
			transform: translate(0, 0);
		}
	}
	.ld-line {
		stroke-dasharray: 1 1;
		stroke-dashoffset: 1;
		animation:
			ld-draw 0.7s 0.05s cubic-bezier(0.65, 0, 0.35, 1) forwards,
			ld-retract 0.5s 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
	}
	@keyframes ld-draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes ld-retract {
		to {
			stroke-dashoffset: -1;
		}
	}
	.ld-label {
		animation: ld-fade 0.4s 0.9s ease forwards;
	}
	@keyframes ld-fade {
		to {
			opacity: 0;
		}
	}

	/* Phase 2 (0.8–1.6s): monogram resolves */
	.ld-mono {
		transform-origin: 0 0;
		animation: ld-mono-out 0.45s 2.15s cubic-bezier(0.65, 0, 0.35, 1) forwards;
	}
	.ld-mono-path {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: ld-draw 0.7s 0.85s cubic-bezier(0.65, 0, 0.35, 1) forwards;
	}
	.ld-mono-late {
		animation-delay: 1s;
	}
	.ld-node {
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: ld-node 0.6s 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	@keyframes ld-node {
		0% {
			opacity: 0;
			transform: scale(0.2);
		}
		50% {
			opacity: 1;
			transform: scale(2.2);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes ld-mono-out {
		to {
			opacity: 0;
			transform: scale(1.6);
		}
	}

	/* Phase 3 (1.6–2.2s): gold pulse */
	.ld-pulse {
		opacity: 0;
		transform-origin: 0 0;
		animation: ld-pulse 0.7s 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	@keyframes ld-pulse {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}
		40% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: scale(1.4);
		}
	}
	.ld-ring {
		opacity: 0;
		transform-origin: 0 0;
		animation: ld-ring 0.7s 1.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	@keyframes ld-ring {
		0% {
			opacity: 0.9;
			transform: scale(0.6);
		}
		100% {
			opacity: 0;
			transform: scale(2.4);
		}
	}

	/* Phase 4 (2.2–2.6s): expand into hero trajectory */
	.ld-orbit {
		opacity: 0;
		transform-origin: 0 0;
		animation: ld-orbit 0.5s 2.1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
	}
	.ld-orbit-b {
		animation-delay: 2.15s;
	}
	@keyframes ld-orbit {
		0% {
			opacity: 0;
			scale: 0.4;
		}
		40% {
			opacity: 0.9;
		}
		100% {
			opacity: 0;
			scale: 4;
		}
	}

	.ld-caption {
		opacity: 0;
		animation:
			ld-cap-in 0.6s 0.3s ease forwards,
			ld-fade 0.3s 2s ease forwards;
	}
	@keyframes ld-cap-in {
		to {
			opacity: 1;
		}
	}
</style>
