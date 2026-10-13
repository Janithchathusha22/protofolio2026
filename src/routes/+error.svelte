<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft, Home } from '@lucide/svelte';
	import Monogram from '$lib/components/Monogram.svelte';
</script>

<svelte:head>
	<title>{page.status ?? 404} — Page Not Found | Janith Chathusha</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="relative flex min-h-screen flex-col items-center justify-between bg-black px-6 py-12 text-center text-white sm:px-12">
	<!-- Top Bar -->
	<header class="flex w-full max-w-4xl items-center justify-between">
		<a href="/" class="flex items-center gap-3 text-white transition-opacity hover:opacity-80">
			<Monogram size={28} />
			<span class="font-mono text-xs tracking-widest text-fg-2 uppercase">Janith Chathusha</span>
		</a>
		<a
			href="/"
			class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-xs text-fg-2 backdrop-blur-md transition-colors hover:border-sig-gold/40 hover:text-white"
		>
			<Home size={13} />
			<span>Return Home</span>
		</a>
	</header>

	<!-- Central 404 Hero -->
	<main class="my-auto max-w-lg py-16">
		<p class="font-mono text-xs font-medium tracking-[0.3em] text-sig-gold uppercase">
			Error {page.status ?? 404}
		</p>
		<h1 class="mt-4 text-4xl font-medium tracking-tight md:text-6xl">
			Signal Not Found
		</h1>
		<p class="mt-4 text-sm leading-relaxed text-fg-2 md:text-base">
			{page.error?.message || 'The requested telemetry route or page does not exist on this transmission frequency.'}
		</p>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
			<a
				href="/"
				class="inline-flex items-center gap-2.5 rounded-full border border-sig-gold/60 bg-sig-gold/[0.1] px-6 py-3 font-mono text-xs font-medium text-white transition-all hover:bg-sig-gold/[0.2] hover:shadow-[0_0_30px_rgba(234,182,106,0.3)]"
			>
				<ArrowLeft size={14} />
				<span>Back to Portfolio</span>
			</a>
		</div>
	</main>

	<!-- Footer -->
	<footer class="font-mono text-xs text-fg-3">
		<span>© {new Date().getFullYear()} Janith Chathusha · Software Engineer</span>
	</footer>
</div>
