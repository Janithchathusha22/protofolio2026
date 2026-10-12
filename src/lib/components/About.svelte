<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { reveal } from '../actions/reveal';
	import { education, profile } from '../data/portfolio';

	const principles = [
		{ k: 'Craft', v: 'Readable code, explicit contracts, and systems that are pleasant to change.' },
		{ k: 'Scale', v: 'Backends designed around failure modes, queues, and observability from day one.' },
		{ k: 'Usefulness', v: 'AI only where it measurably helps — explainable, testable, and owned.' }
	];
</script>

<section id="about" class="section-rhythm border-t border-white/[0.06]">
	<div class="container-editorial">
		<SectionHeader
			index="05"
			eyebrow="About"
			title={'Engineering is the discipline of <span class="font-serif italic font-normal text-fg-2">making signal useful.</span>'}
			lede="I work across the full stack — from data pipelines and model serving to the interfaces people actually touch. The thread through all of it: build things that hold up in production and explain themselves."
		/>

		<!-- Academic Foundation & Graduation Visual -->
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
			<!-- Image frame -->
			<div class="lg:col-span-5" use:reveal={{ y: 24 }}>
				<div class="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_0_50px_rgba(0,0,0,0.6)]">
					<img
						src={profile.aboutPortrait}
						alt="Janith Chathusha — SLIIT Convocation"
						class="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
						loading="lazy"
						decoding="async"
					/>
					<!-- Vignette -->
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
					></div>
					<!-- Hairline gold accent on hover -->
					<div
						class="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-sig-gold to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
					></div>

					<!-- Bottom badge -->
					<div class="absolute inset-x-0 bottom-0 p-6">
						<span
							class="inline-block rounded-full border border-sig-gold/40 bg-black/60 px-3 py-1 font-mono text-[10px] tracking-wider text-sig-gold uppercase backdrop-blur-md"
						>
							SLIIT Graduate · 2024
						</span>
						<p class="mt-2 text-sm font-medium text-white">{education.degree}</p>
					</div>
				</div>
				<p class="mt-3 text-right font-mono text-[10px] tracking-widest text-fg-3 uppercase">
					SLIIT Convocation · Sri Lanka
				</p>
			</div>

			<!-- Editorial text & foundation -->
			<div class="lg:col-span-7" use:reveal={{ delay: 100 }}>
				<p class="eyebrow text-fg-3">Academic Foundation</p>
				<h3 class="mt-4 text-2xl font-medium tracking-tight text-white md:text-3xl">
					{education.degree}
				</h3>
				<p class="mt-2 text-[15px] text-fg-2">{education.school}</p>
				<p class="mt-2 font-mono text-[11px] tracking-wider text-sig-gold">{education.period}</p>

				<p class="mt-6 text-[15px] leading-relaxed text-fg-2">
					Graduated with a strong foundation in distributed systems, algorithm design, software architecture, and artificial intelligence. Guided by a constant drive to transform theoretical computing into deployed software that serves real human needs.
				</p>

				<div class="mt-10 grid gap-8 border-t border-white/[0.08] pt-8 sm:grid-cols-3">
					{#each principles as p, i (p.k)}
						<div>
							<dt class="font-medium text-white">{p.k}</dt>
							<dd class="mt-2 text-[13.5px] leading-relaxed text-fg-2">{p.v}</dd>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
