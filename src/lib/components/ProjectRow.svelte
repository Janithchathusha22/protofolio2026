<script lang="ts">
	import { ArrowUpRight, CheckCircle2 } from '@lucide/svelte';
	import { reveal } from '../actions/reveal';
	import { accentHex, type Project } from '../data/portfolio';
	import NewsShieldVisual from './visuals/NewsShieldVisual.svelte';
	import LplVisual from './visuals/LplVisual.svelte';
	import BiomechanicsVisual from './visuals/BiomechanicsVisual.svelte';
	import MatchMindVisual from './visuals/MatchMindVisual.svelte';
	import FoodCheckerVisual from './visuals/FoodCheckerVisual.svelte';
	import AiAssistantVisual from './visuals/AiAssistantVisual.svelte';

	interface Props {
		project: Project;
		reverse?: boolean;
	}
	let { project, reverse = false }: Props = $props();

	const visuals = {
		newsshield: NewsShieldVisual,
		lpl: LplVisual,
		biomechanics: BiomechanicsVisual,
		matchmind: MatchMindVisual,
		foodchecker: FoodCheckerVisual,
		aiassistant: AiAssistantVisual
	};

	const Visual = $derived(visuals[project.visual]);
	const color = $derived(accentHex[project.accent]);
</script>

<article
	id="project-{project.id}"
	class="group relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.008] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-700 ease-out hover:border-white/20 md:p-10 lg:p-12"
	style="--accent:{color}"
	use:reveal={{ y: 32 }}
>
	<!-- Glass top ambient rim highlight -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
	></div>
	<!-- Hover accent glow corner -->
	<div
		class="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20"
		style="background: var(--accent)"
	></div>

	<div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
		<!-- 16:10 Visual Media Frame -->
		<figure class="lg:col-span-7 {reverse ? 'lg:order-2' : ''}">
			<div
				class="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#05070a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_12px_40px_rgba(0,0,0,0.8)]"
			>
				<div class="h-full w-full transition-transform duration-700 ease-out group-hover:scale-102">
					<Visual />
				</div>
				<!-- Vignette & depth overlay -->
				<div
					class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.65)_100%)]"
				></div>
				<div
					class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent"
				></div>
				<!-- Top accent hairline that lights up on hover -->
				<div
					class="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
					style="background: linear-gradient(90deg, transparent, var(--accent), transparent)"
				></div>
			</div>
			<figcaption class="mt-3 flex items-center justify-between font-mono text-[10.5px] tracking-wider text-fg-3">
				<span>{project.caption}</span>
				<span>FIG. {project.index}</span>
			</figcaption>
		</figure>

		<!-- Project Specifications & Narrative -->
		<div class="lg:col-span-5 {reverse ? 'lg:order-1' : ''}">
			<!-- Top metadata row -->
			<div class="flex flex-wrap items-center justify-between gap-3">
				<p class="eyebrow flex items-center gap-2.5" style="color:var(--accent)">
					<span class="font-mono text-fg-3">{project.index}</span>
					<span class="size-1 rounded-full bg-current opacity-60"></span>
					{project.category}
				</p>
				{#if project.statusBadge}
					<span
						class="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[9.5px] tracking-wider text-fg-3 uppercase"
					>
						{project.statusBadge}
					</span>
				{/if}
			</div>

			<h3 class="mt-4 text-2xl font-medium tracking-tight text-white md:text-3xl lg:text-[2rem] leading-snug">
				{project.title}
			</h3>
			<p class="mt-1 font-serif text-base italic text-fg-2 md:text-lg">
				{project.subtitle}
			</p>

			<p class="mt-4 text-[14.5px] leading-relaxed text-fg-2">
				{project.context}
			</p>

			<!-- Key features list -->
			<div class="mt-6 space-y-2 border-t border-white/[0.06] pt-5">
				<p class="eyebrow text-fg-3">Key Highlights</p>
				<ul class="space-y-2 pt-1">
					{#each project.keyFeatures as feat (feat)}
						<li class="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-fg-2">
							<span class="mt-1 shrink-0 text-[10px]" style="color:var(--accent)">◆</span>
							<span>{feat}</span>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Architecture Stack Badges -->
			<div class="mt-6 border-t border-white/[0.06] pt-5">
				<p class="eyebrow text-fg-3">Technologies</p>
				<div class="mt-2.5 flex flex-wrap gap-1.5">
					{#each project.stack as tech (tech)}
						<span
							class="rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 font-mono text-[10.5px] text-fg-2 transition-colors hover:border-white/20 hover:text-white"
						>
							{tech}
						</span>
					{/each}
				</div>
			</div>

			<!-- Actions & Verified Links -->
			<div class="mt-8 flex flex-wrap items-center gap-4">
				{#if project.linkedinUrl}
					<a
						href={project.linkedinUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="group/btn inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs tracking-wider transition-all duration-300"
						style="border-color: rgba(234, 182, 106, 0.4); color: #EAB66A; background: rgba(234, 182, 106, 0.05);"
					>
						<span>LinkedIn Case Study</span>
						<ArrowUpRight
							size={13}
							class="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
						/>
					</a>
				{/if}

				<a
					href="#contact"
					class="inline-flex items-center gap-1.5 font-mono text-xs text-fg-3 transition-colors hover:text-white"
				>
					<span>Inquire Architecture</span>
					<ArrowUpRight size={13} />
				</a>
			</div>
		</div>
	</div>
</article>
