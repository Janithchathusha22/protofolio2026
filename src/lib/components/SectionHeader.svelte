<script lang="ts">
	import { reveal } from '../actions/reveal';

	interface Props {
		index: string;
		eyebrow: string;
		title: string;
		lede?: string;
		accent?: string;
	}
	let { index, eyebrow, title, lede, accent = 'text-sig-gold' }: Props = $props();
</script>

<header class="mb-20 grid gap-8 md:mb-28 md:grid-cols-12" use:reveal>
	<div class="md:col-span-4">
		<p class="eyebrow flex items-center gap-2.5 {accent}">
			<span class="font-mono text-fg-3">{index}</span>
			<span>{eyebrow}</span>
		</p>
	</div>
	<div class="md:col-span-8">
		<h2 class="text-3xl leading-[1.1] font-medium tracking-tight text-white md:text-5xl">{@html title}</h2>
		{#if lede}
			<p class="mt-6 max-w-xl text-[15px] leading-relaxed text-fg-2">{lede}</p>
		{/if}
	</div>
</header>
