<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { reveal } from '../actions/reveal';
	import { experience } from '../data/portfolio';
</script>

<section id="timeline" class="section-rhythm border-t border-white/[0.06]">
	<div class="container-editorial">
		<SectionHeader
			index="04"
			eyebrow="Experience"
			title={'A steady line from <span class="font-serif italic font-normal text-fg-2">trainee to engineer.</span>'}
		/>

		<ol class="relative md:ml-[33.333%]">
			<span
				class="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-sig-gold/70 via-white/10 to-transparent"
				aria-hidden="true"
			></span>
			{#each experience as job, i (`${job.org}-${job.role}-${i}`)}
				<li class="relative pb-20 pl-12 last:pb-0" use:reveal={{ delay: i * 90 }}>
					<span
						class="absolute top-2 left-0 size-[11px] rounded-full border bg-black
						{job.current ? 'border-sig-gold shadow-[0_0_0_4px_rgb(234_182_106/0.12),0_0_18px_#EAB66A]' : 'border-white/25'}"
					></span>
					<p class="font-mono text-[11px] tracking-[0.18em] uppercase {job.current ? 'text-sig-gold' : 'text-fg-3'}">
						{job.period}
					</p>
					<h3 class="mt-3 text-xl font-medium tracking-tight text-white md:text-2xl">{job.role}</h3>
					<p class="mt-2 text-[15px] text-fg-2">{job.org}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>
