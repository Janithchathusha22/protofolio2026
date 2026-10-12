<script lang="ts">
	import { onMount } from 'svelte';
	import { Menu, X, ArrowUpRight, RotateCcw } from '@lucide/svelte';
	import Monogram from './Monogram.svelte';
	import { navLinks, profile } from '../data/portfolio';
	import { ui } from '../state/ui.svelte.js';

	let open = $state(false);
	let active = $state('');
	let scrolled = $state(false);

	onMount(() => {
		const onScroll = () => (scrolled = scrollY > 12);
		onScroll();
		addEventListener('scroll', onScroll, { passive: true });

		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) active = `#${e.target.id}`;
			},
			{ rootMargin: '-45% 0px -50% 0px' }
		);
		navLinks.forEach((l) => {
			const el = document.querySelector(l.href);
			if (el) io.observe(el);
		});

		return () => {
			removeEventListener('scroll', onScroll);
			io.disconnect();
		};
	});
</script>

<header
	class="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500
	{scrolled || open ? 'border-white/[0.06] bg-black/80 backdrop-blur-md' : 'border-transparent bg-transparent'}"
>
	<nav class="container-editorial flex h-16 items-center justify-between" aria-label="Primary">
		<a href="#top" id="nav-home" class="group flex items-center gap-3 text-white" aria-label="Janith Chathusha — home">
			<Monogram size={28} class="transition-transform duration-500 group-hover:rotate-[-8deg]" />
			<span class="hidden font-mono text-[11px] tracking-[0.22em] text-fg-2 uppercase sm:inline">Janith&nbsp;C.</span>
		</a>

		<ul class="hidden items-center gap-7 md:flex">
			{#each navLinks as link (link.href)}
				<li>
					<a
						id="nav-{link.label.toLowerCase()}"
						href={link.href}
						class="relative text-[13px] tracking-wide transition-colors duration-300
						{active === link.href ? 'text-white' : 'text-fg-2 hover:text-white'}"
					>
						{link.label}
						<span
							class="absolute -bottom-1.5 left-0 h-px bg-sig-gold transition-all duration-500 ease-editorial
							{active === link.href ? 'w-full' : 'w-0'}"
						></span>
					</a>
				</li>
			{/each}
			<li>
				<button
					type="button"
					id="nav-replay-intro"
					onclick={() => ui.replayIntro()}
					class="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-fg-3 transition-colors hover:text-sig-gold"
					title="Replay cinematic intro"
				>
					<RotateCcw size={12} strokeWidth={1.5} class="transition-transform duration-300 group-hover:-rotate-90" />
					Intro
				</button>
			</li>
			<li>
				<a
					id="nav-resume"
					href={profile.resumeUrl}
					download="Janith_Chathusha_CV.pdf"
					target="_blank"
					rel="noopener"
					class="group inline-flex items-center gap-1.5 rounded-full border border-sig-gold/40 px-4 py-1.5 text-[13px] text-sig-gold transition-all duration-300 hover:border-sig-gold hover:bg-sig-gold/[0.06]"
				>
					Resume
					<ArrowUpRight size={14} strokeWidth={1.5} class="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
				</a>
			</li>
		</ul>

		<button
			id="nav-menu-toggle"
			class="grid size-10 place-items-center rounded-full text-white md:hidden"
			aria-expanded={open}
			aria-controls="mobile-menu"
			aria-label={open ? 'Close menu' : 'Open menu'}
			onclick={() => (open = !open)}
		>
			{#if open}<X size={20} strokeWidth={1.5} />{:else}<Menu size={20} strokeWidth={1.5} />{/if}
		</button>
	</nav>

	{#if open}
		<div id="mobile-menu" class="border-t border-white/[0.06] md:hidden">
			<ul class="container-editorial flex flex-col py-6">
				{#each navLinks as link, i (link.href)}
					<li>
						<a
							href={link.href}
							onclick={() => (open = false)}
							class="flex items-baseline gap-4 py-3 text-2xl font-light text-white"
						>
							<span class="font-mono text-[10px] text-fg-3">0{i + 1}</span>{link.label}
						</a>
					</li>
				{/each}
				<li class="flex items-center justify-between border-t border-white/[0.06] pt-5">
					<button
						type="button"
						onclick={() => {
							open = false;
							ui.replayIntro();
						}}
						class="inline-flex items-center gap-2 font-mono text-xs text-fg-3 hover:text-sig-gold"
					>
						<RotateCcw size={14} /> Replay Intro
					</button>
					<a href={profile.resumeUrl} download="Janith_Chathusha_CV.pdf" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sig-gold">
						Resume <ArrowUpRight size={16} strokeWidth={1.5} />
					</a>
				</li>
			</ul>
		</div>
	{/if}
</header>
