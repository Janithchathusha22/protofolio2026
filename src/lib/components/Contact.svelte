<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowUpRight, Copy, Check, ArrowUp, Globe, Clock, ShieldCheck, Sparkles, Terminal, FileText } from '@lucide/svelte';
	import Monogram from './Monogram.svelte';
	import CognitiveTerminal from './CognitiveTerminal.svelte';
	import { socials, profile, projects } from '../data/portfolio';
	import { reveal } from '../actions/reveal';
	import { ui } from '../state/ui.svelte.js';

	let copied = $state(false);
	let localTime = $state('');

	function updateTime() {
		try {
			const now = new Date();
			localTime = now.toLocaleTimeString('en-US', {
				timeZone: 'Asia/Colombo',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: true
			});
		} catch {
			localTime = '12:00 PM';
		}
	}

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(profile.email);
			copied = true;
			setTimeout(() => (copied = false), 2200);
		} catch {}
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		updateTime();
		const timeTimer = setInterval(updateTime, 1000);
		return () => clearInterval(timeTimer);
	});
</script>

<section id="contact" class="relative overflow-hidden border-t border-white/[0.08] pt-28 md:pt-36 bg-black">
	<!-- Atmospheric Ambient Glow -->
	<div
		class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[640px] rounded-full bg-sig-gold/[0.035] blur-3xl"
		aria-hidden="true"
	></div>

	<div class="container-editorial relative">
		<!-- Section Eyebrow -->
		<p class="eyebrow flex items-center gap-3 text-sig-gold" use:reveal>
			<span class="font-mono text-fg-3">06</span>
			<span class="h-px w-6 bg-current opacity-50"></span>
			<span>Initiate Transmission</span>
		</p>

		<!-- Bold Editorial Headline -->
		<h2
			class="mt-8 max-w-4xl text-5xl leading-[1.02] font-medium tracking-tight text-white md:text-7xl lg:text-[5rem]"
			use:reveal={{ delay: 80 }}
		>
			Let's engineer something <span class="font-serif font-normal italic text-sig-gold">extraordinary.</span>
		</h2>

		<!-- Contact Pitch & Interactive Action Capsule -->
		<div class="mt-14 grid gap-12 lg:grid-cols-12" use:reveal={{ delay: 140 }}>
			<div class="lg:col-span-7">
				<p class="text-base leading-relaxed text-fg-2 md:text-lg font-light max-w-2xl">
					Specialized in scalable backends, explainable machine learning systems, and high-performance product architectures.
					Whether you're architecting a new platform, seeking applied AI expertise, or assembling an ambitious engineering team,
					my transmission channel is open.
				</p>

				<!-- Interactive CTA Actions -->
				<div class="mt-10 flex flex-wrap items-center gap-4">
					<a
						id="contact-email-btn"
						href="mailto:{profile.email}"
						class="group inline-flex items-center gap-3 rounded-full border border-sig-gold/60 bg-sig-gold/[0.08] px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_30px_rgba(234,182,106,0.15)] transition-all duration-500 hover:border-sig-gold hover:bg-sig-gold/[0.18] hover:shadow-[0_0_50px_rgba(234,182,106,0.3)]"
					>
						<span>Transmit Direct Email</span>
						<ArrowUpRight
							size={16}
							class="text-sig-gold transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
						/>
					</a>

					<button
						id="contact-copy-btn"
						type="button"
						onclick={copyEmail}
						class="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-5 py-3.5 font-mono text-xs text-fg-2 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:text-white"
					>
						{#if copied}
							<Check size={14} class="text-sig-gold" />
							<span class="text-sig-gold font-medium">Copied to Clipboard!</span>
						{:else}
							<Copy size={14} strokeWidth={1.5} class="text-fg-3 transition-colors group-hover:text-white" />
							<span>Copy Address: {profile.email}</span>
						{/if}
					</button>

					<a
						href={profile.resumeUrl}
						download="Janith_Chathusha_CV.pdf"
						target="_blank"
						rel="noopener noreferrer"
						class="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-3.5 font-mono text-xs text-fg-2 backdrop-blur-md transition-all duration-300 hover:border-sig-cyan/50 hover:text-white"
					>
						<FileText size={14} class="text-sig-cyan/80 transition-colors group-hover:text-sig-cyan" />
						<span>Download Curriculum Vitae</span>
						<ArrowUpRight size={13} class="text-fg-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</a>
				</div>
			</div>

			<!-- Live Telemetry Status Bento Card -->
			<div class="lg:col-span-5">
				<div
					class="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]"
				>
					<div class="flex items-center justify-between border-b border-white/[0.06] pb-4">
						<div class="flex items-center gap-2.5">
							<span class="relative flex size-2.5">
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sig-gold opacity-75"
								></span>
								<span class="relative inline-flex size-2.5 rounded-full bg-sig-gold"></span>
							</span>
							<span class="font-mono text-xs tracking-wider text-white uppercase font-medium">
								Available for Roles &amp; Teams
							</span>
						</div>
						<span class="font-mono text-[10px] text-fg-3 uppercase">Q4 2026</span>
					</div>

					<dl class="mt-5 grid grid-cols-2 gap-y-4 gap-x-4 font-mono text-xs">
						<div>
							<dt class="flex items-center gap-1.5 text-fg-3">
								<Globe size={13} />
								<span>Base Station</span>
							</dt>
							<dd class="mt-1 text-white">Colombo, Sri Lanka</dd>
						</div>

						<div>
							<dt class="flex items-center gap-1.5 text-fg-3">
								<Clock size={13} />
								<span>Local Time (UTC+5:30)</span>
							</dt>
							<dd class="mt-1 text-[#24D7FF] font-medium">{localTime}</dd>
						</div>

						<div>
							<dt class="flex items-center gap-1.5 text-fg-3">
								<ShieldCheck size={13} />
								<span>Response SLA</span>
							</dt>
							<dd class="mt-1 text-white">&lt; 24 Hours Guaranteed</dd>
						</div>

						<div>
							<dt class="flex items-center gap-1.5 text-fg-3">
								<span>Primary Focus</span>
							</dt>
							<dd class="mt-1 text-sig-gold">Full-Stack · Practical AI</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>

		<!-- ──────── Cognitive Terminal: 3D Holographic Mind, AI Chatbot & Direct Transmission ──────── -->
		<div class="relative mt-16 md:mt-24" use:reveal={{ delay: 200 }}>
			<CognitiveTerminal />
		</div>
	</div>

	<!-- ──────── Creative 4-Column Architectural Directory ──────── -->
	<footer class="relative mt-20 border-t border-white/[0.08] pt-16 pb-12 bg-[#020202]">
		<div class="container-editorial relative">
			<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
				<!-- Column 1: Identity & Brand Lockup (4 cols) -->
				<div class="lg:col-span-4">
					<div class="flex items-center gap-3">
						<Monogram size={30} class="text-white" />
						<div>
							<p class="font-medium text-white tracking-wide">Janith Chathusha</p>
							<p class="font-mono text-[11px] text-sig-gold">Software Engineer · Full-Stack &amp; AI</p>
						</div>
					</div>

					<p class="mt-5 text-sm leading-relaxed text-fg-2 max-w-sm">
						From signal to system. Engineering scalable distributed architectures, explainable machine learning pipelines,
						and interfaces that make complex data legible.
					</p>

					<div class="mt-6 flex items-center gap-2 font-mono text-xs text-fg-3">
						<span class="size-2 rounded-full bg-emerald-400"></span>
						<span>Software Engineer @ Absolx</span>
					</div>
				</div>

				<!-- Column 2: Architectural Projects Index (3 cols) -->
				<div class="lg:col-span-3 lg:pl-4">
					<p class="eyebrow text-fg-3">Selected Architecture</p>
					<ul class="mt-4 space-y-2.5 font-mono text-xs">
						{#each projects as p (p.id)}
							<li>
								<a
									href="#project-{p.id}"
									class="flex items-center justify-between text-fg-2 transition-colors hover:text-white group"
								>
									<span>{p.title}</span>
									<span class="text-fg-3 text-[10px] group-hover:text-sig-gold">0{p.index}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Column 3: Verified Channels (3 cols) -->
				<div class="lg:col-span-3">
					<p class="eyebrow text-fg-3">Verified Channels</p>
					<ul class="mt-4 space-y-2.5 font-mono text-xs">
						{#each socials as s (s.label)}
							<li>
								<a
									href={s.href}
									target={s.label === 'Email' ? undefined : '_blank'}
									rel="noopener noreferrer"
									class="group flex items-center justify-between text-fg-2 transition-colors hover:text-white"
								>
									<span>{s.label}</span>
									<ArrowUpRight
										size={13}
										class="text-fg-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sig-gold"
									/>
								</a>
							</li>
						{/each}
						<li class="pt-2">
							<a
								href={profile.resumeUrl}
								download="Janith_Chathusha_CV.pdf"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1.5 text-sig-gold hover:underline"
							>
								<span>Download Curriculum Vitae</span>
								<ArrowUpRight size={13} />
							</a>
						</li>
					</ul>
				</div>

				<!-- Column 4: Colophon / System Specs (2 cols) -->
				<div class="lg:col-span-2">
					<p class="eyebrow text-fg-3">Colophon</p>
					<ul class="mt-4 space-y-2 font-mono text-[11px] text-fg-3">
						<li>SvelteKit 2 &amp; Svelte 5</li>
						<li>Tailwind CSS v4</li>
						<li>Canvas 2D Waveforms</li>
						<li>Pitch Black (#000000)</li>
						<li>Instrument Serif &amp; Inter</li>
						<li>Hosted at Global Edge</li>
					</ul>
				</div>
			</div>

			<!-- Bottom Copyright & Kinetic Navigation Bar -->
			<div
				class="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.08] pt-8 font-mono text-xs text-fg-3 sm:flex-row sm:items-center"
			>
				<p>© {new Date().getFullYear()} Janith Chathusha. Engineered with craft &amp; precision.</p>

				<div class="flex items-center gap-6">
					<button
						type="button"
						id="footer-replay-intro"
						onclick={() => ui.replayIntro()}
						class="text-fg-3 transition-colors hover:text-sig-gold flex items-center gap-1.5"
					>
						<span>Replay Cinematic Intro</span>
						<span class="text-sig-gold">↺</span>
					</button>

					<button
						type="button"
						id="footer-back-to-top"
						onclick={scrollToTop}
						class="group flex items-center gap-2 text-fg-2 transition-colors hover:text-white"
						aria-label="Scroll back to top"
					>
						<span>Back to Apex</span>
						<span
							class="grid size-6 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-fg-3 transition-all duration-300 group-hover:border-sig-gold group-hover:text-sig-gold group-hover:-translate-y-0.5"
						>
							<ArrowUp size={12} strokeWidth={2} />
						</span>
					</button>
				</div>
			</div>
		</div>
	</footer>
</section>
