<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		src: string;
		alt: string;
	}
	let { src, alt }: Props = $props();

	let img = $state<HTMLImageElement>();
	let failed = $state(false);

	onMount(() => {
		if (img && img.complete && img.naturalWidth === 0) failed = true;
	});
</script>

<div class="relative mx-auto aspect-[500/580] w-full max-w-[480px]">
	<!-- Ambient subtle back-glow layer -->
	<svg viewBox="0 0 500 580" class="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
		<defs>
			<radialGradient id="hero-ambient" cx="50%" cy="55%" r="55%">
				<stop offset="0%" stop-color="#EAB66A" stop-opacity="0.12" />
				<stop offset="50%" stop-color="#1687FF" stop-opacity="0.04" />
				<stop offset="100%" stop-color="#000" stop-opacity="0" />
			</radialGradient>
		</defs>
		<ellipse cx="250" cy="360" rx="250" ry="260" fill="url(#hero-ambient)" />
	</svg>

	<!-- Portrait: Clean High-End Studio Cutout on pitch black (#000000) -->
	<div class="relative z-10 flex h-full w-full items-end justify-center pointer-events-none">
		{#if !failed}
			<picture class="h-full w-full flex items-end justify-center">
				<source srcset="/portrait.webp" type="image/webp" />
				<source srcset="/portrait.jpg" type="image/jpeg" />
				<img
					bind:this={img}
					src={src}
					{alt}
					width="500"
					height="580"
					onerror={() => (failed = true)}
					class="h-full w-full object-contain object-bottom select-none [mask-image:linear-gradient(to_bottom,#000_84%,transparent_100%)] drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
					fetchpriority="high"
					decoding="async"
				/>
			</picture>
		{:else}
			<!-- Silhouette fallback -->
			<svg viewBox="0 0 360 500" class="h-full w-full" role="img" aria-label={alt}>
				<defs>
					<linearGradient id="sil-fill" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="#141414" />
						<stop offset="100%" stop-color="#050505" />
					</linearGradient>
				</defs>
				<path
					d="M180 70c-40 0-66 30-66 74 0 30 10 56 26 72 6 6 8 14 8 22v20c-50 10-104 30-124 64-10 18-16 60-16 178h344c0-118-6-160-16-178-20-34-74-54-124-64v-20c0-8 2-16 8-22 16-16 26-42 26-72 0-44-26-74-66-74z"
					fill="url(#sil-fill)"
					stroke="#EAB66A"
					stroke-opacity="0.4"
					stroke-width="1.2"
				/>
			</svg>
		{/if}
	</div>
</div>
