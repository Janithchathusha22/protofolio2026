<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import SectionHeader from './SectionHeader.svelte';
	import { reveal } from '../actions/reveal';
	import { skillGroups, accentHex } from '../data/portfolio';
	import { ui } from '../state/ui.svelte.js';

	// 3×2 architecture layout: request path on top, intelligence / delivery below.
	const order = ['frontend', 'backend', 'ai', 'data', 'cloud', 'quality'];
	const nodes = order.map((id) => skillGroups.find((g) => g.id === id)!);
	const layer = ['Interface Layer', 'Services & APIs', 'Machine Intelligence', 'Data & Persistence', 'Cloud & Delivery', 'Quality & Telemetry'];

	let hoveredId = $state<string | null>(null);

	// Connection graph in a 600×400 viewBox (cell centers).
	const C = [
		[100, 100], [300, 100], [500, 100],
		[100, 300], [300, 300], [500, 300]
	];
	const edges: [number, number, string][] = [
		[0, 1, '#24D7FF'], [1, 2, '#EAB66A'], [1, 3, '#1687FF'],
		[2, 3, '#EAB66A'], [0, 5, '#4B5563'], [3, 4, '#24D7FF'], [4, 5, '#1687FF'], [2, 4, '#EAB66A']
	];
	const path = ([a, b]: [number, number, string]) => {
		const [x1, y1] = C[a];
		const [x2, y2] = C[b];
		return `M${x1} ${y1} L${x2} ${y2}`;
	};
</script>

<section id="systems" class="section-rhythm border-t border-white/[0.06]">
	<div class="container-editorial">
		<SectionHeader
			index="03"
			eyebrow="Connected Systems Map"
			accent="text-sig-cyan"
			title={'A tech stack chosen as a <span class="font-serif italic font-normal text-fg-2">coherent system</span>, not a list.'}
			lede="Each module represents a layer I design and operate across. Select any node to inspect production architecture roles, libraries, and design patterns."
		/>

		<div class="relative" use:reveal={{ y: 20 }}>
			<!-- Connection layer filaments (desktop) -->
			<svg
				viewBox="0 0 600 400"
				preserveAspectRatio="none"
				class="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
				aria-hidden="true"
			>
				{#each edges as e, i (i)}
					<path
						d={path(e)}
						stroke="#fff"
						stroke-opacity="0.06"
						stroke-width="1"
						vector-effect="non-scaling-stroke"
						fill="none"
					/>
					<path
						d={path(e)}
						stroke={e[2]}
						stroke-width="1.3"
						vector-effect="non-scaling-stroke"
						fill="none"
						pathLength="100"
						stroke-dasharray="8 92"
						class="signal"
						style="animation-delay:{i * -0.6}s"
					/>
				{/each}
			</svg>

			<!-- Mobile spine -->
			<div class="absolute top-0 bottom-0 left-[19px] w-px bg-white/[0.08] md:hidden" aria-hidden="true"></div>

			<!-- Bento glassmorphism nodes -->
			<ul class="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2 md:gap-x-12 md:gap-y-16">
				{#each nodes as g, i (g.id)}
					{@const c = accentHex[g.accent]}
					<li class="flex md:justify-center">
						<button
							id="skill-node-{g.id}"
							type="button"
							onclick={() => ui.openSkill(g)}
							onmouseenter={() => (hoveredId = g.id)}
							onmouseleave={() => (hoveredId = null)}
							class="group relative ml-10 w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 text-left shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.05] md:ml-0 md:max-w-[320px]"
							style="--c:{c}"
							aria-haspopup="dialog"
						>
							<!-- Top hairline accent on hover -->
							<div
								class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[var(--c)] to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
							></div>

							<!-- Ambient corner glow -->
							<div
								class="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
								style="background: var(--c)"
							></div>

							<!-- Mobile dot -->
							<span
								class="absolute top-1/2 -left-[26px] size-2.5 -translate-y-1/2 rounded-full border bg-black md:hidden"
								style="border-color:var(--c)"
							></span>

							<div class="flex items-center justify-between">
								<span class="font-mono text-[9.5px] tracking-[0.24em] text-fg-3 uppercase">
									L{i + 1} · {layer[i]}
								</span>
								<span class="size-2 rounded-full" style="background:var(--c); box-shadow:0 0 10px var(--c)"></span>
							</div>

							<h3 class="mt-4 text-lg font-medium text-white">{g.label}</h3>
							<p class="mt-2 text-[13px] leading-relaxed text-fg-2">
								{g.items.slice(0, 4).join(' · ')}
								{#if g.items.length > 4}
									<span class="text-fg-3"> +{g.items.length - 4}</span>
								{/if}
							</p>

							<div
								class="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10px] tracking-wider text-fg-3 transition-colors duration-300 group-hover:text-[var(--c)]"
							>
								<span>{g.items.length} MODULES INSPECT</span>
								<ArrowUpRight size={13} class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</div>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.signal {
		animation: signal 4.2s linear infinite;
	}
	@keyframes signal {
		from {
			stroke-dashoffset: 100;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
