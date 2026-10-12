<script lang="ts">
	import { onMount } from 'svelte';
	import Monogram from './Monogram.svelte';
	import { ui } from '../state/ui.svelte.js';

	interface Props {
		imageUrl?: string;
		name?: string;
		firstLine?: string;
		secondLine?: string;
		finalLine?: string;
		forcePlay?: boolean;
	}

	let {
		imageUrl = '/valley.jpg',
		name = 'Janith Chathusha',
		firstLine = 'Driven by curiosity.',
		secondLine = 'Learning. Building. Becoming.',
		finalLine = 'Turning ideas into possibilities.',
		forcePlay = false
	}: Props = $props();

	const SESSION_KEY = 'jc:cinematic-intro-v4';

	let mounted = $state(true);
	let canvas = $state<HTMLCanvasElement>();
	let overlay = $state<HTMLDivElement>();
	let currentLine = $state('');
	let lineOpacity = $state(0);
	let copyOpacity = $state(1);
	let topOpacity = $state(1);
	let overlayOpacity = $state(1);

	const clamp = (n: number) => Math.max(0, Math.min(1, n));
	const ease = (n: number) => {
		n = clamp(n);
		return n * n * (3 - 2 * n);
	};

	function finish(reason = 'completed') {
		if (!mounted) return;
		mounted = false;
		ui.loaderDone = true;
		document.documentElement.style.overflow = '';
		if (reason === 'completed' || reason === 'skipped') {
			try {
				sessionStorage.setItem(SESSION_KEY, '1');
			} catch {}
		}
	}

	onMount(() => {
		currentLine = firstLine;

		// Session check (unless forcePlay is active)
		try {
			if (!forcePlay && sessionStorage.getItem(SESSION_KEY) === '1') {
				finish('already-seen');
				return;
			}
		} catch {}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			finish('reduced-motion');
			return;
		}

		document.documentElement.style.overflow = 'hidden';

		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		const plate = document.createElement('canvas');
		const pc = plate.getContext('2d');
		if (!ctx || !pc) {
			finish('canvas-unavailable');
			return;
		}

		let stopped = false;
		let running = false;
		let animation = 0;
		let startedAt = 0;
		let width = 1;
		let height = 1;
		let dpr = 1;
		let elapsed = 0;
		let captionIndex = -1;

		const image = new Image();
		image.decoding = 'async';

		function placement(t: number) {
			const zoom = 1 + 0.025 * ease(t / 3.5) + 0.04 * ease((t - 3.5) / 0.8);
			const scale = Math.min((height * 1.12) / 1104, width / 736) * zoom;
			return { scale, x: width / 2 - 368 * scale, y: height * 0.55 - 654 * scale };
		}

		// Signature Editorial Color Grading: Pure Warm Gold (#EAB66A) & Incandescent White
		function glow(x: number, y: number, radius: number, opacity: number, colorType: 'gold' | 'white' = 'gold') {
			if (radius <= 0 || opacity <= 0 || !ctx) return;
			const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
			if (colorType === 'gold') {
				g.addColorStop(0, `rgba(255, 250, 240, ${opacity})`);
				g.addColorStop(0.25, `rgba(234, 182, 106, ${opacity * 0.85})`);
				g.addColorStop(0.65, `rgba(217, 119, 6, ${opacity * 0.22})`);
				g.addColorStop(1, 'rgba(0, 0, 0, 0)');
			} else {
				g.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
				g.addColorStop(0.3, `rgba(255, 248, 230, ${opacity * 0.75})`);
				g.addColorStop(0.7, `rgba(234, 182, 106, ${opacity * 0.2})`);
				g.addColorStop(1, 'rgba(0, 0, 0, 0)');
			}
			ctx.fillStyle = g;
			ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
		}

		function render(t: number) {
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			// Pure Pitch Black (#000000) base canvas
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, width, height);

			const m = placement(t);
			const s = m.scale;
			const x = width / 2;
			const chest = m.y + 654 * s;
			const feet = m.y + 670 * s;

			// Ambient Warm Gold Atmosphere behind the artwork (seamlessly dark)
			const atmosphere = ctx.createRadialGradient(x, chest, 2, x, chest, Math.max(width, height) * 0.75);
			atmosphere.addColorStop(0, 'rgba(234, 182, 106, 0.14)');
			atmosphere.addColorStop(0.35, 'rgba(20, 15, 10, 0.4)');
			atmosphere.addColorStop(0.75, '#000000');
			ctx.fillStyle = atmosphere;
			ctx.fillRect(0, 0, width, height);

			// Artwork (feathered seamlessly on all 4 borders into pitch black)
			ctx.globalAlpha = 0.8 + 0.2 * ease(t / 0.8);
			ctx.drawImage(plate, m.x, m.y, 736 * s, 1104 * s);
			ctx.globalAlpha = 1;

			// Elliptical Vignette dissolving image bounds into pure black
			const radialVignette = ctx.createRadialGradient(
				x,
				chest,
				Math.min(width, height) * 0.28,
				x,
				chest,
				Math.max(width, height) * 0.65
			);
			radialVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
			radialVignette.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
			radialVignette.addColorStop(0.85, 'rgba(0, 0, 0, 0.92)');
			radialVignette.addColorStop(1, '#000000');
			ctx.fillStyle = radialVignette;
			ctx.fillRect(0, 0, width, height);

			// Floating Ambient Starlight Dust
			for (let i = 0; i < 16; i++) {
				const pt = (t * 0.12 + i * 0.062) % 1;
				const px = x + Math.sin(i * 3.7 + t * 0.7) * (width * 0.36);
				const py = height * 0.85 - pt * height * 0.75;
				const pAlpha = Math.sin(pt * Math.PI) * 0.4;
				ctx.fillStyle = `rgba(234, 182, 106, ${pAlpha})`;
				ctx.beginPath();
				ctx.arc(px, py, 0.85, 0, Math.PI * 2);
				ctx.fill();
			}

			const progress = clamp((t - 0.7) / 2.8);
			const travel = 1 - Math.pow(1 - progress, 1.7);
			const y = m.y + (85 + (654 - 85) * travel) * s;
			const absorb = 1 - ease((t - 3.12) / 0.38);
			const strength = ease(t / 0.55) * absorb;

			// ─── Celestial Star Descending (Pure Warm Gold & White Corona) ───
			if (t < 3.5) {
				const length = (50 + 120 * Math.sin(progress * Math.PI)) * s * strength;

				// Radiant Light Filament Trail
				const trail = ctx.createLinearGradient(x, y - length, x, y);
				trail.addColorStop(0, 'rgba(234, 182, 106, 0)');
				trail.addColorStop(0.65, `rgba(234, 182, 106, ${0.45 * strength})`);
				trail.addColorStop(1, `rgba(255, 245, 220, ${0.95 * strength})`);
				ctx.fillStyle = trail;
				ctx.fillRect(x - 1, y - length, 2, length);

				// Star glowing corona
				glow(x, y, Math.max(22, 54 * s) * (0.4 + 0.6 * absorb), 0.95 * strength, 'gold');

				// Brilliant incandescent star center
				ctx.fillStyle = `rgba(255, 255, 255, ${strength})`;
				ctx.beginPath();
				ctx.arc(x, y, Math.max(1.8, 3.8 * s) * (0.3 + 0.7 * absorb), 0, Math.PI * 2);
				ctx.fill();

				// 4-Point Celestial Diffraction Cross
				ctx.strokeStyle = `rgba(255, 248, 235, ${0.9 * strength})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(x - 12 * absorb, y);
				ctx.lineTo(x + 12 * absorb, y);
				ctx.moveTo(x, y - 20 * absorb);
				ctx.lineTo(x, y + 20 * absorb);
				ctx.stroke();

				// Concentric Star Halo Ring
				ctx.strokeStyle = `rgba(234, 182, 106, ${0.45 * strength})`;
				ctx.lineWidth = 0.75;
				ctx.beginPath();
				ctx.arc(x, y, 9 * absorb, 0, Math.PI * 2);
				ctx.stroke();
			}

			// ─── Absorption Moment: Star enters chest ───
			const entered = ease((t - 3.06) / 0.44);
			if (entered) {
				glow(x, chest, 32 * s, 0.9 * entered, 'gold');

				// Water surface reflection ripples
				ctx.save();
				ctx.translate(x, feet + 70 * s);
				ctx.scale(0.18, 1);
				glow(0, 0, 130 * s, 0.65 * entered, 'gold');
				ctx.restore();

				// Expanding chest resonance rings
				ctx.strokeStyle = `rgba(234, 182, 106, ${0.9 * entered})`;
				ctx.lineWidth = 1.2;
				ctx.beginPath();
				ctx.ellipse(x, chest + 2 * s, 5 * s, 12 * s, 0, -Math.PI, 0);
				ctx.stroke();
			}

			// ─── Majestic Radiance Bloom ───
			if (t >= 3.5) {
				const q = ease((t - 3.5) / 0.95);
				const radius = 20 + q * Math.hypot(width, height) * 1.35;

				glow(x, chest, radius, 0.92 * q, 'gold');

				// Radiance shockwave rings in gold
				ctx.strokeStyle = `rgba(234, 182, 106, ${0.5 * (1 - q)})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.arc(x, chest, 12 + q * 300 * s, 0, Math.PI * 2);
				ctx.stroke();

				// Ambient golden illumination
				ctx.fillStyle = `rgba(255, 248, 235, ${0.28 * ease((t - 3.8) / 0.65)})`;
				ctx.fillRect(0, 0, width, height);
			}

			// Narrative captions
			const index = t < 1.6 ? 0 : t < 3.3 ? 1 : 2;
			if (captionIndex !== index) {
				currentLine = [firstLine, secondLine, finalLine][index];
				captionIndex = index;
			}
			const localStart = index === 0 ? 0 : index === 1 ? 1.6 : 3.3;
			const localEnd = index === 0 ? 1.6 : index === 1 ? 3.3 : 4.5;
			lineOpacity = ease((t - localStart) / 0.22) * (1 - ease((t - (localEnd - 0.2)) / 0.2));
			copyOpacity = 1 - ease((t - 4.05) / 0.38);
			topOpacity = 1 - ease((t - 4.15) / 0.35);

			// Dissolve overlay smoothly, revealing the hero section underneath
			overlayOpacity = 1 - ease((t - 4.35) / 0.65);
		}

		function tick(now: number) {
			if (stopped || !running) return;
			elapsed = Math.min((now - startedAt) / 1000, 5);
			if (elapsed >= 5) {
				finish('completed');
				return;
			}
			render(elapsed);
			animation = requestAnimationFrame(tick);
		}

		function resize() {
			if (!overlay || !canvas) return;
			const rect = overlay.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			if (running && !stopped) render(elapsed);
		}

		const ro = new ResizeObserver(resize);
		if (overlay) ro.observe(overlay);
		resize();

		const watchdog = setTimeout(() => finish('asset-timeout'), 7000);

		image.onload = () => {
			if (stopped) return;
			clearTimeout(watchdog);
			plate.width = 736;
			plate.height = 1104;

			// Draw base image onto plate
			pc.drawImage(image, 0, 0, 736, 1104);

			// ── Cinematic Lighting Grade (Warm Gold Accent, Pure Obsidian Dark Contrast) ──
			pc.save();
			// Soft-light glow on central focal highlights
			pc.globalCompositeOperation = 'soft-light';
			const highlightGlow = pc.createRadialGradient(368, 550, 20, 368, 654, 450);
			highlightGlow.addColorStop(0, 'rgba(255, 245, 220, 0.55)');
			highlightGlow.addColorStop(0.5, 'rgba(234, 182, 106, 0.25)');
			highlightGlow.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
			pc.fillStyle = highlightGlow;
			pc.fillRect(0, 0, 736, 1104);
			pc.restore();

			// ── 4-Way Feathered Mask: Seamless dissolution into Pure Pitch Black (#000000) ──
			pc.globalCompositeOperation = 'destination-in';

			// Horizontal feathering
			const maskH = pc.createLinearGradient(0, 0, 736, 0);
			maskH.addColorStop(0, 'rgba(0,0,0,0)');
			maskH.addColorStop(0.15, 'rgba(0,0,0,0.5)');
			maskH.addColorStop(0.28, '#000000');
			maskH.addColorStop(0.72, '#000000');
			maskH.addColorStop(0.85, 'rgba(0,0,0,0.5)');
			maskH.addColorStop(1, 'rgba(0,0,0,0)');
			pc.fillStyle = maskH;
			pc.fillRect(0, 0, 736, 1104);

			// Vertical feathering (dissolves top sky and bottom water edge into pitch black)
			const maskV = pc.createLinearGradient(0, 0, 0, 1104);
			maskV.addColorStop(0, 'rgba(0,0,0,0)');
			maskV.addColorStop(0.12, 'rgba(0,0,0,0.6)');
			maskV.addColorStop(0.25, '#000000');
			maskV.addColorStop(0.78, '#000000');
			maskV.addColorStop(0.92, 'rgba(0,0,0,0.4)');
			maskV.addColorStop(1, 'rgba(0,0,0,0)');
			pc.fillStyle = maskV;
			pc.fillRect(0, 0, 736, 1104);

			pc.globalCompositeOperation = 'source-over';

			running = true;
			startedAt = performance.now();
			render(0);
			animation = requestAnimationFrame(tick);
		};

		image.onerror = () => finish('asset-error');
		image.src = imageUrl;

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') finish('skipped');
		};
		window.addEventListener('keydown', onKey);

		return () => {
			stopped = true;
			running = false;
			cancelAnimationFrame(animation);
			clearTimeout(watchdog);
			ro.disconnect();
			window.removeEventListener('keydown', onKey);
			image.onload = null;
			image.onerror = null;
			document.documentElement.style.overflow = '';
		};
	});
