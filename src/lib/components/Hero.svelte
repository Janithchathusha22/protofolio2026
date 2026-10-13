<script lang="ts">
	import { ArrowRight, Download } from '@lucide/svelte';
	import HeroOrbit from './HeroOrbit.svelte';
	import { profile } from '../data/portfolio';
	import { ui } from '../state/ui.svelte.js';
</script>

<section id="top" class="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32" class:ready={ui.loaderDone}>
	<!-- faint editorial grid -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px)] [background-size:calc(100%/12)_100%] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
		aria-hidden="true"
	></div>

	<div class="container-editorial relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
		<div class="lg:col-span-7">
			<p class="h-in eyebrow text-sig-gold" style="--d:0ms">
				{profile.role}
			</p>

			<h1 class="h-in mt-8 text-5xl font-medium tracking-tight text-white md:text-7xl" style="--d:90ms">
				Janith <span class="font-serif font-normal italic text-white/90">Chathusha</span>
			</h1>

			<p class="h-in mt-8 max-w-xl text-2xl leading-snug font-light text-white md:text-[1.75rem]" style="--d:180ms">
				I build full-stack products and
				<span class="text-sig-gold">practical AI systems.</span>
			</p>

			<p class="h-in mt-6 max-w-lg text-[15px] leading-relaxed text-fg-2" style="--d:260ms">
				{profile.statement}
			</p>

			<div class="h-in mt-12 flex flex-wrap items-center gap-4" style="--d:340ms">
				<a
					id="hero-explore"
					href="#projects"
					class="group inline-flex items-center gap-3 rounded-full border border-sig-gold/60 px-6 py-3 text-sm text-white transition-all duration-500 hover:border-sig-gold hover:bg-sig-gold/[0.07] hover:shadow-[0_0_40px_-12px_#EAB66A]"
				>
					Explore Projects
					<ArrowRight size={16} strokeWidth={1.5} class="text-sig-gold transition-transform duration-500 group-hover:translate-x-1" />
				</a>
				<a
					id="hero-cv"
					href={profile.resumeUrl}
					download
					class="group inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm text-fg-2 transition-colors duration-300 hover:text-white"
				>
					<Download size={15} strokeWidth={1.5} class="transition-transform duration-300 group-hover:translate-y-0.5" />
					Download CV
				</a>
			</div>

			<dl class="h-in mt-20 grid max-w-lg grid-cols-3 border-t border-white/[0.08] pt-6" style="--d:420ms">
				<div>
					<dt class="eyebrow text-fg-3">Based in</dt>
					<dd class="mt-2 text-sm text-white">Sri Lanka</dd>
				</div>
				<div>
					<dt class="eyebrow text-fg-3">Now</dt>
					<dd class="mt-2 text-sm text-white">Absolx</dd>
				</div>
				<div>
					<dt class="eyebrow text-fg-3">Focus</dt>
					<dd class="mt-2 text-sm text-white">Full-Stack · AI</dd>
				</div>
			</dl>
		</div>

		<div class="h-in h-portrait lg:col-span-5" style="--d:200ms">
			<HeroOrbit src={profile.portrait} alt="Portrait of Janith Chathusha" />
		</div>
	</div>
</section>

<style>
	.h-in {
		opacity: 0;
		transform: translate3d(0, 18px, 0);
		transition:
			opacity 1s var(--ease-editorial) var(--d),
			transform 1.2s var(--ease-editorial) var(--d);
	}
	.h-portrait {
		transform: scale(0.94);
		transition-duration: 1.4s;
	}
	.ready .h-in,
	:global(:root[data-intro-seen]) .h-in {
		opacity: 1;
		transform: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.h-in {
			opacity: 1 !important;
			transform: none !important;
			transition: none !important;
		}
		.h-portrait {
			transform: none !important;
		}
	}
</style>
