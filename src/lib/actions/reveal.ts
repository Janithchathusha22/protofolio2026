import type { Action } from 'svelte/action';

interface RevealOptions {
	delay?: number;
	y?: number;
	duration?: number;
}

/**
 * Editorial fade-up reveal using IntersectionObserver + Web Animations API.
 * Respects prefers-reduced-motion.
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, opts = {}) => {
	const { delay = 0, y = 24, duration = 900 } = opts;
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduce) return;

	node.style.opacity = '0';

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				node
					.animate(
						[
							{ opacity: 0, transform: `translate3d(0, ${y}px, 0)` },
							{ opacity: 1, transform: 'translate3d(0, 0, 0)' }
						],
						{ duration, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
					)
					.finished.then(() => {
						node.style.opacity = '1';
					})
					.catch(() => {});
				io.disconnect();
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
	);
	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
};
