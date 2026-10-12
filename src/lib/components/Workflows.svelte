<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { reveal } from '../actions/reveal';
	import { externalWorkflows } from '../data/portfolio';
</script>

<section id="workflows" class="section-rhythm border-t border-white/[0.06]">
	<div class="container-editorial">
		<SectionHeader
			index="02"
			eyebrow="External & Enterprise Work"
			title={'Production engineering, <span class="font-serif italic font-normal text-fg-2">described by pattern.</span>'}
			lede="Client and enterprise production systems are strictly anonymized. What remains is the architecture — resilient patterns designed for high throughput, sub-second latency, and fault tolerance."
		/>

		<ol class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each externalWorkflows as w, i (w.index)}
				<li
					class="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:border-sig-gold/40 hover:bg-white/[0.04]"
					use:reveal={{ delay: i * 110 }}
				>
					<!-- Top hairline gold accent on hover -->
					<div
						class="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-sig-gold to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
					></div>

					<div class="flex items-center justify-between">
						<p class="font-mono text-xs text-sig-gold">{w.index} /</p>
						<span
							class="rounded-full border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[9px] tracking-wider text-fg-3 uppercase"
						>
							Enterprise
						</span>
					</div>

					<h3 class="mt-6 text-xl font-medium tracking-tight text-white">{w.title}</h3>
					<p class="mt-4 text-[14px] leading-relaxed text-fg-2">{w.body}</p>

					<div class="mt-8 border-t border-white/[0.06] pt-4">
						<p class="font-mono text-[10px] tracking-widest text-fg-3 uppercase">Architecture</p>
						<p class="mt-1 font-mono text-[11px] text-[#24D7FF]">{w.architecture}</p>
					</div>

					<div class="mt-4 flex flex-wrap gap-2">
						{#each w.tags as t (t)}
							<span
								class="rounded-full border border-white/[0.06] bg-black/50 px-2.5 py-0.5 font-mono text-[10px] text-fg-3"
							>
								{t}
							</span>
						{/each}
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>
