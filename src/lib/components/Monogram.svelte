<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
		strokeWidth?: number;
		animate?: boolean;
		accentColor?: string;
	}
	let { size = 32, class: klass = '', strokeWidth = 2.2, animate = false, accentColor = '#EAB66A' }: Props = $props();
</script>

<!-- Geometric JC monogram: J stem + hook interlocked with an open C arc. -->
<svg
	width={size}
	height={size}
	viewBox="0 0 64 64"
	fill="none"
	class={klass}
	aria-hidden="true"
>
	<path
		class={animate ? 'mono-draw' : ''}
		d="M28 12 V38 A10 10 0 0 1 8 38"
		stroke="currentColor"
		stroke-width={strokeWidth}
		stroke-linecap="round"
		pathLength="1"
	/>
	<path
		class={animate ? 'mono-draw mono-draw-late' : ''}
		d="M56 20 A17 17 0 1 0 56 44"
		stroke={accentColor}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		pathLength="1"
	/>
	<circle cx="56" cy="20" r={strokeWidth * 0.9} fill={accentColor} />
</svg>

<style>
	.mono-draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: mono-draw 0.9s cubic-bezier(0.65, 0, 0.35, 1) forwards;
	}
	.mono-draw-late {
		animation-delay: 0.15s;
	}
	@keyframes mono-draw {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