</script>

{#if mounted}
	<div
		bind:this={overlay}
		class="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-black transition-opacity duration-500"
		style="opacity: {overlayOpacity}; pointer-events: {overlayOpacity <= 0.05 ? 'none' : 'auto'}"
		role="dialog"
		aria-modal="true"
		aria-label="{name} — portfolio introduction"
	>
		<!-- Canvas Visual Animation (Pure pitch black with gold & cyan starlight) -->
		<canvas bind:this={canvas} class="absolute inset-0 h-full w-full block" aria-hidden="true"></canvas>

		<!-- Top Header Bar with Monogram & Skip -->
		<div
			class="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8"
			style="opacity: {topOpacity}"
		>
			<div class="flex items-center gap-3 text-white">
				<Monogram size={26} strokeWidth={2} />
				<span class="font-mono text-[11px] tracking-[0.22em] text-fg-2 uppercase">
					{name}
				</span>
			</div>

			<button
				type="button"
				id="skip-cinematic-intro"
				onclick={() => finish('skipped')}
				class="group flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 font-mono text-xs tracking-wider text-fg-2 backdrop-blur-md transition-all duration-300 hover:border-sig-gold/60 hover:text-white"
			>
				<span>Skip intro</span>
				<span class="text-sig-gold transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
			</button>
		</div>

		<!-- Bottom Editorial Narrative -->
		<div
			class="relative z-10 mx-auto w-full max-w-4xl px-6 pb-12 text-center md:pb-16"
			style="opacity: {copyOpacity}"
		>
			<p class="eyebrow text-[10px] tracking-[0.3em] text-sig-gold uppercase">
				From signal to system
			</p>

			<div class="relative mt-3 min-h-[3.2em] flex items-center justify-center">
				<p
					class="font-serif text-3xl font-light italic text-white transition-opacity duration-300 md:text-5xl"
					style="opacity: {lineOpacity}; text-shadow: 0 4px 24px rgba(0,0,0,0.95);"
				>
					{currentLine}
				</p>
			</div>

			<p class="mt-4 font-mono text-[9.5px] tracking-[0.25em] text-fg-3 uppercase">
				Software Engineer · Full-Stack &amp; Practical AI
			</p>
		</div>
	</div>
{/if}
