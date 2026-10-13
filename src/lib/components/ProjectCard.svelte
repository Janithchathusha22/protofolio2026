<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { reveal } from '../actions/reveal';
	import { accentHex, type Project } from '../data/portfolio';
	import NewsShieldVisual from './visuals/NewsShieldVisual.svelte';
	import EditorialPlatformVisual from './visuals/EditorialPlatformVisual.svelte';
	import LplVisual from './visuals/LplVisual.svelte';
	import SriLankaT20Visual from './visuals/SriLankaT20Visual.svelte';
	import BiomechanicsVisual from './visuals/BiomechanicsVisual.svelte';
	import MatchMindVisual from './visuals/MatchMindVisual.svelte';
	import FoodCheckerVisual from './visuals/FoodCheckerVisual.svelte';
	import AiAssistantVisual from './visuals/AiAssistantVisual.svelte';

	interface Props {
		project: Project;
	}
	let { project }: Props = $props();

	const visuals = {
		newsshield: NewsShieldVisual,
		newssite: EditorialPlatformVisual,
		lpl: LplVisual,
		'srilanka-t20': SriLankaT20Visual,
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
	class="glass-card group relative flex h-full flex-col justify-between rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-500 ease-out hover:border-white/20 hover:bg-white/[0.035]"
	style="--accent:{color}"
	use:reveal={{ y: 24 }}
>
	<!-- Glass top ambient rim highlight -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
		aria-hidden="true"
	></div>

	<!-- Hover accent corner glow (restrained opacity, disabled on small touch screens via CSS) -->
	<div
		class="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-15"
		style="background: var(--accent)"
		aria-hidden="true"
	></div>

	<div class="flex flex-col">
		<!-- 16:10 Consistent Visual Media Frame -->
		<figure class="relative w-full">
			<div
				class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#05070a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.7)]"
			>
				<div class="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]">
					<Visual />
				</div>
				<!-- Vignette & depth overlay -->
				<div
					class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.6)_100%)]"
					aria-hidden="true"
				></div>
				<div
					class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent"
					aria-hidden="true"
				></div>
				<!-- Top accent hairline that reveals on hover -->
				<div
					class="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
					style="background: linear-gradient(90deg, transparent, var(--accent), transparent)"
					aria-hidden="true"
				></div>
			</div>
			<figcaption class="mt-2.5 flex items-center justify-between font-mono text-[10.5px] tracking-wider text-fg-3">
				<span>{project.caption}</span>
				<span>FIG. {project.index}</span>
			</figcaption>
		</figure>

		<!-- Project Category & Status Badge Row -->
		<div class="mt-6 flex flex-wrap items-center justify-between gap-2.5">
			<p class="eyebrow flex items-center gap-2" style="color:var(--accent)">
				<span class="font-mono text-fg-3">{project.index}</span>
				<span class="size-1 rounded-full bg-current opacity-60"></span>
				<span>{project.category}</span>
			</p>
			{#if project.statusBadge}
				<span
					class="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[9px] tracking-wider text-fg-2 uppercase"
				>
					{project.statusBadge}
				</span>
			{/if}
		</div>

		<!-- Title & Subtitle -->
		<h3 class="mt-3 text-2xl font-medium tracking-tight text-white md:text-[1.65rem] leading-snug">
			{project.title}
		</h3>
		<p class="mt-1 font-serif text-[15px] italic text-fg-2 md:text-base">
			{project.subtitle}
		</p>

		<!-- Short Description -->
		<p class="mt-4 text-[14px] leading-relaxed text-fg-2 font-normal">
			{project.context}
		</p>

		<!-- Two Useful Highlights -->
		<div class="mt-5 space-y-2 border-t border-white/[0.06] pt-4">
			<p class="eyebrow text-[10px] text-fg-3">Key Highlights</p>
			<ul class="space-y-2 pt-0.5">
				{#each project.keyFeatures as highlight (highlight)}
					<li class="flex items-start gap-2.5 text-[13px] leading-relaxed text-fg-2">
						<span class="mt-1 shrink-0 text-[9px]" style="color:var(--accent)">◆</span>
						<span>{highlight}</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Technologies Stack Tags -->
		<div class="mt-5 border-t border-white/[0.06] pt-4">
			<p class="eyebrow text-[10px] text-fg-3">Technologies</p>
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each project.stack as tech (tech)}
					<span
						class="rounded-full border border-white/[0.08] bg-black/50 px-2.5 py-1 font-mono text-[10px] text-fg-2 transition-colors hover:border-white/20 hover:text-white"
					>
						{tech}
					</span>
				{/each}
			</div>
		</div>
	</div>

	<!-- Action Buttons & Verified Links Area -->
	<div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
		<div class="flex flex-wrap items-center gap-2.5">
			{#if project.githubUrl}
				<a
					href={project.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="group/btn inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[11.5px] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08]"
					title="View verified public repository on GitHub"
				>
					<svg
						class="size-3.5 shrink-0 fill-current opacity-80 group-hover/btn:opacity-100"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
						/>
					</svg>
					<span>View source</span>
					<ArrowUpRight
						size={12}
						class="text-fg-3 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-white"
					/>
				</a>
			{/if}

			{#if project.linkedinUrl}
				<a
					href={project.linkedinUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="group/btn inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wide transition-all duration-300"
					style="border-color: rgba(234, 182, 106, 0.4); color: #EAB66A; background: rgba(234, 182, 106, 0.05);"
				>
					<span>Case Study</span>
					<ArrowUpRight
						size={12}
						class="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
					/>
				</a>
			{/if}
		</div>

		<a
			href="#contact"
			class="inline-flex items-center gap-1 font-mono text-[11px] text-fg-3 transition-colors hover:text-white"
		>
			<span>Inquire</span>
			<ArrowUpRight size={12} />
		</a>
	</div>
</article>

<style>
	@supports not (backdrop-filter: blur(1px)) {
		.glass-card {
			background-color: #0b0d12 !important;
		}
	}
</style>
